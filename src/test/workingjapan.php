<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Work in Japan</title>
  <link rel="stylesheet" href="./css/workingjapan.css">
</head>
<body>
  <header class="site-header">
    <div class="logo">JAPAN Life Manual</div>
    <nav class="main-nav">
      <a href="studenthome.php">StudentHome</a>
      <a href="lifeinjapan.php">Life in Japan</a>
      <a href="events.php">Events</a>
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
      <h1>Working in Japan</h1>
      <p>Explore your career path after graduation and how to prepare for job hunting in Japan.</p>
    </div>
  </section>

  <section class="topics-grid">
    <a href="job_hunting.php" class="topic-card">
      <h2>Job Hunting Process</h2>
      <p>Understand the job-hunting schedule, required documents, and how to prepare for interviews.</p>
    </a>
    <a href="visa_renewal.php" class="topic-card">
      <h2>Changing Visa Status</h2>
      <p>Learn how to switch from student visa to a work visa and what documents you need.</p>
    </a>
    <a href="japanese_language.php" class="topic-card">
      <h2>Japanese Language Skills</h2>
      <p>Discover how language proficiency impacts job opportunities and working environments.</p>
    </a>
    <a href="types_of_jobs.php" class="topic-card">
      <h2>Types of Jobs</h2>
      <p>Explore job options suitable for international students, from global companies to startups.</p>
    </a>
    <a href="job_search_support.php" class="topic-card">
      <h2>Job Search Support</h2>
      <p>Find support from career centers, job fairs, and online platforms to boost your chances.</p>
    </a>
    <a href="work_conditions.php" class="topic-card">
      <h2>Work Conditions</h2>
      <p>Learn about work hours, salaries, and employee rights under Japanese labor law.</p>
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
<script src="./js/workingjapan.js"></script>
</body>
</html>
