<?php
session_start();
require __DIR__ . '/config.php'; // Assurez-vous que ce chemin est correct et que $pdo est disponible

header('Content-Type: application/json');

$user_id = $_SESSION['user_id'] ?? null;

// Récupère target_id et target_type depuis POST ou GET, selon la méthode
$target_id = $_REQUEST['target_id'] ?? null; // $_REQUEST inclut GET et POST
$target_type = $_REQUEST['target_type'] ?? null;

// is_like n'est pertinent que pour les requêtes POST
$is_like = isset($_POST['is_like']) ? (int) $_POST['is_like'] : null;

// Vérification essentielle des paramètres pour toute requête (GET ou POST)
if (!$target_id || !$target_type) {
    echo json_encode(['error' => 'Missing target_id or target_type.']);
    exit;
}

try {
    // --- Logique de Like/Dislike (UNIQUEMENT pour les requêtes POST) ---
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!$user_id) {
            echo json_encode(['error' => 'You must be logged in to like/dislike.']);
            exit;
        }

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
            } else {
                // Si la nouvelle réaction est différente, on la met à jour
                $stmt = $pdo->prepare("UPDATE likes SET is_like = ? WHERE id = ?");
                $stmt->execute([$is_like, $existing['id']]);
            }
        } else {
            // Pas de réaction existante, on l'insère
            $stmt = $pdo->prepare("INSERT INTO likes (user_id, target_id, target_type, is_like) VALUES (?, ?, ?, ?)");
            $stmt->execute([$user_id, $target_id, $target_type, $is_like]);
        }
    }

    // --- Récupération des NOUVEAUX comptes (pour les requêtes GET et POST) ---
    // Cette partie est exécutée après toute action POST, ou directement pour une requête GET
    $stmt = $pdo->prepare("
        SELECT
            SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
            SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
        FROM likes
        WHERE target_id = ? AND target_type = ?
    ");
    $stmt->execute([$target_id, $target_type]);
    $counts = $stmt->fetch(PDO::FETCH_ASSOC);

    // Gérer le cas où il n'y a aucun like/dislike (SUM retourne null)
    $likes = (int)($counts['likes'] ?? 0);
    $dislikes = (int)($counts['dislikes'] ?? 0);

    echo json_encode([
        'likes' => $likes,
        'dislikes' => $dislikes
    ]);

} catch (PDOException $e) {
    // Log l'erreur pour le débogage et renvoie un message générique à l'utilisateur
    error_log("Database error in like_dislike.php: " . $e->getMessage());
    http_response_code(500); // Code d'erreur interne du serveur
    echo json_encode(['error' => 'An internal server error occurred.', 'details' => $e->getMessage()]);
}
?>