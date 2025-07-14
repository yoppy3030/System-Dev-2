<?php
session_start();
require __DIR__ . '/config.php';

header('Content-Type: application/json');

$user_id = $_SESSION['user_id'] ?? null;

$target_id = $_POST['target_id'] ?? $_GET['target_id'] ?? null;
$target_type = $_POST['target_type'] ?? $_GET['target_type'] ?? null;
$is_like = isset($_POST['is_like']) ? (int) $_POST['is_like'] : null;

if (!$target_id || !$target_type) {
    echo json_encode(['error' => 'Missing target_id or target_type']);
    exit;
}

try {
    // Si c'est une requête POST (ajout ou suppression)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!$user_id) {
            echo json_encode(['error' => 'You must be logged in.']);
            exit;
        }

        // Vérifie s'il y a déjà un like/dislike
        $stmt = $pdo->prepare("SELECT * FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?");
        $stmt->execute([$user_id, $target_id, $target_type]);
        $existing = $stmt->fetch();

        if ($existing) {
            if ((int)$existing['is_like'] === $is_like) {
                // Supprimer si même réaction (toggle off)
                $stmt = $pdo->prepare("DELETE FROM likes WHERE id = ?");
                $stmt->execute([$existing['id']]);
            } else {
                // Mettre à jour la réaction
                $stmt = $pdo->prepare("UPDATE likes SET is_like = ? WHERE id = ?");
                $stmt->execute([$is_like, $existing['id']]);
            }
        } else {
            // Nouveau like/dislike
            $stmt = $pdo->prepare("INSERT INTO likes (user_id, target_id, target_type, is_like) VALUES (?, ?, ?, ?)");
            $stmt->execute([$user_id, $target_id, $target_type, $is_like]);
        }
    }

    // Dans tous les cas, renvoyer les nouveaux comptes
    $stmt = $pdo->prepare("
        SELECT
            SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
            SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
        FROM likes
        WHERE target_id = ? AND target_type = ?
    ");
    $stmt->execute([$target_id, $target_type]);
    $counts = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'likes' => (int)$counts['likes'],
        'dislikes' => (int)$counts['dislikes']
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error', 'details' => $e->getMessage()]);
}
?>