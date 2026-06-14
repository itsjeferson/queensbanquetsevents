<?php
function validateRequired(array $data, array $fields): ?string
{
    foreach ($fields as $field) {
        if (empty($data[$field])) {
            return "Field '$field' is required";
        }
    }
    return null;
}

function validateEmail(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}
