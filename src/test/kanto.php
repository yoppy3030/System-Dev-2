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

                <!-- Menu Button -->
        <div class="menu-button" onclick="toggleSidebar()">
            <span></span>
            <span></span>
            <span></span>
        </div>
          <!-- サイドバーナビゲーション -->
        <div class="sidebar" id="sidebar">
            <a href="regions.php">Regions</a>
            <a href="#">When in a store</a>
            <a href="#">When walking on the street</a>
            <a href="#">When in public facilities</a>
            <a href="./login.php">Login</a>
        </div>
    </header>
    <main>
        </div>
        <!-- Main Content -->
         <h1>Introduction to the Kanto Region</h1>
         <p>The Kanto region lies in eastern Honshu, Japan’s main island, and is home to the country’s political, economic, and cultural core. This area includes Tokyo, the bustling capital,
             as well as other major prefectures like Kanagawa, Chiba, Saitama, Ibaraki, Tochigi, and Gunma. Known for its dense urban centers, cutting-edge technology, and historical landmarks, Kanto offers a dynamic mix of modern skyscrapers and traditional temples.</p>
            <img src="./img/fujiyama.jpg" alt="Kanto Region" class="kanto-image">
            <p>From the neon-lit streets of Shibuya and Shinjuku to the serene beauty of Nikko’s shrines and Hakone’s hot springs, Kanto blends old and new seamlessly. It’s also a major transport hub with access to the Shinkansen (bullet train), international airports, and extensive rail networks, making it 
                a popular destination for both locals and travelers.</p>

                <ol>
                
                <h2><li>Kanto region</li></h2>

                <!-- Tokyo Section -->
                    <h2>Tokyo</h2>
                    <ul class="rules-list">

                    <li>
                        <h3>1. Stay to the Left (Except in Osaka!)</h3>
                        <p>In Tokyo, one of the unspoken rules that locals naturally follow is to stay to the left when using escalators. This means people stand on the left side so that those in a hurry can walk up or down on the right. It’s a small but important part of the city's fast-paced daily life, especially in
                             crowded train stations.</p>
                        <p> Interestingly, this rule is not the same throughout Japan—for example, in Osaka, people do the opposite and stand on the right side, allowing others to pass on the left. Knowing which side to stand on may seem like a small detail, but it shows respect for others and helps keep things moving smoothly in busy areas.</p>
                    </li>

                    <li>
                        <h3>2. Avoid Eating While Walking</h3>
                        <p>In Tokyo, it's considered good manners to avoid eating while walking. While it might seem normal in other countries, locals in Tokyo usually eat their food near the shop where they bought it or wait until they find a proper place to sit. This habit helps keep the streets
                             clean and shows respect to others around you.</p>
                             <img src="./img/no_eating_while_walking.jpeg" alt="Eating in Tokyo" class="eating-image">
                              <p>Eating on the go, especially in crowded areas, can be seen as careless or even rude.
                              That’s why you’ll often see people standing beside food stalls or using benches in parks to enjoy their meals properly.</p>
                    </li>
                    <li>        
                        <h3>3. Queueing Culture</h3>
                            <p>In Tokyo, orderly queueing is an unspoken rule that everyone follows without exception. Whether you’re waiting for a train, lining up at a popular restaurant, or boarding a bus, locals always form neat, single-file lines and patiently wait their turn.
                                 Jumping ahead or cutting in line is considered extremely rude and can draw disapproving looks or even polite reminders from those around you. This respect for order helps keep public spaces calm and efficient, especially during busy rush hours when crowds are large. Even at crowded places, people quietly accept the wait, valuing fairness and harmony over impatience. This culture of disciplined queuing reflects the broader social emphasis on respect and consideration that Tokyoites live by every day..</p>
                    </li>
                    </ul>

                    <!-- Chiba Section -->
                    <h2>Chiba</h2>
                    <ul class="rules-list">
                        <li>
                            <h3>1. Beach & Coastal Etiquette</h3>
                            <p>In Chiba, where beaches and coastal areas are a big part of everyday life, locals follow strict etiquette that differs from the more urban Tokyo lifestyle. 
                                Visitors and residents alike are careful never to leave trash behind, respecting the natural beauty of the coastline.</p>
                            <p> Swimming is only allowed within designated safe zones, and lifeguards closely enforce these boundaries to prevent accidents. Unlike in Tokyo, where rivers or small parks are more common spots for relaxation, Chiba’s beach culture emphasizes safety, cleanliness, and consideration for others, especially during the busy summer months when the beaches fill up. 
                                This careful respect for the environment and safety rules reflects the strong connection locals have with their coastal surroundings.</p>
                        </li>
                    
                        <li>
                            <h3>2. Farmers’ Market Bargaining Is Okay</h3>
                            <p>In Chiba’s more rural and agricultural communities, visiting farmers’ markets or roadside stalls often comes with a unique cultural twist that’s quite different from Tokyo’s more formal shopping scene.
                                It’s generally accepted—and even expected—to engage in polite bargaining or price negotiations with vendors, especially when buying in bulk or at smaller, family-run stalls. </p>
                            <p>This friendly back-and-forth reflects the close relationships between locals and producers, and it’s seen as part of the shopping experience rather than rude or confrontational.
                                In contrast, Tokyo’s markets tend to have fixed prices, and bargaining is rarely practiced, making this a distinctive and authentic local custom in Chiba.</p>
                        </li>

                        <li>
                            <h3>3. Respect for Local Festivals (Matsuri) with Unique Traditions</h3>
                            <p>Chiba hosts many local festivals with traditions specific to small towns and fishing communities. Locals strictly follow rituals or dress codes for these festivals, like wearing specific happi coats or carrying mikoshi (portable shrines) in a certain way.
                                 Outsiders who join are expected to learn and respect these traditions deeply, more so than the bigger, tourist-oriented festivals in Tokyo.</p>
                            <img src="./img/fire_work.jpg" alt="Chiba Festival" class="festival-image">

                        </li>

                        <li>
                            <h3>4. No Late-Night Noise in Residential Areas</h3>
                            <p>In Chiba’s residential and suburban neighborhoods, there is a strong local expectation to keep noise levels very low, especially late at night. Unlike Tokyo’s busy entertainment districts where nightlife can continue until the early hours,
                                 many parts of Chiba value quiet and peaceful evenings. Making loud noises, playing music, or having rowdy gatherings after 9 or 10 p.m. is generally frowned upon and can quickly lead to complaints from neighbors. This respect for quiet hours helps maintain the calm, close-knit community atmosphere that many residents cherish.
                                  Visitors and newcomers are expected to be mindful of this unwritten rule to avoid disturbing the neighborhood harmony.<p>
                        </li>

                    </ul>
                    <!-- Kanagawa Section -->
                    <ul class="rules-list">
                        <h2>Kanagawa</h2>
                        <li>
                            <h3>1. Respect for Shrine and Temple Parking Customs</h3>
                            <p>In Kanagawa towns like Kamakura, shrine and temple parking often follows unwritten local rules. Some spots are informally reserved for regular worshippers or locals, even if no signs are posted. Parking there without knowing the custom can be seen as rude. Unlike Tokyo’s clearly marked lots or Chiba’s open rural areas, Kanagawa requires a bit more local awareness and quiet respect.</p>
                        </li>
                        
                        <li>
                            <h3>2. Quiet Onsen (Hot Spring) Behavior</h3>
                                <p>In Kanagawa, especially in famous hot spring areas like Hakone, locals observe very strict and respectful onsen etiquette that often surprises visitors. Kanagawa’s hot springs require guests to maintain complete silence or speak in very low voices to preserve a peaceful atmosphere. Tattoos are generally not allowed, reflecting a cultural sensitivity that’s still strongly upheld by local bathhouses. Additionally, it’s considered improper to enter the baths immediately after eating or drinking alcohol, as this can be harmful to your health and disrespectful to the tradition.</p>
                                <img src="./img/onsen.jpg" alt="Kanagawa Onsen" class="onsen-image">
                                <p>These detailed rules ensure the onsen experience remains calming and restorative for everyone, and locals take them very seriously.In Kanagawa, especially in famous hot spring areas like Hakone, locals observe very strict and respectful onsen etiquette that often surprises visitors. Unlike in Tokyo or Chiba, where public bathhouse rules can be a bit more relaxed, Kanagawa’s hot springs require guests to maintain complete silence or speak in very low voices to preserve a peaceful atmosphere.</p>
                                <p>Tattoos are generally not allowed, reflecting a cultural sensitivity that’s still strongly upheld by local bathhouses. Additionally, it’s considered improper to enter the baths immediately after eating or drinking alcohol, as this can be harmful to your health and disrespectful to the tradition. These detailed rules ensure the onsen experience remains calming and restorative for everyone, and locals take them very seriously.</p>
                        </li>

                        <li>
                            <h3>3. No Umbrella Sharing in Crowded Areas</h3>
                                <p>In Kanagawa, particularly in urban areas like Yokohama and around busy train stations, there’s an unspoken rule among locals to avoid sharing umbrellas with strangers in crowded places, even during sudden heavy rain. Unlike in Tokyo, where people may sometimes casually huddle under someone else’s umbrella when packed together, or in Chiba where people tend to stick to personal umbrellas due to open spaces, Kanagawa locals value personal space and privacy even in tight spots.</p>
                                <p>Reaching under someone’s umbrella or trying to share without permission is seen as intrusive and uncomfortable. Most locals carry compact umbrellas to avoid this situation altogether, reflecting a subtle but important aspect of personal boundary awareness in the area.</p>
                        </li>
                        <li>
                            <h3>4. Respect for Coastal Fishing Zones</h3>
                                <p>Along Kanagawa’s coastal areas, especially on the Miura Peninsula and in fishing towns like Hayama or Yokosuka, locals observe strict respect for designated fishing zones. These areas are often marked, but even when they aren’t, local people know which spots are reserved for professional or community use. Fishing in these restricted zones—especially early in the morning or near docks—without understanding the local customs can lead to polite but firm requests to leave.</p>
                                <p> Unlike the more recreational beach areas in Chiba or the urban waterfronts in Tokyo, Kanagawa’s fishing zones are often tied to long-standing traditions and livelihoods. Locals take these boundaries seriously, and respecting them is seen as a sign of good manners and awareness of the community’s way of life.</p>
                    </ul>
                    <!-- Saitama Section -->
                    <h2>Saitama</h2>
                    <ul class="rules-list">
                        <li>
                            <h3>1. Riverbank Respect</h3>
                            <p>In Saitama, riverbanks along places like the Arakawa and Shingashi rivers are popular spots for seasonal activities such as hanami (cherry blossom viewing) and fireworks festivals. </p>
                                <p>Locals take great care to keep these natural areas clean and beautiful by following a strict unspoken rule: always clean up completely after gatherings. People often bring their own garbage bags and make sure to pick up any litter, even if it isn’t theirs. Leaving trash behind is considered highly disrespectful and can lead to disapproval from the community. This strong sense of responsibility helps preserve the peaceful environment and ensures that everyone can continue to enjoy these riverside spaces year after year.</p>
                        </li>

                        <li>
                            <h3>2. Silent Commuting Culture on Suburban Trains</h3>
                            <p>Saitama commuters are known for being extra quiet and reserved on trains, even compared to Tokyo. Locals often avoid eye contact, don’t speak unless necessary, and rarely use phones aloud—even in casual situations. It’s part of the calm suburban culture.</p>
                        </li>

                        <li>
                            <h3>3. No Flashy Fashion in Local Malls</h3>
                            <p>In suburban areas of Saitama, especially in smaller cities and towns, locals tend to dress casually and modestly. Wearing flashy or high-end Tokyo-style fashion in local malls or supermarkets can draw quiet stares or make you stand out awkwardly.
                            While not offensive, it goes against the area's more relaxed and down-to-earth vibe, where blending in is preferred.</p>
                        </li>

                        
                        
                    </ul>
             </ol>


    </main>
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
<script src="./js/kanto.js"></script>
</body>
</html>