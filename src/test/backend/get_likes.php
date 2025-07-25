<?php
require __DIR__ . '/config.php';

$target_id = (int)$_GET['target_id'];

// Validate target_id
if (!isset($_GET['target_id']) || !is_numeric($_GET['target_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid target ID']);
    exit();
}

$target_id = (int)$_GET['target_id'];
if ($target_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid target ID']);
    exit();
}

if (!isset($_GET['target_type']) || !in_array($_GET['target_type'], ['post', 'comment'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid target type']);
    exit();
}
$target_type = $_GET['target_type'];

$stmt = $pdo->prepare("SELECT SUM(is_like = 1) AS likes, SUM(is_like = 0) AS dislikes FROM likes WHERE target_id = ? AND target_type = ?");
$stmt->execute([$target_id, $target_type]);
$result = $stmt->fetch();

echo json_encode($result);
exit();
?>
