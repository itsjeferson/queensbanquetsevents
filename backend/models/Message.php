<?php
require_once __DIR__ . '/../config/database.php';

class Message
{
    public static function getByBooking(int $bookingId): array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT * FROM messages WHERE booking_id = ? ORDER BY created_at ASC');
        $stmt->execute([$bookingId]);
        return $stmt->fetchAll();
    }

    public static function create(array $data): int
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('INSERT INTO messages (booking_id, sender_id, message) VALUES (?, ?, ?)');
        $stmt->execute([$data['booking_id'], $data['sender_id'], $data['message']]);
        return (int) $pdo->lastInsertId();
    }
}
