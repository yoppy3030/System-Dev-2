document.addEventListener('DOMContentLoaded', () => {
    
    // --- DOM要素 ---
    const userTableBody = document.getElementById('user-table-body');
    const quizTableBody = document.getElementById('quiz-table-body');
    const totalUsersCountEl = document.getElementById('total-users-count');
    const deleteModal = document.getElementById('delete-confirm-modal');
    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    const deleteUserNameEl = document.getElementById('delete-user-name');
    const editModal = document.getElementById('edit-user-modal');
    const editForm = document.getElementById('edit-user-form');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const quizEditorModal = document.getElementById('quiz-editor-modal');
    const addQuizBtn = document.getElementById('add-quiz-btn');
    
    const sidebarNav = document.getElementById('sidebar-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const adminSections = document.querySelectorAll('.admin-section');

    let userIdToDelete = null;
    let userToEdit = null;

    /**
     * 初期化関数
     */
    function initialize() {
        setupEventListeners();
        
        // ▼▼▼【修正】ページ読み込み時に全てのデータを取得・描画する ▼▼▼
        fetchDashboardStats();
        fetchAndRenderUsers();
        fetchAndRenderQuizzes();

        // 初期表示セクションを決定
        const initialHash = window.location.hash || '#dashboard';
        switchSection(initialHash);
    }

    /**
     * イベントリスナーをまとめて設定
     */
    function setupEventListeners() {
        // ▼▼▼【修正】ナビゲーションのクリック処理 ▼▼▼
        sidebarNav.addEventListener('click', (e) => {
            const navLink = e.target.closest('.nav-link');
            if (!navLink) return;
            e.preventDefault();
            const targetHash = navLink.getAttribute('href');
            switchSection(targetHash);
        });
        // ▲▲▲

        userTableBody.addEventListener('click', handleUserTableClick);
        confirmDeleteBtn.addEventListener('click', executeUserDelete);
        cancelDeleteBtn.addEventListener('click', closeDeleteModal);
        deleteModal.addEventListener('click', (e) => e.target === deleteModal && closeDeleteModal());

        editForm.addEventListener('submit', handleUserEditSubmit);
        cancelEditBtn.addEventListener('click', closeEditModal);
        editModal.addEventListener('click', (e) => e.target === editModal && closeEditModal());

        addQuizBtn.addEventListener('click', () => {
             // ここにクイズ追加モーダルを開く処理を後で追加
             console.log("Add quiz button clicked");
        });
    }
    
    /**
     * 表示するセクションを切り替える関数
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
        
        // URLのハッシュも更新（ページ内遷移のため）
        window.location.hash = targetId;
    }


    /**
     * APIからダッシュボードの統計情報を取得して表示する
     */
    async function fetchDashboardStats() {
        try {
            const response = await fetch('api.php?action=get_dashboard_stats');
            const data = await response.json();
            if (totalUsersCountEl) {
                totalUsersCountEl.textContent = data.total_users || '0';
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            if (totalUsersCountEl) totalUsersCountEl.textContent = 'エラー';
        }
    }

    /**
     * APIからユーザーリストを取得し、テーブルに描画する
     */
    async function fetchAndRenderUsers() {
        try {
            const response = await fetch('api.php?action=get_users');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'ユーザー情報の取得に失敗しました。');
            }
            const users = await response.json();
            
            userTableBody.innerHTML = ''; // テーブルをクリア

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
            console.error('Error fetching users:', error);
            userTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">エラー: ${error.message}</td></tr>`;
        }
    }

    /**
     * APIからクイズリストを取得し、テーブルに描画する
     */
    async function fetchAndRenderQuizzes() {
        try {
            const response = await fetch('api.php?action=get_quizzes');
            const quizzes = await response.json();
            quizTableBody.innerHTML = '';
            if (quizzes.length === 0) {
                quizTableBody.innerHTML = '<tr><td colspan="4" class="text-center py-4">クイズが見つかりません。</td></tr>';
                return;
            }
            quizzes.forEach(quiz => {
                const tr = document.createElement('tr');
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
            console.error('Error fetching quizzes:', error);
            quizTableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-500">クイズの読み込みに失敗しました。</td></tr>`;
        }
    }
    
    /**
     * ユーザーテーブルでのクリックイベントを処理
     */
    function handleUserTableClick(e) {
        const target = e.target;
        const tr = target.closest('tr');
        if (!tr) return;

        const userId = tr.dataset.userId;

        if (target.classList.contains('admin-toggle')) {
            const newStatus = target.checked;
            toggleAdminStatus(userId, newStatus, target);
        } else if (target.closest('.edit-btn')) {
            const userData = JSON.parse(tr.dataset.userData);
            openEditModal(userData);
        } else if (target.closest('.delete-btn')) {
            const userName = tr.querySelector('td:nth-child(2)').textContent;
            openDeleteModal(userId, userName);
        }
    }

    async function toggleAdminStatus(userId, newStatus, checkboxElement) {
        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'toggle_admin', user_id: userId, is_admin: newStatus })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
        } catch (error) {
            alert(`エラー: ${error.message}`);
            checkboxElement.checked = !newStatus;
        }
    }

    function openDeleteModal(userId, userName) {
        userIdToDelete = userId;
        deleteUserNameEl.textContent = userName;
        deleteModal.classList.remove('hidden');
    }

    function closeDeleteModal() {
        userIdToDelete = null;
        deleteModal.classList.add('hidden');
    }

    async function executeUserDelete() {
        if (!userIdToDelete) return;
        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete_user', user_id: userIdToDelete })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);

            const trToDelete = userTableBody.querySelector(`tr[data-user-id="${userIdToDelete}"]`);
            if (trToDelete) trToDelete.remove();
            
            fetchDashboardStats();
            closeDeleteModal();
        } catch (error) {
            alert(`エラー: ${error.message}`);
            closeDeleteModal();
        }
    }
    
    function openEditModal(user) {
        userToEdit = user;
        editForm.elements['edit-user-id'].value = user.ID;
        editForm.elements['edit-user-name'].value = user.Name;
        editForm.elements['edit-user-email'].value = user.Email;
        editForm.elements['edit-user-type'].value = user.UserType;
        editModal.classList.remove('hidden');
    }

    function closeEditModal() {
        userToEdit = null;
        editModal.classList.add('hidden');
    }

    async function handleUserEditSubmit(e) {
        e.preventDefault();
        const formData = new FormData(editForm);
        const data = {
            action: 'update_user',
            user_id: formData.get('user_id'),
            name: formData.get('name'),
            email: formData.get('email'),
            user_type: formData.get('user_type'),
        };

        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            
            fetchAndRenderUsers();
            closeEditModal();
        } catch (error) {
            alert(`エラー: ${error.message}`);
        }
    }

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
