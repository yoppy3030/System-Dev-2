// comments.js
const form = document.getElementById('comment-form');
const commentsContainer = document.getElementById('comments');

// フォームが存在する場合のみイベントリスナーを追加
if (form && commentsContainer) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const comment = document.getElementById('comment').value.trim();

        if (username && comment) {
            const commentDiv = document.createElement('div');
            commentDiv.classList.add('comment');
            commentDiv.innerHTML = `<strong>${username}</strong><p>${comment}</p>`;
            commentsContainer.prepend(commentDiv);
            form.reset();
        }
    });
}

// Wait for navbar to be loaded before initializing culture-specific features
function initializeCultureFeatures() {
    console.log('[culture.js] Initializing culture-specific features');
    
    // Load culture-specific translations
    Promise.all([
        fetch('./js/translations/culture-ja.json').then(response => response.json()).catch(() => ({ translations: {} })),
        fetch('./js/translations/culture-zh.json').then(response => response.json()).catch(() => ({ translations: {} }))
    ])
    .then(([jaData, zhData]) => {
        console.log('[culture.js] Culture translations loaded');
        // Store translations for potential use
        window.cultureTranslations = {
            ja: jaData.translations,
            zh: zhData.translations
        };
    })
    .catch(error => {
        console.error('[culture.js] Failed to load culture translations:', error);
    });
}

// Initialize when DOM is ready and navbar is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for navbar to load
        setTimeout(initializeCultureFeatures, 100);
    });
} else {
    // DOM already loaded, wait for navbar
    setTimeout(initializeCultureFeatures, 100);
}

 