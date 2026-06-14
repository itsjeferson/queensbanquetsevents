<?php
require_once __DIR__ . '/../models/Payment.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/upload.php';

class PaymentController
{
    public function index(): void
    {
        sendResponse(['success' => true, 'data' => Payment::all()]);
    }

    public function upload(): void
    {
        if (empty($_FILES['receipt'])) sendError('Receipt file required', 422);
        $path = handleUpload($_FILES['receipt'], 'payments');
        if (!$path) sendError('Upload failed', 500);

        $id = Payment::create([
            'booking_id' => $_POST['booking_id'] ?? null,
            'amount' => $_POST['amount'] ?? 0,
            'receipt_path' => $path,
            'status' => 'pending',
        ]);
        sendResponse(['success' => true, 'data' => ['id' => $id]], 201);
    }

    public function verify(int $id, array $data): void
    {
        Payment::updateStatus($id, $data['status'] ?? 'verified');
        sendResponse(['success' => true, 'message' => 'Payment status updated']);
    }
}
