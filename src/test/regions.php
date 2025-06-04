<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/regions.css">
    <title>Japan life Manual</title>
</head>
<body>
    <header>
        <h1>JAPAN Life Manual</h1>
        <div class="navbar">
            <nav class="nav-links">
                <a href="index.php">Home</a>
                <div class="dropdown">
                <a class="#">Region</a>
                <div class="dropdown-content">
                    <a href="#">Hokkaido</a>
                    <a href="#">Tohoku</a>
                    <a href="#">Kanto</a>
                    <a href="#">Chubu</a>
                </div>
                </div>
                <a class="#">Transports</a>
                <a class="#">Food</a>
                <a class="#">Other</a>
            </nav>
             <input type="text" class="search-box" placeholder="search"/>
        </div>
        
    </header>
    <main>

                <!-- Menu Button -->
        <div class="menu-button" onclick="toggleSidebar()">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <!-- Sidebar -->
        <div class="sidebar" id="sidebar">
            <a href="#">友達を家に行く時</a>
            <a href="#">お店の中にいる時</a>
            <a href="#">道の中で歩いている時</a>
            <a href="#">公共施設にいる時</a>
            <a href="./login.php">Login</a>
        </div>


        <div class="hero-img">
            <div class="hero-text">
                <p>Japan is a country known for its strong sense of etiquette, but what many people may not realize is that these social rules aren't always the same
                     everywhere. Each region—from Hokkaido in the north to Okinawa in the south—has its own unique customs, communication styles, and even unspoken expectations.
                    Understanding these differences not only helps us avoid misunderstandings, but also deepens our appreciation for Japan’s rich and diverse culture.
                    Let’s take a closer look at these regional variations in manners and rules.</p>
            </div>
            

        </div>
        <div>
             <section class="submenu-grid">
            <a class="submenu-item" href="#">
                <strong>Kensai Region</strong><br>
                <small>Osaka,Kyoto,Nara,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Kento Region</strong><br>
                <small>Tokyo,Chiba,Saitama,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Tohoku Region</strong><br>
                <small>Iwate,Akita,Miyagi,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Chugoku Region</strong><br>
                <small>Tottori,Okayama,Hiroshima,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Shikoku Region</strong><br>
                <small>Tokushima,Ehime,Koichi,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Chubu Region</strong><br>
                <small>Toyama,Gifu,Aichi,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Hokkaido</strong><br>
                <small>Toyama,Gifu,Aichi,etc</small>
            </a>
            <a class="submenu-item" href="#">
                <strong>Kyusyu & Okinawa</strong><br>
                <small>Oita,Okinawa,Fukuoka,etc</small>
            </a>
             </section>
        </div>
        
        
</html>