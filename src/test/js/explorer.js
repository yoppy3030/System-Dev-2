console.log("Script chargé !");

document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const postsFeed = document.querySelector('.posts-feed');
    const noResultsMessage = document.getElementById('no-results');
    const clearSearchBtn = document.querySelector('.clear-search-btn'); // Sélectionne le bouton "Clear"

    /**
     * Fonction utilitaire pour échapper les caractères HTML spéciaux.
     * C'est crucial pour prévenir les attaques de type Cross-Site Scripting (XSS)
     * lorsque vous insérez des données dynamiques dans le DOM.
     * @param {string} str La chaîne de caractères à échapper.
     * @returns {string} La chaîne échappée.
     */
    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /**
     * Gère la soumission du formulaire de recherche via AJAX.
     */
    if (searchForm && searchInput && postsFeed) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = searchInput.value.trim();

            postsFeed.innerHTML = '<p style="text-align: center; margin-top: 20px;">Chargement des publications...</p>';
            if (noResultsMessage) {
                noResultsMessage.style.display = 'none';
            }

            fetch(`search_posts.php?search=${encodeURIComponent(query)}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Erreur HTTP ! Statut: ${res.status}`);
                    }
                    return res.json();
                })
                .then(posts => {
                    postsFeed.innerHTML = ''; // Vide le feed avant d'ajouter de nouveaux posts

                    if (posts.length === 0) {
                        if (noResultsMessage) {
                            noResultsMessage.style.display = 'block';
                            noResultsMessage.textContent = `Aucun résultat trouvé pour "${escapeHTML(query)}".`;
                        } else {
                            postsFeed.innerHTML = `<p style="text-align: center; margin-top: 20px; color: #888;">Aucun résultat trouvé pour "${escapeHTML(query)}".</p>`;
                        }
                    } else {
                        if (noResultsMessage) {
                            noResultsMessage.style.display = 'none';
                        }
                        posts.forEach(post => {
                            const postEl = document.createElement('div');
                            postEl.className = 'post';
                            postEl.dataset.postId = post.id;

                            postEl.innerHTML = `
                                <div class="post-header">
                                    <img src="${escapeHTML(post.avatar || '/uploads/default_avatar.jpg')}" class="post-avatar" alt="Avatar de l'utilisateur">
                                    <span class="post-author">${escapeHTML(post.username)}</span>
                                    <span class="post-date">${new Date(post.created_at).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</span>
                                </div>
                                <div class="post-content">
                                    <p>${escapeHTML(post.content).replace(/\n/g, '<br>')}</p>
                                    ${post.image ? `<img src="${escapeHTML(post.image)}" class="post-image" alt="Image du post">` : ''}
                                </div>
                                <div class="post-interactions">
                                    <div class="actions" data-post-id="${post.id}">
                                        <button class="like-btn"><i class="fas fa-thumbs-up"></i> J'aime</button>
                                        <span class="like-count">${post.likes_count}</span>
                                        <button class="dislike-btn"><i class="fas fa-thumbs-down"></i> Je n'aime pas</button>
                                        <span class="dislike-count">${post.dislikes_count}</span>
                                        <span><i class="fas fa-comments"></i> <span class="comment-count">${post.comment_count}</span></span>
                                    </div>
                                    <button class="toggle-comments-btn">
                                        <i class="fas fa-comments"></i> <span>Afficher les commentaires</span>
                                    </button>
                                </div>
                                <div class="add-comment" style="display: none; margin-top: 10px;">
                                    <textarea id="comment-input-${post.id}" placeholder="Ajouter un commentaire..."></textarea>
                                    <button class="add-comment-btn" data-post-id="${post.id}">Ajouter</button>
                                </div>
                                <div id="comments-${post.id}" class="comments" style="display: none;"></div>
                            `;
                            postsFeed.appendChild(postEl);
                        });
                        // IMPORTANT: Ré-attacher les écouteurs d'événements après avoir ajouté de nouveaux posts
                        bindPostInteractions(postsFeed);
                    }
                })
                .catch(err => {
                    console.error('Error while searching:', err);
                    if (noResultsMessage) {
                        noResultsMessage.style.display = 'block';
                        noResultsMessage.textContent = 'Une erreur est survenue lors de la recherche. Veuillez réessayer plus tard.';
                    }
                    postsFeed.innerHTML = '';
                });
        });
    }

    // Permet de déclencher la recherche en appuyant sur Entrée dans le champ de recherche
    searchInput?.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchForm.dispatchEvent(new Event('submit'));
        }
    });

    // Gère le bouton "Clear" de la recherche
    clearSearchBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        searchInput.value = ''; // Vide le champ de recherche
        searchForm.dispatchEvent(new Event('submit')); // Soumet le formulaire vide pour afficher tous les posts
    });

    // --- Fonctions globales pour les interactions des posts ---

    /**
     * Lie tous les écouteurs d'événements nécessaires aux posts (likes, dislikes, commentaires).
     * Cette fonction est appelée au chargement initial de la page et après chaque nouvelle recherche.
     * @param {HTMLElement} container Le conteneur (ex: .posts-feed) à l'intérieur duquel chercher les posts.
     */
    function bindPostInteractions(container) {
        // Gère les likes/dislikes pour chaque post
        container.querySelectorAll('.actions').forEach(actionDiv => {
            // Supprime les écouteurs existants pour éviter les doublons si la fonction est appelée plusieurs fois
            // Note: C'est important si vous ré-attachez à des éléments existants,
            // mais moins si vous reconstruisez entièrement le DOM du feed.
            // Cependant, cela ne fait pas de mal pour la robustesse.
            const likeBtn = actionDiv.querySelector('.like-btn');
            const dislikeBtn = actionDiv.querySelector('.dislike-btn');
            if (likeBtn) likeBtn.removeEventListener('click', handleLikeDislikeClick);
            if (dislikeBtn) dislikeBtn.removeEventListener('click', handleLikeDislikeClick);

            // Attache les nouveaux écouteurs
            if (likeBtn) likeBtn.addEventListener('click', handleLikeDislikeClick);
            if (dislikeBtn) dislikeBtn.addEventListener('click', handleLikeDislikeClick);

            // Met à jour les compteurs à l'initialisation du post
            updateCounts(actionDiv.dataset.postId, actionDiv.querySelector('.like-count'), actionDiv.querySelector('.dislike-count'));
        });

        // Gère l'affichage/masquage des commentaires et le chargement initial
        container.querySelectorAll('.post').forEach(postEl => {
            const commentsSection = postEl.querySelector('.comments');
            const addCommentSection = postEl.querySelector('.add-comment');
            const toggleBtn = postEl.querySelector('.toggle-comments-btn');
            const postId = postEl.dataset.postId;

            if (!commentsSection || !addCommentSection || !toggleBtn || !postId) return;

            // Supprime les écouteurs existants pour éviter les doublons
            toggleBtn.removeEventListener('click', handleToggleCommentsClick);
            // Attache les nouveaux écouteurs
            toggleBtn.addEventListener('click', handleToggleCommentsClick);
        });

        // Gère l'ajout d'un commentaire principal pour chaque post
        container.querySelectorAll('.add-comment-btn').forEach(btn => {
            // Supprime les écouteurs existants pour éviter les doublons
            btn.removeEventListener('click', handleAddCommentClick);
            // Attache les nouveaux écouteurs
            btn.addEventListener('click', handleAddCommentClick);
        });
    }

    /** Gestionnaire centralisé pour les likes et dislikes */
    function handleLikeDislikeClick() {
        const actionDiv = this.closest('.actions');
        const postId = actionDiv.dataset.postId;
        const isLike = this.classList.contains('like-btn') ? 1 : 0;
        const likeCountSpan = actionDiv.querySelector('.like-count');
        const dislikeCountSpan = actionDiv.querySelector('.dislike-count');

        fetch('/backend/like_dislike.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `target_id=${postId}&target_type=post&is_like=${isLike}`
        })
        .then(() => updateCounts(postId, likeCountSpan, dislikeCountSpan))
        .catch(err => console.error("Erreur lors de l'action like/dislike:", err));
    }

    /** Met à jour les compteurs de likes et dislikes à partir du backend. */
    function updateCounts(postId, likeCountSpan, dislikeCountSpan) {
        fetch(`/backend/like_dislike.php?target_id=${postId}&target_type=post`)
            .then(res => res.json())
            .then(data => {
                likeCountSpan.textContent = data.likes ?? 0;
                dislikeCountSpan.textContent = data.dislikes ?? 0;
            })
            .catch(err => console.error("Erreur mise à jour des compteurs likes/dislikes:", err));
    }

    /** Gestionnaire pour les clics sur le bouton 'Toggle Comments' */
    function handleToggleCommentsClick() {
        const postEl = this.closest('.post');
        const commentsSection = postEl.querySelector('.comments');
        const addCommentSection = postEl.querySelector('.add-comment');
        const toggleBtn = this;
        const postId = postEl.dataset.postId;

        const isVisible = commentsSection.style.display === 'block';

        if (!isVisible) { // Si les commentaires vont être affichés
            loadComments(postId);
        }

        commentsSection.style.display = isVisible ? 'none' : 'block';
        addCommentSection.style.display = isVisible ? 'none' : 'flex';

        const icon = toggleBtn.querySelector('i');
        const text = toggleBtn.querySelector('span');
        icon.className = isVisible ? 'fas fa-comments' : 'fas fa-chevron-up';
        text.textContent = isVisible ? 'Afficher les commentaires' : 'Masquer les commentaires';
    }

    /** Gestionnaire pour les clics sur le bouton 'Add Comment' (principal ou réponse) */
    function handleAddCommentClick() {
        const postId = this.dataset.postId;
        const parentCommentId = this.dataset.parentCommentId || null; // Sera null si ce n'est pas une réponse
        const inputId = parentCommentId ? `reply-input-${parentCommentId}` : `comment-input-${postId}`;
        const input = document.getElementById(inputId);

        if (input && input.value.trim()) {
            addComment(postId, parentCommentId);
        }
    }


    /**
     * Appelle bindPostInteractions pour tous les posts initialement présents sur la page.
     * Cette fonction est appelée une seule fois au chargement complet du DOM.
     */
    function initializePageInteractions() {
        const postsFeedContainer = document.querySelector('.posts-feed');
        if (postsFeedContainer) {
            bindPostInteractions(postsFeedContainer);
        }
    }

    // Lance l'initialisation après que tout le DOM est chargé
    initializePageInteractions();
});

// --- Fonctions globales (déplacées hors de DOMContentLoaded pour être accessibles partout) ---

/**
 * Charge les commentaires pour un post spécifique depuis le backend.
 * @param {string} postId L'ID du post dont on veut charger les commentaires.
 */
function loadComments(postId) {
    fetch(`/backend/get_comments.php?post_id=${postId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erreur HTTP ! Statut: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            const commentsContainer = document.getElementById(`comments-${postId}`);
            if (!commentsContainer) return;
            commentsContainer.innerHTML = renderComments(data);
            bindReplyButtons(); // Ré-attache les écouteurs aux nouveaux boutons de réponse et à leurs formulaires
        })
        .catch(err => console.error("Erreur lors du chargement des commentaires:", err));
}

/**
 * Rend récursivement une liste de commentaires et leurs réponses imbriquées en HTML.
 * @param {Array} comments La liste complète de tous les commentaires (plats).
 * @param {string|null} parentId L'ID du commentaire parent (null pour les commentaires de premier niveau).
 * @returns {string} Le HTML généré pour les commentaires.
 */
function renderComments(comments, parentId = null) {
    let html = '';
    const filteredComments = comments.filter(c => (c.parent_comment_id == parentId) || (!c.parent_comment_id && parentId === null));

    filteredComments.forEach(comment => {
        html += `
            <div class="comment" data-comment-id="${comment.id}">
                <img src="${escapeHTML(comment.avatar ?? '/uploads/default_avatar.jpg')}" class="avatar-mini" alt="Avatar">
                <div class="comment-details">
                    <b>${escapeHTML(comment.username)}</b>: ${escapeHTML(comment.content).replace(/\n/g, '<br>')}
                    <span class="comment-date">${new Date(comment.created_at).toLocaleString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</span>
                </div>
                <button class="reply-btn">Répondre</button>
                <div class="reply-form" style="display: none; flex-direction: column; gap: 0.5rem; margin-top: 10px;">
                    <textarea id="reply-input-${comment.id}" placeholder="Répondre..."></textarea>
                    <button class="add-reply-btn" data-post-id="${comment.post_id}" data-parent-comment-id="${comment.id}">Répondre</button>
                </div>
                <div class="replies" style="display: none; margin-left: 20px;">
                    ${renderComments(comments, comment.id)}
                </div>
            </div>
        `;
    });
    return html;
}

/**
 * Lie les écouteurs d'événements aux boutons "Répondre" et aux boutons "Ajouter réponse".
 * Cette fonction doit être appelée après chaque chargement ou ajout de commentaires.
 */
function bindReplyButtons() {
    // Collecte tous les boutons de réponse et d'ajout de réponse
    const replyButtons = document.querySelectorAll('.reply-btn');
    const addReplyButtons = document.querySelectorAll('.add-reply-btn');

    // Supprime tous les écouteurs existants avant d'en attacher de nouveaux pour éviter les doublons
    replyButtons.forEach(btn => btn.removeEventListener('click', handleReplyButtonClick));
    addReplyButtons.forEach(btn => btn.removeEventListener('click', handleAddReplyButtonClick));

    // Attache les nouveaux écouteurs
    replyButtons.forEach(btn => btn.addEventListener('click', handleReplyButtonClick));
    addReplyButtons.forEach(btn => btn.addEventListener('click', handleAddReplyButtonClick));
}

/** Gestionnaire pour les clics sur le bouton 'Reply' */
function handleReplyButtonClick() {
    const commentDiv = this.closest('.comment');
    const replyForm = commentDiv.querySelector('.reply-form');
    const repliesDiv = commentDiv.querySelector('.replies');

    // Bascule l'affichage du formulaire de réponse
    replyForm.style.display = replyForm.style.display === 'flex' ? 'none' : 'flex';
    // Bascule l'affichage des réponses imbriquées (si elles existent)
    if (repliesDiv) { // Vérifie si l'élément repliesDiv existe
        repliesDiv.style.display = repliesDiv.style.display === 'block' ? 'none' : 'block';
    }
}

/** Gestionnaire pour les clics sur le bouton 'Add Reply' */
function handleAddReplyButtonClick() {
    const postId = this.dataset.postId;
    const parentCommentId = this.dataset.parentCommentId;
    const replyInput = document.getElementById(`reply-input-${parentCommentId}`);
    if (replyInput && replyInput.value.trim()) {
        addComment(postId, parentCommentId);
    }
}

/**
 * Ajoute un nouveau commentaire ou une réponse à un post via AJAX.
 * @param {string} postId L'ID du post concerné.
 * @param {string|null} parentCommentId L'ID du commentaire parent (null si c'est un commentaire principal).
 */
function addComment(postId, parentCommentId = null) {
    const inputId = parentCommentId ? `reply-input-${parentCommentId}` : `comment-input-${postId}`;
    const input = document.getElementById(inputId);
    if (!input) {
        console.error(`L'élément d'entrée avec l'ID ${inputId} est introuvable.`);
        return;
    }

    const content = input.value.trim();
    if (!content) {
        alert("Le contenu du commentaire ne peut pas être vide.");
        return;
    }

    const formData = new URLSearchParams();
    formData.append('post_id', postId);
    formData.append('content', content);
    if (parentCommentId) {
        formData.append('parent_comment_id', parentCommentId);
    }

    fetch('/backend/add_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Erreur HTTP ! Statut: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        if (data.success) {
            // Recharger les commentaires du post spécifique pour inclure le nouveau commentaire
            loadComments(postId);
            input.value = ''; // Vide le champ de saisie

            // Met à jour le compteur de commentaires sur le post concerné
            const commentCountSpan = document.querySelector(`.post[data-post-id="${postId}"] .comment-count`);
            if (commentCountSpan) {
                commentCountSpan.textContent = parseInt(commentCountSpan.textContent) + 1;
            }

            // Si c'est une réponse, masquez le formulaire de réponse après l'envoi
            if (parentCommentId) {
                const parentCommentDiv = document.querySelector(`.comment[data-comment-id="${parentCommentId}"]`);
                if (parentCommentDiv) {
                    parentCommentDiv.querySelector('.reply-form').style.display = 'none';
                }
            }

        } else {
            alert('Échec de l\'ajout du commentaire : ' + (data.message || 'Erreur inconnue.'));
        }
    })
    .catch(err => {
        console.error("Erreur lors de l'ajout du commentaire:", err);
        alert('Une erreur est survenue lors de l\'ajout du commentaire.');
    });
}