<?php
// forgot_password.php

require __DIR__ . '/../chatBOT/vendor/autoload.php'; // ajuste le chemin si besoin
require __DIR__ . '/config.php';

// Chargement des variables d'environnement
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../chatBOT');
$dotenv->load();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format.']);
        exit;
    }

    try {
        // Vérifie si l'email existe
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'No account found with that email address.']);
            exit;
        }

        // Génère un token sécurisé
        $token = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

        // Insère dans la table `password_resets`
        $stmt = $pdo->prepare("INSERT INTO password_resets (email, user_id, token, expires_at) VALUES (?, ?, ?, ?)");
        $stmt->execute([$email, $user['id'], $token, $expires]);

        // Lien de réinitialisation
        $reset_link = "https://reset_pass.php/reset-pass.php?token=$token";

        // Envoi de l'email via PHPMailer
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['GMAIL_ADDRESS'];
        $mail->Password   = $_ENV['GMAIL_APP_PASSWORD'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = 465;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($_ENV['GMAIL_ADDRESS'], 'Support - JAPAN Life Manual');
        $mail->addAddress($email);
        $mail->Subject = 'Password Reset Request';

        $mail->isHTML(true);
        $mail->Body = "
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the link below to set a new one:</p>
            <p><a href=\"$reset_link\">Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this, please ignore this email.</p>
        ";

        $mail->send();
        echo json_encode(['success' => true, 'message' => 'A password reset link has been sent to your email.']);

    } catch (Exception $e) {
    error_log("Email error: " . $mail->ErrorInfo);
    echo json_encode(['success' => false, 'message' => 'Failed to send reset email.', 'error' => $mail->ErrorInfo]);
    } catch (PDOException $e) {
        error_log("DB error: " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => 'Database error occurred.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
