<?php
session_start();
require __DIR__ . '/../backend/config.php';
$email = $_POST['email'];
$password = $_POST['password'];

try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user'] = $user;
        echo "Login successful! Welcome, " . htmlspecialchars($user['username']) . ".";
        // Redirect to home or dashboard
        // header("Location: dashboard.php");
    } else {
        echo "Invalid email or password.";
    }
} catch (PDOException $e) {
    echo "Login failed: " . $e->getMessage();
}
?>
