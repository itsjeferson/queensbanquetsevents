<?php
require_once __DIR__ . '/../helpers/response.php';

class ReportController
{
    public function summary(): void
    {
        sendResponse([
            'success' => true,
            'data' => [
                'ytd_revenue' => 8400000,
                'total_events' => 89,
                'avg_package_value' => 94000,
                'client_retention' => 68,
                'revenue_by_package' => [
                    ['name' => 'Grand', 'amount' => 3700000, 'percent' => 44],
                    ['name' => 'Signature', 'amount' => 2850000, 'percent' => 34],
                    ['name' => 'Essential', 'amount' => 1850000, 'percent' => 22],
                ],
            ],
        ]);
    }
}
