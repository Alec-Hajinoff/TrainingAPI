<?php

require __DIR__ . '/vendor/autoload.php';
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
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $e->getMessage()]));
}

try {
    $sql = 'SELECT COUNT(*) as admin_count FROM admin_users';
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $adminExists = $result['admin_count'] > 0;

    echo json_encode([
        'success' => true,
        'adminExists' => $adminExists
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error checking admin existence: ' . $e->getMessage()
    ]);
} finally {
    $conn = null;
}
