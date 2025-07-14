<?php
// chat_api.php (新規作成)
// このファイルは chatBOT フォルダ内に配置してください。

// どんなエラーが発生しても、必ずJSON形式で応答を返すためのカスタムエラーハンドラを設定
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0); // 本番環境では0に設定
error_reporting(E_ALL);

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (ob_get_length()) ob_clean();
        http_response_code(500);
        echo json_encode([
            'error' => 'サーバーで致命的なエラーが発生しました。',
            'debug_info' => $error['message'] // デバッグ時のみ有効にする
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
    // データベース設定ファイルを読み込む (パスをプロジェクトのルートから解決)
    // chat_api.phpはchatBOTフォルダ内にあるため、一つ上の階層のbackendフォルダを参照
    require_once dirname(__DIR__) . '/backend/config.php';

    // ログイン状態を確認
    if (!isset($_SESSION['user_id'])) {
        throw new Exception('User not logged in.', 401);
    }

    $userId = $_SESSION['user_id'];
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? '';

    if ($method === 'GET') {
        handleGetRequest($pdo, $userId, $action);
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON data provided.', 400);
        }
        handlePostRequest($pdo, $userId, $action, $data);
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
 * GETリクエストを処理する
 */
function handleGetRequest($pdo, $userId, $action) {
    $response = [];
    switch ($action) {
        case 'get_all_chat_data':
            // チャット履歴
            $stmt = $pdo->prepare("SELECT history_html FROM ChatHistories WHERE user_id = ?");
            $stmt->execute([$userId]);
            $response['history'] = $stmt->fetchColumn() ?: '';
            // お気に入り
            $stmt = $pdo->prepare("SELECT message_id, message_text FROM PinnedMessages WHERE user_id = ?");
            $stmt->execute([$userId]);
            $response['pinned_messages'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            break;
        case 'get_my_page_data':
            // クイズ成績
            $stmt = $pdo->prepare("SELECT difficulty, score, total, created_at FROM QuizResults WHERE user_id = ? ORDER BY created_at DESC");
            $stmt->execute([$userId]);
            $response['quiz_history'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // 学習済みトピック
            $stmt = $pdo->prepare("SELECT topic_type, topic_key, summary, created_at FROM LearnedTopics WHERE user_id = ? ORDER BY created_at DESC");
            $stmt->execute([$userId]);
            $response['learned_topics'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            // 間違いノート
            $stmt = $pdo->prepare("SELECT id, difficulty, question, options, correct_answer_index, explanation FROM MistakeNotes WHERE user_id = ? ORDER BY created_at DESC");
            $stmt->execute([$userId]);
            $response['mistakes'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
             // アチーブメント
            $stmt = $pdo->prepare("SELECT achievement_key FROM UserAchievements WHERE user_id = ?");
            $stmt->execute([$userId]);
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
function handlePostRequest($pdo, $userId, $action, $data) {
    $response = ['success' => false, 'message' => ''];
    $pdo->beginTransaction();
    try {
        switch ($action) {
            case 'save_history':
                $stmt = $pdo->prepare("INSERT INTO ChatHistories (user_id, history_html) VALUES (?, ?) ON DUPLICATE KEY UPDATE history_html = VALUES(history_html)");
                $stmt->execute([$userId, $data['history_html'] ?? '']);
                break;
            case 'clear_history':
                $stmt = $pdo->prepare("UPDATE ChatHistories SET history_html = '' WHERE user_id = ?");
                $stmt->execute([$userId]);
                break;
            case 'save_pinned_messages':
                // 既存のピンを削除
                $stmt = $pdo->prepare("DELETE FROM PinnedMessages WHERE user_id = ?");
                $stmt->execute([$userId]);
                // 新しいピンを挿入
                if (!empty($data['pinned_messages'])) {
                    $stmt = $pdo->prepare("INSERT INTO PinnedMessages (user_id, message_id, message_text) VALUES (?, ?, ?)");
                    foreach ($data['pinned_messages'] as $msg) {
                        $stmt->execute([$userId, $msg['message_id'], $msg['message_text']]);
                    }
                }
                break;
            case 'save_quiz_result':
                $stmt = $pdo->prepare("INSERT INTO QuizResults (user_id, difficulty, score, total) VALUES (?, ?, ?, ?)");
                $stmt->execute([$userId, $data['difficulty'], $data['score'], $data['total']]);
                break;
            case 'save_learned_topic':
                 $stmt = $pdo->prepare("INSERT INTO LearnedTopics (user_id, topic_type, topic_key, summary) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE summary = VALUES(summary), created_at = CURRENT_TIMESTAMP");
                 $stmt->execute([$userId, $data['type'], $data['id'] ?? $data['question'], $data['summary'] ?? null]);
                break;
            case 'save_mistake':
                $questionJson = json_encode($data['question']);
                $questionHash = hash('sha256', $questionJson . $data['difficulty']);
                
                $stmt = $pdo->prepare("INSERT INTO MistakeNotes (user_id, difficulty, question, options, correct_answer_index, explanation, question_hash) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE created_at = CURRENT_TIMESTAMP");
                $stmt->execute([
                    $userId, 
                    $data['difficulty'], 
                    $questionJson, 
                    json_encode($data['options']), 
                    $data['correct'], 
                    json_encode($data['explanation']),
                    $questionHash
                ]);
                break;
            case 'delete_mistake':
                $stmt = $pdo->prepare("DELETE FROM MistakeNotes WHERE id = ? AND user_id = ?");
                $stmt->execute([$data['id'], $userId]);
                break;
            case 'delete_learned_topic':
                 $stmt = $pdo->prepare("DELETE FROM LearnedTopics WHERE user_id = ? AND topic_key = ?");
                 $stmt->execute([$userId, $data['topic_key']]);
                break;
            case 'reset_all_data':
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
        throw $e; // 再スローして中央のエラーハンドリングに任せる
    }
    echo json_encode($response);
}
