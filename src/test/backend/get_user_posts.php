<?php
session_start();
require __DIR__ . '/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$user_id = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
if (!$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'ID utilisateur manquant']);
    exit;
}

$stmt = $pdo->prepare("
    SELECT posts.*, users.username, users.avatar 
    FROM posts
    JOIN users ON posts.user_id = users.id
    WHERE posts.user_id = ?
    ORDER BY posts.created_at DESC
");
$stmt->execute([$user_id]);
$posts = $stmt->fetchAll();

echo json_encode($posts);
?>