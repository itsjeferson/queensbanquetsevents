<?php
function generateSlug(string $text): string
{
    $slug = strtolower(trim($text));
    $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
    $slug = preg_replace('/[\s-]+/', '-', $slug);
    return trim($slug, '-');
}

function generateInviteCode(): string
{
    return strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
}

function generateToken(): string
{
    return bin2hex(random_bytes(16));
}
