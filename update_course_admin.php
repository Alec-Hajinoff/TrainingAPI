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
$courseId = $_POST['course_id'] ?? null;

$course_title = $_POST['course_title'] ?? null;
$description = $_POST['description'] ?? null;
$learning_outcomes = $_POST['learning_outcomes'] ?? null;
$subject_area = $_POST['subject_area'] ?? null;
$subject = $_POST['subject'] ?? null;
$delivery_type = $_POST['delivery_type'] ?? null;
$country_of_delivery = $_POST['country_of_delivery'] ?? null;
$duration = $_POST['duration'] ?? null;
$total_price = $_POST['total_price'] ?? null;

$provider_name = $_POST['provider_name'] ?? null;
$contact_email = $_POST['contact_email'] ?? null;
$contact_phone = $_POST['contact_phone'] ?? null;
$provider_website = $_POST['provider_website'] ?? null;

if (!$userId) {
    echo json_encode(['success' => false, 'message' => 'Session expired or invalid']);
    exit;
}

if (!$courseId) {
    echo json_encode(['success' => false, 'message' => 'Course ID is required']);
    exit;
}

try {
    $checkSql = 'SELECT id FROM courses WHERE id = ?';
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->execute([$courseId]);

    if ($checkStmt->rowCount() === 0) {
        echo json_encode(['success' => false, 'message' => 'Course not found']);
        exit;
    }

    $sql = 'UPDATE courses SET 
        course_title = ?, 
        description = ?, 
        learning_outcomes = ?, 
        subject_area = ?, 
        subject = ?, 
        delivery_type = ?, 
        country_of_delivery = ?, 
        duration = ?, 
        total_price = ?,
        provider_name = ?,
        contact_email = ?,
        contact_phone = ?,
        provider_website = ? 
    WHERE id = ?';

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $course_title,
        $description,
        $learning_outcomes,
        $subject_area,
        $subject,
        $delivery_type,
        $country_of_delivery,
        $duration,
        $total_price,
        $provider_name,
        $contact_email,
        $contact_phone,
        $provider_website,
        $courseId
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Update failed']);
} finally {
    $conn = null;
}
