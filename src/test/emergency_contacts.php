<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Emergency Contacts - Life in Japan</title>
  <link rel="stylesheet" href="./css/navigations.css" />
</head>
<body>

<header class="site-header">
  <div class="logo">JAPAN Life Manual</div>
  <nav class="main-nav">
    <a href="studenthome.php">StudentHome</a>
    <a href="lifeinjapan.php">Back to Life in Japan</a>
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
  <h1>🚨 Emergency Contacts</h1>
  <p>Know the essential numbers and resources in case of emergencies while living in Japan.</p>

  <section class="steps">
    <div class="step">
      <h2>Police (110)</h2>
      <p>Call 110 for emergencies involving crime, accidents, or suspicious activity. English interpreters may be available, but speak clearly and slowly.</p>
    </div>

    <div class="step">
      <h2>Ambulance / Fire (119)</h2>
      <p>Call 119 for medical emergencies, fires, or rescue needs. When calling, say "ambulance" or "fire" to direct your request properly.</p>
    </div>

    <div class="step">
      <h2>24-hour Support Centers</h2>
      <p>
        Various organizations provide multilingual support:
        <ul>
          <li><a href="https://www.jnto.go.jp/emergency/eng/mi_guide.html" target="_blank">Japan Visitor Hotline (Japan National Tourism Organization)</a> - 050-3816-2787</li>
          <li><a href="https://www.tokyo-icc.jp/english/index.html" target="_blank">Tokyo Multilingual Support Center</a></li>
        </ul>
      </p>
    </div>

    <div class="step">
      <h2>Helpful Resources</h2>
      <ul>
        <li><a href="https://www.jnto.go.jp/emergency/eng/mi_guide.html" target="_blank">Japan Medical Service Guide</a></li>
        <li><a href="https://www.tokyo-icc.jp/english/index.html" target="_blank">Tokyo International Communication Committee</a></li>
      </ul>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/emergency_contacts.js"></script>

</body>
</html>
