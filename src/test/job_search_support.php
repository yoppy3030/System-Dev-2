<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Job Search Support - Life in Japan</title>
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
  <h1>🔎 Job Search Support</h1>
  <p>Find support from career centers, job fairs, and online platforms to boost your chances of securing a job in Japan.</p>

  <section class="steps">
    <div class="step">
      <h2>Career Centers</h2>
      <p>Most universities have career centers that provide job listings, resume checks, interview practice, and consultation in Japanese or English.</p>
    </div>

    <div class="step">
      <h2>Job Fairs</h2>
      <p>Attend job fairs like <a href="https://www.careercross.com/en/jobfair" target="_blank">CareerCross Job Fairs</a> or <a href="https://www.disc.co.jp/en/" target="_blank">DISCO’s Career Forums</a>. These events connect you directly with hiring companies.</p>
    </div>

    <div class="step">
      <h2>Online Platforms</h2>
      <p>Use online job search sites:
        <ul>
          <li><a href="https://www.gaijinpot.com/jobs/" target="_blank">GaijinPot Jobs</a></li>
          <li><a href="https://job.japantimes.com/" target="_blank">Japan Times Jobs</a></li>
          <li><a href="https://www.careercross.com/en/" target="_blank">CareerCross</a></li>
        </ul>
      </p>
    </div>

    <div class="step">
      <h2>Helpful Links</h2>
      <ul>
        <li><a href="https://www.jasso.go.jp/en/study_j/job/index.html" target="_blank">JASSO: Job Hunting Guide</a></li>
        <li><a href="https://www.disc.co.jp/en/" target="_blank">DISCO Career Forum</a></li>
      </ul>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/job_search_support.js"></script>
</body>
</html>
