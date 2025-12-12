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

$course_title = $_POST['course_title'] ?? null;
$description = $_POST['description'] ?? null;
$learning_outcomes = $_POST['learning_outcomes'] ?? null;
$subject_area = $_POST['subject_area'] ?? null;
$subject = $_POST['subject'] ?? null;
$delivery_type = $_POST['delivery_type'] ?? null;
$country_of_delivery = $_POST['country_of_delivery'] ?? null;
$duration = $_POST['duration'] ?? null;
$total_price = $_POST['total_price'] ?? null;

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

    $sql = 'UPDATE courses SET 
        course_title = ?, 
        description = ?, 
        learning_outcomes = ?, 
        subject_area = ?, 
        subject = ?, 
        delivery_type = ?, 
        country_of_delivery = ?, 
        duration = ?, 
        total_price = ? 
    WHERE id = ? AND provider_users_id = ?';

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
        $courseId,
        $userId
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Update failed']);
} finally {
    $conn = null;
}
