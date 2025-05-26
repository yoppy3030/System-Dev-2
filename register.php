<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Register - JAPAN Life Manual</title>
    <link rel="stylesheet" href="style.css">
    <script>
        function validateForm() {
            const email = document.forms["registerForm"]["email"].value;
            const password = document.forms["registerForm"]["password"].value;

            if (!email.includes("@")) {
                alert("Please enter a valid email address.");
                return false;
            }
            if (password.length < 6) {
                alert("Password must be at least 6 characters.");
                return false;
            }
            return true;
        }
    </script>
</head>
<body>
    <div class="form-container">
        <h1>User Registration</h1>
        <form name="registerForm" action="register_process.php" method="post" onsubmit="return validateForm()">
            <label>Username:<input type="text" name="username" required></label>
            <label>Email:<input type="email" name="email" required></label>
            <label>Password:<input type="password" name="password" required></label>
            <label>Country:<input type="text" name="country" required></label>
            <label>Current Location:<input type="text" name="location" required></label>
            <label>What are you doing in Japan?
                <select name="activity" required>
                    <option value="Worker">Worker</option>
                    <option value="Student">Student</option>
                    <option value="Tourist">Tourist</option>
                    <option value="Other">Other</option>
                </select>
            </label>
            <button type="submit">Register</button>
        </form>
        <p>Already have an account? <a href="login.php">Login here</a></p>
    </div>
</body>
</html>
