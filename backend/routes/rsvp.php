<?php
require_once __DIR__ . '/../controllers/RsvpController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new RsvpController();
$method = $_SERVER['REQUEST_METHOD'];
$action = $parts[1] ?? null;

switch ($method) {
    case 'GET':
        if ($action === 'event' && isset($parts[2])) {
            $controller->byEvent((int) $parts[2]);
        } else {
            sendError('Use /rsvp/event/{eventId}', 400);
        }
        break;
    case 'POST':
        $controller->store(getJsonInput());
        break;
    default:
        sendError('Method not allowed', 405);
}
