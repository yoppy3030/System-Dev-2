<?php
// セッションを開始
session_start();

// ログイン状態を確認
// セッションに 'user_id' が存在しない場合、ログインページにリダイレクト
if (!isset($_SESSION['user_id'])) {
    // Locationヘッダーでリダイレクト
    header('Location: ../login.php');
    // リダイレクト後にスクリプトの実行を確実に終了する
    exit;
}

// CSRFトークンを生成または取得
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrfToken = $_SESSION['csrf_token'];
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($_SESSION['username'] ?? 'Guest'); ?>さんのマイページ - Japan Life Manual</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <style>
        /* my_page.css */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');

        body {
            font-family: 'Inter', 'Noto Sans JP', sans-serif;
            background-color: #f3f4f6; /* gray-100 */
            transition: background-color 0.3s, color 0.3s;
        }

        #reset-progress-btn {
            cursor: pointer;
        }

        .section-title {
            font-size: 1.25rem; /* text-xl */
            font-weight: 700; /* font-bold */
            color: #1f2937; /* gray-800 */
            padding-bottom: 0.5rem; /* pb-2 */
            border-bottom: 2px solid #e5e7eb; /* border-b-2 border-gray-200 */
            margin-bottom: 1.5rem; /* mb-6 */
        }

        .section-title.\!mb-0 {
            margin-bottom: 0 !important;
        }
        .section-title.\!border-b-0 {
            border-bottom: 0 !important;
        }

        .difficulty-card {
            padding: 1rem; /* p-4 */
            border-radius: 0.5rem; /* rounded-lg */
            border-width: 1px;
            transition: all 0.2s ease-in-out;
        }

        .difficulty-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        .flashcard {
            background-color: transparent;
            aspect-ratio: 3 / 2;
            perspective: 1000px;
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
        }

        .flashcard:hover {
            transform: translateY(-5px);
        }

        .flashcard-inner {
            position: relative;
            width: 100%;
            height: 100%;
            text-align: center;
            transition: transform 0.6s;
            transform-style: preserve-3d;
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.1);
            border-radius: 0.75rem; /* rounded-xl */
        }

        .flashcard.is-flipped .flashcard-inner {
            transform: rotateY(180deg);
        }

        .flashcard-front, .flashcard-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            border-radius: 0.75rem; /* rounded-xl */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 1rem;
        }

        .flashcard-front {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
        }

        .flashcard-back {
            background-color: #f3f4f6; /* gray-100 */
            color: #1f2937;
            transform: rotateY(180deg);
            overflow-y: auto;
            justify-content: flex-start;
            align-items: flex-start;
            text-align: left;
        }

        .flashcard-back p {
            width: 100%;
        }

        .delete-topic-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            background-color: rgba(200, 200, 200, 0.7);
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            font-size: 14px;
            line-height: 24px;
            text-align: center;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.2s ease-in-out, background-color 0.2s ease-in-out;
            z-index: 10;
        }

        .flashcard:hover .delete-topic-btn {
            opacity: 1;
        }

        .delete-topic-btn:hover {
            background-color: #ef4444; /* red-500 */
        }

        /* 間違いノートのスタイル */
        .mistake-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1rem;
            background-color: #fef2f2; /* red-50 */
            border: 1px solid #fecaca; /* red-200 */
            border-radius: 0.5rem; /* rounded-lg */
        }

        .mistake-item p {
            color: #991b1b; /* red-800 */
            font-weight: 500;
        }

        .mistake-challenge-btn {
            background-color: #ef4444; /* red-500 */
            color: white;
            font-weight: bold;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem; /* rounded-md */
            transition: background-color 0.2s;
        }

        .mistake-challenge-btn:hover {
            background-color: #dc2626; /* red-600 */
        }

        #mistake-modal-options .option-btn {
            display: block;
            width: 100%;
            text-align: left;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            background-color: #ffffff;
            transition: all 0.2s;
        }

        #mistake-modal-options .option-btn:hover {
            background-color: #f9fafb;
            border-color: #3b82f6;
        }

        #mistake-modal-options .option-btn.correct {
            background-color: #dcfce7; /* green-100 */
            border-color: #4ade80; /* green-400 */
            color: #166534; /* green-800 */
        }

        #mistake-modal-options .option-btn.incorrect {
            background-color: #fee2e2; /* red-100 */
            border-color: #f87171; /* red-400 */
            color: #991b1b; /* red-800 */
        }


        /* アチーブメントシステムのスタイル */
        #achievements-list .achievement-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0.75rem;
            border-radius: 0.5rem;
            border: 1px solid #e5e7eb; /* gray-200 */
            background-color: #f9fafb; /* gray-50 */
            transition: all 0.3s ease;
        }

        #achievements-list .achievement-item.unlocked {
            background-color: #fefce8; /* yellow-50 */
            border-color: #fde047; /* yellow-400 */
            transform: scale(1.02);
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        #achievements-list .achievement-icon {
            font-size: 2rem;
            color: #d1d5db; /* gray-300 */
            width: 40px;
            text-align: center;
            transition: color 0.3s ease, transform 0.3s ease;
        }

        #achievements-list .achievement-item.unlocked .achievement-icon {
            color: #f59e0b; /* amber-500 */
            transform: rotate(-10deg) scale(1.1);
        }

        #achievements-list .achievement-details {
            flex-grow: 1;
        }

        #achievements-list .achievement-title {
            font-weight: 600;
            color: #9ca3af; /* gray-400 */
        }

        #achievements-list .achievement-item.unlocked .achievement-title {
            color: #a16207; /* yellow-700 */
        }

        #achievements-list .achievement-description {
            font-size: 0.875rem;
            color: #d1d5db; /* gray-300 */
        }

        #achievements-list .achievement-item.unlocked .achievement-description {
            color: #4b5563; /* gray-600 */
        }

        /* =========================================
           ★★★ START: DARK MODE STYLES ★★★
           ========================================= */

        html.dark body {
            background-color: #111827; /* gray-900 */
            color: #d1d5db; /* gray-300 */
        }
        
        html.dark header {
            background-color: #1f2937; /* gray-800 */
            border-bottom: 1px solid #374151; /* gray-700 */
        }

        html.dark header a, html.dark header span {
            color: #d1d5db; /* gray-300 */
        }
        html.dark header a:hover {
            color: #ffffff; /* white */
        }
        html.dark header .font-bold {
            color: #f9fafb; /* gray-50 */
        }

        /* ▼▼▼【修正】メインコンテンツのタイトル色を修正 ▼▼▼ */
        html.dark main h1 {
            color: #f9fafb; /* gray-50 */
        }
        /* ▲▲▲ ここまで ▲▲▲ */

        html.dark .section-title {
            color: #f3f4f6; /* gray-100 */
            border-bottom-color: #374151; /* gray-700 */
        }
        html.dark #language-switcher-mypage, html.dark #topic-sort-select {
            background-color: #374151; /* gray-700 */
            color: #d1d5db; /* gray-300 */
            border-color: #4b5563; /* gray-600 */
        }
        html.dark section {
            background-color: #1f2937; /* gray-800 */
        }
        html.dark #quiz-data-display .bg-sky-50 { background-color: #0c4a6e !important; }
        html.dark #quiz-data-display .text-sky-800 { color: #bae6fd !important; }
        html.dark #quiz-data-display .text-sky-900 { color: #e0f2fe !important; }
        html.dark #quiz-data-display .bg-indigo-50 { background-color: #3730a3 !important; }
        html.dark #quiz-data-display .text-indigo-800 { color: #c7d2fe !important; }
        html.dark #quiz-data-display .text-indigo-900 { color: #e0e7ff !important; }
        html.dark .h-80.bg-gray-50 { background-color: #374151 !important; }

        html.dark .difficulty-card {
            border-color: #4b5563; /* gray-600 */
        }
        html.dark .difficulty-card.bg-green-50 { background-color: #064e3b !important; }
        html.dark .difficulty-card .text-green-800 { color: #a7f3d0 !important; }
        html.dark .difficulty-card .text-green-600 { color: #6ee7b7 !important; }
        html.dark .difficulty-card.bg-yellow-50 { background-color: #78350f !important; }
        html.dark .difficulty-card .text-yellow-800 { color: #fde68a !important; }
        html.dark .difficulty-card .text-yellow-600 { color: #fcd34d !important; }
        html.dark .difficulty-card.bg-red-50 { background-color: #7f1d1d !important; }
        html.dark .difficulty-card .text-red-800 { color: #fca5a5 !important; }
        html.dark .difficulty-card .text-red-600 { color: #f87171 !important; }

        html.dark .flashcard-front {
            background-color: #374151; /* gray-700 */
            border-color: #4b5563; /* gray-600 */
        }
        html.dark .flashcard-front .text-gray-800 {
            color: #f3f4f6; /* gray-100 */
        }
        html.dark .flashcard-front .text-gray-400 {
            color: #9ca3af; /* gray-400 */
        }
        html.dark .flashcard-back {
            background-color: #4b5563; /* gray-600 */
            color: #d1d5db; /* gray-300 */
        }
        html.dark .flashcard-back .border-gray-300 {
            border-color: #6b7280; /* gray-500 */
        }

        html.dark .mistake-item {
            background-color: #7f1d1d; /* red-800 */
            border-color: #991b1b; /* red-900 */
        }
        html.dark .mistake-item p {
            color: #fecaca; /* red-200 */
        }
        html.dark .mistake-challenge-btn {
            background-color: #b91c1c; /* red-700 */
        }
        html.dark .mistake-challenge-btn:hover {
            background-color: #991b1b; /* red-800 */
        }
        html.dark #mistake-retry-modal .bg-white {
            background-color: #374151; /* gray-700 */
        }
        html.dark #mistake-retry-modal .bg-gray-50 {
            background-color: #1f2937; /* gray-800 */
        }
        html.dark #mistake-modal-question {
            color: #f3f4f6; /* gray-100 */
        }
        html.dark #mistake-modal-options .option-btn {
            background-color: #4b5563; /* gray-600 */
            border-color: #6b7280; /* gray-500 */
            color: #d1d5db; /* gray-300 */
        }
        html.dark #mistake-modal-options .option-btn:hover {
            border-color: #3b82f6; /* blue-500 */
        }
        html.dark #mistake-modal-feedback.text-green-600 { color: #6ee7b7 !important; }
        html.dark #mistake-modal-feedback.text-red-600 { color: #f87171 !important; }
        html.dark #mistake-modal-close-btn {
            background-color: #4b5563; /* gray-600 */
            color: #d1d5db; /* gray-300 */
        }
        html.dark #mistake-modal-close-btn:hover {
            background-color: #6b7280; /* gray-500 */
        }

        html.dark #achievements-list .achievement-item {
            background-color: #374151; /* gray-700 */
            border-color: #4b5563; /* gray-600 */
        }
        html.dark #achievements-list .achievement-item.unlocked {
            background-color: #78350f; /* amber-800 */
            border-color: #f59e0b; /* amber-500 */
        }
        html.dark #achievements-list .achievement-icon {
            color: #6b7280; /* gray-500 */
        }
        html.dark #achievements-list .achievement-item.unlocked .achievement-icon {
            color: #f59e0b; /* amber-500 */
        }
        html.dark #achievements-list .achievement-title {
            color: #9ca3af; /* gray-400 */
        }
        html.dark #achievements-list .achievement-item.unlocked .achievement-title {
            color: #fde68a; /* yellow-200 */
        }
        html.dark #achievements-list .achievement-description {
            color: #6b7280; /* gray-500 */
        }
        html.dark #achievements-list .achievement-item.unlocked .achievement-description {
            color: #d1d5db; /* gray-300 */
        }
        html.dark #confirm-modal .bg-white {
            background-color: #374151; /* gray-700 */
        }
        html.dark #confirm-modal h3, html.dark #confirm-modal p {
            color: #f3f4f6; /* gray-100 */
        }
        html.dark #cancel-reset-btn {
            background-color: #4b5563; /* gray-600 */
            color: #d1d5db; /* gray-300 */
        }
        html.dark #cancel-reset-btn:hover {
            background-color: #6b7280; /* gray-500 */
        }
        html.dark .text-gray-500 {
            color: #9ca3af; /* gray-400 */
        }
        
        /* Chart.js Dark Mode */
        html.dark .chartjs-render-monitor {
            color: #d1d5db;
        }
        html.dark .tick {
            color: #9ca3af;
        }
        /* =========================================
           ★★★ END: DARK MODE STYLES ★★★
           ========================================= */
    </style>
</head>
<body class="bg-gray-100">

    <!-- CSRFトークンをJavaScriptに渡すためのscriptタグ -->
    <script>
        const CSRF_TOKEN = '<?php echo $csrfToken; ?>';
    </script>

    <header class="bg-white shadow-sm">
        <div class="container mx-auto flex justify-between items-center p-4">
            <a href="../index.php" class="flex items-center gap-2 text-xl font-bold text-gray-800">
                <i class="fas fa-book text-sky-600"></i>
                <span>Japan life Manual</span>
            </a>
            <div class="flex items-center gap-4">
                <a href="../index.php" class="text-gray-600 hover:text-sky-600" data-translate="back_to_home">ホームに戻る</a>
                 <div class="language-selector-mypage">
                    <select id="language-switcher-mypage" class="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white">
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                    </select>
                </div>
                <!-- ダークモード切り替えボタン -->
                <button id="dark-mode-toggle" class="p-2 rounded-full text-gray-600 hover:bg-gray-200 transition-colors focus:outline-none">
                    <i class="fas fa-moon"></i>
                </button>
            </div>
        </div>
    </header>

    <main class="container mx-auto p-4 md:p-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 id="my-page-title" class="text-3xl font-bold text-gray-800" data-translate="my_page_title">学習進捗ページ</h1>
            <button id="reset-progress-btn" class="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 mt-4 md:mt-0">
                <i class="fas fa-trash-alt"></i>
                <span data-translate="reset_progress_button">学習データをリセット</span>
            </button>
        </div>

        <!-- Main Grid Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <!-- Left Column -->
            <div class="lg:col-span-2 space-y-8">

                <section class="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 class="section-title" data-translate="quiz_stats_title">クイズ成績</h2>
                    <div id="quiz-stats-container" class="mt-6">
                        <div id="no-quiz-data" class="hidden text-center py-12 text-gray-500">
                            <i class="fas fa-chart-line text-4xl mb-4 text-gray-300"></i>
                            <p data-translate="no_data_available">まだ利用可能なクイズデータがありません。</p>
                        </div>
                        <div id="quiz-data-display" class="hidden">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div class="bg-sky-50 border border-sky-200 p-4 rounded-lg flex items-center gap-4">
                                    <i class="fas fa-star text-2xl text-sky-500"></i>
                                    <div>
                                        <p class="text-sm text-sky-800" data-translate="overall_avg_score">総合平均点</p>
                                        <p id="total-average-score" class="text-2xl font-bold text-sky-900">--</p>
                                    </div>
                                </div>
                                <div class="bg-indigo-50 border border-indigo-200 p-4 rounded-lg flex items-center gap-4">
                                    <i class="fas fa-gamepad text-2xl text-indigo-500"></i>
                                    <div>
                                        <p class="text-sm text-indigo-800" data-translate="total_attempts">総受験回数</p>
                                        <p id="total-quiz-count" class="text-2xl font-bold text-indigo-900">--</p>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
                                <div class="md:col-span-3 h-80 bg-gray-50 p-4 rounded-lg">
                                    <canvas id="quizScoreChart"></canvas>
                                </div>
                                <div class="md:col-span-2 space-y-4">
                                    <div id="easy-stats" class="difficulty-card bg-green-50 border-green-200"></div>
                                    <div id="normal-stats" class="difficulty-card bg-yellow-50 border-yellow-200"></div>
                                    <div id="hard-stats" class="difficulty-card bg-red-50 border-red-200"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Learned Topics Section -->
                <section class="bg-white p-6 rounded-2xl shadow-lg">
                    <div class="flex justify-between items-center mb-6">
                        <h2 id="learned-topics-title" class="section-title !mb-0 !border-b-0" data-translate="learned_topics_title">学習したトピック</h2>
                        <div class="relative">
                            <select id="topic-sort-select" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 p-2">
                                <option value="newest" data-translate="sort_newest">新しい順</option>
                                <option value="oldest" data-translate="sort_oldest">古い順</option>
                                <option value="type" data-translate="sort_type">種類別</option>
                            </select>
                        </div>
                    </div>
                    <div id="learned-topics-container">
                        <div id="learned-topics-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <!-- 学習したトピックがフラッシュカードとしてここに表示されます -->
                        </div>
                        <p id="no-learned-topics-data" class="hidden text-gray-500" data-translate="no_learned_topics_data">まだ学習したトピックがありません。</p>
                    </div>
                </section>

                <!-- 間違いノートセクション -->
                <section class="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 class="section-title" data-translate="mistake_note_title">間違いノート</h2>
                    <div id="mistake-note-container">
                        <div id="mistake-note-list" class="space-y-3">
                            <!-- 間違えた問題がここに表示されます -->
                        </div>
                        <p id="no-mistakes-data" class="hidden text-center py-8 text-gray-500" data-translate="mistake_note_empty">復習する問題はありません。素晴らしい！</p>
                    </div>
                </section>

            </div>

            <!-- Right Column -->
            <div class="lg:col-span-1">

                <!-- Achievements Section -->
                <section class="bg-white p-6 rounded-2xl shadow-lg lg:sticky top-8">
                    <h2 id="achievements-title" class="section-title" data-translate="achievements_title">獲得したアチーブメント</h2>
                    <div id="achievements-container">
                        <ul id="achievements-list" class="space-y-4">
                            <!-- アチーブメントがここに表示されます -->
                        </ul>
                        <p id="no-achievements-data" class="hidden text-gray-500" data-translate="no_achievements_data">まだ獲得したアチーブメントはありません。</p>
                    </div>
                </section>

            </div>

        </div>
    </main>

    <!-- 間違いノート再挑戦用モーダル -->
    <div id="mistake-retry-modal" class="hidden fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div id="mistake-modal-content" class="p-6">
                <p id="mistake-modal-question" class="text-lg font-semibold text-gray-800 mb-4"></p>
                <div id="mistake-modal-options" class="space-y-3">
                    <!-- 選択肢がここにJSで生成されます -->
                </div>
                <div id="mistake-modal-feedback" class="mt-4 text-sm font-medium"></div>
            </div>
            <div class="bg-gray-50 px-6 py-3 rounded-b-xl">
                <button id="mistake-modal-close-btn" class="w-full bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors" data-translate="mistake_note_close_btn">閉じる</button>
            </div>
        </div>
    </div>

    <!-- 確認モーダル -->
    <div id="confirm-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[1050] flex justify-center items-center hidden px-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4" data-translate="confirm_reset_title">本当によろしいですか？</h3>
            <p class="text-gray-600 mb-6" data-translate="confirm_reset_text">すべての学習進捗データ（クイズ成績、学習したトピック、アチーブメント）が完全に削除されます。この操作は元に戻せません。</p>
            <div class="flex justify-end gap-4">
                <button id="cancel-reset-btn" class="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors">
                    <span data-translate="cancel_button">キャンセル</span>
                </button>
                <button id="confirm-reset-btn" class="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors">
                    <span data-translate="reset_button">リセット</span>
                </button>
            </div>
        </div>
    </div>

    <script src="./js/knowledge.js"></script>
    <script src="./js/my_page.js"></script>
    
    <script>
        /**
         * dark-mode.js
         * サイト全体のダークモードとライトモードの切り替えを管理します。
         */
        document.addEventListener('DOMContentLoaded', () => {
            const toggleButton = document.getElementById('dark-mode-toggle');
            const htmlElement = document.documentElement; 

            if (!toggleButton) {
                return;
            }

            const toggleIcon = toggleButton.querySelector('i');

            /**
             * テーマを適用し、状態をlocalStorageに保存します
             * @param {string} theme - 'dark' または 'light'
             */
            const applyTheme = (theme) => {
                if (theme === 'dark') {
                    htmlElement.classList.add('dark');
                    if (toggleIcon) {
                        toggleIcon.classList.remove('fa-moon');
                        toggleIcon.classList.add('fa-sun');
                    }
                    localStorage.setItem('theme', 'dark');
                } else {
                    htmlElement.classList.remove('dark');
                    if (toggleIcon) {
                        toggleIcon.classList.remove('fa-sun');
                        toggleIcon.classList.add('fa-moon');
                    }
                    localStorage.setItem('theme', 'light');
                }
            };

            // 切り替えボタンのクリックイベント
            toggleButton.addEventListener('click', () => {
                if (htmlElement.classList.contains('dark')) {
                    applyTheme('light');
                } else {
                    applyTheme('dark');
                }
            });

            // ページの読み込み時にテーマを決定
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

            if (savedTheme) {
                applyTheme(savedTheme); // 保存された設定を優先
            } else if (prefersDark) {
                applyTheme('dark'); // OSの設定がダークモードの場合
            } else {
                applyTheme('light'); // デフォルト
            }
        });
    </script>
</body>
</html>
