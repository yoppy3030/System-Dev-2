const postsContainer = document.getElementById('postsContainer');
const postForm = document.getElementById('postForm');

async function loadPosts() {
    const res = await fetch('../backend/get_posts.php');
    if (!res.ok) {
        console.error('Erreur chargement posts');
        return;
    }
    const posts = await res.json();
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const div = document.createElement('div');
        div.classList.add('post');

        div.innerHTML = `
            <div>
                <img src="../${post.avatar}" alt="avatar" width="40" height="40" />
                <strong>${post.username}</strong> - <small>${new Date(post.created_at).toLocaleString()}</small>
            </div>
            <p>${post.content || ''}</p>
            ${post.image ? `<img src="../${post.image}" alt="image post" style="max-width:300px;" />` : ''}
            <div>
                <button class="like-btn" data-id="${post.id}">👍 <span class="like-count">${post.likes}</span></button>
                <button class="dislike-btn" data-id="${post.id}">👎 <span class="dislike-count">${post.dislikes}</span></button>
            </div>
        `;

        postsContainer.appendChild(div);
    });
    // Charger les commentaires pour chaque post
document.querySelectorAll('.post').forEach(postDiv => {
    const postId = postDiv.querySelector('.like-btn').dataset.id;
    const commentsContainer = postDiv.querySelector('.comments-container');
    loadComments(postId, commentsContainer);
});

// Gestion envoi commentaire
document.querySelectorAll('.submit-comment').forEach(btn => {
    btn.onclick = async () => {
        const postId = btn.dataset.postId;
        const commentInput = btn.previousElementSibling;
        const content = commentInput.value.trim();
        if (!content) return alert('Veuillez écrire un commentaire.');

        const res = await fetch('../backend/create_comment.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ post_id: postId, content: content, parent_comment_id: null }),
        });
        if (res.ok) {
            commentInput.value = '';
            // Recharger commentaires du post
            const commentsContainer = btn.parentElement.querySelector('.comments-container');
            loadComments(postId, commentsContainer);
        } else {
            alert('Erreur envoi commentaire');
        }
    };
});

document.body.addEventListener('click', async (e) => {
    if (e.target.classList.contains('like-btn') || e.target.classList.contains('dislike-btn')) {
        const targetId = e.target.dataset.id;
        const targetType = e.target.dataset.type; // 'post' ou 'comment'
        const isLike = e.target.classList.contains('like-btn') ? 1 : 0;

        const res = await fetch('../backend/toggle_like.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ target_id: targetId, target_type: targetType, is_like: isLike })
        });
        if (res.ok) {
            const data = await res.json();
            // Met à jour les compteurs likes/dislikes dans le DOM
            const likeCountSpan = document.querySelector(`.like-count[data-id="${targetId}"][data-type="${targetType}"]`);
            const dislikeCountSpan = document.querySelector(`.dislike-count[data-id="${targetId}"][data-type="${targetType}"]`);
            if(likeCountSpan) likeCountSpan.textContent = data.likes;
            if(dislikeCountSpan) dislikeCountSpan.textContent = data.dislikes;
        }
    }
});



    // Ajouter event listeners like/dislike
    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.onclick = () => sendLike(btn.dataset.id, true);
    });
    document.querySelectorAll('.dislike-btn').forEach(btn => {
        btn.onclick = () => sendLike(btn.dataset.id, false);
    });
}

async function sendLike(postId, isLike) {
    const res = await fetch('../backend/like.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ target_id: postId, target_type: 'post', is_like: isLike ? 1 : 0 }),
    });
    if (!res.ok) {
        console.error('Erreur like/dislike');
        return;
    }
    loadPosts(); // Recharge les posts pour mettre à jour les counts
}

postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(postForm);

    const res = await fetch('../backend/create_post.php', {
        method: 'POST',
        body: formData,
    });
    if (res.ok) {
        postForm.reset();
        loadPosts();
    } else {
        alert('Erreur lors de la création du post');
    }
});

// Chargement initial des posts
loadPosts();
async function loadComments(postId, container) {
    const res = await fetch(`../backend/get_comments.php?post_id=${postId}`);
    if (!res.ok) return;

    const comments = await res.json();
    container.innerHTML = '';

    // Construire un arbre de commentaires (parent -> enfants)
    const map = {};
    comments.forEach(c => { c.children = []; map[c.id] = c; });
    const roots = [];

    comments.forEach(c => {
        if (c.parent_comment_id) {
            map[c.parent_comment_id]?.children.push(c);
        } else {
            roots.push(c);
        }
    });

    function renderComment(c, level = 0) {
        const div = document.createElement('div');
        div.style.marginLeft = level * 20 + 'px';
        div.className = 'comment';

        div.innerHTML = `
            <img src="../${c.avatar}" alt="avatar" width="30" height="30" />
            <strong>${c.username}</strong> <small>${new Date(c.created_at).toLocaleString()}</small>
            <p>${c.content}</p>
            <button class="reply-btn" data-comment-id="${c.id}" data-post-id="${c.post_id}">Répondre</button>
            <div class="replies"></div>
        `;

        // Ajouter les réponses récursivement
        const repliesDiv = div.querySelector('.replies');
        c.children.forEach(child => repliesDiv.appendChild(renderComment(child, level + 1)));

        return div;
    }

    roots.forEach(c => container.appendChild(renderComment(c)));
}

document.body.addEventListener('click', async (e) => {
    if (e.target.classList.contains('reply-btn')) {
        const commentId = e.target.dataset.commentId;
        const postId = e.target.dataset.postId;

        // Vérifier si formulaire de réponse existe déjà pour éviter doublon
        let existingReplyForm = e.target.parentElement.querySelector('.reply-form');
        if (existingReplyForm) {
            existingReplyForm.remove();
            return;
        }

        // Créer formulaire de réponse
        const replyForm = document.createElement('div');
        replyForm.className = 'reply-form';
        replyForm.innerHTML = `
            <textarea placeholder="Écrire une réponse..."></textarea>
            <button>Envoyer</button>
        `;

        e.target.parentElement.appendChild(replyForm);

        replyForm.querySelector('button').onclick = async () => {
            const content = replyForm.querySelector('textarea').value.trim();
            if (!content) return alert('Veuillez écrire une réponse.');

            const res = await fetch('../backend/create_comment.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ post_id: postId, content: content, parent_comment_id: commentId }),
            });
            if (res.ok) {
                replyForm.remove();
                const commentsContainer = e.target.closest('.post').querySelector('.comments-container');
                loadComments(postId, commentsContainer);
            } else {
                alert('Erreur envoi réponse');
            }
        };
    }
});
