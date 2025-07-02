<?php
// DB接続設定
// このファイルは、データベース接続の設定を行います。
$host = 'localhost';
$db   = 'sd2db';
<<<<<<< HEAD
$user = 'root';
$pass = 'root'; // パスワード
=======
$user = 'ecc';
$pass = 'ecc'; // mets ton mot de passe ici
>>>>>>> 0cd5ee5decfca56389197fdc8e31f0be71028af4
$charset = 'utf8mb4';

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}
?>