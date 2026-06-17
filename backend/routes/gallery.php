<?php
require_once __DIR__ . '/../controllers/GalleryController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new GalleryController();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($parts[1]) && is_numeric($parts[1]) ? (int) $parts[1] : null;
$action = $parts[1] ?? '';

if ($method === 'GET' && ($action === '' || $action === 'gallery')) {
    $controller->index();
} elseif ($method === 'POST' && $action === 'upload') {
    $controller->upload();
} elseif ($method === 'DELETE' && $id) {
    $controller->destroy($id);
} else {
    sendError('Route not found', 404);
}
