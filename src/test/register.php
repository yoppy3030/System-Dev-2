<?php
// セッションを開始して、CSRF対策用のトークンを準備します
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - JAPAN Life Manual</title>
    <!-- ご指定のCSSファイルを読み込みます -->
    <link rel="stylesheet" href="./css/style.css">
    <!-- ★★★ 追加: パスワード表示/非表示アイコンのためにFont Awesomeを読み込みます ★★★ -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- スタイルを追加 -->
    <style>
        /* style.cssで定義されていない場合に備えて、基本的なメッセージスタイルを定義 */
        .error-message-container, .success-message-container {
            padding: 1rem;
            margin-bottom: 1.5rem;
            border-radius: 5px;
            font-weight: 500;
        }
        .error-message-container {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .success-message-container {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .error-message { margin: 0; padding: 0; }

        /* ★★★ 追加: パスワード入力欄とアイコンを横並びにするためのスタイル ★★★ */
        .password-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }
        .password-wrapper input {
            padding-right: 40px; /* アイコンのスペースを確保 */
        }
        .password-toggle-icon {
            position: absolute;
            right: 15px;
            cursor: pointer;
            color: #6c757d;
        }
    </style>
</head>
<body>
<div class="form-container">
    <h1>Registration</h1>

    <!-- サーバーからのメッセージを表示するエリア -->
    <div id="form-messages"></div>

    <form name="registerForm" id="register-form" method="post">
        <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf_token'], ENT_QUOTES, 'UTF-8') ?>">
        
        <label>Username:
            <input type="text" name="username"  minlength="3" required>
        </label>

        <label>Email:placeholder="ECC 太郎"
            <input type="email" name="email" placeholder="example@gmail.com" required>
        </label>

        <!-- ★★★ 変更点: パスワード入力欄 ★★★ -->
        <label>Password:
            <div class="password-wrapper">
                <input type="password" id="password" name="password" minlength="8" required>
                <i class="fas fa-eye password-toggle-icon" id="togglePassword"></i>
            </div>
            <small>(8 characters minimum)</small>
        </label>

        <!-- ★★★ 追加: パスワード確認用入力欄 ★★★ -->
        <label>Confirm Password:
             <div class="password-wrapper">
                <input type="password" id="confirm_password" name="confirm_password" minlength="8" required>
                <i class="fas fa-eye password-toggle-icon" id="toggleConfirmPassword"></i>
            </div>
        </label>

        <label>Country:
            <input type="text" name="country" placeholder="Japan" required>
        </label>

        <label>Current Location:
            <input type="text" name="current_location" placeholder="Osaka" required>
        </label>

        <label>What are you doing in Japan?
            <select name="activity" required>
                <option value="">-- Please select --</option>
                <option value="Professional">Professional</option>
                <option value="International Student">International Student</option>
                <option value="Tourist">Tourist</option>
                <option value="Other">Other</option>
            </select>
        </label>

        <button type="submit">Register</button>
    </form>

    <p>Already have an account? <a href="login.php">Login here</a></p>
</div>

<script>
// フォームの送信イベントを捕捉
document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault(); // ページの再読み込みを防ぐ

    const form = event.target;
    const formData = new FormData(form);
    const messageContainer = document.getElementById('form-messages');
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    // 前回のメッセージをクリア
    messageContainer.innerHTML = '';
    messageContainer.className = '';

    // ★★★ 追加: パスワードが一致するかをチェック ★★★
    if (password !== confirmPassword) {
        messageContainer.className = 'error-message-container';
        messageContainer.innerHTML = `<p class="error-message">パスワードが一致しません。</p>`;
        return; // 一致しない場合はここで処理を中断
    }

    // 非同期でバックエンドにデータを送信
    fetch('backend/register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`サーバーエラーが発生しました (HTTP ${response.status})`);
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            messageContainer.className = 'success-message-container';
            messageContainer.innerHTML = `<p>${data.success}</p>`;
            form.reset();
            setTimeout(() => { window.location.href = 'login.php'; }, 3000);
        } else {
            let errorMessage = data.error || '不明なエラーが発生しました。';
            if (data.debug_info) {
                errorMessage += ` (詳細: ${data.debug_info})`;
            }
            messageContainer.className = 'error-message-container';
            messageContainer.innerHTML = `<p class="error-message">${errorMessage}</p>`;
        }
    })
    .catch(error => {
        messageContainer.className = 'error-message-container';
        messageContainer.innerHTML = `<p class="error-message">通信エラー: ${error.message}</p>`;
        console.error('Fetch Error:', error);
    });
});

// ★★★ 追加: パスワード表示/非表示の切り替え機能 ★★★
function setupPasswordToggle(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);

    toggle.addEventListener('click', function () {
        // 入力タイプを password と text で切り替える
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        
        // アイコンを fa-eye と fa-eye-slash で切り替える
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

// 2つのパスワード入力欄に機能を適用
setupPasswordToggle('togglePassword', 'password');
setupPasswordToggle('toggleConfirmPassword', 'confirm_password');

</script>
</body>
</html>