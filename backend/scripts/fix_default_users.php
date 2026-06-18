<?php
/**
 * Reset default super admin + client roles/passwords.
 * Run from project root:
 *   set DATABASE_URL=postgresql://...
 *   php backend/scripts/fix_default_users.php
 */
require_once __DIR__ . '/../config/database.php';

$users = [
    [
        'first_name' => 'Marou',
        'last_name' => 'Madrid',
        'email' => 'queensbanquet@gmail.com',
        'phone' => '+63 917 100 0001',
        'password' => 'QueensAdmin2026!',
        'role' => 'super_admin',
    ],
    [
        'first_name' => 'Sophia',
        'last_name' => 'Reyes',
        'email' => 'client@queensbanquetevents.ph',
        'phone' => '+63 917 200 0002',
        'password' => 'ClientDemo2026!',
        'role' => 'client',
    ],
];

try {
    $pdo = getConnection();
    $stmt = $pdo->prepare(
        'INSERT INTO users (first_name, last_name, email, phone, password, role, status)
         VALUES (?, ?, ?, ?, ?, ?, \'active\')
         ON CONFLICT (email) DO UPDATE SET
           first_name = EXCLUDED.first_name,
           last_name = EXCLUDED.last_name,
           phone = EXCLUDED.phone,
           password = EXCLUDED.password,
           role = EXCLUDED.role,
           status = \'active\''
    );

    foreach ($users as $user) {
        $stmt->execute([
            $user['first_name'],
            $user['last_name'],
            $user['email'],
            $user['phone'],
            password_hash($user['password'], PASSWORD_DEFAULT),
            $user['role'],
        ]);
        echo "Fixed {$user['role']}: {$user['email']}\n";
    }

    $rows = $pdo->query('SELECT id, email, role, status FROM users ORDER BY id')->fetchAll();
    echo "\nCurrent users:\n";
    foreach ($rows as $row) {
        echo "- #{$row['id']} {$row['email']} ({$row['role']}, {$row['status']})\n";
    }
} catch (Throwable $e) {
    fwrite(STDERR, 'Fix failed: ' . $e->getMessage() . PHP_EOL);
    exit(1);
}
