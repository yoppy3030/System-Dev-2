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
    // --- SMTPサーバー設定 (Microsoft 365 / Outlook) ---
    $smtp_settings = function($mail) {
        $mail->isSMTP();
        $mail->Host       = 'smtp.office365.com';
        $mail->SMTPAuth   = true;
        // ★★★ あなたのMicrosoftアカウントのメールアドレス
        $mail->Username   = '2240069@ecc.ac.jp'; 
        // ★★★ Microsoftアカウントの「アプリパスワード」
        $mail->Password   = '';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;
        $mail->CharSet    = 'UTF-8';
    };

    // 管理者宛・ユーザー宛メールに同じ設定を適用
    $smtp_settings($mail_admin);
    $smtp_settings($mail_user);

    // --- サイト管理者へのメール送信処理 ---
    $mail_admin->setFrom('2240069@ecc.ac.jp', 'マナー学習ボット'); // ★★★ あなたのMicrosoftアカウントのメールアドレス
    $mail_admin->addAddress('2240069@ecc.ac.jp', 'サイト管理者'); // ★★★ 管理者様のメールアドレス
    $mail_admin->addReplyTo($email, $name); 

    $mail_admin->isHTML(false);
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
    $mail_user->setFrom('2240069@ecc.ac.jp', 'マナー学習サイト'); // ★★★ あなたのMicrosoftアカウントのメールアドレス
    $mail_user->addAddress($email, $name);

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
            $mail_user->Subject = '【自動返信】お問い合わせありがとうございます';
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
    echo json_encode(['success' => false, 'error' => "Message could not be sent. Mailer Error: {$mail_admin->ErrorInfo}"]);
}

?>
