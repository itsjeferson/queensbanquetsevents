<?php
require_once __DIR__ . '/../controllers/ReportController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new ReportController();
$action = $parts[1] ?? 'summary';

if ($action === 'summary' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    $controller->summary();
} else {
    sendError('Route not found', 404);
}
