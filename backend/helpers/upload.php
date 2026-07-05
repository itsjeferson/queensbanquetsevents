<?php
require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/supabase_storage.php';

function handleUpload(array $file, string $subdir): ?string
{
    if ($file['error'] !== UPLOAD_ERR_OK) return null;
    if ($file['size'] > UPLOAD_MAX_SIZE) return null;

    if (isSupabaseStorageConfigured()) {
        $supabasePath = uploadToSupabaseStorage($file, $subdir);
        if ($supabasePath !== null) {
            return $supabasePath;
        }
    }

    return handleLocalUpload($file, $subdir);
}

function describeUploadFailure(array $file, string $subdir): string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        return match ($file['error']) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'File is too large for the server upload limit.',
            UPLOAD_ERR_PARTIAL => 'The upload was interrupted. Please try again.',
            UPLOAD_ERR_NO_FILE => 'No file was received by the server.',
            default => 'The server could not accept the uploaded file.',
        };
    }

    if (($file['size'] ?? 0) > UPLOAD_MAX_SIZE) {
        return 'File exceeds the ' . (int) (UPLOAD_MAX_SIZE / (1024 * 1024)) . ' MB server limit.';
    }

    $dir = UPLOAD_PATH . $subdir . '/';
    if (!is_dir($dir) && !@mkdir($dir, 0755, true) && !is_dir($dir)) {
        return 'Server upload folder is not writable.';
    }

    if (isSupabaseStorageConfigured()) {
        return 'Cloud storage upload failed. Check Supabase bucket settings or try again.';
    }

    return 'Could not save the uploaded file on the server.';
}

function handleLocalUpload(array $file, string $subdir): ?string
{
    $dir = UPLOAD_PATH . $subdir . '/';
    if (!is_dir($dir)) mkdir($dir, 0755, true);

    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('', true) . ($ext !== '' ? '.' . $ext : '');
    $path = $dir . $filename;

    $tmpName = $file['tmp_name'] ?? '';
    if ($tmpName === '') {
        return null;
    }

    $saved = is_uploaded_file($tmpName)
        ? move_uploaded_file($tmpName, $path)
        : copy($tmpName, $path);

    if ($saved) {
        return $subdir . '/' . $filename;
    }

    return null;
}

function isStoredMediaUrl(string $url): bool
{
    if (str_contains($url, '/storage/v1/object/public/')) {
        return true;
    }

    $configured = rtrim(getenv('API_PUBLIC_URL') ?: '', '/');
    if ($configured !== '' && str_starts_with($url, $configured . '/uploads/')) {
        return true;
    }

    return (bool) preg_match('#/uploads/[a-z0-9_\-/]+\.(jpe?g|png|gif|webp|mp4|webm|mp3|wav|ogg|m4a)(\?|#|$)#i', $url);
}

function importRemoteMediaToStorage(string $url, ?string $bucket = null): ?string
{
    $url = trim($url);
    if ($url === '' || !filter_var($url, FILTER_VALIDATE_URL)) {
        return null;
    }

    if (isStoredMediaUrl($url)) {
        return $url;
    }

    $bucket = $bucket ?: (defined('INVITATION_MEDIA_BUCKET') ? INVITATION_MEDIA_BUCKET : 'invitations');
    $context = stream_context_create([
        'http' => [
            'timeout' => 30,
            'follow_location' => 1,
            'header' => "User-Agent: QueensBanquetMediaImporter/1.0\r\n",
        ],
    ]);

    $body = @file_get_contents($url, false, $context);
    if ($body === false || $body === '') {
        return null;
    }

    $path = parse_url($url, PHP_URL_PATH) ?: '';
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mp3', 'wav', 'ogg', 'm4a'];
    if (!in_array($ext, $allowedExtensions, true)) {
        $ext = 'jpg';
    }

    $tmpPath = tempnam(sys_get_temp_dir(), 'qb-media-');
    if ($tmpPath === false) {
        return null;
    }

    $tmpFile = $tmpPath . '.' . $ext;
    rename($tmpPath, $tmpFile);

    if (@file_put_contents($tmpFile, $body) === false) {
        @unlink($tmpFile);
        return null;
    }

    $file = [
        'name' => 'imported.' . $ext,
        'type' => detectUploadMimeType($tmpFile, $ext),
        'tmp_name' => $tmpFile,
        'error' => UPLOAD_ERR_OK,
        'size' => filesize($tmpFile) ?: 0,
    ];

    $stored = handleUpload($file, $bucket);
    @unlink($tmpFile);

    return $stored ? getPublicUploadUrl($stored) : null;
}

function getPublicUploadUrl(string $path): string
{
    if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
        return $path;
    }

    $configured = rtrim(getenv('API_PUBLIC_URL') ?: '', '/');
    if ($configured !== '') {
        return $configured . '/uploads/' . ltrim(str_replace('\\', '/', $path), '/');
    }

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

    return $scheme . '://' . $host . '/uploads/' . ltrim(str_replace('\\', '/', $path), '/');
}

function deleteUploadedFile(?string $storedPath): void
{
    if ($storedPath === null || $storedPath === '') {
        return;
    }

    if (str_starts_with($storedPath, 'http://') || str_starts_with($storedPath, 'https://')) {
        deleteFromSupabaseStorage($storedPath);
        return;
    }

    $relativePath = ltrim(str_replace('\\', '/', $storedPath), '/');
    $localPath = UPLOAD_PATH . $relativePath;
    if (is_file($localPath)) {
        unlink($localPath);
    }
}
