<?php
require_once __DIR__ . '/../models/Package.php';
require_once __DIR__ . '/../helpers/response.php';

class PackageController
{
    public function index(): void
    {
        sendResponse(['success' => true, 'data' => Package::all()]);
    }

    public function store(array $data): void
    {
        $id = Package::create($data);
        sendResponse(['success' => true, 'data' => ['id' => $id]], 201);
    }

    public function update(int $id, array $data): void
    {
        Package::update($id, $data);
        sendResponse(['success' => true, 'message' => 'Package updated']);
    }

    public function destroy(int $id): void
    {
        Package::delete($id);
        sendResponse(['success' => true, 'message' => 'Package deleted']);
    }
}
