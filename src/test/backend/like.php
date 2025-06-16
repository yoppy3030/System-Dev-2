<?php
session_start();
require __DIR__ . 'config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data || !isset($data['target_id'], $data['target_type'], $data['is_like'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}

$userId = $_SESSION['user_id'];
$targetId = (int)$data['target_id'];
$targetType = $data['target_type'] === 'post' ? 'post' : 'comment';
$isLike = (int)$data['is_like'] === 1 ? 1 : 0;

// Vérifier si l'utilisateur a déjà liké/disliké ce post/commentaire
$stmt = $pdo->prepare("SELECT id FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?");
$stmt->execute([$userId, $targetId, $targetType]);
$existing = $stmt->fetch();

if ($existing) {
    // Met à jour le like/dislike
    $stmt = $pdo->prepare("UPDATE likes SET is_like = ?, created_at = NOW() WHERE id = ?");
    $stmt->execute([$isLike, $existing['id']]);
} else {
    // Insert nouveau like/dislike
    $stmt = $pdo->prepare("INSERT INTO likes (user_id, target_id, target_type, is_like) VALUES (?, ?, ?, ?)");
    $stmt->execute([$userId, $targetId, $targetType, $isLike]);
}

echo json_encode(['success' => 'Action enregistrée']);
