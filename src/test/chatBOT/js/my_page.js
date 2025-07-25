document.addEventListener('DOMContentLoaded', () => {
    // --- グローバル変数 ---
    let quizScoreChart = null;
    let currentLanguage = localStorage.getItem('mypage_language') || 'ja';
    let myPageData = {
        quiz_history: [],
        learned_topics: [],
        mistakes: [],
        achievements: []
    };
    // ★★★ 修正点: グローバルスコープからCSRFトークンを取得 ★★★
    // my_page.phpで定義された `CSRF_TOKEN` 変数を読み込みます。
    const csrfToken = typeof CSRF_TOKEN !== 'undefined' ? CSRF_TOKEN : '';


    // --- DOM要素 ---
    const languageSwitcher = document.getElementById('language-switcher-mypage');
    const resetProgressBtn = document.getElementById('reset-progress-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const cancelResetBtn = document.getElementById('cancel-reset-btn');
    const confirmResetBtn = document.getElementById('confirm-reset-btn');
    const topicSortSelect = document.getElementById('topic-sort-select');
    const mistakeNoteList = document.getElementById('mistake-note-list');
    const noMistakesData = document.getElementById('no-mistakes-data');
    const mistakeRetryModal = document.getElementById('mistake-retry-modal');
    const mistakeModalQuestion = document.getElementById('mistake-modal-question');
    const mistakeModalOptions = document.getElementById('mistake-modal-options');
    const mistakeModalFeedback = document.getElementById('mistake-modal-feedback');
    const mistakeModalCloseBtn = document.getElementById('mistake-modal-close-btn');
    const topicsListEl = document.getElementById('learned-topics-list');
    const achievementsListEl = document.getElementById('achievements-list');
    const noAchievementsData = document.getElementById('no-achievements-data');

    // --- API通信ラッパー ---
    const api = {
        async request(endpoint, options = {}) {
            const url = `./chat_api.php?action=${endpoint}`;
            
            // ★★★ 修正点: POSTリクエストにCSRFトークンを自動的に含める ★★★
            if (options.method === 'POST') {
                options.body = options.body || {};
                options.body.csrf_token = csrfToken;
            }

            try {
                const response = await fetch(url, {
                    method: options.method || 'GET',
                    headers: { 'Content-Type': 'application/json', ...options.headers },
                    body: options.body ? JSON.stringify(options.body) : null
                });
                const responseData = await response.json();
                if (!response.ok) {
                    // ★★★ 修正点: エラーハンドリングを改善 ★★★
                    if (response.status === 403 || response.status === 401) {
                        // 403はCSRFエラーや権限エラーの可能性がある
                        alert(responseData.error || 'セッションが無効か、権限がありません。再度ログインしてください。');
                        window.location.href = '../login.php'; 
                    }
                    throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
                }
                return responseData;
            } catch (error) {
                console.error(`API request to ${endpoint} failed:`, error);
                const mainContent = document.querySelector('main');
                if(mainContent) {
                    mainContent.innerHTML = `<div class="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        <h2 class="text-2xl font-bold mb-2">エラー</h2>
                        <p>データの読み込みに失敗しました。ページを再読み込みするか、後でもう一度お試しください。</p>
                        <p class="text-sm mt-4">詳細: ${error.message}</p>
                    </div>`;
                }
                throw error;
            }
        },
        getMyPageData: () => api.request('get_my_page_data'),
        resetAllData: () => api.request('reset_all_data', { method: 'POST' }), // bodyはapi.requestが自動で設定
        deleteLearnedTopic: (topic_key) => api.request('delete_learned_topic', { method: 'POST', body: { topic_key } }),
        deleteMistake: (id) => api.request('delete_mistake', { method: 'POST', body: { id } })
    };

    /**
     * ページ初期化
     */
    async function initializePage() {
        if (!csrfToken) {
            console.error('CSRF token is missing. Actions will fail.');
            alert('セキュリティトークンが読み込めませんでした。ページを再読み込みしてください。');
        }
        setupEventListeners();
        switchLanguage(currentLanguage); // UI翻訳を先に実行
        
        try {
            // APIから取得したデータをグローバル変数に格納
            myPageData = await api.getMyPageData();
            console.log("APIから取得したデータ:", myPageData); // デバッグ用ログ
            renderAllComponents();
        } catch (error) {
            console.error("Failed to initialize page with data:", error);
        }
    }
    
    /**
     * すべてのコンポーネントを描画する
     */
    function renderAllComponents() {
        renderQuizStats(myPageData.quiz_history || []);
        sortAndRenderTopics(topicSortSelect.value);
        renderMistakeNote(myPageData.mistakes || []);
        renderAchievements(myPageData.achievements || []);
    }

    /**
     * 言語切り替えと翻訳処理
     */
    function switchLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('mypage_language', lang);
        languageSwitcher.value = lang;
        translatePage(lang);
        // データが既に読み込まれていれば、UIを再描画
        if (myPageData) {
            renderAllComponents();
        }
    }

    /**
     * ページ上のdata-translate属性を持つ要素をすべて翻訳する
     */
    function translatePage(lang) {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(el => {
            const key = el.dataset.translate;
            const translation = getTranslation(key, lang);
            if (translation && typeof translation === 'string') {
                 el.textContent = translation;
            }
        });
    }
    
    function getTranslation(key, lang) {
        // uiStringsは knowledge.js で定義されている前提
        const extendedUiStrings = {
            ...uiStrings,
            ja: { ...uiStrings.ja, overall_avg_score: '総合平均点', total_attempts: '総受験回数', attempts: '回', avg_score: '平均点', difficulty_easy: '簡単', difficulty_normal: '普通', difficulty_hard: '難しい' },
            en: { ...uiStrings.en, overall_avg_score: 'Overall Avg. Score', total_attempts: 'Total Attempts', attempts: 'attempts', avg_score: 'Avg. Score', difficulty_easy: 'Easy', difficulty_normal: 'Normal', difficulty_hard: 'Hard' },
            zh: { ...uiStrings.zh, overall_avg_score: '综合平均分', total_attempts: '总挑战次数', attempts: '次', avg_score: '平均分', difficulty_easy: '简单', difficulty_normal: '普通', difficulty_hard: '困难' }
        };
        let text = extendedUiStrings[lang];
        try {
            const keys = key.split('.');
            for (const k of keys) {
                if (text[k] === undefined) return key; 
                text = text[k];
            }
            return text;
        } catch (e) {
            return key;
        }
    }

    /**
     * イベントリスナーをセットアップ
     */
    function setupEventListeners() {
        languageSwitcher.addEventListener('change', (e) => switchLanguage(e.target.value));

        resetProgressBtn.addEventListener('click', () => confirmModal.classList.remove('hidden'));

        cancelResetBtn.addEventListener('click', () => confirmModal.classList.add('hidden'));
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) confirmModal.classList.add('hidden');
        });

        confirmResetBtn.addEventListener('click', async () => {
            try {
                await api.resetAllData();
                myPageData = { quiz_history: [], learned_topics: [], mistakes: [], achievements: [] };
                renderAllComponents();
            } catch (error) {
                alert('データのリセットに失敗しました。');
            } finally {
                confirmModal.classList.add('hidden');
            }
        });

        topicsListEl.addEventListener('click', async (e) => {
            const deleteBtn = e.target.closest('.delete-topic-btn');
            if (deleteBtn) {
                e.stopPropagation();
                const topicKeyToDelete = deleteBtn.dataset.topicKey;
                
                try {
                    await api.deleteLearnedTopic(topicKeyToDelete);
                    myPageData.learned_topics = myPageData.learned_topics.filter(topic => topic.topic_key !== topicKeyToDelete);
                    renderLearnedTopics();
                } catch(error) {
                    alert('トピックの削除に失敗しました。');
                }
                return;
            }

            const card = e.target.closest('.flashcard');
            if (card) card.classList.toggle('is-flipped');
        });

        topicSortSelect.addEventListener('change', (e) => sortAndRenderTopics(e.target.value));

        mistakeNoteList.addEventListener('click', (e) => {
            const button = e.target.closest('.mistake-challenge-btn');
            if (button) {
                const mistakeId = parseInt(button.dataset.id, 10);
                const mistake = myPageData.mistakes.find(m => m.id === mistakeId);
                if(mistake) openMistakeModal(mistake);
            }
        });

        mistakeModalCloseBtn.addEventListener('click', () => mistakeRetryModal.classList.add('hidden'));
        mistakeRetryModal.addEventListener('click', (e) => {
            if (e.target === mistakeRetryModal) mistakeRetryModal.classList.add('hidden');
        });
    }

    // --- 各コンポーネントの描画関数 ---

    function renderQuizStats(quizHistory = []) {
        const noDataEl = document.getElementById('no-quiz-data');
        const dataDisplayEl = document.getElementById('quiz-data-display');
        
        if (quizScoreChart) quizScoreChart.destroy();

        if (quizHistory.length === 0) {
            noDataEl.classList.remove('hidden');
            dataDisplayEl.classList.add('hidden');
            return;
        }

        noDataEl.classList.add('hidden');
        dataDisplayEl.classList.remove('hidden');
        dataDisplayEl.classList.add('grid');

        const stats = {
            totalScore: 0, totalQuestions: 0, totalAttempts: quizHistory.length,
            easy: { score: 0, questions: 0, attempts: 0 },
            normal: { score: 0, questions: 0, attempts: 0 },
            hard: { score: 0, questions: 0, attempts: 0 },
        };

        quizHistory.forEach(item => {
            stats.totalScore += parseInt(item.score);
            stats.totalQuestions += parseInt(item.total);
            if (stats[item.difficulty]) {
                stats[item.difficulty].score += parseInt(item.score);
                stats[item.difficulty].questions += parseInt(item.total);
                stats[item.difficulty].attempts++;
            }
        });

        const totalAverage = stats.totalQuestions > 0 ? (stats.totalScore / stats.totalQuestions * 100).toFixed(1) : 0;
        const getAvg = (diff) => diff.questions > 0 ? (diff.score / diff.questions * 100).toFixed(1) : 0;
        
        document.getElementById('total-average-score').textContent = `${totalAverage}%`;
        document.getElementById('total-quiz-count').textContent = stats.totalAttempts;

        const renderDifficultyCard = (difficulty) => {
            const el = document.getElementById(`${difficulty}-stats`);
            const difficultyData = stats[difficulty];
            const avgScore = getAvg(difficultyData);
            const colorClasses = {
                easy: { text: 'text-green-800', title: 'text-green-600' },
                normal: { text: 'text-yellow-800', title: 'text-yellow-600' },
                hard: { text: 'text-red-800', title: 'text-red-600' },
            };
            el.innerHTML = `<p class="font-semibold ${colorClasses[difficulty].title}">${getTranslation(`difficulty_${difficulty}`, currentLanguage)}</p>
                            <p class="text-sm ${colorClasses[difficulty].text}">${getTranslation('avg_score', currentLanguage)}: <span class="font-bold">${avgScore}%</span></p>
                            <p class="text-sm ${colorClasses[difficulty].text}">${difficultyData.attempts} ${getTranslation('attempts', currentLanguage)}</p>`;
        };
        ['easy', 'normal', 'hard'].forEach(renderDifficultyCard);

        const ctx = document.getElementById('quizScoreChart').getContext('2d');
        quizScoreChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [getTranslation('difficulty_easy', currentLanguage), getTranslation('difficulty_normal', currentLanguage), getTranslation('difficulty_hard', currentLanguage)],
                datasets: [{
                    label: getTranslation('overall_avg_score', currentLanguage),
                    data: [getAvg(stats.easy), getAvg(stats.normal), getAvg(stats.hard)],
                    backgroundColor: ['rgba(74, 222, 128, 0.6)', 'rgba(250, 204, 21, 0.6)', 'rgba(248, 113, 113, 0.6)'],
                    borderColor: ['rgba(34, 197, 94, 1)', 'rgba(234, 179, 8, 1)', 'rgba(239, 68, 68, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (value) => value + '%' } } },
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw}%` } } }
            }
        });
    }

    function sortAndRenderTopics(sortBy) {
        if (!myPageData.learned_topics) return;
        switch (sortBy) {
            case 'newest':
                myPageData.learned_topics.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'oldest':
                myPageData.learned_topics.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            case 'type':
                myPageData.learned_topics.sort((a, b) => a.topic_type.localeCompare(b.topic_type));
                break;
        }
        renderLearnedTopics();
    }
    
    function renderLearnedTopics() {
        const topics = myPageData.learned_topics || [];
        const noDataEl = document.getElementById('no-learned-topics-data');
        topicsListEl.innerHTML = '';

        if (topics.length === 0) {
            noDataEl.classList.remove('hidden');
            topicsListEl.classList.add('hidden');
            return;
        }

        noDataEl.classList.add('hidden');
        topicsListEl.classList.remove('hidden');
        
        const faqText = getTranslation('faq_source_text', currentLanguage);
        const summaryText = getTranslation('ai_summary_text', currentLanguage);

        topics.forEach(topic => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'flashcard';
            
            const topicKey = topic.topic_key;
            const isFaq = topic.topic_type === 'faq';
            const question = isFaq ? (uiStrings[currentLanguage].faq.questions.find(q => q.id === topicKey)?.q || topicKey) : topicKey;
            const answer = isFaq ? (uiStrings[currentLanguage].faq.questions.find(q => q.id === topicKey)?.a || '') : topic.summary;

            cardContainer.innerHTML = `
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <button class="delete-topic-btn" data-topic-key="${topicKey}" title="削除"><i class="fas fa-times"></i></button>
                        <i class="${isFaq ? 'fas fa-check-circle text-green-500' : 'fas fa-question-circle text-sky-500'} text-2xl mb-2"></i>
                        <p class="font-semibold text-gray-800 text-center">${question}</p>
                        <p class="text-xs text-gray-400 mt-auto pt-2">${new Date(topic.created_at).toLocaleDateString()}</p>
                    </div>
                    <div class="flashcard-back">
                        <p class="text-sm font-bold">${isFaq ? faqText : summaryText}</p><hr class="my-2 border-gray-300 w-full">
                        <p class="text-base">${answer}</p>
                    </div>
                </div>`;
            topicsListEl.appendChild(cardContainer);
        });
    }
    
    function renderMistakeNote(mistakes = []) {
        mistakeNoteList.innerHTML = '';
        if (mistakes.length === 0) {
            noMistakesData.classList.remove('hidden');
            return;
        }
        noMistakesData.classList.add('hidden');

        mistakes.forEach((mistake) => {
            const li = document.createElement('li');
            li.className = 'mistake-item';
            li.innerHTML = `<p>${mistake.question[currentLanguage]}</p>
                            <button class="mistake-challenge-btn" data-id="${mistake.id}">${getTranslation('mistake_note_challenge_btn', currentLanguage)}</button>`;
            mistakeNoteList.appendChild(li);
        });
    }

    function openMistakeModal(mistake) {
        mistakeModalQuestion.textContent = mistake.question[currentLanguage];
        mistakeModalOptions.innerHTML = '';
        mistakeModalFeedback.innerHTML = '';

        mistake.options[currentLanguage].forEach((optionText, optionIndex) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = optionText;
            button.onclick = () => checkMistakeAnswer(mistake, optionIndex);
            mistakeModalOptions.appendChild(button);
        });

        mistakeRetryModal.classList.remove('hidden');
    }

    async function checkMistakeAnswer(mistake, selectedOptionIndex) {
        const correct = selectedOptionIndex === mistake.correct_answer_index;
        const feedbackText = correct ? getTranslation('mistake_note_correct', currentLanguage) : getTranslation('mistake_note_incorrect', currentLanguage);
        
        mistakeModalFeedback.textContent = feedbackText;
        mistakeModalFeedback.className = `mt-4 text-sm font-medium ${correct ? 'text-green-600' : 'text-red-600'}`;

        if (correct) {
            try {
                await api.deleteMistake(mistake.id);
                myPageData.mistakes = myPageData.mistakes.filter(m => m.id !== mistake.id);
                setTimeout(() => {
                    mistakeRetryModal.classList.add('hidden');
                    renderMistakeNote(myPageData.mistakes);
                }, 2000);
            } catch(error) {
                alert('間違いノートからの削除に失敗しました。');
            }
        }
    }
    
    function renderAchievements(unlockedKeys = []) {
        achievementsListEl.innerHTML = '';
        noAchievementsData.classList.toggle('hidden', Object.keys(achievements).length > 0);

        for (const key in achievements) {
            const isUnlocked = unlockedKeys.includes(key);
            const achievementInfo = achievements[key];
            const langStrings = getTranslation(`achievements.${key}`, currentLanguage);
            
            const li = document.createElement('li');
            li.className = `achievement-item ${isUnlocked ? 'unlocked' : ''}`;
            li.innerHTML = `<div class="achievement-icon"><i class="${achievementInfo.icon}"></i></div>
                            <div class="achievement-details">
                                <p class="achievement-title">${langStrings.title}</p>
                                <p class="achievement-description">${langStrings.desc}</p>
                            </div>`;
            achievementsListEl.appendChild(li);
        }
    }

    // ページの実行開始
    initializePage();
});
