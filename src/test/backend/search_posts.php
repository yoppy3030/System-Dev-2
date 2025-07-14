<?php
require __DIR__ . '/config.php';

$search_query = $_GET['search'] ?? '';
$posts = [];

try {
    if ($search_query !== '') {
        $sql = "SELECT p.*, u.username, u.avatar 
                FROM posts p 
                JOIN users u ON p.user_id = u.id 
                WHERE p.content LIKE ? OR p.title LIKE ? OR u.username LIKE ?
                ORDER BY p.created_at DESC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            '%' . $search_query . '%',
            '%' . $search_query . '%',
            '%' . $search_query . '%'
        ]);
    } else {
        // S’il n’y a pas de recherche, afficher tous les posts
        $sql = "SELECT p.*, u.username, u.avatar 
                FROM posts p 
                JOIN users u ON p.user_id = u.id 
                ORDER BY p.created_at DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    }

    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($posts as &$post) {
        $post_id = $post['id'];

        // Commentaires
        $stmt_comment = $pdo->prepare("SELECT COUNT(*) FROM comments WHERE post_id = ?");
        $stmt_comment->execute([$post_id]);
        $post['comment_count'] = $stmt_comment->fetchColumn() ?? 0;

        // Likes
        $stmt_like = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE target_id = ? AND target_type = 'post' AND is_like = 1");
        $stmt_like->execute([$post_id]);
        $post['likes_count'] = $stmt_like->fetchColumn() ?? 0;

        // Dislikes
        $stmt_dislike = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE target_id = ? AND target_type = 'post' AND is_like = 0");
        $stmt_dislike->execute([$post_id]);
        $post['dislikes_count'] = $stmt_dislike->fetchColumn() ?? 0;
    }

    header('Content-Type: application/json');
    echo json_encode($posts);
    exit();

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    exit();
}
?>
