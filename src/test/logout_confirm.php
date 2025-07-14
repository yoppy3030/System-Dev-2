<?php
// セッションを開始して、現在の状態を確認します
session_start();
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>ログアウト確認</title>
    <!-- 既存のCSSを流用して表示を整えます -->
    <link rel="stylesheet" href="css/style.css">
    <style>
        /* メッセージ表示用のスタイル */
        .message-box { padding: 1.5rem; margin-top: 1rem; border-radius: 5px; font-weight: bold; }
        .success-message { background-color: #d4edda; color: #155724; }
        .error-message { background-color: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
<div class="form-container">
    <h1>ログアウト状態の確認</h1>

    <?php if (isset($_SESSION['user_id'])): ?>
        <!-- もし user_id がまだ存在すれば、ログアウト失敗 -->
        <div class="message-box error-message">
            <p><strong>ログアウトに失敗しました。</strong></p>
            <p>まだログイン状態が続いています。</p>
            <p>（ユーザーID: <?= htmlspecialchars($_SESSION['user_id'], ENT_QUOTES, 'UTF-8') ?>）</p>
        </div>
    <?php else: ?>
        <!-- user_id が存在しなければ、ログアウト成功 -->
        <div class="message-box success-message">
            <p><strong>正常にログアウトしました。</strong></p>
        </div>
    <?php endif; ?>

    <p style="margin-top: 2rem;"><a href="login.php">ログインページに戻る</a></p>
    <p><a href="index.php">ホームページに戻る</a></p>
</div>
</body>
</html>
