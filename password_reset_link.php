<?php

// password_reset_link.php - Handles password reset requests by checking all user tables and sending reset emails.

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/vendor/autoload.php';
require_once 'session_config.php';

$config = parse_ini_file(__DIR__ . '/.env', false, INI_SCANNER_RAW);
if ($config === false) {
    error_log('password_reset_link.php: Failed to parse .env file');
    echo json_encode(['success' => false, 'message' => 'Server configuration error']);
    exit;
}

$mailUsername = $config['MAIL_USERNAME'];
$mailPassword = $config['MAIL_PASSWORD'];

if (empty($mailUsername) || empty($mailPassword)) {
    error_log('password_reset_link.php: Gmail credentials not found in .env file');
    echo json_encode(['success' => false, 'message' => 'Server configuration error']);
    exit;
}

$allowed_origins = [
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$servername = '127.0.0.1';
$username = 'root';
$passwordServer = '';
$dbname = 'training_api';

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $passwordServer);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    error_log('password_reset_link.php: Connection failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if ($input === null) {
    error_log('password_reset_link.php: Invalid JSON input');
    echo json_encode(['success' => true]);
    exit;
}

$email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
error_log('password_reset_link.php: Request received for email: "' . $email . '"');

if (empty($email)) {
    error_log('password_reset_link.php: Email is empty');
    echo json_encode(['success' => true]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    error_log('password_reset_link.php: Invalid email format: ' . $email);
    echo json_encode(['success' => true]);
    exit;
}

try {
    $tablesToCheck = [
        'admin_users' => 'admin',
        'provider_users' => 'provider',
        'developer_users' => 'developer'
    ];

    $userFound = false;
    $userTable = null;
    $userType = null;
    $userId = null;
    $userName = null;

    foreach ($tablesToCheck as $tableName => $type) {
        $checkSql = "SELECT id, name, email FROM $tableName WHERE email = :email AND is_verified = 1 LIMIT 1";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->execute();

        $user = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $userFound = true;
            $userTable = $tableName;
            $userType = $type;
            $userId = $user['id'];
            $userName = $user['name'] ?? 'User';
            error_log("password_reset_link.php: Verified user found in $tableName - ID: $userId, Name: $userName");
            break;
        }
    }

    if ($userFound) {
        $resetToken = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

        error_log("password_reset_link.php: Generated token: $resetToken for user ID: $userId in table: $userTable");

        $updateSql = "UPDATE $userTable SET password_reset_token = :token, reset_token_expires_at = :expires_at WHERE id = :id";
        $updateStmt = $conn->prepare($updateSql);
        $updateStmt->bindParam(':token', $resetToken);
        $updateStmt->bindParam(':expires_at', $expiresAt);
        $updateStmt->bindParam(':id', $userId);

        if ($updateStmt->execute()) {
            error_log("password_reset_link.php: Token stored successfully in $userTable for user ID: $userId");
        } else {
            error_log("password_reset_link.php: Failed to store token in $userTable for user ID: $userId");
        }

        $resetLink = 'http://localhost:3000/PasswordReset?token=' . urlencode($resetToken);

        $mail = new PHPMailer(true);

        try {
            error_log("password_reset_link.php: Attempting to send password reset email to: $email");

            $mail->SMTPDebug = SMTP::DEBUG_OFF;
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = $mailUsername;
            $mail->Password = $mailPassword;
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;
            $mail->Timeout = 30;

            $mail->setFrom($mailUsername, 'TrainingApi');
            $mail->addAddress($email, $userName);

            $mail->isHTML(false);
            $mail->Subject = 'Reset your password - TrainingApi';
            $mail->Body = "We received a request to reset your password for your TrainingApi account.\n\n"
                . "Please click the link below to reset your password:\n"
                . $resetLink . "\n\n"
                . "This link will expire in 1 hour.\n\n"
                . "If you didn't request a password reset, please ignore this email.";

            if ($mail->send()) {
                error_log("password_reset_link.php: Password reset email successfully sent to: $email");
            } else {
                error_log('password_reset_link.php: Mail send returned false but no exception');
            }
        } catch (Exception $e) {
            error_log('password_reset_link.php: PHPMailer Exception: ' . $e->getMessage());
            error_log('password_reset_link.php: PHPMailer Error Info: ' . $mail->ErrorInfo);
        }
    } else {
        error_log("password_reset_link.php: No verified user found for email: $email");
    }

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    error_log('password_reset_link.php: Database Error: ' . $e->getMessage());
    echo json_encode(['success' => true]);
} finally {
    $conn = null;
}
