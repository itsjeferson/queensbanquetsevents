<?php
try {
    // 1. Connect to postgres database
    $dsn = 'pgsql:host=localhost;port=5432;dbname=postgres';
    $pdo = new PDO($dsn, 'postgres', 'postgres', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    // Check if queens_banquet exists
    $stmt = $pdo->query("SELECT COUNT(*) FROM pg_database WHERE datname = 'queens_banquet'");
    if ($stmt->fetchColumn() == 0) {
        $pdo->exec("CREATE DATABASE queens_banquet");
        echo "Database 'queens_banquet' created successfully.\n";
    } else {
        echo "Database 'queens_banquet' already exists.\n";
    }

    // 2. Connect to queens_banquet database
    $dsnQB = 'pgsql:host=localhost;port=5432;dbname=queens_banquet';
    $pdoQB = new PDO($dsnQB, 'postgres', 'postgres', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    // 3. Check if table users exists
    $stmt = $pdoQB->query("SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users'");
    if ($stmt->fetchColumn() == 0) {
        // Read queens_banquet.sql
        $sql = file_get_contents(__DIR__ . '/../../database/queens_banquet.sql');
        // Split by semicolon (rough split) or run directly
        $pdoQB->exec($sql);
        echo "Schema 'queens_banquet.sql' loaded successfully.\n";
    } else {
        echo "Tables already exist in 'queens_banquet'.\n";
    }

    // 4. Seed new wedding templates (Sage Garden & Navy Elegance)
    $stmt = $pdoQB->prepare('SELECT COUNT(*) FROM invitation_templates WHERE template_name = ? AND category = ?');
    $stmt->execute(['Sage Garden', 'wedding']);
    if ($stmt->fetchColumn() == 0) {
        $stmtInsert = $pdoQB->prepare('INSERT INTO invitation_templates (template_name, category, preview_image, theme_config, status) VALUES (?, ?, ?, ?, ?)');
        $stmtInsert->execute([
            'Sage Garden',
            'wedding',
            '/images/templates/wedding-sage.jpg',
            json_encode([
                'primary' => '#6B8F71',
                'accent' => '#3E5C44',
                'font' => 'Inter'
            ]),
            'active'
        ]);
        echo "Added 'Sage Garden' wedding template.\n";
    }

    $stmt->execute(['Navy Elegance', 'wedding']);
    if ($stmt->fetchColumn() == 0) {
        $stmtInsert = $pdoQB->prepare('INSERT INTO invitation_templates (template_name, category, preview_image, theme_config, status) VALUES (?, ?, ?, ?, ?)');
        $stmtInsert->execute([
            'Navy Elegance',
            'wedding',
            '/images/templates/wedding-navy.jpg',
            json_encode([
                'primary' => '#2C3E50',
                'accent' => '#1A252F',
                'font' => 'Playfair Display'
            ]),
            'active'
        ]);
        echo "Added 'Navy Elegance' wedding template.\n";
    }

} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
