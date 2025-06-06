<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Visa Renewal - Study in Japan</title>
  <link rel="stylesheet" href="./css/visa_renewal.css" />
</head>
<body>
  <header class="site-header">
    <div class="logo">STUDY in JAPAN</div>
    <nav class="main-nav">
      <a href="index.php">Home</a>
      <a href="studenthome.php">StudentHome</a>
      <a href="lifeinjapan.php">Life in Japan</a>
      <a href="scholarships.php">Scholarships</a>
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
      <h1>Student Visa Renewal in Japan</h1>
      <p>Stay legally and continue your studies smoothly.</p>
    </div>
  </section>

  <section class="visa-steps">
    <h2>Steps to Renew Your Student Visa</h2>
    <div class="step-box">
      <h3>1. Prepare Your Documents</h3>
      <p>
        <span class="doc-item">- Application Form</span><br>
        <span class="doc-item">- Passport &amp; Residence Card</span><br>
        <span class="doc-item">- Certificate of Enrollment</span><br>
        <span class="doc-item">- Transcript of Records</span><br>
        <span class="doc-item">- Proof of Funds (bank balance, scholarship, etc.)</span>
      </p>
    </div>

    <div class="step-box">
      <h3>2. Visit Immigration Office</h3>
      <p>Apply 2–3 months before your current visa expires. Choose your nearest immigration bureau and submit the application in person.</p>
    </div>

    <div class="step-box">
      <h3>3. Receive Result</h3>
      <p>If approved, you will receive a new period of stay stamp on your residence card.</p>
    </div>

    <div class="step-box">
      <h3>4. Keep Copies & Notify School</h3>
      <p>Notify your university and keep records of your updated visa and documents for future use.</p>
    </div>
  </section>

  <section class="links-section">
    <h2>Useful Links</h2>
    <a href="https://www.moj.go.jp/isa/" target="_blank" class="btn">Immigration Services Agency (Japan)</a>
    <a href="https://www.studyinjapan.go.jp/en/planning/immigration-procedures/" target="_blank" class="btn">Visa Info @ Study in Japan</a>
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
<script src="./js/visa_renewal.js"></script>
</body>
</html>
