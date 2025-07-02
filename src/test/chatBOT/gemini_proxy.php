<?php
// gemini_proxy.php (セキュリティデバッグ版)

// --- デバッグ用にエラーを詳細に表示します ---
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 1. vendor/autoload.php の存在チェック
if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    http_response_code(500);
    echo json_encode(['error' => '[デバッグ情報] vendor/autoload.php が見つかりません。composer install または composer require を実行しましたか？']);
    exit;
}
require 'vendor/autoload.php';

// 2. .env ファイルの存在チェック
if (!file_exists(__DIR__ . '/.env')) {
    http_response_code(500);
    echo json_encode(['error' => '[デバッグ情報] .env ファイルが chatBOT フォルダ内に見つかりません。']);
    exit;
}

// 3. 環境変数の読み込み
try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => '[デバッグ情報] .env ファイルの読み込みに失敗しました。', 'details' => $e->getMessage()]);
    exit;
}

// 4. 必要な環境変数が設定されているかチェック
if (empty($_ENV['GEMINI_API_KEY'])) {
    http_response_code(500);
    echo json_encode(['error' => '[デバッグ情報] .env ファイルに GEMINI_API_KEY が設定されていません。']);
    exit;
}

// --- ここから本処理 ---
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Invalid request method.']);
    exit;
}

$apiKey = $_ENV['GEMINI_API_KEY'];
$json_data = file_get_contents('php://input');
// (以降の処理は変更なし)

$request_data = json_decode($json_data, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON received.']);
    exit;
}
$googleApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $apiKey;
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
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);
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
