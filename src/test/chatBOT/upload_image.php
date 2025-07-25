<?php
// upload_image.php
// このファイルは、チャットボットからの画像アップロードを安全に検証するためのものです。
// ファイルをサーバーに保存するのではなく、セキュリティチェックのみを行い、結果をJSONで返します。

header('Content-Type: application/json; charset=utf-8');

// レスポンス用の配列を初期化
$response = [
    'success' => false,
    'error' => '不明なエラーが発生しました。'
];

// 1. リクエストメソッドがPOSTであるかを確認
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    $response['error'] = '無効なリクエストメソッドです。';
    echo json_encode($response);
    exit;
}

// 2. ファイルがアップロードされているか、エラーがないかを確認
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400); // Bad Request
    $upload_errors = [
        UPLOAD_ERR_INI_SIZE   => 'ファイルサイズが大きすぎます。',
        UPLOAD_ERR_FORM_SIZE  => 'ファイルサイズが大きすぎます。',
        UPLOAD_ERR_PARTIAL    => 'ファイルが一部しかアップロードされませんでした。',
        UPLOAD_ERR_NO_FILE    => 'ファイルが選択されていません。',
        UPLOAD_ERR_NO_TMP_DIR => 'サーバーエラーが発生しました。',
        UPLOAD_ERR_CANT_WRITE => 'サーバーエラーが発生しました。',
        UPLOAD_ERR_EXTENSION  => 'サーバーエラーが発生しました。',
    ];
    $error_code = $_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE;
    $response['error'] = $upload_errors[$error_code] ?? 'ファイルのアップロードに失敗しました。';
    echo json_encode($response);
    exit;
}

$file_tmp_path = $_FILES['image']['tmp_name'];
$file_size = $_FILES['image']['size'];
$file_name = $_FILES['image']['name'];

// 3. ファイルサイズの検証 (例: 5MBまで)
$max_file_size = 5 * 1024 * 1024; // 5MB
if ($file_size > $max_file_size) {
    http_response_code(400);
    $response['error'] = 'ファイルサイズは5MB以下にしてください。';
    echo json_encode($response);
    exit;
}

// 4. ファイルのMIMEタイプを検証 (拡張子偽装対策)
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime_type = $finfo->file($file_tmp_path);
$allowed_mime_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

if (!in_array($mime_type, $allowed_mime_types)) {
    http_response_code(400);
    $response['error'] = '許可されていないファイル形式です。(JPEG, PNG, GIF, WEBPのみ)';
    echo json_encode($response);
    exit;
}

// 5. 拡張子の検証
$file_extension = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

if (!in_array($file_extension, $allowed_extensions)) {
    http_response_code(400);
    $response['error'] = '無効なファイル拡張子です。';
    echo json_encode($response);
    exit;
}

// 6. 画像ファイルとして有効かどうかの最終チェック
if (getimagesize($file_tmp_path) === false) {
    http_response_code(400);
    $response['error'] = 'ファイルが有効な画像ではありません。';
    echo json_encode($response);
    exit;
}


// すべての検証をクリアした場合
$response['success'] = true;
$response['error'] = '';
http_response_code(200);
echo json_encode($response);
exit;

?>
