<?php
require_once __DIR__ . '/../controllers/NotificationController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new NotificationController();
$action = $parts[1] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'client' && isset($parts[2])) {
    $controller->byClient((int) $parts[2]);
} else {
    sendError('Use /notifications/client/{clientId}', 400);
}
