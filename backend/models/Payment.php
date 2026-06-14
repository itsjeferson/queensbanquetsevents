<?php
require_once __DIR__ . '/../config/database.php';

class Payment
{
    public static function all(): array
    {
        $pdo = getConnection();
        return $pdo->query('SELECT * FROM payments ORDER BY created_at DESC')->fetchAll();
    }

    public static function create(array $data): int
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('INSERT INTO payments (booking_id, amount, receipt_path, status) VALUES (?, ?, ?, ?)');
        $stmt->execute([
            $data['booking_id'],
            $data['amount'],
            $data['receipt_path'],
            $data['status'] ?? 'pending',
        ]);
        return (int) $pdo->lastInsertId();
    }

    public static function updateStatus(int $id, string $status): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE payments SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
    }
}
