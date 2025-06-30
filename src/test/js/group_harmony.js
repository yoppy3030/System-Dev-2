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
    return text
        .replace(/\s+/g, ' ') // 複数空白を1つに
        .replace(/^\s+|\s+$/g, '') // 前後空白除去
        .toLowerCase();
}

// 翻訳データの読み込み
Promise.all([
    fetch('./js/translations/group_harmony-ja.json').then(response => response.json()),
    fetch('./js/translations/group_harmony-zh.json').then(response => response.json())
])
.then(([jaData, zhData]) => {
    translations = jaData.translations;
    translationsZh = zhData.translations;
    console.log('翻訳データの読み込みが完了しました');
})
.catch(error => {
    console.error('翻訳データの読み込みに失敗しました:', error);
});

function extractAndReplaceStrong(html) {
    // <strong>...</strong> を __STRONG__ に置換し、元のHTMLを返す
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    let strongHtml = '';
    tempDiv.querySelectorAll('strong').forEach(strong => {
        strongHtml = strong.outerHTML;
        strong.replaceWith('__STRONG__');
    });
    return { replaced: tempDiv.textContent, strongHtml };
}

function getTranslation(targetLang, normalized) {
    let dict = targetLang === 'ja' ? translations : translationsZh;
    for (const [key, value] of Object.entries(dict)) {
        // デバッグ出力
        console.log('比較:', normalizeText(key), 'vs', normalized);
        if (normalizeText(key) === normalized) return value;
    }
    return null;
}

// テキストノードだけを翻訳する再帰関数
function translateTextNodes(node, targetLang) {
    for (let child of node.childNodes) {
        if (child.nodeType === Node.TEXT_NODE) {
            const original = child.textContent.trim();
            if (!original) continue;
            // 英語状態のoriginalTextsを使う
            let baseText = child.__originalText || original;
            if (!child.__originalText) child.__originalText = baseText;

            if (targetLang === 'en') {
                child.textContent = child.__originalText;
            } else {
                let translated = getTranslation(targetLang, normalizeText(baseText));
                if (translated) {
                    // テキストノードにはHTMLタグは入れられないので、親がpやliならinnerHTMLで置換
                    if (/<strong>/.test(translated) && child.parentNode.childNodes.length === 1) {
                        child.parentNode.innerHTML = translated;
                    } else {
                        child.textContent = translated;
                    }
                }
            }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            translateTextNodes(child, targetLang);
        }
    }
}

function translatePage(targetLang) {
    if (!translations || !translationsZh) {
        console.error('翻訳データが読み込まれていません');
        return;
    }
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, .sidebar a, .translate-btn, button, section, .section, li');
    elements.forEach(element => {
        translateTextNodes(element, targetLang);
    });

    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.language-option[data-lang="' + targetLang + '"]').classList.add('active');
    currentLanguage = targetLang;
}

// ドロップダウンメニュー表示制御
document.querySelectorAll('.main-nav ul li > a').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const submenu = anchor.nextElementSibling;
    if (submenu && submenu.classList.contains('dropdown-menu')) {
      e.preventDefault();
      submenu.classList.toggle('show');
    }
  });
});

// Optional: close dropdown on click outside
document.addEventListener('click', e => {
  document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
    if (!menu.parentElement.contains(e.target)) {
      menu.classList.remove('show');
    }
  });
});

 