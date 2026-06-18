-- Queen's Banquet Digital Invitation Management System (PostgreSQL)
-- Run against your PostgreSQL database (Render, local, etc.)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'super_admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    max_guests INT DEFAULT 50,
    inclusions JSONB,
    featured BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    event_type VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    guest_count INT DEFAULT 0,
    package_id INT REFERENCES packages(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id),
    amount DECIMAL(12,2) NOT NULL,
    receipt_path VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gallery (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    caption VARCHAR(255),
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id),
    sender_id INT NOT NULL REFERENCES users(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO packages (name, description, price, max_guests, inclusions, featured) VALUES
('Essential', 'Perfect for intimate gatherings', 45000, 50, '["Event coordination (8 hrs)","Basic table & chair setup","Floral centerpieces (5 tables)","Sound system & basic lighting","4-hour catering service","Photo coverage (4 hrs)"]', FALSE),
('Signature', 'Our most popular choice', 95000, 150, '["Full-day coordination (12 hrs)","Premium venue styling & décor","Elaborate floral arrangements","Premium sound, lighting & LED walls","8-hour catering with open bar","Photo + video (8 hrs)","Host / Emcee service","Cake from partner baker"]', TRUE),
('Grand', 'The ultimate luxury experience', 185000, 300, '["Dedicated 2-day event team","Luxury venue transformation","Couture floral installations","Pro audio-visual production","Full-day dining & premium bar","Cinematic photo + film team","Live band or celebrity host","Luxury transport (2 vehicles)","Concierge guest services"]', FALSE);

INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES
('Marou', 'Madrid', 'queensbanquet@gmail.com', '+63 917 100 0001', '$2y$10$Q7LC1mgFKLDXHPIzou2/l.sS63IcgTHWAh209ikq35naiyWBgkgUq', 'super_admin'),
('Sophia', 'Reyes', 'client@queensbanquetevents.ph', '+63 917 200 0002', '$2y$10$6BhzY8BfrLfxu2IAuQATq.Yo2/on1CVttopH4rXeoTiuhwnvwPSg2', 'client');

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES users(id),
    booking_id INT REFERENCES bookings(id) ON DELETE SET NULL,
    event_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('wedding', 'debut', 'birthday', 'anniversary', 'corporate')),
    event_date TIMESTAMP NOT NULL,
    slug VARCHAR(100) UNIQUE,
    invite_code VARCHAR(10) UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invitation_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('wedding', 'debut', 'birthday', 'anniversary', 'corporate')),
    preview_image VARCHAR(255),
    theme_config JSONB,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invitation_pages (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
    theme_id INT,
    template_id INT REFERENCES invitation_templates(id) ON DELETE SET NULL,
    cover_image VARCHAR(255),
    background_music VARCHAR(255),
    primary_color VARCHAR(20) DEFAULT '#D4AF37',
    font_family VARCHAR(50) DEFAULT 'Playfair Display',
    story JSONB,
    entourage JSONB,
    venue JSONB,
    dress_code VARCHAR(100),
    program JSONB,
    gallery JSONB,
    videos JSONB,
    gift_registry JSONB,
    qr_enabled BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP
);

CREATE TABLE guests (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    plus_one BOOLEAN DEFAULT FALSE,
    invite_token VARCHAR(64) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rsvps (
    id SERIAL PRIMARY KEY,
    guest_id INT REFERENCES guests(id) ON DELETE SET NULL,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    attendance VARCHAR(10) NOT NULL DEFAULT 'yes' CHECK (attendance IN ('yes', 'no', 'maybe')),
    meal_preference VARCHAR(100),
    guest_count INT DEFAULT 1,
    message TEXT,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guest_messages (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_name VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO invitation_templates (template_name, category, preview_image, theme_config, status) VALUES
('Classic Gold', 'wedding', '/images/templates/wedding-classic.jpg', '{"primary":"#D4AF37","accent":"#1A1A1A","font":"Playfair Display"}', 'active'),
('Modern Minimalist', 'wedding', '/images/templates/wedding-modern.jpg', '{"primary":"#2C2C2C","accent":"#FFFFFF","font":"Poppins"}', 'active'),
('Royal Luxury', 'wedding', '/images/templates/wedding-royal.jpg', '{"primary":"#8B6914","accent":"#1A0A00","font":"Playfair Display"}', 'active'),
('Floral Elegance', 'wedding', '/images/templates/wedding-floral.jpg', '{"primary":"#C9A0A0","accent":"#4A3728","font":"Playfair Display"}', 'active'),
('Pink Rose', 'debut', '/images/templates/debut-pink.jpg', '{"primary":"#E8A0BF","accent":"#FFF5F8","font":"Playfair Display"}', 'active'),
('Elegant Black', 'debut', '/images/templates/debut-black.jpg', '{"primary":"#1A1A1A","accent":"#D4AF37","font":"Playfair Display"}', 'active'),
('Fairytale Theme', 'debut', '/images/templates/debut-fairytale.jpg', '{"primary":"#9B59B6","accent":"#F3E5F5","font":"Playfair Display"}', 'active'),
('Kids Theme', 'birthday', '/images/templates/birthday-kids.jpg', '{"primary":"#FF6B6B","accent":"#4ECDC4","font":"Poppins"}', 'active'),
('Luxury Theme', 'birthday', '/images/templates/birthday-luxury.jpg', '{"primary":"#D4AF37","accent":"#1A1A1A","font":"Playfair Display"}', 'active'),
('Minimal Theme', 'birthday', '/images/templates/birthday-minimal.jpg', '{"primary":"#333333","accent":"#F5F1E8","font":"Poppins"}', 'active');
