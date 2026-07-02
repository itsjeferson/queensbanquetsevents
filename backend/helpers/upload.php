<?php
require_once __DIR__ . '/../config/constants.php';
require_once __DIR__ . '/supabase_storage.php';

function handleUpload(array $file, string $subdir): ?string
{
    if ($file['error'] !== UPLOAD_ERR_OK) return null;
    if ($file['size'] > UPLOAD_MAX_SIZE) return null;

    if (isSupabaseStorageConfigured()) {
        return uploadToSupabaseStorage($file, $subdir);
    }

    return handleLocalUpload($file, $subdir);
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
