<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
require_once '../backend/config.php'; // データベース設定
// ▼▼▼【追加】PHPMailerの読み込み ▼▼▼
require_once '../chatBOT/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
// ▲▲▲

// .envファイルを読み込む
$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__) . '/chatBOT');
$dotenv->load();


/**
 * 現在のセッションのユーザーが管理者であるかを確認する
 */
function check_admin($pdo) {
    if (!isset($_SESSION['user_id'])) {
        return false;
    }
    try {
        $stmt = $pdo->prepare("SELECT is_admin FROM Accounts WHERE ID = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        return $user && $user['is_admin'];
    } catch (PDOException $e) {
        error_log("Admin check failed: " . $e->getMessage());
        return false;
    }
}

// --- メイン処理 ---
try {
    if (!check_admin($pdo)) {
        http_response_code(403);
        echo json_encode(['error' => '管理者権限がありません。']);
        exit;
    }

    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        $action = $_GET['action'] ?? '';
        switch ($action) {
            case 'get_dashboard_stats':
                $stmt_users = $pdo->query("SELECT COUNT(*) as total_users FROM Accounts");
                $total_users = $stmt_users->fetchColumn();
                echo json_encode(['total_users' => $total_users]);
                break;
            
            case 'get_feedback_stats':
                $stmt_helpful = $pdo->query("SELECT COUNT(*) FROM MessageFeedback WHERE feedback_type = 'helpful'");
                $helpful_count = $stmt_helpful->fetchColumn();
                $stmt_unhelpful = $pdo->query("SELECT COUNT(*) FROM MessageFeedback WHERE feedback_type = 'unhelpful'");
                $unhelpful_count = $stmt_unhelpful->fetchColumn();
                echo json_encode(['helpful' => $helpful_count, 'unhelpful' => $unhelpful_count]);
                break;
            
            case 'get_user_registration_stats':
                $stmt = $pdo->prepare("
                    SELECT DATE(RegistrationDate) as registration_day, COUNT(ID) as user_count
                    FROM Accounts
                    WHERE RegistrationDate >= CURDATE() - INTERVAL 6 DAY
                    GROUP BY DATE(RegistrationDate)
                    ORDER BY registration_day
                ");
                $stmt->execute();
                $results = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
                $labels = [];
                $data = [];
                for ($i = 6; $i >= 0; $i--) {
                    $date = date('Y-m-d', strtotime("-$i days"));
                    $labels[] = date('m/d', strtotime($date));
                    $data[] = $results[$date] ?? 0;
                }
                echo json_encode(['labels' => $labels, 'data' => $data]);
                break;
            
            // ▼▼▼【追加】お問い合わせ一覧取得アクション ▼▼▼
            case 'get_inquiries':
                $stmt = $pdo->query("SELECT id, name, email, message, replied, created_at FROM Inquiries ORDER BY created_at DESC");
                $inquiries = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($inquiries);
                break;
            // ▲▲▲

            case 'get_users':
                $stmt = $pdo->query("SELECT ID, Name, Email, UserType, RegistrationDate, is_admin FROM Accounts ORDER BY RegistrationDate DESC");
                $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($users as &$user) {
                    $user['is_admin'] = (bool)$user['is_admin'];
                }
                echo json_encode($users);
                break;

            case 'get_quizzes':
                $stmt = $pdo->query("SELECT id, difficulty, question, options, correct_answer_index, explanation FROM Quizzes ORDER BY id DESC");
                $quizzes = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach($quizzes as &$quiz) {
                    $quiz['question'] = json_decode($quiz['question'], true);
                    $quiz['options'] = json_decode($quiz['options'], true);
                    $quiz['explanation'] = json_decode($quiz['explanation'], true);
                }
                echo json_encode($quizzes);
                break;

            default:
                http_response_code(400);
                echo json_encode(['error' => '無効なGETアクションです。']);
                break;
        }
    } elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('無効なJSONデータです。', 400);
        }
        $action = $data['action'] ?? '';

        switch ($action) {
            // ▼▼▼【追加】お問い合わせ返信アクション ▼▼▼
            case 'send_reply':
                $recipient_email = $data['recipient_email'] ?? '';
                $recipient_name = $data['recipient_name'] ?? '';
                $subject = $data['subject'] ?? '';
                $message = $data['message'] ?? '';

                if (empty($recipient_email) || !filter_var($recipient_email, FILTER_VALIDATE_EMAIL) || empty($subject) || empty($message)) {
                    throw new Exception('入力データが無効です。', 400);
                }

                $mail = new PHPMailer(true);
                try {
                    $mail->isSMTP();
                    $mail->Host       = 'smtp.gmail.com';
                    $mail->SMTPAuth   = true;
                    $mail->Username   = $_ENV['GMAIL_ADDRESS'];
                    $mail->Password   = $_ENV['GMAIL_APP_PASSWORD'];
                    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                    $mail->Port       = 465;
                    $mail->CharSet    = 'UTF-8';

                    $mail->setFrom($_ENV['GMAIL_ADDRESS'], 'Japan Life Manual サポート');
                    $mail->addAddress($recipient_email, $recipient_name);
                    $mail->Subject = $subject;
                    $mail->Body    = $message;

                    $mail->send();
                    echo json_encode(['success' => true, 'message' => '返信を送信しました。']);
                } catch (Exception $e) {
                    throw new Exception("メールの送信に失敗しました: {$mail->ErrorInfo}", 500);
                }
                break;
            
            case 'mark_inquiry_replied':
                $inquiry_id = $data['inquiry_id'] ?? 0;
                if ($inquiry_id > 0) {
                    $stmt = $pdo->prepare("UPDATE Inquiries SET replied = 1 WHERE id = ?");
                    $stmt->execute([$inquiry_id]);
                    echo json_encode(['success' => true, 'message' => 'ステータスを更新しました。']);
                } else {
                    throw new Exception('無効なIDです。', 400);
                }
                break;
            // ▲▲▲

            case 'toggle_admin':
                $user_id = $data['user_id'] ?? 0;
                if ($user_id == $_SESSION['user_id']) {
                    throw new Exception('自分自身の管理者権限は変更できません。', 400);
                }
                $new_status = isset($data['is_admin']) ? (int)(bool)$data['is_admin'] : 0;
                $stmt = $pdo->prepare("UPDATE Accounts SET is_admin = ? WHERE ID = ?");
                $stmt->execute([$new_status, $user_id]);
                echo json_encode(['success' => true, 'message' => '管理者権限を更新しました。']);
                break;

            case 'delete_user':
                $user_id = $data['user_id'] ?? 0;
                if ($user_id == $_SESSION['user_id']) {
                    throw new Exception('自分自身のアカウントは削除できません。', 400);
                }
                $pdo->beginTransaction();
                try {
                    $related_tables = ['ChatHistories', 'PinnedMessages', 'QuizResults', 'LearnedTopics', 'MistakeNotes', 'UserAchievements', 'MessageFeedback'];
                    foreach ($related_tables as $table) {
                        $stmt = $pdo->prepare("DELETE FROM {$table} WHERE user_id = ?");
                        $stmt->execute([$user_id]);
                    }
                    $stmt = $pdo->prepare("DELETE FROM Accounts WHERE ID = ?");
                    $stmt->execute([$user_id]);
                    $pdo->commit();
                    echo json_encode(['success' => true, 'message' => 'ユーザーを完全に削除しました。']);
                } catch (Exception $e) {
                    $pdo->rollBack();
                    throw $e;
                }
                break;
            
            case 'update_user':
                $user_id = $data['user_id'] ?? 0;
                $name = trim($data['name'] ?? '');
                $email = trim($data['email'] ?? '');
                $user_type = $data['user_type'] ?? '';

                if (empty($user_id) || empty($name) || empty($email) || empty($user_type)) {
                    throw new Exception('すべてのフィールドを入力してください。', 400);
                }
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    throw new Exception('無効なメールアドレス形式です。', 400);
                }

                $stmt = $pdo->prepare("UPDATE Accounts SET Name = ?, Email = ?, UserType = ? WHERE ID = ?");
                $stmt->execute([$name, $email, $user_type, $user_id]);
                echo json_encode(['success' => true, 'message' => 'ユーザー情報を更新しました。']);
                break;

            case 'add_quiz':
            case 'update_quiz':
                $difficulty = $data['difficulty'];
                $options_array = $data['options']['ja'] ?? [];
                if (count(array_filter($options_array)) < 2) {
                     throw new Exception('少なくとも2つの選択肢が必要です。', 400);
                }
                $correct_index = $data['correct_answer_index'];
                if ($correct_index >= count($options_array) || empty($options_array[$correct_index])) {
                    throw new Exception('正解の選択肢が有効ではありません。', 400);
                }
                $question = json_encode($data['question'], JSON_UNESCAPED_UNICODE);
                $options = json_encode($data['options'], JSON_UNESCAPED_UNICODE);
                $explanation = json_encode($data['explanation'], JSON_UNESCAPED_UNICODE);

                if ($action === 'add_quiz') {
                    $sql = "INSERT INTO Quizzes (difficulty, question, options, correct_answer_index, explanation) VALUES (?, ?, ?, ?, ?)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$difficulty, $question, $options, $correct_index, $explanation]);
                    $message = 'クイズを新規追加しました。';
                } else { // update_quiz
                    $id = $data['id'];
                    $sql = "UPDATE Quizzes SET difficulty = ?, question = ?, options = ?, correct_answer_index = ?, explanation = ? WHERE id = ?";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$difficulty, $question, $options, $correct_index, $explanation, $id]);
                    $message = 'クイズを更新しました。';
                }
                echo json_encode(['success' => true, 'message' => $message]);
                break;

            case 'delete_quiz':
                $id = $data['id'];
                $stmt = $pdo->prepare("DELETE FROM Quizzes WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['success' => true, 'message' => 'クイズを削除しました。']);
                break;

            default:
                http_response_code(400);
                echo json_encode(['error' => '無効なPOSTアクションです。']);
                break;
        }
    } else {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => '許可されていないリクエストメソッドです。']);
    }

} catch (Exception $e) {
    http_response_code($e->getCode() >= 400 ? $e->getCode() : 500);
    error_log("Admin API Error: " . $e->getMessage());
    echo json_encode(['error' => $e->getMessage()]);
}
?>
