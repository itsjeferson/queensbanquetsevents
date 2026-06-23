<?php
require_once __DIR__ . '/../config/database.php';

class InvitationPage
{
    public static function findByEventId(int $eventId): ?array
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('SELECT ip.*, it.template_name, it.category, it.theme_config FROM invitation_pages ip LEFT JOIN invitation_templates it ON ip.template_id = it.id WHERE ip.event_id = ?');
        $stmt->execute([$eventId]);
        $row = $stmt->fetch();
        return $row ? self::formatForApi(self::decodeJsonFields($row)) : null;
    }

    public static function create(int $eventId, array $data = []): int
    {
        $pdo = getConnection();
        $normalized = self::normalizeInput($data);
        $stmt = $pdo->prepare('INSERT INTO invitation_pages (event_id, template_id, cover_image, background_music, primary_color, font_family, story, entourage, venue, dress_code, program, gallery, videos, gift_registry) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $eventId,
            $normalized['template_id'],
            $normalized['cover_image'],
            $normalized['background_music'],
            $normalized['primary_color'],
            $normalized['font_family'],
            json_encode($normalized['story']),
            json_encode($normalized['entourage']),
            json_encode($normalized['venue']),
            $normalized['dress_code'],
            json_encode($normalized['program']),
            json_encode($normalized['gallery']),
            json_encode($normalized['videos']),
            json_encode($normalized['gift_registry']),
        ]);
        return dbLastInsertId($pdo, 'invitation_pages');
    }

    public static function update(int $eventId, array $data): void
    {
        $pdo = getConnection();
        $existing = self::findByEventId($eventId);
        $normalized = self::normalizeInput($data);
        $normalized = self::preserveMediaFields($normalized, $existing);
        $stmt = $pdo->prepare('UPDATE invitation_pages SET template_id = ?, cover_image = ?, background_music = ?, primary_color = ?, font_family = ?, story = ?, entourage = ?, venue = ?, dress_code = ?, program = ?, gallery = ?, videos = ?, gift_registry = ?, qr_enabled = ? WHERE event_id = ?');
        $stmt->execute([
            $normalized['template_id'],
            $normalized['cover_image'],
            $normalized['background_music'],
            $normalized['primary_color'],
            $normalized['font_family'],
            json_encode($normalized['story']),
            json_encode($normalized['entourage']),
            json_encode($normalized['venue']),
            $normalized['dress_code'],
            json_encode($normalized['program']),
            json_encode($normalized['gallery']),
            json_encode($normalized['videos']),
            json_encode($normalized['gift_registry']),
            $normalized['qr_enabled'],
            $eventId,
        ]);
    }

    public static function markPublished(int $eventId): void
    {
        $pdo = getConnection();
        $stmt = $pdo->prepare('UPDATE invitation_pages SET published_at = NOW() WHERE event_id = ?');
        $stmt->execute([$eventId]);
    }

    public static function formatForApi(array $row): array
    {
        $story = is_array($row['story'] ?? null) ? $row['story'] : [];

        return [
            'template_id' => $row['template_id'] ?? null,
            'template_name' => $row['template_name'] ?? null,
            'category' => $row['category'] ?? null,
            'cover_image' => $row['cover_image'] ?? '',
            'music_url' => $row['background_music'] ?? '',
            'background_video' => $story['background_video'] ?? '',
            'primary_color' => $row['primary_color'] ?? ($story['primary_color'] ?? '#D4AF37'),
            'secondary_color' => $story['secondary_color'] ?? '#F4EEE7',
            'font_family' => $row['font_family'] ?? 'Playfair Display',
            'opening_line' => $story['opening_line'] ?? '',
            'hero_caption' => $story['hero_caption'] ?? '',
            'quote' => $story['quote'] ?? '',
            'quote_source' => $story['quote_source'] ?? '',
            'rsvp_note' => $story['rsvp_note'] ?? '',
            'coordinator' => $story['coordinator'] ?? '',
            'coordinator_phone' => $story['coordinator_phone'] ?? '',
            'story' => [
                'title' => $story['title'] ?? '',
                'image' => $story['image'] ?? '',
                'sections' => $story['sections'] ?? [],
                'invitation_message' => $story['invitation_message'] ?? '',
                'acceptance_message' => $story['acceptance_message'] ?? '',
            ],
            'venue' => $row['venue'] ?? [],
            'dress_code' => $row['dress_code'] ?? '',
            'program' => $row['program'] ?? [],
            'gallery' => $row['gallery'] ?? [],
            'videos' => $row['videos'] ?? [],
            'gift_registry' => $row['gift_registry'] ?? [],
            'attire' => $story['attire'] ?? [],
            'faqs' => $story['faqs'] ?? [],
            'opening_hero_image' => $story['opening_hero_image'] ?? '',
            'couple_initials' => $story['couple_initials'] ?? '',
            'couple_display_name' => $story['couple_display_name'] ?? '',
            'secondary_quote' => $story['secondary_quote'] ?? '',
            'story_image' => $story['image'] ?? '',
            'invitation_message' => $story['invitation_message'] ?? '',
            'acceptance_message' => $story['acceptance_message'] ?? '',
            'groom_profile' => $story['groom_profile'] ?? [],
            'bride_profile' => $story['bride_profile'] ?? [],
            'entourage' => $row['entourage'] ?? [],
            'qr_enabled' => (int) ($row['qr_enabled'] ?? 1),
            'color_motif' => $story['color_motif'] ?? 'classic-gold',
            'background_color' => $story['background_color'] ?? '#FFFAF5',
            'palette_colors' => is_array($story['palette_colors'] ?? null) ? $story['palette_colors'] : [],
            'save_the_date_enabled' => (bool) ($story['save_the_date_enabled'] ?? false),
            'std_message' => $story['std_message'] ?? '',
            'std_cover_image' => $story['std_cover_image'] ?? '',
            'std_photo' => $story['std_photo'] ?? ($story['std_cover_image'] ?? ''),
            'std_location' => $story['std_location'] ?? '',
            'content_reveal_mode' => ($story['content_reveal_mode'] ?? 'full') === 'gradual' ? 'gradual' : 'full',
            'content_reveal_order' => is_array($story['content_reveal_order'] ?? null) ? $story['content_reveal_order'] : [],
            'published_at' => $row['published_at'] ?? null,
        ];
    }

    public static function normalizeInput(array $data): array
    {
        $story = $data['story'] ?? [];
        if (!is_array($story)) {
            $story = [];
        }

        $story['title'] = $story['title'] ?? '';
        $story['sections'] = $story['sections'] ?? [];
        $story['opening_line'] = $data['opening_line'] ?? ($story['opening_line'] ?? '');
        $story['hero_caption'] = $data['hero_caption'] ?? ($story['hero_caption'] ?? '');
        $story['quote'] = $data['quote'] ?? ($story['quote'] ?? '');
        $story['quote_source'] = $data['quote_source'] ?? ($story['quote_source'] ?? '');
        $story['rsvp_note'] = $data['rsvp_note'] ?? ($story['rsvp_note'] ?? '');
        $story['coordinator'] = $data['coordinator'] ?? ($story['coordinator'] ?? '');
        $story['coordinator_phone'] = $data['coordinator_phone'] ?? ($story['coordinator_phone'] ?? '');
        $story['background_video'] = $data['background_video'] ?? ($story['background_video'] ?? '');
        $story['secondary_color'] = $data['secondary_color'] ?? ($story['secondary_color'] ?? '#F4EEE7');
        $story['background_color'] = $data['background_color'] ?? ($story['background_color'] ?? '#FFFAF5');
        $story['color_motif'] = $data['color_motif'] ?? ($story['color_motif'] ?? 'classic-gold');
        if (isset($data['palette_colors']) && is_array($data['palette_colors'])) {
            $story['palette_colors'] = array_values(array_slice($data['palette_colors'], 0, 6));
        }
        if (!empty($data['primary_color'])) {
            $story['primary_color'] = $data['primary_color'];
        }
        $story['attire'] = $data['attire'] ?? ($story['attire'] ?? []);
        $story['faqs'] = $data['faqs'] ?? ($story['faqs'] ?? []);
        $story['opening_hero_image'] = $data['opening_hero_image'] ?? ($story['opening_hero_image'] ?? '');
        $story['couple_initials'] = $data['couple_initials'] ?? ($story['couple_initials'] ?? '');
        $story['couple_display_name'] = $data['couple_display_name'] ?? ($story['couple_display_name'] ?? '');
        $story['secondary_quote'] = $data['secondary_quote'] ?? ($story['secondary_quote'] ?? '');
        $story['image'] = $data['story_image'] ?? ($story['image'] ?? '');
        $story['invitation_message'] = $story['invitation_message'] ?? ($data['invitation_message'] ?? '');
        $story['acceptance_message'] = $story['acceptance_message'] ?? ($data['acceptance_message'] ?? '');
        $story['groom_profile'] = $data['groom_profile'] ?? ($story['groom_profile'] ?? []);
        $story['bride_profile'] = $data['bride_profile'] ?? ($story['bride_profile'] ?? []);
        $story['save_the_date_enabled'] = (bool) ($data['save_the_date_enabled'] ?? ($story['save_the_date_enabled'] ?? false));
        $story['std_message'] = $data['std_message'] ?? ($story['std_message'] ?? '');
        $story['std_cover_image'] = $data['std_cover_image'] ?? ($story['std_cover_image'] ?? '');
        $story['std_photo'] = $data['std_photo'] ?? ($data['std_cover_image'] ?? ($story['std_photo'] ?? ($story['std_cover_image'] ?? '')));
        $story['std_location'] = $data['std_location'] ?? ($story['std_location'] ?? '');
        $story['content_reveal_mode'] = ($data['content_reveal_mode'] ?? ($story['content_reveal_mode'] ?? 'full')) === 'gradual'
            ? 'gradual'
            : 'full';
        if (isset($data['content_reveal_order']) && is_array($data['content_reveal_order'])) {
            $story['content_reveal_order'] = array_values(array_slice($data['content_reveal_order'], 0, 20));
        }

        return [
            'template_id' => $data['template_id'] ?? null,
            'cover_image' => $data['cover_image'] ?? null,
            'background_music' => $data['music_url'] ?? ($data['background_music'] ?? null),
            'primary_color' => $data['primary_color'] ?? '#D4AF37',
            'font_family' => $data['font_family'] ?? 'Playfair Display',
            'story' => $story,
            'entourage' => $data['entourage'] ?? [],
            'venue' => $data['venue'] ?? [],
            'dress_code' => $data['dress_code'] ?? '',
            'program' => $data['program'] ?? [],
            'gallery' => $data['gallery'] ?? [],
            'videos' => $data['videos'] ?? [],
            'gift_registry' => $data['gift_registry'] ?? [],
            'qr_enabled' => $data['qr_enabled'] ?? 1,
        ];
    }

    private static function preserveMediaFields(array $normalized, ?array $existing): array
    {
        if (!$existing) {
            return $normalized;
        }

        if (empty($normalized['cover_image']) && !empty($existing['cover_image'])) {
            $normalized['cover_image'] = $existing['cover_image'];
        }

        if (empty($normalized['background_music']) && !empty($existing['music_url'])) {
            $normalized['background_music'] = $existing['music_url'];
        }

        $incomingGallery = is_array($normalized['gallery'] ?? null) ? $normalized['gallery'] : [];
        $hasIncomingImages = (bool) array_filter(
            $incomingGallery,
            fn($item) => is_array($item) && !empty($item['image'])
        );

        if (!$hasIncomingImages && !empty($existing['gallery']) && is_array($existing['gallery'])) {
            $normalized['gallery'] = $existing['gallery'];
        }

        $story = is_array($normalized['story'] ?? null) ? $normalized['story'] : [];
        if (empty($story['background_video']) && !empty($existing['background_video'])) {
            $story['background_video'] = $existing['background_video'];
            $normalized['story'] = $story;
        }

        if (empty($story['std_photo']) && !empty($existing['std_photo'])) {
            $story['std_photo'] = $existing['std_photo'];
            $normalized['story'] = $story;
        } elseif (empty($story['std_photo']) && !empty($existing['std_cover_image'])) {
            $story['std_photo'] = $existing['std_cover_image'];
            $normalized['story'] = $story;
        }

        if (empty($story['std_location']) && !empty($existing['std_location'])) {
            $story['std_location'] = $existing['std_location'];
            $normalized['story'] = $story;
        }

        if (empty($story['std_message']) && !empty($existing['std_message'])) {
            $story['std_message'] = $existing['std_message'];
            $normalized['story'] = $story;
        }

        $existingStory = is_array($existing['story'] ?? null) ? $existing['story'] : [];
        $existingPalette = $existing['palette_colors'] ?? ($existingStory['palette_colors'] ?? null);
        if (empty($story['palette_colors']) && !empty($existingPalette) && is_array($existingPalette)) {
            $story['palette_colors'] = $existingPalette;
            $normalized['story'] = $story;
        }

        $venue = is_array($normalized['venue'] ?? null) ? $normalized['venue'] : [];
        $existingVenue = is_array($existing['venue'] ?? null) ? $existing['venue'] : [];
        foreach (['ceremony', 'reception'] as $type) {
            $incoming = is_array($venue[$type] ?? null) ? $venue[$type] : [];
            $saved = is_array($existingVenue[$type] ?? null) ? $existingVenue[$type] : [];
            if (empty($incoming['image']) && !empty($saved['image'])) {
                $venue[$type] = array_merge($saved, $incoming);
                $venue[$type]['image'] = $saved['image'];
            } else {
                $venue[$type] = $incoming;
            }
        }
        $normalized['venue'] = $venue;

        return $normalized;
    }

    private static function decodeJsonFields(array $row): array
    {
        foreach (['story', 'entourage', 'venue', 'program', 'gallery', 'videos', 'gift_registry', 'theme_config'] as $field) {
            if (isset($row[$field]) && is_string($row[$field])) {
                $row[$field] = json_decode($row[$field], true) ?? [];
            }
        }
        return $row;
    }
}
