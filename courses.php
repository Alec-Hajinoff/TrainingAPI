<?php

// RESTful endpoint to get all courses data
// Usage: GET /api/courses - Public endpoint, no authentication required

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
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
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
        echo json_encode(['success' => false, 'message' => 'No workshops available at the moment. You can request a custom programme.']);
        exit;
    }

    foreach ($courses as &$course) {
        $course['provider_name'] = 'TrainingApi';

        $course['contact_email'] = 'team@trainingapi.com';

        $course['contact_phone'] = '07549 385 178';

        $course['provider_website'] = 'https://trainingapi.com/';

        $course['total_price'] = $course['total_price'] * 1.5;
    }
    unset($course);

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
