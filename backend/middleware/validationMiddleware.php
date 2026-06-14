<?php
require_once __DIR__ . '/../helpers/validator.php';
require_once __DIR__ . '/../helpers/response.php';

function validateRequest(array $data, array $rules): void
{
    $error = validateRequired($data, $rules);
    if ($error) sendError($error, 422);
}
