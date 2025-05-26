<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login - JAPAN Life Manual</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="form-container">
        <h1>User Login</h1>
        <form action="login_process.php" method="post">
            <label>Email:<input type="email" name="email" required></label>
            <label>Password:<input type="password" name="password" required></label>
            <button type="submit">Login</button>
        </form>
        <p>Don't have an account? <a href="register.php">Register here</a></p>
    </div>
</body>
</html>
