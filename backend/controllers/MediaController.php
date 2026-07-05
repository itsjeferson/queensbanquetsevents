<?php
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/upload.php';
require_once __DIR__ . '/../middleware/authMiddleware.php';

class MediaController
{
    public function uploadInvitationMedia(): void
    {
        requireAuth();

        if (empty($_FILES['file'])) {
            sendError('File required', 422);
        }

        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            sendError('Upload failed', 422);
        }

        if (!$this->isAllowedMediaType($file)) {
            sendError('Unsupported file type. Use JPG, PNG, WEBP, GIF, MP4, WebM, MP3, or WAV.', 422);
        }

        $path = handleUpload($file, 'events');
        if (!$path) {
            sendError('Upload failed', 500);
        }

        sendResponse([
            'success' => true,
            'data' => [
                'url' => getPublicUploadUrl($path),
                'path' => $path,
            ],
        ], 201);
    }

    private function isAllowedMediaType(array $file): bool
    {
        $ext = strtolower(pathinfo($file['name'] ?? '', PATHINFO_EXTENSION));
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'mp3', 'wav', 'ogg', 'm4a'];

        if (!in_array($ext, $allowedExtensions, true)) {
            return false;
        }

        $mime = detectUploadMimeType($file['tmp_name'], $ext);
        $allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/webm',
            'audio/mpeg',
            'audio/wav',
            'audio/ogg',
            'audio/mp4',
            'audio/x-wav',
        ];

        return in_array($mime, $allowedMimes, true);
    }
}
