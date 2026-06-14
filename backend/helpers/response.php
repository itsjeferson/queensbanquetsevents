<?php
function sendResponse($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function sendError(string $message, int $status = 400): void
{
    sendResponse(['success' => false, 'message' => $message], $status);
}

function getJsonInput(): array
{
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}
