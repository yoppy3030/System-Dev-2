<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Garbage Disposal Rules in Japan</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="./css/garbage_styles.css">
</head>
<body>

  <header>
    <h1>Garbage Disposal Rules in Japan</h1>
    <p>For Foreign Residents</p>
  </header>

  <section class="category">
    <h2>🗑️ Garbage Categories</h2>

    <?php
    $categories = [
      [
        'title' => '1. Burnable Garbage (燃えるゴミ)',
        'items' => [
          '✔ Food waste, paper, cloth',
          '❌ Plastics with recycling marks'
        ]
      ],
      [
        'title' => '2. Non-Burnable Garbage (燃えないゴミ)',
        'items' => [
          '✔ Metal, glass, ceramics',
          '❌ Batteries (handled separately)'
        ]
      ],
      [
        'title' => '3. Recyclable Garbage (資源ごみ)',
        'items' => [
          '✔ PET bottles, cans, paper (cleaned & separated)',
          '✔ Tie newspapers and cardboard with string'
        ]
      ],
      [
        'title' => '4. Plastic Waste (プラスチックごみ)',
        'items' => [
          '✔ Marked with [プラ] symbol',
          '❌ Dirty plastic goes in burnable'
        ]
      ],
      [
        'title' => '5. Oversized Garbage (粗大ゴミ)',
        'items' => [
          '✔ Large items like furniture, bikes',
          '➤ Book pickup & pay fee at city office'
        ]
      ],
    ];

    foreach ($categories as $cat) {
      echo "<div class='card'>";
      echo "<h3>{$cat['title']}</h3><ul>";
      foreach ($cat['items'] as $item) {
        echo "<li>$item</li>";
      }
      echo "</ul></div>";
    }
    ?>
  </section>

  <section class="rules">
    <h2>🧾 General Rules</h2>
    <ul>
      <li>🗓️ Check your city's garbage schedule</li>
      <li>📦 Use official trash bags from stores</li>
      <li>🧼 Clean bottles/cans before recycling</li>
      <li>📍 Use the right disposal spot</li>
      <li>🕗 Dispose garbage at the right time</li>
    </ul>
  </section>

  <footer>
    <p>Contact your ward office or landlord for more details.</p>
  </footer>

</body>
</html>
