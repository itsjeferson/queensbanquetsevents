<?php
require_once __DIR__ . '/../models/Report.php';
require_once __DIR__ . '/../helpers/response.php';

class ReportController
{
    public function dashboard(): void
    {
        $clientId = isset($_GET['client_id']) ? (int) $_GET['client_id'] : null;

        if ($clientId) {
            sendResponse(['success' => true, 'data' => Report::clientDashboard($clientId)]);
            return;
        }

        sendResponse(['success' => true, 'data' => Report::adminDashboard()]);
    }

    public function calendar(): void
    {
        $year = isset($_GET['year']) ? (int) $_GET['year'] : (int) date('Y');
        $month = isset($_GET['month']) ? (int) $_GET['month'] : (int) date('n');

        if ($month < 1 || $month > 12) {
            sendError('Invalid month', 422);
        }

        sendResponse(['success' => true, 'data' => Report::calendar($year, $month)]);
    }

    public function summary(): void
    {
        $dashboard = Report::adminDashboard();
        sendResponse([
            'success' => true,
            'data' => [
                'total_events' => (int) ($dashboard['stats'][0]['value'] ?? 0),
                'published_events' => (int) ($dashboard['stats'][1]['value'] ?? 0),
                'total_rsvps' => (int) ($dashboard['stats'][2]['value'] ?? 0),
                'gallery_assets' => (int) ($dashboard['stats'][3]['value'] ?? 0),
                'rsvp_by_category' => $dashboard['rsvpByCategory'],
                'generated_reports' => $dashboard['generatedReports'],
            ],
        ]);
    }
}
