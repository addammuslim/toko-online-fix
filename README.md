# NUSANTARA HERITAGE - TOKO ONLINE & POS KASIR LENGKAP

Platform Toko Online Modern & POS (Point of Sale) Kasir Offline dengan arsitektur **PHP 8.1+ Native MVC Sederhana (Tanpa Framework)**, **MySQL PDO Prepared Statements**, mode ganda **Midtrans Snap / WhatsApp Order**, kalkulator ongkir kurir nasional, dan panel admin lengkap.

---

## 🌟 FITUR UTAMA

### 1. Sisi Pengguna (Frontend)
- **Beranda Dinamis**: Hero slider, info marquee promo berjalan (kecepatan & warna dinamis dari admin), tentang brand, kurasi produk terlaris/promo/random/selected, testimoni, dan CTA.
- **Katalog & Filter**: Filter kategori, sorting (terlaris, terbaru, harga termurah/termahal), pencarian real-time, pagination.
- **Detail Produk**: Multi-gambar dengan galeri thumbnail, pemilih varian (stok & harga adaptif), ulasan pembeli dengan rating bintang, dan produk terkait.
- **Mode Pembayaran Fleksibel (Diatur Dinamis dari Admin)**:
  - **Mode Midtrans Snap**: Alur e-commerce standar: tambah ke keranjang, drawer belanja, checkout wilayah dinamis (provinsi/kota/kecamatan), kalkulator ongkir multi-kurir (JNE, J&T, SiCepat, AnterAja), kode voucher promo, pembayaran Snap popup (QRIS, BCA VA, Kartu Kredit), webhook notifikasi status settlement, dan struk digital.
  - **Mode WhatsApp**: **Icon keranjang dan halaman checkout otomatis DISEMBUNYIKAN**. Tombol "Beli via WhatsApp" langsung membuka `wa.me/<nomor>?text=<pesan>` dengan format template greeting terisi otomatis (`{produk}`, `{varian}`, `{harga}`, `{qty}`, `{link_produk}`, `{nama_toko}`) dan dicatat ke log dengan status *WA Inquiry*.
- **Lacak Pesanan**: Pelacakan nomor pesanan (ORD-...) atau nomor handphone dengan status visual tracker (Pending → Dibayar → Diproses → Dikirim [dengan No. Resi] → Selesai).
- **Halaman Statis**: Tentang Kami, Kontak Kami (inbox masuk ke admin), Testimoni Pelanggan.

### 2. Modul POS (Point of Sale - Kasir Offline `/admin/pos`)
- Tampilan responsif tablet, smartphone kasir, dan komputer kasir.
- Dukungan **scan barcode hardware** (input keyboard barcode reader) & pencarian produk cepat.
- Transaksi stok **atomik terintegrasi** dengan stok online (mencegah minus stok saat online & offline bersamaan).
- Perhitungan kembalian uang tunai otomatis dengan tombol nominal cepat.
- **Cetak Struk Thermal 58mm / 80mm** (CSS media print) + tombol instan **Kirim Struk via WhatsApp**.
- **Shift Kasir**: Buka kasir, input kas awal, pantau total penjualan tunai/non-tunai, dan rekap penutupan shift.

### 3. Modul Panel Admin (`/admin`)
- **Proteksi Brute-Force & Session**: Rate limiting login maks 5 percobaan gagal dengan lockout otomatis, CSRF token, session HttpOnly.
- **Dashboard & Chart.js**: Visualisasi tren omzet online vs POS harian/bulanan, distribusi status pesanan donat, konversi funnel (ViewContent → InitiateCheckout → Purchase → WhatsApp Leads), dan filter tanggal.
- **Manajemen Pesanan & Aksi**: Filter pesanan, pencarian, ekspor laporan ke CSV, update alur status, dan input ekspedisi + nomor resi pengiriman.
- **Manajemen Produk**: CRUD produk, kategori, varian spesifik, multi-gambar, berat gram, barcode/SKU, dan flag badge.
- **Home Custom Builder**: Atur posisi urutan section beranda, aktif/nonaktifkan banner, kelola teks marquee, dan pilih sumber produk lewat select box.
- **Web Settings**: Ganti nama toko, nomor WhatsApp CS, template pesan greeting WhatsApp, kredensial Midtrans Server/Client Key (sandbox & production), origin alamat pengiriman toko, opsi bebas ongkir, tema warna CSS variables live preview, dan injeksi tracking pixel (Facebook Pixel, TikTok Pixel, Google Analytics GA4).
- **User & Hak Akses (RBAC)**: Pengaturan akun staf kasir dan administrator dengan permissions modular (`pos.access`, `pos.discount`, `pos.void`, `products.manage`, `orders.manage`, `settings.manage`).
- **Log Activity & Analytics**: Audit trail lengkap setiap aksi admin dan aktivitas pengunjung.

---

## 💻 STRUKTUR ARSITEKTUR KODE

```
/
├── app/
│   ├── controllers/      # Controller MVC (Home, Product, Checkout, Pos, Admin)
│   ├── core/             # Router, Database PDO, Security, Controller dasar
│   ├── models/           # Model data (Product, Order, Setting, Category)
│   └── services/         # Adapter Shipping (RajaOngkir/Biteship) & Midtrans Snap
├── config/               # config.php, database.php
├── database/             # schema.sql, seed.sql
├── public/               # index.php (Front Controller), assets, uploads, .htaccess
├── .env.example          # Template konfigurasi environment
├── .htaccess             # Security headers, Clean URLs, Gzip kompresi
└── README.md
```

---

## 🚀 PANDUAN INSTALASI & MENJALANKAN (PHP & MYSQL)

### 1. Kebutuhan Server
- PHP 8.1 atau lebih baru (ekstensi `pdo_mysql`, `curl`, `json`, `mbstring`, `openssl`).
- MySQL 8.0+ atau MariaDB 10.5+.
- Apache Web Server dengan modul `mod_rewrite` aktif (atau Nginx).

### 2. Konfigurasi Database
1. Buat database baru di MySQL:
   ```sql
   CREATE DATABASE toko_nusantara CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Impor berkas skema dan data awal:
   ```bash
   mysql -u root -p toko_nusantara < database/schema.sql
   mysql -u root -p toko_nusantara < database/seed.sql
   ```

### 3. Konfigurasi Environment (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan kredensial database dan API keys:
```env
DB_HOST="127.0.0.1"
DB_PORT="3306"
DB_NAME="toko_nusantara"
DB_USER="root"
DB_PASS="password_anda"

MIDTRANS_SERVER_KEY="SB-Mid-server-XXXXX"
MIDTRANS_CLIENT_KEY="SB-Mid-client-XXXXX"
MIDTRANS_IS_PRODUCTION="false"

WHATSAPP_NUMBER="628123456789"
```

### 4. Menjalankan Server Lokal (PHP Built-in Server)
```bash
php -S 0.0.0.0:8000 -t public
```
Akses di browser: `http://localhost:8000`

---

## 🔐 AKUN ADMIN DEFAULT
- **URL Admin**: `/admin`
- **Email**: `admin@nusantarastore.id`
- **Password**: `admin123`
*(Wajib segera diubah pada menu User & RBAC setelah instalasi produksi)*

---

## 🛡️ STANDAR KEAMANAN
1. **Anti SQL Injection**: 100% database query menggunakan `PDO::prepare()` dan binding parameter dengan `PDO::ATTR_EMULATE_PREPARES => false`.
2. **Anti XSS**: Seluruh output escaping menggunakan `htmlspecialchars($var, ENT_QUOTES, 'UTF-8')`.
3. **Anti CSRF**: Token unik per session pada seluruh formulir POST.
4. **Proteksi Folder Sensitif**: File `.htaccess` memblokir akses HTTP langsung ke direktori `/app`, `/config`, `/database`, dan file `.env`.
5. **Verifikasi Signature Webhook Midtrans**: Menghitung `hash('sha512', $orderId . $statusCode . $grossAmount . $serverKey)` untuk memastikan otentisitas notifikasi pembayaran.
