<?php
// Active l'affichage des erreurs pour le débogage (à DÉSACTIVER en production !)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
// Assurez-vous que ce chemin est correct et que $pdo est disponible
// Exemple: si 'backend' est un dossier, et config.php est dedans
require __DIR__ . '/config.php';

header('Content-Type: application/json'); // Indique que la réponse est du JSON

$response = ['success' => false, 'message' => '']; // Structure de réponse unifiée

$user_id = $_SESSION['user_id'] ?? null;

// target_id et target_type sont nécessaires pour TOUTES les requêtes (GET et POST)
$target_id = $_REQUEST['target_id'] ?? null; // $_REQUEST pour récupérer de GET ou POST
$target_type = $_REQUEST['target_type'] ?? null;

// is_like n'est pertinent que pour les requêtes POST
$is_like = isset($_POST['is_like']) ? (int) $_POST['is_like'] : null;

// Vérification essentielle des paramètres pour toute requête (GET ou POST)
if (!$target_id || !$target_type) {
    http_response_code(400); // Bad Request
    $response['message'] = "Missing target_id or target_type.";
    echo json_encode($response);
    exit();
}

try {
    // --- Logique de Like/Dislike (UNIQUEMENT pour les requêtes POST) ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!$user_id) {
            http_response_code(401); // Unauthorized
            $response['message'] = "You must be logged in to like/dislike.";
            echo json_encode($response);
            exit();
        }

        // Vérification de is_like pour POST
        if ($is_like === null || ($is_like !== 0 && $is_like !== 1)) {
            http_response_code(400); // Bad Request
            $response['message'] = "Invalid or missing 'is_like' parameter.";
            echo json_encode($response);
            exit();
        }

        // Début de la transaction
        $pdo->beginTransaction();

        // Vérifie si l'utilisateur a déjà réagi (like ou dislike) à cette cible
        $stmt = $pdo->prepare("SELECT id, is_like FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?");
        $stmt->execute([$user_id, $target_id, $target_type]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            // L'utilisateur a déjà une réaction
            if ((int)$existing['is_like'] === $is_like) {
                // Si la nouvelle réaction est la même que l'existante, on la supprime (toggle off)
                $stmt = $pdo->prepare("DELETE FROM likes WHERE id = ?");
                $stmt->execute([$existing['id']]);
                $response['message'] = "Action removed.";
            } else {
                // Si la nouvelle réaction est différente, on la met à jour
                $stmt = $pdo->prepare("UPDATE likes SET is_like = ? WHERE id = ?");
                $stmt->execute([$is_like, $existing['id']]);
                $response['message'] = "Action updated.";
            }
        } else {
            // Pas de réaction existante, on l'insère
            $stmt = $pdo->prepare("INSERT INTO likes (user_id, target_id, target_type, is_like) VALUES (?, ?, ?, ?)");
            $stmt->execute([$user_id, $target_id, $target_type, $is_like]);
            $response['message'] = "Action recorded.";
        }

        $pdo->commit(); // Valide la transaction si tout s'est bien passé

    }

    // --- Récupération des NOUVEAUX comptes (pour les requêtes GET et POST) ---
    // Cette partie est exécutée après toute action POST (pour renvoyer les nouveaux totaux),
    // ou directement pour une requête GET (pour récupérer les totaux actuels).
    $stmt = $pdo->prepare("
        SELECT
            SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
            SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
        FROM likes
        WHERE target_id = ? AND target_type = ?
    ");
    $stmt->execute([$target_id, $target_type]);
    $counts = $stmt->fetch(PDO::FETCH_ASSOC);

    // Gérer le cas où il n'y a aucun like/dislike (SUM retourne null si aucune ligne n'est trouvée)
    $likes = (int)($counts['likes'] ?? 0);
    $dislikes = (int)($counts['dislikes'] ?? 0);

    $response['success'] = true;
    $response['likes'] = $likes;
    $response['dislikes'] = $dislikes;
    $response['target_id'] = $target_id; // Utile pour le débogage côté JS

    echo json_encode($response);

} catch (PDOException $e) {
    // En cas d'erreur PDO, annule la transaction si elle était active
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Database error in like_dislike.php: " . $e->getMessage());
    http_response_code(500); // Code d'erreur interne du serveur
    $response['success'] = false;
    $response['message'] = 'An internal server error occurred.';
    // Pour le débogage seulement : $response['details'] = $e->getMessage();
    echo json_encode($response);
} catch (Exception $e) {
    // Pour toute autre erreur inattendue
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("General error in like_dislike.php: " . $e->getMessage());
    http_response_code(500);
    $response['success'] = false;
    $response['message'] = 'An unexpected error occurred.';
    // Pour le débogage seulement : $response['details'] = $e->getMessage();
    echo json_encode($response);
}

exit(); // Toujours exit après avoir envoyé la réponse JSON
?>