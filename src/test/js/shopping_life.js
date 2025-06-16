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
function normalizeText(text) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const decodedText = tempDiv.textContent || tempDiv.innerText || "";
    return decodedText.replace(/\s+/g, ' ').trim();
}

// =========================================
// 翻訳データの読み込み
// =========================================
Promise.all([
    fetch('./js/translations/shopping_life-ja.json').then(response => response.json()),
    fetch('./js/translations/shopping_life-zh.json').then(response => response.json())
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
// ページ翻訳の実行 (改善版)
// =========================================

/**
 * 指定されたノードを再帰的に翻訳する
 * @param {Node} node - 処理対象のDOMノード
 * @param {string} targetLang - 翻訳先の言語
 */
function translateNodeRecursively(node, targetLang) {
    // 翻訳対象外のタグはスキップ
    const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT'];
    if (node.nodeType === Node.ELEMENT_NODE && skipTags.includes(node.tagName)) {
        return;
    }

    // 子ノードをループ処理
    for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
            const originalText = child.textContent;
            const trimmedText = originalText.trim();

            if (trimmedText) {
                // 初回のみ元のテキストを保存
                if (!originalTexts.has(child)) {
                    originalTexts.set(child, originalText);
                }

                // 英語の場合は元のテキストに戻す
                if (targetLang === 'en') {
                    child.textContent = originalTexts.get(child);
                    continue;
                }

                const normalizedText = normalizeText(originalTexts.get(child));
                const translationData = targetLang === 'ja' ? translations : translationsZh;

                if (translationData && translationData[normalizedText]) {
                    // 元のテキストの前後の空白を維持
                    const leadingSpace = originalTexts.get(child).match(/^\s*/)[0];
                    const trailingSpace = originalTexts.get(child).match(/\s*$/)[0];
                    child.textContent = leadingSpace + translationData[normalizedText] + trailingSpace;
                }
            }
        } else if (child.nodeType === Node.ELEMENT_NODE) {
            // 要素ノードの場合は再帰的に処理
            translateNodeRecursively(child, targetLang);
        }
    }
}

/**
 * ページ全体の翻訳を実行
 * @param {string} targetLang - 翻訳先の言語（'en', 'ja', 'zh'）
 */
function translatePage(targetLang) {
    if ((targetLang === 'ja' && !translations) || (targetLang === 'zh' && !translationsZh)) {
        console.error('翻訳データが読み込まれていません');
        return;
    }

    // body全体を翻訳の起点とする
    const translatableContent = document.body;
    translateNodeRecursively(translatableContent, targetLang);
    
    // アクティブな言語ボタンの更新
    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.language-option[data-lang="${targetLang}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    currentLanguage = targetLang;
}
