<?php
require_once __DIR__ . '/../models/GuestMessage.php';
require_once __DIR__ . '/../helpers/response.php';

class GuestMessageController
{
    public function byEvent(int $eventId): void
    {
        sendResponse(['success' => true, 'data' => GuestMessage::byEvent($eventId)]);
    }

    public function store(array $data): void
    {
        if (empty($data['event_id']) || empty($data['guest_name']) || empty($data['message'])) {
            sendError('event_id, guest_name, and message are required', 400);
        }
        $id = GuestMessage::create($data);
        sendResponse(['success' => true, 'data' => ['id' => $id]], 201);
    }
}
