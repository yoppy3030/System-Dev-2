<?php
// 1. Démarrer la session
session_start();

// 2. Activer le rapport d'erreurs (désactiver en production)
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 3. Inclure la configuration de la base de données
require __DIR__ . '/../backend/config.php';
// 4. Fonction de validation
function validateInput($data) {
    return htmlspecialchars(trim($data ?? ''));
}

// 5. Vérifier que le formulaire a été soumis
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: register.php");
    exit();
}

// 6. Récupérer et valider les données
$username = validateInput($_POST['username'] ?? '');
$email = filter_var(validateInput($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$password = $_POST['password'] ?? '';
$country = validateInput($_POST['country'] ?? '');
$prefecture = validateInput($_POST['prefecture'] ?? '');
$usertype = validateInput($_POST['usertype'] ?? '');

// 7. Valider les entrées
$errors = [];

if (empty($username) || strlen($username) < 3) {
    $errors[] = "Username must be at least 3 characters";
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Invalid email format";
}

if (empty($password) || strlen($password) < 8) {
    $errors[] = "Password must be at least 8 characters";
}

if (empty($country)) {
    $errors[] = "Country is required";
}

if (empty($prefecture)) {
    $errors[] = "Prefecture is required";
}

if (empty($usertype)) {
    $errors[] = "User type is required";
}

// 8. Vérifier si l'email existe déjà
if (empty($errors)) {
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetchColumn() > 0) {
            $errors[] = "Email already registered";
        }
    } catch (PDOException $e) {
        $errors[] = "Database error during validation";
        error_log("Validation error: " . $e->getMessage());
    }
}

// 9. Si erreurs, retourner au formulaire
if (!empty($errors)) {
    $_SESSION['errors'] = $errors;
    $_SESSION['form_data'] = $_POST;
    header("Location: register.php");
    exit();
}

// 10. Enregistrement de l'utilisateur
try {
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("INSERT INTO users 
                          (username, email, password, country, prefecture, usertype, created_at) 
                          VALUES (?, ?, ?, ?, ?, ?, NOW())");
    
    $stmt->execute([
        $username,
        $email,
        $hashed_password,
        $country,
        $prefecture,
        $usertype
    ]);
    
    // Créer la session utilisateur
    $_SESSION['user_id'] = $pdo->lastInsertId();
    $_SESSION['username'] = $username;
    $_SESSION['email'] = $email;
    
    // Rediriger vers la page de profil
    header("Location: User_page.php");
    exit();

} catch (PDOException $e) {
    error_log("Registration error: " . $e->getMessage());
    $_SESSION['errors'] = ["Registration failed. Please try again."];
    header("Location: register.php");
    exit();
}