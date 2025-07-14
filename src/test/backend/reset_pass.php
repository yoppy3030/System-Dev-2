<?php
require __DIR__ . '/config.php';

$token = $_GET['token'] ?? '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $new_password = $_POST['new_password'];
    $confirm_password = $_POST['confirm_password'];

    if ($new_password !== $confirm_password) {
        $error = "the passwords is invalid.";
    } else {
        // Vérifier le token
        $stmt = $pdo->prepare("SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()");
        $stmt->execute([$token]);
        $reset = $stmt->fetch();

        if ($reset) {
            $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->execute([$hashed_password, $reset['user_id']]);

            // Supprimer le token
            $pdo->prepare("DELETE FROM password_resets WHERE token = ?")->execute([$token]);

            $success = "Password updated successfully!";
        } else {
            $error = "Invalid or expired token.";
        }
    }
}
?>

<?php if (!empty($success)) : ?>
    <p style="color:green;"><?= $success ?></p>
<?php endif; ?>

<form method="POST">
    <input type="password" name="new_password" required placeholder="Nouveau mot de passe" autocomplete="new-password">
    <input type="password" name="confirm_password" required placeholder="Confirmez le mot de passe" autocomplete="new-password">
    <button type="submit">SAVE</button>
</form>
