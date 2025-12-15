<?php

require_once 'session_config.php';

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

header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
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
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $e->getMessage()]));
}

$id = $_SESSION['id'] ?? null;

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Session expired or invalid']);
    exit;
}

function generateApiKey()
{
    return bin2hex(random_bytes(32));
}

$apiKey = generateApiKey();
$hashedKey = hash('sha256', $apiKey);

try {
    $conn->beginTransaction();

    $checkSql = 'SELECT id FROM api_keys WHERE developer_users_id = ?';
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->execute([$id]);
    $existingKey = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if ($existingKey) {
        $sql = 'UPDATE api_keys SET api_key = ? WHERE developer_users_id = ?';
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception('Failed to prepare API key update statement');
        }
        $stmt->execute([$hashedKey, $id]);

        error_log("API key regenerated for developer ID: $id");
    } else {
        $sql = 'INSERT INTO api_keys (api_key, developer_users_id) VALUES (?, ?)';
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception('Failed to prepare API key insert statement');
        }
        $stmt->execute([$hashedKey, $id]);
    }

    $conn->commit();

    echo json_encode(['success' => true, 'apiKey' => $apiKey]);
} catch (Exception $e) {
    if ($conn && $conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Failed to generate API key: ' . $e->getMessage()]);
} finally {
    $conn = null;
}
