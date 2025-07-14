<?php
session_start();
require __DIR__ . '/config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit();
}

$user_id = $_SESSION['user_id'];
$post_id = $_POST['post_id'] ?? null;
$is_like = $_POST['is_like'] ?? null;

if (!$post_id || !in_array($is_like, ['1', '0'], true)) {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit();
}

try {
    // Check if the user has already reacted
    $stmt = $pdo->prepare("SELECT * FROM likes WHERE user_id = ? AND target_id = ? AND target_type = 'post'");
    $stmt->execute([$user_id, $post_id]);
    $existing = $stmt->fetch();

    if ($existing) {
        if ($existing['is_like'] != $is_like) {
            $stmt = $pdo->prepare("UPDATE likes SET is_like = ? WHERE id = ?");
            $stmt->execute([$is_like, $existing['id']]);
        } else {
            $stmt = $pdo->prepare("DELETE FROM likes WHERE id = ?");
            $stmt->execute([$existing['id']]);
        }
    } else {
        $stmt = $pdo->prepare("INSERT INTO likes (user_id, target_id, target_type, is_like) VALUES (?, ?, 'post', ?)");
        $stmt->execute([$user_id, $post_id, $is_like]);
    }

    $stmt = $pdo->prepare("SELECT 
        SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes_count,
        SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes_count
        FROM likes WHERE target_id = ? AND target_type = 'post'");
    $stmt->execute([$post_id]);
    $counts = $stmt->fetch();

    echo json_encode([
        'success' => true,
        'likes_count' => $counts['likes_count'] ?? 0,
        'dislikes_count' => $counts['dislikes_count'] ?? 0
    ]);
} catch (PDOException $e) {
    error_log("Like handler error: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'DB error']);
}
