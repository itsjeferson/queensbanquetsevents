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
        } elseif ($action === 'exists' && isset($parts[2])) {
            $controller->existsByEvent((int) $parts[2]);
        } elseif ($action === 'client' && isset($parts[2])) {
            $controller->byClient((int) $parts[2]);
        } else {
            sendError('Use /rsvp/event/{eventId} or /rsvp/client/{clientId}', 400);
        }
        break;
    case 'POST':
        $controller->store(getJsonInput());
        break;
    case 'DELETE':
        if ($action === 'clear' && isset($parts[2])) {
            $controller->clearBySlug($parts[2]);
        } else {
            sendError('Use DELETE /rsvp/clear/{slug}', 400);
        }
        break;
    default:
        sendError('Method not allowed', 405);
}
