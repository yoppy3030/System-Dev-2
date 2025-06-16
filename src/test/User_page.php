<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
require __DIR__ . '/backend/config.php';

// Flash message functions
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
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    set_flash_message("Profile not found.", 'error');
    header("Location: login.php");
    exit();
}

// Set user data
$user_avatar = $user['avatar'] ?? 'images/default-avatar.png';
$user_username = $user['username'];
$user_bio = $user['bio'] ?? '';
$user_location = $user['location'] ?? '';
$user_country = $user['country'] ?? '';
$user_activity = $user['activity'] ?? '';

// Get social links
$stmt = $pdo->prepare("SELECT platform, link FROM contacts WHERE user_id = ?");
$stmt->execute([$user_id]);
$social_links = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get posts with user info
$stmt = $pdo->prepare("
    SELECT posts.*, users.username, users.avatar 
    FROM posts 
    JOIN users ON posts.user_id = users.id
    WHERE posts.user_id = ?
    ORDER BY posts.created_at DESC
");
$stmt->execute([$user_id]);
$posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

$flash_message = get_flash_message();

// Function to render comments recursively
function renderComments($comments_array) {
    foreach ($comments_array as $comment) {
        $comment_avatar_path = $comment['avatar'] ? $comment['avatar'] : 'uploads/default-avatar.png';
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
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Profile</title>
    <link rel="stylesheet" href="css/user_page.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>
<body>
    <header>
        <div class="dropdown-menu">
            <button class="dropdown-btn" id="dropdown-btn">
                <i class="fas fa-bars"></i> Menu
            </button>
            <div class="dropdown-content" id="dropdown-content">
                <a href="explore.php"><i class="fas fa-blog"></i> Blog</a>
                <a href="#"><i class="fas fa-envelope"></i> Contact</a>
                <a href="logout.php"><i class="fas fa-sign-out-alt"></i> Log Out</a>
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
            <a href="">
                <i class="fas fa-user-graduate icon"></i>
                <p>Student</p>
            </a>
        </div>

        <div class="menu-item">
            <a href="">
                <i class="fas fa-briefcase icon"></i>
                <p>Professional</p>
            </a>
        </div>

        <div class="menu-item">
            <a href="">
                <i class="fas fa-blog icon"></i>
                <p>Blog</p>
            </a>
        </div>

        <div class="menu-item">
            <a href="">
                <i class="fas fa-user-plus icon"></i>
                <p>Sign Up</p>
            </a>
        </div>
    </header>

    <main>
        <div id="message-container">
            <?php if ($flash_message): ?>
                <div class="flash-message flash-message-<?= htmlspecialchars($flash_message['type']) ?>">
                    <?= htmlspecialchars($flash_message['message']) ?>
                </div>
            <?php endif; ?>
        </div>

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
                        <p id="user_status">Status: <span><?= htmlspecialchars($user_activity) ?></span></p>
                    <?php endif; ?>
                    <p id="user-bio"><span>Bio:</span> <?= nl2br(htmlspecialchars($user_bio)) ?></p>

                    <div class="social-icons">
                        <?php foreach ($social_links as $contact): ?>
                            <a href="<?= htmlspecialchars($contact['link']) ?>" target="_blank" title="<?= htmlspecialchars($contact['platform']) ?>">
                                <i class="<?= getSocialIconClass($contact['platform']) ?>"></i>
                            </a>
                        <?php endforeach; ?>
                    </div>

                    <a id="edit-profile-btn" href="Edit-profile.php?id=<?= $user_id ?>" class="edit-profile-btn">
                        <i class="fas fa-edit"></i> Edit Profile
                    </a>
                </div>
            </div>

            <div class="posts-section">
                <div class="create-post">
                    <h3>Create New Post</h3>
                    <form id="create-post-form" method="POST" enctype="multipart/form-data">
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
                            <!-- En-tête du post -->
                            <div class="post-header">
                                <img src="<?= htmlspecialchars($post['avatar'] ?? 'uploads/default_avatar.jpg') ?>" class="post-avatar">
                                <span class="post-author"><?= htmlspecialchars($post['username']) ?></span>
                                <span class="post-date"><?= date('F j, Y, g:i a', strtotime($post['created_at'])) ?></span>
                            </div>
                            
                            <!-- Contenu du post -->
                            <div class="post-content">
                                <p><?= nl2br(htmlspecialchars($post['content'])) ?></p>
                                <?php if ($post['image']): ?>
                                    <img src="<?= htmlspecialchars($post['image']) ?>" class="post-image">
                                <?php endif; ?>
                            </div>
                            
                            <!-- Interactions du post -->
                            <div class="post-interactions">
                                <!-- Bouton pour afficher/masquer les commentaires -->
                                <button class="toggle-comments-btn">
                                    <i class="fas fa-comments"></i>
                                    <span>Show Comments</span>
                                </button>
                                
                                <!-- Container des commentaires (caché par défaut) -->
                                <div class="comments-container">
                                    <!-- Zone d'ajout de commentaire -->
                                    <div class="add-comment">
                                        <textarea placeholder="Add a comment..."></textarea>
                                        <button onclick="addComment(<?= $post['id'] ?>)">Post Comment</button>
                                    </div>
                                    
                                    <!-- Liste des commentaires -->
                                    <div class="comments-list" id="comments-<?= $post['id'] ?>">
                                        <?php if (!empty($post['comments'])): ?>
                                            <?php foreach ($post['comments'] as $comment): ?>
                                                <div class="comment" data-comment-id="<?= $comment['id'] ?>">
                                                    <img src="<?= htmlspecialchars($comment['avatar'] ?? 'uploads/default-avatar.png') ?>" class="comment-avatar">
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
                                                                        <img src="<?= htmlspecialchars($reply['avatar'] ?? 'uploads/default-avatar.png') ?>" class="comment-avatar">
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

// Comment system functions
function renderComments(comments, parentId = null) {
    let html = '';
    comments.filter(c => c.parent_comment_id == parentId).forEach(comment => {
        html += `
            <div class="comment" data-comment-id="${comment.id}">
                <img src="${comment.avatar || 'uploads/default-avatar.png'}" class="comment-avatar">
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
    </script>
</body>
</html> 