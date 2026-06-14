<?php
require_once __DIR__ . '/authMiddleware.php';
require_once __DIR__ . '/../helpers/response.php';

function requireAdmin(): array
{
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        sendError('Forbidden', 403);
    }
    return $user;
}
