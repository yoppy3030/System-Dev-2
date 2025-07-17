<?php
// chat_api.php (データベース連携・ゲスト対応・セキュリティ強化版)

// エラーハンドリングとヘッダー設定
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(E_ALL);

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (ob_get_length()) ob_clean();
        http_response_code(500);
        echo json_encode([
            'error' => 'サーバーで致命的なエラーが発生しました。',
            'debug_info' => $error['message']
        ]);
        ob_end_flush();
    }
});

ob_start();

// セッションを開始
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// ▼▼▼【セキュリティ修正】CSRFトークンがなければ生成 ▼▼▼
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

try {
    // データベース設定ファイルを読み込む
    require_once dirname(__DIR__) . '/backend/config.php';

    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';
    $data = json_decode(file_get_contents('php://input'), true);

    // ユーザーまたはゲストを識別
    $userId = $_SESSION['user_id'] ?? null;
    $guestId = $data['guest_session_id'] ?? $_GET['guest_session_id'] ?? session_id();

    if (!$userId && !$guestId && !in_array($action, ['get_session_info'])) {
        throw new Exception('User not identified.', 401);
    }
    
    // リクエストに応じて処理を分岐
    if ($method === 'GET') {
        handleGetRequest($pdo, $userId, $guestId, $action);
    } elseif ($method === 'POST') {
        if (json_last_error() !== JSON_ERROR_NONE && $action !== 'send_inquiry') {
            throw new Exception('Invalid JSON data provided.', 400);
        }
        // ▼▼▼【セキュリティ修正】POSTリクエストのCSRFトークンを検証 ▼▼▼
        if (!isset($data['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $data['csrf_token'])) {
            http_response_code(403);
            echo json_encode(['error' => 'Invalid CSRF token.']);
            exit;
        }
        handlePostRequest($pdo, $userId, $guestId, $action, $data);
    } else {
        throw new Exception('Invalid request method.', 405);
    }

} catch (Exception $e) {
    if (ob_get_length()) ob_clean();
    $code = $e->getCode() >= 400 ? $e->getCode() : 500;
    http_response_code($code);
    echo json_encode(['error' => $e->getMessage()]);
}

ob_end_flush();

function getUserClause($userId, $guestId) {
    if ($userId) {
        return ['where_clause' => 'user_id = ?', 'params' => [$userId]];
    }
    if ($guestId) {
        return ['where_clause' => 'guest_session_id = ?', 'params' => [$guestId]];
    }
    throw new Exception('Identifier not found.');
}

function handleGetRequest($pdo, $userId, $guestId, $action) {
    $response = [];
    switch ($action) {
        case 'get_session_info':
            if ($userId) {
                $response = ['status' => 'logged_in', 'user_id' => $userId];
            } else {
                $response = ['status' => 'guest', 'guest_session_id' => session_id()];
            }
            // ▼▼▼【セキュリティ修正】セッション情報にCSRFトークンを含める ▼▼▼
            $response['csrf_token'] = $_SESSION['csrf_token'];
            break;
        case 'get_all_chat_data':
            $clause = getUserClause($userId, $guestId);
            $stmt = $pdo->prepare("SELECT history_html FROM ChatHistories WHERE {$clause['where_clause']}");
            $stmt->execute($clause['params']);
            $response['history'] = $stmt->fetchColumn() ?: '';
            
            $stmt = $pdo->prepare("SELECT message_id, message_text FROM PinnedMessages WHERE {$clause['where_clause']}");
            $stmt->execute($clause['params']);
            $response['pinned_messages'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;
        case 'get_my_page_data':
            if (!$userId) throw new Exception('Login required for My Page.', 403);
            $clause = getUserClause($userId, null);
            
            $stmt = $pdo->prepare("SELECT difficulty, score, total, created_at FROM QuizResults WHERE {$clause['where_clause']} ORDER BY created_at DESC");
            $stmt->execute($clause['params']);
            $response['quiz_history'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $stmt = $pdo->prepare("SELECT topic_type, topic_key, summary, created_at FROM LearnedTopics WHERE {$clause['where_clause']} ORDER BY created_at DESC");
            $stmt->execute($clause['params']);
            $response['learned_topics'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $stmt = $pdo->prepare("SELECT id, difficulty, question, options, correct_answer_index, explanation FROM MistakeNotes WHERE {$clause['where_clause']} ORDER BY created_at DESC");
            $stmt->execute($clause['params']);
            $response['mistakes'] = array_map(function($row) {
                $row['question'] = json_decode($row['question'], true);
                $row['options'] = json_decode($row['options'], true);
                $row['explanation'] = json_decode($row['explanation'], true);
                return $row;
            }, $stmt->fetchAll(PDO::FETCH_ASSOC));

            $stmt = $pdo->prepare("SELECT achievement_key FROM UserAchievements WHERE {$clause['where_clause']}");
            $stmt->execute($clause['params']);
            $response['achievements'] = $stmt->fetchAll(PDO::FETCH_COLUMN);
            break;
        default:
            throw new Exception("Invalid GET action: {$action}", 400);
    }
    echo json_encode($response);
}

function handlePostRequest($pdo, $userId, $guestId, $action, $data) {
    $response = ['success' => false, 'message' => ''];
    $pdo->beginTransaction();
    try {
        $clause = getUserClause($userId, $guestId);
        $idField = $userId ? 'user_id' : 'guest_session_id';
        $idValue = $userId ?: $guestId;

        switch ($action) {
            case 'migrate_guest_data':
                if (!$userId || !isset($data['guest_session_id'])) throw new Exception('User and guest must be identified for migration.', 400);
                $guestIdToMigrate = $data['guest_session_id'];
                
                $userHistoryExists = $pdo->prepare("SELECT COUNT(*) FROM ChatHistories WHERE user_id = ?");
                $userHistoryExists->execute([$userId]);
                if ($userHistoryExists->fetchColumn() > 0) {
                    $pdo->prepare("DELETE FROM ChatHistories WHERE guest_session_id = ?")->execute([$guestIdToMigrate]);
                } else {
                    $pdo->prepare("UPDATE ChatHistories SET user_id = ?, guest_session_id = NULL WHERE guest_session_id = ?")->execute([$userId, $guestIdToMigrate]);
                }

                migrateUniqueData($pdo, 'PinnedMessages', 'message_id', $userId, $guestIdToMigrate);
                migrateUniqueData($pdo, 'LearnedTopics', 'topic_key', $userId, $guestIdToMigrate);
                migrateUniqueData($pdo, 'MistakeNotes', 'question_hash', $userId, $guestIdToMigrate);

                $pdo->prepare("UPDATE QuizResults SET user_id = ?, guest_session_id = NULL WHERE guest_session_id = ?")->execute([$userId, $guestIdToMigrate]);
                break;

            case 'clear_history':
                $tablesToClear = ['ChatHistories', 'PinnedMessages'];
                foreach ($tablesToClear as $table) {
                    $stmt = $pdo->prepare("DELETE FROM {$table} WHERE {$clause['where_clause']}");
                    $stmt->execute($clause['params']);
                }
                break;
            case 'save_history':
                $stmt = $pdo->prepare("INSERT INTO ChatHistories ({$idField}, history_html) VALUES (?, ?) ON DUPLICATE KEY UPDATE history_html = VALUES(history_html)");
                $stmt->execute([$idValue, $data['history_html'] ?? '']);
                break;
            case 'save_pinned_messages':
                $stmt = $pdo->prepare("DELETE FROM PinnedMessages WHERE {$clause['where_clause']}");
                $stmt->execute($clause['params']);
                if (!empty($data['pinned_messages'])) {
                    $stmt = $pdo->prepare("INSERT INTO PinnedMessages ({$idField}, message_id, message_text) VALUES (?, ?, ?)");
                    foreach ($data['pinned_messages'] as $msg) {
                        if (isset($msg['message_id']) && isset($msg['message_text'])) {
                           $stmt->execute([$idValue, $msg['message_id'], $msg['message_text']]);
                        }
                    }
                }
                break;
            case 'save_quiz_result':
                if (!$userId) break;
                $stmt = $pdo->prepare("INSERT INTO QuizResults (user_id, difficulty, score, total) VALUES (?, ?, ?, ?)");
                $stmt->execute([$userId, $data['difficulty'], $data['score'], $data['total']]);
                checkAndGrantAchievements($pdo, $userId);
                break;
            case 'save_learned_topic':
                 $topic_key = $data['id'] ?? ($data['question'] ?? null);
                 if ($topic_key === null) break;
                 $stmt = $pdo->prepare("INSERT INTO LearnedTopics ({$idField}, topic_type, topic_key, summary) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE summary = VALUES(summary), updated_at = CURRENT_TIMESTAMP");
                 $stmt->execute([$idValue, $data['type'], $topic_key, $data['summary'] ?? null]);
                 if ($userId) checkAndGrantAchievements($pdo, $userId);
                break;
            case 'save_mistake':
                $questionJson = json_encode($data['question']);
                $questionHash = hash('sha256', $questionJson . $data['difficulty']);
                $stmt = $pdo->prepare("INSERT INTO MistakeNotes ({$idField}, difficulty, question, options, correct_answer_index, explanation, question_hash) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP");
                $stmt->execute([$idValue, $data['difficulty'], $questionJson, json_encode($data['options']), $data['correct'], json_encode($data['explanation']), $questionHash]);
                break;
            case 'delete_mistake':
            case 'delete_learned_topic':
            case 'reset_all_data':
                if(!$userId) throw new Exception('Login required for this action.', 403);
                if ($action === 'delete_mistake') {
                    $stmt = $pdo->prepare("DELETE FROM MistakeNotes WHERE id = ? AND user_id = ?");
                    $stmt->execute([$data['id'], $userId]);
                } elseif ($action === 'delete_learned_topic') {
                    $stmt = $pdo->prepare("DELETE FROM LearnedTopics WHERE user_id = ? AND topic_key = ?");
                    $stmt->execute([$userId, $data['topic_key']]);
                } elseif ($action === 'reset_all_data') {
                    $tables = ['QuizResults', 'LearnedTopics', 'MistakeNotes', 'UserAchievements', 'PinnedMessages', 'ChatHistories'];
                    foreach($tables as $table) {
                       $stmt = $pdo->prepare("DELETE FROM {$table} WHERE user_id = ?");
                       $stmt->execute([$userId]);
                    }
                }
                break;
            default:
                throw new Exception("Invalid POST action: {$action}", 400);
        }
        $pdo->commit();
        $response['success'] = true;
    } catch (Exception $e) {
        $pdo->rollBack();
        throw $e;
    }
    echo json_encode($response);
}

function migrateUniqueData($pdo, $tableName, $uniqueColumn, $userId, $guestId) {
    $guestStmt = $pdo->prepare("SELECT * FROM {$tableName} WHERE guest_session_id = ?");
    $guestStmt->execute([$guestId]);
    $guestData = $guestStmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($guestData)) return;

    $userKeysStmt = $pdo->prepare("SELECT {$uniqueColumn} FROM {$tableName} WHERE user_id = ?");
    $userKeysStmt->execute([$userId]);
    $userKeys = $userKeysStmt->fetchAll(PDO::FETCH_COLUMN);
    $userKeysSet = array_flip($userKeys);

    foreach ($guestData as $guestRow) {
        if (!isset($userKeysSet[$guestRow[$uniqueColumn]])) {
            $guestRow['user_id'] = $userId;
            $guestRow['guest_session_id'] = null;
            $columns = array_keys($guestRow);
            unset($columns[array_search('id', $columns)]);
            $colsStr = implode(', ', $columns);
            $placeholders = implode(', ', array_fill(0, count($columns), '?'));
            $insertStmt = $pdo->prepare("INSERT INTO {$tableName} ({$colsStr}) VALUES ({$placeholders})");
            
            $values = [];
            foreach($columns as $col) {
                $values[] = $guestRow[$col];
            }
            $insertStmt->execute($values);
        }
    }
    $deleteStmt = $pdo->prepare("DELETE FROM {$tableName} WHERE guest_session_id = ?");
    $deleteStmt->execute([$guestId]);
}


function checkAndGrantAchievements($pdo, $userId) {
    $achievements = [
        'first_quiz' => function($pdo, $userId) {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM QuizResults WHERE user_id = ?");
            $stmt->execute([$userId]);
            return $stmt->fetchColumn() > 0;
        },
        'topic_collector' => function($pdo, $userId) {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM LearnedTopics WHERE user_id = ?");
            $stmt->execute([$userId]);
            return $stmt->fetchColumn() >= 10;
        },
        'quiz_master_easy' => function($pdo, $userId) {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM QuizResults WHERE user_id = ? AND difficulty = 'easy' AND score = total AND total > 0");
            $stmt->execute([$userId]);
            return $stmt->fetchColumn() > 0;
        },
        'quiz_master_normal' => function($pdo, $userId) {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM QuizResults WHERE user_id = ? AND difficulty = 'normal' AND score = total AND total > 0");
            $stmt->execute([$userId]);
            return $stmt->fetchColumn() > 0;
        },
        'quiz_master_hard' => function($pdo, $userId) {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM QuizResults WHERE user_id = ? AND difficulty = 'hard' AND score = total AND total > 0");
            $stmt->execute([$userId]);
            return $stmt->fetchColumn() > 0;
        },
        'perfect_master' => function($pdo, $userId, $unlocked) {
            return in_array('quiz_master_easy', $unlocked) && in_array('quiz_master_normal', $unlocked) && in_array('quiz_master_hard', $unlocked);
        }
    ];

    $stmt = $pdo->prepare("SELECT achievement_key FROM UserAchievements WHERE user_id = ?");
    $stmt->execute([$userId]);
    $unlocked = $stmt->fetchAll(PDO::FETCH_COLUMN);

    foreach ($achievements as $key => $condition) {
        if (!in_array($key, $unlocked)) {
            if ($condition($pdo, $userId, $unlocked)) {
                $insertStmt = $pdo->prepare("INSERT IGNORE INTO UserAchievements (user_id, achievement_key) VALUES (?, ?)");
                $insertStmt->execute([$userId, $key]);
            }
        }
    }
}
?>
