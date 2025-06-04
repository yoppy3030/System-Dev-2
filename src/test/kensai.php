<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/travelers_homePage.css">
    <title>Life in Japan</title>
</head>
<body>
    <header>
        <h1>JAPAN Life Manual</h1>
        <div class="navbar">
            <nav class="nav-links">
                <a href="index.php">Home</a>
                
                <a class="#">Region</a>
                <!-- <div class="dropdown-content">
                    <a href="#">Hokkaido</a>
                    <a href="#">Tohoku</a>
                    <a href="#">Kanto</a>
                    <a href="#">Chubu</a>
                </div> -->
                
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

       
          <!-- サイドバーナビゲーション -->
        <div class="sidebar" id="sidebar">
            <a href="#">When visiting a friend's house</a>
            <a href="#">When in a store</a>
            <a href="#">When walking on the street</a>
            <a href="#">When in public facilities</a>
            <a href="./login.php">Login</a>
        </div>
         <!-- Main Content -->
         <h1>Introduction to the Kansai Region</h1>
         <img src="./img/kensai.jpg" alt="Kansai Region" class="kansai-image">
         <p><sThe Kansai Region, also known as Kinki, is one of Japan’s most historically and culturally significant areas. Located in the 
            southern-central part of Honshu, Kansai is home to ancient capitals like Kyoto and Nara, the vibrant city of Osaka, and the 
             international port of Kobe. Rich in tradition, cuisine, and architecture, Kansai offers a unique blend of old and new Japan, 
             making it a must-visit for anyone seeking to experience the heart of Japanese culture.</p><br>

            

             <ol>
                <h2><li>Nara</li></h2>
                <ul>
                        <h3><li>Don’t Tease or Harass the Deer</li></h3>
                            <p>Nara's deer are sacred and protected, but they can be aggressive if provoked. Do not pull their antlers, ride them, or offer food 
                            in a teasing manner. Respect their space to avoid bites or headbutts.</p>
            
                        <h3><li>Don’t Feed the Deer Unauthorized Food</li></h3>
                            <p>Only feed deer the official “shika senbei” crackers sold at stalls in Nara Park. Other snacks like bread, fruit,
                                 or chips can harm their health and are strictly discouraged.</p>
                                
                        <h3><li>Don’t Litter in the Park or Temple Areas</li></h3>
                            <p>Nara is very clean and environmentally conscious. Dispose of trash properly or take it with you if no bins are available. Littering not
                                 only spoils the beauty but can also harm the deer.</p>
                                
                       <h3> <li> Don’t Touch or Damage Religious Sites</li></h3>
                            <p>Nara is home to many historical temples and shrines. Don’t touch statues, climb sacred areas, or behave loudly. Respect the spiritual 
                                atmosphere of places like Todai-ji and Kasuga Taisha.</p>
                    </ul>
                    
                <h2><li>Osaka</li></h2>
                    <ul>
                        <h3><li>Don’t Block the Escalator</li></h3>
                        <p>In Osaka, people stand on the right side of the escalator, leaving the left side open for walking. Blocking both sides is considered rude and disrupts flow in busy stations.</p>
                    
                        <h3><li>Don’t Make Loud Phone Calls on Trains</li></h3>
                        <p>Even though Osaka locals are friendly and casual, talking on the phone inside trains is frowned upon. Keep phones on silent mode and avoid long or loud calls in public transport.</p>
                    
                        <h3><li>Don’t Litter in Public Areas</li></h3>
                        <p>Areas like Dotonbori and Namba are very clean despite the crowds. Dispose of trash properly, or take it with you if you can’t find a bin.</p>
                    
                        <h3><li>Don’t Mock the Kansai Dialect</li></h3>
                        <p>Osaka people proudly speak Kansai-ben, which is cheerful and unique. Don’t imitate it in a mocking way—respect the local language and culture.</p>
                    
                        <h3><li>Don’t Ignore Local Manners in Temples and Shrines</li></h3>
                        <p>Even in a lively city like Osaka, temples like Shitenno-ji require quiet and respectful behavior. Don’t shout, take selfies during rituals, or touch sacred objects.</p>
                    </ul>   
            </ol>
            
</body>
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
</html>