<?php
session_start();

<<<<<<< HEAD
//エラー表示を有効にする
ini_set('display_errors', 1);
error_reporting(E_ALL);

// データベース接続の設定を読み込む
require __DIR__ . '/backend/config.php';
// 変数を初期化
=======
// エラー表示を有効にする（開発時）
ini_set('display_errors', 1);
error_reporting(E_ALL);

// データベース設定ファイルを読み込む
// ★★★ パスが環境によって異なる可能性があるため、'backend/config.php'を適切なパスに修正してください ★★★
require_once __DIR__ . '/backend/config.php';

>>>>>>> 7494ebf7a79fe8143d4ffbc1921e9807148dcfb3
$error = '';
$username = '';

<<<<<<< HEAD
// ユーザーが既にログインしている場合は、ユーザーページへリダイレクトします
=======
// ユーザーが既にログインしている場合
>>>>>>> 7494ebf7a79fe8143d4ffbc1921e9807148dcfb3
if (isset($_SESSION['user_id'])) {
    // この時点では管理者かどうかわからないため、一旦ホームページへリダイレクトするのが安全
    header("Location: home.php");
    exit();
}

// フォームが送信された場合の処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['login_identifier'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $error = "すべてのフィールドに入力してください。";
    } else {
        try {
<<<<<<< HEAD
            $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $username]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                session_regenerate_id(true);
                header("Location: User_page.php");
=======
            // is_adminカラムも取得するようにSELECT文を修正
            $stmt = $pdo->prepare("SELECT * FROM Accounts WHERE Name = ? OR Email = ?");
            $stmt->execute([$login_identifier, $login_identifier]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['Password'])) {
                // ログイン成功
                session_regenerate_id(true); // セキュリティ強化
                $_SESSION['user_id'] = $user['ID'];
                $_SESSION['username'] = $user['Name'];

                // ▼▼▼【変更点】管理者かどうかをチェックし、リダイレクト先を決定 ▼▼▼
                if (!empty($user['is_admin']) && $user['is_admin'] == 1) {
                    // 管理者の場合は管理者ダッシュボードへ
                    header("Location: admin/dashboard.php");
                } else {
                    // 一般ユーザーの場合はホームページへ
                    header("Location: index.php");
                }
>>>>>>> 7494ebf7a79fe8143d4ffbc1921e9807148dcfb3
                exit();
                // ▲▲▲ ここまで ▲▲▲

            } else {
                $error = "ユーザー名またはパスワードは間違っています。";
            }
        } catch (PDOException $e) {
<<<<<<< HEAD
            $error = "データベースエラーが発生しました。もう一度お試しください。";
            error_log($e->getMessage());
=======
            // 本番環境では、より一般的なエラーメッセージを表示することを推奨します
            $error = "データベースエラーが発生しました: " . $e->getMessage();
>>>>>>> 7494ebf7a79fe8143d4ffbc1921e9807148dcfb3
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
    <!-- <style>
        .password-wrapper { position: relative; display: flex; align-items: center; }
        .password-wrapper input { width: 100%; padding-right: 40px !important; box-sizing: border-box; }
        .password-toggle-icon { position: absolute; right: 15px; cursor: pointer; color: #6c757d; }
    </style> -->
</head>
<body>
<div class="form-container">
    <h1>Login</h1>
    <?php if (!empty($error)): ?>
        <div class="error-message"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form action="login.php" method="post">
        <label>Username or Email:
            <input type="text" name="login_identifier" required value="<?= htmlspecialchars($username) ?>">
        </label>
        <label>Password:
            <div class="password-wrapper">
                <input type="password" name="password" id="password" required>
                <i class="fas fa-eye password-toggle-icon" id="togglePassword"></i>
            </div>
        </label>
        <button type="submit">Login</button>
    </form>

    <p>Forgot your password? <a href="forgot_password.php">Click here</a></p>
    <p>Don't have an account? <a href="register.php">Register here</a></p>
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
