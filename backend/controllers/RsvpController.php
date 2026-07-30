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

    public function byClient(int $clientId): void
    {
        sendResponse([
            'success' => true,
            'data' => [
                'rsvps' => Rsvp::byClient($clientId),
                'stats' => Rsvp::statsByClient($clientId),
            ],
        ]);
    }

    public function clearBySlug(string $slug): void
    {
        require_once __DIR__ . '/../models/Event.php';
        $event = Event::findBySlugAny($slug);
        if (!$event) {
            sendError('Event not found with slug: ' . $slug, 404);
            return;
        }
        $count = Rsvp::deleteByEvent((int) $event['id']);
        sendResponse([
            'success' => true,
            'message' => "Deleted $count RSVP(s) for event '{$event['event_name']}'"
        ]);
    }

    public function store(array $data): void
    {
        if (empty($data['event_id']) || empty($data['name'])) {
            sendError('event_id and name are required', 400);
        }

        $email = $data['email'] ?? null;
        $phone = $data['phone'] ?? null;

        if (Rsvp::existsForEvent((int)$data['event_id'], $data['name'], $email, $phone)) {
            sendResponse([
                'success' => false,
                'error' => 'duplicate',
                'message' => 'You have already submitted an RSVP for this invitation.'
            ], 409);
            return;
        }

        $id = Rsvp::create($data);
        sendResponse(['success' => true, 'data' => ['id' => $id, 'message' => 'RSVP submitted successfully']], 201);
    }
}
