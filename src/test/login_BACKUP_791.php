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
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - JAPAN Life Manual</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="form-container">
        <h1>Login</h1>
        <form action="login_process.php" method="post">
            <label>Email:<input type="email" name="email" required></label>
            <label>Password:<input type="password" name="password" required></label>
            <button type="submit">Login</button>
        </form>
        <p><a href="#">Forget password</a></p>
        <p>Don't have an account? <a href="register.php">Register here</a></p>
    </div>
</body>
</html>
