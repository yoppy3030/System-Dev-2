<?php
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // ユーザー名とパスワードを取得
    $username = $_POST['username'];
    $password = $_POST['password'];

    // データベース接続
    include 'db.php'; // db.phpでデータベース接続を行う

    // ユーザー認証のロジック
    // ここでは簡単な例として、固定のユーザー名とパスワードを使用
    if ($username === 'test' && $password === 'password') {
        $_SESSION['user'] = $username;
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
}
?>
