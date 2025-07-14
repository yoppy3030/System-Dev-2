<?php
/**
 * ユーザーログイン処理を行う本番用のスクリプトです。
 */

// 予期せぬエラー出力を防ぐため、出力バッファリングを開始
ob_start();

// 応答の形式をJSONに設定し、エラーハンドリングを準備
header('Content-Type: application/json');
ini_set('display_errors', 0);
error_reporting(E_ALL);

// 致命的なエラーを捕捉するシャットダウン関数
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

try {
    // config.phpが同じフォルダにあるため、パスを指定して読み込む
    $config_path = __DIR__ . '/config.php';
    if (!file_exists($config_path)) {
        throw new Exception("設定ファイルが見つかりません: " . $config_path);
    }
    require_once $config_path;

    // セッションを開始
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // POSTリクエストでなければ処理を中断
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('POSTメソッドでアクセスしてください。', 405);
    }

    // フォームからデータを取得
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // データが空でないかチェック
    if (empty($email) || empty($password)) {
        throw new Exception('メールアドレスとパスワードを入力してください。', 400);
    }

    // データベースからユーザー情報を取得（テーブル名: Accounts, カラム名: Email）
    $stmt = $pdo->prepare("SELECT * FROM Accounts WHERE Email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    // ユーザーが存在し、かつパスワードが一致するか検証（カラム名: Password）
    if ($user && password_verify($password, $user['Password'])) {
        // ログイン成功
        $_SESSION['user_id'] = $user['ID'];
        $_SESSION['username'] = $user['Name']; // カラム名: Name

        ob_clean(); // バッファをクリア
        http_response_code(200);
        echo json_encode(['success' => 'ログインに成功しました。ホームページに移動します。']);
    } else {
        // ログイン失敗
        throw new Exception('メールアドレスまたはパスワードが間違っています。', 401);
    }

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

// バッファの内容を出力
ob_end_flush();
?>
