<?php
require_once __DIR__ . '/../models/Guest.php';
require_once __DIR__ . '/../helpers/response.php';

class GuestController
{
    public function byEvent(int $eventId): void
    {
        sendResponse(['success' => true, 'data' => Guest::byEvent($eventId)]);
    }

    public function store(array $data): void
    {
        if (empty($data['event_id']) || empty($data['name'])) {
            sendError('event_id and name are required', 400);
        }
        $id = Guest::create($data);
        sendResponse(['success' => true, 'data' => Guest::find($id)], 201);
    }

    public function bulkStore(array $data): void
    {
        if (empty($data['event_id']) || empty($data['guests'])) {
            sendError('event_id and guests array are required', 400);
        }
        $count = Guest::bulkCreate((int) $data['event_id'], $data['guests']);
        sendResponse(['success' => true, 'data' => ['imported' => $count]]);
    }

    public function destroy(int $id): void
    {
        Guest::delete($id);
        sendResponse(['success' => true, 'message' => 'Guest removed']);
    }
}
