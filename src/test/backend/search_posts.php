<?php
// エラー表示を有効にする（デバッグ用）
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start(); // セッションを開始します
require __DIR__ . '/config.php'; 

header('Content-Type: application/json'); //JSONレスポンスを返すためのヘッダーを設定します

$search_query = $_GET['search'] ?? '';
$posts = [];
$response = ['success' => false, 'message' => '', 'posts' => []]; // 初期化レスポンス配列

try {
    $sql_base = "
        SELECT 
            p.*, 
            u.username, 
            u.avatar,
            (SELECT COUNT(*) FROM likes WHERE target_id = p.id AND target_type = 'post' AND is_like = 1) AS likes_count,
            (SELECT COUNT(*) FROM likes WHERE target_id = p.id AND target_type = 'post' AND is_like = 0) AS dislikes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
        FROM 
            posts p 
        JOIN 
            users u ON p.user_id = u.id
    ";
    
    $conditions = [];
    $params = [];

    if (!empty($search_query)) {
        $words = explode(' ', $search_query);
        $wordConditions = [];
        foreach ($words as $word) {
            $word = trim($word);
            if ($word !== '') {
                $wordConditions[] = "(p.content LIKE ? OR p.title LIKE ? OR u.username LIKE ?)";
                $params[] = '%' . $word . '%';
                $params[] = '%' . $word . '%';
                $params[] = '%' . $word . '%';
            }
        }
        if (!empty($wordConditions)) {
            $conditions[] = "(" . implode(" AND ", $wordConditions) . ")"; // 全てのキーワードが含まれる投稿を取得するためにANDで結合
        }
    }

    $sql = $sql_base;
    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(" AND ", $conditions); // 必要に応じて追加の条件を追加します
    }

    $sql .= " ORDER BY p.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $response['success'] = true;
    $response['posts'] = $posts;

} catch (PDOException $e) {
    // データベースエラーをキャッチしてログに記録します
    $response['success'] = false;
    error_log("Database error in search_posts.php: " . $e->getMessage());
    http_response_code(500); // HTTPステータスを500に設定してサーバーエラーを示します
    $response['message'] = "データベースエラーが発生しました。後で再試行してください。"; // ユーザー向けの一般的なメッセージ
    // デバッグ用に $e->getMessage() を含めることができます: $response['message'] = "Database error: " . $e->getMessage();
} catch (Exception $e) {
    // Gérer d'autres exceptions non PDO
    error_log("General error in search_posts.php: " . $e->getMessage());
    http_response_code(500);
    $response['message'] = "予期しないエラーが発生しました。後で再試行してください。";
}

echo json_encode($response);
exit(); // スクリプトの実行を停止し、JSONレスポンスを送信した後
?>