<?php
require_once __DIR__ . '/../helpers/response.php';

function requireAuth(): array
{
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!str_starts_with($auth, 'Bearer ')) {
        sendError('Unauthorized', 401);
    }

    $token = substr($auth, 7);
    // TODO: Implement JWT validation
    return ['id' => 1, 'role' => 'client', 'email' => 'user@email.com'];
}
