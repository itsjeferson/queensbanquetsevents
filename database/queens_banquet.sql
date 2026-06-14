-- Queens Banquet Events Database Schema
CREATE DATABASE IF NOT EXISTS queens_banquet;
USE queens_banquet;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    status ENUM('active', 'disabled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    max_guests INT DEFAULT 50,
    inclusions JSON,
    featured TINYINT(1) DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    guest_count INT DEFAULT 0,
    package_id INT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES packages(id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    receipt_path VARCHAR(255),
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    caption VARCHAR(255),
    image_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    sender_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Seed packages
INSERT INTO packages (name, description, price, max_guests, inclusions, featured) VALUES
('Essential', 'Perfect for intimate gatherings', 45000, 50, '["Event coordination (8 hrs)","Basic table & chair setup","Floral centerpieces (5 tables)","Sound system & basic lighting","4-hour catering service","Photo coverage (4 hrs)"]', 0),
('Signature', 'Our most popular choice', 95000, 150, '["Full-day coordination (12 hrs)","Premium venue styling & décor","Elaborate floral arrangements","Premium sound, lighting & LED walls","8-hour catering with open bar","Photo + video (8 hrs)","Host / Emcee service","Cake from partner baker"]', 1),
('Grand', 'The ultimate luxury experience', 185000, 300, '["Dedicated 2-day event team","Luxury venue transformation","Couture floral installations","Pro audio-visual production","Full-day dining & premium bar","Cinematic photo + film team","Live band or celebrity host","Luxury transport (2 vehicles)","Concierge guest services"]', 0);

-- Seed admin user (password: admin123)
INSERT INTO users (first_name, last_name, email, phone, password, role) VALUES
('Admin', 'User', 'admin@velura.ph', '+63 917 000 0000', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Digital Event Invitation System
CREATE TABLE events (
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

CREATE TABLE invitation_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_name VARCHAR(100) NOT NULL,
    category ENUM('wedding', 'debut', 'birthday', 'anniversary', 'corporate') NOT NULL,
    preview_image VARCHAR(255),
    theme_config JSON,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invitation_pages (
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

CREATE TABLE guests (
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

CREATE TABLE rsvps (
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

CREATE TABLE guest_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    guest_name VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
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
