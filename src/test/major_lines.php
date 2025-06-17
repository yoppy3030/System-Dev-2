<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Major Lines - Navigation & Transportation</title>
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
  <h1>🚆 Major Lines</h1>
  <p>Understand the key train operators and their networks in Japan. These rail systems connect cities, towns, and regions efficiently.</p>

  <section class="steps">
    <div class="step">
      <h2>Japan Railways (JR)</h2>
      <p>JR is the largest network, covering the entire country with local, rapid, express, and Shinkansen (bullet train) services. JR Pass holders can use most JR trains nationwide.</p>
    </div>

    <div class="step">
      <h2>Metro Systems</h2>
      <p>Major cities like Tokyo, Osaka, Kyoto, and Nagoya have subway (Metro) systems that provide quick transport within urban areas.</p>
    </div>

    <div class="step">
      <h2>Private Railways</h2>
      <p>Private companies like Hankyu, Kintetsu, Keio, and Tokyu operate regional lines, often providing direct services to suburbs and tourist destinations.</p>
    </div>

    <div class="step">
      <h2>Map & Route Tools</h2>
      <ul>
        <li><a href="https://www.japan-guide.com/e/e2019.html" target="_blank">Japan Guide Train Info</a></li>
        <li><a href="https://www.navitime.co.jp/" target="_blank">NAVITIME Route Search</a></li>
      </ul>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/major_lines.js"></script>
</body>
</html>
