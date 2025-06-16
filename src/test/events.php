<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title data-translate>Student Events in Japan</title>
  <link rel="stylesheet" href="./css/events.css" />
</head>
<body>
  <header class="site-header">
    <div class="logo" data-no-translate>JAPAN Life Manual</div>
    <nav class="main-nav">
      <a href="studenthome.php" data-translate>StudentHome</a>
      <a href="lifeinjapan.php" data-translate>Life in Japan</a>
      <a href="workingjapan.php" data-translate>Jobs & Careers</a>
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
      <h1 data-translate>Upcoming Student Events</h1>
      <p data-translate>Stay updated with student-focused events in Japan</p>
    </div>
  </section>

  <section class="event-list">
    <a href="https://comp.ecc.ac.jp/opencampus/" class="event-card">
      <h2 data-translate>ECC Open Campus Day</h2>
      <p>
        <span class="doc-item" data-translate>Date: Upcoming</span><br>
        <span class="doc-item" data-translate>Location: Osaka ECC College</span><br>
        <span class="doc-item" data-translate>Description: Explore the campus, meet faculty, and experience demo classes!</span>
      </p>
    </a>

    <a href="https://inter-jobfair.jp/" class="event-card">
      <h2>Tokyo International Student Job Fair</h2>
      <p>
        <span class="doc-item">Date: Upcoming</span><br>
        <span class="doc-item">Location: Tokyo Big Sight</span><br>
        <span class="doc-item">Description: Networking opportunity for students looking for part-time or full-time jobs.</span>
      </p>
    </a>

    <a href="https://en.japantravel.com/events/osaka?q=Osaka+City" class="event-card">
      <h2>Japanese Culture Day for Foreign Students</h2>
      <p>
        <span class="doc-item">Date: Upcoming</span><br>
        <span class="doc-item">Location: unknown</span><br>
        <span class="doc-item">Description: Experience tea ceremony, calligraphy, and yukata wearing.</span>
      </p>
    </a>
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
<script src="./js/events.js"></script>
</body>
</html>
