<?php
// gemini_proxy.php (セキュリティ対策版)

// Composerのオートローダーとphpdotenvを読み込む
require 'vendor/autoload.php';

// .envファイルから環境変数を読み込む
// __DIR__ は、このファイル(gemini_proxy.php)が存在するディレクトリを指します
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// エラーを非表示にする（本番環境向け）
ini_set('display_errors', 0);
error_reporting(0);

// ヘッダーを設定
header('Content-Type: application/json; charset=utf-8');

// POST以外のリクエストを拒否
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Invalid request method.']);
    exit;
}

// ★★★ 変更点: .envファイルからAPIキーを読み込む ★★★
$apiKey = $_ENV['GEMINI_API_KEY'];

// APIキーが読み込めているかチェック
if (empty($apiKey)) {
    http_response_code(500);
    echo json_encode(['error' => 'API key is not configured in the .env file.']);
    exit;
}

// フロントエンドからのJSONリクエストを取得
$json_data = file_get_contents('php://input');
$request_data = json_decode($json_data, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Invalid JSON received.']);
    exit;
}

// Google AI APIのエンドポイントURL
$googleApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $apiKey;

// cURLを使ってGoogleのサーバーにリクエストを転送
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $googleApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
curl_setopt($ch, CURLOPT_TIMEOUT, 40);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

// リクエストを実行
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// 結果を評価
if ($response === false) {
    http_response_code(502);
    echo json_encode([
        'error' => 'Failed to connect to Google API server.',
        'curl_error_message' => $curl_error
    ]);
} else {
    http_response_code($httpcode);
    echo $response;
}
?>
