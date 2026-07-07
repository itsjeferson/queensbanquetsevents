<?php
require_once __DIR__ . '/../config/database.php';

class InvitationTemplate
{
    public static function all(?string $category = null): array
    {
        $pdo = getConnection();
        if ($category) {
            $stmt = $pdo->prepare('SELECT * FROM invitation_templates WHERE status = ? AND category = ? ORDER BY template_name');
            $stmt->execute(['active', $category]);
            return self::decodeAll($stmt->fetchAll());
        }
        $rows = $pdo->query("SELECT * FROM invitation_templates WHERE status = 'active' ORDER BY category, template_name")->fetchAll();
        return self::decodeAll($rows);
    }

    public static function find(int $id): ?array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT * FROM invitation_templates WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) return null;
        if (isset($row['theme_config']) && is_string($row['theme_config'])) {
            $row['theme_config'] = json_decode($row['theme_config'], true) ?? [];
        }
        return $row;
    }

    public static function create(array $data): int
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('INSERT INTO invitation_templates (template_name, category, preview_image, theme_config, status) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            $data['template_name'],
            $data['category'],
            $data['preview_image'] ?? null,
            json_encode($data['theme_config'] ?? []),
            $data['status'] ?? 'active',
        ]);
        return dbLastInsertId($pdo, 'invitation_templates');
    }

    public static function update(int $id, array $data): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE invitation_templates SET template_name = ?, category = ?, preview_image = ?, theme_config = ?, status = ? WHERE id = ?');
        $stmt->execute([
            $data['template_name'],
            $data['category'],
            $data['preview_image'] ?? null,
            json_encode($data['theme_config'] ?? []),
            $data['status'] ?? 'active',
            $id,
        ]);
    }

    public static function delete(int $id): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('DELETE FROM invitation_templates WHERE id = ?');
        $stmt->execute([$id]);
    }

    private static function decodeAll(array $rows): array
    {
        return array_map(function ($row) {
            if (isset($row['theme_config']) && is_string($row['theme_config'])) {
                $row['theme_config'] = json_decode($row['theme_config'], true) ?? [];
            }
            return $row;
        }, $rows);
    }
}
