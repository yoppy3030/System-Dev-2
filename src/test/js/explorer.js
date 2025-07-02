console.log("Script chargé !");
document.addEventListener('DOMContentLoaded', function() {

    // Gestion Like/Dislike
    document.querySelectorAll('.actions').forEach(action => {
        const postId = action.dataset.postId;
        const likeBtn = action.querySelector('.like-btn');
        const dislikeBtn = action.querySelector('.dislike-btn');
        const likeCount = action.querySelector('.like-count');
        const dislikeCount = action.querySelector('.dislike-count');

        function updateCounts() {
            fetch(`http://localhost/Sites/Challengers/System-Dev-2/src/test/backend/like_dislike.php?target_id=${postId}&target_type=post`)
            .then(res => res.json())
            .then(data => {
                likeCount.textContent = data.likes ?? 0;
                dislikeCount.textContent = data.dislikes ?? 0;
            })
            .catch(err => console.error("Erreur like/dislike:", err));
        }

       function updateLikeDislikeButtons() {
            fetch(`http://localhost/challengers/System-Dev-2/src/test/backend/get_likes.php?target_id=${postId}&target_type=post`)
            .then(res => res.json())
            .then(data => {
                likeCount.textContent = data.likes ?? 0;
                dislikeCount.textContent = data.dislikes ?? 0;
            })
            .catch(err => console.error("Erreur chargement likes:", err));
        }
        likeBtn?.addEventListener('click', () => {
            fetch('http://localhost/challengers/System-Dev-2/src/test/backend/like_dislike.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `target_id=${postId}&target_type=post&is_like=1`
            }).then(updateCounts);
        });

        dislikeBtn?.addEventListener('click', () => {
            fetch('http://localhost/challengers/System-Dev-2/src/test/backend/like_dislike.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: `target_id=${postId}&target_type=post&is_like=0`
            }).then(updateCounts);
        });

        updateCounts();
    });

    // Boutons toggle commentaires
    document.querySelectorAll('.post').forEach(post => {
        const commentsSection = post.querySelector('.comments');
        const addCommentSection = post.querySelector('.add-comment');

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-comments-btn';
        toggleBtn.innerHTML = '<i class="fas fa-comments"></i> <span>Show Comments</span>';

        commentsSection.parentNode.insertBefore(toggleBtn, commentsSection);

        toggleBtn.addEventListener('click', function() {
            commentsSection.classList.toggle('visible');
            addCommentSection.classList.toggle('visible');

            const icon = this.querySelector('i');
            const text = this.querySelector('span');

            if (commentsSection.classList.contains('visible')) {
                icon.classList.replace('fa-comments', 'fa-chevron-up');
                text.textContent = 'Hide Comments';
            } else {
                icon.classList.replace('fa-chevron-up', 'fa-comments');
                text.textContent = 'Show Comments';
            }
        });
    });

    // コメントの読み込み
    document.querySelectorAll('.comments').forEach(c => {
        const postId = c.id.split('-')[1];
        loadComments(postId);
    });

    // 返信ボタンの追加
    document.querySelectorAll('.comment').forEach(comment => {
        const replyBtn = document.createElement('button');
        replyBtn.className = 'reply-btn';
        replyBtn.textContent = 'Reply';

        const replyForm = comment.querySelector('.reply-form');
        comment.querySelector('.comment-content').appendChild(replyBtn);

        replyBtn.addEventListener('click', function() {
            replyForm.style.display = replyForm.style.display === 'none' ? 'block' : 'none';
        });
    });

});

// コメントのレンダリング関数
function renderComments(comments, parentId = null) {
    let html = '';
    comments.filter(c => c.parent_comment_id == parentId).forEach(comment => {
        html += `
            <div class="comment">
                <img src="${comment.avatar}" class="avatar-mini">
                <b>${comment.username}</b>: ${comment.content}
                <div class="reply">
                    <textarea id="reply-input-${comment.id}" placeholder="Reply..."></textarea>
                    <button onclick="addComment(${comment.post_id}, ${comment.id})">Reply</button>
                </div>
                ${renderComments(comments, comment.id)}
            </div>
        `;
    });
    return html;
}

function loadComments(postId) {
    fetch(`http://localhost/challengers/System-Dev-2/src/test/backend/get_comments.php?post_id=${postId}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById(`comments-${postId}`).innerHTML = renderComments(data);
    })
    .catch(err => console.error("Erreur chargement commentaires:", err));
}

function addComment(postId, parentCommentId = null) {
    const inputId = parentCommentId ? `reply-input-${parentCommentId}` : `comment-input-${postId}`;
    const content = document.getElementById(inputId).value.trim();
    if (content === '') return;

    const formData = new URLSearchParams();
    formData.append('post_id', postId);
    formData.append('content', content);
    if (parentCommentId) formData.append('parent_comment_id', parentCommentId);

    fetch('http://localhost/challengers/System-Dev-2/src/test/backend/add_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    }).then(() => {
        loadComments(postId);
        document.getElementById(inputId).value = '';
    }).catch(err => console.error("Erreur ajout commentaire:", err));
}