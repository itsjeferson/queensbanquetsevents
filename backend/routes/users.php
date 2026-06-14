<?php
require_once __DIR__ . '/../controllers/UserController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new UserController();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($parts[1]) && is_numeric($parts[1]) ? (int) $parts[1] : null;

switch ($method) {
    case 'GET':
        $id ? $controller->show($id) : $controller->index();
        break;
    case 'PUT':
        $id ? $controller->update($id, getJsonInput()) : sendError('ID required', 400);
        break;
    default:
        sendError('Method not allowed', 405);
}
