<?php
require_once __DIR__ . '/../controllers/GuestController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new GuestController();
$method = $_SERVER['REQUEST_METHOD'];
$action = $parts[1] ?? null;
$id = isset($parts[1]) && is_numeric($parts[1]) ? (int) $parts[1] : null;

switch ($method) {
    case 'GET':
        if ($action === 'event' && isset($parts[2])) {
            $controller->byEvent((int) $parts[2]);
        } else {
            sendError('Use /guests/event/{eventId}', 400);
        }
        break;
    case 'POST':
        if ($action === 'bulk') {
            $controller->bulkStore(getJsonInput());
        } else {
            $controller->store(getJsonInput());
        }
        break;
    case 'DELETE':
        $id ? $controller->destroy($id) : sendError('ID required', 400);
        break;
    default:
        sendError('Method not allowed', 405);
}
