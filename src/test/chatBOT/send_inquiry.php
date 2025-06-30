<?php
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *'); 
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit;
    }

    $json_data = file_get_contents('php://input');
    $request_data = json_decode($json_data, true);

    if (!$request_data || !isset($request_data['name']) || !isset($request_data['email']) || !isset($request_data['message'])) {
        echo json_encode(['success' => false, 'error' => 'Invalid input']);
        exit;
    }

    $name = filter_var(trim($request_data['name']), FILTER_SANITIZE_STRING);
    $email = filter_var(trim($request_data['email']), FILTER_SANITIZE_EMAIL);
    $message = filter_var(trim($request_data['message']), FILTER_SANITIZE_STRING);
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
         echo json_encode(['success' => false, 'error' => 'Invalid email format']);
         exit;
    }

    // ★★★ あなたのメールアドレスに変更してください ★★★
    $to = "your-email@example.com"; 
    
    $subject = "【マナー学習サイト】チャットボットからのお問い合わせ";

    $body = "チャットボット経由でお問い合わせがありました。\n\n";
    $body .= "================================\n";
    $body .= "お名前: " . $name . "\n";
    $body .= "メールアドレス: " . $email . "\n";
    $body .= "お問い合わせ内容:\n" . $message . "\n";
    $body .= "================================\n";

    // ★あなたのドメインのメールアドレスに変更
    $headers = "From: no-reply@your-domain.com\r\n"; 
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to send mail']);
    }

?>