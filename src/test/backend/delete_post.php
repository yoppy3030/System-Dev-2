<?php
session_start();
require __DIR__ . '/config.php';

header('Content-Type: application/json');

$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['error' => 'Not authenticated']);
    exit();
}

$post_id = $_POST['post_id'] ?? null;

if (!$post_id) {
    echo json_encode(['error' => 'Missing post ID']);
    exit();
}

try {
    // Vérifie si l'utilisateur est bien le propriétaire du post
    $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ? AND user_id = ?");
    $stmt->execute([$post_id, $user_id]);
    $post = $stmt->fetch();

    if (!$post) {
        echo json_encode(['error' => 'Post not found or not authorized']);
        exit();
    }

    // Supprime les commentaires liés
    $stmt = $pdo->prepare("DELETE FROM comments WHERE post_id = ?");
    $stmt->execute([$post_id]);

    // Supprime les likes liés
    $stmt = $pdo->prepare("DELETE FROM likes WHERE target_id = ? AND target_type = 'post'");
    $stmt->execute([$post_id]);

    // Supprime le post lui-même
    $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
    $stmt->execute([$post_id]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error: ' . $e->getMessage()]);
}
