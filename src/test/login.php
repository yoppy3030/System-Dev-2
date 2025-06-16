<?php
session_start();

// Afficher les erreurs (utile pour debug)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Inclure la base de données
require __DIR__ . '/backend/config.php';
// Initialiser les variables
$error = '';
$username = '';

// Si l'utilisateur est déjà connecté, rediriger vers mypage.php
if (isset($_SESSION['user_id'])) {
    header("Location: User_page.php");
    exit();
}

// Si le formulaire a été soumis
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $error = "Veuillez remplir tous les champs.";
    } else {
        try {
            $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $username]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                session_regenerate_id(true);
                header("Location: User_page.php");
                exit();
            } else {
                $error = "Nom d'utilisateur ou mot de passe invalide.";
            }
        } catch (PDOException $e) {
            $error = "Erreur de base de données. Veuillez réessayer.";
            error_log($e->getMessage());
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Login - JAPAN Life Manual</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
<div class="form-container">
    <?php if (!empty($error)): ?>
        <div class="error-message"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form action="login.php" method="post">
        <label>Username or Email :
            <input type="text" name="username" required value="<?= htmlspecialchars($username) ?>">
        </label>
        <label>Password :
            <input type="password" name="password" required>
        </label>
        <button type="submit">Login</button>
    </form>

    <p><a href="forgot_password.php">Forgot password?</a></p>
    <p>Don't have an account? <a href="register.php">Register here</a></p>
</div>
</body>
</html>
