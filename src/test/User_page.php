<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/user_page.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
    <title>Document</title>
</head>
<body>
    <!-- Header -->
    
  <header>
   <div class="dropdown-menu">
    <!-- Menu Bouton -->
    <button class="dropdown-btn" id="dropdown-btn">
        <i class="fas fa-bars"></i> Menu
    </button>
    
    <!-- mask content-->
    <div class="dropdown-content" id="dropdown-content">
        <a href="#">My page</a>
        <a href="#">contact</a>
        <a href="#">Blog</a>
    </div>
</div>
   
  <div class="logo">
    <i class="fas fa-book icon"></i>
    <h3>Japan life Manual</h3>
  </div>

    <div class="menu-item">
     <a href="index.php"><i class="fas fa-house icon"></i> <!-- Home -->
      <p>HOME</p></a> 
    </div>

    <div class="menu-item">
      <a href="studenthome.php">
          <i class="fas fa-user-graduate icon"></i> <!-- student -->
          <p>Student</p>
      </a>
    </div>

    <div class="menu-item">
      <a href="professional.php">
          <i class="fas fa-briefcase icon"></i> <!-- professionnal -->
          <p>Professional</p>
      </a>
    </div>

    <div class="menu-item">
      <a href="">
          <i class="fas fa-blog icon"></i> <!-- blog -->
          <p>Blog</p>
      </a>
    </div>

    <div class="menu-item">
      <a href="">
          <i class="fas fa-user-plus icon"></i> <!-- resgistration -->
          <p>Sign Up</p>
      </a>
    </div>

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
</header>
    
    <!-- Main content -->
    <main>
      <div class="user-profile-container">
    <!--User profil -->
    <div class="profile-section">
        <div class="profile-header">
            <div class="profile-avatar">
                <img src="avatar.jpg" alt="Photo de profil" id="profile-pic">
                <input type="file" id="avatar-upload" accept="image/*" style="display:none">
                <button onclick="document.getElementById('avatar-upload').click()"><i class="fas fa-plus"></i>
</button>
            </div>
            <div class="profile-info">
                <h2 id="username">Jean Dupont</h2>
                <p id="user-bio">I like japanese culture and food</p>
                <button id="edit-profile-btn">Edit profile</button>
            </div>
        </div>

        <!-- editor formula (default hide) -->
        <div class="edit-profile-form" style="display:none">
            <input type="text" id="edit-username" placeholder="Nom d'utilisateur">
            <textarea id="edit-bio" placeholder="Votre bio..."></textarea>
            <button id="save-profile-btn">save</button>
        </div>
    </div>

    <!-- publish section-->
    <div class="posts-section">
        <!-- new post creation section -->
        <div class="create-post">
            <textarea placeholder="Partagez quelque chose..."></textarea>
            <div class="post-actions">
                <input type="file" id="post-image" accept="image/*">
                <button id="publish-btn">send</button>
            </div>
        </div>

        <!-- publication flux -->
        <div class="posts-feed">
            <!-- publication example-->
            <div class="post">
                <div class="post-header">
                    <img src="user1.jpg" class="post-avatar">
                    <span class="post-author">Marie Tanaka</span>
                    <span class="post-date">2 heures ago</span>
                </div>
                <div class="post-content">
                    <p>My trip in Kyoto was very nice , this is some picture for you guys</p>
                    <img src="kyoto.jpg" class="post-image">
                </div>
                <div class="post-interactions">
                    <button class="like-btn"><i class="fas fa-thumbs-up"></i> <span>12</span></button>
                    <button class="comment-btn"><i class="fas fa-comment"></i> Comment</button>
                </div>
                
                <!-- comment section -->
                <div class="comments-section">
                    <div class="comment">
                        <img src="user2.jpg" class="comment-avatar">
                        <div class="comment-content">
                            <strong>Pierre Sato</strong>
                            <p>beautifull photo ! I was there last month.</p>
                        </div>
                    </div>
                    <div class="add-comment">
                        <input type="text" placeholder="Ajouter un commentaire...">
                        <button><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    </main>
    <script src="./js/User_page.js"></script>
</body>
</html>