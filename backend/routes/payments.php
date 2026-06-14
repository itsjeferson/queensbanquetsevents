<?php
require_once __DIR__ . '/../controllers/PaymentController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new PaymentController();
$method = $_SERVER['REQUEST_METHOD'];
$action = $parts[1] ?? '';

switch ("$method:$action") {
    case 'GET:':
    case 'GET':
        $controller->index();
        break;
    case 'POST:upload':
        $controller->upload();
        break;
    case 'PUT:verify':
        $id = (int) ($parts[2] ?? 0);
        $controller->verify($id, getJsonInput());
        break;
    default:
        sendError('Route not found', 404);
}
