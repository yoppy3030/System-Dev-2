<?php
// test_connection.php
// このファイルは、サーバーがGoogleのAIサーバーに接続できるかテストするためのものです。
// ブラウザで直接 http://.../test_connection.php を開いて結果を確認してください。

echo "<!DOCTYPE html><html lang='ja'><head><meta charset='UTF-8'><title>接続テスト</title>";
echo "<style>body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 2em; line-height: 1.6; } h1 { color: #333; } .success { color: #28a745; font-weight: bold; } .error { color: #dc3545; font-weight: bold; } pre { background-color: #f8f9fa; padding: 1em; border: 1px solid #dee2e6; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; }</style>";
echo "</head><body>";
echo "<h1>Google Gemini API 接続テスト</h1>";

// 1. PHP cURL拡張機能が有効かチェック
if (!function_exists('curl_init')) {
    echo "<p class='error'>エラー: PHPのcURL拡張機能がインストールされていないか、有効になっていません。</p>";
    echo "<p>お使いのサーバーの php.ini ファイルで `extension=curl` という行のコメントアウト（行頭のセミコロン`;`）を解除し、サーバーを再起動してください。</p>";
    echo "</body></html>";
    exit;
}
echo "<p class='success'>チェック1: cURL拡張機能は有効です。</p><hr>";

// 2. APIキーを設定 (お客様のキー)
$apiKey = 'AIzaSyAjrkz56zYE9KKsip35r4dGiqF9PCeCmRk';
$googleApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $apiKey;

echo "<p><b>チェック2:</b> APIキーをセットしました。</p>";
echo "<p>接続先URL: " . htmlspecialchars($googleApiUrl) . "</p><hr>";

// 3. cURLリクエストの準備
$ch = curl_init();

$postData = json_encode(['contents' => [['parts' => [['text' => 'Hello']]]]]);

curl_setopt($ch, CURLOPT_URL, $googleApiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);

// ローカル環境でのSSL証明書エラーを回避するための設定
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

echo "<p><b>チェック3:</b> cURLリクエストを準備し、Googleのサーバーへ送信します...</p><hr>";

// 4. リクエスト実行と結果の確認
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);
curl_close($ch);

echo "<h2>テスト結果</h2>";

if ($curl_error) {
    echo "<p class='error'>テスト失敗: cURLリクエストの実行に失敗しました。</p>";
    echo "<p><b>cURLエラーメッセージ:</b> " . htmlspecialchars($curl_error) . "</p>";
    echo "<p>このエラーは、お使いのPCのファイアウォールやセキュリティソフトが外部への接続をブロックしている場合や、サーバー(XAMPP)の設定に問題がある場合によく発生します。</p>";
} else {
    echo "<p class='success'>テスト成功: Googleのサーバーとの通信に成功しました。</p>";
    echo "<p><b>HTTPステータスコード:</b> " . $httpcode . "</p>";
    echo "<p><b>サーバーからの応答:</b></p>";
    echo "<pre>" . htmlspecialchars(print_r(json_decode($response, true), true)) . "</pre>";

    if ($httpcode == 200) {
        echo "<p class='success'>APIキーは有効で、正常に応答が返ってきました。このテストが成功するということは、サーバー環境は問題ありません。問題はチャットボットの他の部分（JavaScriptなど）にある可能性があります。</p>";
    } elseif ($httpcode >= 400) {
        echo "<p class='error'>注意: 通信は成功しましたが、Googleからエラーが返されました。APIキーが無効、利用制限、または請求先情報が未設定の可能性があります。Google Cloud ConsoleでAPIキーの状態をご確認ください。</p>";
    }
}

echo "</body></html>";
?>
