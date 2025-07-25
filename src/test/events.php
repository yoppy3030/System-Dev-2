<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title data-translate>Student Events in Japan</title>
  <link rel="stylesheet" href="./css/events.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body>
  <header class="site-header">
    <div class="logo" data-no-translate>JAPAN Life Manual</div>
    <nav class="main-nav">
      <a href="studenthome.php" data-translate>StudentHome</a>
      <a href="lifeinjapan.php" data-translate>Life in Japan</a>
      <a href="workingjapan.php" data-translate>Jobs & Careers</a>
      <div class="language-selector">
          <button id="translateBtn" class="translate-btn">🌐 Translate</button>
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
      <h1 data-translate="Upcoming Student Events">Upcoming Student Events And Other Events</h1>
      <p data-translate="Stay updated with student-focused events in Japan">Stay updated with student-focused events and other events in Japan</p>
    </div>
  </section>

  <main class="container">
    <section class="event-category-section">
      <h2 class="category-title" data-translate>Student-Focused Events</h2>
      <div id="student-event-list" class="event-grid">
        </div>
    </section>

    <section class="event-category-section">
      <h2 class="category-title" data-translate>Festivals & Community Events</h2>
      <div id="other-event-list" class="event-grid">
        </div>
    </section>
  </main>

  <footer style="background-color: #b71c1c; color: white; padding: 3rem 0; text-align: center;">
    <h2>Contact Us</h2>
    <p>Email: 22200797@ecc.ac.jp</p>
    <p>Address: 1-2-61 Koraku, Bunkyo City, Tokyo 123-0006, Japan</p>
    <p>Phone: +81 3-1234-5678</p>
    <h2>Japan life Manual</h2>
    <p>&copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.</p>
  </footer>

<script src="./js/events.js"></script>
</body>
</html>