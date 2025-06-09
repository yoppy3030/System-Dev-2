<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JLPT Levels - Study in Japan</title>
  <link rel="stylesheet" href="./css/studenthome.css">
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
      <h1>Japanese Language Proficiency Test (JLPT)</h1>
      <p>Choose your level and explore test details.</p>
    </div>
  </section>

  <section class="submenu-grid">
    <a class="submenu-item" href="https://www.jlpt.jp/sp/e/about/levelsummary.html">Overview</a>
    <a class="submenu-item" href="https://info.jees-jlpt.jp/other/2025%E5%9B%BD%E5%86%85%E8%A9%A6%E9%A8%93%E3%81%AE%E5%AE%9F%E6%96%BD%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6.html#">Test Schedule</a>
    <a class="submenu-item" href="https://www.jlpt.jp/sp/e/application/domestic_index.html">Registration Info</a>
    <a class="submenu-item" href="https://www.tofugu.com/japanese-learning-resources-database/">Study Resources</a>
  </section>

  <section class="jlpt-levels">
  <h2>Explore JLPT Levels</h2>
  <div class="jlpt-level-grid">
    <a href="https://www.jlpt.jp/e/samples/n5/index.html" target="_blank" class="jlpt-level-card">
      <h3>N5</h3>
      <p>Basic phrases & kanji for daily conversation</p>
    </a>
    <a href="https://www.jlpt.jp/e/samples/n4/index.html" target="_blank" class="jlpt-level-card">
      <h3>N4</h3>
      <p>Grammar and vocabulary for simple communication</p>
    </a>
    <a href="https://www.jlpt.jp/e/samples/n3/index.html" target="_blank" class="jlpt-level-card">
      <h3>N3</h3>
      <p>Intermediate Japanese for workplace & society</p>
    </a>
    <a href="https://www.jlpt.jp/e/samples/n2/index.html" target="_blank" class="jlpt-level-card">
      <h3>N2</h3>
      <p>Advanced reading, writing & listening fluency</p>
    </a>
    <a href="https://www.jlpt.jp/e/samples/n1/index.html" target="_blank" class="jlpt-level-card">
      <h3>N1</h3>
      <p>Native-level fluency and academic Japanese</p>
    </a>
  </div>
</section>

  <button class="back-to-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'});">↑</button>
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
<script src="./js/examination.js"></script>
</body>
</html>
