-- Queen's Banquet Digital Invitation Management System Extension
-- Run after queens_banquet.sql

USE queens_banquet;

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    booking_id INT,
    event_name VARCHAR(255) NOT NULL,
    event_type ENUM('wedding', 'debut', 'birthday', 'anniversary', 'corporate') NOT NULL,
    event_date DATETIME NOT NULL,
    slug VARCHAR(100) UNIQUE,
    invite_code VARCHAR(10) UNIQUE,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS invitation_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    category ENUM('wedding', 'debut', 'birthday', 'anniversary', 'corporate') NOT NULL,
    preview_image VARCHAR(255),
    theme_config JSON,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invitation_pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL UNIQUE,
    theme_id INT,
    template_id INT,
    cover_image VARCHAR(255),
    background_music VARCHAR(255),
    primary_color VARCHAR(20) DEFAULT '#D4AF37',
    font_family VARCHAR(50) DEFAULT 'Playfair Display',
    story JSON,
    entourage JSON,
    venue JSON,
    dress_code VARCHAR(100),
    program JSON,
    gallery JSON,
    videos JSON,
    gift_registry JSON,
    qr_enabled TINYINT(1) DEFAULT 1,
    published_at TIMESTAMP NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES invitation_templates(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS guests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    plus_one TINYINT(1) DEFAULT 0,
    invite_token VARCHAR(64) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rsvps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guest_id INT,
    event_id INT NOT NULL,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    attendance ENUM('yes', 'no', 'maybe') DEFAULT 'yes',
    meal_preference VARCHAR(100),
    guest_count INT DEFAULT 1,
    message TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE SET NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS guest_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    guest_name VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Seed invitation templates
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
