<?php
require_once __DIR__ . '/../config/database.php';

class NotificationFeed
{
    public static function byClient(int $clientId, int $limit = 50): array
    {
        $pdo = getConnection();

        $rsvpStmt = $pdo->prepare(
            'SELECT r.id, r.name, r.attendance, r.submitted_at AS created_at,
                    e.id AS event_id, e.event_name
             FROM rsvps r
             JOIN events e ON r.event_id = e.id
             WHERE e.client_id = ?
             ORDER BY r.submitted_at DESC
             LIMIT 100'
        );
        $rsvpStmt->execute([$clientId]);
        $rsvps = $rsvpStmt->fetchAll();

        $msgStmt = $pdo->prepare(
            'SELECT gm.id, gm.guest_name, gm.message, gm.created_at,
                    e.id AS event_id, e.event_name
             FROM guest_messages gm
             JOIN events e ON gm.event_id = e.id
             WHERE e.client_id = ?
             ORDER BY gm.created_at DESC
             LIMIT 100'
        );
        $msgStmt->execute([$clientId]);
        $messages = $msgStmt->fetchAll();

        $items = [];
        foreach ($rsvps as $row) {
            $items[] = self::formatRsvp($row);
        }
        foreach ($messages as $row) {
            $items[] = self::formatMessage($row);
        }

        usort($items, function ($a, $b) {
            return strtotime($b['created_at']) <=> strtotime($a['created_at']);
        });

        return array_slice($items, 0, $limit);
    }

    private static function formatRsvp(array $row): array
    {
        $name = trim($row['name'] ?? '') ?: 'A guest';
        $eventName = trim($row['event_name'] ?? '') ?: 'your event';
        $attendance = $row['attendance'] ?? 'yes';

        if ($attendance === 'no') {
            $detail = "{$name} declined attendance for {$eventName}.";
        } elseif ($attendance === 'maybe') {
            $detail = "{$name} responded maybe for {$eventName}.";
        } else {
            $detail = "{$name} confirmed attendance for {$eventName}.";
        }

        return [
            'id' => 'rsvp-' . $row['id'],
            'type' => 'rsvp',
            'title' => 'New RSVP response',
            'message' => $detail,
            'created_at' => $row['created_at'],
            'event_id' => (int) $row['event_id'],
            'event_name' => $eventName,
        ];
    }

    private static function formatMessage(array $row): array
    {
        $guestName = trim($row['guest_name'] ?? '') ?: 'A guest';
        $eventName = trim($row['event_name'] ?? '') ?: 'your invitation';

        return [
            'id' => 'message-' . $row['id'],
            'type' => 'guest_message',
            'title' => 'Guest message',
            'message' => "{$guestName} left a message on {$eventName}.",
            'created_at' => $row['created_at'],
            'event_id' => (int) $row['event_id'],
            'event_name' => $eventName,
        ];
    }
}
