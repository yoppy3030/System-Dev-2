<?php
// chat_api.php (データベース連携・ゲスト対応版)

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

try {
    // データベース設定ファイルを読み込む
    require_once dirname(__DIR__) . '/config.php';

    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';
    $data = json_decode(file_get_contents('php://input'), true);

    // ユーザーまたはゲストを識別
    $userId = $_SESSION['user_id'] ?? null;
    $guestId = $data['guest_session_id'] ?? $_GET['guest_session_id'] ?? null;

    // ユーザーIDもゲストIDもなければ、セッション情報取得アクション以外はエラー
    if (!$userId && !$guestId && $action !== 'get_session_info') {
        throw new Exception('User not identified.', 401);
    }
    
    // リクエストに応じて処理を分岐
    if ($method === 'GET') {
        handleGetRequest($pdo, $userId, $guestId, $action);
    } elseif ($method === 'POST') {
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON data provided.', 400);
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

/**
 * ユーザーまたはゲストを識別するためのWHERE句とパラメータを生成する
 * @param int|null $userId
 * @param string|null $guestId
 * @return array ['where_clause' => string, 'params' => array]
 */
function getUserClause($userId, $guestId) {
    if ($userId) {
        return ['where_clause' => 'user_id = ?', 'params' => [$userId]];
    }
    if ($guestId) {
        return ['where_clause' => 'guest_session_id = ?', 'params' => [$guestId]];
    }
    throw new Exception('Identifier not found.');
}

/**
 * GETリクエストを処理する
 */
function handleGetRequest($pdo, $userId, $guestId, $action) {
    $response = [];
    switch ($action) {
        case 'get_session_info':
            if ($userId) {
                $response = ['status' => 'logged_in', 'user_id' => $userId];
            } else {
                // 新しいゲストセッションIDを生成して返す
                $response = ['status' => 'guest', 'guest_session_id' => bin2hex(random_bytes(16))];
            }
            break;
        case 'get_all_chat_data':
            $clause = getUserClause($userId, $guestId);
            // チャット履歴
            $stmt = $pdo->prepare("SELECT history_html FROM ChatHistories WHERE {$clause['where_clause']}");
            $stmt->execute($clause['params']);
            $response['history'] = $stmt->fetchColumn() ?: '';
            // お気に入り
            $stmt = $pdo->prepare("SELECT message_id, message_text FROM PinnedMessages WHERE {$clause['where_clause']}");
            $stmt->execute($clause['params']);
            $response['pinned_messages'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;
        case 'get_my_page_data':
            if (!$userId) throw new Exception('Login required for My Page.', 403);
            $clause = getUserClause($userId, null);
            // クイズ成績、学習トピックなどを一括で取得
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

/**
 * POSTリクエストを処理する
 */
function handlePostRequest($pdo, $userId, $guestId, $action, $data) {
    $response = ['success' => false, 'message' => ''];
    $pdo->beginTransaction();
    try {
        $clause = getUserClause($userId, $guestId);
        $idField = $userId ? 'user_id' : 'guest_session_id';
        $idValue = $userId ?: $guestId;

        switch ($action) {
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
                        $stmt->execute([$idValue, $msg['id'], $msg['text']]);
                    }
                }
                break;
            case 'save_quiz_result':
                $stmt = $pdo->prepare("INSERT INTO QuizResults ({$idField}, difficulty, score, total) VALUES (?, ?, ?, ?)");
                $stmt->execute([$idValue, $data['difficulty'], $data['score'], $data['total']]);
                break;
            case 'save_learned_topic':
                 $stmt = $pdo->prepare("INSERT INTO LearnedTopics ({$idField}, topic_type, topic_key, summary, created_at) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE summary = VALUES(summary), created_at = VALUES(created_at)");
                 $stmt->execute([$idValue, $data['type'], $data['id'] ?? $data['question'], $data['summary'] ?? null, date('Y-m-d H:i:s')]);
                break;
            case 'save_mistake':
                $questionJson = json_encode($data['question']);
                $questionHash = hash('sha256', $questionJson . $data['difficulty']);
                $stmt = $pdo->prepare("INSERT INTO MistakeNotes ({$idField}, difficulty, question, options, correct_answer_index, explanation, question_hash) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP");
                $stmt->execute([$idValue, $data['difficulty'], $questionJson, json_encode($data['options']), $data['correct'], json_encode($data['explanation']), $questionHash]);
                break;
            case 'delete_mistake':
                if(!$userId) throw new Exception('Login required to delete mistakes permanently.', 403);
                $stmt = $pdo->prepare("DELETE FROM MistakeNotes WHERE id = ? AND user_id = ?");
                $stmt->execute([$data['id'], $userId]);
                break;
            case 'delete_learned_topic':
                if(!$userId) throw new Exception('Login required to delete topics permanently.', 403);
                 $stmt = $pdo->prepare("DELETE FROM LearnedTopics WHERE user_id = ? AND topic_key = ?");
                 $stmt->execute([$userId, $data['topic_key']]);
                break;
            case 'reset_all_data':
                if(!$userId) throw new Exception('Login required to reset data.', 403);
                 $tables = ['QuizResults', 'LearnedTopics', 'MistakeNotes', 'UserAchievements', 'PinnedMessages', 'ChatHistories'];
                 foreach($tables as $table) {
                    $stmt = $pdo->prepare("DELETE FROM {$table} WHERE user_id = ?");
                    $stmt->execute([$userId]);
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
