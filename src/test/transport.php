<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./css/transport.css">
  <title>Japan life Manual</title>
</head>

<body>
  <header class="site-header">
    <div class="logo">JAPAN Life Manual</div>
    <nav class="main-nav">
      <a class="with-underline" href="index.php">Home</a>
      <a class="no-underline" href="./regions.php">Region</a>
      <a class="with-underline" href="transport.php">Transports</a>
      <a class="with-underline" href="">Food</a>
      <a class="with-underline" href="">Other</a>
      <!-- 言語選択ドロップダウン -->
      <div class="language-selector">
        <button id="translateBtn" class="translate-btn">🌐 Translate</button>
        <div class="language-dropdown">
          <button class="language-option" data-lang="ja">🇯🇵 日本語</button>
          <button class="language-option" data-lang="en">🇺🇸 English</button>
          <button class="language-option" data-lang="zh">🇨🇳 中文</button>
        </div>
      </div>
      <!-- 検索ボックス -->
      <input type="text" class="search-box" placeholder="search" />
    </nav>

    <!-- Menu Button -->
    <div class="menu-button" onclick="toggleSidebar()">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <!-- サイドバーナビゲーション -->
    <div class="sidebar" id="sidebar">
      <a href="regions.php">Regions</a>
      <a href="travelers_homePage.php">Traveler HomePage</a>
      <a href="#">When walking on the street</a>
      <a href="#">When in public facilities</a>
      <a href="./login.php">Login</a>
    </div>
  </header>
  <main>
    <div class="hero-img">
      <div class="hero-text">
        <p>Japan’s transport system is modern, fast, and reliable. It includes high-speed trains like the Shinkansen, subways, buses, cars, motorcycles, airplanes, and ferries.
          In big cities, public transport is well-organized and easy to use. Each type of transport has its own rules and manners—for example, keeping quiet on trains, wearing seatbelts in cars,
          or following safety checks at airports. The system is known for its safety, punctuality, cleanliness, and advanced technology.You can look for details under there </p>
      </div>
    </div>

    <div class="container">
      <a class="card-link" href="#" data-type="train">
        <div class="card">
          <img src="./img/train_jpn.jpg" alt="Train">
          <div class="card-content">
            <h3>Trains</h3>
            <p>Shinkansen, Local Train...</p>
          </div>
        </div>
      </a>

      <a class="card-link" href="#" data-type="car">
        <div class="card">
          <img src="./img/car.jpg" alt="Car">
          <div class="card-content">
            <h3>Cars</h3>
            <p>Bus, Taxi, Rental Car...</p>
          </div>
        </div>
      </a>

      <a class="card-link" href="#" data-type="motorcycle">
        <div class="card">
          <img src="./img/motorcycle.jpg" alt="Motorcycle">
          <div class="card-content">
            <h3>Motor Cycles</h3>
            <p>50cc, Scooter, Electric...</p>
          </div>
        </div>
      </a>

      <a class="card-link" href="#" data-type="airplane">
        <div class="card">
          <img src="./img/airplane.jpg" alt="Plane">
          <div class="card-content">
            <h3>Airplanes</h3>
            <p>Domestic, International...</p>
          </div>
        </div>
      </a>

      <a class="card-link" href="#" data-type="boat">
        <div class="card">
          <img src="./img/boat.jpg" alt="Boat">
          <div class="card-content">
            <h3>Boats</h3>
            <p>Ferry, Water Bus, Yacht...</p>
          </div>
        </div>
      </a>
    </div>

  <div class ="rule-container">
    <div id = "rule-box">
    <!-- Rule content will be injected here -->
    </div>
  </div>

  </main>
</body>

<!-- フッターセクション -->
<footer>
  <div class="footer-content">
    <h2>Contact Us</h2>
    <p><a href="mailto:22200797@ecc.ac.jp">Email: 22200797@ecc.ac.jp</a></p>
    <p>Address: 1-2-61 Koraku, Bunkyo City, Tokyo 123-0006, Japan</p>
    <p>Phone: +81 3-1234-5678</p>
    <!-- ソーシャルメディアリンク -->
    <div class="social-icons">
      <a href="#"><i class="fab fa-facebook"></i></a>
      <a href="#"><i class="fab fa-twitter"></i></a>
      <a href="#"><i class="fab fa-instagram"></i></a>
      <a href="#"><i class="fab fa-linkedin"></i></a>
    </div>
    <h2>Japan life Manual</h2>
    <p>&copy; 2025 JAPAN Life Manual. All rights reserved.</p>
  </div>
</footer>
<script src="./js/transports.js"></script>

</html>