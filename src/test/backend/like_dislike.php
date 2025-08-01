<?php
//エラー表示を有効にする
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

session_start();
//セッションを開始する
require __DIR__ . '/config.php';



header('Content-Type: application/json'); //json形式でのレスポンスを設定

$response = ['success' => false, 'message' => '']; // 統一されたレスポンス構造

$user_id = $_SESSION['user_id'] ?? null;

//ユーザーIDをセッションから取得
$target_id = $_REQUEST['target_id'] ?? null; // $_REQUESTはGETまたはPOSTから取得するためのもの
$target_type = $_REQUEST['target_type'] ?? null;

// is_likeはPOSTリクエストにのみ関連します
$is_like = isset($_POST['is_like']) ? (int) $_POST['is_like'] : null;

// GETまたはPOSTのリクエストに対する基本的なパラメータチェック
if (!$target_id || !$target_type) {
    http_response_code(400); 
    $response['message'] = "Missing target_id or target_type.";
    echo json_encode($response);
    exit();
}

try {
    //like と dislike の処理
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!$user_id) {
            http_response_code(401); 
            $response['message'] = "like/dislike にはログインが必要です。";
            echo json_encode($response);
            exit();
        }

        // is_likeの確認（POST用）
        if ($is_like === null || ($is_like !== 0 && $is_like !== 1)) {
            http_response_code(400); 
            $response['message'] = "'is_like'の値は0または1でなければなりません。";
            echo json_encode($response);
            exit();
        }

        // トランザクションの開始
        $pdo->beginTransaction();

        // ユーザーがすでにこのターゲットに対して反応（likeまたはdislike）しているか確認
        $stmt = $pdo->prepare("SELECT id, is_like FROM likes WHERE user_id = ? AND target_id = ? AND target_type = ?");
        $stmt->execute([$user_id, $target_id, $target_type]);
        $existing = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
            // ユーザーはすでにこのターゲットに対して反応しています
            if ((int)$existing['is_like'] === $is_like) {
                // 新しい反応が既存のものと同じ場合、削除します（トグルオフ）
                $stmt = $pdo->prepare("DELETE FROM likes WHERE id = ?");
                $stmt->execute([$existing['id']]);
                $response['message'] = "アクションが削除されました。";
            } else {
                // 新しい反応が既存のものと異なる場合、更新します
                $stmt = $pdo->prepare("UPDATE likes SET is_like = ? WHERE id = ?");
                $stmt->execute([$is_like, $existing['id']]);
                $response['message'] = "アクションが更新されました。";
            }
        } else {
            // 既存の反応がない場合、新規挿入
            $stmt = $pdo->prepare("INSERT INTO likes (user_id, target_id, target_type, is_like) VALUES (?, ?, ?, ?)");
            $stmt->execute([$user_id, $target_id, $target_type, $is_like]);
            $response['message'] = "アクションが記録されました。";
        }

        $pdo->commit(); // トランザクションをコミット

    }

    // --- 新しいカウントの取得（GETおよびPOSTリクエスト用） ---
    // この部分は、すべてのPOSTアクションの後に実行されます（新しい合計を返すため）、
    // または直接GETリクエストのために（現在の合計を取得するため）。
    $stmt = $pdo->prepare("
        SELECT
            SUM(CASE WHEN is_like = 1 THEN 1 ELSE 0 END) AS likes,
            SUM(CASE WHEN is_like = 0 THEN 1 ELSE 0 END) AS dislikes
        FROM likes
        WHERE target_id = ? AND target_type = ?
    ");
    $stmt->execute([$target_id, $target_type]);
    $counts = $stmt->fetch(PDO::FETCH_ASSOC);

    // いいね/よくないねがない場合の処理（SUMは行が見つからないとnullを返す）
    $likes = (int)($counts['likes'] ?? 0);
    $dislikes = (int)($counts['dislikes'] ?? 0);

    $response['success'] = true;
    $response['likes'] = $likes;
    $response['dislikes'] = $dislikes;
    $response['target_id'] = $target_id; // デバッグ用

    echo json_encode($response);

} catch (PDOException $e) {
    // PDOエラーが発生した場合、トランザクションをロールバック
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Database error in like_dislike.php: " . $e->getMessage());
    http_response_code(500); // サーバー内部エラー
    $response['success'] = false;
    $response['message'] = '内部サーバーエラーが発生しました。';
    // デバッグ用 : $response['details'] = $e->getMessage();
    echo json_encode($response);
} catch (Exception $e) {
    // 予期しないエラーが発生した場合
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("General error in like_dislike.php: " . $e->getMessage());
    http_response_code(500);
    $response['success'] = false;
    $response['message'] = '予期しないエラーが発生しました。';
    // デバッグ用 : $response['details'] = $e->getMessage();
    echo json_encode($response);
}

exit(); // JSONレスポンスを送信した後は常にexit
?>