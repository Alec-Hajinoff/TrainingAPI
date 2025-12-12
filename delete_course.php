<?php
require_once 'session_config.php';

$allowed_origins = ['http://localhost:3000'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
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
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'Connection failed']));
}

$userId = $_SESSION['id'] ?? null;
$courseId = $_POST['course_id'] ?? null;

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'Session expired or invalid']);
    exit;
}

if (!$courseId) {
    echo json_encode(['success' => false, 'message' => 'Course ID is required']);
    exit;
}

try {
    $checkSql = 'SELECT id FROM courses WHERE id = ? AND provider_users_id = ?';
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->execute([$courseId, $userId]);

    if ($checkStmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Course not found or access denied']);
        exit;
    }

    $deleteSql = 'DELETE FROM courses WHERE id = ? AND provider_users_id = ?';
    $deleteStmt = $conn->prepare($deleteSql);
    $deleteStmt->execute([$courseId, $userId]);

    echo json_encode(['success' => true, 'message' => 'Course deleted successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Delete failed']);
} finally {
    $conn = null;
}
