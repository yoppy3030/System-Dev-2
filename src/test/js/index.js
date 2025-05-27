// Initialisation des compteurs
let likeCount = 0;
let dislikeCount = 0;
let viewCount = 0;

// Éléments du DOM
const likeBtn = document.getElementById("like-btn");
const dislikeBtn = document.getElementById("dislike-btn");
const likeCountElement = document.getElementById("like-count");
const dislikeCountElement = document.getElementById("dislike-count");
const viewCountElement = document.getElementById("view-count");

// Simuler un chargement de page (incrémenter les vues)
window.onload = function() {
    viewCount++;
    viewCountElement.textContent = viewCount;
};

// Gestion des Likes/Dislikes
likeBtn.addEventListener("click", () => {
    likeCount++;
    likeCountElement.textContent = likeCount;
});

dislikeBtn.addEventListener("click", () => {
    dislikeCount++;
    dislikeCountElement.textContent = dislikeCount;
});


// show menu content

const dropdownBtn = document.getElementById("dropdown-btn");
const dropdownContent = document.getElementById("dropdown-content");

// Au clic sur le bouton, afficher/masquer le menu
dropdownBtn.addEventListener("click", () => {
    dropdownContent.classList.toggle("show");
});

// Fermer le menu si on clique ailleurs
window.addEventListener("click", (e) => {
    if (!e.target.matches('.dropdown-btn')) {
        dropdownContent.classList.remove("show");
    }
});