<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Health & Insurance - Life in Japan</title>
  <link rel="stylesheet" href="./css/navigations.css" />
</head>
<body>

<header class="site-header">
  <div class="logo">STUDY in JAPAN</div>
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
  <h1>🏥 Health & Insurance</h1>
  <p>Learn how to join Japan’s health insurance system, visit hospitals, and use translation support services.</p>

  <section class="steps">
    <div class="step">
      <h2>Join National Health Insurance</h2>
      <p>All residents, including international students, must enroll in the National Health Insurance (NHI) at their local city office. This covers about 70% of medical costs.</p>
    </div>

    <div class="step">
      <h2>Visiting Hospitals & Clinics</h2>
      <p>Bring your health insurance card when visiting medical facilities. Many hospitals have dedicated hours for first-time patients and may require appointments.</p>
    </div>

    <div class="step">
      <h2>Translation Support</h2>
      <p>In major cities, some hospitals offer multilingual support. You can also use services like the <a href="https://www.jnto.go.jp/emergency/eng/mi_guide.html" target="_blank">Japan Medical Service Guide</a> or translation apps for assistance.</p>
    </div>

    <div class="step">
      <h2>Helpful Links</h2>
      <ul>
        <li><a href="https://www.jnto.go.jp/emergency/eng/mi_guide.html" target="_blank">Japan Medical Service Guide</a></li>
        <li><a href="https://www.mhlw.go.jp/english/" target="_blank">Ministry of Health, Labour and Welfare</a></li>
      </ul>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/health_insurance.js"></script>

</body>
</html>
