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

// テキストの正規化
function normalizeText(text) {
    return text.replace(/<[^>]*>/g, '')  // HTMLタグを削除
               .replace(/[▾]/g, '')       // 特殊文字を削除
               .replace(/\s+/g, ' ')      // 複数の空白を1つに
               .trim();                   // 前後の空白を削除
}

// 翻訳データの読み込み
Promise.all([
    fetch('./js/translations/work_hours-ja.json').then(response => response.json()),
    fetch('./js/translations/work_hours-zh.json').then(response => response.json())
])
.then(([jaData, zhData]) => {
    translations = jaData.translations;
    translationsZh = zhData.translations;
    console.log('翻訳データの読み込みが完了しました');
    
    // 初期言語を設定
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    translatePage(savedLanguage);
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

    // 言語設定を保存
    localStorage.setItem('preferredLanguage', targetLang);

    // タイトルの翻訳
    const title = document.querySelector('title');
    if (title) {
        const titleText = title.textContent;
        if (!originalTexts.has('title')) {
            originalTexts.set('title', titleText);
        }

        if (targetLang === 'en') {
            title.textContent = originalTexts.get('title');
        } else {
            const translation = targetLang === 'ja' 
                ? translations[originalTexts.get('title')] || translations[normalizeText(originalTexts.get('title'))]
                : translationsZh[originalTexts.get('title')] || translationsZh[normalizeText(originalTexts.get('title'))];
            if (translation) {
                title.textContent = translation;
            }
        }
    }

    // ナビゲーションメニューの翻訳
    const navLinks = document.querySelectorAll('.main-nav a, .dropdown-menu a');
    navLinks.forEach(link => {
        const linkText = link.textContent.trim();
        if (!originalTexts.has(link)) {
            originalTexts.set(link, linkText);
        }

        if (targetLang === 'en') {
            link.textContent = originalTexts.get(link);
        } else {
            const translation = targetLang === 'ja'
                ? translations[originalTexts.get(link)] || translations[normalizeText(originalTexts.get(link))]
                : translationsZh[originalTexts.get(link)] || translationsZh[normalizeText(originalTexts.get(link))];
            if (translation) {
                const hasSpecialChar = originalTexts.get(link).includes('▾');
                link.textContent = translation + (hasSpecialChar ? ' ▾' : '');
            }
        }
    });

    // ヒーローセクションの翻訳
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const h1 = heroContent.querySelector('h1');
        const p = heroContent.querySelector('p');
        
        if (h1) {
            const h1Text = h1.textContent;
            if (!originalTexts.has(h1)) {
                originalTexts.set(h1, h1Text);
            }
            
            if (targetLang === 'en') {
                h1.textContent = originalTexts.get(h1);
            } else {
                const translation = targetLang === 'ja'
                    ? translations[originalTexts.get(h1)] || translations[normalizeText(originalTexts.get(h1))]
                    : translationsZh[originalTexts.get(h1)] || translationsZh[normalizeText(originalTexts.get(h1))];
                if (translation) {
                    h1.textContent = translation;
                }
            }
        }

        if (p) {
            const pText = p.textContent;
            if (!originalTexts.has(p)) {
                originalTexts.set(p, pText);
            }
            
            if (targetLang === 'en') {
                p.textContent = originalTexts.get(p);
            } else {
                const translation = targetLang === 'ja'
                    ? translations[originalTexts.get(p)] || translations[normalizeText(originalTexts.get(p))]
                    : translationsZh[originalTexts.get(p)] || translationsZh[normalizeText(originalTexts.get(p))];
                if (translation) {
                    p.textContent = translation;
                }
            }
        }
    }

    // strongタグの翻訳を最初に処理
    const strongElements = document.querySelectorAll('.main-content strong');
    strongElements.forEach(element => {
        // コロンを除いたテキストを取得
        const originalText = element.textContent.replace(':', '').trim();
        
        // 初回のみoriginalTextsに保存
        if (!originalTexts.has(element)) {
            originalTexts.set(element, originalText);
        }

        if (targetLang === 'en') {
            // 英語に戻す場合は、保存された元のテキストを使用
            element.textContent = originalTexts.get(element) + ': ';
        } else {
            // 翻訳を探す（コロンなしのテキストで検索）
            const translation = targetLang === 'ja'
                ? translations[originalTexts.get(element)]
                : translationsZh[originalTexts.get(element)];
            
            if (translation) {
                element.textContent = translation + ': ';
            }
        }
    });

    // その他の要素の翻訳
    const elements = document.querySelectorAll('.main-content p, .main-content h2, .main-content h3, .main-content h4, .main-content h5, .main-content h6, .main-content span, .main-content a, .sidebar a, .translate-btn, button, .main-content li');
    
    for (const element of elements) {
        const originalText = element.textContent;
        
        if (!originalText || !originalText.trim()) {
            continue;
        }

        // リスト項目の場合、strongタグを除いたテキストを翻訳
        if (element.tagName === 'LI') {
            const strongElement = element.querySelector('strong');
            if (strongElement) {
                // strongタグのテキストを取得
                const strongText = strongElement.textContent.replace(':', '').trim();
                const dateText = element.textContent.split(':')[1]?.trim();
                
                if (!originalTexts.has(element)) {
                    originalTexts.set(element, {
                        strong: strongText,
                        date: dateText,
                        originalStrong: strongElement.textContent,  // 元のテキストを保存
                        originalDate: dateText                      // 元の日付を保存
                    });
                }
                
                if (targetLang === 'en') {
                    // 英語に戻す場合は、保存された元のテキストを使用
                    element.innerHTML = `<strong>${originalTexts.get(element).originalStrong}</strong> ${originalTexts.get(element).originalDate}`;
                } else {
                    const strongTranslation = targetLang === 'ja'
                        ? translations[originalTexts.get(element).strong]
                        : translationsZh[originalTexts.get(element).strong];
                    
                    const dateTranslation = targetLang === 'ja'
                        ? translations[originalTexts.get(element).date]
                        : translationsZh[originalTexts.get(element).date];
                    
                    if (strongTranslation && dateTranslation) {
                        element.innerHTML = `<strong>${strongTranslation}:</strong> ${dateTranslation}`;
                    }
                }
            }
            continue;
        }

        if (!originalTexts.has(element)) {
            originalTexts.set(element, originalText);
        }
        
        if (targetLang === 'en') {
            element.textContent = originalTexts.get(element);
        } else {
            const translation = targetLang === 'ja' 
                ? translations[originalTexts.get(element)] || translations[normalizeText(originalTexts.get(element))]
                : translationsZh[originalTexts.get(element)] || translationsZh[normalizeText(originalTexts.get(element))];

            if (translation) {
                const hasSpecialChar = originalTexts.get(element).includes('▾');
                element.textContent = translation + (hasSpecialChar ? ' ▾' : '');
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

 