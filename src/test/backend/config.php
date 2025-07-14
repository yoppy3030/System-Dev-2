<?php
// config.php

/**
 * このファイルはデータベース接続を確立します。
 * エラーが発生した場合は、呼び出し元で処理できるよう例外をスローします。
 */

// 1. PHPのエラーを画面に表示する（デバッグ用）
ini_set('display_errors', 1);
error_reporting(E_ALL);

// 2. 必須のPHP拡張機能（pdo_mysql）が有効かチェック
if (!extension_loaded('pdo_mysql')) {
    // 拡張機能がない場合は、例外をスローして処理を中断します。
    // このエラーは呼び出し元のスクリプト（register.phpなど）でキャッチされます。
    throw new Exception("サーバー設定エラー: PHPの 'pdo_mysql' 拡張機能が有効になっていません。");
}

// 3. データベース接続情報
$host = 'localhost';
$db   = 'sd2db';
$user = 'ecc';
$pass = 'ecc';
$charset = 'utf8mb4';

// データソース名 (DSN)
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";

// PDO接続オプション
$options = [
    // エラー発生時に例外をスローする
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    // 結果を連想配列として取得する
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    // プリペアドステートメントのエミュレーションを無効にする
    PDO::ATTR_EMULATE_PREPARES   => false,
];

// 4. PDOインスタンスを作成します。
// 接続に失敗した場合、PDOは自動的にPDOExceptionをスローします。
$pdo = new PDO($dsn, $user, $pass, $options);
