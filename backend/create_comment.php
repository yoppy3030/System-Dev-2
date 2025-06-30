<?php
session_start();
require __DIR__ . '/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$post_id = $data['post_id'] ?? null;
$content = trim($data['content'] ?? '');
$parent_comment_id = $data['parent_comment_id'] ?? null;
$user_id = $_SESSION['user_id'];

if (!$post_id || !$content) {
    http_response_code(400);
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}

if ($parent_comment_id !== null) {
    $parent_comment_id = (int)$parent_comment_id;
} else {
    $parent_comment_id = null;
}

$stmt = $pdo->prepare("INSERT INTO comments (post_id, user_id, content, parent_comment_id) VALUES (?, ?, ?, ?)");
$stmt->execute([$post_id, $user_id, $content, $parent_comment_id]);

echo json_encode(['success' => 'Commentaire ajouté']);
