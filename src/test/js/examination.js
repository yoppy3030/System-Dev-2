// =========================================
// グローバル変数の初期化
// =========================================
let currentLanguage = 'en';
let originalTexts = new Map();
let translations = null;
let translationsZh = null;

// DOM要素の取得
const translateBtn = document.getElementById('translateBtn');
const languageDropdown = document.querySelector('.language-dropdown');

// =========================================
// 翻訳機能の初期設定
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // 翻訳ボタンのイベントリスナー
    translateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
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

    // ドキュメント全体のクリックイベント
    document.addEventListener('click', (e) => {
        if (!languageDropdown.contains(e.target) && !translateBtn.contains(e.target)) {
            languageDropdown.classList.remove('show');
        }
    });

    // 翻訳データの読み込み
    loadTranslations();
});

// =========================================
// 翻訳データの読み込み
// =========================================
async function loadTranslations() {
    try {
        const [jaResponse, zhResponse] = await Promise.all([
            fetch('./js/translations/examination-ja.json'),
            fetch('./js/translations/examination-zh.json')
        ]);

        if (!jaResponse.ok || !zhResponse.ok) {
            throw new Error('翻訳データの読み込みに失敗しました');
        }

        const [jaData, zhData] = await Promise.all([
            jaResponse.json(),
            zhResponse.json()
        ]);

        translations = jaData.translations;
        translationsZh = zhData.translations;
        console.log('翻訳データの読み込みが完了しました');
        console.log('日本語翻訳データ:', translations);
        console.log('中国語翻訳データ:', translationsZh);
    } catch (error) {
        console.error('翻訳データの読み込みに失敗しました:', error);
    }
}

// =========================================
// ページ翻訳の実行
// =========================================
function translatePage(targetLang) {
    if (!translations || !translationsZh) {
        console.error('翻訳データが読み込まれていません');
        return;
    }

    console.log('翻訳開始:', targetLang);

    // すべての翻訳対象要素を取得
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, .menu-item, .submenu-item, section');
    
    elements.forEach(element => {
        // 特殊な要素はスキップ
        if (element.id === 'like-count' || element.id === 'dislike-count' || element.id === 'view-count') {
            return;
        }

        // 要素のHTML構造を保存
        const originalHTML = element.innerHTML;
        const originalText = element.textContent.trim();
        
        if (!originalText) return;

        // 初回のみoriginalTextsに保存
        if (!originalTexts.has(element)) {
            originalTexts.set(element, {
                text: originalText,
                html: originalHTML
            });
        }

        // 英語の場合は元のHTMLに戻す
        if (targetLang === 'en') {
            element.innerHTML = originalTexts.get(element).html;
            return;
        }

        // 翻訳の適用
        const normalizedText = normalizeText(originalTexts.get(element).text);
        const translation = targetLang === 'ja' ? translations[normalizedText] : translationsZh[normalizedText];
        
        console.log('翻訳対象:', normalizedText);
        console.log('翻訳結果:', translation);

        if (translation) {
            // 翻訳テキストを適用しつつ、HTMLの構造を保持
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = originalTexts.get(element).html;
            
            // テキストノードのみを翻訳
            const walker = document.createTreeWalker(
                tempDiv,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.trim() === normalizedText) {
                    node.textContent = translation;
                }
            }

            element.innerHTML = tempDiv.innerHTML;
        }
    });

    currentLanguage = targetLang;
}

// =========================================
// ユーティリティ関数
// =========================================
function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
}