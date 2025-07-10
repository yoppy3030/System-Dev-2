document.addEventListener('DOMContentLoaded', () => {
    // グローバル変数
    let quizScoreChart = null; // Chart.jsのインスタンスを保持
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
        renderQuizStats(); // クイズ成績の描画関数を呼び出し
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
        // 言語変更後にデータを再描画
        renderQuizStats();
        renderLearnedTopics();
        renderAchievements();
    }
    
    /**
     * 翻訳テキストを取得 (ネストされたキーにも対応)
     * @param {string} key - 'my_page_title' or 'achievements.perfect_master.title'
     * @param {string} lang 
     */
    function getTranslation(key, lang) {
        // ▼▼▼【追加】uiStringsに新しい翻訳キーを追加 ▼▼▼
        const extendedUiStrings = {
            ...uiStrings,
            ja: { ...uiStrings.ja, overall_avg_score: '総合平均点', total_attempts: '総受験回数', attempts: '回', avg_score: '平均点', difficulty_easy: '簡単', difficulty_normal: '普通', difficulty_hard: '難しい' },
            en: { ...uiStrings.en, overall_avg_score: 'Overall Avg. Score', total_attempts: 'Total Attempts', attempts: 'attempts', avg_score: 'Avg. Score', difficulty_easy: 'Easy', difficulty_normal: 'Normal', difficulty_hard: 'Hard' },
            zh: { ...uiStrings.zh, overall_avg_score: '综合平均分', total_attempts: '总挑战次数', attempts: '次', avg_score: '平均分', difficulty_easy: '简单', difficulty_normal: '普通', difficulty_hard: '困难' }
        };
        // ▲▲▲ ここまで ▲▲▲
        let text = extendedUiStrings[lang];
        try {
            const keys = key.split('.');
            for (const k of keys) {
                if (text[k] === undefined) return key; // 翻訳が見つからない場合はキーを返す
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
    }

    /**
     * ▼▼▼【全面改修】クイズ成績の統計表示とグラフ描画を行う関数 ▼▼▼
     */
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
        dataDisplayEl.classList.add('grid'); // grid表示を有効化

        // 1. 統計データの計算
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

        // 2. 統計データをHTMLに反映
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

        // 3. 棒グラフの描画
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
                        'rgba(74, 222, 128, 0.6)',  // green-400
                        'rgba(250, 204, 21, 0.6)',   // yellow-400
                        'rgba(248, 113, 113, 0.6)'  // red-400
                    ],
                    borderColor: [
                        'rgba(34, 197, 94, 1)',   // green-500
                        'rgba(234, 179, 8, 1)',    // yellow-500
                        'rgba(239, 68, 68, 1)'    // red-500
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
                        display: false // 凡例は非表示
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
    // ▲▲▲ ここまで ▲▲▲

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
