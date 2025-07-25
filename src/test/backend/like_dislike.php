<?php
session_start();
require __DIR__ . '/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    exit();
}

//必要なメソッドチェック
if (!isset($_POST['target_id'], $_POST['target_type'], $_POST['is_like'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing parameters.']);
    exit();
}

$user_id = $_SESSION['user_id'];
$target_id = (int)$_POST['target_id'];
$target_type = $_POST['target_type'];
$is_like = (int)$_POST['is_like'];

try {
    // like/dislikeの値を検証
    if (!in_array($is_like, [0, 1])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid like/dislike value.']);
        exit();
    }
    $stmt = $pdo->prepare("SELECT * FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?");
    $stmt->execute([$user_id, $target_id, $target_type]);
    $existing = $stmt->fetch();

    if ($existing) {
        $stmt = $pdo->prepare("UPDATE likes SET is_like = ? WHERE id = ?");
        $stmt->execute([$is_like, $existing['id']]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO likes (user_id, target_id, target_type, is_like) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user_id, $target_id, $target_type, $is_like]);
    }

    $stmt = $pdo->prepare("SELECT SUM(is_like = 1) AS likes, SUM(is_like = 0) AS dislikes FROM likes WHERE target_id = ? AND target_type = ?");
    $stmt->execute([$target_id, $target_type]);
    $result = $stmt->fetch();

    echo json_encode($result);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
exit();
?>