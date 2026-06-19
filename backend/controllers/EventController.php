<?php
require_once __DIR__ . '/../models/Event.php';
require_once __DIR__ . '/../models/InvitationPage.php';
require_once __DIR__ . '/../models/GuestMessage.php';
require_once __DIR__ . '/../helpers/response.php';

class EventController
{
    public function index(): void
    {
        $clientId = isset($_GET['client_id']) ? (int) $_GET['client_id'] : null;
        sendResponse(['success' => true, 'data' => Event::all($clientId)]);
    }

    public function show(int $id): void
    {
        $event = Event::find($id);
        if (!$event) sendError('Event not found', 404);
        $page = InvitationPage::findByEventId($id);
        sendResponse(['success' => true, 'data' => [
            'event' => $event,
            'invitation' => $page,
            'guest_messages' => GuestMessage::byEvent($id),
        ]]);
    }

    public function store(array $data): void
    {
        if (empty($data['event_name']) || empty($data['event_type']) || empty($data['event_date'])) {
            sendError('event_name, event_type, and event_date are required', 400);
        }
        if (empty($data['client_id'])) {
            sendError('client_id is required', 400);
        }

        try {
            $id = Event::create($data);
            InvitationPage::create($id, $data['invitation'] ?? []);
            sendResponse(['success' => true, 'data' => Event::find($id)], 201);
        } catch (PDOException $e) {
            $message = $e->getMessage();
            if (stripos($message, 'unique') !== false || stripos($message, 'duplicate') !== false) {
                sendError('An invitation with this URL slug already exists. Use a different event name.', 409);
            }
            if (stripos($message, 'foreign key') !== false) {
                sendError('Invalid client account. Please log out and log in again.', 400);
            }
            if (stripos($message, 'value too long') !== false) {
                sendError('One or more fields are too large. Use image URLs instead of uploaded files for now.', 400);
            }
            sendError('Failed to create event', 500);
        }
    }

    public function update(int $id, array $data): void
    {
        $event = Event::find($id);
        if (!$event) sendError('Event not found', 404);
        Event::update($id, $data);
        if (!empty($data['invitation'])) {
            $existing = InvitationPage::findByEventId($id);
            if ($existing) {
                InvitationPage::update($id, $data['invitation']);
            } else {
                InvitationPage::create($id, $data['invitation']);
            }
        }
        sendResponse(['success' => true, 'data' => Event::find($id)]);
    }

    public function publish(int $id): void
    {
        $event = Event::find($id);
        if (!$event) sendError('Event not found', 404);
        Event::publish($id);
        InvitationPage::markPublished($id);
        sendResponse(['success' => true, 'message' => 'Invitation published']);
    }

    public function destroy(int $id): void
    {
        Event::delete($id);
        sendResponse(['success' => true, 'message' => 'Event archived']);
    }
}
