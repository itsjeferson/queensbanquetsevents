<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/slug.php';

class Event
{
    public static function all(?int $clientId = null): array
    {
        $pdo = getConnection();
        if ($clientId) {
            $stmt = $pdo->prepare(
                "SELECT e.*, u.first_name, u.last_name FROM events e JOIN users u ON e.client_id = u.id
                 WHERE e.client_id = ? AND e.status != 'archived' ORDER BY e.event_date DESC"
            );
            $stmt->execute([$clientId]);
            return $stmt->fetchAll();
        }
        $sql = "SELECT e.*, u.first_name, u.last_name FROM events e JOIN users u ON e.client_id = u.id
                WHERE e.status != 'archived' ORDER BY e.event_date DESC";
        return $pdo->query($sql)->fetchAll();
    }

    public static function find(int $id): ?array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT e.*, u.first_name, u.last_name FROM events e JOIN users u ON e.client_id = u.id WHERE e.id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public static function findBySlug(string $slug): ?array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT * FROM events WHERE LOWER(slug) = LOWER(?) AND status = ?');
        $stmt->execute([$slug, 'published']);
        return $stmt->fetch() ?: null;
    }

    public static function findBySlugAny(string $slug): ?array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare("SELECT * FROM events WHERE LOWER(slug) = LOWER(?) AND status != 'archived'");
        $stmt->execute([$slug]);
        return $stmt->fetch() ?: null;
    }

    public static function findByCode(string $code): ?array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT * FROM events WHERE invite_code = ? AND status = ?');
        $stmt->execute([strtoupper($code), 'published']);
        return $stmt->fetch() ?: null;
    }

    public static function create(array $data): int
    {
        $pdo = getConnection();
        $slug = $data['slug'] ?? generateSlug($data['event_name']);
        $code = generateInviteCode();

        $stmt = $pdo->prepare('INSERT INTO events (client_id, booking_id, event_name, event_type, event_date, slug, invite_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['client_id'],
            $data['booking_id'] ?? null,
            $data['event_name'],
            $data['event_type'],
            $data['event_date'],
            $slug,
            $code,
            $data['status'] ?? 'draft',
        ]);
        return dbLastInsertId($pdo, 'events');
    }

    public static function update(int $id, array $data): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE events SET event_name = ?, event_type = ?, event_date = ?, slug = ?, status = ? WHERE id = ?');
        $stmt->execute([
            $data['event_name'],
            $data['event_type'],
            $data['event_date'],
            $data['slug'] ?? generateSlug($data['event_name']),
            $data['status'] ?? 'draft',
            $id,
        ]);
    }

    public static function publish(int $id): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE events SET status = ? WHERE id = ?');
        $stmt->execute(['published', $id]);
    }

    // Client submits their invitation for admin review instead of publishing directly.
    public static function requestPublish(int $id): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE events SET status = ? WHERE id = ?');
        $stmt->execute(['pending_approval', $id]);
    }

    // Admin approves a pending request — same end state as a direct publish.
    public static function approvePublish(int $id): void
    {
        self::publish($id);
    }

    // Admin declines a pending request, sending it back to draft for the client to revise.
    public static function declinePublish(int $id): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE events SET status = ? WHERE id = ?');
        $stmt->execute(['draft', $id]);
    }

    public static function delete(int $id): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE events SET status = ? WHERE id = ?');
        $stmt->execute(['archived', $id]);
    }
}
