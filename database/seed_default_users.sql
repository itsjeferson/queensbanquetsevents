-- Run in PostgreSQL if you need to reset default accounts.
-- Passwords: Super Admin = QueensAdmin2026! | Client = ClientDemo2026!

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
ON CONFLICT (email) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  status = 'active';
