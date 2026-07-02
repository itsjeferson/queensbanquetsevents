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
    'gallery' => 'routes/gallery.php',
    'reports' => 'routes/reports.php',
    'invitations' => 'routes/invitations.php',
    'rsvp' => 'routes/rsvp.php',
    'templates' => 'routes/templates.php',
    'events' => 'routes/events.php',
    'guests' => 'routes/guests.php',
    'guest-messages' => 'routes/guest-messages.php',
    'notifications' => 'routes/notifications.php',
    'clients' => 'routes/clients.php',
];

if (isset($routes[$resource])) {
    require_once __DIR__ . '/' . $routes[$resource];
} else {
    sendResponse(['message' => "Queen's Banquet Digital Invitation Management System API", 'version' => '1.0.0', 'status' => 'running']);
}
