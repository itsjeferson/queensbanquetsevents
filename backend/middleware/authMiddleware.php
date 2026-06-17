<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../models/User.php';

function requireAuth(): array
{
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!str_starts_with($auth, 'Bearer ')) {
        sendError('Unauthorized', 401);
    }

    $token = substr($auth, 7);
    $payload = json_decode(base64_decode($token, true), true);

    if (!is_array($payload) || empty($payload['id']) || empty($payload['role'])) {
        sendError('Unauthorized', 401);
    }

    $user = User::find((int) $payload['id']);
    if (!$user || ($user['status'] ?? 'active') === 'disabled') {
        sendError('Unauthorized', 401);
    }

    if ($user['role'] !== $payload['role']) {
        sendError('Unauthorized', 401);
    }

    return [
        'id' => (int) $user['id'],
        'role' => $user['role'],
        'email' => $user['email'],
        'first_name' => $user['first_name'] ?? '',
        'last_name' => $user['last_name'] ?? '',
    ];
}
