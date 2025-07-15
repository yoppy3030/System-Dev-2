<?php
// セッションを開始
session_start();

// ★★★ 修正点: ログイン状態を確認 ★★★
// セッションに 'user_id' が存在しない場合、ログインページにリダイレクト
if (!isset($_SESSION['user_id'])) {
    // Locationヘッダーでリダイレクト
    header('Location: ../login.php');
    // リダイレクト後にスクリプトの実行を確実に終了する
    exit;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- ★★★ 修正点: ユーザー名をタイトルに表示 ★★★ -->
    <title><?php echo htmlspecialchars($_SESSION['username'] ?? 'Guest'); ?>さんのマイページ - Japan Life Manual</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- ★★★ 修正点: CSSとJSのパスをルートからの相対パスに修正 ★★★ -->
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

    <!-- ★★★ 修正点: JSのパスを修正 ★★★ -->
    <script src="./chatBOT/js/knowledge.js"></script>
    <script src="./js/my_page.js"></script>
</body>
</html>
