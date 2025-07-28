document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM要素 ---
    const userTableBody = document.getElementById('user-table-body');
    const quizTableBody = document.getElementById('quiz-table-body');
    const totalUsersCountEl = document.getElementById('total-users-count');
    const helpfulFeedbackCountEl = document.getElementById('helpful-feedback-count');
    const unhelpfulFeedbackCountEl = document.getElementById('unhelpful-feedback-count');
    
    // User Modals
    const deleteUserModal = document.getElementById('delete-confirm-modal');
    const backDeleteBtn = document.getElementById('back-delete-btn');
    const confirmDeleteUserBtn = document.getElementById('confirm-delete-btn');
    const deleteUserNameEl = document.getElementById('delete-user-name');
    const editUserModal = document.getElementById('edit-user-modal');
    const editUserForm = document.getElementById('edit-user-form');
    const backEditBtn = document.getElementById('back-edit-btn');
    
    // Quiz Modals & Form Elements
    const quizEditorModal = document.getElementById('quiz-editor-modal');
    const quizEditorForm = document.getElementById('quiz-editor-form');
    const quizEditorTitle = document.getElementById('quiz-editor-title');
    const backQuizEditorBtn = document.getElementById('back-quiz-editor-btn');
    const addQuizBtn = document.getElementById('add-quiz-btn');
    const deleteQuizModal = document.getElementById('delete-quiz-confirm-modal');
    const deleteQuizQuestionEl = document.getElementById('delete-quiz-question');
    const backDeleteQuizBtn = document.getElementById('back-delete-quiz-btn');
    const confirmDeleteQuizBtn = document.getElementById('confirm-delete-quiz-btn');

    // Navigation
    const sidebarNav = document.getElementById('sidebar-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const adminSections = document.querySelectorAll('.admin-section');

    // State variables
    let userIdToDelete = null;
    let quizIdToDelete = null;

    /**
     * 初期化関数
     */
    function initialize() {
        setupEventListeners();
        fetchDashboardStats();
        fetchAndRenderFeedbackStats();
        fetchAndRenderUsers();
        fetchAndRenderQuizzes();
        const initialHash = window.location.hash || '#dashboard';
        switchSection(initialHash);
    }

    /**
     * イベントリスナーをまとめて設定
     */
    function setupEventListeners() {
        // Navigation
        sidebarNav.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (!navLink) return;
            e.preventDefault();
            switchSection(navLink.getAttribute('href'));
        });

        // User Management
        userTableBody.addEventListener('click', handleUserTableClick);
        confirmDeleteUserBtn.addEventListener('click', executeUserDelete);
        backDeleteBtn.addEventListener('click', closeDeleteUserModal);
        deleteUserModal.addEventListener('click', (e) => e.target === deleteUserModal && closeDeleteUserModal());
        editUserForm.addEventListener('submit', handleUserEditSubmit);
        backEditBtn.addEventListener('click', closeEditUserModal);
        editUserModal.addEventListener('click', (e) => e.target === editUserModal && closeEditUserModal());

        // Quiz Management Event Listeners
        quizTableBody.addEventListener('click', handleQuizTableClick);
        addQuizBtn.addEventListener('click', openQuizEditorForAdd);
        quizEditorForm.addEventListener('submit', handleQuizFormSubmit);
        backQuizEditorBtn.addEventListener('click', closeQuizEditorModal);
        quizEditorModal.addEventListener('click', (e) => e.target === quizEditorModal && closeQuizEditorModal());
        confirmDeleteQuizBtn.addEventListener('click', executeQuizDelete);
        backDeleteQuizBtn.addEventListener('click', closeDeleteQuizModal);
        deleteQuizModal.addEventListener('click', (e) => e.target === deleteQuizModal && closeDeleteQuizModal());
    }
    
    /**
     * 表示するセクションを切り替える
     */
    function switchSection(targetHash) {
        const targetId = targetHash.substring(1);
        navLinks.forEach(link => {
            const isActive = link.getAttribute('href') === targetHash;
            link.classList.toggle('bg-gray-700', isActive);
            link.classList.toggle('text-gray-100', isActive);
            link.classList.toggle('text-gray-300', !isActive);
        });
        adminSections.forEach(section => {
            section.classList.toggle('hidden', section.id !== targetId);
        });
        window.location.hash = targetId;
    }

    /**
     * APIリクエストを送信する汎用関数
     * @param {string} url - APIのエンドポイント
     * @param {object} options - fetchのオプション
     * @returns {Promise<any>} - JSONレスポンス
     */
    async function apiRequest(url, options = {}) {
        try {
            let requestUrl = url;
            // ▼▼▼【修正】GETリクエストにキャッシュ無効化パラメータを追加 ▼▼▼
            if (!options.method || options.method.toUpperCase() === 'GET') {
                requestUrl += (url.includes('?') ? '&' : '?') + '_=' + new Date().getTime();
            }
            // ▲▲▲
            const response = await fetch(requestUrl, options);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'API request failed');
            }
            return result;
        } catch (error) {
            console.error('API Error:', error);
            alert(`エラー: ${error.message}`);
            throw error;
        }
    }

    // --- Data Fetching & Rendering ---

    async function fetchDashboardStats() {
        try {
            const data = await apiRequest('api.php?action=get_dashboard_stats');
            if (totalUsersCountEl) totalUsersCountEl.textContent = data.total_users || '0';
        } catch (error) {
            if (totalUsersCountEl) totalUsersCountEl.textContent = 'エラー';
        }
    }

    async function fetchAndRenderFeedbackStats() {
        try {
            const data = await apiRequest('api.php?action=get_feedback_stats');
            if (helpfulFeedbackCountEl) helpfulFeedbackCountEl.textContent = data.helpful || '0';
            if (unhelpfulFeedbackCountEl) unhelpfulFeedbackCountEl.textContent = data.unhelpful || '0';
        } catch (error) {
            if (helpfulFeedbackCountEl) helpfulFeedbackCountEl.textContent = 'エラー';
            if (unhelpfulFeedbackCountEl) unhelpfulFeedbackCountEl.textContent = 'エラー';
        }
    }

    async function fetchAndRenderUsers() {
        try {
            const users = await apiRequest('api.php?action=get_users');
            userTableBody.innerHTML = '';
            if (users.length === 0) {
                userTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4">ユーザーが見つかりません。</td></tr>';
                return;
            }
            users.forEach(user => {
                const tr = document.createElement('tr');
                tr.className = 'text-gray-700';
                tr.dataset.userId = user.ID;
                tr.dataset.userData = JSON.stringify(user);
                const registrationDate = new Date(user.RegistrationDate).toLocaleDateString('ja-JP');
                const isCurrentUser = user.ID == currentAdminId;
                tr.innerHTML = `
                    <td class="px-4 py-3 text-sm">${user.ID}</td>
                    <td class="px-4 py-3 font-semibold">${escapeHTML(user.Name)}</td>
                    <td class="px-4 py-3 text-sm">${escapeHTML(user.Email)}</td>
                    <td class="px-4 py-3 text-xs">
                        <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">
                            ${escapeHTML(user.UserType)}
                        </span>
                    </td>
                    <td class="px-4 py-3 text-sm">${registrationDate}</td>
                    <td class="px-4 py-3 text-sm">
                        <label class="switch">
                            <input type="checkbox" class="admin-toggle" ${user.is_admin ? 'checked' : ''} ${isCurrentUser ? 'disabled' : ''}>
                            <span class="slider round"></span>
                        </label>
                    </td>
                    <td class="px-4 py-3 text-sm">
                        <button class="action-btn edit-btn" title="編集"><i class="fas fa-pencil-alt"></i></button>
                        <button class="action-btn delete-btn" title="削除" ${isCurrentUser ? 'disabled' : ''}><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
                userTableBody.appendChild(tr);
            });
        } catch (error) {
            userTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">ユーザー情報の取得に失敗しました。</td></tr>`;
        }
    }

    async function fetchAndRenderQuizzes() {
        try {
            const quizzes = await apiRequest('api.php?action=get_quizzes');
            quizTableBody.innerHTML = '';
            if (quizzes.length === 0) {
                quizTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">クイズが見つかりません。</td></tr>';
                return;
            }
            quizzes.forEach(quiz => {
                const tr = document.createElement('tr');
                tr.dataset.quizId = quiz.id;
                tr.dataset.quizData = JSON.stringify(quiz);
                tr.innerHTML = `
                    <td class="px-4 py-3 text-sm">${quiz.id}</td>
                    <td class="px-4 py-3 text-sm">${quiz.difficulty}</td>
                    <td class="px-4 py-3">${escapeHTML(quiz.question.ja)}</td>
                    <td class="px-4 py-3 text-sm">
                        <button class="action-btn edit-quiz-btn" title="編集"><i class="fas fa-pencil-alt"></i></button>
                        <button class="action-btn delete-quiz-btn" title="削除"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
                quizTableBody.appendChild(tr);
            });
        } catch (error) {
            quizTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">クイズの読み込みに失敗しました。</td></tr>`;
        }
    }
    
    // --- User Management Functions ---

    function handleUserTableClick(e) {
        const target = e.target;
        const tr = target.closest('tr');
        if (!tr) return;
        const userId = tr.dataset.userId;
        if (target.classList.contains('admin-toggle')) {
            toggleAdminStatus(userId, target.checked, target);
        } else if (target.closest('.edit-btn')) {
            openEditUserModal(JSON.parse(tr.dataset.userData));
        } else if (target.closest('.delete-btn')) {
            openDeleteUserModal(userId, tr.querySelector('td:nth-child(2)').textContent);
        }
    }

    async function toggleAdminStatus(userId, newStatus, checkboxElement) {
        try {
            await apiRequest('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'toggle_admin', user_id: userId, is_admin: newStatus })
            });
        } catch (error) {
            checkboxElement.checked = !newStatus; // Revert on error
        }
    }

    function openDeleteUserModal(userId, userName) {
        userIdToDelete = userId;
        deleteUserNameEl.textContent = userName;
        deleteUserModal.classList.remove('hidden');
    }

    function closeDeleteUserModal() {
        userIdToDelete = null;
        deleteUserModal.classList.add('hidden');
    }

    async function executeUserDelete() {
        if (!userIdToDelete) return;
        try {
            await apiRequest('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_user', user_id: userIdToDelete })
            });
            fetchAndRenderUsers();
            fetchDashboardStats();
            closeDeleteUserModal();
        } catch (error) {
            closeDeleteUserModal();
        }
    }
    
    function openEditUserModal(user) {
        editUserForm.reset();
        editUserForm.elements['user_id'].value = user.ID;
        editUserForm.elements['name'].value = user.Name;
        editUserForm.elements['email'].value = user.Email;
        editUserForm.elements['user_type'].value = user.UserType;
        editUserModal.classList.remove('hidden');
    }

    function closeEditUserModal() {
        editUserModal.classList.add('hidden');
    }

    async function handleUserEditSubmit(e) {
        e.preventDefault();
        const formData = new FormData(editUserForm);
        const data = {
            action: 'update_user',
            user_id: formData.get('user_id'),
            name: formData.get('name'),
            email: formData.get('email'),
            user_type: formData.get('user_type'),
        };
        try {
            await apiRequest('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            fetchAndRenderUsers();
            closeEditUserModal();
        } catch (error) {
            // Error is already alerted in apiRequest
        }
    }

    // --- Quiz Management Functions ---

    function handleQuizTableClick(e) {
        const target = e.target;
        const tr = target.closest('tr');
        if (!tr) return;
        const quizId = tr.dataset.quizId;
        const quizData = JSON.parse(tr.dataset.quizData);

        if (target.closest('.edit-quiz-btn')) {
            openQuizEditorForEdit(quizData);
        } else if (target.closest('.delete-quiz-btn')) {
            openDeleteQuizModal(quizId, quizData.question.ja);
        }
    }

    function openQuizEditorForAdd() {
        quizEditorForm.reset();
        quizEditorTitle.textContent = '新しいクイズを追加';
        quizEditorForm.elements['id'].value = '';
        quizEditorModal.classList.remove('hidden');
    }

    function openQuizEditorForEdit(quiz) {
        quizEditorForm.reset();
        quizEditorTitle.textContent = 'クイズを編集';
        
        // Populate form fields
        quizEditorForm.elements['id'].value = quiz.id;
        quizEditorForm.elements['difficulty'].value = quiz.difficulty;
        
        ['ja', 'en', 'zh'].forEach(lang => {
            quizEditorForm.elements[`question_${lang}`].value = quiz.question[lang] || '';
            quizEditorForm.elements[`explanation_${lang}`].value = quiz.explanation[lang] || '';
            // Handle case where options might be less than 4
            for (let i = 0; i < 4; i++) {
                quizEditorForm.elements[`option_${i}_${lang}`].value = quiz.options[lang][i] || '';
            }
        });

        const correctRadio = quizEditorForm.querySelector(`input[name="correct_answer_index"][value="${quiz.correct_answer_index}"]`);
        if (correctRadio) correctRadio.checked = true;

        quizEditorModal.classList.remove('hidden');
    }

    function closeQuizEditorModal() {
        quizEditorModal.classList.add('hidden');
    }

    async function handleQuizFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(quizEditorForm);
        const id = formData.get('id');
        
        const data = {
            action: id ? 'update_quiz' : 'add_quiz',
            id: id || null,
            difficulty: formData.get('difficulty'),
            correct_answer_index: parseInt(formData.get('correct_answer_index'), 10),
            question: {
                ja: formData.get('question_ja'),
                en: formData.get('question_en'),
                zh: formData.get('question_zh')
            },
            options: { ja: [], en: [], zh: [] },
            explanation: {
                ja: formData.get('explanation_ja'),
                en: formData.get('explanation_en'),
                zh: formData.get('explanation_zh')
            }
        };

        // Collect only non-empty options
        const tempOptions = { ja: [], en: [], zh: [] };
        for (let i = 0; i < 4; i++) {
            const ja_opt = formData.get(`option_${i}_ja`);
            // Only add option if the Japanese field is filled (as a baseline)
            if (ja_opt && ja_opt.trim() !== '') {
                tempOptions.ja.push(ja_opt);
                tempOptions.en.push(formData.get(`option_${i}_en`));
                tempOptions.zh.push(formData.get(`option_${i}_zh`));
            }
        }
        data.options = tempOptions;

        // --- Validation ---
        if (data.options.ja.length < 2) {
            alert('少なくとも2つの選択肢を入力してください。');
            return;
        }

        if (data.correct_answer_index >= data.options.ja.length) {
            alert('正解として指定された選択肢が入力されていません。');
            return;
        }

        try {
            await apiRequest('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            fetchAndRenderQuizzes();
            closeQuizEditorModal();
        } catch (error) {
            // Error handling is in apiRequest
        }
    }

    function openDeleteQuizModal(quizId, question) {
        quizIdToDelete = quizId;
        // 質問が長い場合があるので、短縮する
        const shortQuestion = question.length > 30 ? question.substring(0, 30) + '...' : question;
        deleteQuizQuestionEl.textContent = shortQuestion;
        deleteQuizModal.classList.remove('hidden');
    }

    function closeDeleteQuizModal() {
        quizIdToDelete = null;
        deleteQuizModal.classList.add('hidden');
    }

    async function executeQuizDelete() {
        if (!quizIdToDelete) return;
        try {
            await apiRequest('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_quiz', id: quizIdToDelete })
            });
            fetchAndRenderQuizzes();
            closeDeleteQuizModal();
        } catch (error) {
            closeDeleteQuizModal();
        }
    }

    /**
     * HTML特殊文字をエスケープする
     */
    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return str.toString()
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 初期ロード
    initialize();
});
