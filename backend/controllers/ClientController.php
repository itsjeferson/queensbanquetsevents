<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/validator.php';
require_once __DIR__ . '/../middleware/adminMiddleware.php';

class ClientController
{
    public function index(): void
    {
        requireAdmin();
        sendResponse(['success' => true, 'data' => User::allClients()]);
    }

    public function store(array $data): void
    {
        requireAdmin();
        $error = validateRequired($data, ['firstName', 'lastName', 'email', 'password']);
        if ($error) sendError($error, 422);
        if (!validateEmail($data['email'])) sendError('Invalid email', 422);

        if (User::findByEmail($data['email'])) {
            sendError('Email already registered', 409);
        }

        $id = User::create($data);
        $client = User::find($id);
        unset($client['password']);
        sendResponse(['success' => true, 'data' => $client], 201);
    }

    public function update(int $id, array $data): void
    {
        requireAdmin();
        $client = User::find($id);
        if (!$client || $client['role'] !== 'client') {
            sendError('Client not found', 404);
        }

        if (!empty($data['email']) && $data['email'] !== $client['email']) {
            if (!validateEmail($data['email'])) sendError('Invalid email', 422);
            if (User::findByEmail($data['email'])) sendError('Email already registered', 409);
        }

        User::update($id, $data);
        $updated = User::find($id);
        unset($updated['password']);
        sendResponse(['success' => true, 'data' => $updated]);
    }

    public function archive(int $id): void
    {
        requireAdmin();
        $client = User::find($id);
        if (!$client || $client['role'] !== 'client') {
            sendError('Client not found', 404);
        }

        User::archive($id);
        sendResponse(['success' => true, 'message' => 'Client archived']);
    }
}
