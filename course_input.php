<?php

// This file accepts course data from a provider sent from the frontend and inserts it into the database.

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
    $conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
} catch (PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
}

$id = $_SESSION['id'] ?? null;

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

if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Session expired or invalid']);
    exit;
}

try {
    $conn->beginTransaction();

    $sql = 'INSERT INTO courses (
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
        provider_website,
        provider_users_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Failed to prepare course insert statement');
    }

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
        $id
    ]);

    $conn->commit();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    if ($conn && $conn->inTransaction()) {
        $conn->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Transaction failed: ' . $e->getMessage()]);
} finally {
    $conn = null;
}
