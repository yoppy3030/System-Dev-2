<?php
// 1. Démarrer la session et générer un token CSRF
session_start();

if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// 2. Debug (à désactiver en production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 3. Connexion à la base de données
require __DIR__ . '/../backend/config.php';
// 4. Fonction de validation
function validateInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// 5. Si le formulaire est soumis
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Vérification CSRF
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        die('Invalid CSRF token');
    }

    $errors = [];
    
    // Nettoyage des entrées
    $username = validateInput($_POST['username']);
    $email = filter_var(validateInput($_POST['email']), FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $country = validateInput($_POST['country']);
    $location = validateInput($_POST['location']);
    $activity = validateInput($_POST['activity']);
    
    // Valeurs valides pour l'activité
    $valid_activities = ['Professional', 'International Student', 'Tourist', 'Other'];
    
    // Validation
    if (strlen($username) < 3) {
        $errors[] = "ユーザー名は3文字以上で入力してください";
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "メールアドレスが無効です";
    }

    if (strlen($password) < 8) {
        $errors[] = "パスワードは8文字以上で入力してください";
    }

    if (!in_array($activity, $valid_activities)) {
        $errors[] = "選択されたアクティビティは無効です";
    }

    // Vérification email unique
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetchColumn() > 0) {
            $errors[] = "このメールアドレスはすでに登録されています";
        }
    } catch (PDOException $e) {
        $errors[] = "データベースエラーが発生しました";
    }

    // Si aucune erreur, enregistrement
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

    // Enregistrer les erreurs et données dans la session
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
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="form-container">
    <h1>Registration</h1>

    <?php if (!empty($_SESSION['errors'])): ?>
        <div class="errors">
            <?php foreach ($_SESSION['errors'] as $error): ?>
                <p class="error-message"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
            <?php endforeach; ?>
        </div>
        <?php unset($_SESSION['errors']); ?>
    <?php endif; ?>

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
unset($_SESSION['csrf_token']);
// Fin du script
?>