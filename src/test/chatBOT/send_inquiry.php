<?php
// PHPMailerライブラリの読み込み
// Composerでインストールした場合のパスです
require 'vendor/autoload.php';

// 名前空間の使用を宣言
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// レスポンスの形式をJSONに指定
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// POSTされたJSONデータを取得
$json_data = file_get_contents('php://input');
$request_data = json_decode($json_data, true);

// データのバリデーション
if (!$request_data || !isset($request_data['name']) || !isset($request_data['email']) || !isset($request_data['message']) || !isset($request_data['lang'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
    exit;
}

// データを変数に格納
$name = $request_data['name'];
$email = $request_data['email'];
$message = $request_data['message'];
$lang = $request_data['lang'];

// メールアドレスの形式を検証
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
     echo json_encode(['success' => false, 'error' => 'Invalid email format']);
     exit;
}

$mail_admin = new PHPMailer(true);
$mail_user = new PHPMailer(true);

try {
    // --- SMTPサーバー設定 (管理者宛・ユーザー宛で共通) ---
    // Gmailを使う場合の設定例です
    $mail_admin->isSMTP();
    $mail_admin->Host       = 'smtp.gmail.com';
    $mail_admin->SMTPAuth   = true;
    $mail_admin->Username   = 'your-gmail-address@gmail.com'; // ★★★ あなたのGmailアドレス
    $mail_admin->Password   = 'your-gmail-app-password';      // ★★★ あなたのGmailアプリパスワード
    $mail_admin->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail_admin->Port       = 465;
    $mail_admin->CharSet    = 'UTF-8';

    // ユーザー宛メールも同じ設定をコピー
    $mail_user->isSMTP();
    $mail_user->Host       = 'smtp.gmail.com';
    $mail_user->SMTPAuth   = true;
    $mail_user->Username   = 'your-gmail-address@gmail.com'; // ★★★ あなたのGmailアドレス
    $mail_user->Password   = 'your-gmail-app-password';      // ★★★ あなたのGmailアプリパスワード
    $mail_user->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail_user->Port       = 465;
    $mail_user->CharSet    = 'UTF-8';

    // --- サイト管理者へのメール送信処理 ---
    $mail_admin->setFrom('your-gmail-address@gmail.com', 'マナー学習ボット'); // 送信元
    $mail_admin->addAddress('2240069@ecc.ac.jp', 'サイト管理者'); // ★★★ 修正された受信用のメールアドレス
    $mail_admin->addReplyTo($email, $name); // 返信先としてユーザーのアドレスを設定

    $mail_admin->isHTML(false); // テキスト形式のメール
    $mail_admin->Subject = '【マナー学習サイト】チャットボットからのお問い合わせ';
    $body_admin = "チャットボット経由でお問い合わせがありました。\n\n";
    $body_admin .= "================================\n";
    $body_admin .= "お名前: " . $name . "\n";
    $body_admin .= "メールアドレス: " . $email . "\n";
    $body_admin .= "お問い合わせ内容:\n" . $message . "\n";
    $body_admin .= "================================\n";
    $mail_admin->Body = $body_admin;

    $mail_admin->send();

    // --- ユーザーへの自動返信メール送信処理 ---
    $mail_user->setFrom('your-gmail-address@gmail.com', 'マナー学習サイト'); // 送信元
    $mail_user->addAddress($email, $name); // ユーザーのアドレス宛

    $mail_user->isHTML(false);
    
    // 言語に応じた件名と本文を設定
    switch ($lang) {
        case 'en':
            $mail_user->Subject = '[Auto-Reply] Thank you for your inquiry';
            $user_body = "Hello " . $name . ",\n\nThank you for your inquiry.\nWe have received the following content and will get back to you shortly.\n\n";
            break;
        case 'zh':
            $mail_user->Subject = '【自动回复】感谢您的咨询';
            $user_body = $name . " 您好，\n\n感谢您的咨询。\n我们已收到您的以下留言，并将尽快与您联系。\n\n";
            break;
        case 'ja':
        default:
            $user_body = $name . "様\n\nこの度はお問い合わせいただき、誠にありがとうございます。\n以下の内容で承りました。\n担当者より追ってご連絡いたしますので、今しばらくお待ちくださいませ。\n\n";
            break;
    }
    
    $user_body .= "----------------\n";
    $user_body .= "Your Inquiry:\n" . $message . "\n";
    $user_body .= "----------------\n";
    $mail_user->Body = $user_body;

    $mail_user->send();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    // エラーが発生した場合
    echo json_encode(['success' => false, 'error' => "Message could not be sent. Mailer Error: {$mail_admin->ErrorInfo}"]);
}

?>
