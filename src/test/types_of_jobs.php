<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Types of Jobs - Life in Japan</title>
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
  <h1>💼 Types of Jobs</h1>
  <p>Explore job options suitable for international students, from global companies to startups in Japan.</p>

  <section class="steps">
    <div class="step">
      <h2>Global Companies</h2>
      <p>Large multinational firms often seek bilingual employees for roles in IT, finance, engineering, and business development. These companies may offer English-speaking environments or support for Japanese learning.</p>
    </div>

    <div class="step">
      <h2>Japanese Companies</h2>
      <p>Many traditional firms hire international students with strong Japanese skills (usually JLPT N2 or higher). Common sectors include manufacturing, retail, and services.</p>
    </div>

    <div class="step">
      <h2>Startups</h2>
      <p>Japan’s startup ecosystem is growing, offering opportunities in tech, design, and business development. Startups often value flexibility, creativity, and English communication skills.</p>
    </div>

    <div class="step">
      <h2>Part-Time & Internship Jobs</h2>
      <p>While studying, students can work part-time or take internships to gain experience. Common roles include language teaching, retail, hospitality, or research assistantships.</p>
    </div>

    <div class="step">
      <h2>Helpful Links</h2>
      <ul>
        <li><a href="https://www.gaijinpot.com/jobs/" target="_blank">GaijinPot Jobs</a></li>
        <li><a href="https://job.japantimes.com/" target="_blank">Japan Times Jobs</a></li>
        <li><a href="https://www.jasso.go.jp/en/ryugaku/after_study_j/job/guide.html" target="_blank">JASSO: Job Hunting in Japan</a></li>
      </ul>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/types_of_jobs.js"></script>
</body>
</html>
