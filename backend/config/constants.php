<?php
define('APP_NAME', "Queen's Banquet Digital Invitation Management System");
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'change-this-secret-key');
define('UPLOAD_MAX_SIZE', 10 * 1024 * 1024);
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('SUPABASE_URL', rtrim(getenv('SUPABASE_URL') ?: '', '/'));
define('SUPABASE_SERVICE_ROLE_KEY', getenv('SUPABASE_SERVICE_ROLE_KEY') ?: '');
