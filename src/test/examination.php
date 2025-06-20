<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JLPT Levels - Study in Japan</title>
  <link rel="stylesheet" href="./css/examination.css">
  <link rel="stylesheet" href="./css/studenthome.css">
</head>
<body>
  <header class="site-header">
    <div class="logo" data-key="Japan life Manual">JAPAN Life Manual</div>
    <nav class="main-nav">
      <a href="studenthome.php" data-key="StudentHome">StudentHome</a>
      <div class="language-selector">
        <button id="translateBtn" class="translate-btn" data-key="🌐 Translate">🌐 Translate</button>
        <div class="language-dropdown">
            <button class="language-option" data-lang="ja">🇯🇵 日本語</button>
            <button class="language-option" data-lang="en">🇺🇸 English</button>
            <button class="language-option" data-lang="zh">🇨🇳 中文</button>
        </div>
      </div>
    </nav>
  </header>

  <section class="hero">
    <div class="hero-content">
      <h1 data-key="Japanese Language Proficiency Test (JLPT)">Japanese Language Proficiency Test (JLPT)</h1>
      <p data-key="Choose your level and explore test details.">Choose your level and explore test details.</p>
    </div>
  </section>

  <section class="submenu-grid">
    <a class="submenu-item" data-key="Overview" href="https://www.jlpt.jp/sp/e/about/levelsummary.html">Overview</a>
    <a class="submenu-item" data-key="Test Schedule" href="https://info.jees-jlpt.jp/other/2025%E5%9B%BD%E5%86%85%E8%A9%A6%E9%A8%93%E3%81%AE%E5%AE%9F%E6%96%BD%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6.html#">Test Schedule</a>
    <a class="submenu-item" data-key="Registration Info" href="https://www.jlpt.jp/sp/e/application/domestic_index.html">Registration Info</a>
    <a class="submenu-item" data-key="Study Resources" href="https://www.tofugu.com/japanese-learning-resources-database/">Study Resources</a>
  </section>

  <section class="jlpt-levels">
    <h2 data-key="Explore JLPT Levels">Explore JLPT Levels</h2>
    <div class="jlpt-level-grid">
        <div class="jlpt-level-card">
          <a href="https://www.jlpt.jp/e/samples/n5/index.html" target="_blank">
            <h3 data-key="N5">N5</h3>
            <p data-key="Basic phrases & kanji for daily conversation">Basic phrases & kanji for daily conversation</p>
          </a>
          <img class="jlpt-image" src="./img/N5.jpg" alt="N5 example image">
        </div>
        <div class="jlpt-level-card">
          <a href="https://www.jlpt.jp/e/samples/n4/index.html" target="_blank">
            <h3 data-key="N4">N4</h3>
            <p data-key="Grammar and vocabulary for simple communication">Grammar and vocabulary for simple communication</p>
          </a>
          <img class="jlpt-image" src="./img/N4.jpg" alt="N4 example image">
        </div>
        <div class="jlpt-level-card">
          <a href="https://www.jlpt.jp/e/samples/n3/index.html" target="_blank">
            <h3 data-key="N3">N3</h3>
            <p data-key="Intermediate Japanese for workplace & society">Intermediate Japanese for workplace & society</p>
          </a>
          <img class="jlpt-image" src="./img/N3.png" alt="N3 example image">
        </div>
        <div class="jlpt-level-card">
          <a href="https://www.jlpt.jp/e/samples/n2/index.html" target="_blank">
            <h3 data-key="N2">N2</h3>
            <p data-key="Advanced reading, writing & listening fluency">Advanced reading, writing & listening fluency</p>
          </a>
          <img class="jlpt-image" src="./img/N2.png" alt="N2 example image">
        </div>
        <div class="jlpt-level-card">
          <a href="https://www.jlpt.jp/e/samples/n1/index.html" target="_blank">
            <h3 data-key="N1">N1</h3>
            <p data-key="Native-level fluency and academic Japanese">Native-level fluency and academic Japanese</p>
          </a>
          <img class="jlpt-image" src="./img/N1.png" alt="N1 example image">
        </div>
      </div>
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

  <script>
  let translations = null;
  let translationsZh = null;

  document.addEventListener('DOMContentLoaded', () => {
    fetch('./js/translations/examination-ja.json')
      .then(res => res.json())
      .then(data => translations = data.translations);

    fetch('./js/translations/examination-zh.json')
      .then(res => res.json())
      .then(data => translationsZh = data.translations);

    document.querySelectorAll('.language-option').forEach(option => {
      option.addEventListener('click', () => {
        const lang = option.dataset.lang;
        translatePage(lang);
        document.querySelectorAll('.language-option').forEach(o => o.classList.remove('active'));
        option.classList.add('active');
        document.querySelector('.language-dropdown').classList.remove('show');
      });
    });

    document.getElementById('translateBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelector('.language-dropdown').classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.language-selector')) {
        document.querySelector('.language-dropdown').classList.remove('show');
      }
    });
  });

  function translatePage(lang) {
    let map = lang === 'ja' ? translations : (lang === 'zh' ? translationsZh : null);
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.dataset.key;
      if (map && map[key]) {
        el.innerText = map[key];
      } else {
        el.innerText = key;
      }
    });
  }
  </script>
</body>
</html>
