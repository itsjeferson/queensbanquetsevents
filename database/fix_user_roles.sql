-- Fix default account roles and passwords (PostgreSQL)
-- Run after queens_banquet.sql if admin login goes to client dashboard.
--
-- Super Admin: queensbanquet@gmail.com / QueensAdmin2026!
-- Client:      client@queensbanquetevents.ph / ClientDemo2026!

UPDATE users SET
  first_name = 'Marou',
  last_name = 'Madrid',
  phone = '+63 917 100 0001',
  password = '$2y$10$Q7LC1mgFKLDXHPIzou2/l.sS63IcgTHWAh209ikq35naiyWBgkgUq',
  role = 'super_admin',
  status = 'active'
WHERE email = 'queensbanquet@gmail.com';

UPDATE users SET
  first_name = 'Sophia',
  last_name = 'Reyes',
  phone = '+63 917 200 0002',
  password = '$2y$10$6BhzY8BfrLfxu2IAuQATq.Yo2/on1CVttopH4rXeoTiuhwnvwPSg2',
  role = 'client',
  status = 'active'
WHERE email = 'client@queensbanquetevents.ph';

INSERT INTO users (first_name, last_name, email, phone, password, role, status)
VALUES
  ('Marou', 'Madrid', 'queensbanquet@gmail.com', '+63 917 100 0001', '$2y$10$Q7LC1mgFKLDXHPIzou2/l.sS63IcgTHWAh209ikq35naiyWBgkgUq', 'super_admin', 'active'),
  ('Sophia', 'Reyes', 'client@queensbanquetevents.ph', '+63 917 200 0002', '$2y$10$6BhzY8BfrLfxu2IAuQATq.Yo2/on1CVttopH4rXeoTiuhwnvwPSg2', 'client', 'active')
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  status = EXCLUDED.status;

SELECT id, email, role, status FROM users ORDER BY id;
