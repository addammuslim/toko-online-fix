-- =================================================================
-- TOKO ONLINE & POS NUSANTARA HERITAGE - COMPLETE DATABASE SCHEMA
-- =================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS pos_shifts;
DROP TABLE IF EXISTS contact_messages;
DROP TABLE IF EXISTS product_reviews;
DROP TABLE IF EXISTS order_timelines;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS home_sections;
DROP TABLE IF EXISTS web_settings;
DROP TABLE IF EXISTS staff_users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    icon VARCHAR(50) DEFAULT NULL,
    image VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    short_description VARCHAR(255) DEFAULT NULL,
    description LONGTEXT NOT NULL,
    price DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    promo_price DECIMAL(14,2) DEFAULT NULL,
    stock INT NOT NULL DEFAULT 0,
    weight_grams INT NOT NULL DEFAULT 300,
    sku VARCHAR(100) NOT NULL UNIQUE,
    barcode VARCHAR(100) DEFAULT NULL,
    is_best_seller TINYINT(1) NOT NULL DEFAULT 0,
    is_promo TINYINT(1) NOT NULL DEFAULT 0,
    is_selected TINYINT(1) NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    rating DECIMAL(3,2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,
    meta_title VARCHAR(255) DEFAULT NULL,
    meta_description TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_product_cat_price (category_id, price),
    INDEX idx_product_flags (is_best_seller, is_promo, is_active),
    INDEX idx_product_barcode (barcode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_variants (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(14,2) NOT NULL,
    promo_price DECIMAL(14,2) DEFAULT NULL,
    stock INT NOT NULL DEFAULT 0,
    sku VARCHAR(100) NOT NULL UNIQUE,
    barcode VARCHAR(100) DEFAULT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_variant_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(150) DEFAULT NULL,
    address TEXT NOT NULL,
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    subdistrict VARCHAR(100) NOT NULL,
    postal_code VARCHAR(10) DEFAULT NULL,
    courier VARCHAR(100) NOT NULL,
    tracking_number VARCHAR(100) DEFAULT NULL,
    shipping_cost DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    subtotal DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    promo_code VARCHAR(50) DEFAULT NULL,
    total_amount DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    payment_mode ENUM('midtrans', 'whatsapp') NOT NULL DEFAULT 'midtrans',
    payment_method VARCHAR(100) NOT NULL,
    payment_status ENUM('unpaid', 'paid', 'expired', 'refunded') NOT NULL DEFAULT 'unpaid',
    order_status ENUM('Pending', 'Dibayar', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan', 'Gagal', 'WA Inquiry') NOT NULL DEFAULT 'Pending',
    source ENUM('Online', 'POS', 'WhatsApp') NOT NULL DEFAULT 'Online',
    cashier_name VARCHAR(100) DEFAULT NULL,
    amount_paid DECIMAL(14,2) DEFAULT NULL,
    change_due DECIMAL(14,2) DEFAULT NULL,
    notes TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_status (order_status),
    INDEX idx_order_created (created_at),
    INDEX idx_order_phone (customer_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(100) DEFAULT NULL,
    price DECIMAL(14,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(14,2) NOT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_item_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE order_timelines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    actor VARCHAR(100) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_timeline_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE pos_shifts (
    id VARCHAR(50) PRIMARY KEY,
    cashier_id VARCHAR(50) NOT NULL,
    cashier_name VARCHAR(100) NOT NULL,
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL DEFAULT NULL,
    initial_cash DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    total_cash_sales DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    total_non_cash_sales DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    total_discounts DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    total_transactions INT NOT NULL DEFAULT 0,
    status ENUM('open', 'closed') NOT NULL DEFAULT 'open',
    notes TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    metadata JSON DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_id VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_log_category (category),
    INDEX idx_log_event (event)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE staff_users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin', 'cashier', 'staff') NOT NULL DEFAULT 'staff',
    permissions JSON DEFAULT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    last_login TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
