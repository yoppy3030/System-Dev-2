<?php
session_start();
require __DIR__ . '/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit();
}

$user_id = $_SESSION['user_id'];
$target_id = (int)$_POST['target_id'];
$target_type = $_POST['target_type'];
$is_like = (int)$_POST['is_like'];

// Vérifier si l'utilisateur a déjà voté
$stmt = $pdo->prepare("SELECT * FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?");
$stmt->execute([$user_id, $target_id, $target_type]);
$existing = $stmt->fetch();

if ($existing) {
    // Modifier le vote existant
    $stmt = $pdo->prepare("UPDATE likes SET is_like = ? WHERE id = ?");
    $stmt->execute([$is_like, $existing['id']]);
} else {
    // Nouveau vote
    $stmt = $pdo->prepare("INSERT INTO likes (user_id, target_id, target_type, is_like) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user_id, $target_id, $target_type, $is_like]);
}

// Compter le nombre total
$stmt = $pdo->prepare("SELECT SUM(is_like = 1) AS likes, SUM(is_like = 0) AS dislikes FROM likes WHERE target_id = ? AND target_type = ?");
$stmt->execute([$target_id, $target_type]);
$result = $stmt->fetch();

echo json_encode($result);
exit();
?>
