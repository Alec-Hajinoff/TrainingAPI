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

$servername = 'localhost';
$username = 'TrainingApiUser';
$passwordServer = 'pCPzbVfGsdK25dY';
$dbname = 'training_api';
$port = 3306;

try {
    $conn = new PDO("mysql:host=$servername;port=$port;dbname=$dbname", $username, $passwordServer);
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
