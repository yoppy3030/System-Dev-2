<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Navigation & Transportation</title>
  <link rel="stylesheet" href="./css/navigations.css" />
</head>
<body>

<header class="site-header">
  <div class="logo">JAPAN Life Manual</div>
  <nav class="main-nav">
    <a href="studenthome.php">StudentHome</a>
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
    <h1>Navigation & Transportation in Japan</h1>
    <p>Understand trains, IC cards, and how to travel like a local</p>
  </div>
</section>

<section class="info-section">
  <a href="route_planner.php" class="info-card">
    <h2>🚆 Train Systems</h2>
    <p>Use JR, Metro, and private lines like Hankyu and Kintetsu. Check real-time routes with Google Maps or NAVITIME.</p>
  </a>
  <a href="how_to_ride.php" class="info-card">
    <h2>🚉 How to Ride</h2>
    <p>Tap in at the gate, transfer platforms if needed, tap out to auto-pay. Easy and fast!</p>
  </a>

  <a href="useful_apps.php" class="info-card">
    <h2>📱 Useful Apps</h2>
    <p>Google Maps, NAVITIME Japan Travel, Yahoo! Norikae Annai help you travel easily.</p>
  </a>

  <a href="extra_tips.php" class="info-card">
    <h2>📝 Extra Tips</h2>
    <p>Avoid rush hours, use women-only cars in the morning, and avoid eating on local trains.</p>
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
<script src="./js/navigations.js"></script>

</body>
</html>
