<?php
session_start();
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $country = trim($_POST['country']);
    $activity = $_POST['activity'];

    // Simple validation
    if (!$username || !$email || !$password || !$country || !$activity) {
        http_response_code(400);
        echo json_encode(['error' => 'Tous les champs sont obligatoires']);
        exit;
    }

    // Hasher le mot de passe
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Vérifier si email existe
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'Email déjà utilisé']);
        exit;
    }

    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, country, activity) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$username, $email, $passwordHash, $country, $activity]);

    echo json_encode(['success' => 'Inscription réussie']);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
}
