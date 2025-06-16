<?php
// 1. Démarrer la session
session_start();

// 2. Supprimer toutes les variables de session
$_SESSION = [];

// 3. Supprimer le cookie de session (optionnel mais recommandé)
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 4. Détruire la session
session_destroy();

// 5. Rediriger vers la page de login ou d'accueil
header("Location: login.php");
exit();
