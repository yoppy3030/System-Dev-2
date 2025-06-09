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
    // ハイフンの正規化と空白の正規化
    return text.replace(/[-–—]/g, '-').replace(/\s+/g, ' ').trim();
}

// 翻訳データの読み込み
Promise.all([
    fetch('./js/translations/professional-ja.json').then(response => response.json()),
    fetch('./js/translations/professional-zh.json').then(response => response.json())
])
.then(([jaData, zhData]) => {
    translations = jaData.translations;
    translationsZh = zhData.translations;
    console.log('翻訳データの読み込みが完了しました');
    console.log('日本語翻訳データ:', translations); // デバッグ用
    console.log('中国語翻訳データ:', translationsZh); // デバッグ用
})
.catch(error => {
    console.error('翻訳データの読み込みに失敗しました:', error);
});

function findTranslation(text, translations) {
    // 特殊文字「▾」の有無を確認
    const hasSpecialChar = text.includes('▾');
    const textWithoutSpecialChar = text.replace('▾', '').trim();

    // 完全一致を試みる
    if (translations[text]) {
        return translations[text] + (hasSpecialChar ? ' ▾' : '');
    }

    // 特殊文字なしで試みる
    if (translations[textWithoutSpecialChar]) {
        return translations[textWithoutSpecialChar] + (hasSpecialChar ? ' ▾' : '');
    }

    // 正規化したテキストで試みる
    const normalizedText = normalizeText(textWithoutSpecialChar);
    if (translations[normalizedText]) {
        return translations[normalizedText] + (hasSpecialChar ? ' ▾' : '');
    }

    // キーを正規化して比較
    for (const [key, value] of Object.entries(translations)) {
        if (normalizeText(key.replace('▾', '').trim()) === normalizedText) {
            return value + (hasSpecialChar ? ' ▾' : '');
        }
    }

    return null;
}

// ページ翻訳の実行
function translatePage(targetLang) {
    if (!translations || !translationsZh) {
        console.error('翻訳データが読み込まれていません');
        return;
    }

    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, .sidebar a, .translate-btn, button, section');
    
    for (const element of elements) {
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

        let translation = null;
        if (targetLang === 'ja') {
            translation = findTranslation(originalTexts.get(element), translations);
        } else if (targetLang === 'zh') {
            translation = findTranslation(originalTexts.get(element), translationsZh);
        }

        if (translation) {
            element.textContent = translation;
        } else {
            console.log('翻訳が見つかりませんでした:', originalTexts.get(element));
        }
    }
    
    // アクティブな言語ボタンの更新
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

 