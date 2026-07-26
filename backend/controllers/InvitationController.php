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

    public function verifyPassword(array $data): void
    {
        $slug = $data['slug'] ?? '';
        $password = $data['password'] ?? '';

        if (!$slug || !$password) {
            sendError('Slug and password are required', 400);
        }

        $event = Event::findBySlugAny($slug);
        if (!$event) {
            sendError('Invitation not found', 404);
        }

        $storedHash = InvitationPage::getPasswordHash((int) $event['id']);

        if (!$storedHash) {
            sendError('Password protection is not enabled for this invitation', 400);
        }

        if (password_verify($password, $storedHash)) {
            sendResponse(['success' => true, 'message' => 'Password verified']);
        } else {
            sendResponse(['success' => false, 'message' => 'Incorrect password']);
        }
    }

    private function sendPublicInvitation(array $event): void
    {
        $page = InvitationPage::findByEventId((int) $event['id']);
        // Ensure invitation is always an object (never null) so frontend always
        // receives password_protected and other fields from formatForApi.
        if (!$page) {
            $page = InvitationPage::emptyDefault();
        }
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
