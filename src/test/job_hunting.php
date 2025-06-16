<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Job Hunting Process - Life in Japan</title>
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
  <h1>📝 Job Hunting Process</h1>
  <p>Understand the job-hunting schedule, required documents, and how to prepare for interviews in Japan.</p>

  <section class="steps">
    <div class="step">
      <h2>Job-Hunting Schedule</h2>
      <p>Job hunting (就職活動) typically begins in the third year of university (or one year before graduation). Companies announce openings, hold seminars, and begin screening candidates from March onward.</p>
    </div>

    <div class="step">
      <h2>Required Documents</h2>
      <p>Prepare essential documents:
        <ul>
          <li><strong>履歴書 (rirekisho):</strong> Japanese-style resume</li>
          <li><strong>自己PR:</strong> Self-promotion statement</li>
          <li><strong>成績証明書:</strong> Academic transcript</li>
          <li><strong>推薦状:</strong> (if applicable) Letter of recommendation</li>
        </ul>
      </p>
    </div>

    <div class="step">
      <h2>Interview Preparation</h2>
      <p>Practice answering common questions, review company information, and prepare appropriate attire (typically dark suit, white shirt).</p>
    </div>

    <div class="step">
      <h2>Helpful Links</h2>
      <ul>
        <li><a href="https://www.jasso.go.jp/en/study_j/job/index.html" target="_blank">JASSO: Job Hunting Guide</a></li>
        <li><a href="https://www.gaijinpot.com/job-hunting-in-japan/" target="_blank">GaijinPot: Job Hunting Tips</a></li>
      </ul>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/job_hunting.js"></script>
</body>
</html>