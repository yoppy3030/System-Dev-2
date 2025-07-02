<?php
session_start();
require __DIR__ . '/config.php';

header('Content-Type: application/json');

// Optionnel : afficher les erreurs pour le debug
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ⚠️ Si tu veux autoriser les visiteurs à voir les commentaires,
// enlève cette vérification sinon ça bloque :
/*
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}
*/

$post_id = isset($_GET['post_id']) ? (int)$_GET['post_id'] : 0;
if (!$post_id) {
    http_response_code(400);
    echo json_encode(['error' => 'ID post manquant']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT comments.*, users.username, users.avatar
        FROM comments
        JOIN users ON comments.user_id = users.id
        WHERE comments.post_id = ?
        ORDER BY comments.created_at ASC
    ");
    $stmt->execute([$post_id]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($comments);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur base de données']);
}
?>
