<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./style/travelers_homePage.css">
    <title>JAPAN Life Manual</title>
</head>
<body>
    <header>
        <h1>JAPAN Life Manual</h1>
        <div class="navbar">
  <ul class="menu">
    <li class="dropdown">
      <a href="#">Region(地方)</a>
      <ul class="dropdown-content">
        <li><a href="#">Hokkaido</a></li>
        <li><a href="#">Tohoku</a></li>
        <li><a href="#">Kanto</a></li>
        <li><a href="#">Chubu</a></li>
        <li><a href="#">Kansai</a></li>
        <li><a href="#">Chugoku</a></li>
        <li><a href="#">Shikoku</a></li>
        <li><a href="#">Kyushu</a></li>
        <li><a href="#">Okinawa</a></li>
      </ul>
    </li>
    <li><a href="#">Transports(輸送)</a></li>
    <li><a href="#">Food(食事)</a></li>
    <li><a href="#">Other(その他)</a></li>
  </ul>
</div>

             <input type="text" class="search-box" placeholder="search"/>
        </div>
        <div class="regions">
  <div class="region">
    <img src="hokkaido-map.png" alt="Hokkaido">
    <div class="region-name">Hokkaido</div>
  </div>
  <div class="region">
    <img src="tohoku-map.png" alt="Tohoku">
    <div class="region-name">Tohoku</div>
  </div>
  <div class="region">
    <img src="kanto-map.png" alt="Kanto">
    <div class="region-name">Kanto</div>
  </div>
  <div class="region">
    <img src="kansai-map.png" alt="Kansai">
    <div class="region-name">Kansai</div>
  </div>
  <!-- Add more if needed -->
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
        <h1>Most Trending Rules In Japan</h1>

        <!--slideshow-->
        <div class="slideshow">
            <img src="./image/springs.jpg" class="slide active">
            <img src="./image/Inari-Shrine-Path.jpg" class="slide">
            <img src="./image/namba.jpg" class="slide">
        </div>
        <h2>Do's And Don'ts In Japan- Things You Should Knows Before Going To Japan</h2>
        <ol>
            <h3><li>Don't Eat While Walking</li></h3>

                <p>In Japan, you won't see people eating on the streets, as eating while walking is seen as impolite.
                    Whether it's delicious takoyaki or matcha ice cream, finish your snacks at a stall or find a quiet spot.
                    If you take your foods with you, there are no public trash bins on the streets, so littering will be a problem.</p><br>

            <h3><li>Don't Talk on Your Phone on Trains, or in Cafés</li></h3>

                <p>Japanese trains and subways are quiet places. Avoid talking on your phone when on a train.
                    On some trains, there are even signs indicating travelers should set their phones to silent mode.
                    If you need to answer a phone call, tell the people that you are on a train and will call back soon. Then, end the call quickly.</p><br>

            <h3><li>Don't Wear Clothes While Soaking in Hot Springs</li></h3>

                    <p>You are now allowed to wear bathing suits when soaking in Japanese onsens. You need to take off all your clothes and wash thoroughly 
                         before entering the baths. If you are too shy to follow this practice, book a private session. Many hotels have rooms with private hot springs,
                         but the prices are very high and they are often very hard to book.</p><br>

           <h3> <li>Don't Take Photos of Strangers</li></h3>

            <p>People don't like to be photographed without their permission. Never point your camera at others, even at grandmothers in rural market areas. 
                If you'd like to take photos of someone, ask them first, or have your guide to ask them.</p><br>

            <h3><li>Don't Forget to Take Off Your Shoes When Going Indoors</li></h3>

            <p>Tourists visiting Japan need to be aware that wearing shoes inside certain places is something you should never do in Japan. Wearing outdoor shoes is deemed unhygienic by the Japanese so you will be expected to remove your shoes immediately when entering a Japanese home, 
                schools, hospitals and certain restaurants and temples.</p><br>

             <p>Don’t worry though, slippers are always provided. When you enter a building and you see a line of shoes at the entrance, then you know that you will be expected to remove your own.</p><br>
                For tourists, you will most likely notice this at a traditional ryokan, at Japanese restaurants and of course inside shrines and temples. Also, another important rule to note is that you will be expected to exchange your slippers for ‘toilet slippers’ if you visit the loo. You’ll see them at the bathroom door so you can’t miss them 
                don’t forget to change back when you’re finished though!</p><br>

            <h3><li>Don’t Leave A Tip In Japan</li></h3>

                  <p>Unlike many other countries around the world, tipping is simply not the done thing in Japan. It’s not rude as such but it is definitely not expected. 
                    And don’t be surprised if you find a waiter/waitress chasing after you if you do leave money on the table
                    It’s completely normal to feel uncomfortable with this concept if you come from a country where tipping is prevalent.</p> 

                    <p>Simply try to keep in mind that it is just not expected and trying to tip will only lead to confusion.
                    However, there is one exception  if you take a tour during your time in Japan, it is always acceptable (but again not expected) to give your tour guide a small tip.
                    Make sure to wrap and fold the tip in paper and politely hand it to your guide using both hands.</p><br>

            <h3><li>Wash your entire body before entering the hot springs. </li></h3>

                    <p>There will be a shower area with individual faucets with small stools where one can sit and scrub themselves down. After thoroughly showering and rinsing yourself off,
                         rinse down your washing area, including the stool you sat on! Body soap and shampoo are also provided, but you can bring your own if you wish. </p><br>
        </ol>

  
    </main>
    <footer></footer>
    <script src="./scripts/travelers_homePage.js"></script>
</body>
</html>