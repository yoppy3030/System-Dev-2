console.log("スクリプトがロードされました！"); // Script chargé !

document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const postsFeed = document.querySelector('.posts-feed');
    const noResultsMessage = document.getElementById('no-results');
    const clearSearchBtn = document.querySelector('.clear-search-btn'); // セレクタ "Clear"

    /**
     * ファンクション escapeHTMLは、HTML特殊文字をエスケープします。
     * これは、動的なデータをDOMに挿入する際の重要なステップです。
     * Cross-Site Scripting (XSS) 攻撃を防ぐために重要です。
     * @param {string} str エスケープする文字列。
     * @returns {string} エスケープされた文字列。
     */
    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    /**
     * 検索フォームの送信イベントを処理します。
     * フォームが送信されると、入力された検索クエリを取得し、
     * サーバーにリクエストを送信して、関連する投稿を取得します。
     * 取得した投稿は、ページ上の投稿フィードに表示されます。
     */
    if (searchForm && searchInput && postsFeed) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = searchInput.value.trim();

            postsFeed.innerHTML = '<p style="text-align: center; margin-top: 20px;">投稿を読み込み中...</p>'; // Chargement des publications...
            if (noResultsMessage) {
                noResultsMessage.style.display = 'none';
            }

            fetch(`search_posts.php?search=${encodeURIComponent(query)}`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`HTTPエラーが発生しました！ステータス: ${res.status}`); // Erreur HTTP ! Statut:
                    }
                    return res.json();
                })
                .then(posts => {
                    postsFeed.innerHTML = ''; // 初期化：投稿フィードを空にする

                    if (posts.length === 0) {
                        if (noResultsMessage) {
                            noResultsMessage.style.display = 'block';
                            noResultsMessage.textContent = `"${escapeHTML(query)}"の検索結果は見つかりませんでした。`; // Aucun résultat trouvé pour "${escapeHTML(query)}".
                        } else {
                            postsFeed.innerHTML = `<p style="text-align: center; margin-top: 20px; color: #888;">"${escapeHTML(query)}"の検索結果は見つかりませんでした。</p>`; // Aucun résultat trouvé pour "${escapeHTML(query)}".
                        }
                    } else {
                        if (noResultsMessage) {
                            noResultsMessage.style.display = 'none';
                        }
                        posts.forEach(post => {
                            const postEl = document.createElement('div');
                            postEl.className = 'post';
                            postEl.dataset.postId = post.id;

                            postEl.innerHTML = `
                                <div class="post-header">
                                    <img src="${escapeHTML(post.avatar || '/uploads/default_avatar.jpg')}" class="post-avatar" alt="ユーザーのアバター">
                                    <span class="post-author">${escapeHTML(post.username)}</span>
                                    <span class="post-date">${new Date(post.created_at).toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</span>
                                </div>
                                <div class="post-content">
                                    <p>${escapeHTML(post.content).replace(/\n/g, '<br>')}</p>
                                    ${post.image ? `<img src="${escapeHTML(post.image)}" class="post-image" alt="投稿画像">` : ''}
                                </div>
                                <div class="post-footer">
                                    <div class="actions" data-post-id="${post.id}">
                                        <button class="like-btn"><i class="fas fa-thumbs-up"></i> いいね！</button>
                                        <span class="like-count">${post.likes_count}</span>
                                        <button class="dislike-btn"><i class="fas fa-thumbs-down"></i> よくないね！</button>
                                        <span class="dislike-count">${post.dislikes_count}</span>
                                        <span><i class="fas fa-comments"></i> <span class="comment-count">${post.comment_count}</span></span>
                                    </div>
                                    <button class="toggle-comments-btn">
                                        <i class="fas fa-comments"></i> <span>コメントを表示</span>
                                    </button>
                                </div>
                                <div class="comments-container">
                                    <div class="add-comment" style="display: none; margin-top: 10px;">
                                        <textarea id="comment-input-${post.id}" placeholder="コメントを追加..."></textarea>
                                        <button class="add-comment-btn" data-post-id="${post.id}">追加</button>
                                    </div>
                                    <div id="comments-${post.id}" class="comments"></div>
                                </div>
                            `;
                            postsFeed.appendChild(postEl);
                        });
                        // 重要: 新しい投稿を追加した後にイベントリスナーを再度バインド
                        bindPostInteractions(postsFeed);
                    }
                })
                .catch(err => {
                    console.error('検索中にエラーが発生しました:', err); // Error while searching:
                    if (noResultsMessage) {
                        noResultsMessage.style.display = 'block';
                        noResultsMessage.textContent = '検索中にエラーが発生しました。後でもう一度お試しください。'; // 検索中にエラーが発生しました。後でもう一度お試しください。
                    }
                    postsFeed.innerHTML = '';
                });
        });
    }

    // 検索入力フィールドでEnterキーを押したときの処理
    // フォームのsubmitイベントをトリガーする
    searchInput?.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchForm.dispatchEvent(new Event('submit'));
        }
    });

    // 検索のクリアボタンを処理
    clearSearchBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        searchInput.value = ''; // 検索フィールドを空にする
        searchForm.dispatchEvent(new Event('submit')); // 空のフォームを送信してすべての投稿を表示
    });

    // --- 投稿のインタラクションのためのグローバル関数 ---

    /**
     * 投稿（いいね、よくないね、コメント）に必要なすべてのイベントリスナーをバインドします。
     * この関数は、ページの初期読み込み時と新しい検索後に呼び出されます。
     * @param {HTMLElement} container 投稿を検索するコンテナ（例：.posts-feed）
     */
    function bindPostInteractions(container) {
        // いいねとよくないねのボタンのイベントリスナーをバインド
        // すべてのアクションボタンに対して、クリックイベントをバインドします。
        // これにより、各投稿のいいねとよくないねのボタンが機能します。
        container.querySelectorAll('.actions').forEach(actionDiv => {
            // 既存のリスナーを削除して、重複を避ける
            // 注意: これは、既存の要素に再バインドする場合に重要ですが、
            // フィードのDOMを完全に再構築する場合はそれほど重要ではありません。
            // ただし、堅牢性のために無駄にはなりません。
            const likeBtn = actionDiv.querySelector('.like-btn');
            const dislikeBtn = actionDiv.querySelector('.dislike-btn');
            if (likeBtn) likeBtn.removeEventListener('click', handleLikeDislikeClick);
            if (dislikeBtn) dislikeBtn.removeEventListener('click', handleLikeDislikeClick);

            // 新しいリスナーをアタッチ
            if (likeBtn) likeBtn.addEventListener('click', handleLikeDislikeClick);
            if (dislikeBtn) dislikeBtn.addEventListener('click', handleLikeDislikeClick);

            // 投稿の初期化時にカウンターを更新
            updateCounts(actionDiv.dataset.postId, actionDiv.querySelector('.like-count'), actionDiv.querySelector('.dislike-count'));
        });

        // コメントの表示/非表示と初期ロードを処理
        container.querySelectorAll('.post').forEach(postEl => {
            const commentsContainer = postEl.querySelector('.comments-container'); // Changed to comments-container
            const addCommentSection = postEl.querySelector('.add-comment');
            const toggleBtn = postEl.querySelector('.toggle-comments-btn');
            const postId = postEl.dataset.postId;

            if (!commentsContainer || !addCommentSection || !toggleBtn || !postId) return;

            // 既存のリスナーを削除して、重複を避ける
            toggleBtn.removeEventListener('click', handleToggleCommentsClick);
            // 新しいリスナーをアタッチ
            toggleBtn.addEventListener('click', handleToggleCommentsClick);
        });

        // 各投稿のメインコメント追加を処理
        container.querySelectorAll('.add-comment-btn').forEach(btn => {
            // 既存のリスナーを削除して、重複を避ける
            btn.removeEventListener('click', handleAddCommentClick);
            // 新しいリスナーをアタッチ
            btn.addEventListener('click', handleAddCommentClick);
        });
    }

    /** いいねとよくないねのアクションのための一元化されたハンドラ */
    function handleLikeDislikeClick() {
        const actionDiv = this.closest('.actions');
        const postId = actionDiv.dataset.postId;
        const isLike = this.classList.contains('like-btn') ? 1 : 0;
        const likeCountSpan = actionDiv.querySelector('.like-count');
        const dislikeCountSpan = actionDiv.querySelector('.dislike-count');

        fetch('http://localhost/Challengers/System-Dev-2/src/test/backend/like_dislike.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `target_id=${postId}&target_type=post&is_like=${isLike}`
        })
        .then(() => updateCounts(postId, likeCountSpan, dislikeCountSpan))
        .catch(err => console.error("いいね/よくないねのアクション中にエラーが発生しました:", err)); // Erreur lors de l'action like/dislike:
    }

    /** バックエンドからいいねとよくないねのカウンターを更新します。 */
    function updateCounts(postId, likeCountSpan, dislikeCountSpan) {
        fetch(`http://localhost/Challengers/System-Dev-2/src/test/backend/like_dislike.php?target_id=${postId}&target_type=post`)
            .then(res => res.json())
            .then(data => {
                likeCountSpan.textContent = data.likes ?? 0;
                dislikeCountSpan.textContent = data.dislikes ?? 0;
            })
            .catch(err => console.error("いいね/よくないねのカウンター更新中にエラーが発生しました:", err)); // Erreur mise à jour des compteurs likes/dislikes:
    }

    /** 'コメントを表示/非表示'ボタンのクリックハンドラー */
    function handleToggleCommentsClick() {
        const postEl = this.closest('.post');
        const commentsContainer = postEl.querySelector('.comments-container'); // Use comments-container
        const addCommentSection = postEl.querySelector('.add-comment');
        const toggleBtn = this;
        const postId = postEl.dataset.postId;

        // Toggle the 'comments-visible' class on the container
        commentsContainer.classList.toggle('comments-visible');

        const isVisible = commentsContainer.classList.contains('comments-visible');

        if (isVisible) { // If comments are about to be displayed
            loadComments(postId);
            addCommentSection.style.display = 'flex'; // Show the add comment section
        } else {
            addCommentSection.style.display = 'none'; // Hide the add comment section
        }

        const icon = toggleBtn.querySelector('i');
        const text = toggleBtn.querySelector('span');
        icon.className = isVisible ? 'fas fa-chevron-up' : 'fas fa-comments'; // Change icon based on visibility
        text.textContent = isVisible ? 'コメントを非表示' : 'コメントを表示'; // Change text based on visibility
    }

    /** 'コメントを追加'ボタン（メインまたは返信）のクリックハンドラー */
    function handleAddCommentClick() {
        const postId = this.dataset.postId;
        const parentCommentId = this.dataset.parentCommentId || null; // Will be null if it's not a reply
        const inputId = parentCommentId ? `reply-input-${parentCommentId}` : `comment-input-${postId}`;
        const input = document.getElementById(inputId);

        if (input && input.value.trim()) {
            addComment(postId, parentCommentId);
        }
    }


    /**
     * ページに最初に存在するすべての投稿に対してbindPostInteractionsを呼び出します。
     * この関数は、DOMが完全にロードされたときに一度だけ呼び出されます。
     */
    function initializePageInteractions() {
        const postsFeedContainer = document.querySelector('.posts-feed');
        if (postsFeedContainer) {
            bindPostInteractions(postsFeedContainer);
        }
    }

    // すべてのDOMがロードされた後に初期化を開始
    initializePageInteractions();
});

// --- グローバル関数 (どこからでもアクセスできるようにDOMContentLoadedの外に移動) ---

/**
 * バックエンドから特定の投稿のコメントをロードします。
 * @param {string} postId コメントをロードする投稿のID。
 */
function loadComments(postId) {
    fetch(`/backend/get_comments.php?post_id=${postId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTPエラーが発生しました！ステータス: ${res.status}`); // HTTPエラーが発生しました！ステータス:
            }
            return res.json();
        })
        .then(data => {
            const commentsContainer = document.getElementById(`comments-${postId}`);
            if (!commentsContainer) return;
            commentsContainer.innerHTML = renderComments(data);
            bindReplyButtons(); // 新しい返信ボタンとそのフォームにリスナーを再アタッチ
        })
        .catch(err => console.error("コメントのロード中にエラーが発生しました:", err)); // コメントのロード中にエラーが発生しました:
}

/**
 * コメントとそのネストされた返信のリストをHTMLで再帰的にレンダリングします。
 * @param {Array} comments すべてのコメントの完全なリスト（フラット）。
 * @param {string|null} parentId 親コメントのID（トップレベルコメントの場合はnull）。
 * @returns {string} 生成されたコメントのHTML。
 */
function renderComments(comments, parentId = null) {
    let html = '';
    const filteredComments = comments.filter(c => (c.parent_comment_id == parentId) || (!c.parent_comment_id && parentId === null));

    filteredComments.forEach(comment => {
        html += `
            <div class="comment" data-comment-id="${comment.id}">
                <img src="${escapeHTML(comment.avatar ?? '/uploads/default_avatar.jpg')}" class="comment-avatar" alt="アバター">
                <div class="comment-body">
                    <div class="comment-author">
                        ${escapeHTML(comment.username)}
                    </div>
                    <div class="comment-text">
                        <p>${escapeHTML(comment.content).replace(/\n/g, '<br>')}</p>
                    </div>
                    <div class="comment-date">
                        ${new Date(comment.created_at).toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    </div>
                    <button class="reply-btn">返信</button>
                    <div class="reply-form">
                        <textarea id="reply-input-${comment.id}" placeholder="返信を書く..."></textarea>
                        <button class="add-reply-btn" data-post-id="${comment.post_id}" data-parent-comment-id="${comment.id}">返信を追加</button>
                    </div>
                </div>
                <div class="replies">
                    ${renderComments(comments, comment.id)}
                </div>
            </div>
        `;
    });
    return html;
}

/**
 * 「返信」ボタンと「返信を追加」ボタンにイベントリスナーをバインドします。
 * この関数は、コメントがロードまたは追加された後に呼び出される必要があります。
 */
function bindReplyButtons() {
    // Collect all reply and add reply buttons
    const replyButtons = document.querySelectorAll('.reply-btn');
    const addReplyButtons = document.querySelectorAll('.add-reply-btn');

    // Remove any existing listeners before attaching new ones to prevent duplicates
    replyButtons.forEach(btn => btn.removeEventListener('click', handleReplyButtonClick));
    addReplyButtons.forEach(btn => btn.removeEventListener('click', handleAddReplyButtonClick));

    // Attach new listeners
    replyButtons.forEach(btn => btn.addEventListener('click', handleReplyButtonClick));
    addReplyButtons.forEach(btn => btn.addEventListener('click', handleAddReplyButtonClick));
}

/** '返信'ボタンのクリックハンドラー */
function handleReplyButtonClick() {
    const commentDiv = this.closest('.comment');
    const replyForm = commentDiv.querySelector('.reply-form');
    const repliesDiv = commentDiv.querySelector('.replies');

    // Toggle the display of the reply form
    // Check if the form is currently visible to apply the correct class for animation
    const isReplyFormVisible = replyForm.style.display === 'flex';

    if (isReplyFormVisible) {
        replyForm.style.display = 'none';
        // Remove 'reply-form-visible' class for CSS transition
        replyForm.classList.remove('reply-form-visible');
    } else {
        replyForm.style.display = 'flex';
        // Add 'reply-form-visible' class to trigger CSS transition
        replyForm.classList.add('reply-form-visible');
    }

    // Toggle the display of nested replies (if they exist)
    if (repliesDiv) { // Check if the repliesDiv element exists
        const isRepliesVisible = repliesDiv.style.display === 'flex';

        if (isRepliesVisible) {
            repliesDiv.style.display = 'none';
            repliesDiv.classList.remove('replies-visible');
        } else {
            repliesDiv.style.display = 'flex';
            repliesDiv.classList.add('replies-visible');
        }
    }
}


/** '返信を追加'ボタンのクリックハンドラー */
function handleAddReplyButtonClick() {
    const postId = this.dataset.postId;
    const parentCommentId = this.dataset.parentCommentId;
    const replyInput = document.getElementById(`reply-input-${parentCommentId}`);
    if (replyInput && replyInput.value.trim()) {
        addComment(postId, parentCommentId);
    }
}

/**
 * AJAXを介して投稿に新しいコメントまたは返信を追加します。
 * @param {string} postId 関連する投稿のID。
 * @param {string|null} parentCommentId 親コメントのID（メインコメントの場合はnull）。
 */
function addComment(postId, parentCommentId = null) {
    const inputId = parentCommentId ? `reply-input-${parentCommentId}` : `comment-input-${postId}`;
    const input = document.getElementById(inputId);
    if (!input) {
        console.error(`ID ${inputId} の入力要素が見つかりません。`); // The input element with ID ${inputId} is not found.
        return;
    }

    const content = input.value.trim();
    if (!content) {
        alert("コメントの内容は空にできません。"); // Le contenu du commentaire ne peut pas être vide.
        return;
    }

    const formData = new URLSearchParams();
    formData.append('post_id', postId);
    formData.append('content', content);
    if (parentCommentId) {
        formData.append('parent_comment_id', parentCommentId);
    }

    fetch('/backend/add_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTPエラーが発生しました！ステータス: ${res.status}`); // HTTPエラーが発生しました！ステータス:
        }
        return res.json();
    })
    .then(data => {
        if (data.success) {
            // 新しいコメントを含めるために、特定の投稿のコメントをリロード
            loadComments(postId);
            input.value = ''; // 入力フィールドをクリア

            // 関連する投稿のコメントカウンターを更新
            const commentCountSpan = document.querySelector(`.post[data-post-id="${postId}"] .comment-count`);
            if (commentCountSpan) {
                commentCountSpan.textContent = parseInt(commentCountSpan.textContent) + 1;
            }

            // If it's a reply, hide the reply form after submission
            if (parentCommentId) {
                const parentCommentDiv = document.querySelector(`.comment[data-comment-id="${parentCommentId}"]`);
                if (parentCommentDiv) {
                    parentCommentDiv.querySelector('.reply-form').style.display = 'none';
                    parentCommentDiv.querySelector('.reply-form').classList.remove('reply-form-visible');
                }
            }

        } else {
            alert('コメントの追加に失敗しました: ' + (data.message || '不明なエラー。')); // Échec de l'ajout du commentaire : Erreur inconnue.
        }
    })
    .catch(err => {
        console.error("コメントの追加中にエラーが発生しました:", err); // コメントの追加中にエラーが発生しました:
        alert('コメントの追加中にエラーが発生しました。'); // Une erreur est survenue lors de l'ajout du commentaire.
    });
}