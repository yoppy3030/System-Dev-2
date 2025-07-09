document.addEventListener('DOMContentLoaded', () => {
    // グローバル変数
    let learningProgressChart = null;
    let currentLanguage = localStorage.getItem('mypage_language') || 'ja';

    // DOM要素
    const languageSwitcher = document.getElementById('language-switcher-mypage');
    const resetProgressBtn = document.getElementById('reset-progress-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const cancelResetBtn = document.getElementById('cancel-reset-btn');
    const confirmResetBtn = document.getElementById('confirm-reset-btn');

    /**
     * ページ初期化
     */
    function initializePage() {
        setupTranslation();
        renderQuizChart();
        renderLearnedTopics();
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
        renderQuizChart();
        renderLearnedTopics();
        renderAchievements();
    }
    
    /**
     * 翻訳テキストを取得 (ネストされたキーにも対応)
     * @param {string} key - 'my_page_title' or 'achievements.perfect_master.title'
     * @param {string} lang 
     */
    function getTranslation(key, lang) {
        let text = uiStrings[lang];
        try {
            const keys = key.split('.');
            for (const k of keys) {
                if (text[k] === undefined) return null;
                text = text[k];
            }
            return text;
        } catch (e) {
            return null;
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
            localStorage.removeItem('chatbot_achievements'); // アチーブメント履歴も削除
            
            initializePage(); // 全て再描画

            confirmModal.classList.add('hidden');
        });
    }

    /**
     * クイズ成績グラフを描画
     */
    function renderQuizChart() {
        const ctx = document.getElementById('learningProgressChart').getContext('2d');
        const noDataEl = document.getElementById('no-quiz-data');
        const quizHistory = JSON.parse(localStorage.getItem('chatbot_quiz_history')) || [];

        if (learningProgressChart) {
            learningProgressChart.destroy();
        }

        if (quizHistory.length === 0) {
            noDataEl.classList.remove('hidden');
            document.getElementById('learningProgressChart').style.display = 'none';
            return;
        }

        noDataEl.classList.add('hidden');
        document.getElementById('learningProgressChart').style.display = 'block';

        const labels = quizHistory.map(item => 
            new Date(item.date).toLocaleDateString(currentLanguage, { month: 'numeric', day: 'numeric' })
        );
        const scores = quizHistory.map(item =>
            item.total > 0 ? (item.score / item.total) * 100 : 0
        );
        
        const chartLabel = getTranslation('quiz_stats_title', currentLanguage);

        learningProgressChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: chartLabel,
                    data: scores,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 1)',
                    pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(14, 165, 233, 1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.2)' } },
                    y: { ticks: { color: 'white' }, grid: { color: 'rgba(255, 255, 255, 0.2)' }, beginAtZero: true, max: 100 }
                },
                plugins: {
                    legend: { labels: { color: '#fff', font: { size: 14 } } }
                }
            }
        });
    }

    /**
     * 学習したトピックリストを描画
     */
    function renderLearnedTopics() {
        const topicsListEl = document.getElementById('learned-topics-list');
        const noDataEl = document.getElementById('no-learned-topics-data');
        let learnedTopics = [];
        try {
            const storedData = localStorage.getItem('chatbot_learned_topics');
            learnedTopics = storedData ? JSON.parse(storedData) : [];
        } catch (e) { console.error("Error parsing learned topics", e); }

        topicsListEl.innerHTML = '';

        if (learnedTopics.length === 0) {
            noDataEl.classList.remove('hidden');
            return;
        }

        noDataEl.classList.add('hidden');
        
        const faqText = getTranslation('faq_source_text', currentLanguage);
        const summaryText = getTranslation('ai_summary_text', currentLanguage);

        learnedTopics.forEach(topic => {
            const li = document.createElement('li');
            li.className = 'p-4 rounded-lg border';
            if (topic.type === 'faq') {
                li.classList.add('bg-green-50', 'border-green-200');
                li.innerHTML = `<div class="flex items-start gap-3"><i class="fas fa-check-circle text-green-500 text-lg mt-1"></i><div><p class="font-semibold text-gray-800">${topic.question}</p><p class="text-sm text-gray-500">${faqText}</p></div></div>`;
            } else if (topic.type === 'query' && topic.summary) {
                li.classList.add('bg-sky-50', 'border-sky-200');
                li.innerHTML = `<div class="flex items-start gap-3"><i class="fas fa-question-circle text-sky-500 text-lg mt-1"></i><div><p class="font-semibold text-gray-800">${topic.question}</p><p class="text-sm text-gray-600 mt-1"><strong>${summaryText}</strong> ${topic.summary}</p></div></div>`;
            }
            topicsListEl.appendChild(li);
        });
    }
    
    /**
     * アチーブメントをチェック＆保存
     */
    function checkAndSaveAchievements() {
        const quizHistory = JSON.parse(localStorage.getItem('chatbot_quiz_history')) || [];
        const learnedTopics = JSON.parse(localStorage.getItem('chatbot_learned_topics')) || [];
        let unlockedAchievements = JSON.parse(localStorage.getItem('chatbot_achievements')) || [];

        // 条件判定用の統計データを計算
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

    /**
     * アチーブメントを描画
     */
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
