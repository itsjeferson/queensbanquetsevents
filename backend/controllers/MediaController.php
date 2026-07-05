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
            sendError('File required. Make sure you are logged in and selected a file.', 422);
        }

        $file = $_FILES['file'];
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            sendError(describeUploadFailure($file, 'events'), 422);
        }

        if (!$this->isAllowedMediaType($file)) {
            $ext = strtolower(pathinfo($file['name'] ?? '', PATHINFO_EXTENSION));
            sendError(
                'Unsupported file type'
                . ($ext !== '' ? " ({$ext})" : '')
                . '. Use JPG, PNG, WEBP, GIF, MP4, WebM, MP3, WAV, or M4A.',
                422
            );
        }

        $path = handleUpload($file, 'events');
        if (!$path) {
            sendError(describeUploadFailure($file, 'events'), 500);
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
            'video/quicktime',
            'audio/mpeg',
            'audio/mp3',
            'audio/wav',
            'audio/ogg',
            'audio/mp4',
            'audio/x-wav',
            'audio/x-m4a',
            'application/ogg',
            'application/octet-stream',
        ];

        if (in_array($mime, $allowedMimes, true)) {
            return true;
        }

        // Windows and some browsers report generic MIME types even for valid files.
        return in_array($ext, $allowedExtensions, true);
    }
}
