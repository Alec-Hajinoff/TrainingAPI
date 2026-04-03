<?php

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/vendor/autoload.php';
require_once 'session_config.php';

$config = parse_ini_file(__DIR__ . '/.env', false, INI_SCANNER_RAW);
if ($config === false) {
    error_log('Failed to parse .env file');
    echo json_encode(['success' => false, 'message' => 'Server configuration error']);
    exit;
}

$mailUsername = $config['MAIL_USERNAME'];
$mailPassword = $config['MAIL_PASSWORD'];

if (empty($mailUsername) || empty($mailPassword)) {
    error_log('Gmail credentials not found in .env file');
    echo json_encode(['success' => false, 'message' => 'Server configuration error']);
    exit;
}

$allowed_origins = [
    'http://localhost:3000',
    'https://trainingapi.com',
    'https://www.trainingapi.com'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

if ($origin !== null && in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} elseif ($origin === null) {
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

$servername = 'localhost';
$username = 'TrainingApiUser';
$passwordServer = 'pCPzbVfGsdK25dY';
$dbname = 'training_api';
$port = 3306;

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $passwordServer);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
}

$input = json_decode(file_get_contents('php://input'), true);
if ($input === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$name = $input['name'] ?? null;
$email = filter_var($input['email'] ?? '', FILTER_SANITIZE_EMAIL);
$password = $input['password'] ?? null;
$userType = $input['userType'] ?? null;

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email format']);
    exit;
}

if (!in_array($userType, ['provider', 'developer', 'admin'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid user type']);
    exit;
}

if (!$name || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $conn->beginTransaction();

    $email = trim($email);
    $email = strtolower($email);

    $tablesToCheck = ['provider_users', 'developer_users', 'admin_users'];
    $emailExists = false;

    foreach ($tablesToCheck as $table) {
        $checkSql = "SELECT COUNT(*) as email_count FROM $table WHERE email = :email";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bindParam(':email', $email);
        $checkStmt->execute();

        $result = $checkStmt->fetch(PDO::FETCH_ASSOC);
        if ($result['email_count'] > 0) {
            $emailExists = true;
            break;
        }
    }

    if ($emailExists) {
        $conn->rollBack();
        echo json_encode(['success' => false, 'message' => 'This email cannot be used for registration. Please try another email.']);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $verificationToken = bin2hex(random_bytes(32));

    switch ($userType) {
        case 'provider':
            $tableName = 'provider_users';
            break;
        case 'developer':
            $tableName = 'developer_users';
            break;
        case 'admin':
            $tableName = 'admin_users';
            break;
        default:
            throw new Exception('Invalid user type');
    }

    $sql = "INSERT INTO $tableName (email, password, name, verification_token, expires_at, is_verified)
            VALUES (:email, :password, :name, :token, DATE_ADD(NOW(), INTERVAL 24 HOUR), 0)";

    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hashedPassword);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':token', $verificationToken);

        $stmt->execute();

        $userId = $conn->lastInsertId();

        $conn->commit();

        $verificationLink = 'https://trainingapi.com/VerifyEmail?token=' . urlencode($verificationToken);

        $mail = new PHPMailer(true);

        try {
            $mail->SMTPDebug = SMTP::DEBUG_OFF;

            $mail->isSMTP();
            $mail->Host = 'localhost';
            $mail->Port = 25;
            $mail->SMTPAuth = false;
            $mail->SMTPSecure = false;

            $mail->setFrom('team@trainingapi.com', 'TrainingApi');

            $mail->addAddress($email, $name);

            $mail->isHTML(false);

            $mail->Subject = 'Verify your email address - TrainingApi';
            $mail->Body = "Thank you for creating an account with TrainingApi.\n\n"
                . "Please click the link below to verify your email address:\n"
                . $verificationLink . "\n\n"
                . "Once verified, you will be able to sign in to your account.\n\n"
                . 'This link is valid for 24 hours.';

            $mail->send();

            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            error_log('PHPMailer Error: ' . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => 'Registration completed but failed to send verification email. Please contact support.'
            ]);
        }
    } else {
        throw new Exception('Database error preparing statement');
    }
} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    error_log('Registration Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Registration failed. Please try again.']);
} finally {
    $conn = null;
}
