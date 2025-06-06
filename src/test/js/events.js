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
    return text.replace(/\s+/g, ' ')
               .trim()
               .replace(/^- /, '')
               .replace(/&amp;/g, '&');
}

// 翻訳データの読み込み
Promise.all([
    fetch('./js/translations/events-ja.json').then(response => response.json()),
    fetch('./js/translations/events-zh.json').then(response => response.json())
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

    // 翻訳対象の要素を取得（ロゴを除外）
    const elements = document.querySelectorAll('[data-translate], .event-card h2, .event-card .doc-item, .hero-content h1, .hero-content p, .main-nav a, footer h2, footer p, .translate-btn, .language-option');
    
    elements.forEach(element => {
        // 空のテキストはスキップ
        if (!element.textContent || !element.textContent.trim()) {
            return;
        }

        // 初回のみoriginalTextsに保存
        if (!originalTexts.has(element)) {
            originalTexts.set(element, element.textContent);
        }

        // 英語の場合は元のテキストに戻す
        if (targetLang === 'en') {
            element.textContent = originalTexts.get(element);
            return;
        }

        const normalizedText = normalizeText(originalTexts.get(element));
        const translation = targetLang === 'ja' ? translations[normalizedText] : translationsZh[normalizedText];
        
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // アクティブな言語ボタンの更新
    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.language-option[data-lang="' + targetLang + '"]').classList.add('active');
    
    currentLanguage = targetLang;
}