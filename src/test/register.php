<?php

// 1. セッション_start()とCSRFトークンの生成
session_start();

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// 2. エラーメッセージの表示設定
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 3. データベース接続
require(__DIR__ . '/backend/config.php');

// 4. 入力の検証関数
function validateInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// 5. POSTリクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CSRFトークンの検証
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        die('Invalid CSRF token');
    }

    $errors = [];
    
    // ユーザー入力の取得と検証
    $username = validateInput($_POST['username']);
    $email = filter_var(validateInput($_POST['email']), FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $password_confirmation = $_POST['password_confirmation'];
    $country = validateInput($_POST['country']);
    $location = validateInput($_POST['location']);
    $activity = validateInput($_POST['activity']);
    
    // 有効なアクティビティのリスト
    $valid_activities = ['Professional', 'International Student', 'Tourist', 'Other'];
    
    // エラーチェック
    if (strlen($username) < 3) {
        $errors[] = "ユーザー名は3文字以上で入力してください";
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "メールアドレスが無効です";
    }

    if (strlen($password) < 8) {
        $errors[] = "パスワードは8文字以上で入力してください";
    }
    if ($password !== $password_confirmation) {
        $errors[] = "パスワードが一致しません";
    }

    if (!in_array($activity, $valid_activities)) {
        $errors[] = "選択されたアクティビティは無効です";
    }

    // ユニークなメールアドレスの確認
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetchColumn() > 0) {
            $errors[] = "このメールアドレスはすでに登録されています";
        }
    } catch (PDOException $e) {
        $errors[] = "データベースエラーが発生しました";
    }

    // パスワード確認
    if (empty($errors)) {
        try {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            
            $pdo->beginTransaction();
            
            $stmt = $pdo->prepare("INSERT INTO users (username, email, password, country, location, activity, registration_date) 
                                 VALUES (?, ?, ?, ?, ?, ?, NOW())");
            $stmt->execute([$username, $email, $hashed_password, $country, $location, $activity]);

            $_SESSION['user_id'] = $pdo->lastInsertId();
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;
            
            $pdo->commit();

            header("Location: User_page.php");
            exit();
        } catch (PDOException $e) {
            $pdo->rollBack();
            $errors[] = "データベースエラーが発生しました: " . $e->getMessage();
        }
    }

    // エラーがある場合は、セッションにエラーメッセージを保存してフォームにリダイレクト
    $_SESSION['errors'] = $errors;
    $_SESSION['form_data'] = $_POST;
    header("Location: register.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - JAPAN Life Manual</title>
    <link rel="stylesheet" href="./css/style.css">

</head>
<body>
<div class="form-container">
<!-- タイトルと説明 -->
    <h1>Registration</h1>
    <p>Please fill in the details below to register.</p>
    <?php if (!empty($_SESSION['errors'])): ?>
        <div class="errors">
            <?php foreach ($_SESSION['errors'] as $error): ?>
                <p class="error-message"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
            <?php endforeach; ?>
        </div>
        <?php unset($_SESSION['errors']); ?>
    <?php endif; ?>
<!-- フォームの開始 -->
    <form name="registerForm" action="register.php" method="post" onsubmit="return validateForm()">
        <input type="hidden" name="csrf_token" value="<?= $_SESSION['csrf_token'] ?>">
        
        <label>Username:
            <input type="text" name="username" placeholder="ECC 太郎" minlength="3"
                   value="<?= isset($_SESSION['form_data']['username']) ? htmlspecialchars($_SESSION['form_data']['username'], ENT_QUOTES, 'UTF-8') : '' ?>" required>
        </label>

        <label>Email:
            <input type="email" name="email" placeholder="example@gmail.com"
                   value="<?= isset($_SESSION['form_data']['email']) ? htmlspecialchars($_SESSION['form_data']['email'], ENT_QUOTES, 'UTF-8') : '' ?>" required>
        </label>

        <label>Password:
            <input type="password" name="password" minlength="8" required>
            <small>(8 characters minimum)</small>
        </label>
        <label>Password Confirmation:
            <input type="password" name="password_confirmation" minlength="8" required>
            <small>(8 characters minimum)</small>
        </label>

        <label>Country:
            <input type="text" name="country"
                   value="<?= isset($_SESSION['form_data']['country']) ? htmlspecialchars($_SESSION['form_data']['country'], ENT_QUOTES, 'UTF-8') : '' ?>" required>
        </label>

        <label>Current Location:
            <input type="text" name="location" placeholder="Osaka"
                   value="<?= isset($_SESSION['form_data']['location']) ? htmlspecialchars($_SESSION['form_data']['location'], ENT_QUOTES, 'UTF-8') : '' ?>" required>
        </label>

        <label>What are you doing in Japan?
            <select name="activity" required>
                <option value="">-- Please select --</option>
                <option value="Professional" <?= (isset($_SESSION['form_data']['activity']) && $_SESSION['form_data']['activity'] === 'Professional') ? 'selected' : '' ?>>Professional</option>
                <option value="International Student" <?= (isset($_SESSION['form_data']['activity']) && $_SESSION['form_data']['activity'] === 'International Student') ? 'selected' : '' ?>>International Student</option>
                <option value="Tourist" <?= (isset($_SESSION['form_data']['activity']) && $_SESSION['form_data']['activity'] === 'Tourist') ? 'selected' : '' ?>>Tourist</option>
                <option value="Other" <?= (isset($_SESSION['form_data']['activity']) && $_SESSION['form_data']['activity'] === 'Other') ? 'selected' : '' ?>>Other</option>
            </select>
        </label>

        <button type="submit">Register</button>
    </form>

    <p>Already have an account? <a href="login.php">Login here</a></p>
</div>

<script>
function validateForm() {
    // Validation côté client
    const password = document.forms["registerForm"]["password"].value;
    if (password.length < 8) {
        alert("Password must be at least 8 characters long");
        return false;
    }
    return true;
}
</script>
</body>
</html>

<?php
// Nettoyage de la session après affichage
unset($_SESSION['form_data']);
//unset($_SESSION['csrf_token']);
// Fin du script
?>