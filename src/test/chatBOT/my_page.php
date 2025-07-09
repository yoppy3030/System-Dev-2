<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>マイページ - Japan Life Manual</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="./css/my_page.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-100">

    <header class="bg-white shadow-sm">
        <div class="container mx-auto flex justify-between items-center p-4">
            <a href="../index.php" class="flex items-center gap-2 text-xl font-bold text-gray-800">
                <i class="fas fa-book text-sky-600"></i>
                <span>Japan life Manual</span>
            </a>
            <div class="flex items-center gap-4">
                <a href="../index.php" class="text-gray-600 hover:text-sky-600" data-translate="back_to_home">ホームに戻る</a>
                 <div class="language-selector-mypage">
                    <select id="language-switcher-mypage" class="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                    </select>
                </div>
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

                <!-- Quiz Performance Section -->
                <section class="bg-gradient-to-br from-sky-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white">
                    <h2 id="quiz-stats-title" class="section-title text-white border-white/30" data-translate="quiz_stats_title">クイズ成績</h2>
                    <div id="quiz-stats-container" class="relative" style="height: 400px;">
                        <canvas id="learningProgressChart"></canvas>
                        <p id="no-quiz-data" class="hidden absolute inset-0 flex items-center justify-center text-lg bg-black/10 rounded-lg" data-translate="no_data_available">まだ利用可能なクイズデータがありません。</p>
                    </div>
                </section>

                <!-- Learned Topics Section -->
                <section class="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 id="learned-topics-title" class="section-title" data-translate="learned_topics_title">学習したトピック</h2>
                    <div id="learned-topics-container">
                        <ul id="learned-topics-list" class="space-y-4">
                            <!-- 学習したトピックがここに表示されます -->
                        </ul>
                        <p id="no-learned-topics-data" class="hidden text-gray-500" data-translate="no_learned_topics_data">まだ学習したトピックがありません。</p>
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
</body>
</html>
