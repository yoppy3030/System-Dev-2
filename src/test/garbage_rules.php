<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Garbage Disposal Rules in Japan</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Link to the CSS file -->
  <link rel="stylesheet" href="./css/garbage_styles.css">
  <!-- Link to Font Awesome for icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

  <!-- Page Header -->
  <header class="site-header">
    <div class="logo">JAPAN Life Manual</div>
    <nav class="main-nav">
      <a href="index.php">Home</a>
      <a href="studenthome.php">StudentHome</a>
      <!-- Language Selector Dropdown -->
      <div class="language-selector">
          <button id="translateBtn" class="translate-btn">🌐 Translate</button>
          <div class="language-dropdown">
              <button class="language-option" data-lang="ja">🇯🇵 日本語</button>
              <button class="language-option" data-lang="en">🇺🇸 English</button>
              <button class="language-option" data-lang="zh">🇨🇳 中文</button>
          </div>
      </div>
    </nav>
  </header>

  <!-- Hero section with title -->
  <div class="culture-hero">
      <div class="hero-content">
          <h1>Garbage Disposal Rules</h1>
          <p>A guide for foreign residents in Japan</p>
      </div>
  </div>

  <!-- Main content area -->
  <main class="culture-content">
    
    <!-- START: NEW AI-Powered Section -->
    <section class="card-style-section personalized-guide">
      <h2><i class="fas fa-map-marked-alt"></i> Personalized Local Guide</h2>
      <p>Get specific garbage collection details for your current location, powered by AI.</p>
      <!-- This button will trigger the JavaScript to get the user's location -->
      <button id="get-location-rules-btn" class="ai-button">
          <i class="fas fa-location-arrow"></i> Get My Location's Rules
      </button>
      <!-- This container will show the result from the AI -->
      <div id="ai-rules-container" style="display: none;">
          <!-- A loading spinner will show while waiting for the AI response -->
          <div id="ai-loading" class="loading-spinner"></div>
          <!-- The AI's response will be injected here -->
          <div id="ai-rules-result"></div>
      </div>
    </section>
    <!-- END: NEW AI-Powered Section -->

    <!-- Section for general garbage categories -->
    <section class="card-style-section">
      <h2>🗑️ Garbage Categories</h2>
      <p>In Japan, garbage is sorted into several categories. Check your local city's guide for specifics, but here are the common types:</p>
      <div class="category-container">
        <?php
        // PHP array to easily manage and display garbage categories
        $categories = [
          ['title' => 'Burnable Garbage (燃えるゴミ)', 'items' => ['Kitchen scraps, paper waste, wood, clothing.', 'Use your city\'s designated burnable garbage bags.'], 'icon' => 'fa-fire'],
          ['title' => 'Non-Burnable Garbage (燃えないゴミ)', 'items' => ['Small metals, glass, ceramics, broken umbrellas, batteries.', 'Place sharp items in a sturdy box and label it.'], 'icon' => 'fa-ban'],
          ['title' => 'Recyclable Garbage (資源ごみ)', 'items' => ['PET bottles (remove cap/label), cans, glass bottles.', 'Rinse them out before disposal.'], 'icon' => 'fa-recycle'],
          ['title' => 'Plastic Waste (プラスチックごみ)', 'items' => ['Items marked with the [プラ] symbol like food trays, wrappers, and shampoo bottles.', 'Rinse and clean them before disposal.'], 'icon' => 'fa-box'],
          ['title' => 'Oversized Garbage (粗大ゴミ)', 'items' => ['Items larger than 30cm, like furniture or bicycles.', 'You must book a pickup and pay a fee.'], 'icon' => 'fa-couch'],
        ];

        // Loop through the array to generate HTML for each category card
        foreach ($categories as $cat) {
          echo "<div class='card'>";
          echo "<h3><i class='fas {$cat['icon']}'></i> {$cat['title']}</h3><ul>";
          foreach ($cat['items'] as $item) {
            echo "<li>$item</li>";
          }
          echo "</ul></div>";
        }
        ?>
      </div>
    </section>

    <!-- Section for the 5 essential rules -->
    <section class="card-style-section">
      <h2>🧾 5 Essential Rules</h2>
      <div class="rules-list">
          <div class="rule-item">
              <i class="fas fa-calendar-alt"></i>
              <div>
                  <h4>Check your city's garbage schedule</h4>
                  <p>Each type of garbage has a specific collection day. Missing it means waiting another week!</p>
              </div>
          </div>
          <div class="rule-item">
              <i class="fas fa-shopping-bag"></i>
              <div>
                  <h4>Use official trash bags from stores</h4>
                  <p>You must buy designated bags from convenience stores or supermarkets. Using other bags will result in your trash being left behind.</p>
              </div>
          </div>
          <div class="rule-item">
              <i class="fas fa-hand-sparkles"></i>
              <div>
                  <h4>Clean bottles/cans before recycling</h4>
                  <p>Lightly rinse PET bottles, cans, and plastic containers to remove food residue before you sort them.</p>
              </div>
          </div>
          <div class="rule-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                  <h4>Use the right disposal spot</h4>
                  <p>Dispose of your trash at the designated collection point for your building, often a caged area or netted spot.</p>
              </div>
          </div>
          <div class="rule-item">
              <i class="fas fa-clock"></i>
              <div>
                  <h4>Dispose garbage at the right time</h4>
                  <p>Garbage should be put out on the morning of collection day (usually by 8 AM), not the night before, to prevent pests.</p>
              </div>
          </div>
      </div>
    </section>
  </main>

  <!-- Page Footer -->
  <footer>
    <div class="footer-content">
      <h2>JAPAN Life Manual</h2>
      <p>&copy; <?php echo date("Y"); ?>. All rights reserved.</p>
    </div>
  </footer>

  <!-- We need this library to convert the AI's markdown response into proper HTML -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <!-- Link to our custom JavaScript file -->
  <script src="./js/garbage_rules.js"></script>
</body>
</html>
