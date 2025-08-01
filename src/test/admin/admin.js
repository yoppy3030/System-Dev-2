document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM要素 ---
    const userTableBody = document.getElementById('user-table-body');
    const quizTableBody = document.getElementById('quiz-table-body');
    const inquiryTableBody = document.getElementById('inquiry-table-body');
    const totalUsersCountEl = document.getElementById('total-users-count');
    const helpfulFeedbackCountEl = document.getElementById('helpful-feedback-count');
    const unhelpfulFeedbackCountEl = document.getElementById('unhelpful-feedback-count');
    const userRegistrationChartEl = document.getElementById('userRegistrationChart');
    
    // User Elements
    const deleteUserModal = document.getElementById('delete-confirm-modal');
    const confirmDeleteUserBtn = document.getElementById('confirm-delete-btn');
    const deleteUserNameEl = document.getElementById('delete-user-name');
    const editUserModal = document.getElementById('edit-user-modal');
    const editUserForm = document.getElementById('edit-user-form');
    const backDeleteBtn = document.getElementById('back-delete-btn');
    const backEditBtn = document.getElementById('back-edit-btn');
    const userFilterInput = document.getElementById('user-filter-input');
    const userFilterRole = document.getElementById('user-filter-role');
    const importUsersBtn = document.getElementById('import-users-btn');
    const userImportInput = document.getElementById('user-import-input');
    const backupUsersBtn = document.getElementById('backup-users-btn');
    
    // Quiz Elements
    const quizEditorModal = document.getElementById('quiz-editor-modal');
    const quizEditorForm = document.getElementById('quiz-editor-form');
    const quizEditorTitle = document.getElementById('quiz-editor-title');
    const addQuizBtn = document.getElementById('add-quiz-btn');
    const backQuizEditorBtn = document.getElementById('back-quiz-editor-btn');
    const deleteQuizModal = document.getElementById('delete-quiz-confirm-modal');
    const deleteQuizQuestionEl = document.getElementById('delete-quiz-question');
    const backDeleteQuizBtn = document.getElementById('back-delete-quiz-btn');
    const confirmDeleteQuizBtn = document.getElementById('confirm-delete-quiz-btn');
    const quizFilterInput = document.getElementById('quiz-filter-input');
    const quizFilterDifficulty = document.getElementById('quiz-filter-difficulty');
    const importQuizzesBtn = document.getElementById('import-quizzes-btn');
    const quizImportInput = document.getElementById('quiz-import-input');
    const backupQuizzesBtn = document.getElementById('backup-quizzes-btn');

    // Inquiry Elements
    const replyModal = document.getElementById('reply-modal');
    const replyForm = document.getElementById('reply-form');
    const backReplyBtn = document.getElementById('back-reply-btn');
    const sendReplyBtn = document.getElementById('send-reply-btn');
    const inquiryFilterStatus = document.getElementById('inquiry-filter-status');
    const importInquiriesBtn = document.getElementById('import-inquiries-btn');
    const inquiryImportInput = document.getElementById('inquiry-import-input');
    const backupInquiriesBtn = document.getElementById('backup-inquiries-btn');
    const deleteInquiryModal = document.getElementById('delete-inquiry-confirm-modal');
    const backDeleteInquiryBtn = document.getElementById('back-delete-inquiry-btn');
    const confirmDeleteInquiryBtn = document.getElementById('confirm-delete-inquiry-btn');

    // --- State variables ---
    let userIdToDelete = null, quizIdToDelete = null, inquiryIdToDelete = null;
    let sortState = {};
    let paginationState = {
        users: { currentPage: 1, limit: 10, total: 0 },
        quizzes: { currentPage: 1, limit: 10, total: 0 },
        inquiries: { currentPage: 1, limit: 10, total: 0 }
    };

    /**
     * 初期化関数
     */
    function initialize() {
        setupEventListeners();
        fetchDashboardStats();
        fetchAndRenderFeedbackStats();
        fetchAndRenderUserRegistrationChart();
        const initialHash = window.location.hash || '#dashboard';
        switchSection(initialHash);
    }

    /**
     * イベントリスナーをまとめて設定
     */
    function setupEventListeners() {
        document.getElementById('sidebar-nav').addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (navLink) {
                e.preventDefault();
                switchSection(navLink.getAttribute('href'));
            }
        });

        document.querySelectorAll('thead').forEach(thead => thead.addEventListener('click', handleSortClick));
        
        // User Listeners
        userTableBody.addEventListener('click', handleUserTableClick);
        confirmDeleteUserBtn.addEventListener('click', executeUserDelete);
        backDeleteBtn.addEventListener('click', () => deleteUserModal.classList.add('hidden'));
        editUserForm.addEventListener('submit', handleUserEditSubmit);
        backEditBtn.addEventListener('click', () => editUserModal.classList.add('hidden'));
        userFilterInput.addEventListener('input', () => { paginationState.users.currentPage = 1; fetchAndRenderUsers(); });
        userFilterRole.addEventListener('change', () => { paginationState.users.currentPage = 1; fetchAndRenderUsers(); });
        backupUsersBtn.addEventListener('click', () => window.location.href = 'api.php?action=backup_users');
        importUsersBtn.addEventListener('click', () => userImportInput.click());
        userImportInput.addEventListener('change', handleUserImport);

        // Quiz Listeners
        quizTableBody.addEventListener('click', handleQuizTableClick);
        addQuizBtn.addEventListener('click', openQuizEditorForAdd);
        quizEditorForm.addEventListener('submit', handleQuizFormSubmit);
        backQuizEditorBtn.addEventListener('click', () => quizEditorModal.classList.add('hidden'));
        confirmDeleteQuizBtn.addEventListener('click', executeQuizDelete);
        backDeleteQuizBtn.addEventListener('click', () => deleteQuizModal.classList.add('hidden'));
        quizFilterInput.addEventListener('input', () => { paginationState.quizzes.currentPage = 1; fetchAndRenderQuizzes(); });
        quizFilterDifficulty.addEventListener('change', () => { paginationState.quizzes.currentPage = 1; fetchAndRenderQuizzes(); });
        backupQuizzesBtn.addEventListener('click', () => window.location.href = 'api.php?action=backup_quizzes');
        importQuizzesBtn.addEventListener('click', () => quizImportInput.click());
        quizImportInput.addEventListener('change', handleQuizImport);

        // Inquiry Listeners
        inquiryTableBody.addEventListener('click', handleInquiryTableClick);
        replyForm.addEventListener('submit', handleReplySubmit);
        backReplyBtn.addEventListener('click', () => replyModal.classList.add('hidden'));
        inquiryFilterStatus.addEventListener('change', () => { paginationState.inquiries.currentPage = 1; fetchAndRenderInquiries(); });
        backupInquiriesBtn.addEventListener('click', () => window.location.href = 'api.php?action=backup_inquiries');
        importInquiriesBtn.addEventListener('click', () => inquiryImportInput.click());
        inquiryImportInput.addEventListener('change', handleInquiryImport);
        confirmDeleteInquiryBtn.addEventListener('click', executeInquiryDelete);
        backDeleteInquiryBtn.addEventListener('click', () => deleteInquiryModal.classList.add('hidden'));
    }
    
    function switchSection(targetHash) {
        const targetId = targetHash.substring(1);
        document.querySelectorAll('.nav-link').forEach(link => {
            const isActive = link.getAttribute('href') === targetHash;
            link.classList.toggle('bg-gray-700', isActive);
            link.classList.toggle('text-gray-100', isActive);
        });
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.toggle('hidden', section.id !== targetId);
        });
        window.location.hash = targetId;

        switch (targetId) {
            case 'user-management': fetchAndRenderUsers(); break;
            case 'content-management': fetchAndRenderQuizzes(); break;
            case 'inquiry-management': fetchAndRenderInquiries(); break;
        }
    }

    async function apiRequest(url, options = {}) {
        try {
            let requestUrl = url;
            if (options.params) {
                const queryParams = new URLSearchParams(options.params).toString();
                requestUrl += (url.includes('?') ? '&' : '?') + queryParams;
            }
            
            let requestOptions = { ...options };
            if (options.body instanceof FormData) {
                // FormDataの場合、Content-Typeは設定しない
            } else {
                requestOptions.headers = { 'Content-Type': 'application/json', ...options.headers };
                if (typeof options.body === 'object' && options.body !== null) {
                    requestOptions.body = JSON.stringify(options.body);
                }
            }
            const response = await fetch(requestUrl, requestOptions);
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
    async function fetchAndRenderUserRegistrationChart() {
        if (!userRegistrationChartEl) return;
        try {
            const chartData = await apiRequest('api.php?action=get_user_registration_stats');
            new Chart(userRegistrationChartEl, {
                type: 'line',
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: '新規登録ユーザー数',
                        data: chartData.data,
                        borderColor: 'rgb(59, 130, 246)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
                    plugins: { legend: { display: false } }
                }
            });
        } catch (error) {
            userRegistrationChartEl.parentElement.innerHTML = '<p class="text-red-500 text-center">グラフデータの読み込みに失敗しました。</p>';
        }
    }

    async function fetchAndRenderUsers() {
        try {
            const state = paginationState.users;
            const params = {
                page: state.currentPage,
                limit: state.limit,
                search: userFilterInput.value,
                role: userFilterRole.value,
                sort_column: sortState['user-table-body']?.column,
                sort_direction: sortState['user-table-body']?.direction
            };
            const result = await apiRequest('api.php?action=get_users', { params });
            state.total = result.total_count;
            renderUserTable(result.data);
            renderPagination('users', document.getElementById('user-pagination-controls'), document.getElementById('user-pagination-info'));
        } catch (error) {
            userTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">ユーザー情報の取得に失敗しました。</td></tr>`;
        }
    }

    async function fetchAndRenderQuizzes() {
        try {
            const state = paginationState.quizzes;
            const params = {
                page: state.currentPage,
                limit: state.limit,
                search: quizFilterInput.value,
                difficulty: quizFilterDifficulty.value,
                sort_column: sortState['quiz-table-body']?.column,
                sort_direction: sortState['quiz-table-body']?.direction
            };
            const result = await apiRequest('api.php?action=get_quizzes', { params });
            state.total = result.total_count;
            renderQuizTable(result.data);
            renderPagination('quizzes', document.getElementById('quiz-pagination-controls'), document.getElementById('quiz-pagination-info'));
        } catch (error) {
            quizTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">クイズの読み込みに失敗しました。</td></tr>`;
        }
    }
    
    async function fetchAndRenderInquiries() {
        try {
            const state = paginationState.inquiries;
            const params = {
                page: state.currentPage,
                limit: state.limit,
                status: inquiryFilterStatus.value,
                sort_column: sortState['inquiry-table-body']?.column,
                sort_direction: sortState['inquiry-table-body']?.direction
            };
            const result = await apiRequest('api.php?action=get_inquiries', { params });
            state.total = result.total_count;
            renderInquiryTable(result.data);
            renderPagination('inquiries', document.getElementById('inquiry-pagination-controls'), document.getElementById('inquiry-pagination-info'));
        } catch (error) {
            inquiryTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">お問い合わせの読み込みに失敗しました。</td></tr>`;
        }
    }

    // --- Table Rendering Functions ---
    function renderUserTable(users) {
        userTableBody.innerHTML = '';
        if (users.length === 0) {
            userTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4">該当するユーザーが見つかりません。</td></tr>';
            return;
        };
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
                <td class="px-4 py-3 text-xs"><span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">${escapeHTML(user.UserType)}</span></td>
                <td class="px-4 py-3 text-sm">${registrationDate}</td>
                <td class="px-4 py-3 text-sm"><label class="switch"><input type="checkbox" class="admin-toggle" ${user.is_admin ? 'checked' : ''} ${isCurrentUser ? 'disabled' : ''}><span class="slider round"></span></label></td>
                <td class="px-4 py-3 text-sm"><button class="action-btn edit-btn" title="編集"><i class="fas fa-pencil-alt"></i></button><button class="action-btn delete-btn" title="削除" ${isCurrentUser ? 'disabled' : ''}><i class="fas fa-trash-alt"></i></button></td>
            `;
            userTableBody.appendChild(tr);
        });
    }
    function renderQuizTable(quizzes) {
        quizTableBody.innerHTML = '';
        if (quizzes.length === 0) {
            quizTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">該当するクイズが見つかりません。</td></tr>';
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
                <td class="px-4 py-3 text-sm"><button class="action-btn edit-quiz-btn" title="編集"><i class="fas fa-pencil-alt"></i></button><button class="action-btn delete-quiz-btn" title="削除"><i class="fas fa-trash-alt"></i></button></td>
            `;
            quizTableBody.appendChild(tr);
        });
    }
    function renderInquiryTable(inquiries) {
        inquiryTableBody.innerHTML = '';
        if (inquiries.length === 0) {
            inquiryTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4">該当するお問い合わせはありません。</td></tr>';
            return;
        }
        inquiries.forEach(inquiry => {
            const tr = document.createElement('tr');
            tr.dataset.inquiryData = JSON.stringify(inquiry);
            const receivedDate = new Date(inquiry.created_at).toLocaleString('ja-JP');
            const shortMessage = inquiry.message.length > 50 ? inquiry.message.substring(0, 50) + '...' : inquiry.message;
            tr.innerHTML = `
                <td class="px-4 py-3 text-sm">${inquiry.id}</td>
                <td class="px-4 py-3 text-sm">${receivedDate}</td>
                <td class="px-4 py-3 font-semibold">${escapeHTML(inquiry.name)}</td>
                <td class="px-4 py-3 text-sm">${escapeHTML(inquiry.email)}</td>
                <td class="px-4 py-3 text-sm">${escapeHTML(shortMessage)}</td>
                <td class="px-4 py-3 text-xs"><span class="status-${inquiry.replied ? 'replied' : 'pending'}">${inquiry.replied ? '対応済み' : '未対応'}</span></td>
                <td class="px-4 py-3 text-sm">
                    <button class="action-btn reply-btn" title="返信" ${inquiry.replied ? 'disabled' : ''}><i class="fas fa-reply"></i></button>
                    <button class="action-btn delete-inquiry-btn" title="削除"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            inquiryTableBody.appendChild(tr);
        });
    }

    function renderPagination(type, controlsContainer, infoContainer) {
        const state = paginationState[type];
        controlsContainer.innerHTML = '';
        infoContainer.innerHTML = '';

        if (state.total === 0) return;

        const totalPages = Math.ceil(state.total / state.limit);
        const startItem = (state.currentPage - 1) * state.limit + 1;
        const endItem = Math.min(startItem + state.limit - 1, state.total);
        infoContainer.textContent = `${state.total}件中 ${startItem}〜${endItem}件を表示`;

        const createButton = (text, page, isDisabled = false, isActive = false) => {
            const button = document.createElement('button');
            button.innerHTML = text;
            button.disabled = isDisabled;
            button.className = `px-3 py-1 rounded-md transition-colors ${isActive ? 'bg-sky-600 text-white' : 'bg-white hover:bg-gray-100'} ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'}`;
            button.addEventListener('click', () => {
                state.currentPage = page;
                if (type === 'users') fetchAndRenderUsers();
                else if (type === 'quizzes') fetchAndRenderQuizzes();
                else if (type === 'inquiries') fetchAndRenderInquiries();
            });
            return button;
        };

        controlsContainer.appendChild(createButton('<i class="fas fa-chevron-left"></i>', state.currentPage - 1, state.currentPage === 1));

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= state.currentPage - 1 && i <= state.currentPage + 1)) {
                controlsContainer.appendChild(createButton(i, i, false, i === state.currentPage));
            } else if (i === state.currentPage - 2 || i === state.currentPage + 2) {
                const dots = document.createElement('span');
                dots.textContent = '...';
                dots.className = 'px-3 py-1';
                controlsContainer.appendChild(dots);
            }
        }
        
        controlsContainer.appendChild(createButton('<i class="fas fa-chevron-right"></i>', state.currentPage + 1, state.currentPage === totalPages));
    }


    // --- Sorting Functions ---
    function handleSortClick(e) {
        const header = e.target.closest('.sortable-header');
        if (!header) return;

        const column = header.dataset.column;
        const tableId = header.closest('table').querySelector('tbody').id;
        
        const currentSort = sortState[tableId] || {};
        const newDirection = currentSort.column === column && currentSort.direction === 'asc' ? 'desc' : 'asc';
        
        sortState[tableId] = { column, direction: newDirection };
        
        updateSortIndicators(header.closest('thead'));
        
        if (tableId === 'user-table-body') {
            paginationState.users.currentPage = 1;
            fetchAndRenderUsers();
        } else if (tableId === 'quiz-table-body') {
            paginationState.quizzes.currentPage = 1;
            fetchAndRenderQuizzes();
        } else if (tableId === 'inquiry-table-body') {
            paginationState.inquiries.currentPage = 1;
            fetchAndRenderInquiries();
        }
    }
    function updateSortIndicators(thead) {
        const tableId = thead.nextElementSibling.id;
        const currentSort = sortState[tableId] || {};
        
        thead.querySelectorAll('.sortable-header').forEach(th => {
            th.classList.remove('asc', 'desc');
            if (th.dataset.column === currentSort.column) {
                th.classList.add(currentSort.direction);
            }
        });
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
                body: { action: 'toggle_admin', user_id: userId, is_admin: newStatus }
            });
            fetchAndRenderUsers();
        } catch (error) {
            checkboxElement.checked = !newStatus;
        }
    }
    function openDeleteUserModal(userId, userName) {
        userIdToDelete = userId;
        deleteUserNameEl.textContent = userName;
        deleteUserModal.classList.remove('hidden');
    }
    async function executeUserDelete() {
        if (!userIdToDelete) return;
        try {
            await apiRequest('api.php', {
                method: 'POST',
                body: { action: 'delete_user', user_id: userIdToDelete }
            });
            paginationState.users.currentPage = 1;
            await fetchAndRenderUsers();
            fetchDashboardStats();
            deleteUserModal.classList.add('hidden');
        } catch (error) {
            deleteUserModal.classList.add('hidden');
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
            await apiRequest('api.php', { method: 'POST', body: data });
            await fetchAndRenderUsers();
            editUserModal.classList.add('hidden');
        } catch (error) {}
    }

    // --- Quiz Management Functions ---
    function handleQuizTableClick(e) {
        const tr = e.target.closest('tr');
        if (!tr) return;
        const quizData = JSON.parse(tr.dataset.quizData);
        if (e.target.closest('.edit-quiz-btn')) openQuizEditorForEdit(quizData);
        else if (e.target.closest('.delete-quiz-btn')) openDeleteQuizModal(quizData.id, quizData.question.ja);
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
        quizEditorForm.elements['id'].value = quiz.id;
        quizEditorForm.elements['difficulty'].value = quiz.difficulty;
        ['ja', 'en', 'zh'].forEach(lang => {
            quizEditorForm.elements[`question_${lang}`].value = quiz.question[lang] || '';
            quizEditorForm.elements[`explanation_${lang}`].value = quiz.explanation[lang] || '';
            for (let i = 0; i < 4; i++) {
                quizEditorForm.elements[`option_${i}_${lang}`].value = quiz.options[lang][i] || '';
            }
        });
        const correctRadio = quizEditorForm.querySelector(`input[name="correct_answer_index"][value="${quiz.correct_answer_index}"]`);
        if (correctRadio) correctRadio.checked = true;
        quizEditorModal.classList.remove('hidden');
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
            question: { ja: formData.get('question_ja'), en: formData.get('question_en'), zh: formData.get('question_zh') },
            options: { ja: [], en: [], zh: [] },
            explanation: { ja: formData.get('explanation_ja'), en: formData.get('explanation_en'), zh: formData.get('explanation_zh') }
        };
        for (let i = 0; i < 4; i++) {
            const ja_opt = formData.get(`option_${i}_ja`);
            if (ja_opt && ja_opt.trim() !== '') {
                data.options.ja.push(ja_opt);
                data.options.en.push(formData.get(`option_${i}_en`));
                data.options.zh.push(formData.get(`option_${i}_zh`));
            }
        }
        if (data.options.ja.length < 2 || data.correct_answer_index >= data.options.ja.length) {
            alert('選択肢と正解の設定が正しくありません。'); return;
        }
        try {
            await apiRequest('api.php', { method: 'POST', body: data });
            fetchAndRenderQuizzes();
            quizEditorModal.classList.add('hidden');
        } catch (error) {}
    }
    function openDeleteQuizModal(quizId, question) {
        quizIdToDelete = quizId;
        deleteQuizQuestionEl.textContent = question.length > 30 ? question.substring(0, 30) + '...' : question;
        deleteQuizModal.classList.remove('hidden');
    }
    async function executeQuizDelete() {
        if (!quizIdToDelete) return;
        try {
            await apiRequest('api.php', { method: 'POST', body: { action: 'delete_quiz', id: quizIdToDelete } });
            paginationState.quizzes.currentPage = 1;
            fetchAndRenderQuizzes();
            deleteQuizModal.classList.add('hidden');
        } catch (error) {
            deleteQuizModal.classList.add('hidden');
        }
    }

    // --- Inquiry Management Functions ---
    function handleInquiryTableClick(e) {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;
        const inquiryData = JSON.parse(btn.closest('tr').dataset.inquiryData);
        if (btn.classList.contains('reply-btn')) openReplyModal(inquiryData);
        else if (btn.classList.contains('delete-inquiry-btn')) openDeleteInquiryModal(inquiryData.id);
    }
    function openReplyModal(inquiry) {
        replyForm.reset();
        replyForm.elements['inquiry_id'].value = inquiry.id;
        replyForm.elements['recipient_email'].value = inquiry.email;
        replyForm.elements['recipient_name'].value = inquiry.name;
        document.getElementById('reply-recipient').textContent = `${inquiry.name} <${inquiry.email}>`;
        document.getElementById('original-message').textContent = inquiry.message;
        replyModal.classList.remove('hidden');
    }
    async function handleReplySubmit(e) {
        e.preventDefault();
        sendReplyBtn.disabled = true;
        sendReplyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>送信中...';
        const formData = new FormData(replyForm);
        const data = {
            action: 'send_reply',
            inquiry_id: formData.get('inquiry_id'),
            recipient_email: formData.get('recipient_email'),
            recipient_name: formData.get('recipient_name'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        try {
            await apiRequest('api.php', { method: 'POST', body: data });
            await apiRequest('api.php', { method: 'POST', body: { action: 'mark_inquiry_replied', inquiry_id: data.inquiry_id } });
            alert('返信を送信しました。');
            replyModal.classList.add('hidden');
            fetchAndRenderInquiries();
        } catch (error) {} 
        finally {
            sendReplyBtn.disabled = false;
            sendReplyBtn.innerHTML = '<i class="fas fa-paper-plane"></i>送信';
        }
    }
    function openDeleteInquiryModal(inquiryId) {
        inquiryIdToDelete = inquiryId;
        deleteInquiryModal.classList.remove('hidden');
    }
    async function executeInquiryDelete() {
        if (!inquiryIdToDelete) return;
        try {
            await apiRequest('api.php', { method: 'POST', body: { action: 'delete_inquiry', inquiry_id: inquiryIdToDelete } });
            paginationState.inquiries.currentPage = 1;
            fetchAndRenderInquiries();
            deleteInquiryModal.classList.add('hidden');
        } catch (error) {
            deleteInquiryModal.classList.add('hidden');
        }
    }
    
    // --- Import Functions ---
    async function handleUserImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!confirm(`ユーザーデータをインポートしますか？\n既存のEmailと重複するデータはスキップされます。`)) {
            e.target.value = '';
            return;
        }
        const formData = new FormData();
        formData.append('user_csv', file);
        formData.append('action', 'import_users');
        try {
            const result = await apiRequest('api.php', { method: 'POST', body: formData });
            alert(result.message);
            fetchAndRenderUsers();
        } catch (error) {} 
        finally { e.target.value = ''; }
    }
    async function handleQuizImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!confirm(`クイズデータをインポートしますか？\n既存のIDと重複するデータはスキップされます。`)) {
            e.target.value = '';
            return;
        }
        const formData = new FormData();
        formData.append('quiz_csv', file);
        formData.append('action', 'import_quizzes');
        try {
            const result = await apiRequest('api.php', { method: 'POST', body: formData });
            alert(result.message);
            fetchAndRenderQuizzes();
        } catch (error) {}
        finally { e.target.value = ''; }
    }
    async function handleInquiryImport(e) {
        const file = e.target.files[0];
        if (!file) return;
        if (!confirm(`ファイル「${file.name}」をインポートしますか？\n既存のIDと重複するデータはスキップされます。`)) {
            e.target.value = '';
            return;
        }
        const formData = new FormData();
        formData.append('inquiry_csv', file);
        formData.append('action', 'import_inquiries');
        try {
            const result = await apiRequest('api.php', { method: 'POST', body: formData });
            alert(result.message);
            fetchAndRenderInquiries();
        } catch (error) {}
        finally { e.target.value = ''; }
    }

    // --- Utility Functions ---
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
