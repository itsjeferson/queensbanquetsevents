<?php

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', getenv('DB_PORT') ?: '5432');
define('DB_NAME', getenv('DB_NAME') ?: 'queens_banquet');
define('DB_USER', getenv('DB_USER') ?: 'postgres');
define('DB_PASS', getenv('DB_PASS') ?: '');

function getConnection(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $databaseUrl = getenv('DATABASE_URL');
        if ($databaseUrl) {
            $pdo = createPdoFromDatabaseUrl($databaseUrl);
        } else {
            $dsn = 'pgsql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME;
            $pdo = new PDO($dsn, DB_USER, DB_PASS, pdoOptions());
        }
    }
    return $pdo;
}

function createPdoFromDatabaseUrl(string $url): PDO
{
    $parts = parse_url($url);
    if ($parts === false || empty($parts['host'])) {
        throw new RuntimeException('Invalid DATABASE_URL');
    }

    $host = $parts['host'];
    $port = $parts['port'] ?? 5432;
    $dbname = ltrim($parts['path'] ?? '', '/');
    $user = isset($parts['user']) ? rawurldecode($parts['user']) : '';
    $pass = isset($parts['pass']) ? rawurldecode($parts['pass']) : '';

    $dsn = "pgsql:host={$host};port={$port};dbname={$dbname};sslmode=require";
    return new PDO($dsn, $user, $pass, pdoOptions());
}

function pdoOptions(): array
{
    return [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
}

function dbLastInsertId(PDO $pdo, string $table): int
{
    return (int) $pdo->lastInsertId($table . '_id_seq');
}
