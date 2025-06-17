<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Apps & Maps - Navigation & Transportation</title>
  <link rel="stylesheet" href="./css/navigations.css" />
</head>
<body>

<header class="site-header">
  <div class="logo">Japan life Manual</div>
  <nav class="main-nav">
    <a href="studenthome.php">StudentHome</a>
    <a href="route_planner.php">Back to Train Guide</a>
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
  <h1>📱 Apps & Maps</h1>
  <p>These apps will help you navigate Japan’s train systems, transfer stations, and plan routes easily.</p>

  <section class="apps-list">
    <div class="app-card">
      <h2>Google Maps</h2>
      <p>Reliable for real-time routes, platform details, and transfers. Works across Japan with good English support.</p>
      <a href="https://www.google.com/maps" target="_blank" class="btn">Open Google Maps</a>
    </div>

    <div class="app-card">
      <h2>NAVITIME Japan Travel</h2>
      <p>Comprehensive travel planner app. Includes trains, buses, and walking routes. Supports offline use and multiple languages.</p>
      <a href="https://www.navitime.co.jp/" target="_blank" class="btn">Open NAVITIME</a>
    </div>

    <div class="app-card">
      <h2>Yahoo! Norikae Annai</h2>
      <p>Popular app for detailed transfer guidance and timetable info, widely used by locals.</p>
      <a href="https://transit.yahoo.co.jp/" target="_blank" class="btn">Open Yahoo! Transit</a>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/apps_maps.js"></script>
</body>
</html>
