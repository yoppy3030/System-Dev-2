<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit my profil - Japan Life Manual</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="./css/edit_profil.css">
</head>
<body>
    <header>
        <!-- hedeaer-->
        <a href="User_page.php" class="back-button">
            <i class="fas fa-arrow-left"></i> Go back to profile
        </a>
    </header>

    <main class="edit-profile-container">
        <h1><i class="fas fa-user-edit"></i> Edit profil</h1>
        
        <form id="editProfileForm">
            <div class="avatar-upload">
                <div class="avatar-preview">
                    <img id="avatarPreview" src="./img/default-avatar.jpg" alt="Photo de profil">
                </div>
                <label for="avatarInput" class="upload-button">
                    <i class="fas fa-camera"></i> Change photo
                </label>
                <input type="file" id="avatarInput" accept="image/*">
            </div>

            <div class="form-group">
                <label for="username"><i class="fas fa-user"></i> User name</label>
                <input type="text" id="username" placeholder="Votre nom d'utilisateur" required>
            </div>

            <div class="form-group">
                <label for="email"><i class="fas fa-envelope"></i> Email</label>
                <input type="email" id="email" placeholder="votre@email.com" required>
            </div>

            <div class="form-group">
                <label for="bio"><i class="fas fa-pencil-alt"></i> Bio</label>
                <textarea id="bio" placeholder="Décrivez-vous en quelques mots..."></textarea>
            </div>

            <div class="form-group">
                <label><i class="fas fa-map-marker-alt"></i> City</label>
                <select id="location">
                    <option value="">select your city</option>
                    <option value="tokyo">Tokyo</option>
                    <option value="osaka">Osaka</option>
                    <option value="kyoto">Kyoto</option>
                    <option value="other">other</option>
                </select>
            </div>

            <div class="form-group">
                <label><i class="fas fa-user-tag"></i> Statut</label>
                <div class="status-options">
                    <label>
                        <input type="radio" name="status" value="student" checked>
                        <span class="radio-custom"></span>
                        Student
                    </label>
                    <label>
                        <input type="radio" name="status" value="professional">
                        <span class="radio-custom"></span>
                        Professional
                    </label>
                    <label>
                        <input type="radio" name="status" value="professional">
                        <span class="radio-custom"></span>
                        Other
                    </label>
                </div>
            </div>

            <div class="form-actions">
                <button type="button" class="cancel-btn">cancel</button>
                <button type="submit" class="save-btn">save</button>
            </div>
        </form>
    </main>

    <script src="js-edit.js"></script>
</body>
</html>