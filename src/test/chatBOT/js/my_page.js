document.addEventListener('DOMContentLoaded', () => {
    // グローバル変数
    let quizScoreChart = null; 
    let currentLanguage = localStorage.getItem('mypage_language') || 'ja';
    let learnedTopicsData = []; // トピックデータを保持する

    // DOM要素
    const languageSwitcher = document.getElementById('language-switcher-mypage');
    const resetProgressBtn = document.getElementById('reset-progress-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const cancelResetBtn = document.getElementById('cancel-reset-btn');
    const confirmResetBtn = document.getElementById('confirm-reset-btn');
    const topicSortSelect = document.getElementById('topic-sort-select');

    /**
     * ページ初期化
     */
    function initializePage() {
        setupTranslation();
        renderQuizStats(); 
        loadAndRenderTopics(); // データをロードして描画
        renderAchievements();
        setupEventListeners();
    }

    /**
     * 翻訳関連のセットアップ
     */
    function setupTranslation() {
        languageSwitcher.value = currentLanguage;
        translatePage(currentLanguage);
        languageSwitcher.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem('mypage_language', currentLanguage);
            translatePage(currentLanguage);
        });
    }

    /**
     * ページ上のdata-translate属性を持つ要素をすべて翻訳する
     * @param {string} lang - 'ja', 'en', 'zh' などの言語コード
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
        // 言語変更後にデータを再描画
        renderQuizStats();
        renderLearnedTopics(); // 保持しているデータで再描画
        renderAchievements();
    }
    
    function getTranslation(key, lang) {
        const extendedUiStrings = {
            ...uiStrings,
            ja: { ...uiStrings.ja, overall_avg_score: '総合平均点', total_attempts: '総受験回数', attempts: '回', avg_score: '平均点', difficulty_easy: '簡単', difficulty_normal: '普通', difficulty_hard: '難しい', sort_newest: '新しい順', sort_oldest: '古い順', sort_type: '種類別' },
            en: { ...uiStrings.en, overall_avg_score: 'Overall Avg. Score', total_attempts: 'Total Attempts', attempts: 'attempts', avg_score: 'Avg. Score', difficulty_easy: 'Easy', difficulty_normal: 'Normal', difficulty_hard: 'Hard', sort_newest: 'Newest First', sort_oldest: 'Oldest First', sort_type: 'By Type' },
            zh: { ...uiStrings.zh, overall_avg_score: '综合平均分', total_attempts: '总挑战次数', attempts: '次', avg_score: '平均分', difficulty_easy: '简单', difficulty_normal: '普通', difficulty_hard: '困难', sort_newest: '最新', sort_oldest: '最早', sort_type: '按类型' }
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
        resetProgressBtn.addEventListener('click', () => {
            confirmModal.classList.remove('hidden');
        });

        cancelResetBtn.addEventListener('click', () => {
            confirmModal.classList.add('hidden');
        });
        
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                confirmModal.classList.add('hidden');
            }
        });

        confirmResetBtn.addEventListener('click', () => {
            localStorage.removeItem('chatbot_quiz_history');
            localStorage.removeItem('chatbot_learned_topics');
            localStorage.removeItem('chatbot_achievements');
            
            initializePage();

            confirmModal.classList.add('hidden');
        });

        const topicsListEl = document.getElementById('learned-topics-list');
        topicsListEl.addEventListener('click', (e) => {
            const card = e.target.closest('.flashcard');
            if (card) {
                card.classList.toggle('is-flipped');
            }
        });

        // ▼▼▼【追加】並び替えセレクトボックスのイベントリスナー ▼▼▼
        topicSortSelect.addEventListener('change', (e) => {
            sortAndRenderTopics(e.target.value);
        });
    }

    function renderQuizStats() {
        const noDataEl = document.getElementById('no-quiz-data');
        const dataDisplayEl = document.getElementById('quiz-data-display');
        const quizHistory = JSON.parse(localStorage.getItem('chatbot_quiz_history')) || [];

        if (quizScoreChart) {
            quizScoreChart.destroy();
        }

        if (quizHistory.length === 0) {
            noDataEl.classList.remove('hidden');
            dataDisplayEl.classList.add('hidden');
            return;
        }

        noDataEl.classList.add('hidden');
        dataDisplayEl.classList.remove('hidden');
        dataDisplayEl.classList.add('grid'); 

        const stats = {
            totalScore: 0,
            totalQuestions: 0,
            totalAttempts: quizHistory.length,
            easy: { score: 0, questions: 0, attempts: 0 },
            normal: { score: 0, questions: 0, attempts: 0 },
            hard: { score: 0, questions: 0, attempts: 0 },
        };

        quizHistory.forEach(item => {
            stats.totalScore += item.score;
            stats.totalQuestions += item.total;
            if (stats[item.difficulty]) {
                stats[item.difficulty].score += item.score;
                stats[item.difficulty].questions += item.total;
                stats[item.difficulty].attempts++;
            }
        });

        const totalAverage = stats.totalQuestions > 0 ? (stats.totalScore / stats.totalQuestions * 100).toFixed(1) : 0;
        
        const getAvg = (diff) => diff.questions > 0 ? (diff.score / diff.questions * 100).toFixed(1) : 0;
        const easyAvg = getAvg(stats.easy);
        const normalAvg = getAvg(stats.normal);
        const hardAvg = getAvg(stats.hard);

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
            
            el.innerHTML = `
                <p class="font-semibold ${colorClasses[difficulty].title}">${getTranslation(`difficulty_${difficulty}`, currentLanguage)}</p>
                <p class="text-sm ${colorClasses[difficulty].text}">${getTranslation('avg_score', currentLanguage)}: <span class="font-bold">${avgScore}%</span></p>
                <p class="text-sm ${colorClasses[difficulty].text}">${difficultyData.attempts} ${getTranslation('attempts', currentLanguage)}</p>
            `;
        };
        renderDifficultyCard('easy');
        renderDifficultyCard('normal');
        renderDifficultyCard('hard');

        const ctx = document.getElementById('quizScoreChart').getContext('2d');
        quizScoreChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    getTranslation('difficulty_easy', currentLanguage), 
                    getTranslation('difficulty_normal', currentLanguage), 
                    getTranslation('difficulty_hard', currentLanguage)
                ],
                datasets: [{
                    label: getTranslation('overall_avg_score', currentLanguage),
                    data: [easyAvg, normalAvg, hardAvg],
                    backgroundColor: [
                        'rgba(74, 222, 128, 0.6)',
                        'rgba(250, 204, 21, 0.6)',
                        'rgba(248, 113, 113, 0.6)'
                    ],
                    borderColor: [
                        'rgba(34, 197, 94, 1)',
                        'rgba(234, 179, 8, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ▼▼▼【変更】トピックのロードと描画を分離 ▼▼▼
    function loadAndRenderTopics() {
        try {
            const storedData = localStorage.getItem('chatbot_learned_topics');
            // 各トピックにタイムスタンプを追加
            learnedTopicsData = (storedData ? JSON.parse(storedData) : []).map((topic, index) => ({
                ...topic,
                timestamp: Date.now() - index // 古いデータほど小さいタイムスタンプになるように仮設定
            }));
        } catch (e) { 
            console.error("Error parsing learned topics", e); 
            learnedTopicsData = [];
        }
        sortAndRenderTopics(topicSortSelect.value);
    }

    function sortAndRenderTopics(sortBy) {
        switch (sortBy) {
            case 'newest':
                learnedTopicsData.sort((a, b) => b.timestamp - a.timestamp);
                break;
            case 'oldest':
                learnedTopicsData.sort((a, b) => a.timestamp - b.timestamp);
                break;
            case 'type':
                learnedTopicsData.sort((a, b) => a.type.localeCompare(b.type));
                break;
        }
        renderLearnedTopics();
    }
    
    function renderLearnedTopics() {
        const topicsListEl = document.getElementById('learned-topics-list');
        const noDataEl = document.getElementById('no-learned-topics-data');

        topicsListEl.innerHTML = '';

        if (learnedTopicsData.length === 0) {
            noDataEl.classList.remove('hidden');
            topicsListEl.classList.add('hidden');
            return;
        }

        noDataEl.classList.add('hidden');
        topicsListEl.classList.remove('hidden');
        
        const faqText = getTranslation('faq_source_text', currentLanguage);
        const summaryText = getTranslation('ai_summary_text', currentLanguage);

        learnedTopicsData.forEach(topic => {
            const cardContainer = document.createElement('div');
            cardContainer.className = 'flashcard';

            const cardInner = document.createElement('div');
            cardInner.className = 'flashcard-inner';

            const cardFront = document.createElement('div');
            cardFront.className = 'flashcard-front';
            const frontIconClass = topic.type === 'faq' ? 'fas fa-check-circle text-green-500' : 'fas fa-question-circle text-sky-500';
            cardFront.innerHTML = `
                <i class="${frontIconClass} text-2xl mb-2"></i>
                <p class="font-semibold text-gray-800 text-center">${topic.question}</p>
                <p class="text-xs text-gray-400 mt-auto pt-2">${new Date(topic.timestamp).toLocaleDateString()}</p>
            `;

            const cardBack = document.createElement('div');
            cardBack.className = 'flashcard-back';
            let backContent = '';
            if (topic.type === 'faq') {
                const faqItem = uiStrings[currentLanguage].faq.questions.find(q => q.id === topic.id);
                backContent = `<p class="text-sm font-bold">${faqText}</p><hr class="my-2 border-gray-300 w-full"><p class="text-base">${faqItem ? faqItem.a : ''}</p>`;
            } else if (topic.type === 'query' && topic.summary) {
                backContent = `<p class="text-sm font-bold">${summaryText}</p><hr class="my-2 border-gray-300 w-full"><p class="text-base">${topic.summary}</p>`;
            }
            cardBack.innerHTML = backContent;

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardContainer.appendChild(cardInner);
            topicsListEl.appendChild(cardContainer);
        });
    }
    
    function checkAndSaveAchievements() {
        const quizHistory = JSON.parse(localStorage.getItem('chatbot_quiz_history')) || [];
        const learnedTopics = JSON.parse(localStorage.getItem('chatbot_learned_topics')) || [];
        let unlockedAchievements = JSON.parse(localStorage.getItem('chatbot_achievements')) || [];

        const stats = {
            totalQuizzesTaken: quizHistory.length,
            perfectScores: {
                easy: quizHistory.some(q => q.difficulty === 'easy' && q.score === q.total && q.total > 0),
                normal: quizHistory.some(q => q.difficulty === 'normal' && q.score === q.total && q.total > 0),
                hard: quizHistory.some(q => q.difficulty === 'hard' && q.score === q.total && q.total > 0),
            },
            learnedTopicsCount: learnedTopics.length
        };

        let newAchievementUnlocked = false;
        for (const key in achievements) {
            if (!unlockedAchievements.includes(key) && achievements[key].condition(stats)) {
                unlockedAchievements.push(key);
                newAchievementUnlocked = true;
            }
        }
        
        if (newAchievementUnlocked) {
            localStorage.setItem('chatbot_achievements', JSON.stringify(unlockedAchievements));
        }
    }

    function renderAchievements() {
        checkAndSaveAchievements();
        const listEl = document.getElementById('achievements-list');
        const noDataEl = document.getElementById('no-achievements-data');
        const unlocked = JSON.parse(localStorage.getItem('chatbot_achievements')) || [];

        listEl.innerHTML = '';

        if (Object.keys(achievements).length === 0) {
            noDataEl.classList.remove('hidden');
            return;
        }
        noDataEl.classList.add('hidden');

        for (const key in achievements) {
            const isUnlocked = unlocked.includes(key);
            const achievementInfo = achievements[key];
            const langStrings = getTranslation(`achievements.${key}`, currentLanguage);
            
            const li = document.createElement('li');
            li.className = 'achievement-item';
            if (isUnlocked) {
                li.classList.add('unlocked');
            }

            li.innerHTML = `
                <div class="achievement-icon"><i class="${achievementInfo.icon}"></i></div>
                <div class="achievement-details">
                    <p class="achievement-title">${langStrings.title}</p>
                    <p class="achievement-description">${langStrings.desc}</p>
                </div>
            `;
            listEl.appendChild(li);
        }
    }

    // ページの実行開始
    initializePage();
});
