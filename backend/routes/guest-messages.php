<?php
require_once __DIR__ . '/../controllers/GuestMessageController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new GuestMessageController();
$action = $parts[1] ?? '';
$id = isset($parts[2]) ? (int) $parts[2] : null;

if ($action === 'event' && $id && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $controller->byEvent($id);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && !$action) {
    $controller->store(json_decode(file_get_contents('php://input'), true) ?? []);
} else {
    sendError('Route not found', 404);
}
