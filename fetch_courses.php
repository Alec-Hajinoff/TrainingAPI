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

header('Access-Control-Allow-Methods: GET, OPTIONS');
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

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'Session expired or invalid']);
    exit;
}

try {
    $sql = 'SELECT * FROM courses WHERE provider_users_id = ? ORDER BY id DESC';
    $stmt = $conn->prepare($sql);
    $stmt->execute([$userId]);
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'courses' => $courses]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch courses']);
} finally {
    $conn = null;
}
