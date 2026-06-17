<?php
require_once __DIR__ . '/../controllers/InvitationController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new InvitationController();
$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    sendError('Method not allowed', 405);
}

$action = $parts[1] ?? null;
$param = $parts[2] ?? null;

if ($action === 'slug' && $param) {
    $controller->bySlug($param);
} elseif ($action === 'preview' && $param) {
    $controller->preview($param);
} elseif ($action === 'code' && $param) {
    $controller->byCode($param);
} else {
    sendError('Use /invitations/slug/{slug} or /invitations/code/{code}', 400);
}
