<?php
// gemini_proxy.php (SSL対策・最終版)

// 本番環境ではエラーを非表示にすることを推奨します
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

// お客様のAPIキー
$apiKey = 'AIzaSyAjrkz56zYE9KKsip35r4dGiqF9PCeCmRk';

// フロントエンドからのJSONリクエストを取得
$json_data = file_get_contents('php://input');
if (empty($json_data)) {
    http_response_code(400);
    echo json_encode(['error' => 'No data received.']);
    exit;
}
$request_data = json_decode($json_data, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON received.']);
    exit;
}

// Google AI APIのエンドポイントURL
$googleApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $apiKey;

// cURLセッションを初期化
$ch = curl_init();

// cURLオプションを設定
curl_setopt($ch, CURLOPT_URL, $googleApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $json_data);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 15);
curl_setopt($ch, CURLOPT_TIMEOUT, 40);

// --- ★★★ SSL証明書の問題を回避するための設定 ★★★ ---
// ローカルサーバー環境(XAMPPなど)で外部と通信するために追加します。
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
// ----------------------------------------------------

// リクエストを実行
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

// 結果を評価して応答
if ($response === false) {
    http_response_code(502); // Bad Gateway
    echo json_encode([
        'error' => 'Failed to connect to Google API server.',
        'curl_error_message' => $curl_error
    ]);
} else {
    http_response_code($httpcode);
    echo $response;
}

?>
