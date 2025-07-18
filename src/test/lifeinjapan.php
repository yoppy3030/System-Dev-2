<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Life in Japan</title>
  <link rel="stylesheet" href="./css/lifeinjapan.css">
</head>
<body>
  <header class="site-header">
    <div class="logo">JAPAN Life Manual</div>
    <nav class="main-nav">
      <a href="studenthome.php">StudentHome</a>
      <a href="workingjapan.php">Jobs & Careers</a>
      <a href="events.php">Events</a>
        <!-- 言語選択ドロップダウン -->
        <div class="language-selector">
        <button id="translateBtn" class="translate-btn">🌐 Translate</button>
        <div class="language-dropdown">
          <button class="language-option" data-lang="ja">🇯🇵 日本語</button>
          <button class="language-option" data-lang="en">🇺🇸 English</button>
          <button class="language-option" data-lang="zh">🇨🇳 中文</button>
          <!-- <button class="language-option" data-lang="ko">🇰🇷 한국어</button> -->
        </div>
      </div>
    </nav>
  </header>

  <section class="hero">
    <div class="hero-content">
      <h1>Life in Japan</h1>
      <p>Your practical guide to daily living, customs, costs, and services in Japan.</p>
    </div>
  </section>

  <section class="topics-grid">
    <a href="apartment_rental.php" class="topic-card">
      <h2>Housing & Rent</h2>
      <p>Find apartments, understand key money, and explore shared housing options.</p>
    </a>
    <a href="navigations.php" class="topic-card">
      <h2>Transportation</h2>
      <p>How to use trains, buses, and IC cards like Suica and PASMO in Japan.</p>
    </a>
    <a href="shopping_life.php" class="topic-card">
      <h2>Shopping & Daily Life</h2>
      <p>Learn where to shop for groceries, electronics, and daily essentials.</p>
    </a>
    <a href="part_time_jobs.php" class="topic-card">
      <h2>Part-Time Jobs</h2>
      <p>How to apply for work permits and find legal part-time job opportunities.</p>
    </a>
    <a href="health_insurance.php" class="topic-card">
      <h2>Health & Insurance</h2>
      <p>Join Japan's health insurance, visit hospitals, and use translation support.</p>
    </a>
    <a href="mobile_internet.php" class="topic-card">
      <h2>Mobile & Internet</h2>
      <p>Set up a phone contract, find prepaid SIM cards, and choose a Wi-Fi plan.</p>
    </a>
    <a href="emergency_contacts.php" class="topic-card">
      <h2>Emergency Contacts</h2>
      <p>Know how to call police (110), ambulance/fire (119), and support centers.</p>
    </a>
  </section>

  <footer style="background-color: #b71c1c; color: white; padding: 3rem 0; text-align: center;">
    <h2>Contact Us</h2>
    <p>Email: 22200797@ecc.ac.jp</p>
    <p>Address: 1-2-61 Koraku, Bunkyo City, Tokyo 123-0006, Japan</p>
    <p>Phone: +81 3-1234-5678</p>

  <div style="margin: 1.5rem 0;">
    <a href="#"><i class="fab fa-facebook-f" style="margin: 0 10px; font-size: 1.5rem;"></i></a>
    <a href="#"><i class="fab fa-twitter" style="margin: 0 10px; font-size: 1.5rem;"></i></a>
    <a href="#"><i class="fab fa-instagram" style="margin: 0 10px; font-size: 1.5rem;"></i></a>
    <a href="#"><i class="fab fa-linkedin-in" style="margin: 0 10px; font-size: 1.5rem;"></i></a>
  </div>

  <h2>Japan life Manual</h2>
  <p>&copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.</p>
</footer>
  <script src="./js/lifeinjapan.js"></script>
</body>
</html>
