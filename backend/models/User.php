<?php
require_once __DIR__ . '/../config/database.php';

class User
{
    public static function findByEmail(string $email): ?array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        return $stmt->fetch() ?: null;
    }

    public static function find(int $id): ?array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): int
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['firstName'],
            $data['lastName'],
            $data['email'],
            $data['phone'] ?? '',
            password_hash($data['password'], PASSWORD_DEFAULT),
            'client',
        ]);
        return dbLastInsertId($pdo, 'users');
    }

    public static function allClients(): array
    {
        $pdo = getConnection();
        return $pdo->query(
            "SELECT id, first_name, last_name, email, phone, role, status, created_at FROM users WHERE role = 'client' ORDER BY created_at DESC"
        )->fetchAll();
    }

    public static function archive(int $id): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE users SET status = ? WHERE id = ? AND role = ?');
        $stmt->execute(['disabled', $id, 'client']);
    }

    public static function update(int $id, array $data): void
    {
        $pdo = getConnection();
        if (!empty($data['password'])) {
            $stmt = $pdo->prepare('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, status = ?, password = ? WHERE id = ?');
            $stmt->execute([
                $data['firstName'] ?? '',
                $data['lastName'] ?? '',
                $data['email'] ?? '',
                $data['phone'] ?? '',
                $data['status'] ?? 'active',
                password_hash($data['password'], PASSWORD_DEFAULT),
                $id,
            ]);
            return;
        }

        $stmt = $pdo->prepare('UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, status = ? WHERE id = ?');
        $stmt->execute([
            $data['firstName'] ?? '',
            $data['lastName'] ?? '',
            $data['email'] ?? '',
            $data['phone'] ?? '',
            $data['status'] ?? 'active',
            $id,
        ]);
    }
}
