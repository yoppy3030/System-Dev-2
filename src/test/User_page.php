<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
// ★★★ 修正点: backendフォルダにあるconfig.phpを読み込む ★★★
require_once __DIR__ . '/backend/config.php';

// Flash message functions (この機能はそのまま利用します)
function set_flash_message($message, $type = 'success') {
    $_SESSION['flash_message'] = ['message' => $message, 'type' => $type];
}

function get_flash_message() {
    if (isset($_SESSION['flash_message'])) {
        $message = $_SESSION['flash_message'];
        unset($_SESSION['flash_message']);
        return $message;
    }
    return null;
}

// Get user info
$user_id = $_SESSION['user_id'];
// ★★★ 修正点: 'users'テーブルを'Accounts'に、'id'を'ID'に修正 ★★★
// ★★★ 修正点: 存在しないカラム(avatar, bio, location)の代わりに存在するカラムを取得 ★★★
$stmt = $pdo->prepare("SELECT ID, Name, Email, Country, Current_location, UserType FROM Accounts WHERE ID = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    set_flash_message("Profile not found.", 'error');
    header("Location: login.php");
    exit();
}

// Set user data
// ★★★ 修正点: 正しいカラム名からデータをセットする ★★★
$user_avatar = 'images/default-avatar.png'; // avatarカラムは存在しないため、デフォルト値を設定
$user_username = $user['Name'];
$user_bio = ''; // bioカラムは存在しないため、空に設定
$user_location = $user['Current_location'];
$user_country = $user['Country'];
$user_activity = $user['UserType'];

// If user has no activity, set a default value
if (empty($user_activity)) {
    $user_activity = 'Unknown';
}

// Get social links (この部分はcontactsテーブルに依存するため、そのままにします)
// もしcontactsテーブルも存在しない場合は、別途エラーが発生します
try {
    $stmt_social = $pdo->prepare("SELECT platform, link FROM contacts WHERE user_id = ?");
    $stmt_social->execute([$user_id]);
    $social_links = $stmt_social->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // contactsテーブルが存在しない場合のエラーをハンドル
    $social_links = [];
    // error_log("Social links table error: " . $e->getMessage());
}


// Get posts with user info
// ★★★ 修正点: JOINするテーブルを'users'から'Accounts'に、カラム名を修正 ★★★
try {
    $stmt_posts = $pdo->prepare("
        SELECT posts.*, Accounts.Name as username
        FROM posts 
        JOIN Accounts ON posts.user_id = Accounts.ID
        WHERE posts.user_id = ?
        ORDER BY posts.created_at DESC
    ");
    $stmt_posts->execute([$user_id]);
    $posts = $stmt_posts->fetchAll(PDO::FETCH_ASSOC);

    // 各投稿にアバターパスを追加
    foreach ($posts as &$post) {
        $post['avatar'] = 'images/default-avatar.png'; // デフォルトアバターを設定
    }
    unset($post); // ループ後の参照を解除

} catch (PDOException $e) {
    // postsテーブルが存在しない場合のエラーをハンドル
    $posts = [];
    // error_log("Posts table error: " . $e->getMessage());
}


$flash_message = get_flash_message();

// Function to render comments recursively
function renderComments($comments_array) {
    foreach ($comments_array as $comment) {
        $comment_avatar_path = $comment['avatar'] ? $comment['avatar'] : 'images/default-avatar.png';
        echo '<div class="comment" data-comment-id="' . htmlspecialchars($comment['id']) . '">';
        echo '<img src="' . htmlspecialchars($comment_avatar_path) . '" alt="Commenter Avatar" class="comment-avatar">';
        echo '<div class="comment-content">';
        echo '<strong>' . htmlspecialchars($comment['username']) . '</strong>';
        echo '<p>' . nl2br(htmlspecialchars($comment['content'])) . '</p>';

        echo '<button class="toggle-reply-form-btn" data-comment-id="' . htmlspecialchars($comment['id']) . '">Reply</button>';
        echo '<form class="add-reply-form comments-hidden" data-comment-id="' . htmlspecialchars($comment['id']) . '" style="margin-top: 10px;">';
        echo '<input type="hidden" name="post_id" value="' . htmlspecialchars($comment['post_id']) . '">';
        echo '<input type="hidden" name="parent_comment_id" value="' . htmlspecialchars($comment['id']) . '">';
        echo '<input type="text" name="comment_content" placeholder="Write a reply..." required>';
        echo '<button type="submit"><i class="fas fa-paper-plane"></i></button>';
        echo '</form>';

        if (!empty($comment['replies'])) {
            echo '<div class="replies-container">';
            renderComments($comment['replies']);
            echo '</div>';
        }
        echo '</div></div>';
    }
}
// Ajouter les likes, dislikes et commentaires pour CHAQUE post de l'utilisateur
foreach ($posts as &$post) {
    $post_id = $post['id'];

    // Nombre de commentaires
    $stmt_comment_count = $pdo->prepare("SELECT COUNT(*) FROM comments WHERE post_id = ?");
    $stmt_comment_count->execute([$post_id]);
    $post['comment_count'] = $stmt_comment_count->fetchColumn() ?? 0;

    // Likes
    $stmt_likes = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE target_id = ? AND target_type = 'post' AND is_like = 1");
    $stmt_likes->execute([$post_id]);
    $post['likes_count'] = $stmt_likes->fetchColumn() ?? 0;

    // Dislikes
    $stmt_dislikes = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE target_id = ? AND target_type = 'post' AND is_like = 0");
    $stmt_dislikes->execute([$post_id]);
    $post['dislikes_count'] = $stmt_dislikes->fetchColumn() ?? 0;
}

// try {
//     $sql_posts = "SELECT p.*, u.username, u.avatar 
//                   FROM posts p 
//                   JOIN users u ON p.user_id = u.id";
//     $params = [];

//     if (!empty($search_query)) {
//         $sql_posts .= " WHERE p.content LIKE ? OR p.title LIKE ?";
//         $params[] = '%' . $search_query . '%';
//         $params[] = '%' . $search_query . '%';
//     }

//     $sql_posts .= " ORDER BY p.created_at DESC";

//     $stmt_posts = $pdo->prepare($sql_posts);
//     $stmt_posts->execute($params);
//     $posts = $stmt_posts->fetchAll(PDO::FETCH_ASSOC);

//     foreach ($posts as &$post) {
//         $post_id = $post['id'];

//         $stmt_comment_count = $pdo->prepare("SELECT COUNT(*) FROM comments WHERE post_id = ?");
//         $stmt_comment_count->execute([$post_id]);
//         $post['comment_count'] = $stmt_comment_count->fetchColumn() ?? 0;

//         $stmt_likes = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE target_id = ? AND target_type = 'post' AND is_like = 1");
//         $stmt_likes->execute([$post_id]);
//         $post['likes_count'] = $stmt_likes->fetchColumn() ?? 0;

//         $stmt_dislikes = $pdo->prepare("SELECT COUNT(*) FROM likes WHERE target_id = ? AND target_type = 'post' AND is_like = 0");
//         $stmt_dislikes->execute([$post_id]);
//         $post['dislikes_count'] = $stmt_dislikes->fetchColumn() ?? 0;
//     }
// } catch (PDOException $e) {
//     error_log("Error fetching posts: " . $e->getMessage());
//     $posts = [];
// }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile</title>
    <link rel="stylesheet" href="./css/user_page.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"></head>
<body>
    <header>
        <div class="dropdown-menu">
            <button class="dropdown-btn" id="dropdown-btn">
                <i class="fas fa-bars"></i> Menu
            </button>
            <div class="dropdown-content" id="dropdown-content">
                <a href="blog.php"><i class="fas fa-blog"></i> Blog</a>
                <a href="#"><i class="fas fa-envelope"></i> Contact</a>
                <a href="#"><i class="fas fa-cog"></i> Settings</a>
            </div>
        </div>

        <div class="logo">
            <i class="fas fa-book icon"></i>
            <h3>Japan Life Manual</h3>
        </div>

        <div class="menu-item">
            <a href="index.php"><i class="fas fa-house icon"></i>
                <p>HOME</p>
            </a>
        </div>

        <div class="menu-item">
            <a href="studenthome.php">
                <i class="fas fa-user-graduate icon"></i>
                <p>Student</p>
            </a>
        </div>

        <div class="menu-item">
            <a href="professional.php">
                <i class="fas fa-briefcase icon"></i>
                <p>Professional</p>
            </a>
        </div>

        <div class="menu-item">
            <a href="explore.php">
                <i class="fas fa-blog icon"></i>
                <p>Blog</p>
            </a>
        </div>

        <div class="menu-item">

            <a href="register.php">
                <i class="fas fa-user-plus icon"></i>
                <p>Sign Up</p>
            <a href="logout.php" id="logout-link">
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                <p>LogOut</p>
            </a>
        </div>
    </header>

    <main>
<div class="explorer-layout">
        <div class="user-profile-container">
            <div class="profile-section">
                <div class="profile-avatar">
                    <img src="<?= htmlspecialchars($user_avatar) ?>" alt="Profile Picture" id="profile-pic">
                </div>
                <div class="profile-info">
                    <h2 id="username"><?= htmlspecialchars($user_username) ?></h2>
                    <p id="user_location">City: <span><?= htmlspecialchars($user_location) ?></span></p>
                    <p id="user_country">Country: <span><?= htmlspecialchars($user_country) ?></span></p>
                    <?php if (!empty($user_activity)): ?>
                        <p id="user_status">Statut: <span><?= htmlspecialchars($user_activity) ?></span></p>
                    <?php endif; ?>
                    <p id="user-bio"><span>Bio:</span> <?= nl2br(htmlspecialchars($user_bio)) ?></p>
                    
                    <?php if (!empty($social_links)) : ?>
                        <div class="social-icons-container">
                            <div class="social-icons"> <!-- ✅ Ajout de la classe manquante ici -->
                                <?php foreach ($social_links as $social) : 
                                    $platform = strtolower($social['platform']);
                                    $icons = [
                                        'facebook' => 'fab fa-facebook-f',
                                        'twitter' => 'fab fa-twitter',
                                        'linkedin' => 'fab fa-linkedin-in',
                                        'github' => 'fab fa-github',
                                        'instagram' => 'fab fa-instagram',
                                        'youtube' => 'fab fa-youtube',
                                        'tiktok' => 'fab fa-tiktok',
                                    ];
                                    $iconClass = $icons[$platform] ?? 'fas fa-link';
                                ?>
                                    <a href="<?= htmlspecialchars($social['link']) ?>" target="_blank" title="<?= ucfirst($platform) ?>">
                                        <i class="<?= $iconClass ?>"></i>
                                    </a>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endif; ?>


                    <a id="edit-profile-btn" href="Edit-profile.php?id=<?= $user_id ?>" class="edit-profile-btn">
                        <i class="fas fa-edit"></i> Edit Profile
                    </a>
                </div>
            </div>

            <div class="posts-section">
                <div class="create-post">
                    <h3>Create New Post</h3>
                    <form id="create-post-form" method="POST" action="backend/create_post.php" enctype="multipart/form-data">
                        <textarea name="content" placeholder="What's on your mind, <?= htmlspecialchars($user_username) ?>?" required></textarea>
                        <div class="post-actions">
                            <label for="post-image" class="file-upload-btn">
                                <i class="fas fa-image"></i> Add Image
                            </label>
                            <input type="file" id="post-image" name="image" accept="image/*">
                            <button type="submit" id="publish-btn">Publish</button>
                        </div>
                        <div id="image-preview-container">
                            <img id="image-preview" src="#" alt="Image Preview">
                            <button type="button" id="remove-image-btn">Remove Image</button>
                        </div>
                    </form>
                </div>


                <div class="posts">
                    <h3>My Posts</h3>
                    <?php foreach ($posts as $post): ?>
                            <div class="post" data-post-id="<?= $post['id'] ?>">
                                <a href=""><i class="fa-solid fa-trash"></i></a>
                            <div class="post-header">
                                <img src="<?= htmlspecialchars($post['avatar'] ?? '/uploads/default_avatar.jpg') ?>" class="post-avatar">
                                <span class="post-author"><?= htmlspecialchars($post['username']) ?></span>
                                <span class="post-date"><?= date('F j, Y, g:i a', strtotime($post['created_at'])) ?></span>
                            </div>
                        
                            <div class="post-content">
                                <p><?= nl2br(htmlspecialchars($post['content'])) ?></p>
                                <?php if ($post['image']): ?>
                                    <img src="<?= htmlspecialchars($post['image']) ?>" alt="Image du post" style="border:1px solid red;" class="post-image">
                                <?php endif; ?>
                            </div>
                        
                            <div class="post-interactions">
                            <div class="post-actions">
                                <div class="actions" data-post-id="<?php echo $post['id']; ?>">
                                    <button class="like-btn"><i class="fas fa-thumbs-up"></i> Like</button>
                                    <span class="like-count"><?php echo $post['likes_count']; ?></span>
                                    <button class="dislike-btn"><i class="fas fa-thumbs-down"></i> Dislike</button>
                                    <span class="dislike-count"><?php echo $post['dislikes_count']; ?></span>
                                    <span><i class="fas fa-comments"></i> <?php echo $post['comment_count']; ?></span>
                                </div>
                            </div>
                            
                                <button class="toggle-comments-btn">
                                    <i class="fas fa-comments fa-chevron-down"></i>
                                    <span>Show Comments</span>
                                </button>
                        
                                <div class="comments-container">
                                    <div class="add-comment">
                                        <textarea id="comment-input-<?= $post['id'] ?>" placeholder="Add a comment..."></textarea>
                                        <button class="post-comment-btn" data-post-id="<?= $post['id'] ?>">Post Comment</button>
                                    </div>
                                    
                                    
                                    <!-- Liste des commentaires -->
                                    <div class="comments-list" id="comments-<?= $post['id'] ?>">
                                        <?php if (!empty($post['comments'])): ?>
                                            <?php foreach ($post['comments'] as $comment): ?>
                                                <div class="comment" data-comment-id="<?= $comment['id'] ?>">
                                                    <img src="<?= htmlspecialchars($comment['avatar'] ?? '/uploads/default-avatar.png') ?>" class="comment-avatar">
                                                    <div class="comment-content">
                                                        <div class="comment-author"><?= htmlspecialchars($comment['username']) ?></div>
                                                        <div class="comment-text"><?= nl2br(htmlspecialchars($comment['content'])) ?></div>
                                                        <div class="comment-date"><?= date('M j, Y', strtotime($comment['created_at'])) ?></div>
                                                        
                                                        <!-- Bouton de réponse -->
                                                        <button class="reply-btn">Reply</button>
                                                        
                                                        <!-- Formulaire de réponse (caché par défaut) -->
                                                        <div class="reply-form">
                                                            <textarea placeholder="Write a reply..."></textarea>
                                                            <button onclick="addComment(<?= $post['id'] ?>, <?= $comment['id'] ?>)">Post Reply</button>
                                                        </div>

                                                        <!-- Réponses imbriquées -->
                                                        <?php if (!empty($comment['replies'])): ?>
                                                            <div class="replies">
                                                                <?php foreach ($comment['replies'] as $reply): ?>
                                                                    <div class="comment" data-comment-id="<?= $reply['id'] ?>">
                                                                        <img src="<?= htmlspecialchars($reply['avatar'] ?? '/uploads/default-avatar.png') ?>" class="comment-avatar">
                                                                        <div class="comment-content">
                                                                            <div class="comment-author"><?= htmlspecialchars($reply['username']) ?></div>
                                                                            <div class="comment-text"><?= nl2br(htmlspecialchars($reply['content'])) ?></div>
                                                                            <div class="comment-date"><?= date('M j, Y', strtotime($reply['created_at'])) ?></div>
                                                                        </div>
                                                                    </div>
                                                                <?php endforeach; ?>
                                                            </div>
                                                        <?php endif; ?>
                                                    </div>
                                                </div>
                                            <?php endforeach; ?>
                                        <?php else: ?>
                                            <div class="no-comments-message">No comments yet</div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
    </div>
    </main>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Image preview functionality
        const postImageInput = document.getElementById('post-image');
        const imagePreviewContainer = document.getElementById('image-preview-container');
        const imagePreview = document.getElementById('image-preview');
        const removeImageBtn = document.getElementById('remove-image-btn');

        if (postImageInput && imagePreviewContainer && imagePreview && removeImageBtn) {
            // Initially hide the preview container
            imagePreviewContainer.style.display = 'none' ;

            postImageInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.src = e.target.result;
                        imagePreviewContainer.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });

            removeImageBtn.addEventListener('click', function() {
                postImageInput.value = '';
                imagePreview.src = '#';
                imagePreviewContainer.style.display = 'none';
            });
        }

        // Dropdown menu functionality
        const dropdownBtn = document.getElementById('dropdown-btn');
        const dropdownContent = document.getElementById('dropdown-content');
        if (dropdownBtn && dropdownContent) {
            dropdownBtn.addEventListener('click', function() {
                dropdownContent.classList.toggle('show');
            });
        }

        // Close dropdown when clicking outside
        window.addEventListener('click', function(event) {
            if (!event.target.matches('.dropdown-btn') && !event.target.matches('.dropdown-btn *')) {
                if (dropdownContent && dropdownContent.classList.contains('show')) {
                    dropdownContent.classList.remove('show');
                }
            }
        });

        // Toggle comments visibility
        document.querySelectorAll('.toggle-comments-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const commentsContainer = this.nextElementSibling;
                commentsContainer.classList.toggle('comments-visible');
                
                // Change the button text and icon
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
                
                const text = this.querySelector('span');
                text.textContent = commentsContainer.classList.contains('comments-visible') ? 'Hide Comments' : 'Show Comments';
            });
        });
    });

// Gestion des commentaires
document.querySelectorAll('.toggle-comments-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const container = this.nextElementSibling;
        container.classList.toggle('comments-visible');
        
        // Changer l'icône et le texte
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
        
        const text = this.querySelector('span');
        text.textContent = container.classList.contains('comments-visible') ? 'Hide Comments' : 'Show Comments';
    });
});

// Gestion des réponses
document.querySelectorAll('.reply-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const form = this.nextElementSibling;
        form.classList.toggle('visible');
    });
});

// Comment functions
function renderComments(comments, parentId = null) {
    let html = '';
    comments.filter(c => c.parent_comment_id == parentId).forEach(comment => {
        html += `
            <div class="comment" data-comment-id="${comment.id}">
                <img src="${comment.avatar || 'images/default-avatar.png'}" class="comment-avatar">
                <div class="comment-content">
                    <strong>${comment.username}</strong>
                    <p>${comment.content.replace(/\n/g, '<br>')}</p>
                        <button class="toggle-reply-btn" onclick="toggleReplyForm(${comment.id})">Reply</button>
                        <div class="reply-form" id="reply-form-${comment.id}" style="display:none;">
                            <textarea id="reply-input-${comment.id}" placeholder="Write a reply..."></textarea>
                            <button onclick="addComment(${comment.post_id}, ${comment.id})">Post Reply</button>
                        </div>
                        ${renderComments(comments, comment.id)}
                    </div>
                </div>
            `;
        });
        return html;
    }

    function loadComments(postId) {
        fetch(`backend/get_comments.php?post_id=${postId}`)
            .then(res => res.json())
            .then(data => {
                document.getElementById(`comments-${postId}`).innerHTML = renderComments(data);
            })
            .catch(error => console.error('Error loading comments:', error));
    }

    function addComment(postId, parentCommentId = null) {
        const inputId = parentCommentId ? `reply-input-${parentCommentId}` : `comment-input-${postId}`;
        const content = document.getElementById(inputId).value.trim();
        if (!content) return;

        const formData = new URLSearchParams();
        formData.append('post_id', postId);
        formData.append('content', content);
        if (parentCommentId) formData.append('parent_comment_id', parentCommentId);

        fetch('backend/add_comment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(() => {
            loadComments(postId);
            document.getElementById(inputId).value = '';
            if (parentCommentId) {
                document.getElementById(`reply-form-${parentCommentId}`).style.display = 'none';
            }
        })
        .catch(error => console.error('Error adding comment:', error));
    }

    function toggleReplyForm(commentId) {
        const form = document.getElementById(`reply-form-${commentId}`);
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    }

    // Load comments for all posts when page loads
    window.addEventListener('load', () => {
        document.querySelectorAll('.post').forEach(postElement => {
            const postId = postElement.dataset.postId;
            loadComments(postId);
        });
    });
    document.addEventListener('DOMContentLoaded', () => {
    // Toggle comments container visibility
    document.querySelectorAll('.toggle-comments-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const postInteractions = btn.parentElement;
            const commentsContainer = postInteractions.querySelector('.comments-container');
            if (!commentsContainer) return;

            if (commentsContainer.style.display === 'none' || commentsContainer.style.display === '') {
                commentsContainer.style.display = 'block';
                btn.querySelector('span').textContent = 'Hide Comments';
                btn.querySelector('i').classList.remove('fa-chevron-down');
                btn.querySelector('i').classList.add('fa-chevron-up');

                // Load comments via AJAX when shown
                const postId = btn.closest('.post').dataset.postId;
                loadComments(postId);
            } else {
                commentsContainer.style.display = 'none';
                btn.querySelector('span').textContent = 'Show Comments';
                btn.querySelector('i').classList.remove('fa-chevron-up');
                btn.querySelector('i').classList.add('fa-chevron-down');
            }
        });
    });

    // Handle post comment button clicks
    document.querySelectorAll('.post-comment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = btn.dataset.postId;
            const textarea = document.getElementById(`comment-input-${postId}`);
            const content = textarea.value.trim();
            if (!content) return alert("Please write a comment.");

            addComment(postId, null, content, () => {
                textarea.value = '';
                loadComments(postId);
            });
        });
    });

    // Delegate reply button and reply form toggle and submit using event delegation
    document.body.addEventListener('click', event => {
        // Reply button toggle form
        if (event.target.classList.contains('reply-btn')) {
            const replyForm = event.target.nextElementSibling;
            if (replyForm) {
                replyForm.style.display = replyForm.style.display === 'block' ? 'none' : 'block';
            }
        }

        // Reply form post button
        if (event.target.classList.contains('post-reply-btn')) {
            const commentId = event.target.dataset.commentId;
            const postId = event.target.dataset.postId;
            const textarea = document.getElementById(`reply-input-${commentId}`);
            const content = textarea.value.trim();
            if (!content) return alert("Please write a reply.");

            addComment(postId, commentId, content, () => {
                textarea.value = '';
                // Optionally hide the reply form
                const form = document.getElementById(`reply-form-${commentId}`);
                if (form) form.style.display = 'none';

                loadComments(postId);
            });
        }
    });
});

// AJAX function to load comments and render them
function loadComments(postId) {
    fetch(`backend/get_comments.php?post_id=${postId}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById(`comments-${postId}`);
            container.innerHTML = renderComments(data);
        })
        .catch(err => console.error('Error loading comments:', err));
}

// Render comments recursively as HTML string
function renderComments(comments, parentId = null) {
    let html = '';
    comments.filter(c => c.parent_comment_id == parentId).forEach(comment => {
        html += `
            <div class="comment" data-comment-id="${comment.id}">
                <img src="${comment.avatar || 'images/default-avatar.png'}" class="comment-avatar">
                <div class="comment-content">
                    <strong>${comment.username}</strong>
                    <p>${comment.content.replace(/\n/g, '<br>')}</p>
                    <button class="reply-btn">Reply</button>
                    <div class="reply-form" id="reply-form-${comment.id}" style="display:none; margin-top: 10px;">
                        <textarea id="reply-input-${comment.id}" placeholder="Write a reply..."></textarea>
                        <button class="post-reply-btn" data-comment-id="${comment.id}" data-post-id="${comment.post_id}">Post Reply</button>
                    </div>
                    ${renderComments(comments, comment.id)}
                </div>
            </div>
        `;
    });
    return html;
}

// AJAX function to add a comment or reply
function addComment(postId, parentCommentId, content, callback) {
    const formData = new URLSearchParams();
    formData.append('post_id', postId);
    formData.append('content', content);
    if (parentCommentId) formData.append('parent_comment_id', parentCommentId);

    fetch('backend/add_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    })
    .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
    })
    .then(data => {
        if (data.success) {
            if (callback) callback();
        } else {
            alert('Failed to post comment.');
        }
    })
    .catch(err => {
        console.error('Error adding comment:', err);
        alert('Error adding comment. See console.');
    });
}

    </script>
</body>
</html> 