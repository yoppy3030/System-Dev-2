<?php
session_start();

// エラー表示を有効にする（問題がなければ、コメントアウトまたは削除を推奨）
ini_set('display_errors', 1);
error_reporting(E_ALL);

// データベース設定ファイルを読み込む
require_once __DIR__ . '/backend/config.php';

$error = '';
$login_identifier = '';

// ★★★ 重要: ユーザーが既にログインしている場合は、ユーザーページへリダイレクトします ★★★
if (isset($_SESSION['user_id'])) {
    header("Location: User_page.php");
    exit();
}

// フォームが送信された場合の処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login_identifier = trim($_POST['login_identifier'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($login_identifier) || empty($password)) {
        $error = "ユーザー名（またはEmail）とパスワードを入力してください。";
    } else {
        try {
            // AccountsテーブルをName列またはEmail列で検索
            $stmt = $pdo->prepare("SELECT * FROM Accounts WHERE Name = ? OR Email = ?");
            $stmt->execute([$login_identifier, $login_identifier]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['Password'])) {
                // ログイン成功
                $_SESSION['user_id'] = $user['ID'];
                $_SESSION['username'] = $user['Name'];
                session_regenerate_id(true);
                // ログイン成功後はUser_page.phpへ
                header("Location: User_page.php");
                exit();
            } else {
                $error = "ユーザー名（またはEmail）またはパスワードが間違っています。";
            }
        } catch (PDOException $e) {
            $error = "データベースエラーが発生しました。";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>Login - JAPAN Life Manual</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .password-wrapper { position: relative; display: flex; align-items: center; }
        .password-wrapper input { width: 100%; padding-right: 40px !important; box-sizing: border-box; }
        .password-toggle-icon { position: absolute; right: 15px; cursor: pointer; color: #6c757d; }
    </style>
</head>
<body>
<div class="form-container">
    <h1>Login</h1>
    <?php if (!empty($error)): ?>
        <div class="error-message"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
    <?php endif; ?>

    <form action="login.php" method="post">
        <label>Username or Email:
            <input type="text" name="login_identifier" required value="<?= htmlspecialchars($login_identifier, ENT_QUOTES, 'UTF-8') ?>">
        </label>
        <label>Password:
            <div class="password-wrapper">
                <input type="password" name="password" id="password" required>
                <i class="fas fa-eye password-toggle-icon" id="togglePassword"></i>
            </div>
        </label>
        <button type="submit">Login</button>
    </form>

    <p>パスワードを忘れましたか？ <a href="forgot_password.php">こちらへ</a></p>
    <p>アカウントをお持ちでないですか？ <a href="register.php">こちらで登録</a></p>
</div>

<script>
// パスワード表示の切り替え機能
const toggle = document.getElementById('togglePassword');
const input = document.getElementById('password');
if (toggle && input) {
    toggle.addEventListener('click', function () {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}
</script>
</body>
</html>
