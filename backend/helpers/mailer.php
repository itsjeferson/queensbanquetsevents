<?php
function sendMail(string $to, string $subject, string $body): bool
{
    $headers = "From: hello@queensbanquetevents.ph\r\nContent-Type: text/html; charset=UTF-8";
    return mail($to, $subject, $body, $headers);
}
