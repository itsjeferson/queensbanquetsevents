<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/helpers/response.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/index.php', '', $uri);
$uri = trim($uri, '/');
$parts = explode('/', $uri);
$resource = $parts[0] ?? '';

$routes = [
    'auth' => 'routes/auth.php',
    'bookings' => 'routes/bookings.php',
    'payments' => 'routes/payments.php',
    'packages' => 'routes/packages.php',
    'gallery' => 'routes/gallery.php',
    'users' => 'routes/users.php',
    'reports' => 'routes/reports.php',
    'events' => 'routes/events.php',
    'invitations' => 'routes/invitations.php',
    'guests' => 'routes/guests.php',
    'rsvp' => 'routes/rsvp.php',
    'guest-messages' => 'routes/guest-messages.php',
    'templates' => 'routes/templates.php',
];

if (isset($routes[$resource])) {
    require_once __DIR__ . '/' . $routes[$resource];
} else {
    sendResponse(['message' => 'Velura Events API', 'version' => '1.0.0', 'status' => 'running']);
}
