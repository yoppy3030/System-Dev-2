<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>How to Ride - Navigation & Transportation</title>
  <link rel="stylesheet" href="./css/navigations.css" />
</head>
<body>

<header class="site-header">
  <div class="logo">JAPAN Life Manual</div>
  <nav class="main-nav">
    <a href="studenthome.php">StudentHome</a>
    <a href="navigations.php">Back to Navigation</a>
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
  <h1>🚉 How to Ride</h1>
  <p>Riding trains in Japan is simple and efficient. Here’s what you need to do:</p>

  <section class="steps">
    <div class="step">
      <h2>1️⃣ Get a Ticket or IC Card</h2>
      <p>Purchase a paper ticket at a machine, or use an IC card (e.g., Suica, Pasmo). IC cards are reusable and convenient.</p>
    </div>
    <div class="step">
      <h2>2️⃣ Tap In</h2>
      <p>At the station entrance, tap your IC card on the gate reader. For paper tickets, insert the ticket into the gate.</p>
    </div>
    <div class="step">
      <h2>3️⃣ Transfer if Needed</h2>
      <p>Follow signs for platform changes or line transfers. Transfers between companies (JR, Metro, etc.) may require exiting and re-entering gates.</p>
    </div>
    <div class="step">
      <h2>4️⃣ Tap Out</h2>
      <p>At your destination, tap your IC card again to pay. Paper tickets will be collected by the exit gate.</p>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/how_to_ride.js"></script>
</body>
</html>
