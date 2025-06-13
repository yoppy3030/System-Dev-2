<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/region_for_all.css">
    <title>Life in Japan</title>
</head>
<body>
    <!-- ヘッダーセクション -->
    <header class="site-header">
        <div class="logo">JAPAN Life Manual</div>
        <nav class="main-nav">
            <a href="index.php">Home</a>
            <a href="./regions.php">Region</a>
            <a href="#">Transports</a>
            <a href="#">Food</a>
            <a href="#">Other</a>
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
        <!-- Sidebar -->
        <div class="sidebar" id="sidebar">
            <a href="#">友達を家に行く時</a>
            <a href="#">お店の中にいる時</a>
            <a href="#">道の中で歩いている時</a>
            <a href="#">公共施設にいる時</a>
            <a href="./login.php">Login</a>
        </div>

       
          <!-- サイドバーナビゲーション -->
        <div class="sidebar" id="sidebar">
            <a href="#">When visiting a friend's house</a>
            <a href="#">When in a store</a>
            <a href="#">When walking on the street</a>
            <a href="#">When in public facilities</a>
            <a href="./login.php">Login</a>
        </div>