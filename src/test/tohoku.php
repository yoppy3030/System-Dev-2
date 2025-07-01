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

   
         <!-- Main Content -->
         <h1>Introduction to the Tohoku Region</h1>
         <img src="./img/tohoku.jpg" alt="Tohoku Region" class="Tohoku-image">
         <p>The Tohoku Region is located in the northern part of Japan's main island of Honshu, and is a region rich in nature and traditional culture. Consisting of six prefectures: Aomori, Akita, Iwate, Miyagi, Yamagata, and Fukushima, it features beautiful scenery with distinct four seasons, hospitable people, and unique culture and traditions. From snow-covered winters to lush summers, as well as delicious local cuisine, the Tohoku region is a must-visit destination for anyone wanting to experience the essence of Japan.</p><br>

            

             <ol>
                
                <h2>Tohoku region</h2>
                    <h2>1. Akita</h2>
                    <ul class="rules-list">

                    <li>
                        <h3>1. Don’t talk back to obaachans (grandmas)</h3>
                        <p>In rural Akita, grandmas—known as obaachans—hold a special place in the community. They’re often strong-willed, outspoken, and deeply respected for their experience and wisdom. If an obaachan gives you advice, even if it sounds blunt or old-fashioned, it’s best not to argue or talk back. 
                            Just smile, nod, and say something polite like “thank you” or “I see.” Arguing, correcting them, or acting like you know better can come off as disrespectful, especially to older generations who value humility and harmony. In Akita, keeping the peace with elders isn’t just polite—it’s part of the social fabric.</p>
                    </li>

                    <li>
                        <h3>2. Always accept rice and pickles</h3>
                        <p>When visiting someone’s home in Akita, especially in rural areas, it’s common for hosts to offer simple homemade food—usually a bowl of rice and some pickles like tsukemono or the local specialty iburigakko (smoked daikon pickles). Even if you’re not hungry or don’t usually eat pickles, refusing them outright can be seen as rude or ungrateful. </p>
                        <p>These small offerings aren’t just snacks—they’re a gesture of hospitality, tradition, and pride. Accepting them with a smile, or at least taking a small bite, shows respect for the local culture and the effort of the person offering them. In Akita, food is a way of connecting—and declining it too quickly might accidentally send the wrong message.</p>
                    </li>
                    <li>        
                        <h3> 3. Don’t stand in the middle of an onsen changing room</h3>
                            <p>In Akita, where onsen culture is deeply rooted, there are unspoken rules that locals naturally follow—especially in the changing rooms. One important point is to avoid standing around in the middle of the dressing area, especially while undressed. Locals value modesty and efficiency in these shared spaces. It’s expected that you quietly and quickly change, keeping your personal space minimal and not blocking others.</p>
                            <p> Lingering, stretching, or chatting loudly in the middle of the room can make people uncomfortable and disrupt the peaceful atmosphere. The same goes for the bath itself—quiet, respectful behavior is the norm. If you want to blend in like a local, keep it low-key, move with purpose, and always be mindful of others around you.</p>
                    </li>
                    <li>                       
                        <h3> 4. Respect the festivals</h3>
                            <p>The Festivals in Akita, such as the famous Kanto Matsuri and Kamakura Snow Festival, are much more than just celebrations—they are deeply rooted cultural and spiritual events that locals take great pride in. These festivals often involve intricate rituals, community cooperation, and a strong sense of tradition passed down through generations. When attending or even just observing, it’s important to show respect by following the rules, being polite, and not treating the events as mere entertainment. </p>
                            <p>Locals expect visitors to appreciate the significance behind the ceremonies and to participate in a way that honors their customs. Disrespectful behavior, loud disruptions, or mocking the traditions can offend people who view these festivals as sacred parts of their identity.</p>
                    </li>
                    <li>
                        <h3>5. Don’t make fun of Namahage</h3>
                        <p>Namahage is a unique and important folklore tradition in Akita, where demon-like figures visit homes during New Year’s to scare away laziness and bad luck. While the costumes and masks might look scary or even funny to outsiders, locals take Namahage very seriously as a symbol of cultural heritage and community values.</p>
                        <img src="./img/namahage.jpg" alt="Namahage" class="namahage-image">
                        <p> Making fun of the Namahage, mocking their appearance, or treating the tradition lightly can be seen as disrespectful and offensive to those who have grown up with these stories and rituals.When encountering Namahage—whether at festivals or in stories—it’s important to show respect and understand the deeper meaning behind this powerful local custom.</p>
                    </li>
                    <li>
                        <h3>6. Snow clearing is a community duty</h3>
                        <p>In many parts of Akita, heavy snowfall is a normal part of winter, and dealing with it is considered a shared responsibility among community members. It’s not just about clearing the snow from your own driveway or walkway—locals often help shovel snow from public paths, neighbors’ entrances, and shared spaces to keep the whole neighborhood safe and accessible.
                             Leaving large piles of snow blocking roads or sidewalks is frowned upon, as it inconveniences others and can cause accidents. This collective effort reflects the strong sense of cooperation and mutual support that is typical of life in Akita’s snowy regions, where everyone pitches in to make the winter easier for all.</p>
                    </li>
                            </ul>

                    <h2>2. Miyagi</h2>
                    <ul class="rules-list">
                        <li>
                        <h3>1.Respect the tradition of “Zunda” sweets</h3>
                        <img src="./img/zunda_mochi.jpg" alt="Zunda Sweets" class="zunda-image">
                        <p>In Miyagi, zunda, a sweet paste made from mashed edamame (young soybeans), is more than just a local snack—it’s a cherished symbol of the region’s culinary heritage. When offered zunda mochi or other zunda-based sweets, it’s important to accept them graciously and compliment the unique flavor.</p>
                        <p> Locals take pride in this traditional treat, which has been enjoyed for generations, and showing appreciation for zunda is a way of respecting Miyagi’s culture and history. Dismissing it or refusing it outright might be seen as a lack of understanding or appreciation for one of Miyagi’s most famous delicacies.</p>
                        </li>
                    
                        <li>
                            <h3>2. Celebrate cherry blossoms quietly in small groups</h3>
                            <p>In Miyagi, the tradition of enjoying cherry blossoms, especially in famous spots like Shiogama and Matsushima, is often done with a sense of calm and respect. Unlike the large, loud hanami parties you might see in bigger cities, locals prefer to celebrate the season quietly with close friends or family.</p>
                            <p> The focus is on appreciating the beauty of the blossoms in a peaceful atmosphere rather than making a noisy event out of it. Additionally, cleaning up thoroughly after hanami is an important part of the tradition, reflecting the local value placed on keeping nature and public spaces clean for everyone to enjoy year after year.
                        </li>

                        <li>
                            <h3>3. Don’t rush when visiting Matsushima</h3>
                            <p>Matsushima Bay, known as one of Japan’s three most scenic spots, is treasured by locals for its serene beauty and peaceful atmosphere. When visiting Matsushima, Miyagi locals believe in taking time to slowly enjoy the view rather than rushing through the area.
                                     Moving quickly, speaking loudly, or acting in a hurried way is seen as disrespectful to the natural environment and the cultural significance of the place. Visitors are encouraged to appreciate the scenery mindfully, soaking in the calm and tranquility that makes Matsushima so special to the people of Miyagi.</p>
                        </li>

                        <li>
                            <h3>4.Be mindful of spring water etiquette</h3>
                            <p>In certain areas of Miyagi, such as Zao and Shiroishi, natural spring water is considered pure, sacred, and even life-giving. Locals treat these water sources with quiet respect, not just as places to fill bottles but as part of the natural and spiritual landscape. When using these springs, it’s important to avoid wasting water, splashing, or washing dirty items in the area.</p>
                            <p> People often wait patiently in line, take only what they need, and make sure to leave the place clean. Being careless or treating the spring like a casual tap is frowned upon—respecting the water means respecting the land and the community that protects it.<p>
                        </li>

                        <li>
                            <h3>5.Visiting local shrines: remove hats and bow deeply</h3>
                            <p>When visiting local shrines in Miyagi, especially smaller or lesser-known ones in rural areas, showing proper respect is taken seriously. Locals often remove their hats before entering the shrine grounds as a sign of humility. It’s also common to bow deeply at the torii gate before entering and again when leaving. These gestures, though simple, carry deep cultural meaning and reflect a quiet reverence for the spiritual space. Acting casually, wearing hats, or skipping bows can come off as disrespectful, even if unintentionally. Following these small but important customs helps you connect with the local spirit of respect and tradition.<p>

                            </p>
                        </li>
                            </ul>
                    <ul class="rules-list">
                        <h2>3. Iwate</h2>
                        <li>
                            <h3>1.Don’t brag — stay humble like the locals</h3>
                            <p>In Iwate, modesty isn’t just polite—it’s a way of life. Whether in the cities like Morioka or in rural farming towns, locals value humility and quiet strength. Talking too much about your accomplishments, wealth, or personal successes can come off as boastful, even if you don’t mean it that way. Instead, people in Iwate tend to respect those who are soft-spoken, hardworking, and unassuming.</p>
                            <p> They believe that actions speak louder than words, and that pride should be shown through quiet dedication, not loud declarations. To fit in with the local spirit, it’s best to let your kindness and effort speak for you.</p>
                        </li>
                        
                        <li>
                            <h3>2.Know how to eat Wanko Soba properly</h3>
                                <p>Wanko Soba is one of Iwate’s most famous food traditions, especially in Morioka and Hanamaki, and it comes with its own set of unspoken rules. When you sit down for Wanko Soba, servers will keep refilling your bowl with small portions of soba noodles as soon as you finish one—often at lightning speed. The key rule is this: if you want to stop, you must cover your bowl with a lid or place your hand over it.</p>
                                <img src="./img/wanko_soba.jpg" alt="Wanko Soba" class="wanko-image">
                                <p> Otherwise, they’ll keep serving you, and stopping without the signal may confuse the server or break the flow. It’s meant to be a fun and lively experience, but knowing how to follow the custom shows respect for the tradition and the people keeping it alive.</p>
                        </li>

                        <li>
                            <h3>3.Respect the rhythm of farming life</h3>
                                <p>In Iwate’s rural towns and villages, daily life is closely tied to the rhythms of farming and the changing seasons. Planting, tending, and harvesting crops—especially rice and vegetables—are deeply important, and entire communities coordinate their schedules around these periods. During busy times like planting in spring or harvesting in fall, people work from early morning until sunset, often with little time for rest.</p>
                                <p> Dropping by someone’s home unannounced or asking for help during these peak times can be seen as inconsiderate. Locals appreciate when visitors understand and respect this flow of life—where hard work, patience, and seasonal timing are everything.</p>
                        </li>
                        <li>
                            <h3>4. The forest is not a playground</h3>
                            <p>In Iwate, forests and mountains are not just beautiful natural spaces—they are places of deep spiritual and cultural meaning. Areas like Mt. Hayachine and the surrounding woods are often considered sacred, with many locals believing in the presence of mountain spirits or kami. Because of this, wandering off trails, shouting, or treating the forest like a place for casual play or selfies is seen as disrespectful.
                            <p>Locals move quietly and carefully through nature, showing deep respect for the land. If you're visiting these areas, it's important to stay on marked paths, avoid making noise, and treat the natural surroundings with the same reverence the locals do.</p>
                        </li>
                        <li>
                            <h3>5. Traditional festivals are about ancestors, not selfies</h3>
                            <p>In Iwate, traditional festivals—especially in places like Tōno, Oshu, and Hiraizumi—are not just fun events; they are sacred rituals that honor ancestors, spirits, and centuries-old customs. Ceremonies like kagura dances or shishi odori (deer dances) are often performed with a quiet, solemn respect. Locals attend not just to be entertained, but to connect with their community and pay homage to those who came before them.</p>
                            <p> Taking photos is usually allowed, but excessive picture-taking, loud talking, or posing for selfies during performances can feel intrusive or disrespectful. To truly appreciate the meaning behind these festivals, it’s important to observe with humility and understand that you’re witnessing something much deeper than a show.</p>
                        </li>
                        <li>
                            <h3>6. Accept homemade sake or pickles with gratitude</h3>
                            <p>In Iwate, especially in the countryside, being offered homemade items like sake, pickled vegetables, or mountain vegetables (sansai) is a heartfelt gesture of hospitality. These gifts often represent hours of careful preparation, family tradition, and pride in local ingredients. Even if you’re unfamiliar with the flavors or unsure how to eat them, refusing or reacting negatively can come across as disrespectful. </p>
                            <img src="./img/sake.jpg" alt="Homemade Sake" class="sake-image">
                            <p>The polite and appreciated response is to accept them with a smile and a word of thanks—even a small taste shows respect. In Iwate, such gestures aren’t just about food—they’re a quiet way of saying, “You’re welcome here.”</p>
                        </li>
                        <li>
                            <h3>7. Pay quiet respect at Jizo statues and roadside shrines</h3>
                            <p>Throughout Iwate, especially along mountain paths and rural roads, you’ll often come across small Jizo statues or humble roadside shrines. These are not just decorations—they hold deep spiritual meaning and are often placed to protect travelers, honor ancestors, or remember those who passed away. Locals typically bow slightly or silently acknowledge these spots when passing by, even while driving or walking.</p>
                            <p>Speaking loudly, touching offerings, or treating these shrines as photo props is considered highly disrespectful. Observing them quietly, even with a small nod, shows that you understand and respect the spiritual traditions that remain very much alive in Iwate’s everyday life.</p>
                        </li>
                    </ul>
                    </section>
                
                    <h2>4. Fukushima</h2>
                    <ul class="rules-list">
                    <li>
                        <h3>1. Respect the history and recovery spirit after the disaster</h3>
                        <p>The people of Fukushima carry a strong spirit of resilience and hope, having overcome the tremendous challenges of the 2011 earthquake, tsunami, and nuclear disaster. This history has deepened the bonds of the community and their mutual support, and efforts toward rebuilding the region continue even today. When visiting Fukushima, it’s important to approach conversations about these events with sensitivity and respect.</p>
                        <p> Insensitive questions or assumptions can unintentionally hurt those who have endured such hardships. Visitors who show empathy and honor the strength and determination of the locals help acknowledge and celebrate the ongoing recovery of the area.</p>
                        </li>

                        <li>
                        <h3>2.Take your time appreciating scenic spots like Oze and Aizu</h3>
                        <p>In Fukushima, places like Oze Marshland and the traditional towns of Aizu are treasured for their natural beauty and rich history. Locals believe these spots deserve quiet, thoughtful visits rather than rushed sightseeing. Moving slowly and appreciating the landscape, the seasonal changes, and the cultural heritage allows you to truly connect with the spirit of the region. Loud noises, hurried tours,
                             or careless behavior are considered disrespectful to both nature and the local community. Taking your time shows reverence and helps preserve the peaceful atmosphere that makes these places so special.</p>
                        </li>

                        <li>
                        <h3>3. Don’t touch or climb on traditional fire festival floats</h3>
                        <p>Fukushima is known for vibrant fire festivals such as the Waraji Festival in Iwaki and the Oze Fire Festival, featuring elaborate and beautifully crafted floats. </p>
                        <p>These floats are considered sacred and fragile, embodying the spirit and history of the local community. Locals and festival organizers take great care to protect them, and touching or climbing on the floats is strictly forbidden. Such actions are seen as disrespectful and can damage these valuable cultural treasures. Visitors are encouraged to admire the floats from a respectful distance and honor the deep traditions they represent.</p>
                        </li>
                        
                        <li>
                        <h3>4. Visit Aizu shrines with humility and follow local etiquette</h3>
                        <p>In the Aizu region of Fukushima, visiting shrines is an important practice that involves specific customs reflecting deep respect and humility. When entering shrine grounds, locals typically remove their hats as a sign of reverence, and it is customary to bow deeply both upon entering and leaving. There are often cleansing rituals, such as washing hands and rinsing the mouth at the temizuya (water pavilion), which visitors are expected to follow properly.</p>
                        <p>Ignoring these customs or acting casually can be seen as disrespectful. Embracing these traditions allows visitors to connect more meaningfully with the spiritual and cultural heritage of Aizu.</p>
                        </li>

                        <li>
                        <h3>5.Don’t decline a meal invitation, especially local specialties like Kitakata ramen</h3>
                        <img src="./img/kitakata_ramen.jpg" alt="Kitakata Ramen" class="kitakata-image">
                        <p>In Fukushima, especially in places like Kitakata and Aizu, sharing food is a heartfelt expression of hospitality. If a local invites you to try a dish—especially regional specialties like Kitakata ramen, handmade pickles, or seasonal vegetables—it’s more than just a meal; it’s a gesture of friendship and pride.</p>
                            <p> Refusing the offer, even politely, can come across as cold or ungrateful. Even if you’re not very hungry, accepting a small portion and showing appreciation is the respectful thing to do. In Fukushima, food is a way to connect—and saying yes to a meal is saying yes to that connection.</p>
                        </li>
                    </ul>
             </ol>
            

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
<script src="./js/tohoku.js"></script>
</body>
</html>