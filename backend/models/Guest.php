<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/slug.php';

class Guest
{
    public static function byEvent(int $eventId): array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT g.*, r.attendance, r.meal_preference, r.guest_count, r.message as rsvp_message, r.submitted_at FROM guests g LEFT JOIN rsvps r ON r.guest_id = g.id WHERE g.event_id = ? ORDER BY g.name');
        $stmt->execute([$eventId]);
        return $stmt->fetchAll();
    }

    public static function find(int $id): ?array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT * FROM guests WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): int
    {
        $pdo = getConnection();
        $token = generateToken();
        $stmt = $pdo->prepare('INSERT INTO guests (event_id, name, email, phone, plus_one, invite_token) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['event_id'],
            $data['name'],
            $data['email'] ?? null,
            $data['phone'] ?? null,
            $data['plus_one'] ?? 0,
            $token,
        ]);
        return (int) $pdo->lastInsertId();
    }

    public static function bulkCreate(int $eventId, array $guests): int
    {
        $count = 0;
        foreach ($guests as $guest) {
            self::create(array_merge($guest, ['event_id' => $eventId]));
            $count++;
        }
        return $count;
    }

    public static function delete(int $id): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('DELETE FROM guests WHERE id = ?');
        $stmt->execute([$id]);
    }
}
