<?php
require_once __DIR__ . '/../config/database.php';

class Rsvp
{
    public static function byEvent(int $eventId): array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT * FROM rsvps WHERE event_id = ? ORDER BY submitted_at DESC');
        $stmt->execute([$eventId]);
        return $stmt->fetchAll();
    }

    public static function stats(int $eventId): array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT attendance, COUNT(*) as count, SUM(guest_count) as total_guests FROM rsvps WHERE event_id = ? GROUP BY attendance');
        $stmt->execute([$eventId]);
        return self::aggregateStats($stmt->fetchAll());
    }

    public static function byClient(int $clientId): array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare(
            'SELECT r.*, e.event_name
             FROM rsvps r
             JOIN events e ON r.event_id = e.id
             WHERE e.client_id = ?
             ORDER BY r.submitted_at DESC'
        );
        $stmt->execute([$clientId]);
        return $stmt->fetchAll();
    }

    public static function statsByClient(int $clientId): array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare(
            'SELECT r.attendance, COUNT(*) as count, SUM(r.guest_count) as total_guests
             FROM rsvps r
             JOIN events e ON r.event_id = e.id
             WHERE e.client_id = ?
             GROUP BY r.attendance'
        );
        $stmt->execute([$clientId]);
        return self::aggregateStats($stmt->fetchAll());
    }

    private static function aggregateStats(array $rows): array
    {
        $stats = ['yes' => 0, 'no' => 0, 'maybe' => 0, 'total_responses' => 0, 'total_attending' => 0];
        foreach ($rows as $row) {
            $stats[$row['attendance']] = (int) $row['count'];
            $stats['total_responses'] += (int) $row['count'];
            if ($row['attendance'] === 'yes') {
                $stats['total_attending'] += (int) $row['total_guests'];
            }
        }
        return $stats;
    }

    public static function create(array $data): int
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('INSERT INTO rsvps (guest_id, event_id, name, email, phone, attendance, meal_preference, guest_count, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['guest_id'] ?? null,
            $data['event_id'],
            $data['name'],
            $data['email'] ?? null,
            $data['phone'] ?? null,
            $data['attendance'] ?? 'yes',
            $data['meal_preference'] ?? null,
            $data['guest_count'] ?? 1,
            $data['message'] ?? null,
        ]);
        return (int) $pdo->lastInsertId();
    }
}
