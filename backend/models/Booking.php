<?php
require_once __DIR__ . '/../config/database.php';

class Booking
{
    public static function all(): array
    {
        $pdo = getConnection();
        return $pdo->query('SELECT * FROM bookings ORDER BY event_date DESC')->fetchAll();
    }

    public static function find(int $id): ?array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT * FROM bookings WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): int
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('INSERT INTO bookings (user_id, event_type, event_date, guest_count, package_id, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['user_id'] ?? 1,
            $data['event_type'],
            $data['event_date'],
            $data['guest_count'] ?? 0,
            $data['package_id'] ?? null,
            'pending',
            $data['notes'] ?? '',
        ]);
        return (int) $pdo->lastInsertId();
    }

    public static function update(int $id, array $data): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE bookings SET event_type = ?, event_date = ?, guest_count = ?, package_id = ?, status = ?, notes = ? WHERE id = ?');
        $stmt->execute([
            $data['event_type'] ?? '',
            $data['event_date'] ?? '',
            $data['guest_count'] ?? 0,
            $data['package_id'] ?? null,
            $data['status'] ?? 'pending',
            $data['notes'] ?? '',
            $id,
        ]);
    }

    public static function delete(int $id): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE bookings SET status = ? WHERE id = ?');
        $stmt->execute(['cancelled', $id]);
    }
}
