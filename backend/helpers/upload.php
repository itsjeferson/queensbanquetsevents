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
    $filename = uniqid() . '.' . $ext;
    $path = $dir . $filename;

    if (move_uploaded_file($file['tmp_name'], $path)) {
        return $subdir . '/' . $filename;
    }

    return null;
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
