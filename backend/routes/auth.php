<?php
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new AuthController();
$method = $_SERVER['REQUEST_METHOD'];
$action = $parts[1] ?? '';

switch ("$method:$action") {
    case 'POST:login':
        $controller->login(getJsonInput());
        break;
    case 'POST:register':
        $controller->register(getJsonInput());
        break;
    case 'GET:me':
        $controller->me();
        break;
    default:
        sendError('Route not found', 404);
}
