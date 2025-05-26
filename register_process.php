<?php
require 'db.php';

$username = $_POST['username'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT); // Encrypt password
$country = $_POST['country'];
$location = $_POST['location'];
$activity = $_POST['activity'];

try {
    $stmt = $pdo->prepare("INSERT INTO users (username, email, password, country, location, activity) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$username, $email, $password, $country, $location, $activity]);
    echo "Registration successful!";
} catch (PDOException $e) {
    echo "Registration failed: " . $e->getMessage();
}
?>
