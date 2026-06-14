<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validator.php';

class AuthController
{
    public function login(array $data): void
    {
        $error = validateRequired($data, ['email', 'password']);
        if ($error) sendError($error, 422);
        if (!validateEmail($data['email'])) sendError('Invalid email', 422);

        $user = User::findByEmail($data['email']);
        if (!$user || !password_verify($data['password'], $user['password'])) {
            sendError('Invalid credentials', 401);
        }

        unset($user['password']);
        sendResponse(['success' => true, 'data' => $user, 'token' => 'mock-jwt-token']);
    }

    public function register(array $data): void
    {
        $error = validateRequired($data, ['firstName', 'lastName', 'email', 'password']);
        if ($error) sendError($error, 422);

        $id = User::create($data);
        sendResponse(['success' => true, 'data' => ['id' => $id, 'email' => $data['email'], 'role' => 'client']], 201);
    }

    public function me(): void
    {
        require_once __DIR__ . '/../middleware/authMiddleware.php';
        $user = requireAuth();
        sendResponse(['success' => true, 'data' => $user]);
    }
}
