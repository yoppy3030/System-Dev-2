<?php
session_start();
require __DIR__ . '/backend/config.php';

$user_id = $_SESSION['user_id'] ?? null;
$user_username = $_SESSION['username'] ?? 'Guest';
$user_avatar = $_SESSION['avatar'] ?? '/uploads/default_avatar.jpg';

$search_query = $_GET['search'] ?? '';
$posts = [];

try {
    $sql_posts = "SELECT p.*, u.username, u.avatar 
                  FROM posts p 
                  JOIN users u ON p.user_id = u.id";
    $params = [];

    if (!empty($search_query)) {
        $sql_posts .= " WHERE p.content LIKE ? OR p.title LIKE ?";
        $params[] = '%' . $search_query . '%';
        $params[] = '%' . $search_query . '%';
    }

    $sql_posts .= " ORDER BY p.created_at DESC";

    $stmt_posts = $pdo->prepare($sql_posts);
    $stmt_posts->execute($params);
    $posts = $stmt_posts->fetchAll(PDO::FETCH_ASSOC);

    foreach ($posts as &$post) {
        $post_id = $post['id'];

        $stmt_comment_count = $pdo->prepare("SELECT COUNT(*) FROM comments WHERE post_id = ?");
        $stmt_comment_count->execute([$post_id]);
        $post['comment_count'] = $stmt_comment_count->fetchColumn() ?? 0;

        $stmt_likes = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE target_id = ? AND target_type = 'post' AND is_like = 1");
        $stmt_likes->execute([$post_id]);
        $post['likes_count'] = $stmt_likes->fetchColumn() ?? 0;

        $stmt_dislikes = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE target_id = ? AND target_type = 'post' AND is_like = 0");
        $stmt_dislikes->execute([$post_id]);
        $post['dislikes_count'] = $stmt_dislikes->fetchColumn() ?? 0;
    }
} catch (PDOException $e) {
    error_log("Error fetching posts: " . $e->getMessage());
    $posts = [];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Explore Posts - Japan Life Manual</title>
    <link rel="stylesheet" href="css/explorer.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
<header>
    <a href="User_page.php" class="back-button"><i class="fas fa-arrow-left"></i>Go back to profile</a>
</header>

<main>
    <div class="blog-feed-container">
        <section class="posts-section">
            <h2><?php echo !empty($search_query) ? 'Search Results' : 'Explore Posts'; ?></h2>

            <div class="search-container">
                <form action="explorer.php" method="GET">
                    <input type="text" name="search" placeholder="Search posts..." value="<?php echo htmlspecialchars($search_query); ?>">
                    <button type="submit"><i class="fas fa-search"></i> Search</button>
                </form>
                <?php if (!empty($search_query)): ?>
                    <a href="explorer.php" class="clear-search-btn"><i class="fas fa-times"></i> Clear</a>
                <?php endif; ?>
            </div>

            <?php if (!empty($search_query) && empty($posts)): ?>
                <p>No results for "<?php echo htmlspecialchars($search_query); ?>".</p>
            <?php elseif (!empty($search_query)): ?>
                <p>Results for "<?php echo htmlspecialchars($search_query); ?>":</p>
            <?php endif; ?>

            <div class="posts-feed">
                <?php if (empty($posts)): ?>
                    <p>No posts available.</p>
                <?php else: ?>
                    <?php foreach ($posts as $post): ?>
                        <div class="post">
                            <div class="post-header">
                                <img src="<?php echo htmlspecialchars($post['avatar'] ?? 'uploads/default_avatar.jpg'); ?>" class="post-avatar">
                                <span class="post-author"><?php echo htmlspecialchars($post['username']); ?></span>
                                <span class="post-date"><?php echo date('F j, Y, g:i a', strtotime($post['created_at'])); ?></span>
                            </div>

                            <div class="post-content">
                                <p><?php echo nl2br(htmlspecialchars($post['content'])); ?></p>
                                <?php if ($post['image']): ?>
                                    <img src="<?php echo htmlspecialchars($post['image']); ?>" class="post-image">
                                <?php endif; ?>
                            </div>

                            <div class="post-interactions">
                                <div class="actions" data-post-id="<?php echo $post['id']; ?>">
                                    <button class="like-btn"><i class="fas fa-thumbs-up"></i> Like</button>
                                    <span class="like-count"><?php echo $post['likes_count']; ?></span>
                                    <button class="dislike-btn"><i class="fas fa-thumbs-down"></i> Dislike</button>
                                    <span class="dislike-count"><?php echo $post['dislikes_count']; ?></span>
                                    <span><i class="fas fa-comments"></i> <?php echo $post['comment_count']; ?></span>
                                </div>
                            </div> 

                            <div class="add-comment">
                                <textarea id="comment-input-<?php echo $post['id']; ?>" placeholder="Add a comment..."></textarea>
                                <button onclick="addComment(<?php echo $post['id']; ?>)">Add comment</button>
                            </div>

                            <div id="comments-<?php echo $post['id']; ?>" class="comments"></div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>
    </div>
    <script src="js/explorer.js"></script>
</body>
</html>
