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
            <a class="with-underline" href="index.php">Home</a>
            <a class="no-underline" href="./regions.php">Region</a>
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
        
        <!-- Sidebar
        <div class="sidebar" id="sidebar">
            <a href="#">友達を家に行く時</a>
            <a href="#">お店の中にいる時</a>
            <a href="#">道の中で歩いている時</a>
            <a href="#">公共施設にいる時</a>
            <a href="./login.php">Login</a>
        </div> -->

       
          <!-- サイドバーナビゲーション -->
        <div class="sidebar" id="sidebar">
            <a href="regions.php">Regions</a>
            <a href="#">When in a store</a>
            <a href="#">When walking on the street</a>
            <a href="#">When in public facilities</a>
            <a href="./login.php">Login</a>
        </div>
         <!-- Main Content -->
         <h1>Introduction to the Kansai Region</h1>
         <img src="./img/kensai.jpg" alt="Kansai Region" class="kansai-image">
         <p>The Kansai Region, also known as Kinki, is one of Japan's most historically and culturally significant areas. Located in the 
            southern-central part of Honshu, Kansai is home to ancient capitals like Kyoto and Nara, the vibrant city of Osaka, and the 
             international port of Kobe. Rich in tradition, cuisine, and architecture, Kansai offers a unique blend of old and new Japan, 
             making it a must-visit for anyone seeking to experience the heart of Japanese culture.</p><br>

            

             <ol>
                
                <h2>Kensai region</h2>
                    <h2>1. Nara</h2>
                    <ul class="rules-list">

                    <li>
                        <h3>Don't Tease or Harass the Deer</h3>
                        <p>These seemingly calm and adorable animals can become aggressive if provoked. In recent years, deer-related injuries in Nara have increased as tourists chase the perfect selfie. Many visitors try to attract the deer by offering food, only to pull it away as a joke or use it to pose for photos. Naturally, this frustrates the deer, who may respond by biting or kicking.</p>
                        <p>Wouldn't you be upset if someone promised you food but just pointed a camera at your face instead? On top of that, feeding deer human snacks can make them seriously ill—so be respectful and treat them kindly.</p>
                    </li>

                    <li>
                        <h3>Don't Feed the Deer Unauthorized Food</h3>
                        <p>Feeding the deer anything other than approved deer crackers (shika senbei) can be harmful to their health. While it might seem harmless to offer them snacks like bread or chips, these foods can upset their digestive system and make them sick.</p>
                             <img src="./img/Japan_deer.jpeg" alt="Nara Deer" class="nara-deer-image">
                        <p>  Sadly, some tourists ignore the rules and give deer human food, thinking it's a kind gesture. In reality, it puts the animals at serious risk.
                             If you truly care for the deer, stick to the food provided specifically for them. It's safe, healthy, and helps preserve their well-being.</p>


                    </li>
                    <li>        
                        <h3>Don't Litter in the Park or Temple Areas</h3>
                            <p>Nara is very clean and environmentally conscious. Dispose of trash properly or take it with you if no bins are available. Littering not
                                 only spoils the beauty but can also harm the deer.</p>
                    </li>
                    <li>                       
                        <h3> Don't Touch or Damage Religious Sites</h3>
                            <p>Temples, shrines, and statues in places like Nara and Kyoto are not just beautiful landmarks—they are sacred cultural and spiritual symbols. Touching, climbing on, or defacing these sites is deeply disrespectful and can cause serious damage. 
                                Unfortunately, some tourists treat these spaces like photo props, forgetting their historical and religious significance.
                                Always observe with care and respect. Taking pictures is usually fine, but keep a respectful distance and never disturb the surroundings.</p>
                    </li>
                            </ul>

                    <h2>2. Osaka</h2>
                    <ul class="rules-list">
                        <li>
                        <h3>1.Don't Block the Escalator</h3>
                        <p>In Osaka, people stand on the right side of the escalator, leaving the left side open for walking. Blocking both sides is considered rude and disrupts flow in busy stations.</p>
                        </li>
                    
                        <li>
                            <h3>2.Don't Make Loud Phone Calls on Trains</h3>
                            <p>In Japan, trains are quiet spaces where people value peace and personal space. Talking loudly—especially on the phone—is considered rude and disruptive.
                                 Most passengers use the time to relax, read, or rest, so loud conversations can disturb those around you.
                                 <p>In fact, it's common etiquette to set your phone to silent mode and avoid calls altogether while riding.
                                If you need to take an urgent call, wait until you get off the train or move to a designated area, like the platform or a private space.</p>
                                <img src="./img/ph_call.jpg" alt="Phone Call on Train" class="phone-call-image">
                        </li>

                        <li>
                            <h3>3.Don't Litter in Public Areas</h3>
                            <p>Areas like Dotonbori and Namba are very clean despite the crowds. Dispose of trash properly, or take it with you if you can't find a bin.</p>
                        </li>

                        <li>
                            <h3>4.Don't Mock the Kansai Dialect</h3>
                            <p>The Kansai dialect, or Kansai-ben, is a proud part of the region's identity, especially in places like Osaka and Kyoto. While it may sound different or funny to outsiders,
                                 making fun of the accent can come across as disrespectful or offensive. For locals, it's not just a way of speaking—it's a reflection of their culture, humor, and community.</p>
                            <p>Appreciate the uniqueness of the dialect, but avoid imitating it in a joking way. A little respect goes a long way in building good relationships with the locals.<p>
                        </li>

                        <li>
                            <h3>5.Don't Ignore Local Manners in Temples and Shrines</h3>
                            <p>Temples and shrines in Japan are not just tourist spots—they are places of deep spiritual meaning and tradition. Visitors are expected to follow certain manners, such as bowing at the entrance, walking quietly, and purifying hands before entering sacred areas. <p>
                                Ignoring these customs can be seen as disrespectful, even if unintentional.
                                Take a moment to observe and follow the local etiquette. Showing respect to the customs honors the culture and enhances your experience.<p>

                            </p>
                        </li>
                            </ul>
                    <ul class="rules-list">
                        <h2>3. Kobe</h2>
                        <li>
                            <h3>1.Don't Ignore Umbrella Etiquette on Rainy Days</h3>
                            <p>Kobe is known for its sudden weather changes, and locals take umbrella manners seriously.
                                If your umbrella is wet, don't bring it into shops or trains while dripping—use umbrella bags 
                                or keep it folded. Leaving it open in doorways is considered rude.</p>
                        </li>
                        
                        <li>
                            <h3>2.Don't Sit Too Long at Chinatown's Popular Food Stalls</h3>
                                <p>Kobe's Nankinmachi (Chinatown) is famous for its street food. While it's okay to enjoy your meal, 
                                don't occupy a stall for too long, especially during busy hours. Eat quickly and let others enjoy the 
                                delicious offerings.</p>
                        </li>

                        <li>
                            <h3>3.Don't Photograph Kitano Locals Without Asking</h3>
                                <p>The Kitano Ijinkan area is full of beautiful Western-style houses and stylish locals. But casually snapping photos of people or private property without asking is considered bad manners.</p>
                        </li>
                    </ul>
                    </section>
                
                    <h2>4. Kyoto</h2>
                    <ul class="rules-list">
                        <li>
                        <h3>1. Don't Block the Path in Gion or Geisha Districts</h3>
                        <p>The historic streets of Gion and other geisha districts are narrow and often crowded with both locals and visitors. Tourists sometimes gather in large groups or stop suddenly to take photos,
                            blocking the path for others. This not only causes inconvenience but also disturbs the peaceful atmosphere of the area.</p>
                            <p>Please be mindful of your surroundings—step to the side if you need to stop, and avoid gathering in groups that block the way. Respect helps preserve the charm of these cultural neighborhoods.</p>
                        </li>

                        <li>
                        <h3>2. Don't Eat While Walking in Traditional Streets</h3>
                        <p>In Arashiyama, Kiyomizu-zaka, and Nishiki Market, eating while walking is discouraged. Use nearby benches or food stalls to enjoy your meal respectfully.</p>
                        </li>

                        <li>
                        <h3>3. Don't Touch or Sit on Temple Structures</h3>
                        <p>Temples like Kinkakuji or Fushimi Inari are sacred. Avoid leaning, sitting, or touching gates, lanterns, or statues for photos—it's considered disrespectful.</p>
                        </li>
                        
                        <li>
                        <h3>4. Don't Approach Geisha or Maiko for Selfies</h3>
                        <p>Geisha and maiko (apprentice geisha) are respected cultural figures in Japan, especially in areas like Kyoto's Gion district. Some tourists try to stop them for photos or selfies as they walk to appointments, but this is intrusive and disrespectful. 
                            These women are not entertainers for tourists—they are artists heading to work.</p>
                        <img src="./img/geisha.jpg" alt="Geisha in Kyoto" class="geisha-image">
                        <p>Please admire them from afar and avoid blocking their path or calling out to them. Respecting their space helps preserve the dignity of their tradition.</p>
                        </li>

                        <li>
                        <h3>5. Don't Speak Loudly on Public Transport</h3>
                        <p>Kyoto buses and trains are quiet places. Phone calls and loud talking are frowned upon. Speak softly or stay silent when riding public transport.</p>
                        </li>

                        <li>
                        <h3>6. Don't Wander into Private Machiya Homes</h3>
                        <p>Traditional machiya townhouses in Kyoto may look like shops or museums from the outside, but many are still private residences. Some tourists, curious about the architecture or
                            looking for a photo, mistakenly step inside or peek through windows—invading the privacy of the people who live there.</p>
                            <p>Always check for signs and respect boundaries. If you're interested in seeing the inside of a machiya, visit one that's open to the public. Admiring from a respectful distance keeps the charm alive for everyone.</p>
                        </li>

                    
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
<script src="./js/travelers_homePage.js"></script>
<script src="./js/translations/"></script>
</html>