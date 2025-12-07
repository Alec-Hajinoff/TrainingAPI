<?php
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

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['email'], $input['password'])) {
    $email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
        exit;
    }
    $password = $input['password'];
    try {
        $pdo = new PDO('mysql:host=localhost;dbname=training_api', 'root', '', [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);

        $pdo->beginTransaction();

        $userTypes = [
            'provider' => 'provider_users',
            'developer' => 'developer_users',
            'admin' => 'admin_users'
        ];

        $user = null;
        $userType = null;

        foreach ($userTypes as $type => $table) {
            $stmt = $pdo->prepare("SELECT * FROM $table WHERE email = ?");
            $stmt->execute([$email]);
            $foundUser = $stmt->fetch();

            if ($foundUser && password_verify($password, $foundUser['password'])) {
                $user = $foundUser;
                $userType = $type;
                break;
            }
        }

        if ($user && $userType) {
            session_regenerate_id(true);
            $_SESSION['id'] = $user['id'];
            $_SESSION['user_type'] = $userType;

            $response = [
                'status' => 'success',
                'message' => 'Login successful',
                'user_type' => $userType
            ];

            $pdo->commit();
            echo json_encode($response);
        } else {
            $pdo->rollBack();
            echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
        }
    } catch (PDOException $e) {
        if (isset($pdo)) {
            $pdo->rollBack();
        }
        file_put_contents('error_log.txt', $e->getMessage() . PHP_EOL, FILE_APPEND);
        echo json_encode(['status' => 'error', 'message' => 'An error occurred. Please try again later.']);
    } finally {
        $pdo = null;
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required']);
}
