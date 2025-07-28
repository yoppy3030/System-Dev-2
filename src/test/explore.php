<?php
session_start();
require __DIR__ . '/backend/config.php';

$user_id = $_SESSION['user_id'] ?? null;
$user_username = $_SESSION['username'] ?? 'Guest';
$user_avatar = $_SESSION['avatar'] ?? '/uploads/default_avatar.jpg';

$search_query = $_GET['search'] ?? '';
$posts = [];

try {
    $sql_posts = "
        SELECT 
            p.*, 
            u.username, 
            u.avatar,
            (SELECT COUNT(*) FROM likes WHERE target_id = p.id AND target_type = 'post' AND is_like = 1) AS likes_count,
            (SELECT COUNT(*) FROM likes WHERE target_id = p.id AND target_type = 'post' AND is_like = 0) AS dislikes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
        FROM 
            posts p 
        JOIN 
            users u ON p.user_id = u.id
    ";
    
    $conditions = [];
    $params = [];

    if (!empty($search_query)) {
        $words = explode(' ', $search_query);
        foreach ($words as $word) {
            $word = trim($word);
            if ($word !== '') {
                $conditions[] = "(p.content LIKE ? OR p.title LIKE ? OR u.username LIKE ?)";
                $params[] = '%' . $word . '%';
                $params[] = '%' . $word . '%';
                $params[] = '%' . $word . '%';
            }
        }
    }

    if (!empty($conditions)) {
        $sql_posts .= " WHERE " . implode(" AND ", $conditions);
    }

    $sql_posts .= " ORDER BY p.created_at DESC";

    // You can add LIMIT here if you want to paginate or restrict results
    // $sql_posts .= " LIMIT 50"; // For example, show only 50 posts by default

    $stmt_posts = $pdo->prepare($sql_posts);
    $stmt_posts->execute($params);
    $posts = $stmt_posts->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    error_log("Error fetching posts: " . $e->getMessage());
    $posts = [];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explore Posts - Japan Life Manual</title>
    <link rel="stylesheet" href="css/explorer.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
    <header>
        </header>

    <main>
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <img src="images/logo.png" alt="Japan Life Manual Logo" class="logo">
                <h1>Japan Life Manual</h1>
            </div>
            <ul class="sidebar-menu">
                <li><a href="User_page.php"><i class="fas fa-arrow-left"></i> Back to Profile</a></li>
                <li><a href="#"><i class="fas fa-chart-line"></i> Popular<span class="beta">in DEV</span></a></li>
                <li><a href="#"><i class="fas fa-fire"></i> Trending<span class="beta">in DEV</span></a></li>
                <li><a href="#"><i class="fas fa-users"></i> Communities<span class="beta">in DEV</span></a></li>
                <li><a href="#"><i class="fas fa-calendar-alt"></i> Events<span class="beta">in DEV</span></a></li>
                <li class="section-title">TOPICS</li>
                <li><a href="#"><i class="fas fa-microchip"></i> Technology<span class="beta">in DEV</span></a></li>
                <li><a href="#"><i class="fas fa-star"></i> Pop Culture<span class="beta">in DEV</span></a></li>
                <li><a href="#"><i class="fas fa-film"></i> Films & TV<span class="beta">in DEV</span></a></li>
                <li class="section-title">RESSOURCES</li>
                <li><a href="#"><i class="fas fa-info-circle"></i> About</a></li>
                <li><a href="#"><i class="fas fa-flask"></i> More Settings <span class="beta">in DEV</span></a></li>
            </ul>
        </div>

        <section class="posts-section">
            <h2>
                <?php echo !empty($search_query) ? 'Résultats de recherche' : 'Explorer les publications'; ?>
            </h2>

            <div class="search-container">
                <form id="search-form" action="explore.php" method="GET">
                    <input type="text" id="search-input" name="search" placeholder="Search..." value="<?php echo htmlspecialchars($search_query); ?>">
                    <button type="submit" id="search-btn"><i class="fas fa-search"></i> Search</button>
                </form>
                <a href="explore.php" class="clear-search-btn"><i class="fas fa-times"></i> Clear</a>
            </div>

            <p id="no-results" style="display: none; text-align: center; margin-top: 20px; color: #888;">
                No results found.
            </p>

            <div class="posts-feed">
                <?php if (empty($posts)): ?>
                    <p style="text-align: center; margin-top: 20px; color: #888;">
                        No posts available at the moment.
                    </p>
                <?php else: ?>
                    <?php foreach ($posts as $post): ?>
                        <div class="post" data-post-id="<?php echo htmlspecialchars($post['id']); ?>">
                            <div class="post-header">
                                <img src="<?php echo htmlspecialchars($post['avatar'] ?? 'uploads/default_avatar.jpg'); ?>" class="post-avatar" alt="Avatar de <?php echo htmlspecialchars($post['username']); ?>">
                                <span class="post-author"><?php echo htmlspecialchars($post['username']); ?></span>
                                <span class="post-date"><?php echo date('F j, Y, g:i a', strtotime($post['created_at'])); ?></span>
                            </div>

                            <div class="post-content">
                                <p><?php echo nl2br(htmlspecialchars($post['content'])); ?></p>
                                <?php if ($post['image']): ?>
                                    <img src="<?php echo htmlspecialchars($post['image']); ?>" class="post-image" alt="Image du post">
                                <?php endif; ?>
                            </div>

                            <div class="post-interactions">
                                <div class="actions" data-post-id="<?php echo htmlspecialchars($post['id']); ?>">
                                    <button class="like-btn"><i class="fas fa-thumbs-up"></i> Like</button>
                                    <span class="like-count"><?php echo htmlspecialchars($post['likes_count']); ?></span>
                                    <button class="dislike-btn"><i class="fas fa-thumbs-down"></i> Dislike</button>
                                    <span class="dislike-count"><?php echo htmlspecialchars($post['dislikes_count']); ?></span>
                                    <span><i class="fas fa-comments"></i> <span class="comment-count"><?php echo htmlspecialchars($post['comment_count']); ?></span></span>
                                </div>
                                <button class="toggle-comments-btn">
                                    <i class="fas fa-comments"></i> <span>Show Comments</span>
                                </button>
                            </div>

                            <div class="add-comment" style="display: none; margin-top: 10px;">
                                <textarea id="comment-input-<?php echo htmlspecialchars($post['id']); ?>" placeholder="Add a comment..."></textarea>
                                <button class="add-comment-btn" data-post-id="<?php echo htmlspecialchars($post['id']); ?>">Add</button>
                            </div>

                            <div id="comments-<?php echo htmlspecialchars($post['id']); ?>" class="comments" style="display: none;">
                                </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </section>
    </main>

    <script src="js/explorer.js"></script>
</body>
</html>