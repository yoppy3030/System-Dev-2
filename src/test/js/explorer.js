console.log("Script chargé !");

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const postsFeed = document.querySelector('.posts-feed');
    const noResults = document.getElementById('no-results');

    if (form && input && postsFeed && noResults) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = input.value.trim();

            fetch(`search_posts.php?search=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(posts => {
                    postsFeed.innerHTML = '';

                    if (posts.length === 0) {
                        noResults.style.display = 'block';
                    } else {
                        noResults.style.display = 'none';
                        posts.forEach(post => {
                            const postEl = document.createElement('div');
                            postEl.className = 'post';
                            postEl.innerHTML = `
                                <div class="post-header">
                                    <img src="${post.avatar}" class="post-avatar">
                                    <span class="post-author">${post.username}</span>
                                    <span class="post-date">${new Date(post.created_at).toLocaleString()}</span>
                                </div>
                                <div class="post-content">
                                    <p>${post.content}</p>
                                    ${post.image ? `<img src="${post.image}" class="post-image">` : ''}
                                </div>
                                <div class="post-interactions">
                                    <div class="actions" data-post-id="${post.id}">
                                        <button class="like-btn"><i class="fas fa-thumbs-up"></i> Like</button>
                                        <span class="like-count">${post.likes_count}</span>
                                        <button class="dislike-btn"><i class="fas fa-thumbs-down"></i> Dislike</button>
                                        <span class="dislike-count">${post.dislikes_count}</span>
                                        <span><i class="fas fa-comments"></i> ${post.comment_count}</span>
                                    </div>
                                </div>
                                <div class="add-comment">
                                    <textarea id="comment-input-${post.id}" placeholder="Add a comment..."></textarea>
                                    <button onclick="addComment(${post.id})">Add comment</button>
                                </div>
                                <div id="comments-${post.id}" class="comments" style="display: none;"></div>
                            `;
                            postsFeed.appendChild(postEl);
                        });

                        reloadLikeDislike();
                        bindToggleComments();
                    }
                })
                .catch(err => {
                    console.error('Erreur de recherche :', err);
                    noResults.style.display = 'block';
                    postsFeed.innerHTML = '';
                });
        });
    }

    function reloadLikeDislike() {
        document.querySelectorAll('.actions').forEach(action => {
            const postId = action.dataset.postId;
            const likeBtn = action.querySelector('.like-btn');
            const dislikeBtn = action.querySelector('.dislike-btn');
            const likeCount = action.querySelector('.like-count');
            const dislikeCount = action.querySelector('.dislike-count');

            function updateCounts() {
                fetch(`backend/like_dislike.php?target_id=${postId}&target_type=post`)
                    .then(res => res.json())
                    .then(data => {
                        likeCount.textContent = data.likes ?? 0;
                        dislikeCount.textContent = data.dislikes ?? 0;
                    });
            }

            likeBtn?.addEventListener('click', () => {
                fetch('backend/like_dislike.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `target_id=${postId}&target_type=post&is_like=1`
                }).then(updateCounts);
            });

            dislikeBtn?.addEventListener('click', () => {
                fetch('backend/like_dislike.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `target_id=${postId}&target_type=post&is_like=0`
                }).then(updateCounts);
            });

            updateCounts();
        });
    }

    function bindToggleComments() {
        document.querySelectorAll('.post').forEach(post => {
            const commentsSection = post.querySelector('.comments');
            const addCommentSection = post.querySelector('.add-comment');
            const postId = post.querySelector('.actions')?.dataset.postId;

            if (!commentsSection || !addCommentSection || !postId) return;

            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'toggle-comments-btn';
            toggleBtn.innerHTML = '<i class="fas fa-comments"></i> <span>Show Comments</span>';
            commentsSection.parentNode.insertBefore(toggleBtn, commentsSection);

            let commentsLoaded = false;

            toggleBtn.addEventListener('click', function () {
                const isVisible = commentsSection.style.display === 'block';

                if (!isVisible && !commentsLoaded) {
                    loadComments(postId);
                    commentsLoaded = true;
                }

                commentsSection.style.display = isVisible ? 'none' : 'block';
                addCommentSection.style.display = isVisible ? 'none' : 'flex';

                const icon = this.querySelector('i');
                const text = this.querySelector('span');
                icon.className = isVisible ? 'fas fa-comments' : 'fas fa-chevron-up';
                text.textContent = isVisible ? 'Show Comments' : 'Hide Comments';
            });
        });
    }

    document.getElementById('search-input')?.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('search-btn')?.click();
        }
    });
});

function loadComments(postId) {
    fetch(`http://localhost/challengers/System-Dev-2/src/test/backend/get_comments.php?post_id=${postId}`)
        .then(res => res.json())
        .then(data => {
            const commentsContainer = document.getElementById(`comments-${postId}`);
            if (!commentsContainer) return;
            commentsContainer.innerHTML = renderComments(data);
            bindReplyButtons();
        })
        .catch(err => console.error("Erreur chargement commentaires:", err));
}

function renderComments(comments, parentId = null) {
    let html = '';
    comments.filter(c => c.parent_comment_id == parentId).forEach(comment => {
        html += `
            <div class="comment" data-comment-id="${comment.id}">
                <img src="${comment.avatar ?? '/uploads/default_avatar.jpg'}" class="avatar-mini" alt="Avatar">
                <div class="comment-content">
                    <b>${comment.username}</b>: ${comment.content}
                </div>
                <button class="reply-btn">Reply</button>
                <div class="reply-form" style="display: none; flex-direction: column; gap: 0.5rem;">
                    <textarea id="reply-input-${comment.id}" placeholder="Reply..."></textarea>
                    <button onclick="addComment(${comment.post_id}, ${comment.id})">Reply</button>
                </div>
                <div class="replies" style="display: none;">
                    ${renderComments(comments, comment.id)}
                </div>
            </div>
        `;
    });
    return html;
}

function bindReplyButtons() {
    document.querySelectorAll('.reply-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const commentDiv = this.closest('.comment');
            const replyForm = commentDiv.querySelector('.reply-form');
            const replies = commentDiv.querySelector('.replies');
            replyForm.style.display = replyForm.style.display === 'flex' ? 'none' : 'flex';
            replies.style.display = replies.style.display === 'block' ? 'none' : 'block';
        });
    });
}

function addComment(postId, parentCommentId = null) {
    const inputId = parentCommentId ? `reply-input-${parentCommentId}` : `comment-input-${postId}`;
    const input = document.getElementById(inputId);
    if (!input) return;

    const content = input.value.trim();
    if (!content) return;

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
        input.value = '';
    }).catch(err => console.error("Erreur ajout commentaire:", err));
}