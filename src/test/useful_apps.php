<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Useful Apps - Navigation & Transportation</title>
  <link rel="stylesheet" href="./css/navigations.css" />
</head>
<body>

<header class="site-header">
  <div class="logo">JAPAN Life Manual</div>
  <nav class="main-nav">
    <a href="studenthome.php">StudentHome</a>
    <a href="navigations.php">Back to Navigation</a>
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

<main class="content">
  <h1>📱 Useful Apps</h1>
  <p>These apps will help you navigate Japan’s complex transportation systems easily and efficiently:</p>

  <section class="apps-list">
    <div class="app-card">
      <h2>🌐 Google Maps</h2>
      <p>Reliable for real-time route planning, platform details, and transfer guidance across Japan.</p>
      <a href="https://www.google.com/maps" target="_blank" class="btn">Open Google Maps</a>
    </div>

    <div class="app-card">
      <h2>🗾 NAVITIME Japan Travel</h2>
      <p>Comprehensive travel app with train, bus, and walking routes, plus offline features and language support.</p>
      <a href="https://www.navitime.co.jp/" target="_blank" class="btn">Open NAVITIME</a>
    </div>

    <div class="app-card">
      <h2>🚍 Yahoo! Norikae Annai</h2>
      <p>Popular app among locals for detailed route search and transfer info. Great for daily commutes.</p>
      <a href="https://transit.yahoo.co.jp/" target="_blank" class="btn">Open Norikae Annai</a>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/useful_apps.js"></script>
</body>
</html>
