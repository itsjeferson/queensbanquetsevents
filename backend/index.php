<?php
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/helpers/response.php';

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uriWithLeadingSlash = $uri;
$uri = str_replace('/index.php', '', $uri);
$uri = trim($uri, '/');
$parts = explode('/', $uri);
$resource = $parts[0] ?? '';

// Serve uploaded files directly when the PHP built-in server document root
// doesn't include the uploads directory.
if (preg_match('#^/uploads/.+#', $uriWithLeadingSlash ?? '')) {
    $filePath = __DIR__ . $uriWithLeadingSlash;
    if (is_file($filePath)) {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $mimeTypes = [
            'mp4' => 'video/mp4', 'webm' => 'video/webm', 'mov' => 'video/quicktime',
            'mp3' => 'audio/mpeg', 'wav' => 'audio/wav', 'ogg' => 'audio/ogg', 'm4a' => 'audio/mp4',
            'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
            'gif' => 'image/gif', 'webp' => 'image/webp',
        ];
        $mime = $mimeTypes[$ext] ?? 'application/octet-stream';
        header('Content-Type: ' . $mime);
        header('Content-Length: ' . filesize($filePath));
        readfile($filePath);
        exit;
    }
}

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
    'media' => 'routes/media.php',
];

if (isset($routes[$resource])) {
    require_once __DIR__ . '/' . $routes[$resource];
} else {
    sendResponse(['message' => "Queen's Banquet Digital Invitation Management System API", 'version' => '1.0.0', 'status' => 'running']);
}
