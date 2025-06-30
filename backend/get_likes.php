<?php
require __DIR__ . '/config.php';

$target_id = (int)$_GET['target_id'];
$target_type = $_GET['target_type'];

$stmt = $pdo->prepare("SELECT SUM(is_like = 1) AS likes, SUM(is_like = 0) AS dislikes FROM likes WHERE target_id = ? AND target_type = ?");
$stmt->execute([$target_id, $target_type]);
$result = $stmt->fetch();

echo json_encode($result);
exit();
?>
