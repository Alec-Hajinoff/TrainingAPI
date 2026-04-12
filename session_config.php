<?php
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 86400,
        'path' => '/',
        'domain' => 'localhost',    // Use 'climatebind.com' in production
        'secure' => false,          // Change to true when using HTTPS
        'httponly' => true,
        'samesite' => 'Strict'
    ]);

    session_name('climate_session');
    session_start();
}

$timeout = 86400;

if (isset($_SESSION['LAST_ACTIVITY']) && (time() - $_SESSION['LAST_ACTIVITY'] > $timeout)) {
    session_unset();
    session_destroy();
}
$_SESSION['LAST_ACTIVITY'] = time();

if (!isset($_SESSION['CREATED'])) {
    $_SESSION['CREATED'] = time();
} elseif (time() - $_SESSION['CREATED'] > $timeout) {
    session_regenerate_id(true);
    $_SESSION['CREATED'] = time();
}