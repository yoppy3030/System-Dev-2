<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Japan life Manual</title>
  
  <link rel="stylesheet" href="./css/index.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
  <!-- ChatBOTのCSSを読み込み -->
  <link rel="stylesheet" href="./chatBOT/css/ChatBOT.css">
</head>
<body>
  <header>
   <div class="dropdown-menu">
    <button class="dropdown-btn" id="dropdown-btn">
        <i class="fas fa-bars"></i> Menu
    </button>
    <div class="dropdown-content" id="dropdown-content">
        <a href="User_page.php">My page</a>
        <a href="#">contact</a>
        <a href="#">Blog</a>
    </div>
</div>
   
  <div class="logo">
    <i class="fas fa-book icon"></i>
    <h3>Japan life Manual</h3>
  </div>

    <div class="menu-item">
     <a href=""><i class="fas fa-house icon"></i><p>HOME</p></a> 
    </div>
    <div class="menu-item">
      <a href="studenthome.php"><i class="fas fa-user-graduate icon"></i><p>Student</p></a>
    </div>
    <div class="menu-item">
      <a href="professional.php"><i class="fas fa-briefcase icon"></i><p>Professional</p></a>
    </div>
    <div class="menu-item">
      <a href="travelers_homePage.php"><i class="fa-solid fa-person-walking-luggage" style="font-size:25px;"></i><p>Travellers</p></a>
    </div>
    <div class="menu-item">
      <a href="register.php"><i class="fas fa-user-plus icon"></i><p>Sign Up</p></a>
    </div>
    <div class="language-selector">
        <button id="translateBtn" class="translate-btn">🌐 Translate</button>
        <div class="language-dropdown">
            <button class="language-option" data-lang="ja">🇯🇵 日本語</button>
            <button class="language-option" data-lang="en">🇺🇸 English</button>
            <button class="language-option" data-lang="zh">🇨🇳 中文</button>
        </div>
    </div>
  </header>
<main>
    <div class="weather-main-display">
        <div id="weather-widget">
            <div class="weather-content">
                <img id="weather-icon" src="" alt="Weather" class="weather-icon">
                <div class="weather-text">
                    <span id="weather-city">Loading...</span>
                    <span id="weather-temp">--°C</span>
                </div>
            </div>
        </div>
    </div>

    <div id="weather-alert" class="weather-alert" style="display:none;">
        <span id="alert-message"></span>
        <button id="alert-close" class="alert-close">&times;</button>
    </div>

    <div class="hero-section">
        <div class="hero-title">
            <h1>DISCOVER JAPAN</h1>
        </div>
        <div class="hero-description">
            <p>Welcome to JAPAN Life Manual, your essential guide to navigating life in Japan with ease and peace of mind. 
            Explore our resources for a smooth and enriching integration.</p>
            <a href="#"> let's start</a>
            <input type="hidden" id="user-activity" value="<?php echo htmlspecialchars($userActivity ?? ''); ?>">
        </div>
    </div>
    <div class="image-gallery">
        <img src="./img/ChatGPT Image 2025年5月26日 12_58_32.png" alt="日本の風景1">
        <img src="./img/2025年5月26日 13_17_57.png" alt="日本の風景2">
    </div>
    <div class="about-section">
        <h3>ABOUT</h3>
        <div>
            <div>
                <div>
                    <p>concert of music around your city</p>
                    <p>2025/ 05/ 26</p>
                </div>
                <div>
                    <p>Tokyo Dome 1-chome 2-61 koraku bunkyo city,Tokyo 123-0006, Japan</p>
                </div>
            </div>
            <img src="./img/ChatGPT Image 2025年5月26日 14_01_39.png" alt="コンサートのイメージ">
        </div>
    </div>
    <div class="blog">
        <h3>Blog</h3>
        <div class="blog-post">
            <img src="./img/ChatGPT Image 2025年5月26日 15_06_32.png" alt="ブログ投稿の画像">
            <div class="blog-content">
                <h4>Exploring the Beauty of Japan</h4>
                <p>Discover the rich culture, stunning landscapes, and vibrant cities of Japan. From ancient temples to modern skyscrapers, Japan offers a unique blend of tradition and innovation.</p>
                <a href="#">Read more</a>
            </div>
        </div>
    </div>
    <div class="services">
        <div class="product-container">
            <div class="product-image">
                <img src="./img/スクリーンショット 2025-05-26 132909.png" alt="製品名">
            </div>
            <div class="product-info">
                <h1>NAME </h1>
                <p class="description">Description ecc computer college</p>
                <div class="interaction-section">
                    <div class="like-dislike">
                        <button id="like-btn" class="like-btn"><i class="fas fa-thumbs-up"></i><span id="like-count">0</span></button>
                        <button id="dislike-btn" class="dislike-btn"><i class="fas fa-thumbs-down"></i><span id="dislike-count">0</span></button>
                    </div>
                    <div class="views">
                       <i class="fas fa-eye"></i><span id="view-count">0</span> vues
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<footer>
  <div class="footer-content">
    <h2>Contact Us</h2>
    <p><a href="mailto:22200797@ecc.ac.jp">Email: 22200797@ecc.ac.jp</a></p>
    <p>Address: 1-2-61 Koraku, Bunkyo City, Tokyo 123-0006, Japan</p>
    <p>Phone: +81 3-1234-5678</p>
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

<!-- Chatbot Modal -->
<div id="chatbot-modal" class="chatbot-font bg-white rounded-2xl shadow-2xl flex flex-col">
    <!-- ★★★ Animation Container Added Here ★★★ -->
    <div id="chatbot-animation-container"></div>
    
    <header class="bg-sky-600 text-white p-4 rounded-t-2xl shadow-md flex justify-between items-center">
        <div>
            <h1 id="header-title" class="text-2xl font-bold">AIマナー学習ボット</h1>
            <p id="header-lang-status" class="text-sm opacity-90">言語: 日本語</p>
        </div>
        <div class="flex items-center">
            <div class="cb-theme-dropdown">
                <button id="cb-theme-btn" class="cb-theme-btn">
                    <i class="fas fa-palette"></i>
                </button>
                <div id="cb-theme-content" class="cb-theme-dropdown-content">
                    <!-- ★★★ 変更点: 「シンプル」テーマを追加 ★★★ -->
                    <a class="cb-theme-option" data-theme="simple">
                        <i class="fas fa-square fa-fw"></i> <span>シンプル (Simple)</span>
                    </a>
                    <a class="cb-theme-option" data-theme="spring">
                        <i class="fas fa-leaf fa-fw"></i> <span>春 (Spring)</span>
                    </a>
                    <a class="cb-theme-option" data-theme="summer">
                        <i class="fas fa-sun fa-fw"></i> <span>夏 (Summer)</span>
                    </a>
                    <a class="cb-theme-option" data-theme="autumn">
                        <i class="fas fa-fan fa-fw"></i> <span>秋 (Autumn)</span>
                    </a>
                    <a class="cb-theme-option" data-theme="winter">
                        <i class="fas fa-snowflake fa-fw"></i> <span>冬 (Winter)</span>
                    </a>
                </div>
            </div>
            <div id="language-switcher" class="flex space-x-1 sm:space-x-2">
                <button data-lang="ja" class="ja-btn lang-switch-btn bg-white text-sky-600 font-bold py-1 px-3 rounded-full text-sm shadow-sm transition-transform transform scale-110 ring-2 ring-white">日本語</button>
                <button data-lang="en" class="en-btn lang-switch-btn bg-sky-500 hover:bg-white hover:text-sky-600 font-bold py-1 px-3 rounded-full text-sm shadow-sm transition-transform transform hover:scale-110">EN</button>
                <button data-lang="zh" class="zh-btn lang-switch-btn bg-sky-500 hover:bg-white hover:text-sky-600 font-bold py-1 px-3 rounded-full text-sm shadow-sm transition-transform transform hover:scale-110">中文</button>
            </div>
        </div>
    </header>
    <main id="chat-window" class="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50"></main>
    <footer class="p-4 bg-white border-t border-gray-200 rounded-b-2xl mt-8">
        <div class="flex items-center space-x-3">
            <input type="text" id="user-input" class="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-500 transition" placeholder="日本のマナーについて質問してください">
            <button id="send-btn" class="bg-sky-600 text-white rounded-full p-3 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-transform transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
            </button>
        </div>
    </footer>
</div>

<div id="chat-open-button">
    <i class="far fa-comments"></i>
</div>

<script src="./js/index.js"></script>
<script src="./chatBOT/js/knowledge.js"></script>
<script src="./chatBOT/js/main.js"></script>

</body>
</html>
