<?php
/**
 * Seeds default super admin + demo client. Run once from project root:
 *   php backend/scripts/seed_default_users.php
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
        'INSERT INTO users (first_name, last_name, email, phone, password, role)
         VALUES (?, ?, ?, ?, ?, ?)
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
        echo "Seeded {$user['role']}: {$user['email']}\n";
    }

    echo "\nSuper Admin login: queensbanquet@gmail.com / QueensAdmin2026!\n";
    echo "Client login: client@queensbanquetevents.ph / ClientDemo2026!\n";
} catch (Throwable $e) {
    fwrite(STDERR, 'Seed failed: ' . $e->getMessage() . PHP_EOL);
    exit(1);
}
