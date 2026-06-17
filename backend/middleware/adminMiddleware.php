<?php
require_once __DIR__ . '/authMiddleware.php';
require_once __DIR__ . '/../helpers/response.php';

function requireAdmin(): array
{
    $user = requireAuth();
    if (!in_array($user['role'], ['admin', 'super_admin'], true)) {
        sendError('Forbidden', 403);
    }
    return $user;
}
