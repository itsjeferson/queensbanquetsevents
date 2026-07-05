<?php
require_once __DIR__ . '/../controllers/EventController.php';
require_once __DIR__ . '/../controllers/MediaController.php';
require_once __DIR__ . '/../helpers/response.php';

$controller = new EventController();
$mediaController = new MediaController();
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($parts[1]) && is_numeric($parts[1]) ? (int) $parts[1] : null;
$sub = $parts[2] ?? null;
$action = $parts[1] ?? null;

switch ($method) {
    case 'GET':
        $id ? $controller->show($id) : $controller->index();
        break;
    case 'POST':
        if ($action === 'upload') {
            $mediaController->uploadInvitationMedia();
        } elseif ($action === 'import-media') {
            $mediaController->importRemoteMedia();
        } elseif ($id && $sub === 'publish') {
            $controller->publish($id);
        } elseif ($id && $sub === 'request-publish') {
            $controller->requestPublish($id);
        } elseif ($id && $sub === 'approve') {
            $controller->approvePublish($id);
        } elseif ($id && $sub === 'decline') {
            $controller->declinePublish($id);
        } else {
            $controller->store(getJsonInput());
        }
        break;
    case 'PUT':
        $id ? $controller->update($id, getJsonInput()) : sendError('ID required', 400);
        break;
    case 'DELETE':
        $id ? $controller->destroy($id) : sendError('ID required', 400);
        break;
    default:
        sendError('Method not allowed', 405);
}
