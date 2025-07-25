<?php
session_start();
require __DIR__ . '/config.php';

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $content = trim($_POST['content']);
    $userId = $_SESSION['user_id'];

    $imagePath = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = '../uploads/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        $filename = uniqid() . '-' . basename($_FILES['image']['name']);
        $targetFile = $uploadDir . $filename;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
            $imagePath = './uploads/' . $filename; // フロントエンドでアクセス可能なパス
        } else {
            http_response_code(500);
            echo json_encode(['error' => '画像のアップロードエラー']);
            exit;
        }
    }

    $stmt = $pdo->prepare("INSERT INTO posts (user_id, content, image) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $content, $imagePath]);

    echo json_encode(['success' => 'post created successfully', 'post_id' => $pdo->lastInsertId()]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'MMethod not allowed']);
}
?>
