<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/regions.css">
    <title>Japan life Manual</title>
</head>
<body>
    <header class="site-header">
        <div class="logo">JAPAN Life Manual</div>
        <nav class="main-nav">
            <a class="with-underline" href="index.php">Home</a>
            <div class="dropdown">
            <a class="no-underline" href="#">Region</a>
            <div class="dropdown-content">
                    <a href="#">Hokkaido</a>
                    <a href="#">Tohoku</a>
                    <a href="#">Kanto</a>
                    <a href="#">Chubu</a>
                </div>
            </div>
            <a class="with-underline" href="#">Transports</a>
            <a class="with-underline" href="#">Food</a>
            <a class="with-underline" href="#">Other</a>
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
            <input type="text" class="search-box" placeholder="search"/>
        </nav>
    </header>
    <main>

                <!-- Menu Button -->
        <div class="menu-button" onclick="toggleSidebar()">
            <span></span>
            <span></span>
            <span></span>
        </div>
        
        <!-- サイドバーナビゲーション -->
        <div class="sidebar" id="sidebar">
            <a href="#">When visiting a friend's house</a>
            <a href="#">When in a store</a>
            <a href="#">When walking on the street</a>
            <a href="#">When in public facilities</a>
            <a href="./login.php">Login</a>
        </div>


        <div class="hero-img">
            <div class="hero-text">
                <p>Japan is a country known for its strong sense of etiquette, but what many people may not realize is that these social rules aren't always the same
                     everywhere. Each region—from Hokkaido in the north to Okinawa in the south—has its own unique customs, communication styles, and even unspoken expectations.
                    Understanding these differences not only helps us avoid misunderstandings, but also deepens our appreciation for Japan's rich and diverse culture.
                    Let's take a closer look at these regional variations in manners and rules.</p>
            </div>
            

        </div>

        
            <section class="submenu-grid">
            <a class="submenu-item" href="kansai.php">
                <strong>Kansai Region</strong><br>
                <small>Osaka,Kyoto,Nara,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Kento Region</strong><br>
                <small>Tokyo,Chiba,Saitama,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Tohoku Region</strong><br>
                <small>Iwate,Akita,Fukushima,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Chugoku Region</strong><br>
                <small>Tottori,Okayama,Hiroshima,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Chugoku Region</strong><br>
                <small>Tottori,Okayama,Hiroshima,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Chugoku Region</strong><br>
                <small>Tottori,Okayama,Hiroshima,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Shikoku Region</strong><br>
                <small>Tokushima,Kochi,Kagawa,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Chubu Region</strong><br>
                <small>Toyama,Fukui,Gifu,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Kyusyu & Okinawa Region</strong><br>
                <small>Okinawa,Fukuoka,Oita,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Hokkaido Region</strong><br>
                <small>Hokkaido</small>
            </a>
            </section>
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
    <script src="./js/regions.js"></script>
</html>
    