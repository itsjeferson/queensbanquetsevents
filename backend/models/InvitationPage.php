<?php
require_once __DIR__ . '/../config/database.php';

class InvitationPage
{
    public static function findByEventId(int $eventId): ?array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT ip.*, it.template_name, it.category, it.theme_config FROM invitation_pages ip LEFT JOIN invitation_templates it ON ip.template_id = it.id WHERE ip.event_id = ?');
        $stmt->execute([$eventId]);
        $row = $stmt->fetch();
        return $row ? self::decodeJsonFields($row) : null;
    }

    public static function create(int $eventId, array $data = []): int
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('INSERT INTO invitation_pages (event_id, template_id, cover_image, background_music, primary_color, font_family, story, entourage, venue, dress_code, program, gallery, videos, gift_registry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $eventId,
            $data['template_id'] ?? null,
            $data['cover_image'] ?? null,
            $data['background_music'] ?? null,
            $data['primary_color'] ?? '#D4AF37',
            $data['font_family'] ?? 'Playfair Display',
            json_encode($data['story'] ?? []),
            json_encode($data['entourage'] ?? []),
            json_encode($data['venue'] ?? []),
            $data['dress_code'] ?? '',
            json_encode($data['program'] ?? []),
            json_encode($data['gallery'] ?? []),
            json_encode($data['videos'] ?? []),
            json_encode($data['gift_registry'] ?? []),
        ]);
        return (int) $pdo->lastInsertId();
    }

    public static function update(int $eventId, array $data): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE invitation_pages SET template_id = ?, cover_image = ?, background_music = ?, primary_color = ?, font_family = ?, story = ?, entourage = ?, venue = ?, dress_code = ?, program = ?, gallery = ?, videos = ?, gift_registry = ?, qr_enabled = ? WHERE event_id = ?');
        $stmt->execute([
            $data['template_id'] ?? null,
            $data['cover_image'] ?? null,
            $data['background_music'] ?? null,
            $data['primary_color'] ?? '#D4AF37',
            $data['font_family'] ?? 'Playfair Display',
            json_encode($data['story'] ?? []),
            json_encode($data['entourage'] ?? []),
            json_encode($data['venue'] ?? []),
            $data['dress_code'] ?? '',
            json_encode($data['program'] ?? []),
            json_encode($data['gallery'] ?? []),
            json_encode($data['videos'] ?? []),
            json_encode($data['gift_registry'] ?? []),
            $data['qr_enabled'] ?? 1,
            $eventId,
        ]);
    }

    public static function markPublished(int $eventId): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE invitation_pages SET published_at = NOW() WHERE event_id = ?');
        $stmt->execute([$eventId]);
    }

    private static function decodeJsonFields(array $row): array
    {
        foreach (['story', 'entourage', 'venue', 'program', 'gallery', 'videos', 'gift_registry', 'theme_config'] as $field) {
            if (isset($row[$field]) && is_string($row[$field])) {
                $row[$field] = json_decode($row[$field], true) ?? [];
            }
        }
        return $row;
    }
}
