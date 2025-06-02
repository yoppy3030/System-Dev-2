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



/* =========================================
   翻訳機能
   ========================================= */
// 翻訳関連の変数
let currentLanguage = 'en';
let originalTexts = new Map();
let translations = null;
let translationsZh = null;

// 翻訳ボタンとドロップダウンの制御
const translateBtn = document.getElementById('translateBtn');
const languageDropdown = document.querySelector('.language-dropdown');

// 翻訳ボタンクリック時の処理
translateBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    languageDropdown.classList.toggle('show');
});

// ドロップダウン外クリックで閉じる
document.addEventListener('click', (e) => {
    if (!languageDropdown.contains(e.target) && !translateBtn.contains(e.target)) {
        languageDropdown.classList.remove('show');
    }
});

// 言語選択オプションのイベントリスナー
document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', () => {
        const targetLang = option.dataset.lang;
        document.querySelectorAll('.language-option').forEach(opt => {
            opt.classList.remove('active');
        });
        option.classList.add('active');
        languageDropdown.classList.remove('show');
        translatePage(targetLang);
    });
});

// テキストの正規化（余分な空白を削除）
function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

// 翻訳データの読み込み
Promise.all([
    fetch('./js/translations/index-ja.json').then(response => response.json()),
    fetch('./js/translations/index-zh.json').then(response => response.json())
])
.then(([jaData, zhData]) => {
    translations = jaData.translations;
    translationsZh = zhData.translations;
    console.log('翻訳データの読み込みが完了しました');
})
.catch(error => {
    console.error('翻訳データの読み込みに失敗しました:', error);
});

// ページ翻訳の実行
function translatePage(targetLang) {
    if (!translations || !translationsZh) {
        console.error('翻訳データが読み込まれていません');
        return;
    }

    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, .sidebar a, .translate-btn, button');
    
    for (const element of elements) {
        // いいねボタン、閲覧数などの特殊な要素は翻訳対象外
        if (element.id === 'like-count' || element.id === 'dislike-count' || element.id === 'view-count') {
            continue;
        }

        // ボタン要素の特別な処理
        if (element.tagName === 'BUTTON') {
            const buttonText = Array.from(element.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join('')
                .trim();

            if (!buttonText) continue;

            if (!originalTexts.has(element)) {
                originalTexts.set(element, buttonText);
            }

            if (targetLang === 'en') {
                const icon = element.querySelector('i');
                if (icon) {
                    element.innerHTML = '';
                    element.appendChild(icon);
                    element.appendChild(document.createTextNode(originalTexts.get(element)));
                } else {
                    element.textContent = originalTexts.get(element);
                }
            } else {
                const normalizedText = normalizeText(originalTexts.get(element));
                const translation = targetLang === 'ja' ? translations[normalizedText] : translationsZh[normalizedText];
                
                if (translation) {
                    const icon = element.querySelector('i');
                    if (icon) {
                        element.innerHTML = '';
                        element.appendChild(icon);
                        element.appendChild(document.createTextNode(translation));
                    } else {
                        element.textContent = translation;
                    }
                }
            }
            continue;
        }

        const originalText = element.textContent;
        
        if (!originalText || !originalText.trim()) {
            continue;
        }

        // 初回のみoriginalTextsに保存
        if (!originalTexts.has(element)) {
            originalTexts.set(element, originalText);
        }
        
        // 英語の場合は元のテキストに戻す
        if (targetLang === 'en') {
            element.textContent = originalTexts.get(element);
            continue;
        }

        const normalizedText = normalizeText(originalTexts.get(element));

        // 言語に応じた翻訳の適用
        if (targetLang === 'ja') {
            if (translations[normalizedText]) {
                element.textContent = translations[normalizedText];
            }
        } else if (targetLang === 'zh') {
            if (translationsZh[normalizedText]) {
                element.textContent = translationsZh[normalizedText];
            }
        }
    }
    
    // アクティブな言語ボタンの更新
    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.language-option[data-lang="' + targetLang + '"]').classList.add('active');
    
    currentLanguage = targetLang;
}