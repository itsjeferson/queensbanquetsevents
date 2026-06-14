<?php
require_once __DIR__ . '/../controllers/EventController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new EventController();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($parts[1]) && is_numeric($parts[1]) ? (int) $parts[1] : null;
$sub = $parts[2] ?? null;

switch ($method) {
    case 'GET':
        $id ? $controller->show($id) : $controller->index();
        break;
    case 'POST':
        if ($id && $sub === 'publish') {
            $controller->publish($id);
        } else {
            $controller->store(getJsonInput());
        }
        break;
    case 'PUT':
        $id ? $controller->update($id, getJsonInput()) : sendError('ID required', 400);
        break;
    case 'DELETE':
        $id ? $controller->destroy($id) : sendError('ID required', 400);
        break;
    default:
        sendError('Method not allowed', 405);
}
