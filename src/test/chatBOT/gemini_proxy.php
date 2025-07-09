<?php
// gemini_proxy.php (完成版 / chatBOTフォルダ内の.envを使用)

// Composerのオートローダーを読み込む
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
} 
elseif (file_exists(dirname(__DIR__) . '/vendor/autoload.php')) {
    require dirname(__DIR__) . '/vendor/autoload.php';
} 
else {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Internal Server Configuration Error: Autoloader not found.']);
    exit;
}

// .env ファイルを読み込む
try {
    // このPHPファイルと同じ階層（__DIR__）から.envを読み込む
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
} catch (Exception $e) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Internal Server Configuration Error: Could not load .env file from chatBOT directory.', 'details' => $e->getMessage()]);
    exit;
}

// APIキーが設定されているか確認
if (empty($_ENV['GEMINI_API_KEY'])) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Internal Server Configuration Error: GEMINI_API_KEY not set in the .env file.']);
    exit;
}

// リクエストメソッドがPOSTであるか確認
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Invalid request method.']);
    exit;
}

// --- ここから本処理 ---
header('Content-Type: application/json; charset=utf-8');

$apiKey = $_ENV['GEMINI_API_KEY'];
$json_data = file_get_contents('php://input');

// JSONデータが空でないか、デコード可能かを確認
$request_data = json_decode($json_data, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid JSON data received.', 'details' => json_last_error_msg()]);
    exit;
}

// Google Gemini APIのエンドポイント
$googleApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $apiKey;

// cURLを使用してAPIにリクエストを転送
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $googleApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15); // 接続タイムアウト15秒
curl_setopt($ch, CURLOPT_TIMEOUT, 40);      // 全体タイムアウト40秒
// ローカル環境でのSSL証明書エラーを回避（本番環境ではセキュリティリスクのため推奨しません）
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);

curl_close($ch);

// cURLリクエストが失敗した場合
if ($response === false) {
    http_response_code(502); // Bad Gateway
    echo json_encode([
        'error' => 'Failed to connect to the Google API server.',
        'curl_error_message' => $curl_error
    ]);
} else {
    // Google APIからのレスポンスをそのままブラウザに返す
    http_response_code($httpcode);
    echo $response;
}
?>