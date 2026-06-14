<?php
require_once __DIR__ . '/../controllers/GalleryController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new GalleryController();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($parts[1]) && is_numeric($parts[1]) ? (int) $parts[1] : null;
$action = $parts[1] ?? '';

switch ("$method:$action") {
    case 'GET:':
    case 'GET':
        $controller->index();
        break;
    case 'POST:upload':
        $controller->upload();
        break;
    case 'DELETE:':
        $id ? $controller->destroy($id) : sendError('ID required', 400);
        break;
    default:
        sendError('Route not found', 404);
}
