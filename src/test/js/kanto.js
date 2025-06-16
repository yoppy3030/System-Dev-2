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
translateBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    languageDropdown.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!languageDropdown.contains(e.target) && !translateBtn.contains(e.target)) {
        languageDropdown.classList.remove('show');
    }
});

// 言語選択オプションのイベントリスナー設定
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

// =========================================
// ユーティリティ関数
// =========================================
/**
 * テキストの正規化（HTMLエンティティをデコードし、余分な空白を削除）
 * @param {string} text - 正規化するテキスト
 * @returns {string} 正規化されたテキスト
 */
function normalizeText(text) {
    // 一時的なDOM要素を作成してHTMLエンティティをデコード
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const decodedText = tempDiv.textContent || tempDiv.innerText || "";
    
    // 次に余分な空白を削除
    return decodedText.replace(/\s+/g, ' ').trim();
}

// =========================================
// 翻訳データの読み込み
// =========================================
Promise.all([
    fetch('./js/translations/kanto-ja.json').then(response => response.json()),
    fetch('./js/translations/kanto-zh.json').then(response => response.json())
])
.then(([jaData, zhData]) => {
    translations = jaData.translations;
    translationsZh = zhData.translations;
    console.log('翻訳データの読み込みが完了しました');
})
.catch(error => {
    console.error('翻訳データの読み込みに失敗しました:', error);
});

// =========================================
// ページ翻訳の実行
// =========================================
/**
 * ページ全体の翻訳を実行
 * @param {string} targetLang - 翻訳先の言語（'en', 'ja', 'zh'）
 */
function translatePage(targetLang) {
    if (!translations || !translationsZh) {
        console.error('翻訳データが読み込まれていません');
        return;
    }

    // メニューアイテムの特別な処理
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        const pElement = menuItem.querySelector('p');
        if (pElement) {
            const originalText = pElement.innerHTML;
            if (!originalTexts.has(pElement)) {
                originalTexts.set(pElement, originalText);
            }

            if (targetLang === 'en') {
                pElement.innerHTML = originalTexts.get(pElement);
            } else {
                const normalizedText = normalizeText(originalTexts.get(pElement));
                const translation = targetLang === 'ja' ? translations[normalizedText] : translationsZh[normalizedText];
                if (translation) {
                    pElement.innerHTML = translation;
                }
            }
        }
    });

    // その他の要素の処理
    const elements = document.querySelectorAll('p:not(.menu-item p), h1, h2, h3, h4, h5, h6, span, a:not(.menu-item a), .sidebar a, .translate-btn, button, section, section *');
    
    for (const element of elements) {
        // いいねボタン、閲覧数などの特殊な要素は翻訳対象外
        if (element.id === 'like-count' || element.id === 'dislike-count' || element.id === 'view-count') {
            continue;
        }

        // ボタン要素の特別な処理
        if (element.tagName === 'BUTTON') {
            // アイコン要素を保存
            const icon = element.querySelector('i');
            const iconHTML = icon ? icon.outerHTML : '';
            
            // テキストノードのみを取得
            const textNodes = Array.from(element.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)
                .map(node => node.textContent.trim())
                .join('')
                .trim();

            if (!textNodes) continue;

            if (!originalTexts.has(element)) {
                originalTexts.set(element, textNodes);
            }

            if (targetLang === 'en') {
                element.innerHTML = iconHTML + ' ' + originalTexts.get(element);
            } else {
                const normalizedText = normalizeText(originalTexts.get(element));
                const translation = targetLang === 'ja' ? translations[normalizedText] : translationsZh[normalizedText];
                
                if (translation) {
                    element.innerHTML = iconHTML + ' ' + translation;
                }
            }
            continue;
        }

        const originalText = element.innerHTML;
        
        if (!originalText || !originalText.trim()) {
            continue;
        }

        // 初回のみoriginalTextsに保存
        if (!originalTexts.has(element)) {
            originalTexts.set(element, originalText);
        }
        
        // 英語の場合は元のテキストに戻す
        if (targetLang === 'en') {
            element.innerHTML = originalTexts.get(element);
            continue;
        }

        const normalizedText = normalizeText(originalTexts.get(element));

        // 言語に応じた翻訳の適用
        if (targetLang === 'ja') {
            if (translations[normalizedText]) {
                element.innerHTML = translations[normalizedText];
            }
        } else if (targetLang === 'zh') {
            if (translationsZh[normalizedText]) {
                element.innerHTML = translationsZh[normalizedText];
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