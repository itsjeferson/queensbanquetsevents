<?php
require_once __DIR__ . '/../models/Gallery.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/upload.php';
require_once __DIR__ . '/../middleware/adminMiddleware.php';

class GalleryController
{
    public function index(): void
    {
        $category = $_GET['category'] ?? null;
        sendResponse(['success' => true, 'data' => Gallery::all($category)]);
    }

    public function upload(): void
    {
        requireAdmin();
        if (empty($_FILES['image'])) sendError('Image file required', 422);
        $path = handleUpload($_FILES['image'], 'gallery');
        if (!$path) sendError('Upload failed', 500);

        $id = Gallery::create([
            'category' => $_POST['category'] ?? 'general',
            'caption' => $_POST['caption'] ?? '',
            'image_path' => $path,
        ]);
        sendResponse(['success' => true, 'data' => ['id' => $id]], 201);
    }

    public function destroy(int $id): void
    {
        requireAdmin();
        Gallery::delete($id);
        sendResponse(['success' => true, 'message' => 'Image deleted']);
    }
}
