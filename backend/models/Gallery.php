<?php
require_once __DIR__ . '/../config/database.php';

class Gallery
{
    public static function all(?string $category = null): array
    {
        $pdo = getConnection();
        if ($category) {
            $stmt = $pdo->prepare('SELECT * FROM gallery WHERE category = ? ORDER BY created_at DESC');
            $stmt->execute([$category]);
            return $stmt->fetchAll();
        }
        return $pdo->query('SELECT * FROM gallery ORDER BY created_at DESC')->fetchAll();
    }

    public static function create(array $data): int
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('INSERT INTO gallery (category, caption, image_path) VALUES (?, ?, ?)');
        $stmt->execute([$data['category'], $data['caption'], $data['image_path']]);
        return dbLastInsertId($pdo, 'gallery');
    }

    public static function delete(int $id): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('DELETE FROM gallery WHERE id = ?');
        $stmt->execute([$id]);
    }
}
