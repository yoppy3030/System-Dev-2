<?php
// send_inquiry.php (最終版)
// 本番用のコードです。デバッグモードは無効化されています。

// ComposerでインストールしたPHPMailerを読み込む
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// ヘッダー設定
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// POSTデータ取得と検証
$json_data = file_get_contents('php://input');
$request_data = json_decode($json_data, true);

if (!$request_data || !isset($request_data['name'], $request_data['email'], $request_data['message'], $request_data['lang'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid input.']);
    exit;
}

$name = htmlspecialchars(trim($request_data['name']));
$email = trim($request_data['email']);
$message = htmlspecialchars(trim($request_data['message']));
$lang = htmlspecialchars(trim($request_data['lang']));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
     echo json_encode(['success' => false, 'error' => 'Invalid email format']);
     exit;
}

$mail = new PHPMailer(true);

try {
    // --- ★★★ SMTPサーバー設定 (Gmail用) ★★★ ---
    // 先ほどのテストで成功した、ご自身の情報に書き換えてください。

    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;
    $mail->CharSet    = 'UTF-8';

    // 1. ★ 送信元となる、あなたのGmailアドレス
    $mail->Username   = 'test.example3030@gmail.com';

    // 2. ★ 上記Gmailアカウントの「アプリパスワード」（16文字のコード）
    $mail->Password   = 'kqapaspjurkqfzdi';

    // --- サイト管理者へのメール送信処理 ---
    $mail->setFrom($mail->Username, 'マナー学習ボット'); 

    // 3. ★ お問い合わせメールの送信先となる、管理者様のメールアドレス
    $mail->addAddress('test.example3030@gmail.com', 'サイト管理者'); 
    
    $mail->addReplyTo($email, $name); 
    $mail->isHTML(false); 
    $mail->Subject = '【マナー学習サイト】チャットボットからのお問い合わせ';
    $body_admin = "チャットボット経由でお問い合わせがありました。\n\n"
                . "================================\n"
                . "お名前: " . $name . "\n"
                . "メールアドレス: " . $email . "\n"
                . "お問い合わせ内容:\n" . $message . "\n"
                . "================================\n";
    $mail->Body = $body_admin;

    $mail->send();

    // --- ユーザーへの自動返信メール送信処理 ---
    $mail->clearAddresses();
    $mail->addAddress($email, $name); 
    
    switch ($lang) {
        case 'en':
            $mail->Subject = '[Auto-Reply] Thank you for your inquiry';
            $user_body = "Hello " . $name . ",\n\nThank you for your inquiry.\nWe have received the following content and will get back to you shortly.\n\n";
            break;
        case 'zh':
            $mail->Subject = '【自动回复】感谢您的咨询';
            $user_body = $name . " 您好，\n\n感谢您的咨询。\n我们已收到您的以下留言，并将尽快与您联系。\n\n";
            break;
        default: // 'ja'
            $mail->Subject = '【自動返信】お問い合わせありがとうございます';
            $user_body = $name . "様\n\nこの度はお問い合わせいただき、誠にありがとうございます。\n以下の内容で承りました。\n担当者より追ってご連絡いたしますので、今しばらくお待ちくださいませ。\n\n";
            break;
    }
    
    $user_body .= "----------------\n"
                . "Your Inquiry:\n" . $message . "\n"
                . "----------------\n";
    $mail->Body = $user_body;

    $mail->send();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    // 本番環境では、ユーザーに詳細なエラーを見せないようにします
    error_log("Mailer Error: " . $mail->ErrorInfo); // エラーログをサーバーに残す
    echo json_encode(['success' => false, 'error' => 'An unexpected error occurred while sending the message.']);
}
?>
