<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../helpers/response.php';

class UserController
{
    public function index(): void
    {
        sendResponse(['success' => true, 'data' => User::allClients()]);
    }

    public function show(int $id): void
    {
        $user = User::find($id);
        if (!$user) sendError('User not found', 404);
        unset($user['password']);
        sendResponse(['success' => true, 'data' => $user]);
    }

    public function update(int $id, array $data): void
    {
        User::update($id, $data);
        sendResponse(['success' => true, 'message' => 'User updated']);
    }
}
