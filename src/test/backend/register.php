<?php
/**
 * ユーザー登録処理を行う本番用のスクリプトです。
 * 正しいconfig.phpのパスに修正しました。
 */

// どんなエラーが発生しても、必ずJSON形式で応答を返すためのカスタムエラーハンドラを設定
header('Content-Type: application/json');
ini_set('display_errors', 0); // PHPによる直接のエラー出力を抑制
error_reporting(E_ALL);

register_shutdown_function(function () {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        if (ob_get_length()) ob_clean();
        http_response_code(500);
        echo json_encode([
            'error' => 'サーバーで致命的なエラーが発生しました。',
            'debug_info' => $error['message'],
            'file' => $error['file'],
            'line' => $error['line']
        ]);
        ob_end_flush();
    }
});

ob_start();

try {
    // ★★★ 最終修正点 ★★★
    // config.phpが同じフォルダにあるため、パスを修正します。
    $config_path = __DIR__ . '/config.php'; 
    if (!file_exists($config_path)) {
        throw new Exception("設定ファイルが見つかりません: " . $config_path);
    }

    // データベース接続設定を読み込む
    require_once $config_path;

    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('POSTメソッドでアクセスしてください。', 405);
    }

    $name = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $country = trim($_POST['country'] ?? '');
    $currentLocation = trim($_POST['current_location'] ?? '');
    $userType = $_POST['activity'] ?? '';

    if (empty($name) || empty($email) || empty($password) || empty($country) || empty($currentLocation) || empty($userType)) {
        throw new Exception('すべての必須フィールドを入力してください', 400);
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("SELECT ID FROM Accounts WHERE Email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        throw new Exception('このメールアドレスは既に使用されています', 409);
    }

    $sql = "INSERT INTO Accounts (Name, Email, Password, Country, Current_location, UserType) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$name, $email, $passwordHash, $country, $currentLocation, $userType]);

    ob_clean();
    http_response_code(201);
    echo json_encode(['success' => 'ユーザー登録が正常に完了しました！ 3秒後にログインページに移動します。']);

} catch (PDOException $e) {
    if (ob_get_length()) ob_clean();
    http_response_code(500);
    echo json_encode([
        'error' => 'データベース処理中にエラーが発生しました。',
        'debug_info' => $e->getMessage()
    ]);
} catch (Throwable $e) {
    if (ob_get_length()) ob_clean();
    $code = $e->getCode() >= 400 ? $e->getCode() : 500;
    http_response_code($code);
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}

ob_end_flush();
?>
