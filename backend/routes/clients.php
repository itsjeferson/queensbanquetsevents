<?php
require_once __DIR__ . '/../controllers/ClientController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new ClientController();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($parts[1]) && is_numeric($parts[1]) ? (int) $parts[1] : null;

switch ($method) {
    case 'GET':
        $controller->index();
        break;
    case 'POST':
        $controller->store(getJsonInput());
        break;
    case 'PUT':
        $id ? $controller->update($id, getJsonInput()) : sendError('ID required', 400);
        break;
    case 'DELETE':
        $id ? $controller->archive($id) : sendError('ID required', 400);
        break;
    default:
        sendError('Method not allowed', 405);
}
