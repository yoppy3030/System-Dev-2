<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Japanese Language Skills - Life in Japan</title>
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
  <h1>🈶 Japanese Language Skills</h1>
  <p>Discover how Japanese language proficiency impacts job opportunities and working environments in Japan.</p>

  <section class="steps">
    <div class="step">
      <h2>Why Language Skills Matter</h2>
      <p>Most jobs in Japan require at least conversational Japanese. Strong language skills improve your chances of finding better jobs, understanding workplace culture, and communicating with colleagues.</p>
    </div>

    <div class="step">
      <h2>Language Requirements by Job Type</h2>
      <ul>
        <li>💼 Office work: JLPT N2 or higher often required</li>
        <li>🛍️ Service jobs: JLPT N3 or conversational level</li>
        <li>🛠️ Technical jobs: Requirements vary; basic communication needed</li>
      </ul>
    </div>

    <div class="step">
      <h2>Improving Your Skills</h2>
      <p>Join language schools, attend conversation cafes, or use apps like Duolingo, Tandem, or HelloTalk to practice daily.</p>
    </div>

    <div class="step">
      <h2>Helpful Links</h2>
      <ul>
        <li><a href="https://www.jlpt.jp/e/" target="_blank">Official JLPT Website</a></li>
        <li><a href="https://www.jasso.go.jp/en/study_j/sgtj.html" target="_blank">JASSO: Study Japanese</a></li>
      </ul>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/japanese_language.js"></script>
</body>
</html>
