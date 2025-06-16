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
$user_id = $_SESSION['user_id'];
$target_id = $data['target_id'] ?? null;
$target_type = $data['target_type'] ?? null; // 'post' ou 'comment'
$is_like = isset($data['is_like']) ? (int)$data['is_like'] : null;

if (!$target_id || !in_array($target_type, ['post', 'comment']) || !in_array($is_like, [0,1])) {
    http_response_code(400);
    echo json_encode(['error' => 'Données invalides']);
    exit;
}

// Vérifier si déjà un like/dislike
$stmt = $pdo->prepare("SELECT id, is_like FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?");
$stmt->execute([$user_id, $target_id, $target_type]);
$existing = $stmt->fetch();

if ($existing) {
    if ($existing['is_like'] == $is_like) {
        // Suppression du like/dislike (toggle off)
        $stmt = $pdo->prepare("DELETE FROM likes WHERE id = ?");
        $stmt->execute([$existing['id']]);
    } else {
        // Mise à jour
        $stmt = $pdo->prepare("UPDATE likes SET is_like = ?, created_at = NOW() WHERE id = ?");
        $stmt->execute([$is_like, $existing['id']]);
    }
} else {
    // Insertion
    $stmt = $pdo->prepare("INSERT INTO likes (user_id, target_id, target_type, is_like) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user_id, $target_id, $target_type, $is_like]);
}

// Compter likes et dislikes
$stmt = $pdo->prepare("SELECT 
    SUM(is_like=1) AS likes, 
    SUM(is_like=0) AS dislikes 
    FROM likes WHERE target_id = ? AND target_type = ?");
$stmt->execute([$target_id, $target_type]);
$counts = $stmt->fetch();

echo json_encode([
    'likes' => (int)$counts['likes'], 
    'dislikes' => (int)$counts['dislikes']
]);
