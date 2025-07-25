<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Professional Life in Japan</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <link rel="stylesheet" href="./css/professional.css">
</head>
<body>
  <!-- Navigation Bar -->
 <header class="site-header">
  <div class="logo">JAPAN Life Manual</div>
  <nav class="main-nav">
    <ul>
      <li><a href="index.php">Home</a></li>

      <li class="dropdown">
        <a href="#">Others ▾</a>
        <ul class="dropdown-menu">
          <li><a href="culture.html">Japanese Culture</a></li>
          <li><a href="daily-life.html">Daily Life</a></li>
          <li><a href="visa_guide_japan.php">Visa Guide</a></li>
        </ul>
      </li>

      <li><a href="studenthome.php">Student</a></li>
      <li><a href="travelers_homePage.php">Traveler</a></li>
      <li><a href="about.html">About</a></li>

      <li class="language-selector">
        <button id="translateBtn" class="translate-btn">🌐 Translate</button>
        <div class="language-dropdown">
          <button class="language-option" data-lang="ja">🇯🇵 日本語</button>
          <button class="language-option" data-lang="en">🇺🇸 English</button>
          <button class="language-option" data-lang="zh">🇨🇳 中文</button>
        </div>
      </li>
    </ul>
  </nav>
</header>

  <!-- Hero Section -->
  <section class="hero" style="background-image: url(./img/namba.jpg);">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <h1>Professional Life in Japan</h1>
      <p>Your trusted guide for working professionally in Japan.</p>
    </div>
  </section>

  <!-- Main Content -->
<main class="main-content">
  <div class="info-block">
    <h2><i class="fas fa-briefcase"></i> Business Etiquette</h2>
    <p>Bowing is a common greeting. Exchange business cards with both hands. Be punctual.</p>
    <a href="business_etiquette.php" class="details-button">Details</a>
  </div>

  <div class="info-block">
    <h2><i class="fas fa-clock"></i> Work Hours and Holidays</h2>
    <p>Standard hours are 9 AM-6 PM. Key holidays: New Year, Golden Week, Obon.</p>
    <a href="work_hours.php" class="details-button">Details</a>
  </div>

  <div class="info-block">
    <h2><i class="fas fa-language"></i> Language Expectations</h2>
    <p>Basic Japanese is expected. English is useful in multinational companies.</p>
    <a href="language_expectations.php" class="details-button">Details</a>
  </div>

  <div class="info-block">
    <h2><i class="fas fa-balance-scale"></i> Labor Rights</h2>
    <p>Know your rights: work contracts, overtime limits, and paid leave.</p>
    <a href="labor_rights.php" class="details-button">Details</a>
  </div>
</main>


  <!-- Footer -->
  <footer>
    <div class="footer-content">
      <h2>Contact Us</h2>
      <p><a href="mailto:22200797@ecc.ac.jp">Email: 22200797@ecc.ac.jp</a></p>
      <p>Address: 1-2-61 Koraku, Bunkyo City, Tokyo 123-0006, Japan</p>
      <p>Phone: +81 3-1234-5678</p>
      <div class="social-icons">
        <a href="#"><i class="fab fa-facebook"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-instagram"></i></a>
        <a href="#"><i class="fab fa-linkedin"></i></a>
      </div>
      <h2>Japan life Manual</h2>
      <p>&copy; 2025 JAPAN Life Manual. All rights reserved.</p>
    </div>
  </footer>
  <script src="./js/professional_comment_sec.js"></script>
</body>
</html>
