<?php
require_once __DIR__ . '/../models/NotificationFeed.php';
require_once __DIR__ . '/../helpers/response.php';

class NotificationController
{
    public function byClient(int $clientId): void
    {
        sendResponse([
            'success' => true,
            'data' => [
                'notifications' => NotificationFeed::byClient($clientId),
            ],
        ]);
    }
}
