<?php
require_once __DIR__ . '/../controllers/MediaController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new MediaController();
$method = $_SERVER['REQUEST_METHOD'];
$action = $parts[1] ?? '';

if ($method === 'POST' && $action === 'upload') {
    $controller->uploadInvitationMedia();
} else {
    sendError('Route not found', 404);
}
