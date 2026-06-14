<?php
require_once __DIR__ . '/../config/database.php';

class Package
{
    public static function all(): array
    {
        $pdo = getConnection();
        return $pdo->query('SELECT * FROM packages WHERE status = "active" ORDER BY price ASC')->fetchAll();
    }

    public static function create(array $data): int
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('INSERT INTO packages (name, description, price, max_guests, inclusions, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['name'],
            $data['description'] ?? '',
            $data['price'],
            $data['max_guests'] ?? 50,
            json_encode($data['inclusions'] ?? []),
            $data['featured'] ?? 0,
            'active',
        ]);
        return (int) $pdo->lastInsertId();
    }

    public static function update(int $id, array $data): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE packages SET name = ?, description = ?, price = ?, max_guests = ?, inclusions = ?, featured = ? WHERE id = ?');
        $stmt->execute([
            $data['name'],
            $data['description'] ?? '',
            $data['price'],
            $data['max_guests'] ?? 50,
            json_encode($data['inclusions'] ?? []),
            $data['featured'] ?? 0,
            $id,
        ]);
    }

    public static function delete(int $id): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE packages SET status = ? WHERE id = ?');
        $stmt->execute(['inactive', $id]);
    }
}
