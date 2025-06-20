<?php
session_start();
require __DIR__ . '/config.php';

// Vérifier que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit();
}

// Vérifier que les données POST attendues sont présentes
if (!isset($_POST['post_id'], $_POST['content']) || empty(trim($_POST['content']))) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing or empty fields']);
    exit();
}

$user_id = $_SESSION['user_id'];
$post_id = (int) $_POST['post_id'];
$content = trim($_POST['content']);
$parent_comment_id = isset($_POST['parent_comment_id']) && $_POST['parent_comment_id'] !== '' 
    ? (int) $_POST['parent_comment_id'] 
    : null;

// Insertion dans la base de données
$stmt = $pdo->prepare("INSERT INTO comments (post_id, user_id, content, parent_comment_id) VALUES (?, ?, ?, ?)");
$success = $stmt->execute([$post_id, $user_id, $content, $parent_comment_id]);

if ($success) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error']);
}
exit();
?>
