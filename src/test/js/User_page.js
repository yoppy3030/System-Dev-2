// Script chargé !
console.log("スクリプトが読み込まれました！");

// =========================================
// グローバル変数の初期化 (Initialization of Global Variables)
// =========================================
let currentLanguage = 'en'; // 現在の言語 (Current language)
let originalTexts = new Map(); // オリジナルテキストを保存するMap (Map to store original texts)
let translations = null; // 日本語翻訳データ (Japanese translation data)
let translationsZh = null; // 中国語翻訳データ (Chinese translation data)

// =========================================
// DOM要素の取得 (Fetching DOM Elements)
// =========================================
const translateBtn = document.getElementById('translateBtn'); // 翻訳ボタン (Translation button)
const languageDropdown = document.querySelector('.language-dropdown'); // 言語ドロップダウン (Language dropdown)

// =========================================
// 翻訳機能の初期設定 (Initial Setup of Translation Functionality)
// =========================================
if (translateBtn) {
    translateBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // イベントの伝播を停止 (Stop event propagation)
        languageDropdown.classList.toggle('show'); // ドロップダウンの表示/非表示を切り替え (Toggle dropdown visibility)
    });
}

// ドロップダウン外クリックで閉じる (Close dropdown when clicking outside)
document.addEventListener('click', (e) => {
    if (languageDropdown && !languageDropdown.contains(e.target) && translateBtn && !translateBtn.contains(e.target)) {
        languageDropdown.classList.remove('show');
    }
});

// 言語オプションのクリックイベント (Click event for language options)
document.querySelectorAll('.language-option').forEach(option => {
    option.addEventListener('click', () => {
        const targetLang = option.dataset.lang; // クリックされた言語を取得 (Get clicked language)
        document.querySelectorAll('.language-option').forEach(opt => {
            opt.classList.remove('active'); // 全ての言語オプションのアクティブ状態を解除 (Deactivate all language options)
        });
        option.classList.add('active'); // クリックされた言語オプションをアクティブにする (Activate the clicked language option)
        languageDropdown.classList.remove('show'); // ドロップダウンを閉じる (Close the dropdown)
        translatePage(targetLang); // ページを翻訳 (Translate the page)
    });
});

// =========================================
// ユーティリティ関数 (Utility Functions)
// =========================================
// テキストを正規化 (Normalize text)
function normalizeText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

// =========================================
// 翻訳データの読み込み (Loading Translation Data)
// =========================================
// JSONファイルを非同期で読み込む (Asynchronously load JSON files)
Promise.all([
    fetch('./js/translations/User_page-ja.json').then(response => response.json()),
    fetch('./js/translations/User_page-zh.json').then(response => response.json())
])
.then(([jaData, zhData]) => {
    translations = jaData.translations;
    translationsZh = zhData.translations;
    console.log('翻訳データが正常に読み込まれました。'); // Translation data loaded successfully
})
.catch(error => {
    console.error('翻訳データの読み込みに失敗しました:', error); // Failed to load translation data
});

// =========================================
// ページ翻訳の実行 (Executing Page Translation)
// =========================================
function translatePage(targetLang) {
    if (!translations || !translationsZh) {
        console.error('翻訳データがまだ読み込まれていません。'); // Translation data not yet loaded
        return;
    }

    // メニュー項目の翻訳 (Translate menu items)
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        const pElement = menuItem.querySelector('p');
        if (pElement) {
            const originalText = pElement.textContent;
            if (!originalTexts.has(pElement)) {
                originalTexts.set(pElement, originalText);
            }
            if (targetLang === 'en') {
                pElement.textContent = originalTexts.get(pElement);
            } else {
                const normalizedText = normalizeText(originalTexts.get(pElement));
                const translation = targetLang === 'ja' ? translations[normalizedText] : translationsZh[normalizedText];
                if (translation) {
                    pElement.textContent = translation;
                }
            }
        }
    });

    // その他の要素の翻訳 (Translate other elements)
    const elements = document.querySelectorAll('p:not(.menu-item p), h1, h2, h3, h4, h5, h6, span, a:not(.menu-item a), .sidebar a, .translate-btn, button');
    for (const element of elements) {
        // 特定のIDを持つ要素はスキップ (Skip elements with specific IDs)
        if (element.id === 'like-count' || element.id === 'dislike-count' || element.id === 'view-count') {
            continue;
        }
        // ボタン要素の翻訳 (Translate button elements)
        if (element.tagName === 'BUTTON') {
            const icon = element.querySelector('i');
            const iconHTML = icon ? icon.outerHTML : '';
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
        // その他の要素のテキストコンテンツを翻訳 (Translate text content of other elements)
        const originalText = element.textContent;
        if (!originalText || !originalText.trim()) {
            continue;
        }
        if (!originalTexts.has(element)) {
            originalTexts.set(element, originalText);
        }
        if (targetLang === 'en') {
            element.textContent = originalTexts.get(element);
            continue;
        }
        const normalizedText = normalizeText(originalTexts.get(element));
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
    // アクティブな言語ボタンを設定 (Set active language button)
    document.querySelectorAll('.language-option').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.language-option[data-lang="' + targetLang + '"]').classList.add('active');
    currentLanguage = targetLang;
}

// =========================================
// DOMContentLoaded Listener (メイン)
// (Main DOMContentLoaded Listener)
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded がトリガーされました！HTML要素が利用可能です。"); // DOMContentLoaded triggered! HTML elements are available.

    // --- 画像プレビュー機能 (Image Preview Functionality) ---
    const postImageInput = document.getElementById('post-image'); // 投稿画像入力 (Post image input)
    const imagePreviewContainer = document.getElementById('image-preview-container'); // 画像プレビューコンテナ (Image preview container)
    const imagePreview = document.getElementById('image-preview'); // 画像プレビュー (Image preview)
    const removeImageBtn = document.getElementById('remove-image-btn'); // 画像削除ボタン (Remove image button)

    if (postImageInput && imagePreviewContainer && imagePreview && removeImageBtn) {
        imagePreviewContainer.style.display = 'none'; // 初期状態では非表示 (Hidden by default)
        postImageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    imagePreviewContainer.style.display = 'block'; // 画像選択時に表示 (Show when image is selected)
                };
                reader.readAsDataURL(file);
            }
        });
        removeImageBtn.addEventListener('click', function() {
            postImageInput.value = ''; // ファイル入力をクリア (Clear file input)
            imagePreview.src = '#'; // プレビュー画像をリセット (Reset preview image)
            imagePreviewContainer.style.display = 'none'; // プレビューを非表示 (Hide preview)
        });
    }

    // --- ドロップダウンメニュー機能 (Dropdown Menu Functionality) ---
    const dropdownBtn = document.getElementById('dropdown-btn'); // ドロップダウンボタン (Dropdown button)
    const dropdownContent = document.getElementById('dropdown-content'); // ドロップダウンコンテンツ (Dropdown content)
    if (dropdownBtn && dropdownContent) {
        dropdownBtn.addEventListener('click', function() {
            dropdownContent.classList.toggle('show'); // ドロップダウンの表示/非表示を切り替え (Toggle dropdown visibility)
        });
    }

    // ウィンドウクリックでドロップダウンを閉じる (Close dropdown when clicking anywhere else on window)
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown-btn') && !event.target.matches('.dropdown-btn *')) {
            if (dropdownContent && dropdownContent.classList.contains('show')) {
                dropdownContent.classList.remove('show');
            }
        }
    });

    // --- コメント管理 (Handling Comments) ---
    // コメント表示/非表示ボタン (Toggle Comments button)
    document.querySelectorAll('.toggle-comments-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const commentsContainer = this.nextElementSibling; // 次の兄弟要素がコメントコンテナ (Next sibling is comments container)
            if (commentsContainer && commentsContainer.classList.contains('comments-container')) {
                commentsContainer.classList.toggle('comments-visible'); // コメントコンテナの表示を切り替え (Toggle comments container visibility)

                const icon = this.querySelector('i'); // アイコン (Icon)
                if (icon) {
                    icon.classList.toggle('fa-chevron-down'); // 下向き矢印 (Chevron down)
                    icon.classList.toggle('fa-chevron-up'); // 上向き矢印 (Chevron up)
                }

                const text = this.querySelector('span'); // テキスト (Text)
                if (text) {
                    text.textContent = commentsContainer.classList.contains('comments-visible') ? 'Hide Comments' : 'Show Comments';
                }
            }
        });
    });

    // 返信機能 (Reply Functionality) - イベント委譲を使用 (Using event delegation)
    document.body.addEventListener('click', event => {
        let target = event.target;

        // 返信フォームの表示/非表示 (Toggle reply form)
        if (target.classList.contains('reply-btn')) {
            event.preventDefault();
            const replyForm = target.nextElementSibling; // 返信ボタンの次の兄弟要素 (Next sibling of reply button)
            if (replyForm && replyForm.classList.contains('reply-form')) {
                replyForm.style.display = replyForm.style.display === 'block' ? 'none' : 'block';
                console.log('返信フォームの表示が切り替わりました。'); // Reply form visibility toggled.
            }
        }

        // 返信投稿ボタン (Post Reply Button)
        if (target.classList.contains('post-reply-btn')) {
            event.preventDefault();
            const commentId = target.dataset.commentId; // コメントID (Comment ID)
            const postId = target.dataset.postId; // 投稿ID (Post ID)
            const textarea = document.getElementById(`reply-input-${commentId}`); // 対応するテキストエリア (Corresponding textarea)
            const content = textarea ? textarea.value.trim() : '';

            console.log(`返信を投稿しようとしています: 投稿ID=${postId}, コメントID=${commentId}, 内容="${content}"`); // Attempting to post reply: PostID, CommentID, Content

            if (!content) {
                alert("返信を入力してください。"); // Please enter a reply.
                return;
            }

            addComment(postId, commentId, content, () => {
                if (textarea) textarea.value = ''; // テキストエリアをクリア (Clear textarea)
                const form = document.getElementById(`reply-form-${commentId}`);
                if (form) form.style.display = 'none'; // フォームを非表示 (Hide form)
                loadComments(postId); // コメントを再読み込み (Reload comments)
                console.log('返信が正常に投稿されました。'); // Reply posted successfully.
            });
        }
    });

    // --- いいね/よくないね機能 (Like/Dislike Functionality) ---
    // イベント委譲を使用 (Using event delegation)
    console.log("いいね/よくないねのリスナーを委譲によってアタッチしようとしています..."); // Attempting to attach like/dislike listeners via delegation...

    document.body.addEventListener('click', event => {
        let target = event.target;

        // いいねボタンのクリック (Click on Like button)
        const likeBtn = target.closest('.like-btn'); // クリックされた要素から最も近い.like-btnを探す (Find the closest .like-btn from the clicked element)
        if (likeBtn) {
            event.preventDefault(); // デフォルトの動作を防止 (Prevent default behavior)
            const actionDiv = likeBtn.closest('.actions'); // 最も近い.actions divを探す (Find the closest .actions div)
            if (actionDiv) {
                const postId = actionDiv.dataset.postId; // post IDを取得 (Get post ID)
                const likeCountSpan = actionDiv.querySelector('.like-count'); // いいね数表示要素 (Like count display element)
                const dislikeCountSpan = actionDiv.querySelector('.dislike-count'); // よくないね数表示要素 (Dislike count display element)
                console.log(`いいねボタンがクリックされました: 投稿ID: ${postId}`); // Like button clicked for Post ID:
                handleLikeDislike(postId, 1, likeCountSpan, dislikeCountSpan); // いいね/よくないね処理関数を呼び出し (Call like/dislike handler function)
            }
        }

        // よくないねボタンのクリック (Click on Dislike button)
        const dislikeBtn = target.closest('.dislike-btn'); // クリックされた要素から最も近い.dislike-btnを探す (Find the closest .dislike-btn from the clicked element)
        if (dislikeBtn) {
            event.preventDefault(); // デフォルトの動作を防止 (Prevent default behavior)
            const actionDiv = dislikeBtn.closest('.actions'); // 最も近い.actions divを探す (Find the closest .actions div)
            if (actionDiv) {
                const postId = actionDiv.dataset.postId; // post IDを取得 (Get post ID)
                const likeCountSpan = actionDiv.querySelector('.like-count'); // いいね数表示要素 (Like count display element)
                const dislikeCountSpan = actionDiv.querySelector('.dislike-count'); // よくないね数表示要素 (Dislike count display element)
                console.log(`よくないねボタンがクリックされました: 投稿ID: ${postId}`); // Dislike button clicked for Post ID:
                handleLikeDislike(postId, 0, likeCountSpan, dislikeCountSpan); // いいね/よくないね処理関数を呼び出し (Call like/dislike handler function)
            }
        }
    });

    // --- 投稿コメントボタンのクリック処理 (Handle Post Comment Button Clicks) ---
    document.querySelectorAll('.post-comment-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const postId = btn.dataset.postId; // 投稿ID (Post ID)
            const textarea = document.getElementById(`comment-input-${postId}`); // コメント入力テキストエリア (Comment input textarea)
            const content = textarea ? textarea.value.trim() : '';
            console.log(`コメントを投稿しようとしています: 投稿ID=${postId}, 内容="${content}"`); // Attempting to post comment: PostID, Content

            if (!content) return alert("コメントを入力してください。"); // Please enter a comment.

            addComment(postId, null, content, () => {
                if (textarea) textarea.value = ''; // テキストエリアをクリア (Clear textarea)
                loadComments(postId); // コメントを再読み込み (Reload comments)
                console.log('コメントが正常に投稿されました。'); // Comment posted successfully.
            });
        });
    });

    // --- 投稿削除機能 (Delete Post Functionality) ---
    document.querySelectorAll('.delete-post-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // aタグのデフォルト動作を防止 (Prevent default behavior of <a> tag)
            const postId = btn.dataset.postId; // 投稿ID (Post ID)
            if (!confirm("本当にこの投稿を削除しますか？")) return; // 確認ダイアログ (Confirmation dialog)
            console.log(`投稿ID: ${postId} の削除を試みています...`); // Attempting to delete post ID:

            fetch('/Challengers/System-Dev-2/src/test/backend/delete_post.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `post_id=${postId}` // 投稿IDを送信 (Send post ID)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    btn.closest('.post').remove(); // DOMから投稿要素を削除 (Remove post element from DOM)
                    console.log(`投稿ID: ${postId} が削除されました。`); // Post ID: deleted.
                } else {
                    alert(data.error || '投稿の削除に失敗しました'); // Failed to delete post
                    console.error("投稿の削除エラー:", data.error); // Post deletion error:
                }
            })
            .catch(err => {
                console.error("削除中にエラーが発生しました:", err); // An error occurred during deletion:
                alert("削除中にエラーが発生しました。"); // An error occurred during deletion.
            });
        });
    });

    // ページ読み込み時にすべての投稿のコメントを読み込む (Load comments for all posts when page loads)
    window.addEventListener('load', () => {
        console.log("ウィンドウがロードされました。コメントの初期読み込みを開始します..."); // Window loaded. Starting initial comment load...
        document.querySelectorAll('.post').forEach(postElement => {
            const postId = postElement.dataset.postId;
            loadComments(postId);
        });
    });
}); // DOMContentLoadedの終わり (End of DOMContentLoaded)

// =========================================
// グローバル関数 (Global Functions)
// (これらはDOMContentLoadedの外で定義され、どこからでもアクセス可能)
// (These are defined outside DOMContentLoaded and are accessible from anywhere)
// =========================================

/**
 * いいね/よくないねを処理する関数 (Function to handle like/dislike)
 * @param {number} targetId - 投稿またはコメントのID (ID of the post or comment)
 * @param {number} isLike - 1ならいいね、0ならよくないね (1 for like, 0 for dislike)
 * @param {HTMLElement} likeCountSpan - いいね数表示用の<span>要素 (<span> element for like count display)
 * @param {HTMLElement} dislikeCountSpan - よくないね数表示用の<span>要素 (<span> element for dislike count display)
 */
function handleLikeDislike(targetId, isLike, likeCountSpan, dislikeCountSpan) {
    console.log(`handleLikeDislike が呼び出されました: 投稿 ${targetId}, いいね: ${isLike}`); // handleLikeDislike called for post, isLike:
    const backendUrl = '/Challengers/System-Dev-2/src/test/backend/like_dislike.php';

    fetch(backendUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `target_id=${targetId}&target_type=post&is_like=${isLike}` // データをURLエンコード形式で送信 (Send data in URL-encoded format)
    })
    .then(response => {
        if (!response.ok) { // レスポンスが正常でない場合 (If response is not OK)
            return response.json().then(errorData => {
                throw new Error(errorData.message || `HTTPエラー！ ステータス: ${response.status}`); // HTTP error! Status:
            });
        }
        return response.json(); // JSONレスポンスを解析 (Parse JSON response)
    })
    .then(data => {
        if (data.success) { // 成功した場合 (If successful)
            if (likeCountSpan) likeCountSpan.textContent = data.likes; // いいね数を更新 (Update like count)
            if (dislikeCountSpan) dislikeCountSpan.textContent = data.dislikes; // よくないね数を更新 (Update dislike count)
            console.log("いいね/よくないねアクションが成功しました。新しいカウント:", data); // Like/Dislike action successful. New counts:
        } else {
            alert('アクション失敗: ' + (data.message || '不明なエラー。')); // Action failed: Unknown error.
            console.error("サーバーがエラーを報告しました:", data.message); // Server reported an error:
        }
    })
    .catch(error => {
        console.error("いいね/よくないねアクション中にエラーが発生しました:", error.message); // An error occurred during like/dislike action:
        alert("エラーが発生しました: " + error.message); // An error occurred:
    });
}

/**
 * コメントを再帰的にレンダリングする関数 (Function to recursively render comments)
 * @param {Array<Object>} comments - コメントの配列 (Array of comments)
 * @param {number|null} parentId - 親コメントのID (Parent comment ID)
 * @returns {string} - 生成されたHTML文字列 (Generated HTML string)
 */
function renderComments(comments, parentId = null) {
    let html = '';
    // 親コメントIDに基づいてフィルタリングし、ソート (Filter by parent comment ID and sort)
    comments.filter(c => c.parent_comment_id == parentId)
            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // 作成日でソート (Sort by creation date)
            .forEach(comment => {
        html += `
            <div class="comment" data-comment-id="${comment.id}">
                <img src="${comment.avatar || 'images/default-avatar.png'}" class="comment-avatar">
                <div class="comment-content">
                    <strong>${comment.username}</strong>
                    <p>${comment.content.replace(/\n/g, '<br>')}</p>
                    <button class="reply-btn">Reply</button>
                    <div class="reply-form" id="reply-form-${comment.id}" style="display:none; margin-top: 10px;">
                        <textarea id="reply-input-${comment.id}" placeholder="Write a reply..."></textarea>
                        <button class="post-reply-btn" data-comment-id="${comment.id}" data-post-id="${comment.post_id}">Post Reply</button>
                    </div>
                    ${renderComments(comments, comment.id)}</div>
            </div>
        `;
    });
    return html;
}

/**
 * 特定の投稿のコメントをサーバーから読み込む関数 (Function to load comments for a specific post from the server)
 * @param {number} postId - コメントを読み込む投稿のID (ID of the post to load comments for)
 */
function loadComments(postId) {
    console.log(`投稿ID: ${postId} のコメントを読み込もうとしています...`); // Attempting to load comments for Post ID:
    fetch(`/Challengers/System-Dev-2/src/test/backend/get_comments.php?post_id=${postId}`)
        .then(res => {
            if (!res.ok) {
                console.error(`コメント読み込み中のHTTPエラー: ${res.status}`); // HTTP error during comment loading:
                throw new Error('ネットワーク応答が正常ではありませんでした'); // Network response was not ok
            }
            return res.json();
        })
        .then(data => {
            console.log(`投稿 ${postId} のコメントが読み込まれました:`, data); // Comments loaded for post:
            const container = document.getElementById(`comments-${postId}`); // コメントコンテナを取得 (Get comment container)
            if (container) {
                container.innerHTML = renderComments(data); // コメントをレンダリングしてHTMLを更新 (Render comments and update HTML)
            } else {
                console.warn(`投稿ID: ${postId} のコメントコンテナが見つかりませんでした`); // Comment container not found for Post ID:
            }
        })
        .catch(err => console.error('コメントの読み込みエラー:', err)); // Comment loading error:
}

/**
 * コメント（または返信）をサーバーに追加する関数 (Function to add a comment (or reply) to the server)
 * @param {number} postId - 関連する投稿のID (ID of the associated post)
 * @param {number|null} parentCommentId - 親コメントのID（トップレベルコメントの場合はnull） (Parent comment ID (null for top-level comments))
 * @param {string} content - コメントの内容 (Comment content)
 * @param {function} callback - コメントが正常に投稿された後に実行されるコールバック関数 (Callback function to execute after comment is successfully posted)
 */
function addComment(postId, parentCommentId, content, callback) {
    console.log(`コメントを送信しています: 投稿ID=${postId}, 親ID=${parentCommentId}, 内容="${content}"`); // Sending comment: PostID, ParentID, Content
    const formData = new URLSearchParams(); // フォームデータを準備 (Prepare form data)
    formData.append('post_id', postId);
    formData.append('content', content);
    if (parentCommentId) formData.append('parent_comment_id', parentCommentId); // 親コメントIDがあれば追加 (Add parent comment ID if exists)

    fetch('/Challengers/System-Dev-2/src/test/backend/add_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString() // フォームデータを送信 (Send form data)
    })
    .then(res => {
        if (!res.ok) {
            console.error(`コメント追加中のHTTPエラー: ${res.status}`); // HTTP error during comment addition:
            throw new Error('ネットワーク応答が正常ではありませんでした'); // Network response was not ok
        }
        return res.json();
        
        
    })
    .then(data => {
        if (data.success) {
            console.log('サーバーからの応答（コメント追加）:', data); // Server response (comment addition):
            if (callback) callback(); // コールバックを実行 (Execute callback)
        } else {
            alert('コメントの投稿に失敗しました。'); // Failed to post comment.
            console.error('サーバーエラー（コメント追加）:', data.message); // Server error (comment addition):
        }
    })
    .catch(err => {
        console.error('コメントの追加中にエラーが発生しました:', err); // An error occurred while adding the comment:
        alert('コメントの追加中にエラーが発生しました。コンソールを確認してください。'); // An error occurred while adding the comment. Check console.
    });
}