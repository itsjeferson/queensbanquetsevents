<?php

require_once __DIR__ . '/../config/constants.php';

function isSupabaseStorageConfigured(): bool
{
    return SUPABASE_URL !== '' && SUPABASE_SERVICE_ROLE_KEY !== '';
}

function getSupabasePublicUrl(string $bucket, string $objectPath): string
{
    $base = rtrim(SUPABASE_URL, '/');
    $objectPath = ltrim(str_replace('\\', '/', $objectPath), '/');

    return "{$base}/storage/v1/object/public/{$bucket}/{$objectPath}";
}

function uploadToSupabaseStorage(array $file, string $bucket): ?string
{
    if (!isSupabaseStorageConfigured()) {
        return null;
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $objectPath = uniqid('', true) . ($ext !== '' ? ".{$ext}" : '');
    $contentType = detectUploadMimeType($file['tmp_name'], $ext);

    $base = rtrim(SUPABASE_URL, '/');
    $url = "{$base}/storage/v1/object/{$bucket}/{$objectPath}";

    $body = file_get_contents($file['tmp_name']);
    if ($body === false) {
        return null;
    }

    $response = supabaseStorageRequest('POST', $url, $body, $contentType);
    if ($response['status'] < 200 || $response['status'] >= 300) {
        return null;
    }

    return getSupabasePublicUrl($bucket, $objectPath);
}

function deleteFromSupabaseStorage(?string $storedPath): void
{
    if ($storedPath === null || $storedPath === '' || !isSupabaseStorageConfigured()) {
        return;
    }

    $parsed = parseSupabaseStorageReference($storedPath);
    if ($parsed === null) {
        return;
    }

    [$bucket, $objectPath] = $parsed;
    $base = rtrim(SUPABASE_URL, '/');
    $url = "{$base}/storage/v1/object/{$bucket}/{$objectPath}";

    supabaseStorageRequest('DELETE', $url);
}

function parseSupabaseStorageReference(string $storedPath): ?array
{
    $storedPath = trim($storedPath);
    if ($storedPath === '') {
        return null;
    }

    if (str_starts_with($storedPath, 'http://') || str_starts_with($storedPath, 'https://')) {
        $parts = parse_url($storedPath);
        if ($parts === false || empty($parts['path'])) {
            return null;
        }

        if (preg_match('#/storage/v1/object/public/([^/]+)/(.+)$#', $parts['path'], $matches) !== 1) {
            return null;
        }

        return [$matches[1], rawurldecode($matches[2])];
    }

    $storedPath = ltrim(str_replace('\\', '/', $storedPath), '/');
    if (!str_contains($storedPath, '/')) {
        return null;
    }

    [$bucket, $objectPath] = explode('/', $storedPath, 2);
    if ($bucket === '' || $objectPath === '') {
        return null;
    }

    return [$bucket, $objectPath];
}

function detectUploadMimeType(string $tmpPath, string $ext): string
{
    $mime = null;

    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo !== false) {
            $detected = finfo_file($finfo, $tmpPath);
            finfo_close($finfo);
            if (is_string($detected) && $detected !== '') {
                $mime = $detected;
            }
        }
    }

    if ($mime !== null) {
        return $mime;
    }

    return match ($ext) {
        'jpg', 'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'svg' => 'image/svg+xml',
        'mp4' => 'video/mp4',
        'webm' => 'video/webm',
        'mp3' => 'audio/mpeg',
        'wav' => 'audio/wav',
        'pdf' => 'application/pdf',
        default => 'application/octet-stream',
    };
}

function supabaseStorageRequest(string $method, string $url, ?string $body = null, ?string $contentType = null): array
{
    $headers = [
        'Authorization: Bearer ' . SUPABASE_SERVICE_ROLE_KEY,
        'apikey: ' . SUPABASE_SERVICE_ROLE_KEY,
    ];

    if ($contentType !== null) {
        $headers[] = 'Content-Type: ' . $contentType;
    }

    if ($method === 'POST') {
        $headers[] = 'x-upsert: false';
    }

    $options = [
        'http' => [
            'method' => $method,
            'header' => implode("\r\n", $headers),
            'ignore_errors' => true,
            'timeout' => 60,
        ],
    ];

    if ($body !== null) {
        $options['http']['content'] = $body;
    }

    $context = stream_context_create($options);
    $responseBody = @file_get_contents($url, false, $context);
    $status = 0;

    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $matches) === 1) {
        $status = (int) $matches[1];
    }

    return [
        'status' => $status,
        'body' => is_string($responseBody) ? $responseBody : '',
    ];
}
