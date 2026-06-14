<?php
require_once __DIR__ . '/../config/constants.php';

function handleUpload(array $file, string $subdir): ?string
{
    if ($file['error'] !== UPLOAD_ERR_OK) return null;
    if ($file['size'] > UPLOAD_MAX_SIZE) return null;

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
