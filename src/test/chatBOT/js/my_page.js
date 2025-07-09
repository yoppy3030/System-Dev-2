document.addEventListener('DOMContentLoaded', () => {
    // グローバル変数
    let learningProgressChart = null;
    // localStorageから言語設定を読み込む（なければ日本語をデフォルトに）
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
        setupEventListeners();
    }

    /**
     * 翻訳関連のセットアップ
     */
    function setupTranslation() {
        // ドロップダウンの表示を現在の言語に合わせる
        languageSwitcher.value = currentLanguage;
        
        // ページ全体のテキストを現在の言語で表示
        translatePage(currentLanguage);

        // ドロップダウンの言語が変更されたら、翻訳を実行
        languageSwitcher.addEventListener('change', (e) => {
            const newLang = e.target.value;
            currentLanguage = newLang;
            localStorage.setItem('mypage_language', newLang); // 新しい言語設定を保存
            translatePage(newLang);
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
            // uiStringsオブジェクトにキーが存在すれば翻訳
            if (uiStrings[lang] && uiStrings[lang][key]) {
                el.textContent = uiStrings[lang][key];
            }
        });
        // チャートのラベルも言語に合わせて再描画
        renderQuizChart();
        // 学習済みトピックの静的テキストも更新
        renderLearnedTopics();
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
            
            renderQuizChart();
            renderLearnedTopics();

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
            return;
        }

        noDataEl.classList.add('hidden');

        const labels = quizHistory.map(item => 
            new Date(item.date).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })
        );
        const scores = quizHistory.map(item =>
            item.total > 0 ? (item.score / item.total) * 100 : 0
        );
        
        const chartLabel = uiStrings[currentLanguage]?.quiz_stats_title || 'クイズ成績';

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

        if (!topicsListEl || !noDataEl) return;

        let learnedTopics = [];
        try {
            const storedData = localStorage.getItem('chatbot_learned_topics');
            if (storedData) {
                const parsed = JSON.parse(storedData);
                if (Array.isArray(parsed)) {
                    learnedTopics = parsed;
                }
            }
        } catch (error) {
            console.error('Error parsing learned topics from localStorage:', error);
            localStorage.removeItem('chatbot_learned_topics');
        }

        topicsListEl.innerHTML = '';

        if (learnedTopics.length === 0) {
            noDataEl.classList.remove('hidden');
            return;
        }

        noDataEl.classList.add('hidden');

        const faqText = currentLanguage === 'ja' ? '（よくある質問より）' : (currentLanguage === 'en' ? '(From FAQ)' : '(来自常见问题)');
        const summaryText = currentLanguage === 'ja' ? 'AIの要約:' : (currentLanguage === 'en' ? 'AI Summary:' : 'AI总结:');

        learnedTopics.forEach(topic => {
            const li = document.createElement('li');
            li.className = 'p-4 rounded-lg border';

            if (topic.type === 'faq') {
                li.classList.add('bg-green-50', 'border-green-200');
                li.innerHTML = `
                    <div class="flex items-start gap-3">
                        <i class="fas fa-check-circle text-green-500 text-lg mt-1"></i>
                        <div>
                            <p class="font-semibold text-gray-800">${topic.question}</p>
                            <p class="text-sm text-gray-500">${faqText}</p>
                        </div>
                    </div>
                `;
            } else if (topic.type === 'query' && topic.summary) {
                li.classList.add('bg-sky-50', 'border-sky-200');
                li.innerHTML = `
                    <div class="flex items-start gap-3">
                        <i class="fas fa-question-circle text-sky-500 text-lg mt-1"></i>
                        <div>
                            <p class="font-semibold text-gray-800">${topic.question}</p>
                            <p class="text-sm text-gray-600 mt-1"><strong>${summaryText}</strong> ${topic.summary}</p>
                        </div>
                    </div>
                `;
            }
            topicsListEl.appendChild(li);
        });
    }

    // ページの実行開始
    initializePage();
});
