<?php
// セッションを開始し、CSRFトークンを生成
session_start();
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// エラー表示を有効化
ini_set('display_errors', 1);
error_reporting(E_ALL);

// データベース設定ファイルを読み込む
require(__DIR__ . '/backend/config.php');

// サーバーサイドの翻訳メッセージ
$translations = [
    'ja' => [
        'username_required' => 'ユーザー名は必須です。',
        'invalid_email' => '有効なメールアドレスを入力してください。',
        'password_short' => 'パスワードは8文字以上で設定してください。',
        'password_mismatch' => 'パスワードが一致しません。',
        'country_required' => '国名は必須です。',
        'location_required' => '現在の所在地は必須です。',
        'activity_required' => '日本での活動内容を選択してください。',
        'email_exists' => 'このメールアドレスは既に使用されています。',
        'db_error' => 'データベースエラーが発生しました。',
        'registration_success' => '登録が完了しました！ログインページに移動します。',
        'invalid_session' => 'セッションが無効です。ページを再読み込みしてください。',
        'registration_error' => 'ユーザー登録中にエラーが発生しました。'
    ],
    'en' => [
        'username_required' => 'Username is required.',
        'invalid_email' => 'Please enter a valid email address.',
        'password_short' => 'Password must be at least 8 characters long.',
        'password_mismatch' => 'Passwords do not match.',
        'country_required' => 'Country is required.',
        'location_required' => 'Current location is required.',
        'activity_required' => 'Please select your activity in Japan.',
        'email_exists' => 'This email address is already in use.',
        'db_error' => 'A database error occurred.',
        'registration_success' => 'Registration complete! Redirecting to login page.',
        'invalid_session' => 'Invalid session. Please reload the page.',
        'registration_error' => 'An error occurred during registration.'
    ],
    'zh' => [
        'username_required' => '用户名是必需的。',
        'invalid_email' => '请输入有效的电子邮件地址。',
        'password_short' => '密码必须至少为8个字符。',
        'password_mismatch' => '密码不匹配。',
        'country_required' => '国家是必需的。',
        'location_required' => '当前所在地是必需的。',
        'activity_required' => '请选择您在日本的活动内容。',
        'email_exists' => '该电子邮件地址已被使用。',
        'db_error' => '发生数据库错误。',
        'registration_success' => '注册成功！正在跳转到登录页面。',
        'invalid_session' => '会话无效。请重新加载页面。',
        'registration_error' => '注册时发生错误。'
    ]
];

// 入力値を安全に処理する関数
function validateInput($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// POSTリクエストの処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // JSON形式で応答
    header('Content-Type: application/json');
    
    // 言語設定を取得
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

    $error_keys = [];
    
    // ユーザー入力の取得と検証
    $username = validateInput($_POST['username']);
    $email = filter_var(validateInput($_POST['email']), FILTER_SANITIZE_EMAIL);
    $password = $_POST['password'];
    $password_confirmation = $_POST['password_confirmation'];
    $country = validateInput($_POST['country']);
    $current_location = validateInput($_POST['current_location']);
    $activity = validateInput($_POST['activity']);

    // 各項目のバリデーション
    if (empty($username)) $error_keys[] = 'username_required';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $error_keys[] = 'invalid_email';
    if (strlen($password) < 8) $error_keys[] = 'password_short';
    if ($password !== $password_confirmation) $error_keys[] = 'password_mismatch';
    if (empty($country)) $error_keys[] = 'country_required';
    if (empty($current_location)) $error_keys[] = 'location_required';
    if (empty($activity)) $error_keys[] = 'activity_required';

    // メールアドレスの重複チェック
    if (empty($error_keys)) {
        try {
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM Accounts WHERE Email = ?");
            $stmt->execute([$email]);
            if ($stmt->fetchColumn() > 0) {
                $error_keys[] = 'email_exists';
            }
        } catch (PDOException $e) {
            error_log("Email check failed: " . $e->getMessage());
            $error_keys[] = 'db_error';
        }
    }

    // エラーがなければユーザーを登録
    if (empty($error_keys)) {
        try {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("INSERT INTO Accounts (Name, Email, Password, Country, Current_location, UserType) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$username, $email, $hashed_password, $country, $current_location, $activity]);
            
            echo json_encode(['success' => $translations[$lang]['registration_success']]);
        } catch (PDOException $e) {
            error_log("Registration failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => $translations[$lang]['registration_error']]);
        }
    } else {
        $translated_errors = [];
        foreach ($error_keys as $key) {
            $translated_errors[] = $translations[$lang][$key];
        }
        http_response_code(400);
        echo json_encode(['error' => implode("\\n", $translated_errors)]);
    }
    exit;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-translate="registerTitle">ユーザー登録</title>
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
        <h1 data-translate="registerTitle">ユーザー登録</h1>

        <form id="register-form" method="POST">
            <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars($_SESSION['csrf_token']); ?>">
            <input type="hidden" name="lang" id="form-lang-input" value="en">
            
            <div id="message-container"></div>
            
            <label for="username" data-translate="usernameLabel">ユーザー名
                <input type="text" id="username" name="username" required data-translate-placeholder="usernamePlaceholder">
            </label>
            
            <label for="email" data-translate="emailLabel">Email
                <input type="email" id="email" name="email" required data-translate-placeholder="emailPlaceholder">
            </label>
            
            <label for="password" data-translate="passwordLabel">パスワード
                <div class="password-wrapper">
                    <input type="password" id="password" name="password" required data-translate-placeholder="passwordPlaceholder">
                    <i class="fas fa-eye-slash password-toggle-icon" id="togglePassword"></i>
                </div>
            </label>
            
            <label for="password_confirmation" data-translate="confirmPasswordLabel">パスワード（確認）
                <div class="password-wrapper">
                    <input type="password" id="password_confirmation" name="password_confirmation" required data-translate-placeholder="confirmPasswordPlaceholder">
                    <i class="fas fa-eye-slash password-toggle-icon" id="togglePasswordConfirmation"></i>
                </div>
            </label>
            
            <label for="country" data-translate="countryLabel">国
                <input type="text" id="country" name="country" required data-translate-placeholder="countryPlaceholder">
            </label>
            
            <label for="current_location" data-translate="currentLocationLabel">現在の所在地
                <input type="text" id="current_location" name="current_location" required data-translate-placeholder="currentLocationPlaceholder">
            </label>
            
            <label for="activity" data-translate="activityLabel">日本での活動内容
                <select id="activity" name="activity" required>
                    <option value="" data-translate="selectOption">選択してください</option>
                    <option value="Tourist" data-translate="touristOption">観光客</option>
                    <option value="International Student" data-translate="studentOption">留学生</option>
                    <option value="Professional" data-translate="professionalOption">就労者</option>
                    <option value="other" data-translate="otherOption">その他</option>
                </select>
            </label>
            
            <button type="submit" id="submit-button" data-translate="registerButton">登録</button>
        </form>
        <a href="login.php" data-translate="loginLink">ログインはこちら</a>
    </div>

<script>
const translations = {
    ja: {
        registerTitle: "ユーザー登録",
        usernameLabel: "ユーザー名",
        emailLabel: "メールアドレス",
        passwordLabel: "パスワード",
        confirmPasswordLabel: "パスワード（確認）",
        countryLabel: "国",
        currentLocationLabel: "現在の所在地",
        activityLabel: "日本での活動内容",
        selectOption: "選択してください",
        touristOption: "観光客",
        studentOption: "留学生",
        professionalOption: "就労者",
        otherOption: "その他",
        registerButton: "登録する",
        loginLink: "ログインはこちら",
        formSubmitting: "登録中...",
        usernamePlaceholder: "例：山田 太郎",
        emailPlaceholder: "例：example@email.com",
        passwordPlaceholder: "8文字以上",
        confirmPasswordPlaceholder: "パスワードを再入力",
        countryPlaceholder: "例：日本",
        currentLocationPlaceholder: "例：東京"
    },
    en: {
        registerTitle: "User Registration",
        usernameLabel: "Username",
        emailLabel: "Email",
        passwordLabel: "Password",
        confirmPasswordLabel: "Confirm Password",
        countryLabel: "Country",
        currentLocationLabel: "Current Location",
        activityLabel: "What are you doing in Japan?",
        selectOption: "Please select",
        touristOption: "Tourist",
        studentOption: "International Student",
        professionalOption: "Professional",
        otherOption: "Other",
        registerButton: "Register",
        loginLink: "Log in here",
        formSubmitting: "Registering...",
        usernamePlaceholder: "e.g., Taro Yamada",
        emailPlaceholder: "e.g., example@email.com",
        passwordPlaceholder: "8+ characters",
        confirmPasswordPlaceholder: "Re-enter password",
        countryPlaceholder: "e.g., Japan",
        currentLocationPlaceholder: "e.g., Tokyo"
    },
    zh: {
        registerTitle: "用户注册",
        usernameLabel: "用户名",
        emailLabel: "邮箱",
        passwordLabel: "密码",
        confirmPasswordLabel: "确认密码",
        countryLabel: "国家",
        currentLocationLabel: "当前所在地",
        activityLabel: "在日本的活动内容",
        selectOption: "请选择",
        touristOption: "游客",
        studentOption: "留学生",
        professionalOption: "就业者",
        otherOption: "其他",
        registerButton: "注册",
        loginLink: "在此登录",
        formSubmitting: "注册中...",
        usernamePlaceholder: "例如：山田太郎",
        emailPlaceholder: "例如：example@email.com",
        passwordPlaceholder: "8个以上字符",
        confirmPasswordPlaceholder: "重新输入密码",
        countryPlaceholder: "例如：日本",
        currentLocationPlaceholder: "例如：东京"
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

    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.dataset.translatePlaceholder;
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
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

    const form = document.getElementById('register-form');
    const messageContainer = document.getElementById('message-container');
    const submitButton = document.getElementById('submit-button');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = translations[currentLang].formSubmitting;
        messageContainer.innerHTML = '';

        const formData = new FormData(this);

        fetch('register.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                messageContainer.innerHTML = `<p class="success-message">${data.success}</p>`;
                setTimeout(() => {
                    window.location.href = 'login.php';
                }, 3000);
            } else {
                const errorMessage = data.error || "An unknown error occurred.";
                messageContainer.innerHTML = `<p class="error-message">${errorMessage.replace(/\\n/g, '<br>')}</p>`;
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

    function setupPasswordToggle(toggleId, inputId) {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);

        toggle.addEventListener('click', function () {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    setupPasswordToggle('togglePassword', 'password');
    setupPasswordToggle('togglePasswordConfirmation', 'password_confirmation');
});
</script>
</body>
</html>
