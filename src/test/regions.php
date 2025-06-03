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
            <ol>
                <h3><li>Kensai region</li></h3>
                <ul><li><h3>Nara</h3></li>
                        <h4>Don’t Tease or Harass the Deer</h4>
                            <p>Nara's deer are sacred and protected, but they can be aggressive if provoked. Do not pull their antlers, ride them, or offer food 
                            in a teasing manner. Respect their space to avoid bites or headbutts.</p>
            
                        <h4>Don’t Feed the Deer Unauthorized Food</h4>
                            <p>Only feed deer the official “shika senbei” crackers sold at stalls in Nara Park. Other snacks like bread, fruit,
                                 or chips can harm their health and are strictly discouraged.</p>
                                
                        <h4>Don’t Litter in the Park or Temple Areas</h4>
                            <p>Nara is very clean and environmentally conscious. Dispose of trash properly or take it with you if no bins are available. Littering not
                                 only spoils the beauty but can also harm the deer.</p>
                                
                        <h4> Don’t Touch or Damage Religious Sites</h4>
                            <p>Nara is home to many historical temples and shrines. Don’t touch statues, climb sacred areas, or behave loudly. Respect the spiritual 
                                atmosphere of places like Todai-ji and Kasuga Taisha.</p>
                    </ul>
               
            </ol>
        </div>
</body>
</html>