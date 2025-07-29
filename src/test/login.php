<?php
session_start();

// ユーザーが既にログインしている場合、ホームページにリダイレクト
if (isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit();
}

// データベース設定ファイルを読み込む
require_once __DIR__ . '/backend/config.php';

// CSRFトークンを生成
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// サーバーサイドの翻訳メッセージ
$translations = [
    'ja' => [
        'login_failed' => 'ユーザー名（またはメールアドレス）またはパスワードが無効です。',
        'input_required' => 'ユーザー名（またはメールアドレス）とパスワードを入力してください。',
        'server_error' => 'ログイン処理中にエラーが発生しました。しばらくしてから再度お試しください。',
        'login_success' => 'ログインに成功しました。ホームページに移動します。',
        'admin_login_success' => 'ログインに成功しました。管理者ページに移動します。', // ★ 追加
        'invalid_session' => 'セッションが無効です。ページを再読み込みしてください。'
    ],
    'en' => [
        'login_failed' => 'Invalid username (or email) or password.',
        'input_required' => 'Username (or Email) and password are required.',
        'server_error' => 'An error occurred during the login process. Please try again later.',
        'login_success' => 'Login successful. Redirecting to the homepage.',
        'admin_login_success' => 'Admin login successful. Redirecting to the dashboard.', // ★ Add
        'invalid_session' => 'Invalid session. Please reload the page.'
    ],
    'zh' => [
        'login_failed' => '用户名（或邮箱）或密码无效。',
        'input_required' => '请输入用户名（或邮箱）和密码。',
        'server_error' => '登录过程中发生错误。请稍后再试。',
        'login_success' => '登录成功。正在跳转到主页。',
        'admin_login_success' => '管理员登录成功。正在跳转到仪表板。', // ★ 添加
        'invalid_session' => '会话无效。请重新加载页面。'
    ]
];


// フォームが送信された場合の処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');
    $lang = $_POST['lang'] ?? 'en';
    if (!array_key_exists($lang, $translations)) {
        $lang = 'en';
    }

    // CSRFトークンの検証
    if (!isset($_POST['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $_POST['csrf_token'])) {
        http_response_code(403);
        echo json_encode(['error' => $translations[$lang]['invalid_session']]);
        exit;
    }

    $login_identifier = trim($_POST['login_identifier'] ?? '');
    $password = $_POST['password'] ?? '';

    // 入力が空でないかチェック
    if (empty($login_identifier) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => $translations[$lang]['input_required']]);
        exit;
    }

    try {
        // ユーザー名またはメールアドレスでユーザーを検索
        $stmt = $pdo->prepare("SELECT * FROM Accounts WHERE Name = ? OR Email = ?");
        $stmt->execute([$login_identifier, $login_identifier]);
        $user = $stmt->fetch();

        // ユーザーが存在し、パスワードが一致するか検証
        if ($user && password_verify($password, $user['Password'])) {
            session_regenerate_id(true); // セッションIDを再生成
            $_SESSION['user_id'] = $user['ID'];
            $_SESSION['username'] = $user['Name'];
            
            // ★★★ 修正点: 管理者かどうかでメッセージとリダイレクト先を分岐 ★★★
            if (!empty($user['is_admin']) && $user['is_admin'] == 1) {
                $message = $translations[$lang]['admin_login_success'];
                $redirect_url = 'admin/dashboard.php';
            } else {
                $message = $translations[$lang]['login_success'];
                $redirect_url = 'index.php';
            }

            echo json_encode([
                'success' => $message,
                'redirect' => $redirect_url
            ]);
            
        } else {
            http_response_code(401);
            echo json_encode(['error' => $translations[$lang]['login_failed']]);
        }
    } catch (PDOException $e) {
        // データベースエラー
        error_log("Login failed: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => $translations[$lang]['server_error']]);
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate="loginTitle">ログイン</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Montserrat:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./css/style.css">
</head>
<body>
    <div class="form-container">
        <div class="language-select-wrapper">
            <select id="language-switcher" class="language-select">
                <option value="ja">日本語</option>
                <option value="en">English</option>
                <option value="zh">中文</option>
            </select>
        </div>
        <h1 data-translate="loginTitle">ログイン</h1>
        
        <div id="message-container"></div>

        <form id="login-form" method="POST" novalidate>
            <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
            <input type="hidden" name="lang" id="form-lang-input" value="en">

            <label for="login_identifier" data-translate="usernameOrEmailLabel">ユーザー名またはEmail
                <input type="text" id="login_identifier" name="login_identifier" required>
            </label>
            
            <label for="password" data-translate="passwordLabel">パスワード
                <div class="password-wrapper">
                    <input type="password" id="password" name="password" required>
                    <i class="fas fa-eye-slash password-toggle-icon" id="togglePassword"></i>
                </div>
            </label>
            
            <button type="submit" id="submit-button" data-translate="loginButton">ログイン</button>
        </form>
        <a href="register.php" data-translate="signUpLink">登録はこちら</a>
        <a href="index.php" class="back-link" data-translate="backToIndex">ホームに戻る</a>
    </div>

    <script>
        const translations = {
            ja: {
                loginTitle: "ログイン",
                usernameOrEmailLabel: "ユーザー名またはEmail",
                passwordLabel: "パスワード",
                loginButton: "ログイン",
                signUpLink: "登録はこちら",
                backToIndex: "ホームに戻る",
                formSubmitting: "ログイン中..."
            },
            en: {
                loginTitle: "Login",
                usernameOrEmailLabel: "Username or Email",
                passwordLabel: "Password",
                loginButton: "Log In",
                signUpLink: "Sign up",
                backToIndex: "Back to Home",
                formSubmitting: "Logging in..."
            },
            zh: {
                loginTitle: "登录",
                usernameOrEmailLabel: "用户名或邮箱",
                passwordLabel: "密码",
                loginButton: "登录",
                signUpLink: "注册",
                backToIndex: "返回首页",
                formSubmitting: "登录中..."
            }
        };

        let currentLang = 'en';

        function switchLanguage(lang) {
            currentLang = lang;
            document.getElementById('form-lang-input').value = lang;
            document.querySelectorAll('[data-translate]').forEach(el => {
                const key = el.dataset.translate;
                if (translations[lang] && translations[lang][key]) {
                    if (el.tagName === 'LABEL') {
                        const textNode = Array.from(el.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
                        if(textNode) textNode.textContent = translations[lang][key];
                    } else {
                        el.textContent = translations[lang][key];
                    }
                }
            });
            document.documentElement.lang = lang;
            localStorage.setItem('preferredLanguage', lang);
        }

        document.addEventListener('DOMContentLoaded', () => {
            const languageSelect = document.getElementById('language-switcher');
            const savedLang = localStorage.getItem('preferredLanguage') || 'en';
            
            languageSelect.value = savedLang;
            switchLanguage(savedLang);

            languageSelect.addEventListener('change', (e) => {
                switchLanguage(e.target.value);
            });

            const form = document.getElementById('login-form');
            const messageContainer = document.getElementById('message-container');
            const submitButton = document.getElementById('submit-button');

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const originalButtonText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.textContent = translations[currentLang].formSubmitting;
                messageContainer.innerHTML = '';

                const formData = new FormData(this);

                fetch('login.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        messageContainer.innerHTML = `<p class="success-message">${data.success}</p>`;
                        setTimeout(() => {
                            window.location.href = data.redirect || 'index.php';
                        }, 1500);
                    } else {
                        messageContainer.innerHTML = `<p class="error-message">${data.error}</p>`;
                        submitButton.disabled = false;
                        submitButton.textContent = originalButtonText;
                    }
                })
                .catch(error => {
                    messageContainer.innerHTML = `<p class="error-message">A communication error occurred.</p>`;
                    console.error('Fetch Error:', error);
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });
            });

            const toggle = document.getElementById('togglePassword');
            const input = document.getElementById('password');
            if (toggle && input) {
                toggle.addEventListener('click', function () {
                    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                    input.setAttribute('type', type);
                    this.classList.toggle('fa-eye');
                    this.classList.toggle('fa-eye-slash');
                });
            }
        });
    </script>
</body>
</html>
