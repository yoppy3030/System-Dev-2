<?php
session_start();
require __DIR__ . '/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

// 投稿を取得する
$stmt = $pdo->query("
    SELECT posts.*, users.username, users.avatar,
    (SELECT COUNT(*) FROM likes WHERE target_type='post' AND target_id = posts.id AND is_like=1) AS likes,
    (SELECT COUNT(*) FROM likes WHERE target_type='post' AND target_id = posts.id AND is_like=0) AS dislikes
    FROM posts
    JOIN users ON posts.user_id = users.id
    ORDER BY posts.created_at DESC
");

$posts = $stmt->fetchAll();

echo json_encode($posts);
?>
