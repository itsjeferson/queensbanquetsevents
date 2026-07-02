<?php
require_once __DIR__ . '/../config/database.php';

class Report
{
    public static function adminDashboard(): array
    {
        $pdo = getConnection();

        $totalInvitations = (int) $pdo->query("SELECT COUNT(*) FROM events WHERE status != 'archived'")->fetchColumn();
        $publishedInvitations = (int) $pdo->query("SELECT COUNT(*) FROM events WHERE status = 'published'")->fetchColumn();
        $publishedThisMonth = (int) $pdo->query(
            "SELECT COUNT(*) FROM events WHERE status = 'published' AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)"
        )->fetchColumn();
        $totalRsvps = (int) $pdo->query('SELECT COUNT(*) FROM rsvps')->fetchColumn();
        $attendingRsvps = (int) $pdo->query("SELECT COUNT(*) FROM rsvps WHERE attendance = 'yes'")->fetchColumn();
        $galleryAssets = (int) $pdo->query('SELECT COUNT(*) FROM gallery')->fetchColumn();

        $attendingPct = $totalRsvps > 0 ? round(($attendingRsvps / $totalRsvps) * 100) : 0;

        $recentInvitations = $pdo->query(
            "SELECT e.id, e.event_name, e.event_date, e.status, e.event_type,
                    CONCAT(u.first_name, ' ', u.last_name) AS client_name,
                    it.template_name
             FROM events e
             JOIN users u ON e.client_id = u.id
             LEFT JOIN invitation_pages ip ON ip.event_id = e.id
             LEFT JOIN invitation_templates it ON ip.template_id = it.id
             WHERE e.status != 'archived'
             ORDER BY e.created_at DESC
             LIMIT 10"
        )->fetchAll();

        $categoryRows = $pdo->query(
            "SELECT e.event_type, COUNT(r.id) AS rsvp_count
             FROM rsvps r
             JOIN events e ON r.event_id = e.id
             GROUP BY e.event_type
             ORDER BY rsvp_count DESC"
        )->fetchAll();

        $totalCategoryRsvps = array_sum(array_column($categoryRows, 'rsvp_count'));
        $rsvpByCategory = array_map(function ($row) use ($totalCategoryRsvps) {
            $count = (int) $row['rsvp_count'];
            return [
                'label' => ucfirst($row['event_type']),
                'value' => $count . ' RSVPs',
                'count' => $count,
                'percent' => $totalCategoryRsvps > 0 ? round(($count / $totalCategoryRsvps) * 100) : 0,
            ];
        }, $categoryRows);

        $generatedReports = $pdo->query(
            "SELECT e.id,
                    e.event_name AS invitation,
                    (SELECT COUNT(*) FROM guests g WHERE g.event_id = e.id) AS guests,
                    (SELECT COUNT(*) FROM rsvps r WHERE r.event_id = e.id AND r.attendance = 'yes') AS attending,
                    (SELECT COUNT(*) FROM rsvps r WHERE r.event_id = e.id AND r.attendance = 'no') AS declined,
                    COALESCE(ip.published_at, e.created_at) AS generated
             FROM events e
             LEFT JOIN invitation_pages ip ON ip.event_id = e.id
             WHERE e.status = 'published'
             ORDER BY COALESCE(ip.published_at, e.created_at) DESC
             LIMIT 10"
        )->fetchAll();

        return [
            'stats' => [
                [
                    'label' => 'Total Invitations',
                    'value' => (string) $totalInvitations,
                    'trend' => $totalInvitations > 0 ? 'All client events' : 'No invitations yet',
                ],
                [
                    'label' => 'Published Invitations',
                    'value' => (string) $publishedInvitations,
                    'trend' => $publishedThisMonth . ' published this month',
                    'trendClass' => $publishedThisMonth > 0 ? 'trend-up' : '',
                ],
                [
                    'label' => 'Total RSVPs',
                    'value' => (string) $totalRsvps,
                    'trend' => $attendingPct . '% attending',
                    'trendClass' => $attendingPct > 0 ? 'trend-up' : '',
                ],
                [
                    'label' => 'Gallery Assets',
                    'value' => (string) $galleryAssets,
                    'trend' => $galleryAssets > 0 ? 'Uploaded media files' : 'No gallery assets yet',
                ],
            ],
            'recentInvitations' => array_map(function ($row) {
                return [
                    'id' => $row['id'],
                    'client' => trim($row['client_name']),
                    'event' => $row['event_name'],
                    'date' => date('M j, Y', strtotime($row['event_date'])),
                    'template' => $row['template_name'] ?: '—',
                    'status' => ucfirst($row['status']),
                ];
            }, $recentInvitations),
            'rsvpByCategory' => $rsvpByCategory,
            'generatedReports' => array_map(function ($row) {
                return [
                    'id' => (int) $row['id'],
                    'invitation' => $row['invitation'],
                    'guests' => (int) $row['guests'],
                    'attending' => (int) $row['attending'],
                    'declined' => (int) $row['declined'],
                    'generated' => date('M j, Y', strtotime($row['generated'])),
                ];
            }, $generatedReports),
        ];
    }

    public static function clientDashboard(int $clientId): array
    {
        $pdo = getConnection();

        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM events WHERE client_id = ? AND status != 'archived'");
        $countStmt->execute([$clientId]);
        $totalInvitations = (int) $countStmt->fetchColumn();

        $publishedStmt = $pdo->prepare("SELECT COUNT(*) FROM events WHERE client_id = ? AND status = 'published'");
        $publishedStmt->execute([$clientId]);
        $publishedInvitations = (int) $publishedStmt->fetchColumn();

        $rsvpStmt = $pdo->prepare(
            'SELECT COUNT(*) FROM rsvps r JOIN events e ON r.event_id = e.id WHERE e.client_id = ?'
        );
        $rsvpStmt->execute([$clientId]);
        $totalRsvps = (int) $rsvpStmt->fetchColumn();

        $attendingStmt = $pdo->prepare(
            "SELECT COUNT(*) FROM rsvps r JOIN events e ON r.event_id = e.id WHERE e.client_id = ? AND r.attendance = 'yes'"
        );
        $attendingStmt->execute([$clientId]);
        $attendingRsvps = (int) $attendingStmt->fetchColumn();

        $guestStmt = $pdo->prepare(
            'SELECT COUNT(*) FROM guests g JOIN events e ON g.event_id = e.id WHERE e.client_id = ?'
        );
        $guestStmt->execute([$clientId]);
        $guestRecords = (int) $guestStmt->fetchColumn();

        $sharedStmt = $pdo->prepare(
            "SELECT COUNT(*) FROM events WHERE client_id = ? AND status = 'published' AND slug IS NOT NULL AND slug != ''"
        );
        $sharedStmt->execute([$clientId]);
        $sharedLinks = (int) $sharedStmt->fetchColumn();

        $listStmt = $pdo->prepare(
            "SELECT e.id, e.event_name, e.event_date, e.status, e.slug, it.template_name
             FROM events e
             LEFT JOIN invitation_pages ip ON ip.event_id = e.id
             LEFT JOIN invitation_templates it ON ip.template_id = it.id
             WHERE e.client_id = ? AND e.status != 'archived'
             ORDER BY e.event_date DESC"
        );
        $listStmt->execute([$clientId]);
        $invitations = $listStmt->fetchAll();

        $attendingPct = $totalRsvps > 0 ? round(($attendingRsvps / $totalRsvps) * 100) : 0;

        return [
            'stats' => [
                [
                    'label' => 'My Invitations',
                    'value' => (string) $totalInvitations,
                    'trend' => $publishedInvitations . ' published',
                ],
                [
                    'label' => 'RSVP Responses',
                    'value' => (string) $totalRsvps,
                    'trend' => $attendingRsvps . ' attending',
                    'trendClass' => $attendingRsvps > 0 ? 'trend-up' : '',
                ],
                [
                    'label' => 'Guest Records',
                    'value' => (string) $guestRecords,
                    'trend' => $guestRecords > 0 ? 'Saved guest contacts' : 'No guests yet',
                ],
                [
                    'label' => 'Shared Links',
                    'value' => (string) $sharedLinks,
                    'trend' => $sharedLinks > 0 ? 'QR and public URL active' : 'Publish to share',
                ],
            ],
            'invitations' => array_map(function ($row) {
                return [
                    'id' => (int) $row['id'],
                    'event' => $row['event_name'],
                    'date' => date('M j, Y', strtotime($row['event_date'])),
                    'template' => $row['template_name'] ?: '—',
                    'status' => ucfirst($row['status']),
                    'slug' => $row['slug'],
                ];
            }, $invitations),
            'previewSlug' => self::latestPreviewSlug($invitations),
        ];
    }

    private static function latestPreviewSlug(array $invitations): ?string
    {
        foreach ($invitations as $row) {
            if (!empty($row['slug'])) {
                return $row['slug'];
            }
        }
        return null;
    }

    public static function calendar(int $year, int $month): array
    {
        $pdo = getConnection();
        $start = sprintf('%04d-%02d-01', $year, $month);

        // Only published invitations represent a confirmed event date —
        // drafts haven't been confirmed by the client yet, so they should
        // not occupy a slot on the calendar.
        $stmt = $pdo->prepare(
            "SELECT e.id, e.event_name, e.event_type, e.event_date, e.status,
                    CONCAT(u.first_name, ' ', u.last_name) AS client_name,
                    it.template_name,
                    (SELECT COUNT(*) FROM guests g WHERE g.event_id = e.id) AS guest_count
             FROM events e
             JOIN users u ON e.client_id = u.id
             LEFT JOIN invitation_pages ip ON ip.event_id = e.id
             LEFT JOIN invitation_templates it ON ip.template_id = it.id
             WHERE e.status = 'published'
               AND EXTRACT(YEAR FROM e.event_date) = ?
               AND EXTRACT(MONTH FROM e.event_date) = ?
             ORDER BY e.event_date ASC"
        );
        $stmt->execute([$year, $month]);
        $events = $stmt->fetchAll();

        $bookedDays = [];
        foreach ($events as $event) {
            $bookedDays[] = (int) date('j', strtotime($event['event_date']));
        }
        $bookedDays = array_values(array_unique($bookedDays));

        $colors = [
            'wedding' => '#B47B36',
            'debut' => '#DC3545',
            'birthday' => '#0050A0',
            'anniversary' => '#6f42c1',
            'corporate' => '#198754',
        ];

        $upcoming = array_map(function ($row) use ($colors) {
            $date = new DateTime($row['event_date']);
            $clientName = trim($row['client_name']);
            $firstName = explode(' ', $clientName)[0] ?: $clientName;

            return [
                'id' => (int) $row['id'],
                'title' => ucfirst($row['event_type']) . ' — ' . $firstName,
                'details' => $date->format('M j') . ' • ' . ($row['template_name'] ?: 'Custom') . ' • ' . (int) $row['guest_count'] . ' guests',
                'coordinator' => $clientName,
                'color' => $colors[$row['event_type']] ?? '#B47B36',
                'event_name' => $row['event_name'],
            ];
        }, $events);

        $firstDay = (int) date('w', strtotime($start));
        $daysInMonth = (int) date('t', strtotime($start));
        $todayDay = (int) date('j');
        $todayMonth = (int) date('n');
        $todayYear = (int) date('Y');

        $days = array_fill(0, $firstDay, ['empty' => true]);
        for ($day = 1; $day <= $daysInMonth; $day++) {
            $days[] = [
                'num' => $day,
                'booked' => in_array($day, $bookedDays, true),
                'today' => $day === $todayDay && $month === $todayMonth && $year === $todayYear,
            ];
        }

        return [
            'monthLabel' => date('F Y', strtotime($start)),
            'year' => $year,
            'month' => $month,
            'days' => $days,
            'events' => $upcoming,
        ];
    }
}
