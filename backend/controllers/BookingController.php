<?php
require_once __DIR__ . '/../models/Booking.php';
require_once __DIR__ . '/../helpers/response.php';

class BookingController
{
    public function index(): void
    {
        sendResponse(['success' => true, 'data' => Booking::all()]);
    }

    public function show(int $id): void
    {
        $booking = Booking::find($id);
        if (!$booking) sendError('Booking not found', 404);
        sendResponse(['success' => true, 'data' => $booking]);
    }

    public function store(array $data): void
    {
        $id = Booking::create($data);
        sendResponse(['success' => true, 'data' => ['id' => $id]], 201);
    }

    public function update(int $id, array $data): void
    {
        Booking::update($id, $data);
        sendResponse(['success' => true, 'message' => 'Booking updated']);
    }

    public function destroy(int $id): void
    {
        Booking::delete($id);
        sendResponse(['success' => true, 'message' => 'Booking cancelled']);
    }
}
