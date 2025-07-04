<?php
// test_email_final_check.php
// Gmail送信認証の最終診断用ファイルです。

// --- ★★★ ここにあなたの情報を入力してください ★★★ ---
$your_gmail_address = 'test.example3030@gmail.com'; // 1. あなたのGmailアドレス
$your_app_password  = 'kqapaspjurkqfzdi';     // 2. 新しく生成した16文字のアプリパスワード
$recipient_address  = 'test.example3030@gmail.com'; // 3. 送信先（あなたのGmailアドレスと同じでOK）
// --- ★★★ 入力はここまで ★★★ ---


// --- ここから下は編集不要です ---
ini_set('display_errors', 1);
error_reporting(E_ALL);
require 'vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

$mail = new PHPMailer(true);

echo "<!DOCTYPE html><html lang='ja'><head><meta charset='UTF-8'><title>最終診断テスト</title>";
echo "<style>body { font-family: sans-serif; padding: 1em 2em; line-height: 1.7; } h1, h2 { border-bottom: 2px solid #ddd; padding-bottom: 8px; } .success { color: #155724; background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px;} .error { color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px;} pre { background: #f8f9fa; padding: 1em; border: 1px solid #dee2e6; border-radius: 5px; white-space: pre-wrap; word-wrap: break-word; font-size: 12px; } ul { background: #fff; padding: 20px 20px 20px 40px; border-radius: 5px; border: 1px solid #ddd;} li { margin-bottom: 10px; }</style>";
echo "</head><body><h1>Gmail送信 最終診断テスト</h1>";

if ($your_gmail_address === 'your.email@gmail.com' || $your_app_password === 'xxxxxxxxxxxxxxxx') {
    echo "<div class='error'><h2>エラー：診断ファイルが編集されていません。</h2><p>このPHPファイルを開き、上部にある3つの変数（メールアドレス、アプリパスワード、宛先）をあなたの情報に書き換えてから、ブラウザを再読み込みしてください。</p></div>";
    exit;
}

try {
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->Debugoutput = function($str, $level) {
        // デバッグログはHTMLのPREタグに出力
        echo "<pre>".htmlspecialchars($str)."</pre>";
    };
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $your_gmail_address;
    $mail->Password   = $your_app_password;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';
    $mail->setFrom($your_gmail_address, '最終診断テスト');
    $mail->addAddress($recipient_address);
    $mail->Subject = 'Gmail送信 最終診断テスト';
    $mail->Body    = 'このメールが届けば、認証情報は完全に正しいです。';
    $mail->send();
    echo '<div class="success"><h2>メール送信成功！</h2><p>認証情報は正しく、メール送信機能は正常に動作します。チャットボットの `send_inquiry.php` に、このファイルと同じ情報を設定してください。</p></div>';
} catch (Exception $e) {
    echo '<div class="error"><h2>メール送信失敗</h2>';
    echo "<p><b>エラーメッセージ:</b> {$mail->ErrorInfo}</p>";
    echo "<hr>";
    echo "<h3>このエラーが表示される理由と解決策:</h3>";
    echo "<ul>";
    echo "<li><b>原因1（最有力）: 入力した「アプリパスワード」が間違っている。</b><br><b>解決策:</b> Googleアカウントの<a href='https://myaccount.google.com/apppasswords' target='_blank'>アプリパスワードのページ</a>で、古いパスワードを削除し、<b><u>新しい16文字のパスワード</u></b>を再生成して、間違いなくコピー＆ペーストしてください。スペースを含めないでください。</li>";
    echo "<li><b>原因2: 入力した「Gmailアドレス」が間違っている。</b><br><b>解決策:</b> メールアドレスの綴りが正しいか、もう一度確認してください。</li>";
    echo "<li><b>原因3: お使いのGoogleアカウントで「2段階認証プロセス」が有効になっていない。</b><br><b>解決策:</b> Googleの<a href='https://myaccount.google.com/security' target='_blank'>セキュリティページ</a>で、「2段階認証プロセス」を有効にしてください。これが有効でないと、アプリパスワードは作成・利用できません。</li>";
    echo "</ul></div>";
}
echo "</body></html>";
?>
