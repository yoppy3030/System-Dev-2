<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Navbar Test | JAPAN Life Manual</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <link rel="stylesheet" href="./css/unified.css"/>
  <style>
    .test-info {
      background: #f0f0f0;
      padding: 20px;
      margin: 20px;
      border-radius: 8px;
      border-left: 4px solid #1e40af;
    }
    .test-info h3 {
      color: #1e40af;
      margin-bottom: 10px;
    }
    .test-info ul {
      margin-left: 20px;
    }
    .test-info li {
      margin-bottom: 5px;
    }
  </style>
</head>
<body>
  <!-- Navigation Bar -->
  <?php include 'includes/navbar.php'; ?>

  <!-- Test Content -->
  <main class="main-content">
    <section class="info-block">
      <h2><i class="fas fa-test-tube"></i> Unified Navbar Test</h2>
      
      <div class="test-info">
        <h3>✅ What's Working:</h3>
        <ul>
          <li>Same navbar across all pages</li>
          <li>Working dropdown menus (from professional.php)</li>
          <li>Consistent styling with unified.css</li>
          <li>PHP include approach (no JavaScript conflicts)</li>
          <li>All pages accessible through dropdowns</li>
          <li>Better contrast and visibility</li>
        </ul>
      </div>

      <div class="test-info">
        <h3>🧪 Test Instructions:</h3>
        <ul>
          <li>Click on any dropdown menu in the navigation</li>
          <li>Verify dropdowns open and close properly</li>
          <li>Test hover effects on desktop</li>
          <li>Click outside to close dropdowns</li>
          <li>Press Escape key to close dropdowns</li>
          <li>Test language selector dropdown</li>
        </ul>
      </div>

      <div class="test-info">
        <h3>📁 Converted Pages:</h3>
        <ul>
          <li>✅ culture.html → culture.php</li>
          <li>✅ daily-life.html → daily-life.php</li>
          <li>✅ festivals_holidays.html → festivals_holidays.php</li>
          <li>✅ cultural_etiquette_japan.html → cultural_etiquette_japan.php</li>
          <li>✅ about.html → about.php</li>
        </ul>
      </div>

      <div class="test-info">
        <h3>🔗 Quick Links:</h3>
        <ul>
          <li><a href="culture.php">Culture Page</a></li>
          <li><a href="daily-life.php">Daily Life Page</a></li>
          <li><a href="professional.php">Professional Page</a></li>
          <li><a href="about.php">About Page</a></li>
        </ul>
      </div>
    </section>
  </main>

  <script src="./js/shared-nav.js"></script>
</body>
</html> 