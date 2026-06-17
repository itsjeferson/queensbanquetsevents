-- Run this in phpMyAdmin if you already created the database from an older schema.
-- Passwords: Super Admin = QueensAdmin2026! | Client = ClientDemo2026!

USE queens_banquet;

ALTER TABLE users MODIFY role ENUM('client', 'admin', 'super_admin') DEFAULT 'client';

INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES
(
  'Marou',
  'Madrid',
  'queensbanquet@gmail.com',
  '+63 917 100 0001',
  '$2y$10$Q7LC1mgFKLDXHPIzou2/l.sS63IcgTHWAh209ikq35naiyWBgkgUq',
  'super_admin'
),
(
  'Sophia',
  'Reyes',
  'client@queensbanquetevents.ph',
  '+63 917 200 0002',
  '$2y$10$6BhzY8BfrLfxu2IAuQATq.Yo2/on1CVttopH4rXeoTiuhwnvwPSg2',
  'client'
)
ON DUPLICATE KEY UPDATE
  first_name = VALUES(first_name),
  last_name = VALUES(last_name),
  phone = VALUES(phone),
  password = VALUES(password),
  role = VALUES(role),
  status = 'active';
