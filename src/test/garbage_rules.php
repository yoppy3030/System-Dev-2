<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Garbage Disposal Rules in Japan</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./css/garbage_styles.css">
</head>
<body>

  <header class="site-header">
    <div class="logo">JAPAN Life Manual</div>
    <div class="header-title">
        <h1>Garbage Disposal Rules in Japan</h1>
        <p>For Foreign Residents</p>
    </div>
    <nav class="main-nav">
      <a href="studenthome.php">StudentHome</a>
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
  <section class="card-style-section">
    <h2>🗑️ Garbage Categories</h2>

    <?php
    $categories = [
      [
        'title' => '1. Burnable Garbage (燃えるゴミ)',
        'items' => [
          '✔ Food waste, paper, cloth',
          '❌ Plastics with recycling marks'
        ]
      ],
      [
        'title' => '2. Non-Burnable Garbage (燃えないゴミ)',
        'items' => [
          '✔ Metal, glass, ceramics',
          '❌ Batteries (handled separately)'
        ]
      ],
      [
        'title' => '3. Recyclable Garbage (資源ごみ)',
        'items' => [
          '✔ PET bottles, cans, paper (cleaned & separated)',
          '✔ Tie newspapers and cardboard with string'
        ]
      ],
      [
        'title' => '4. Plastic Waste (プラスチックごみ)',
        'items' => [
          '✔ Marked with [プラ] symbol',
          '❌ Dirty plastic goes in burnable'
        ]
      ],
      [
        'title' => '5. Oversized Garbage (粗大ゴミ)',
        'items' => [
          '✔ Large items like furniture, bikes',
          '➤ Book pickup & pay fee at city office'
        ]
      ],
    ];

    foreach ($categories as $cat) {
      echo "<div class='card'>";
      echo "<h3>{$cat['title']}</h3><ul>";
      foreach ($cat['items'] as $item) {
        echo "<li>$item</li>";
      }
      echo "</ul></div>";
    }
    ?>
  </section>

  <section class="card-style-section">
    <h2>🧾 General Rules</h2>
    <ul>
        <li>Check your city's garbage schedule</li>
        <li>Use official trash bags from stores</li>
        <li> Clean bottles/cans before recycling</li>
        <li> Use the right disposal spot</li>
        <li> Dispose garbage at the right time</li>
    </ul>

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
  <script src="./js/garbage_rules.js"></script>
</body>
</html>
