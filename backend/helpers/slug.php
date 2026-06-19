<?php
function generateSlug(string $text): string
{
    $parts = preg_split('/[^a-zA-Z0-9]+/', trim($text), -1, PREG_SPLIT_NO_EMPTY);
    if (!$parts) {
        return '';
    }

    $parts = array_map(
        fn(string $part): string => ucfirst(strtolower($part)),
        $parts
    );

    return implode('-', $parts);
}

function generateInviteCode(): string
{
    return strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));
}

function generateToken(): string
{
    return bin2hex(random_bytes(16));
}
