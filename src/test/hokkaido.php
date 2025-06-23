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
        <!-- Sidebar -->
        <!-- <div class="sidebar" id="sidebar">
            <a href="#">友達を家に行く時</a>
            <a href="#">お店の中にいる時</a>
            <a href="#">道の中で歩いている時</a>
            <a href="#">公共施設にいる時</a>
            <a href="./login.php">Login</a>
        </div> -->

       
          <!-- サイドバーナビゲーション -->
        <div class="sidebar" id="sidebar">
            <a href="#">When visiting a friend's house</a>
            <a href="#">When in a store</a>
            <a href="#">When walking on the street</a>
            <a href="#">When in public facilities</a>
            <a href="./login.php">Login</a>
        </div>
        <!-- Main Content -->
         <h1>Introduction to the Hokkaido Region</h1>
         <p>Hokkaido, Japan's northernmost island, is a land of breathtaking natural beauty, rich culture, and unique seasonal charm. Known for its vast landscapes, snowy winters, and cool summers, Hokkaido offers a refreshing escape from Japan's more urbanized regions. The island is famous for its winter sports in areas like Niseko and Sapporo, stunning flower fields in Furano, and fresh seafood markets in Hakodate.
             Beyond its scenic appeal, Hokkaido is home to the indigenous Ainu culture, giving it a distinct heritage and identity within Japan. Whether you're drawn by adventure, cuisine, or serenity, Hokkaido welcomes visitors with wide open spaces and warm local hospitality.</p>

                <ol>
                
                <h2>Hokkaido region</h2>

                <!-- Sapporo Section -->
                    <h2>1. Sapporo</h2>
                    <ul class="rules-list">

                    <li>
                        <h3>1. Don't Walk on Uncleared Snow Paths Without Caution</h3>
                        <p>In Sapporo, where winters are long and snowy, locals have an unspoken rule when it comes to walking through the city — always avoid uncleared snow paths unless you know what you're doing. While visitors might be tempted to walk through fresh snow or take shortcuts, longtime residents understand that these areas can hide dangerous layers of ice underneath. 
                            Many sidewalks are regularly maintained and sprinkled with gravel or salt to prevent slipping, and locals instinctively stick to those routes. Walking on untreated paths not only risks injury but also shows a lack of awareness of the winter culture in Sapporo. To move safely like a local, watch where people walk — and follow their footprints.</p>
                    </li>

                    <li>
                        <h3>2. Umbrellas Are Useless in Sapporo Snow</h3>
                        <p>In Sapporo, using an umbrella during snowfall is seen as unnecessary — and even a little strange. Unlike rain, the snow in Sapporo is often light, dry, and powdery, especially during the colder months. Locals know that umbrellas don't help much in these conditions and only get in the way. Instead, people rely on warm coats with hoods, knit hats, and waterproof outerwear to stay dry and comfortable. 
                            Visitors who walk around with umbrellas in the snow often stand out as tourists, while seasoned locals simply brush off the flakes and keep walking. If you want to blend in and move smoothly through the city, ditch the umbrella and embrace the snow like a true Sapporo native.</p>
                    </li>
                    <li>        
                        <h3>3. Don't Walk Indoors with Snowy Shoes</h3>
                            <p>In Sapporo, where heavy snowfall is a part of daily life, it's considered very rude to walk indoors with snowy or wet shoes. Locals take great care to keep indoor spaces clean and dry, especially in winter. When entering homes, restaurants, small shops, or traditional inns, people are expected to either remove their shoes or properly stomp off the snow outside on a mat.
                                 Many places even provide slippers or indoor shoes near the entrance. Bringing slush and snow inside not only makes a mess but can also be dangerous, as wet floors become slippery. Paying attention to your footwear and following what locals do is a simple but important way to show respect for Sapporo's winter lifestyle.</p>
                    </li>
                    <li>
                        <h3>4. Don't Block People for Photos During Festivals</h3>
                        <p>During popular festivals in Sapporo, like the Sapporo Snow Festival, it's common to see beautiful displays and sculptures that everyone wants to photograph. However, locals value smooth movement and shared enjoyment of public space. Standing too long in front of a snow sculpture, blocking a narrow path, or taking selfies in the middle of a busy crowd can be frustrating for others. 
                            People in Sapporo quietly wait their turn, take their photos quickly, and move aside to let others enjoy the view. Being aware of your surroundings and not blocking the flow of people is an important part of festival manners — it shows respect for both the event and everyone attending.</p>
                    </li>
                    </ul>

                    <!-- Hakodate Section -->
                    <h2>2. Hakodate </h2>
                    <ul class="rules-list">
                        <li>
                            <h3>1. Don't Be Loud at Mount Hakodate Night View</h3>
                            <p>Mount Hakodate offers one of the most stunning night views in Japan, attracting both locals and tourists with its glittering panorama of the city and coastline. However, this scenic spot is also known for its quiet, peaceful atmosphere. Locals visit the mountaintop to relax, reflect, 
                                or enjoy a quiet moment with friends or loved ones. Speaking loudly, playing music, or making noise disrupts this special ambiance and can be seen as disrespectful. 
                                Tourists are expected to speak softly, avoid blocking others' views, and take photos quickly and politely. By keeping the atmosphere calm and respectful, you'll not only blend in with the locals but also fully appreciate the beauty that makes this place so special.</p>
                        </li>
                    
                        <li>
                            <h3>2. Don't Take Photos Inside Temples or Churches Without Permission</h3>
                            <p>Hakodate is known for its rare mix of historic temples, Shinto shrines, and old Western-style churches — a reflection of its international past. While many of these places are open to visitors, they are still active sites of worship and quiet reflection for the local community. Taking photos inside without permission can be seen as intrusive or disrespectful, especially during prayer times or religious ceremonies. 
                                Some places may allow photography in certain areas, but others clearly prohibit it with signs — so it's important to look carefully and ask if you're unsure. Showing respect by following these quiet rules not only honors the traditions of Hakodate, but also leaves a good impression as a thoughtful guest.</p>
                        </li>

                        <li>
                            <h3>3. Don't Ignore Streetcar Etiquette</h3>
                            <p>The streetcars in Hakodate are not just a mode of transportation — they're a part of daily life and local culture. Riding the streetcar comes with unspoken rules that locals naturally follow. Passengers line up quietly, board in order, and keep conversations soft and respectful. 
                                Seats are often offered to the elderly, people with disabilities, and parents with children, and it's polite to avoid occupying priority seats unless necessary.
                             Loud talking, phone calls, or playing music without headphones is considered bad manners. Visitors who respect this quiet, orderly style of commuting show that they care about the local way of life and help maintain the peaceful atmosphere that Hakodate residents value.</p>
                            <img src="./img/fire_work.jpg" alt="Chiba Festival" class="festival-image">

                        </li>

                        <li>
<<<<<<< HEAD
                            <h3>4. Don’t Waste the Fresh Seafood at the Morning Market</h3>
                            <p>Hakodate’s Morning Market (朝市) is famous across Japan for its incredibly fresh seafood, especially squid, sea urchin, crab, and scallops. For locals, this food isn’t just a meal — it represents hard work, tradition, and pride in the local fishing culture. When tourists order seafood, especially live or freshly prepared dishes, 
                                it’s expected that they eat it with appreciation and finish what they take. 
=======
                            <h3>4.Don't Waste the Fresh Seafood at the Morning Market</h3>
                            <p>Hakodate's Morning Market (朝市) is famous across Japan for its incredibly fresh seafood, especially squid, sea urchin, crab, and scallops. For locals, this food isn't just a meal — it represents hard work, tradition, and pride in the local fishing culture. When tourists order seafood, especially live or freshly prepared dishes, 
                                it's expected that they eat it with appreciation and finish what they take. 
>>>>>>> dd71e825acc418ab08c0617506a54c8420c5acec
                            Leaving large amounts uneaten or treating rare seafood like a novelty for photos can seem disrespectful to both the chefs and fishermen. To show proper respect in Hakodate, enjoy the food sincerely, and avoid ordering more than you can eat.<p>
                        </li>

                        <li>
                            <h3>5. Don't Be Disrespectful at Historical Sites</h3>
                            <p>Hakodate is rich in historical landmarks, from the star-shaped Goryokaku Fort to old consulates, traditional warehouses, and Western-style churches. These places aren't just tourist attractions — they hold deep cultural and historical meaning for the local people. Climbing on old stone walls, touching fragile displays, speaking loudly, 
                                or behaving casually in sacred or preserved spaces can come across as careless or disrespectful.
                                 Visitors are expected to move calmly, follow posted rules, and treat these sites with the same care locals do. Showing quiet respect at historical locations helps preserve their beauty and meaning for future generations — and shows that you value Hakodate's unique past.</p>
                        </li>
                    </ul>
                    <!-- Obihiro Section -->
                    <ul class="rules-list">
                        <h2>3. Obihiro</h2>
                        <li>
                            <h3>1. Don't Treat Banei Horse Racing Like a Joke</h3>
                            <p>Banei horse racing is one of Obihiro's most cherished cultural traditions — and the only place in the world where it exists. Unlike regular horse racing, Banei involves massive draft horses pulling heavy sleds across a dirt track with hills, showcasing strength, endurance, and deep trust between horse and rider.
                                 For locals, this isn't just entertainment — it's a proud symbol of Tokachi's farming heritage and a tribute to the horses that once supported Hokkaido's development. Tourists who laugh at the slow pace, cheer too loudly, or make jokes about the horses may unknowingly offend the people who take this tradition to heart. 
                                Visitors are encouraged to watch with respect, learn about its history, and feel the quiet power behind this one-of-a-kind event.</p>
                        </li>
                        
                        <li>
<<<<<<< HEAD
                            <h3>2. Don’t Pick or Step Into Farmlands</h3>
=======
                            <h3>2.  Don't Pick or Step Into Farmlands</h3>
>>>>>>> dd71e825acc418ab08c0617506a54c8420c5acec
                                <p>Obihiro is surrounded by some of the most productive farmland in Japan, making agriculture a central part of daily life and local pride. The wide, open fields filled with potatoes, corn, wheat, and beans might look like beautiful photo spots, but they are actually private property and active workspaces.
                                     Some tourists may be tempted to step into the fields for photos or even pick crops, but this is strictly forbidden and seen as deeply disrespectful.
                                     Not only does it damage the plants and soil, but it also disrupts the hard work of local farmers. 
                                    Visitors are welcome to enjoy the scenic views from a distance, but it's important to respect the boundaries of the land and the people who care for it every day.</p>
                        </li>

                        <li>
                            <h3>3. Don't Waste Your Butadon</h3>
                                <p>Obihiro is the proud birthplace of Butadon — a delicious rice bowl topped with grilled pork and sweet-savory sauce. This dish isn't just a local specialty; it represents the region's rich agricultural culture and high-quality pork production. For locals, Butadon is comfort food with deep meaning, often linked to family meals and regional pride.
                                     When tourists order Butadon and leave most of it uneaten, it can feel disrespectful — especially in a place where people value food deeply and understand the effort behind every ingredient. To show appreciation, visitors should only order what they can finish and take time to enjoy the flavor and care that goes into every bowl.</p>
                        </li>
                        <li>
                            <h3>4.  Don't Block Rural Roads or Farm Paths</h3>
                                <p>In the scenic countryside around Obihiro, it's common for visitors to stop and admire the beautiful farmland, wide skies, and mountain views. However, many of the roads and narrow lanes that pass through these areas are active farm routes used daily by tractors, delivery trucks, and local workers.
                                     Parking a car or standing for photos in the middle of these paths — even just for a few minutes — can interrupt important agricultural work or create dangerous situations. Unlike in cities, these roads may not have clear signs or sidewalks, but they are essential for the community.
                                     Visitors should always park in designated areas and be mindful not to block entrances, driveways, or narrow lanes. Respecting these small but vital routes shows appreciation for the land and the people who sustain it.</p>
                    </ul>
                    <!-- Asahikawa  Section -->
                    <h2>4. Asahikawa </h2>
                    <ul class="rules-list">
                        <li>
                            <h3>1. Don't Underestimate the Cold Weather</h3>
                            <p>Asahikawa is known for being one of the coldest cities in Japan, with winter temperatures often dropping below –20°C. For locals, dealing with extreme cold is a normal part of life — they're well-prepared with insulated clothing, winter boots, heat packs, and layered outfits. However, tourists sometimes underestimate just how harsh the weather can be,
                                 especially when arriving from warmer regions. Wearing light jackets, thin shoes, or forgetting gloves can lead to discomfort or even minor frostbite. To avoid problems, visitors should take the cold seriously and dress properly. Being prepared not only keeps you warm and safe, but also shows respect for the local environment and culture.</p>
                        </li>

                        <li>
                            <h3>2.  Don't Disrupt Local Theater or Art Spaces</h3>
                            <p>Asahikawa has a surprisingly vibrant arts and theater scene for a regional city, with local galleries, small theaters, and cultural centers that reflect the community's deep appreciation for creativity. These spaces are often intimate and quiet, designed to let visitors fully engage with performances or exhibitions. Tourists who talk loudly, take phone calls,
                                 or use flash photography can unintentionally disturb the atmosphere and show a lack of consideration. Even casual behavior like leaning on gallery pieces or eating inside the venue may be seen as disrespectful. If you choose to visit these cultural spots, it's best to follow the lead of locals: stay quiet, observe carefully, and enjoy the art with thoughtful attention.</p>
                        </li>

                        <li>
<<<<<<< HEAD
                            <h3>3. Don’t Treat the Asahiyama Zoo Like a Theme Park</h3>
                            <p>The Asahiyama Zoo is one of Asahikawa’s most beloved attractions, not just for tourists but also for locals who take great pride in its thoughtful, animal-friendly design. Unlike flashy theme parks, this zoo is known for its “behavioral exhibitions,” which allow animals to move naturally and be observed in ways that reflect their true habits. It’s a place of learning, not entertainment. 
=======
                            <h3>3.Don't Treat the Asahiyama Zoo Like a Theme Park</h3>
                            <p>The Asahiyama Zoo is one of Asahikawa's most beloved attractions, not just for tourists but also for locals who take great pride in its thoughtful, animal-friendly design. Unlike flashy theme parks, this zoo is known for its "behavioral exhibitions," which allow animals to move naturally and be observed in ways that reflect their true habits. It's a place of learning, not entertainment. 
>>>>>>> dd71e825acc418ab08c0617506a54c8420c5acec
                                Tourists who shout at animals, tap on glass, or treat the zoo like a playground may disrupt the peaceful environment and upset both staff and other visitors. Respecting the animals by watching quietly and following posted rules helps preserve the special atmosphere that makes Asahiyama Zoo such a meaningful place for the community.</p>
                        </li>
                        <li>
                            <h3>4. Don't Ignore the Value of Local Craftsmanship</h3>
                            <p>Asahikawa is renowned across Japan for its high-quality woodcraft and furniture design, with a long tradition of skilled craftsmanship passed down through generations. Many local workshops and galleries feature beautifully made chairs, tables, and everyday items that reflect a deep respect for materials and detail. However, some visitors may overlook the value of these items, treating them as simple souvenirs or testing furniture in showrooms without permission.
                                 Sitting roughly, touching displays carelessly, or treating handmade pieces like mass-produced goods can offend artisans and staff who take great pride in their work. To truly appreciate Asahikawa's craftsmanship, visitors should observe with care, ask questions respectfully, and understand the passion behind each creation.</p>
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
<script src="./js/hokkaido.js"></script>
</body>
</html>