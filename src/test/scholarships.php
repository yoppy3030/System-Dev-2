<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Scholarships in Japan</title>
  <link rel="stylesheet" href="./css/scholarships.css" />
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
      <h1>Scholarships for International Students</h1>
      <p>Discover financial support to help you study in Japan.</p>
    </div>
  </section>

  <section class="scholarship-list" id="scholarship-list-container">
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
<script src="./js/scholarships.js"></script>
</body>
</html>
