<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>IC Cards - Navigation & Transportation</title>
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
  <h1>💳 IC Cards</h1>
  <p>Learn how to use IC cards like Suica and Pasmo for convenient travel across Japan’s rail and bus systems.</p>

  <section class="steps">
    <div class="step">
      <h2>1️⃣ What are IC Cards?</h2>
      <p>IC cards are rechargeable smart cards used for easy tap-and-go travel. Major types include Suica, Pasmo, ICOCA, and others, depending on region.</p>
    </div>

    <div class="step">
      <h2>2️⃣ Where to Get One?</h2>
      <p>You can purchase IC cards at train station ticket machines, JR offices, or convenience stores. Initial cost usually includes a refundable deposit (e.g., 500 yen).</p>
    </div>

    <div class="step">
      <h2>3️⃣ How to Use?</h2>
      <p>Simply tap your card at the ticket gates when entering and exiting stations. The correct fare will be deducted automatically.</p>
    </div>

    <div class="step">
      <h2>4️⃣ Where Else Can You Use Them?</h2>
      <p>IC cards are also accepted at convenience stores, vending machines, and some restaurants.</p>
    </div>

    <div class="step">
      <h2>🌐 Learn More / Buy Online</h2>
      <ul>
        <li><a href="https://www.jreast.co.jp/e/pass/suica.html" target="_blank">Suica (JR East official)</a></li>
        <li><a href="https://www.pasmo.co.jp/visitors/en/" target="_blank">Pasmo (official site)</a></li>
      </ul>
    </div>
  </section>
</main>

<footer class="footer">
  &copy; <?php echo date("Y"); ?> JAPAN Life Manual. All rights reserved.
</footer>
<script src="./js/ic_cards.js"></script>
</body>
</html>
