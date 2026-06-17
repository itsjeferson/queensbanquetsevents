<?php
require_once __DIR__ . '/../models/Event.php';
require_once __DIR__ . '/../models/InvitationPage.php';
require_once __DIR__ . '/../models/GuestMessage.php';
require_once __DIR__ . '/../helpers/response.php';

class InvitationController
{
    public function bySlug(string $slug): void
    {
        $event = Event::findBySlug($slug);
        if (!$event) sendError('Invitation not found', 404);
        $this->sendPublicInvitation($event);
    }

    public function preview(string $slug): void
    {
        $event = Event::findBySlugAny($slug);
        if (!$event) sendError('Invitation not found', 404);
        $this->sendPublicInvitation($event);
    }

    public function byCode(string $code): void
    {
        $event = Event::findByCode($code);
        if (!$event) sendError('Invitation not found', 404);
        $this->sendPublicInvitation($event);
    }

    private function sendPublicInvitation(array $event): void
    {
        $page = InvitationPage::findByEventId((int) $event['id']);
        sendResponse([
            'success' => true,
            'data' => [
                'event' => $event,
                'invitation' => $page,
                'guest_messages' => GuestMessage::byEvent((int) $event['id']),
            ],
        ]);
    }
}
