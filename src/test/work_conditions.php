<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Work Conditions - Life in Japan</title>
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
  <h1>⚖️ Work Conditions</h1>
  <p>Learn about work hours, salaries, and employee rights under Japanese labor law to ensure a fair and safe working environment.</p>

  <section class="steps">
    <div class="step">
      <h2>Work Hours</h2>
      <p>The standard workweek in Japan is 40 hours (8 hours per day). Overtime work should be compensated according to labor regulations.</p>
    </div>

    <div class="step">
      <h2>Salaries</h2>
      <p>Entry-level salaries vary by industry, but many companies provide standard monthly salaries with additional bonuses (often twice a year). Minimum wage differs by region.</p>
    </div>

    <div class="step">
      <h2>Employee Rights</h2>
      <p>Employees are entitled to paid leave, social insurance, and a safe work environment. It's illegal for employers to discriminate or harass workers. You can seek help from labor consultation offices if issues arise.</p>
    </div>

    <div class="step">
      <h2>Helpful Links</h2>
      <ul>
        <li><a href="https://www.mhlw.go.jp/english/" target="_blank">Ministry of Health, Labour and Welfare (MHLW)</a></li>
        <li><a href="https://jsite.mhlw.go.jp/tokyo-foreigner/english.html" target="_blank">Tokyo Labor Bureau (English)</a></li>
      </ul>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/work_conditions.js"></script>
</body>
</html>
