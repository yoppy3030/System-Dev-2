<?php
session_start();
require __DIR__ . '/backend/config.php';
// Fonction pour définir un message flash
function set_flash_message($message, $type = 'success') {
    $_SESSION['flash_message'] = ['message' => $message, 'type' => $type];
}

// Redirection si non connecté
if (!isset($_SESSION['user_id'])) {
    set_flash_message('Vous devez être connecté pour accéder à cette page.', 'error');
    header('Location: login.php');
    exit();
}

$user_id = (int)$_SESSION['user_id'];

// Vérification paramètre id dans l’URL (optionnel et sécurisé)
// Redirige toujours vers l'édition du profil de l'utilisateur connecté
if (isset($_GET['id']) && (int)$_GET['id'] !== $user_id) {
    header("Location: Edit-profile.php"); // Redirige sans le paramètre ID si c'est un autre ID
    exit();
}
// Puis traitement mot de passe uniquement si rempli
    $success = null; 
    $current_password = $_POST['current_password'] ?? '';
    $new_password = $_POST['new_password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    if ($current_password || $new_password || $confirm_password) {
        // Vérification des 3 champs remplis
        if (empty($current_password) || empty($new_password) || empty($confirm_password)) {
            $errors[] = "Pour changer le mot de passe, remplissez tous les champs.";
        } elseif ($new_password !== $confirm_password) {
            $errors[] = "Le nouveau mot de passe et sa confirmation ne correspondent pas.";
        } else {
            // Vérifier mot de passe actuel dans la base
            $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            $user = $stmt->fetch();

            if (!$user || !password_verify($current_password, $user['password'])) {
                $errors[] = "Le mot de passe actuel est incorrect.";
            } else {
                // Mettre à jour le mot de passe
                $hashed = password_hash($new_password, PASSWORD_DEFAULT);
                $update = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
                $update->execute([$hashed, $user_id]);
                $success = "Mot de passe mis à jour avec succès.";
            }
        }
    }

// Récupérer les données actuelles de l’utilisateur AVANT le traitement POST
// Cela garantit que $user contient les données les plus récentes même si le POST échoue ou si on affiche juste le formulaire.
try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        set_flash_message('Utilisateur non trouvé.', 'error');
        header('Location: login.php'); // Ou vers une page d'erreur
        exit();
    }

    // Récupérer les contacts actuels
    $stmt_contacts = $pdo->prepare("SELECT * FROM contacts WHERE user_id = ?");
    $stmt_contacts->execute([$user_id]);
    $contacts = $stmt_contacts->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    error_log("Error fetching user data in Edit-profile.php: " . $e->getMessage());
    set_flash_message('Erreur du serveur lors du chargement des données de l\'utilisateur.', 'error');
   // header('Location: User_page.php'); // Redirige en cas d'erreur de DB
    exit();
}

// Traitement du formulaire LORSQUE la requête est POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupération et filtration des données POST
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $bio = filter_input(INPUT_POST, 'bio', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $location = filter_input(INPUT_POST, 'location', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    // Correction: Le champ doit être 'activity' en cohérence avec la DB et les discussions
    $activity = filter_input(INPUT_POST, 'activity', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    $errors = [];

    // Validation des champs
    if (empty($username)) {
        $errors[] = 'Le nom d\'utilisateur est requis.';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Adresse email invalide.';
    }
    if (empty($email)) {
        $errors[] = 'L\'adresse email est requise.';
    }
    // Vérifier l'unicité de l'email (sauf si c'est l'email actuel de l'utilisateur)
    try {
        $stmt_email = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ? AND id != ?");
        $stmt_email->execute([$email, $user_id]);
        if ($stmt_email->fetchColumn() > 0) {
            $errors[] = 'Cette adresse email est déjà utilisée par un autre compte.';
        }
    } catch (PDOException $e) {
        error_log("Email uniqueness check error: " . $e->getMessage());
        $errors[] = 'Erreur lors de la vérification de l\'email.';
    }


    // Vérifier valeurs valides pour activity
    $valid_activities = ['Tourist', 'International Student', 'Professional', 'other'];
    if (!in_array($activity, $valid_activities)) {
        $activity = 'other'; // Valeur par défaut si non valide
    }

    $avatar_path = $user['avatar']; // Par défaut, conserver l'ancien avatar

    // Gestion upload avatar
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $file_tmp = $_FILES['avatar']['tmp_name'];
        $file_type = mime_content_type($file_tmp);

        if (!in_array($file_type, $allowed_types)) {
            $errors[] = 'Type de fichier avatar non autorisé.';
        } else if ($_FILES['avatar']['size'] > 2 * 1024 * 1024) { // Limite taille (ex: 2MB)
            $errors[] = 'Fichier avatar trop volumineux (max 2MB).';
        } else {
            // Générer un nom unique sécurisé
            $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
            $avatar_name = uniqid('avatar_') . '.' . $ext;
            $avatar_dir = __DIR__ . '../uploads/'; // Chemin de sauvegarde cohérent avec user_script.js
            if (!is_dir($avatar_dir)) {
                mkdir($avatar_dir, 0755, true);
            }
            $new_avatar_full_path = $avatar_dir . $avatar_name;

            if (move_uploaded_file($file_tmp, $new_avatar_full_path)) {
                // Supprimer l'ancien avatar si ce n'est pas l'avatar par défaut et qu'il existe
                if ($user['avatar'] && $user['avatar'] !== 'images/default-avatar.png' && file_exists(__DIR__ . '/' . $user['avatar'])) {
                    unlink(__DIR__ . '/' . $user['avatar']);
                }
                // Chemin relatif pour la DB
                $avatar_path = './uploads/' . $avatar_name;
            } else {
                $errors[] = 'Erreur lors de l\'upload de l\'avatar.';
            }
        }
    }

    if (empty($errors)) {
        try {
            // Update de la table users
            $stmt = $pdo->prepare("UPDATE users SET username=?, email=?, bio=?, location=?, activity=?, avatar=? WHERE id=?");
            $stmt->execute([$username, $email, $bio, $location, $activity, $avatar_path, $user_id]);

            // Gestion contacts
            $platforms = $_POST['platforms'] ?? [];
            $links = $_POST['links'] ?? [];

            // Supprimer TOUS les contacts existants de l'utilisateur
            $pdo->prepare("DELETE FROM contacts WHERE user_id = ?")->execute([$user_id]);

            // Insertion des nouveaux contacts (ou des contacts mis à jour)
            if (is_array($platforms) && is_array($links)) {
                $insert_contact_stmt = $pdo->prepare("INSERT INTO contacts (user_id, name, platform, link) VALUES (?, ?, ?, ?)");

                foreach ($platforms as $index => $platform_value) {
                    $link_value = $links[$index] ?? ''; // S'assurer qu'il y a un lien pour chaque plateforme
                    $platform_clean = trim(filter_var($platform_value, FILTER_SANITIZE_FULL_SPECIAL_CHARS));
                    $link_clean = trim(filter_var($link_value, FILTER_SANITIZE_URL));

                    // Valider l'URL avant insertion
                    if (!empty($platform_clean) && filter_var($link_clean, FILTER_VALIDATE_URL)) {
                        $insert_contact_stmt->execute([$user_id, $name, $platform_clean, $link_clean]);
                    }
                }
            }

            set_flash_message('Profil mis à jour avec succès !');
            header("Location: User_page.php?id=$user_id");
            exit();

        } catch (PDOException $e) {
            error_log("Database update error in Edit-profile.php: " . $e->getMessage());
            set_flash_message('Erreur du serveur lors de la mise à jour du profil.', 'error');
            // Recharger les données de l'utilisateur au cas où une partie de l'update aurait échoué
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $stmt_contacts = $pdo->prepare("SELECT * FROM contacts WHERE user_id = ?");
            $stmt_contacts->execute([$user_id]);
            $contacts = $stmt_contacts->fetchAll(PDO::FETCH_ASSOC);
        }
    } else {
        // Si des erreurs de validation, les afficher sur la page
        set_flash_message(implode('<br>', $errors), 'error');
        // Les données actuelles de $user et $contacts sont déjà chargées pour le formulaire
    }
}

// Traitement pour l'affichage des messages flash
$flash_message = null;
if (isset($_SESSION['flash_message'])) {
    $flash_message = $_SESSION['flash_message'];
    unset($_SESSION['flash_message']); // Supprimer le message après l'avoir récupéré
}

?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Modifier mon profil - Japan Life Manual</title>
    <link rel="stylesheet" href="css/edit_profil.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header>
        <a href="User_page.php" class="back-button"><i class="fas fa-arrow-left"></i>Go back to profile</a>
    </header>

    <main class="edit-profile-container">
        <h1><i class="fas fa-user-edit"></i> Edit Profile</h1>

        <?php if ($flash_message): ?>
            <div class="flash-message flash-message-<?= htmlspecialchars($flash_message['type']) ?>">
                <?= $flash_message['message'] ?>
            </div>
        <?php endif; ?>

        <form id="editProfileForm" method="post" enctype="multipart/form-data">
            <div class="avatar-upload">
                <div class="avatar-preview">
                    <img id="avatarPreview" src="<?= htmlspecialchars($user['avatar'] ? $user['avatar'] : 'images/default-avatar.png') ?>" alt="avatar" width="100">
                </div>
                <label for="avatarInput" class="upload-button">
                    <i class="fas fa-camera"></i> Change photo
                </label>
                <input type="file" id="avatarInput" name="avatar" accept="image/*" style="display: none;">
            </div>

            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" value="<?= htmlspecialchars($user['username'] ?? '') ?>" required autocomplete="username">
            </div>

            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="<?= htmlspecialchars($user['email'] ?? '') ?>" required>
            </div>

            <div class="form-group">
                <label for="bio">Short Bio</label>
                <textarea id="bio" name="bio" rows="4"><?= htmlspecialchars($user['bio'] ?? '') ?></textarea>
            </div>

            <div class="form-group">
                <label>City</label>
                <select id="location" name="location">
                    <option value="">Select your city</option>
                    <option value="tokyo" <?= ($user['location'] ?? '') === 'tokyo' ? 'selected' : '' ?>>Tokyo</option>
                    <option value="osaka" <?= ($user['location'] ?? '') === 'osaka' ? 'selected' : '' ?>>Osaka</option>
                    <option value="kyoto" <?= ($user['location'] ?? '') === 'kyoto' ? 'selected' : '' ?>>Kyoto</option>
                    <option value="other" <?= ($user['location'] ?? '') === 'other' ? 'selected' : '' ?>>Other</option>
                </select>
            </div>

            <div class="form-group">
                <label>Status</label>
                <div class="status-options">
                    <?php
                    $options = ['Tourist', 'International Student', 'Professional', 'Other'];
                    $current_activity = $user['activity'] ?? ''; // Correction: utilise 'activity'
                    foreach ($options as $opt) {
                        $checked = (strtolower($opt) === strtolower($current_activity)) ? 'checked' : ''; // Comparaison insensible à la casse
                        echo "<label>
                                <input type='radio' name='activity' value='" . htmlspecialchars($opt) . "' $checked>
                                <span></span> " . htmlspecialchars($opt) . "
                              </label>";
                    }
                    ?>
                </div>
            </div>
            <?php if (!empty($errors)): ?>
                <div class="alert error"><?= implode('<br>', $errors) ?></div>
            <?php elseif ($success): ?>
                <div class="alert success"><?= $success ?></div>
            <?php endif; ?>
            <div class="form-group">
                <h3>Change Password</h3>
                <p>Leave the fields empty if you don't want to change your password.</p>
                  <label>Current Password:</label>
                  <input type="password" name="current_password" autocomplete="current-password">

    
                  <label>New Password:</label>
                  <input type="password" name="new_password" autocomplete="new-password">

                  <label>Confirm New Password:</label>
                  <input type="password" name="confirm_password" autocomplete="new-password">
                
            </div>


            <div class="form-group" id="social-container">
                <label>Social Media Links</label>
                <?php
                $socials_options = ['Github', 'LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'Personal Website', 'Other']; // Options possibles pour les plateformes

                if (!empty($contacts)) {
                    foreach ($contacts as $c) {
                        echo '<div class="social-link-group">';
                        echo '<select name="platforms[]">';
                        foreach ($socials_options as $s_opt) {
                            $sel = (strtolower($s_opt) === strtolower($c['platform'])) ? 'selected' : '';
                            echo "<option value='" . htmlspecialchars($s_opt) . "' $sel>" . htmlspecialchars($s_opt) . "</option>";
                        }
                        echo '</select>';
                        echo '<input type="url" name="links[]" value="' . htmlspecialchars($c['link']) . '" placeholder="https://..." required>';
                        echo '<button type="button" class="remove-social-link"><i class="fas fa-times"></i></button>'; // Bouton supprimer
                        echo '</div>';
                    }
                } else {
                    // Afficher un champ vide si aucun contact n'existe
                    echo '<div class="social-link-group">';
                    echo '<select name="platforms[]">';
                    foreach ($socials_options as $s_opt) {
                        echo "<option value='" . htmlspecialchars($s_opt) . "'>" . htmlspecialchars($s_opt) . "</option>";
                    }
                    echo '</select>';
                    echo '<input type="url" name="links[]" placeholder="https://..." required>';
                    echo '<button type="button" class="remove-social-link"><i class="fas fa-times"></i></button>'; // Bouton supprimer
                    echo '</div>';
                }
                ?>
                <button type="button" id="add-social-link" class="add-button"><i class="fas fa-plus"></i> Ajouter un lien social</button>
            </div>
            <div class="form-actions">
                <a href="User_page.php" class="cancel-btn">Cancel</a>
                <button type="submit" class="save-btn">Save</button>
            </div>
        </form>
    </main>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Prévisualisation de l'avatar
        const avatarInput = document.getElementById('avatarInput');
        const avatarPreview = document.getElementById('avatarPreview');

        if (avatarInput && avatarPreview) {
            avatarInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        avatarPreview.src = e.target.result;
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }

        // Gestion des liens sociaux (ajout/suppression dynamique)
        const socialContainer = document.getElementById('social-container');
        const addSocialLinkButton = document.getElementById('add-social-link');

        // Options HTML pour le sélecteur de plateforme (doit correspondre à $socials_options en PHP)
        const socialOptionsHtml = `
            <?php foreach ($socials_options as $s_opt): ?>
                <option value="<?= htmlspecialchars($s_opt) ?>"><?= htmlspecialchars($s_opt) ?></option>
            <?php endforeach; ?>
        `;

        // Fonction pour ajouter un nouveau groupe de lien social
        function addSocialLinkGroup() {
            const newGroup = document.createElement('div');
            newGroup.classList.add('social-link-group');
            newGroup.innerHTML = `
                <select name="platforms[]">
                    ${socialOptionsHtml}
                </select>
                <input type="url" name="links[]" placeholder="https://..." required>
                <button type="button" class="remove-social-link"><i class="fas fa-times"></i></button>
            `;
            // Insérer avant le bouton "Ajouter un lien social"
            socialContainer.insertBefore(newGroup, addSocialLinkButton);
        }

        // Écouteur pour le bouton "Ajouter un lien social"
        if (addSocialLinkButton) {
            addSocialLinkButton.addEventListener('click', addSocialLinkGroup);
        }

        // Gestion de la suppression des liens sociaux (délégation d'événement)
        if (socialContainer) {
            socialContainer.addEventListener('click', function(event) {
                if (event.target.closest('.remove-social-link')) {
                    const groupToRemove = event.target.closest('.social-link-group');
                    if (groupToRemove) {
                        groupToRemove.remove();
                    }
                }
            });
        }
    });

    // Fonction globale pour afficher les messages flash (si vous la définissez aussi dans user_script.js, assurez-vous qu'elle est bien globale)
    // Elle est ajoutée ici pour que les messages d'erreur du formulaire puissent s'afficher directement après un échec POST
    window.displayMessage = function(message, type = 'success') {
        const messageContainer = document.getElementById('message-container'); // Assurez-vous que cet ID existe dans votre HTML
        if (!messageContainer) {
            const newContainer = document.createElement('div');
            newContainer.id = 'message-container';
            newContainer.style.position = 'fixed';
            newContainer.style.top = '10px';
            newContainer.style.left = '50%';
            newContainer.style.transform = 'translateX(-50%)';
            newContainer.style.zIndex = '1000';
            newContainer.style.width = 'fit-content';
            newContainer.style.maxWidth = '90%';
            document.body.prepend(newContainer); // Ou body.appendChild(newContainer);
            messageContainer = newContainer;
        }

        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.padding = '10px 20px';
        messageDiv.style.margin = '5px 0';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        messageDiv.style.backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
        messageDiv.style.color = type === 'success' ? '#155724' : '#721c24';
        messageDiv.style.border = type === 'success' ? '1px solid #c3e6cb' : '1px solid #f5c6cb';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.opacity = '0';
        messageDiv.style.transition = 'opacity 0.5s ease-in-out';

        messageContainer.prepend(messageDiv); // Ajoute les nouveaux messages en haut de la liste des messages

        setTimeout(() => {
            messageDiv.style.opacity = '1';
        }, 10); // Laisse un court instant pour que le rendu se fasse avant l'animation

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.addEventListener('transitionend', () => messageDiv.remove());
        }, 5000); // Supprime après 5 secondes
    };
</script>
</body>
</html>