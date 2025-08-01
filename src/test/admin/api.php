<?php
header('Content-Type: application/json; charset=utf-8');
session_start();
require_once '../backend/config.php'; // データベース設定
require_once '../chatBOT/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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
            // (省略: get_dashboard_stats, get_feedback_stats, get_user_registration_stats は変更なし)
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

            // ★★★ 修正点: ページネーション対応 ★★★
            case 'get_users':
            case 'get_quizzes':
            case 'get_inquiries':
                $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
                $offset = ($page - 1) * $limit;

                $search = $_GET['search'] ?? '';
                $sort_column = $_GET['sort_column'] ?? null;
                $sort_direction = $_GET['sort_direction'] ?? 'asc';

                $where_clauses = [];
                $params = [];

                if ($action === 'get_users') {
                    $table = 'Accounts';
                    $columns = 'ID, Name, Email, UserType, RegistrationDate, is_admin';
                    $default_sort = 'RegistrationDate DESC';
                    if (!empty($search)) {
                        $where_clauses[] = '(Name LIKE ? OR Email LIKE ?)';
                        $params[] = "%$search%";
                        $params[] = "%$search%";
                    }
                    if (isset($_GET['role']) && $_GET['role'] !== 'all') {
                        $where_clauses[] = 'is_admin = ?';
                        $params[] = ($_GET['role'] === 'admin') ? 1 : 0;
                    }
                } elseif ($action === 'get_quizzes') {
                    $table = 'Quizzes';
                    $columns = 'id, difficulty, question, options, correct_answer_index, explanation';
                    $default_sort = 'id DESC';
                     if (!empty($search)) {
                        $where_clauses[] = 'JSON_UNQUOTE(JSON_EXTRACT(question, "$.ja")) LIKE ?';
                        $params[] = "%$search%";
                    }
                    if (isset($_GET['difficulty']) && $_GET['difficulty'] !== 'all') {
                        $where_clauses[] = 'difficulty = ?';
                        $params[] = $_GET['difficulty'];
                    }
                } else { // get_inquiries
                    $table = 'Inquiries';
                    $columns = 'id, name, email, message, replied, created_at';
                    $default_sort = 'created_at DESC';
                    if (isset($_GET['status']) && $_GET['status'] !== 'all') {
                        $where_clauses[] = 'replied = ?';
                        $params[] = ($_GET['status'] === 'replied') ? 1 : 0;
                    }
                }

                $where_sql = count($where_clauses) > 0 ? ' WHERE ' . implode(' AND ', $where_clauses) : '';

                // 総件数を取得
                $count_stmt = $pdo->prepare("SELECT COUNT(*) FROM {$table}" . $where_sql);
                $count_stmt->execute($params);
                $total_count = $count_stmt->fetchColumn();
                
                // データを取得
                $order_by_sql = $default_sort;
                if ($sort_column) {
                    // SQLインジェクションを防ぐため、許可されたカラム名か確認
                    $allowed_columns = explode(', ', str_replace('`', '', $columns));
                    if (in_array($sort_column, $allowed_columns) || strpos($sort_column, '.') !== false) {
                        $direction = strtoupper($sort_direction) === 'DESC' ? 'DESC' : 'ASC';
                        $order_by_sql = "{$sort_column} {$direction}";
                    }
                }

                $data_stmt = $pdo->prepare("SELECT {$columns} FROM {$table}" . $where_sql . " ORDER BY " . $order_by_sql . " LIMIT ? OFFSET ?");
                $data_params = array_merge($params, [$limit, $offset]);
                foreach ($data_params as $key => $val) {
                    $data_stmt->bindValue($key + 1, $val, is_int($val) ? PDO::PARAM_INT : PDO::PARAM_STR);
                }
                $data_stmt->execute();
                $data = $data_stmt->fetchAll(PDO::FETCH_ASSOC);

                if ($action === 'get_quizzes') {
                     foreach($data as &$quiz) {
                        $quiz['question'] = json_decode($quiz['question'], true);
                        $quiz['options'] = json_decode($quiz['options'], true);
                        $quiz['explanation'] = json_decode($quiz['explanation'], true);
                    }
                }
                if ($action === 'get_users') {
                    foreach ($data as &$user) {
                        $user['is_admin'] = (bool)$user['is_admin'];
                    }
                }

                echo json_encode(['data' => $data, 'total_count' => $total_count]);
                break;

            // (省略: backup_* 系のGETアクションは変更なし)
            case 'backup_inquiries':
                header('Content-Type: text/csv; charset=utf-8');
                header('Content-Disposition: attachment; filename="inquiries_backup_'.date('Y-m-d').'.csv"');
                $output = fopen('php://output', 'w');
                fputcsv($output, ['ID', 'Name', 'Email', 'Message', 'Replied', 'Received At']);
                
                $stmt = $pdo->query("SELECT id, name, email, message, replied, created_at FROM Inquiries ORDER BY id DESC");
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $row['replied'] = $row['replied'] ? 'Yes' : 'No';
                    fputcsv($output, $row);
                }
                fclose($output);
                exit;

            case 'backup_users':
                header('Content-Type: text/csv; charset=utf-8');
                header('Content-Disposition: attachment; filename="users_backup_'.date('Y-m-d').'.csv"');
                $output = fopen('php://output', 'w');
                fputcsv($output, ['ID', 'Name', 'Email', 'UserType', 'RegistrationDate', 'is_admin']);
                
                $stmt = $pdo->query("SELECT ID, Name, Email, UserType, RegistrationDate, is_admin FROM Accounts ORDER BY ID DESC");
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $row['is_admin'] = $row['is_admin'] ? 'Yes' : 'No';
                    fputcsv($output, $row);
                }
                fclose($output);
                exit;

            case 'backup_quizzes':
                header('Content-Type: text/csv; charset=utf-8');
                header('Content-Disposition: attachment; filename="quizzes_backup_'.date('Y-m-d').'.csv"');
                $output = fopen('php://output', 'w');
                fputcsv($output, [
                    'id', 'difficulty', 'question_ja', 'question_en', 'question_zh',
                    'option1_ja', 'option1_en', 'option1_zh',
                    'option2_ja', 'option2_en', 'option2_zh',
                    'option3_ja', 'option3_en', 'option3_zh',
                    'option4_ja', 'option4_en', 'option4_zh',
                    'correct_answer_index',
                    'explanation_ja', 'explanation_en', 'explanation_zh'
                ]);
                
                $stmt = $pdo->query("SELECT * FROM Quizzes ORDER BY id DESC");
                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    $question = json_decode($row['question'], true);
                    $options = json_decode($row['options'], true);
                    $explanation = json_decode($row['explanation'], true);

                    $csvRow = [
                        $row['id'], $row['difficulty'],
                        $question['ja'] ?? '', $question['en'] ?? '', $question['zh'] ?? '',
                        $options['ja'][0] ?? '', $options['en'][0] ?? '', $options['zh'][0] ?? '',
                        $options['ja'][1] ?? '', $options['en'][1] ?? '', $options['zh'][1] ?? '',
                        $options['ja'][2] ?? '', $options['en'][2] ?? '', $options['zh'][2] ?? '',
                        $options['ja'][3] ?? '', $options['en'][3] ?? '', $options['zh'][3] ?? '',
                        $row['correct_answer_index'],
                        $explanation['ja'] ?? '', $explanation['en'] ?? '', $explanation['zh'] ?? ''
                    ];
                    fputcsv($output, $csvRow);
                }
                fclose($output);
                exit;
            default:
                http_response_code(400);
                echo json_encode(['error' => '無効なGETアクションです。']);
                break;
        }
    } elseif ($method === 'POST') {
        // (省略: POST処理は変更なし)
        $input_data = json_decode(file_get_contents('php://input'), true);
        if (!empty($_POST)) {
            $data = $_POST;
            $action = $data['action'] ?? '';
        } else {
            if (json_last_error() !== JSON_ERROR_NONE) {
                 throw new Exception('無効なJSONデータです。', 400);
            }
            $data = $input_data;
            $action = $data['action'] ?? '';
        }

        switch ($action) {
            case 'import_inquiries':
                if (!isset($_FILES['inquiry_csv']) || $_FILES['inquiry_csv']['error'] !== UPLOAD_ERR_OK) {
                    throw new Exception('ファイルがアップロードされていないか、アップロード中にエラーが発生しました。', 400);
                }
            
                $file_path = $_FILES['inquiry_csv']['tmp_name'];
                $file_type = mime_content_type($file_path);
            
                if (!in_array($file_type, ['text/csv', 'application/vnd.ms-excel', 'text/plain'])) {
                     throw new Exception('無効なファイル形式です。CSVファイルをアップロードしてください。', 400);
                }
            
                $pdo->beginTransaction();
                try {
                    $file = fopen($file_path, 'r');
                    fgetcsv($file); // ヘッダー行をスキップ
            
                    $imported_count = 0;
                    $skipped_count = 0;
            
                    while (($row = fgetcsv($file)) !== FALSE) {
                        if (count($row) < 6) { $skipped_count++; continue; }
                        $id = $row[0];
                        $name = $row[1];
                        $email = $row[2];
                        $message = $row[3];
                        $replied = (strtolower($row[4]) === 'yes' || $row[4] === '1') ? 1 : 0;
                        $created_at = $row[5];
            
                        if (empty($name) || empty($email) || empty($message) || empty($created_at)) {
                            $skipped_count++;
                            continue;
                        }
            
                        $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM Inquiries WHERE id = ?");
                        $stmt_check->execute([$id]);
                        if ($stmt_check->fetchColumn() > 0) {
                            $skipped_count++;
                            continue;
                        }
            
                        $stmt = $pdo->prepare(
                            "INSERT INTO Inquiries (id, name, email, message, replied, created_at) VALUES (?, ?, ?, ?, ?, ?)"
                        );
                        $stmt->execute([$id, $name, $email, $message, $replied, $created_at]);
                        $imported_count++;
                    }
                    fclose($file);
                    $pdo->commit();
                    echo json_encode([
                        'success' => true, 
                        'message' => "インポートが完了しました。{$imported_count}件のデータを追加し、{$skipped_count}件のデータをスキップしました。"
                    ]);
            
                } catch (Exception $e) {
                    $pdo->rollBack();
                    throw new Exception("インポート処理中にエラーが発生しました: " . $e->getMessage(), 500);
                }
                break;
            case 'import_users':
                if (!isset($_FILES['user_csv']) || $_FILES['user_csv']['error'] !== UPLOAD_ERR_OK) {
                    throw new Exception('ファイルアップロードエラー', 400);
                }
                $file_path = $_FILES['user_csv']['tmp_name'];
                $pdo->beginTransaction();
                try {
                    $file = fopen($file_path, 'r');
                    fgetcsv($file); // Skip header
                    $imported = 0; $skipped = 0;
                    while (($row = fgetcsv($file)) !== FALSE) {
                        if (count($row) < 6) { $skipped++; continue; }
                        $email = $row[2];
                        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
                            $skipped++;
                            continue;
                        }
                        $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM Accounts WHERE Email = ?");
                        $stmt_check->execute([$email]);
                        if ($stmt_check->fetchColumn() > 0) {
                            $skipped++;
                            continue;
                        }
                        $stmt = $pdo->prepare("INSERT INTO Accounts (Name, Email, UserType, RegistrationDate, is_admin, Password, Country, Current_location) VALUES (?, ?, ?, ?, ?, ?, '', '')");
                        $stmt->execute([
                            $row[1], // Name
                            $email,  // Email
                            $row[3], // UserType
                            $row[4], // RegistrationDate
                            (strtolower($row[5]) === 'yes' ? 1 : 0), // is_admin
                            password_hash(bin2hex(random_bytes(8)), PASSWORD_DEFAULT) // 仮パスワード
                        ]);
                        $imported++;
                    }
                    fclose($file);
                    $pdo->commit();
                    echo json_encode(['success' => true, 'message' => "ユーザーを{$imported}件インポートし、{$skipped}件スキップしました。"]);
                } catch (Exception $e) {
                    $pdo->rollBack();
                    throw new Exception("ユーザーのインポートに失敗しました: " . $e->getMessage(), 500);
                }
                break;

            case 'import_quizzes':
                if (!isset($_FILES['quiz_csv']) || $_FILES['quiz_csv']['error'] !== UPLOAD_ERR_OK) {
                    throw new Exception('ファイルアップロードエラー', 400);
                }
                $file_path = $_FILES['quiz_csv']['tmp_name'];
                $pdo->beginTransaction();
                try {
                    $file = fopen($file_path, 'r');
                    fgetcsv($file); // Skip header
                    $imported = 0; $skipped = 0;
                    while (($row = fgetcsv($file)) !== FALSE) {
                        if (count($row) < 21) { $skipped++; continue; }
                        $id = $row[0];
                        if (empty($id)) { $skipped++; continue; }
                        $stmt_check = $pdo->prepare("SELECT COUNT(*) FROM Quizzes WHERE id = ?");
                        $stmt_check->execute([$id]);
                        if ($stmt_check->fetchColumn() > 0) {
                            $skipped++;
                            continue;
                        }
                        $question = json_encode(['ja' => $row[2], 'en' => $row[3], 'zh' => $row[4]], JSON_UNESCAPED_UNICODE);
                        $options = json_encode([
                            'ja' => array_filter([$row[5], $row[8], $row[11], $row[14]]),
                            'en' => array_filter([$row[6], $row[9], $row[12], $row[15]]),
                            'zh' => array_filter([$row[7], $row[10], $row[13], $row[16]])
                        ], JSON_UNESCAPED_UNICODE);
                        $explanation = json_encode(['ja' => $row[18], 'en' => $row[19], 'zh' => $row[20]], JSON_UNESCAPED_UNICODE);
                        
                        $stmt = $pdo->prepare("INSERT INTO Quizzes (id, difficulty, question, options, correct_answer_index, explanation) VALUES (?, ?, ?, ?, ?, ?)");
                        $stmt->execute([$id, $row[1], $question, $options, $row[17], $explanation]);
                        $imported++;
                    }
                    fclose($file);
                    $pdo->commit();
                    echo json_encode(['success' => true, 'message' => "クイズを{$imported}件インポートし、{$skipped}件スキップしました。"]);
                } catch (Exception $e) {
                    $pdo->rollBack();
                    throw new Exception("クイズのインポートに失敗しました: " . $e->getMessage(), 500);
                }
                break;
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
            
            case 'delete_inquiry':
                $inquiry_id = $data['inquiry_id'] ?? 0;
                if ($inquiry_id > 0) {
                    $stmt = $pdo->prepare("DELETE FROM Inquiries WHERE id = ?");
                    $stmt->execute([$inquiry_id]);
                    echo json_encode(['success' => true, 'message' => 'お問い合わせを削除しました。']);
                } else {
                    throw new Exception('無効なIDです。', 400);
                }
                break;

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
