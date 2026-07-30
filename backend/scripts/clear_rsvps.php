<?php
/**
 * CLI script: php scripts/clear_rsvps.php <slug>
 *
 * Deletes all RSVPs for an event identified by its slug.
 * Requires DATABASE_URL env var or prompts for it.
 */

$slug = $argv[1] ?? '';
if (!$slug) {
    echo "Usage: php scripts/clear_rsvps.php <slug>\n";
    echo "       Set DATABASE_URL env var or edit this script.\n";
    exit(1);
}

$databaseUrl = getenv('DATABASE_URL');
if (!$databaseUrl) {
    echo "DATABASE_URL not set. Provide it now (or press Ctrl+C to quit):\n";
    $databaseUrl = trim(fgets(STDIN));
    if (!$databaseUrl) {
        echo "No DATABASE_URL provided. Aborting.\n";
        exit(1);
    }
}

$dsn = str_replace('postgresql://', 'pgsql://', $databaseUrl);
$parts = parse_url($dsn);
$host = $parts['host'] ?? 'localhost';
$port = $parts['port'] ?? '5432';
$user = $parts['user'] ?? 'postgres';
$pass = $parts['pass'] ?? '';
$dbname = ltrim($parts['path'] ?? '/queens_banquet', '/');

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $stmt = $pdo->prepare("SELECT id, event_name FROM events WHERE LOWER(slug) = LOWER(?) AND status != 'archived'");
    $stmt->execute([$slug]);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$event) {
        echo "Event with slug '$slug' not found.\n";
        exit(1);
    }

    echo "Found event: {$event['event_name']} (ID: {$event['id']})\n";

    $stmt = $pdo->prepare('SELECT COUNT(*) FROM rsvps WHERE event_id = ?');
    $stmt->execute([$event['id']]);
    $count = (int) $stmt->fetchColumn();
    echo "RSVPs to delete: $count\n";

    if ($count === 0) {
        echo "No RSVPs to clear.\n";
        exit(0);
    }

    echo "Proceed? (yes/no): ";
    $confirm = strtolower(trim(fgets(STDIN)));
    if ($confirm !== 'yes') {
        echo "Aborted.\n";
        exit(0);
    }

    $stmt = $pdo->prepare('DELETE FROM rsvps WHERE event_id = ?');
    $stmt->execute([$event['id']]);
    $deleted = $stmt->rowCount();

    echo "Successfully deleted $deleted RSVP(s) for '{$event['event_name']}'.\n";
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
    exit(1);
}
