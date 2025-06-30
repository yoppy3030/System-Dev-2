const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

if (!userId) {
    document.getElementById('user-info').innerText = "ID utilisateur manquant";
} else {
    fetch(`../backend/get_user.php?user_id=${userId}`)
    .then(res => res.json())
    .then(user => {
        if(user.error) {
            document.getElementById('user-info').innerText = user.error;
            return;
        }
        const infoDiv = document.getElementById('user-info');
        infoDiv.innerHTML = `
            <img src="../${user.avatar}" alt="avatar" width="100" />
            <h2>${user.username}</h2>
            <p><strong>Pays :</strong> ${user.country}</p>
            <p><strong>Type :</strong> ${user.activity}</p>
            <p><strong>Bio :</strong> ${user.bio || ''}</p>
            <p><strong>Inscrit depuis :</strong> ${new Date(user.registration_date).toLocaleDateString()}</p>
            <p><strong>Localisation :</strong> ${user.location || ''}</p>
        `;
    });

    // Charger posts utilisateur
    fetch(`../backend/get_user_posts.php?user_id=${userId}`)
    .then(res => res.json())
    .then(posts => {
        if(posts.error) {
            document.getElementById('user-posts').innerText = posts.error;
            return;
        }
        const container = document.getElementById('user-posts');
        container.innerHTML = '';
        posts.forEach(post => {
            const div = document.createElement('div');
            div.className = 'post';
            div.innerHTML = `
                <p>${post.content || ''}</p>
                ${post.image ? `<img src="../${post.image}" alt="image post" width="200" />` : ''}
                <p><small>Posté le ${new Date(post.created_at).toLocaleString()}</small></p>
                <button class="like-btn" data-id="${post.id}" data-type="post">👍</button>
                <button class="dislike-btn" data-id="${post.id}" data-type="post">👎</button>
                <span class="like-count" data-id="${post.id}" data-type="post">0</span>
                <span class="dislike-count" data-id="${post.id}" data-type="post">0</span>
                <div class="comments-section">
                    <div class="comments-container"></div>
                    <textarea class="comment-input" placeholder="Écrire un commentaire..."></textarea>
                    <button class="submit-comment" data-post-id="${post.id}">Envoyer</button>
                </div>
            `;
            container.appendChild(div);
        });
        // Ajouter les listeners likes/comments (réutiliser fonctions de posts.js)
        // Tu peux importer ou copier la logique d'interaction like/dislike et commentaires ici.
    });
}
