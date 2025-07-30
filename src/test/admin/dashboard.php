<?php
session_start();
require_once '../backend/config.php'; // データベース設定を読み込み

// ログインしていない場合はログインページにリダイレクト
if (!isset($_SESSION['user_id'])) {
    header('Location: ../login.php');
    exit;
}

// 現在のユーザーが管理者であるかを確認
$is_admin = false;
if (isset($_SESSION['user_id'])) {
    $stmt = $pdo->prepare("SELECT is_admin FROM Accounts WHERE ID = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    if ($user && $user['is_admin']) {
        $is_admin = true;
    }
}

// 管理者でない場合はホームページにリダイレクト
if (!$is_admin) {
    header('Location: ../index.php');
    exit;
}

$username = $_SESSION['username'] ?? 'Admin';
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理者ダッシュボード</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="admin.css">
</head>
<body class="bg-gray-100">
    <div class="flex h-screen bg-gray-200">
        <!-- Sidebar -->
        <div class="w-64 bg-gray-800 text-white flex flex-col">
            <div class="px-8 py-6 border-b border-gray-700">
                <h2 class="text-2xl font-semibold">管理パネル</h2>
            </div>
            <nav id="sidebar-nav" class="flex-1 px-4 py-4 space-y-2">
                <a href="#dashboard" class="nav-link flex items-center px-4 py-2 text-gray-100 bg-gray-700 rounded-lg">
                    <i class="fas fa-tachometer-alt fa-fw mr-3"></i>
                    ダッシュボード
                </a>
                <a href="#user-management" class="nav-link flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
                    <i class="fas fa-users fa-fw mr-3"></i>
                    ユーザー管理
                </a>
                <a href="#content-management" class="nav-link flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
                    <i class="fas fa-edit fa-fw mr-3"></i>
                    コンテンツ管理
                </a>
                <a href="#inquiry-management" class="nav-link flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg">
                    <i class="fas fa-envelope fa-fw mr-3"></i>
                    お問い合わせ管理
                </a>
            </nav>
            <div class="px-8 py-4 border-t border-gray-700">
                <a href="../logout.php" class="flex items-center text-gray-300 hover:text-white">
                    <i class="fas fa-sign-out-alt fa-fw mr-3"></i>
                    ログアウト
                </a>
            </div>
        </div>

        <!-- Main content -->
        <div class="flex-1 flex flex-col overflow-hidden">
            <header class="bg-white shadow-md p-4 flex justify-between items-center">
                <h1 class="text-xl font-bold text-gray-800">ようこそ, <?php echo htmlspecialchars($username); ?>さん</h1>
                <a href="../index.php" class="text-sm text-sky-600 hover:underline">サイトを表示 →</a>
            </header>
            
            <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-8">
                <!-- Dashboard Section -->
                <section id="dashboard" class="admin-section">
                    <h2 class="text-2xl font-semibold text-gray-700 mb-6">ダッシュボード</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold text-gray-600">総ユーザー数</h3>
                            <p class="text-3xl font-bold text-gray-800 mt-2" id="total-users-count">--</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold text-gray-600 flex items-center gap-2"><i class="fas fa-thumbs-up text-green-500"></i>役に立った</h3>
                            <p class="text-3xl font-bold text-gray-800 mt-2" id="helpful-feedback-count">--</p>
                        </div>
                        <div class="bg-white p-6 rounded-lg shadow-md">
                            <h3 class="text-lg font-semibold text-gray-600 flex items-center gap-2"><i class="fas fa-thumbs-down text-red-500"></i>役に立たなかった</h3>
                            <p class="text-3xl font-bold text-gray-800 mt-2" id="unhelpful-feedback-count">--</p>
                        </div>
                    </div>
                    <div class="mt-8 bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold text-gray-600 mb-4">過去7日間の新規ユーザー登録数</h3>
                        <div class="h-80">
                            <canvas id="userRegistrationChart"></canvas>
                        </div>
                    </div>
                </section>

                <!-- User Management Section -->
                <section id="user-management" class="admin-section hidden mt-12">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold text-gray-700">ユーザー管理</h2>
                        <div class="flex gap-2">
                             <button id="import-users-btn" class="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                <i class="fas fa-upload mr-2"></i>インポート
                            </button>
                            <input type="file" id="user-import-input" class="hidden" accept=".csv">
                            <button id="backup-users-btn" class="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                                <i class="fas fa-download mr-2"></i>バックアップ
                            </button>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <div class="flex items-center gap-4 mb-4">
                            <select id="user-filter-role" class="form-select w-auto">
                                <option value="all">すべての権限</option>
                                <option value="admin">管理者</option>
                                <option value="general">一般ユーザー</option>
                            </select>
                            <div class="relative flex-1">
                                <input type="text" id="user-filter-input" placeholder="名前 or Emailで検索..." class="form-input w-full">
                                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead id="user-table-head">
                                    <tr class="text-xs font-semibold tracking-wide text-gray-500 uppercase border-b bg-gray-50">
                                        <th class="px-4 py-3 sortable-header" data-column="ID" data-type="number">ID</th>
                                        <th class="px-4 py-3 sortable-header" data-column="Name" data-type="string">名前</th>
                                        <th class="px-4 py-3 sortable-header" data-column="Email" data-type="string">Email</th>
                                        <th class="px-4 py-3">ユーザータイプ</th>
                                        <th class="px-4 py-3 sortable-header" data-column="RegistrationDate" data-type="date">登録日</th>
                                        <th class="px-4 py-3 sortable-header" data-column="is_admin" data-type="boolean">管理者</th>
                                        <th class="px-4 py-3">操作</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y" id="user-table-body"></tbody>
                            </table>
                        </div>
                        <!-- ★★★ 追加: ページネーションコントロール ★★★ -->
                        <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
                            <span id="user-pagination-info"></span>
                            <div id="user-pagination-controls" class="flex items-center space-x-1"></div>
                        </div>
                    </div>
                </section>

                <!-- Content Management Section -->
                <section id="content-management" class="admin-section hidden mt-12">
                     <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold text-gray-700">コンテンツ管理</h2>
                        <div class="flex gap-2">
                            <button id="import-quizzes-btn" class="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                <i class="fas fa-upload mr-2"></i>インポート
                            </button>
                            <input type="file" id="quiz-import-input" class="hidden" accept=".csv">
                            <button id="backup-quizzes-btn" class="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                                <i class="fas fa-download mr-2"></i>バックアップ
                            </button>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-semibold text-gray-800">クイズ管理</h3>
                            <button id="add-quiz-btn" class="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors">
                                <i class="fas fa-plus mr-2"></i>新しいクイズを追加
                            </button>
                        </div>
                        <div class="flex items-center gap-4 mb-4">
                            <select id="quiz-filter-difficulty" class="form-select w-auto">
                                <option value="all">すべての難易度</option>
                                <option value="easy">簡単</option>
                                <option value="normal">普通</option>
                                <option value="hard">難しい</option>
                            </select>
                            <div class="relative flex-1">
                                <input type="text" id="quiz-filter-input" placeholder="問題文で検索..." class="form-input w-full">
                                <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                            </div>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead id="quiz-table-head">
                                    <tr class="text-xs font-semibold tracking-wide text-gray-500 uppercase border-b bg-gray-50">
                                        <th class="px-4 py-3 sortable-header" data-column="id" data-type="number">ID</th>
                                        <th class="px-4 py-3 sortable-header" data-column="difficulty" data-type="string">難易度</th>
                                        <th class="px-4 py-3 sortable-header" data-column="question.ja" data-type="string">問題 (日本語)</th>
                                        <th class="px-4 py-3">操作</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y" id="quiz-table-body"></tbody>
                            </table>
                        </div>
                        <!-- ★★★ 追加: ページネーションコントロール ★★★ -->
                        <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
                            <span id="quiz-pagination-info"></span>
                            <div id="quiz-pagination-controls" class="flex items-center space-x-1"></div>
                        </div>
                    </div>
                </section>
                
                <!-- Inquiry Management Section -->
                <section id="inquiry-management" class="admin-section hidden mt-12">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-2xl font-semibold text-gray-700">お問い合わせ管理</h2>
                        <div class="flex gap-2">
                            <button id="import-inquiries-btn" class="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                                <i class="fas fa-upload mr-2"></i>インポート
                            </button>
                            <input type="file" id="inquiry-import-input" class="hidden" accept=".csv">
                            <button id="backup-inquiries-btn" class="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                                <i class="fas fa-download mr-2"></i>バックアップ
                            </button>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <div class="flex items-center gap-4 mb-4">
                            <select id="inquiry-filter-status" class="form-select w-auto">
                                <option value="all">すべてのステータス</option>
                                <option value="pending">未対応</option>
                                <option value="replied">対応済み</option>
                            </select>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left">
                                <thead id="inquiry-table-head">
                                    <tr class="text-xs font-semibold tracking-wide text-gray-500 uppercase border-b bg-gray-50">
                                        <th class="px-4 py-3 sortable-header" data-column="id" data-type="number">ID</th>
                                        <th class="px-4 py-3 sortable-header" data-column="created_at" data-type="date">日時</th>
                                        <th class="px-4 py-3 sortable-header" data-column="name" data-type="string">名前</th>
                                        <th class="px-4 py-3">Email</th>
                                        <th class="px-4 py-3">内容</th>
                                        <th class="px-4 py-3 sortable-header" data-column="replied" data-type="boolean">ステータス</th>
                                        <th class="px-4 py-3">操作</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y" id="inquiry-table-body"></tbody>
                            </table>
                        </div>
                        <!-- ★★★ 追加: ページネーションコントロール ★★★ -->
                        <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
                            <span id="inquiry-pagination-info"></span>
                            <div id="inquiry-pagination-controls" class="flex items-center space-x-1"></div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    </div>

    <!-- Modals -->
    <!-- (省略: モーダル部分は変更なし) -->
    <div id="delete-confirm-modal" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center hidden px-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">ユーザーの削除</h3>
            <p class="text-gray-600 mb-6">本当にユーザー「<span id="delete-user-name" class="font-bold"></span>」を削除しますか？<br>この操作は元に戻すことができません。</p>
            <div class="flex justify-end gap-4">
                <button id="back-delete-btn" class="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2">
                    <i class="fas fa-arrow-left fa-fw"></i>戻る
                </button>
                <button id="confirm-delete-btn" class="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                    <i class="fas fa-trash-alt fa-fw"></i>削除
                </button>
            </div>
        </div>
    </div>
    <div id="edit-user-modal" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center hidden px-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
            <form id="edit-user-form">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-6">ユーザー情報の編集</h3>
                    <input type="hidden" id="edit-user-id" name="user_id">
                    <div class="space-y-4">
                        <div>
                            <label for="edit-user-name" class="block text-sm font-medium text-gray-700">名前</label>
                            <input type="text" id="edit-user-name" name="name" class="form-input">
                        </div>
                        <div>
                            <label for="edit-user-email" class="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" id="edit-user-email" name="email" class="form-input">
                        </div>
                        <div>
                            <label for="edit-user-type" class="block text-sm font-medium text-gray-700">ユーザータイプ</label>
                            <select id="edit-user-type" name="user_type" class="form-select">
                                <option>Tourist</option><option>International Student</option><option>Professional</option><option>other</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="bg-gray-50 px-6 py-3 flex justify-end gap-4 rounded-b-lg">
                    <button type="button" id="back-edit-btn" class="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2">
                        <i class="fas fa-arrow-left fa-fw"></i>戻る
                    </button>
                    <button type="submit" class="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2">
                        <i class="fas fa-check fa-fw"></i>完了
                    </button>
                </div>
            </form>
        </div>
    </div>
    <div id="quiz-editor-modal" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center hidden px-4">
        <form id="quiz-editor-form" class="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div class="p-6 border-b">
                <h3 id="quiz-editor-title" class="text-xl font-bold text-gray-800">クイズの編集</h3>
            </div>
            <div class="p-6 space-y-6 overflow-y-auto flex-1">
                <input type="hidden" name="id">
                
                <div>
                    <label class="block text-sm font-medium text-gray-700">難易度</label>
                    <select name="difficulty" class="form-select mt-1">
                        <option value="easy">簡単</option>
                        <option value="normal">普通</option>
                        <option value="hard">難しい</option>
                    </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">問題文 (日本語)</label>
                        <input type="text" name="question_ja" class="form-input mt-1" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">問題文 (English)</label>
                        <input type="text" name="question_en" class="form-input mt-1" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">問題文 (中文)</label>
                        <input type="text" name="question_zh" class="form-input mt-1" required>
                    </div>
                </div>
                
                <hr>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">選択肢と正解</label>
                    <p class="text-xs text-gray-500 mb-2">少なくとも2つの選択肢を入力してください。正解の選択肢をラジオボタンで選んでください。</p>
                    <div class="space-y-4">
                        <?php for ($i = 0; $i < 4; $i++): ?>
                        <div class="flex items-center gap-4 p-3 rounded-lg <?php echo $i === 0 ? 'bg-green-50' : 'bg-gray-50'; ?>">
                            <input type="radio" name="correct_answer_index" value="<?php echo $i; ?>" class="h-5 w-5 text-sky-600 focus:ring-sky-500 border-gray-300" <?php echo $i === 0 ? 'checked' : ''; ?>>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                                <input type="text" name="option_<?php echo $i; ?>_ja" placeholder="選択肢 <?php echo $i+1; ?> (日本語)" class="form-input">
                                <input type="text" name="option_<?php echo $i; ?>_en" placeholder="Option <?php echo $i+1; ?> (English)" class="form-input">
                                <input type="text" name="option_<?php echo $i; ?>_zh" placeholder="选项 <?php echo $i+1; ?> (中文)" class="form-input">
                            </div>
                        </div>
                        <?php endfor; ?>
                    </div>
                </div>

                <hr>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div>
                        <label class="block text-sm font-medium text-gray-700">解説 (日本語)</label>
                        <textarea name="explanation_ja" rows="3" class="form-input mt-1" required></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Explanation (English)</label>
                        <textarea name="explanation_en" rows="3" class="form-input mt-1" required></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">解释 (中文)</label>
                        <textarea name="explanation_zh" rows="3" class="form-input mt-1" required></textarea>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-6 py-4 flex justify-end gap-4 rounded-b-lg border-t">
                <button type="button" id="back-quiz-editor-btn" class="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2">
                    <i class="fas fa-arrow-left fa-fw"></i>戻る
                </button>
                <button type="submit" class="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2">
                    <i class="fas fa-check fa-fw"></i>完了
                </button>
            </div>
        </form>
    </div>
    <div id="delete-quiz-confirm-modal" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center hidden px-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">クイズの削除</h3>
            <p class="text-gray-600 mb-6">本当にクイズ「<span id="delete-quiz-question" class="font-bold"></span>」を削除しますか？<br>この操作は元に戻すことができません。</p>
            <div class="flex justify-end gap-4">
                <button id="back-delete-quiz-btn" class="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors flex items-center gap-2">
                    <i class="fas fa-arrow-left fa-fw"></i>戻る
                </button>
                <button id="confirm-delete-quiz-btn" class="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                    <i class="fas fa-trash-alt fa-fw"></i>削除
                </button>
            </div>
        </div>
    </div>
    <div id="reply-modal" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center hidden px-4">
        <form id="reply-form" class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <input type="hidden" name="inquiry_id">
            <input type="hidden" name="recipient_email">
            <input type="hidden" name="recipient_name">
            <div class="p-6 border-b">
                <h3 class="text-xl font-bold text-gray-800">お問い合わせに返信</h3>
            </div>
            <div class="p-6 space-y-4 overflow-y-auto flex-1">
                <div>
                    <label class="block text-sm font-medium text-gray-700">宛先</label>
                    <p id="reply-recipient" class="mt-1 text-gray-800"></p>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">元のメッセージ</label>
                    <div id="original-message" class="mt-1 p-3 bg-gray-100 border rounded-md text-gray-700 max-h-40 overflow-y-auto"></div>
                </div>
                <div>
                    <label for="reply-subject" class="block text-sm font-medium text-gray-700">件名</label>
                    <input type="text" id="reply-subject" name="subject" class="form-input mt-1" value="お問い合わせありがとうございます" required>
                </div>
                <div>
                    <label for="reply-message" class="block text-sm font-medium text-gray-700">返信内容</label>
                    <textarea id="reply-message" name="message" rows="8" class="form-input mt-1" required></textarea>
                </div>
            </div>
            <div class="bg-gray-50 px-6 py-4 flex justify-end gap-4 rounded-b-lg border-t">
                <button type="button" id="back-reply-btn" class="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors">戻る</button>
                <button type="submit" id="send-reply-btn" class="bg-sky-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-2">
                    <i class="fas fa-paper-plane"></i>送信
                </button>
            </div>
        </form>
    </div>
    <div id="delete-inquiry-confirm-modal" class="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center hidden px-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-4">お問い合わせの削除</h3>
            <p class="text-gray-600 mb-6">本当にお問い合わせを削除しますか？<br>この操作は元に戻すことができません。</p>
            <div class="flex justify-end gap-4">
                <button id="back-delete-inquiry-btn" class="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors">戻る</button>
                <button id="confirm-delete-inquiry-btn" class="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors">削除</button>
            </div>
        </div>
    </div>


    <script>
        const currentAdminId = <?php echo json_encode($_SESSION['user_id']); ?>;
    </script>
    <script src="admin.js"></script>
</body>
</html>
