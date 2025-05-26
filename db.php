<?php
$host = 'localhost';
$dbname = 'japan_life_manual';
$user = 'root';
$pass = 'password'; // Change this based on your environment

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo 'Database connection failed: ' . $e->getMessage();
    exit;
}
?>
