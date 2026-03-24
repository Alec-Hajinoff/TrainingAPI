<?php
require_once 'session_config.php';

header('Content-Type: application/json');

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
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

    $sql = 'SELECT 
                id, 
                name, 
                email, 
                organisation, 
                requirement_description, 
                technology_area, 
                team_size, 
                preferred_timing, 
                additional_details, 
                created_at, 
                status 
            FROM workshop_requests 
            ORDER BY created_at DESC';

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'requests' => $requests,
        'count' => count($requests)
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} finally {
    $conn = null;
}
