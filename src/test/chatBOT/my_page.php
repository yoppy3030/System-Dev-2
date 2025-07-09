<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>マイページ - Japan Life Manual</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- ▼▼▼【修正】CSSファイルのパスを修正 ▼▼▼ -->
    <link rel="stylesheet" href="./css/my_page.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50">

    <header class="bg-white shadow-md">
        <div class="container mx-auto flex justify-between items-center p-4">
            <a href="../index.php" class="flex items-center gap-2 text-xl font-bold text-gray-800">
                <i class="fas fa-book"></i>
                <span>Japan life Manual</span>
            </a>
            <div class="flex items-center gap-4">
                <a href="../index.php" class="text-gray-600 hover:text-sky-600" data-translate="back_to_home">ホームに戻る</a>
                 <div class="language-selector-mypage">
                    <select id="language-switcher-mypage" class="border rounded-md p-2">
                        <option value="ja">日本語</option>
                        <option value="en">English</option>
                        <option value="zh">中文</option>
                    </select>
                </div>
            </div>
        </div>
    </header>

    <main class="container mx-auto p-4 md:p-8">
        <div class="flex justify-between items-center mb-8">
            <h1 id="my-page-title" class="text-3xl font-bold text-gray-800" data-translate="my_page_title">学習進捗ページ</h1>
            <button id="reset-progress-btn" class="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                <i class="fas fa-trash-alt"></i>
                <span data-translate="reset_progress_button">学習データをリセット</span>
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- クイズ成績セクション -->
            <div class="lg:col-span-2 bg-gradient-to-br from-sky-500 to-indigo-600 p-6 rounded-lg shadow-lg text-white">
                <h2 id="quiz-stats-title" class="text-2xl font-semibold mb-4" data-translate="quiz_stats_title">クイズ成績</h2>
                <div id="quiz-stats-container" class="relative" style="height: 400px;">
                    <canvas id="learningProgressChart"></canvas>
                    <p id="no-quiz-data" class="hidden absolute inset-0 flex items-center justify-center text-lg" data-translate="no_data_available">まだ利用可能なクイズデータがありません。</p>
                </div>
            </div>

            <!-- 学習トピック表示エリア -->
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 id="learned-topics-title" class="text-2xl font-semibold text-gray-700 mb-4" data-translate="learned_topics_title">学習したトピック</h2>
                <div id="learned-topics-container">
                    <ul id="learned-topics-list" class="space-y-4">
                        <!-- 学習したトピックがここに表示されます -->
                    </ul>
                    <p id="no-learned-topics-data" class="hidden text-gray-500" data-translate="no_learned_topics_data">まだ学習したトピックがありません。</p>
                </div>
            </div>
        </div>
    </main>

    <!-- 確認モーダル -->
    <div id="confirm-modal" class="fixed inset-0 bg-black bg-opacity-50 z-[1050] flex justify-center items-center hidden">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 mx-4">
            <h3 class="text-xl font-bold text-gray-800 mb-4" data-translate="confirm_reset_title">本当によろしいですか？</h3>
            <p class="text-gray-600 mb-6" data-translate="confirm_reset_text">すべての学習進捗データ（クイズ成績、学習したトピック）が完全に削除されます。この操作は元に戻せません。</p>
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

    <!-- ▼▼▼【修正】JavaScriptファイルのパスを修正 ▼▼▼ -->
    <script src="./js/knowledge.js"></script>
    <script src="./js/my_page.js"></script>
</body>
</html>
