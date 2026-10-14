-- SEED DATA DEMO NUSANTARA STORE

INSERT INTO categories (id, name, slug, icon, image, description) VALUES
('cat-fashion', 'Fashion & Batik', 'fashion-batik', 'Shirt', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600', 'Koleksi busana lokal kontemporer dan batik tulis modern'),
('cat-coffee', 'Kopi & Rempah Nusantara', 'kopi-rempah', 'Coffee', 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600', 'Biji kopi pilihan single origin dan racikan rempah nusantara'),
('cat-craft', 'Kerajinan & Aksesoris', 'kerajinan-aksesoris', 'Gem', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 'Aksesoris kulit asli, tas tenun, dan dekorasi rumah artisan');

INSERT INTO products (id, category_id, name, slug, short_description, description, price, promo_price, stock, weight_grams, sku, barcode, is_best_seller, is_promo, is_selected, is_active, rating, review_count) VALUES
('prod-001', 'cat-fashion', 'Kemeja Batik Tulis Sutra Parang Modern', 'kemeja-batik-tulis-sutra-parang-modern', 'Batik tulis otentik dengan sentuhan potongan slim-fit kontemporer', 'Dibuat dengan dedikasi pengrajin Pekalongan menggunakan malam alami dan bahan sutra ATBM pilihan.', 485000.00, 429000.00, 24, 350, 'BTK-PRG-01', '8991001001', 1, 1, 1, 1, 4.90, 38),
('prod-002', 'cat-coffee', 'Gayo Arabica Wine Specialty 250g', 'gayo-arabica-wine-specialty-250g', 'Biji kopi fermentasi alami dengan aroma fruity winey elegan', 'Dipetik dari ketinggian 1600 mdpl di dataran tinggi Takengon, Aceh.', 135000.00, 119000.00, 45, 280, 'KOP-GYO-250', '8991002001', 1, 1, 1, 1, 4.95, 52),
('prod-003', 'cat-craft', 'Dompet Kulit Nabati Pull-Up Handmade', 'dompet-kulit-nabati-pull-up-handmade', 'Kulit sapi nabati asli dengan jahitan tangan (hand-stitched)', 'Dompet bifold minimalis berbahan vegetable tanned leather premium.', 295000.00, NULL, 18, 200, 'LHR-WLT-01', '8991003001', 0, 0, 1, 1, 4.80, 19);

-- Akun admin default: password "admin123" (Argon2 / bcrypt hash)
INSERT INTO staff_users (id, name, email, password_hash, role, permissions, is_active) VALUES
('usr-admin-1', 'Admin Utama', 'admin@nusantarastore.id', '$2y$10$eA8bS3q1WlP6TjK7mO4rUe8gZ.1k2l3m4n5o6p7q8r9s0t1u2v3w4', 'superadmin', '["all"]', 1);
