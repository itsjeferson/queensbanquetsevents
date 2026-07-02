<?php
/**
 * One-time migration: allow 'pending_approval' in events.status check constraint.
 *
 * The events table was created with:
 *   CHECK (status IN ('draft', 'published', 'archived'))
 * This adds 'pending_approval' to that allow-list so the client
 * request-publish / admin approve-decline workflow can persist.
 *
 * Safe to run more than once (idempotent).
 *
 * Run via CLI:
 *   set DATABASE_URL=postgresql://...
 *   php backend/scripts/migrate_pending_approval_status.php
 *
 * Or hit it once over HTTP on the deployed API:
 *   https://<api-host>/scripts/migrate_pending_approval_status.php
 */
require_once __DIR__ . '/../config/database.php';

header('Content-Type: text/plain');

try {
    $pdo = getConnection();

    $pdo->exec("ALTER TABLE events DROP CONSTRAINT IF EXISTS events_status_check");
    $pdo->exec(
        "ALTER TABLE events ADD CONSTRAINT events_status_check
         CHECK (status IN ('draft', 'pending_approval', 'published', 'archived'))"
    );

    echo "OK: events_status_check now allows draft, pending_approval, published, archived.\n";
} catch (Throwable $e) {
    http_response_code(500);
    echo 'Migration failed: ' . $e->getMessage() . "\n";
    exit(1);
}
