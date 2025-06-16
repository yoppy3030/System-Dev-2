<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Part-Time Jobs - Life in Japan</title>
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
  <h1>💼 Part-Time Jobs</h1>
  <p>Learn how to apply for work permits and find legal part-time job opportunities as a student in Japan.</p>

  <section class="steps">
    <div class="step">
      <h2>Apply for Work Permit (資格外活動許可)</h2>
      <p>International students must apply for a work permit at the immigration bureau or airport upon arrival. This permit allows up to 28 hours of work per week during the semester, and up to 40 hours during long vacations.</p>
    </div>

    <div class="step">
      <h2>Where to Find Part-Time Jobs</h2>
      <p>
        Common platforms include:
        <a href="https://baito.mynavi.jp/" target="_blank">Mynavi Baito</a>,
        <a href="https://townwork.net/" target="_blank">Townwork</a>,
        and
        <a href="https://www.gaijinpot.com/jobs/" target="_blank">GaijinPot Jobs</a> (English-friendly).
      </p>
    </div>

    <div class="step">
      <h2>Types of Jobs</h2>
      <p>Popular student jobs include convenience store staff, restaurant servers, English conversation tutors, and office assistants.</p>
    </div>

    <div class="step">
      <h2>Important Rules</h2>
      <ul>
        <li>Do not work in adult entertainment or gambling industries — it’s illegal for students.</li>
        <li>Always carry your residence card and permit when working.</li>
        <li>Follow the allowed work hours strictly to avoid penalties.</li>
      </ul>
    </div>

    <div class="step">
      <h2>Helpful Links</h2>
      <ul>
        <li><a href="https://www.isa.go.jp/en/applications/procedures/16-8.html" target="_blank">Immigration: Work Permit Info</a></li>
        <li><a href="https://jobs.gaijinpot.com/" target="_blank">GaijinPot Jobs</a></li>
      </ul>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/part_time_jobs.js"></script>
</body>
</html>
