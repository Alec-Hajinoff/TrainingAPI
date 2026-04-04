<?php

// This file accepts workshop request data from the frontend and inserts it into the workshop_requests table.

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

$name = $_POST['name'] ?? null;
$email = $_POST['email'] ?? null;
$organisation = $_POST['organisation'] ?? null;
$requirement_description = $_POST['requirement_description'] ?? null;
$technology_area = $_POST['technology_area'] ?? null;
$team_size = $_POST['team_size'] ?? null;
$preferred_timing = $_POST['preferred_timing'] ?? null;
$additional_details = $_POST['additional_details'] ?? null;

if (!$name || !$email || !$organisation || !$requirement_description) {
    echo json_encode(['success' => false, 'message' => 'Required fields are missing']);
    exit;
}

try {
    $sql = 'INSERT INTO workshop_requests (
        name, 
        email, 
        organisation, 
        requirement_description, 
        technology_area, 
        team_size, 
        preferred_timing, 
        additional_details
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        $name,
        $email,
        $organisation,
        $requirement_description,
        $technology_area,
        $team_size,
        $preferred_timing,
        $additional_details
    ]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} finally {
    $conn = null;
}
