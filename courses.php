<?php

// RESTful endpoint to get all courses data
// Usage: GET /api/courses with Authorization: Bearer <api_key>

header('Content-Type: application/json');

$allowed_origins = [
    'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

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
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !preg_match('/Bearer\s+(.*)/i', $authHeader, $matches)) {
    echo json_encode(['success' => false, 'message' => 'Authorization header missing or malformed']);
    exit;
}

$apiKey = trim($matches[1]);
$hashedKey = hash('sha256', $apiKey);

try {
    $stmt = $conn->prepare('SELECT id FROM api_keys WHERE api_key = ?');
    $stmt->execute([$hashedKey]);
    $apiKeyRecord = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$apiKeyRecord) {
        echo json_encode(['success' => false, 'message' => 'Invalid API key']);
        exit;
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'API key validation failed']);
    exit;
}

try {
    $sql = 'SELECT 
                id,
                course_title,
                description,
                learning_outcomes,
                subject_area,
                subject,
                delivery_type,
                country_of_delivery,
                duration,
                total_price,
                provider_name,
                contact_email,
                contact_phone,
                provider_website
            FROM courses 
            ORDER BY id ASC';

    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($courses)) {
        echo json_encode(['success' => false, 'message' => 'No courses found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'courses' => $courses,
        'count' => count($courses)
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Failed to fetch courses: ' . $e->getMessage()]);
    exit;
} finally {
    $conn = null;
}
