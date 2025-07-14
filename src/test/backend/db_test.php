<?php
echo "<h1>データベース接続テスト</h1>";

// 1. PHPのエラーを画面に表示する設定
ini_set('display_errors', 1);
error_reporting(E_ALL);
echo "<p>ステップ1: エラー表示設定... OK</p>";

// 2. 必須のPHP拡張機能（pdo_mysql）が有効かチェック
if (!extension_loaded('pdo_mysql')) {
    echo "<h2>テスト失敗</h2>";
    die("<p style='color: red; font-weight: bold;'>致命的エラー: PHPの 'pdo_mysql' 拡張機能が有効になっていません。サーバーのphp.iniファイルを確認してください。</p>");
}
echo "<p>ステップ2: pdo_mysql拡張機能のチェック... OK</p>";

// 3. データベース接続情報 (config.phpと同じ内容)
$host = 'localhost';
$db   = 'sd2db';
$user = 'ecc';
$pass = 'ecc';
$charset = 'utf8mb4';

echo "<p>ステップ3: 接続情報の設定... OK</p>";
echo "<pre>ホスト: $host, DB: $db, ユーザー: $user</pre>";

// データソース名 (DSN)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// PDO接続オプション
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    echo "<p>ステップ4: データベースへの接続試行...</p>";
    // PDOインスタンスを作成して、データベースに接続
    $pdo = new PDO($dsn, $user, $pass, $options);

    echo "<h2 style='color: green;'>テスト成功！</h2>";
    echo "<p>データベース '{$db}' への接続に成功しました。</p>";

} catch (PDOException $e) {
    echo "<h2>テスト失敗</h2>";
    // 接続に失敗した場合、エラーメッセージを表示
    echo "<p style='color: red; font-weight: bold;'>データベース接続エラー: " . $e->getMessage() . "</p>";
    echo "<p><strong>考えられる原因:</strong></p>";
    echo "<ul>";
    echo "<li>データベースサーバー (MySQL) が起動していない。</li>";
    echo "<li>ホスト名、データベース名、ユーザー名、またはパスワードが正しくない。</li>";
    echo "<li>指定されたユーザーにデータベースへのアクセス権がない。</li>";
    echo "</ul>";
}
?>
