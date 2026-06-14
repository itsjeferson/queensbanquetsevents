<?php
require_once __DIR__ . '/../models/Rsvp.php';
require_once __DIR__ . '/../helpers/response.php';

class RsvpController
{
    public function byEvent(int $eventId): void
    {
        sendResponse([
            'success' => true,
            'data' => [
                'rsvps' => Rsvp::byEvent($eventId),
                'stats' => Rsvp::stats($eventId),
            ],
        ]);
    }

    public function store(array $data): void
    {
        if (empty($data['event_id']) || empty($data['name'])) {
            sendError('event_id and name are required', 400);
        }
        $id = Rsvp::create($data);
        sendResponse(['success' => true, 'data' => ['id' => $id, 'message' => 'RSVP submitted successfully']], 201);
    }
}
