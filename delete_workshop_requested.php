<?php
require_once 'session_config.php';

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

if (!isset($_SESSION['id']) || $_SESSION['user_type'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access.']);
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
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

$requestId = $_POST['request_id'] ?? null;

if (!$requestId) {
    echo json_encode(['success' => false, 'message' => 'Request ID is required']);
    exit;
}

try {
    $checkSql = 'SELECT id FROM workshop_requests WHERE id = ?';
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->execute([$requestId]);

    if ($checkStmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Workshop request not found']);
        exit;
    }

    $deleteSql = 'DELETE FROM workshop_requests WHERE id = ?';
    $deleteStmt = $conn->prepare($deleteSql);
    $deleteStmt->execute([$requestId]);

    echo json_encode(['success' => true, 'message' => 'Workshop request deleted successfully']);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Delete failed: ' . $e->getMessage()]);
} finally {
    $conn = null;
}
