<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/index.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <title>Document</title>
</head>
<body>
  <header>
   <div class="dropdown-menu">
    <!-- Menu Bouton -->
    <button class="dropdown-btn" id="dropdown-btn">
        <i class="fas fa-bars"></i> Menu
    </button>
    
    <!-- mask content-->
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
     <a href=""><i class="fas fa-house icon"></i> <!-- Home -->
      <p>HOME</p></a> 
    </div>

    <div class="menu-item">
      <a href="studenthome.php">
          <i class="fas fa-user-graduate icon"></i> <!-- student -->
          <p>Student</p>
      </a>
    </div>

    <div class="menu-item">
      <a href="professional.php">
          <i class="fas fa-briefcase icon"></i> <!-- professionnal -->
          <p>Professional</p>
      </a>
    </div>

    <div class="menu-item">
      <a href="travelers_homePage.php">
          <i class="fa-solid fa-person-walking-luggage" style="font-size:25px;"></i> <!-- blog -->
          <p>Travellers</p>
      </a>
    </div>

    <div class="menu-item">
      <a href="">
          <i class="fas fa-user-plus icon"></i> <!-- inscription -->
          <p>Sign Up</p>
      </a>
    </div>

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
  </header>
<main>
    <div>
        <h1>DISCOVER JAPAN</h1>
    </div>
    
    <div>
      <p>Welcome to JAPAN Life Manual, your essential guide to navigating life in Japan with ease and peace of mind. 
      Explore our resources for a smooth and enriching integration.</p>
       <a href="#"> let's start</a>
    </div>
    <div>
     <img src="./img/ChatGPT Image 2025年5月26日 12_58_32.png" alt="">
     <img src="./img/2025年5月26日 13_17_57.png" alt="">
    </div>
    <div>
    <!----About Section -->
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
                <img src="./img/ChatGPT Image 2025年5月26日 14_01_39.png" alt="">
            </div>
    </div>
    <!--- Blog Section -->
    <div class="blog">
        <h3>Blog</h3>
        <div class="blog-post">
            <img src="./img/ChatGPT Image 2025年5月26日 15_06_32.png" alt="Blog Post Image">
            <div class="blog-content">
                <h4>Exploring the Beauty of Japan</h4>
                <p>Discover the rich culture, stunning landscapes, and vibrant cities of Japan. From ancient temples to modern skyscrapers, Japan offers a unique blend of tradition and innovation.</p>
                <a href="#">Read more</a>
            </div>
        </div>
    </div>
    <div class="services">
      <div class="product-container">
    <!-- image  -->
    <div class="product-image">
        <img src="./img/スクリーンショット 2025-05-26 132909.png" alt="Nom du produit">
    </div>

    <!-- product info -->
    <div class="product-info">
        <h1>NAME </h1>
        <p class="description">Description ecc computer college</p>
        
        <!-- Section Likes/Dislikes and Views -->
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
<script src="./js/index.js"></script>
</body>
</html>
