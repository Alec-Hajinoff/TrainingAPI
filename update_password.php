<?php
// update_password.php - Updates user's password and clears the reset token

require_once 'session_config.php';

require_once __DIR__ . '/vendor/autoload.php';

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
    error_log('update_password.php: Connection failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if ($input === null) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

$token = $input['token'] ?? '';
$newPassword = $input['password'] ?? '';

if (empty($token) || empty($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Token and password are required']);
    exit;
}

if (strlen($newPassword) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long']);
    exit;
}

try {
    $conn->beginTransaction();

    $tablesToCheck = ['admin_users', 'provider_users', 'developer_users'];
    $userFound = false;
    $userTable = null;
    $userId = null;

    foreach ($tablesToCheck as $table) {
        $verifySql = 'SELECT id FROM ' . $table . ' 
                      WHERE password_reset_token = :token 
                      AND reset_token_expires_at > NOW() 
                      LIMIT 1';

        $verifyStmt = $conn->prepare($verifySql);
        $verifyStmt->bindParam(':token', $token);
        $verifyStmt->execute();

        if ($verifyStmt->rowCount() > 0) {
            $userFound = true;
            $userTable = $table;
            $user = $verifyStmt->fetch(PDO::FETCH_ASSOC);
            $userId = $user['id'];
            error_log("update_password.php: Valid token found in $userTable for user ID: $userId");
            break;
        }
    }

    if (!$userFound) {
        echo json_encode([
            'success' => false,
            'message' => 'This link has expired or is invalid. Please request a new password reset link.'
        ]);
        exit;
    }

    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    $updateSql = 'UPDATE ' . $userTable . ' 
                  SET password = :password, 
                      password_reset_token = NULL, 
                      reset_token_expires_at = NULL 
                  WHERE id = :id';

    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bindParam(':password', $hashedPassword);
    $updateStmt->bindParam(':id', $userId);

    if ($updateStmt->execute()) {
        $conn->commit();
        error_log("update_password.php: Password updated successfully for user ID: $userId in table: $userTable");
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Failed to execute update statement');
    }
} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    error_log('update_password.php: Error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Password update failed. Please try again.']);
} finally {
    $conn = null;
}
