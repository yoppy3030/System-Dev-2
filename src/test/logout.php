<?php
// 1. セッションを開始します。
session_start();

// 2. 現在のセッションに関連する全てのデータを破棄します。
$_SESSION = array();

// 3. セッションクッキーを削除します。
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// 4. 最終的にセッションを破壊します。
session_destroy();

// 5. ★★★ 修正点: ログアウト後に、ホームページ(index.php)へリダイレクトします ★★★
header("Location: index.php");

// 6. リダイレクト後にスクリプトが実行され続けないように、必ずexit()を呼び出します。
exit();
?>
