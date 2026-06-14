<?php
require_once __DIR__ . '/../controllers/GuestMessageController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new GuestMessageController();
$method = $_SERVER['REQUEST_METHOD'];
$action = $parts[1] ?? null;

switch ($method) {
    case 'GET':
        if ($action === 'event' && isset($parts[2])) {
            $controller->byEvent((int) $parts[2]);
        } else {
            sendError('Use /guest-messages/event/{eventId}', 400);
        }
        break;
    case 'POST':
        $controller->store(getJsonInput());
        break;
    default:
        sendError('Method not allowed', 405);
}
