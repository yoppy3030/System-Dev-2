<?php
session_start();
require __DIR__ . '/backend/config.php';
// このファイルはユーザープロフィールの編集を処理します。
function set_flash_message($message, $type = 'success') {
    $_SESSION['flash_message'] = ['message' => $message, 'type' => $type];
}

//　ユーザーがログインしているか確認
// セッションにユーザーIDがない場合はログインページへリダイレクト
if (!isset($_SESSION['user_id'])) {
    set_flash_message('このページにアクセスするにはログインする必要があります。', 'error');
    header('Location: login.php');
    exit();
}

$user_id = (int)$_SESSION['user_id'];

// URLのidパラメータを確認（オプションで安全）
if (isset($_GET['id']) && (int)$_GET['id'] !== $user_id) {
    header("Location: Edit-profile.php"); // 別のIDの場合はIDパラメータなしでリダイレクト
    exit();
}

// ユーザーの現在のデータを取得（POST処理の前）
try {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        set_flash_message('ユーザーが見つかりませんでした。', 'error');
        header('Location: login.php'); // またはエラーページへ
        exit();
    }

    // 現在の連絡先を取得
    $stmt_contacts = $pdo->prepare("SELECT * FROM contacts WHERE user_id = ?");
    $stmt_contacts->execute([$user_id]);
    $contacts = $stmt_contacts->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    error_log("Error fetching user data in Edit-profile.php: " . $e->getMessage());
    set_flash_message('ユーザーのデータを読み込む際にサーバーエラーが発生しました。', 'error');
    header('Location: User_page.php'); // DBエラー時にリダイレクト
    exit();
}

// フォームの処理（POSTリクエストの場合）
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // POSTデータの取得とフィルタリング
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $bio = filter_input(INPUT_POST, 'bio', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    $location = filter_input(INPUT_POST, 'location', FILTER_SANITIZE_FULL_SPECIAL_CHARS);
    // activityはラジオボタンなので、直接取得
    // フィルタリングは後で行う（値が無効な場合はデフォルト値に設定）
    // activityの値は、ラジオボタンの選択肢から取得
    $activity = filter_input(INPUT_POST, 'activity', FILTER_SANITIZE_FULL_SPECIAL_CHARS);

    $errors = [];

    // フィールドのバリデーション
    if (empty($username)) {
        $errors[] = 'ユーザー名は必須です。';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = '無効なメールアドレスです。';
    }
    if (empty($email)) {
        $errors[] = 'メールアドレスは必須です。';
    }
    // ユーザーの現在のメールアドレスでない限り、メールアドレスの一意性を確認
    try {
        $stmt_email = $pdo->prepare("SELECT COUNT(*) FROM users WHERE email = ? AND id != ?");
        $stmt_email->execute([$email, $user_id]);
        if ($stmt_email->fetchColumn() > 0) {
            $errors[] = 'このメールアドレスは別のアカウントで既に使用されています。';
        }
    } catch (PDOException $e) {
        error_log("Email uniqueness check error: " . $e->getMessage());
        $errors[] = 'メールアドレスの確認中にエラーが発生しました。';
    }


    // activityの有効な値を確認
    $valid_activities = ['Tourist', 'International Student', 'Professional', 'other'];
    if (!in_array($activity, $valid_activities)) {
        $activity = 'other'; // 無効な場合はデフォルト値に設定
    }

    $avatar_path = $user['avatar']; // デフォルトでは古いアバターを保持

    // アバターのアップロード処理
    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $file_tmp = $_FILES['avatar']['tmp_name'];
        $file_type = mime_content_type($file_tmp);

        if (!in_array($file_type, $allowed_types)) {
            $errors[] = 'アバターのファイルタイプは許可されていません。';
        } else if ($_FILES['avatar']['size'] > 3 * 1024 * 1024) { // サイズ制限（例：5MB）
            $errors[] = 'アバターのファイルサイズが大きすぎます（最大5MB）。';
        } else {
            // セキュアなユニーク名を生成
            $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
            $avatar_name = uniqid('avatar_') . '.' . $ext;
            $avatar_dir = __DIR__ . '../uploads/'; // user_script.jsと整合性のある保存パス
            if (!is_dir($avatar_dir)) {
                mkdir($avatar_dir, 0755, true);
            }
            $new_avatar_full_path = $avatar_dir . $avatar_name;

            if (move_uploaded_file($file_tmp, $new_avatar_full_path)) {
                // 古いアバターを削除（存在する場合）
                if ($user['avatar'] && $user['avatar'] !== 'images/default-avatar.png' && file_exists(__DIR__ . '/' . $user['avatar'])) {
                    unlink(__DIR__ . '/' . $user['avatar']);
                }
                // DB用の相対パス
                $avatar_path = './uploads/' . $avatar_name;
            } else {
                $errors[] = 'アバターのアップロード中にエラーが発生しました。';
            }
        }
    }

    if (empty($errors)) {
        try {
            // ユーザー情報の更新
            $stmt = $pdo->prepare("UPDATE users SET username=?, email=?, bio=?, location=?, activity=?, avatar=? WHERE id=?");
            $stmt->execute([$username, $email, $bio, $location, $activity, $avatar_path, $user_id]);

            // コンタクト情報の更新
            $platforms = $_POST['platforms'] ?? [];
            $links = $_POST['links'] ?? [];

            // コンタクト情報の削除
            $pdo->prepare("DELETE FROM contacts WHERE user_id = ?")->execute([$user_id]);

            // 新しいコンタクト情報の挿入
            if (is_array($platforms) && is_array($links)) {
                $insert_contact_stmt = $pdo->prepare("INSERT INTO contacts (user_id, platform, link) VALUES (?, ?, ?)");

                foreach ($platforms as $index => $platform_value) {
                    $link_value = $links[$index] ?? ''; // プラットフォーム　リンクがない場合は空文字
                    $platform_clean = trim(filter_var($platform_value, FILTER_SANITIZE_FULL_SPECIAL_CHARS));
                    $link_clean = trim(filter_var($link_value, FILTER_SANITIZE_URL));

                    // プラットフォームとリンクが空でない場合のみ挿入
                    if (!empty($platform_clean) && filter_var($link_clean, FILTER_VALIDATE_URL)) {
                        $insert_contact_stmt->execute([$user_id, $platform_clean, $link_clean]);
                    }
                }
            }

            set_flash_message('Profil mis à jour avec succès !');
            header("Location: User_page.php?id=$user_id");
            exit();

        } catch (PDOException $e) {
            error_log("Database update error in Edit-profile.php: " . $e->getMessage());
            set_flash_message('プロフィールの更新中にサーバーエラーが発生しました。', 'error');
            // ユーザーのデータを再読み込み（更新の一部が失敗した場合に備えて）
            $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
            $stmt->execute([$user_id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            // $stmt_contacts = $pdo->prepare("SELECT * FROM contacts WHERE user_id = ?");
            // $stmt_contacts->execute([$user_id]);
            // $contacts = $stmt_contacts->fetchAll(PDO::FETCH_ASSOC);
        }
    } else {
        // バリデーションエラーがある場合は、ページに表示
        set_flash_message(implode('<br>', $errors), 'error');
        // $userと$contactsの現在のデータはすでにフォーム用に読み込まれています
    }
}

// フラッシュメッセージの取得（表示用）
$flash_message = null;
if (isset($_SESSION['flash_message'])) {
    $flash_message = $_SESSION['flash_message'];
    unset($_SESSION['flash_message']); // メッセージを取得した後に削除
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
                    <i class="fas fa-camera"></i> Changer la photo
                </label>
                <input type="file" id="avatarInput" name="avatar" accept="image/*" style="display: none;">
            </div>

            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" value="<?= htmlspecialchars($user['username'] ?? '') ?>" required>
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
                    $current_activity = $user['activity'] ?? ''; 
                    foreach ($options as $opt) {
                        $checked = (strtolower($opt) === strtolower($current_activity)) ? 'checked' : '';
                        echo "<label>
                                <input type='radio' name='activity' value='" . htmlspecialchars($opt) . "' $checked>
                                <span></span> " . htmlspecialchars($opt) . "
                              </label>";
                    }
                    ?>
                </div>
            </div>

            <!-- <div class="form-group" id="social-container">
                <label>Réseaux sociaux</label>
                <?php
                $socials_options = ['Github', 'LinkedIn', 'Twitter', 'Facebook', 'Instagram', 'Personal Website', 'Other'];

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
                        echo '<button type="button" class="remove-social-link"><i class="fas fa-times"></i></button>'; 
                        echo '</div>';
                    }
                } else {
                    // 初期状態でのソーシャルリンクグループを表示
                    echo '<div class="social-link-group">';
                    echo '<select name="platforms[]">';
                    foreach ($socials_options as $s_opt) {
                        echo "<option value='" . htmlspecialchars($s_opt) . "'>" . htmlspecialchars($s_opt) . "</option>";
                    }
                    echo '</select>';
                    echo '<input type="url" name="links[]" placeholder="https://..." required>';
                    echo '<button type="button" class="remove-social-link"><i class="fas fa-times"></i></button>';
                    echo '</div>';
                }
                ?>
                <button type="button" id="add-social-link" class="add-button"><i class="fas fa-plus"></i> Ajouter un lien social</button>
            </div>--->

            <div class="form-actions">
                <a href="User_page.php" class="cancel-btn">Cancel</a>
                <button type="submit" class="save-btn">Save</button>
            </div>
        </form>
    </main>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // アバターのプレビュー機能
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

        // ソーシャルリンクの追加機能
        // ソーシャルリンクのコンテナと追加ボタンを取得
        const socialContainer = document.getElementById('social-container');
        const addSocialLinkButton = document.getElementById('add-social-link');

        // ソーシャルリンクのオプションを動的に生成
        const socialOptionsHtml = `
            <?php foreach ($socials_options as $s_opt): ?>
                <option value="<?= htmlspecialchars($s_opt) ?>"><?= htmlspecialchars($s_opt) ?></option>
            <?php endforeach; ?>
        `;

        // ソーシャルリンクのグループを追加する関数
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
            // ボタンの前に挿入
            socialContainer.insertBefore(newGroup, addSocialLinkButton);
        }

        // 追加ボタンのイベントリスナーを設定
        if (addSocialLinkButton) {
            addSocialLinkButton.addEventListener('click', addSocialLinkGroup);
        }

        // ソーシャルリンクの削除機能 (イベントの委任)
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
    // メッセージ表示関数
    // この関数は、メッセージを画面上に表示するためのものです。
    // typeは'success'または'error'を指定できます。
    window.displayMessage = function(message, type = 'success') {
        const messageContainer = document.getElementById('message-container'); 
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
            document.body.prepend(newContainer); // 新しいコンテナをbodyの先頭に追加
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

        messageContainer.prepend(messageDiv); // 新しいメッセージをメッセージリストの先頭に追加

        setTimeout(() => {
            messageDiv.style.opacity = '1';
        }, 10); // 少し遅延を入れてフェードイン効果を適用

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            messageDiv.addEventListener('transitionend', () => messageDiv.remove());
        }, 5000); // 5秒後に削除
    };
</script>
</body>
</html>