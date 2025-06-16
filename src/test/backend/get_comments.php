<?php
session_start();
require __DIR__ . '/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$post_id = isset($_GET['post_id']) ? (int)$_GET['post_id'] : 0;
if (!$post_id) {
    http_response_code(400);
    echo json_encode(['error' => 'ID post manquant']);
    exit;
}

// Récupérer les commentaires (y compris parent_comment_id) avec infos user
$stmt = $pdo->prepare("
    SELECT comments.*, users.username, users.avatar
    FROM comments
    JOIN users ON comments.user_id = users.id
    WHERE comments.post_id = ?
    ORDER BY comments.created_at ASC
");
$stmt->execute([$post_id]);
$comments = $stmt->fetchAll();

echo json_encode($comments);
