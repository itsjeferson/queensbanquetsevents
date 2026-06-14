<?php
require_once __DIR__ . '/../config/database.php';

class GuestMessage
{
    public static function byEvent(int $eventId): array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT * FROM guest_messages WHERE event_id = ? ORDER BY created_at DESC');
        $stmt->execute([$eventId]);
        return $stmt->fetchAll();
    }

    public static function create(array $data): int
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('INSERT INTO guest_messages (event_id, guest_name, message) VALUES (?, ?, ?)');
        $stmt->execute([
            $data['event_id'],
            $data['guest_name'],
            $data['message'],
        ]);
        return (int) $pdo->lastInsertId();
    }
}
