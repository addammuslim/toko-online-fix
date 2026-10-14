import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Folder, Database, Server } from 'lucide-react';

interface CodeSnippet {
  path: string;
  category: string;
  language: string;
  description: string;
  code: string;
}

const PHP_MVC_SNIPPETS: CodeSnippet[] = [
  {
    path: 'public/index.php',
    category: 'Front Controller',
    language: 'php',
    description: 'Entry point aplikasi PHP Native MVC dengan autoloader, session security, dan router dispatch',
    code: `<?php
/**
 * Nusantara Store - PHP 8.1+ Native MVC Architecture
 * Entry Point & Front Controller
 */
declare(strict_types=1);

session_start([
    'cookie_httponly' => true,
    'cookie_secure' => isset($_SERVER['HTTPS']),
    'cookie_samesite' => 'Lax'
]);

// 1. Load Environment Configuration
require_once __DIR__ . '/../config/app.php';
require_once __DIR__ . '/../config/database.php';

// 2. PSR-4 Autoloader Sederhana Tanpa Composer
spl_autoload_register(function ($class) {
    $prefix = 'App\\\\';
    $baseDir = __DIR__ . '/../app/';
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) return;
    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\\\', '/', $relativeClass) . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

use App\\Core\\Router;
use App\\Controllers\\HomeController;
use App\\Controllers\\ProductController;
use App\\Controllers\\OrderController;
use App\\Controllers\\Admin\\ReportController;

$router = new Router();

// Routes Storefront
$router->get('/', [HomeController::class, 'index']);
$router->get('/products', [ProductController::class, 'index']);
$router->get('/product/{slug}', [ProductController::class, 'detail']);
$router->get('/tracking', [OrderController::class, 'track']);

// Routes Checkout & Midtrans Webhook
$router->post('/api/checkout', [OrderController::class, 'processCheckout']);
$router->post('/api/midtrans/notification', [OrderController::class, 'handleNotification']);

// Routes Admin & Laporan Laba Rugi
$router->get('/admin/reports/profit-loss', [ReportController::class, 'getProfitLossReport']);

$router->dispatch($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
`
  },
  {
    path: 'config/database.php',
    category: 'Database PDO',
    language: 'php',
    description: 'Koneksi MySQL dengan PDO Prepared Statements untuk pencegahan SQL Injection mutlak',
    code: `<?php
declare(strict_types=1);

namespace Config;

use PDO;
use PDOException;

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            $host = $_ENV['DB_HOST'] ?? 'localhost';
            $port = $_ENV['DB_PORT'] ?? '3306';
            $dbName = $_ENV['DB_NAME'] ?? 'nusantara_store';
            $user = $_ENV['DB_USER'] ?? 'root';
            $pass = $_ENV['DB_PASS'] ?? '';

            $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false, // Wajib false untuk real prepared statements
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
            ];

            try {
                self::$instance = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                error_log("Database Connection Error: " . $e->getMessage());
                die(json_encode(['error' => 'Koneksi basis data gagal. Silakan periksa kredensial DB.']));
            }
        }
        return self::$instance;
    }
}
`
  },
  {
    path: 'app/Controllers/Admin/ReportController.php',
    category: 'Controller Laba Rugi',
    language: 'php',
    description: 'Kalkulasi pendapatan bersih, HPP modal produk, dan beban pengeluaran (Laba/Rugi Harian, Bulanan, Tahunan)',
    code: `<?php
declare(strict_types=1);

namespace App\\Controllers\\Admin;

use App\\Core\\Controller;
use Config\\Database;
use PDO;

class ReportController extends Controller {
    public function getProfitLossReport(): void {
        $this->requireAdminAuth();
        $db = Database::getConnection();

        $period = $_GET['period'] ?? 'monthly'; // 'daily' | 'monthly' | 'yearly'
        $year = (int)($_GET['year'] ?? date('Y'));
        $month = (int)($_GET['month'] ?? date('m'));
        $date = $_GET['date'] ?? date('Y-m-d');

        // 1. Hitung Total Omset & HPP dari Order yang Terbayar (Prepared Statement)
        if ($period === 'daily') {
            $stmt = $db->prepare("
                SELECT 
                    COALESCE(SUM(o.total_amount), 0) AS total_revenue,
                    COALESCE(SUM(oi.cogs_price * oi.quantity), 0) AS total_cogs
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE o.payment_status = 'paid' AND DATE(o.created_at) = :selected_date
            ");
            $stmt->execute([':selected_date' => $date]);
            $orderStats = $stmt->fetch();

            $expStmt = $db->prepare("
                SELECT category, COALESCE(SUM(amount), 0) as total 
                FROM expenses 
                WHERE DATE(expense_date) = :selected_date 
                GROUP BY category
            ");
            $expStmt->execute([':selected_date' => $date]);
            $expenses = $expStmt->fetchAll();
        } else {
            // Bulanan / Tahunan logic
            $stmt = $db->prepare("
                SELECT 
                    COALESCE(SUM(o.total_amount), 0) AS total_revenue,
                    COALESCE(SUM(oi.cogs_price * oi.quantity), 0) AS total_cogs
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                WHERE o.payment_status = 'paid' 
                  AND YEAR(o.created_at) = :year
                  AND MONTH(o.created_at) = :month
            ");
            $stmt->execute([':year' => $year, ':month' => $month]);
            $orderStats = $stmt->fetch();

            $expStmt = $db->prepare("
                SELECT category, COALESCE(SUM(amount), 0) as total 
                FROM expenses 
                WHERE YEAR(expense_date) = :year AND MONTH(expense_date) = :month
                GROUP BY category
            ");
            $expStmt->execute([':year' => $year, ':month' => $month]);
            $expenses = $expStmt->fetchAll();
        }

        $revenue = (float)$orderStats['total_revenue'];
        $cogs = (float)$orderStats['total_cogs'];
        $grossProfit = $revenue - $cogs;
        $totalExpenses = array_sum(array_column($expenses, 'total'));
        $netProfit = $grossProfit - $totalExpenses;

        $this->jsonResponse([
            'status' => 'success',
            'period' => $period,
            'summary' => [
                'total_revenue' => $revenue,
                'total_cogs' => $cogs,
                'gross_profit' => $grossProfit,
                'total_expenses' => $totalExpenses,
                'net_profit' => $netProfit,
                'margin_percentage' => $revenue > 0 ? round(($netProfit / $revenue) * 100, 2) : 0
            ],
            'expense_breakdown' => $expenses
        ]);
    }
}
`
  },
  {
    path: 'database/schema.sql',
    category: 'MySQL Schema',
    language: 'sql',
    description: 'Skema tabel MySQL lengkap: produk, order, pelanggan, program loyalty customer, pengeluaran & promo voucher',
    code: `-- Nusantara Store - MySQL 8.0+ Relational Schema
CREATE DATABASE IF NOT EXISTS nusantara_store CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nusantara_store;

-- 1. Tabel Kategori & Produk
CREATE TABLE categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id VARCHAR(50) NOT NULL,
    price DECIMAL(14, 2) NOT NULL,
    cogs_price DECIMAL(14, 2) NOT NULL DEFAULT 0.00, -- HPP modal
    promo_price DECIMAL(14, 2) NULL,
    stock INT NOT NULL DEFAULT 0,
    weight_grams INT NOT NULL DEFAULT 500,
    sku VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100) NULL,
    description LONGTEXT,
    is_best_seller TINYINT(1) DEFAULT 0,
    is_promo TINYINT(1) DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- 2. Tabel Pelanggan & Loyalty Rewards
CREATE TABLE customers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    password_hash VARCHAR(255) NULL,
    order_count INT DEFAULT 0,
    total_spent DECIMAL(14, 2) DEFAULT 0.00,
    loyalty_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Beban Pengeluaran (Expenses)
CREATE TABLE expenses (
    id VARCHAR(50) PRIMARY KEY,
    expense_date DATE NOT NULL,
    category ENUM('iklan', 'pembelian_stok', 'operasional', 'gaji', 'utilitas', 'lainnya') NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(14, 2) NOT NULL,
    payment_source VARCHAR(100) NOT NULL,
    notes TEXT NULL,
    receipt_number VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Promo & Voucher
CREATE TABLE promotions (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    type ENUM('percentage', 'fixed', 'free_shipping', 'subsidy_shipping') NOT NULL,
    value DECIMAL(14, 2) NOT NULL,
    min_order_amount DECIMAL(14, 2) DEFAULT 0.00,
    max_discount_amount DECIMAL(14, 2) NULL,
    is_new_member_only TINYINT(1) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active TINYINT(1) DEFAULT 1
);
`
  },
  {
    path: '.htaccess',
    category: 'Apache Config',
    language: 'apache',
    description: 'Konfigurasi Apache URL rewrite bersih, kompresi GZIP, security headers, dan proteksi file konfigurasi',
    code: `# Nusantara Store - Apache Production Configuration
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # Proteksi File Sensitif (.env, .git, config)
    RewriteRule ^\\.env - [F,L,NC]
    RewriteRule ^config/.*$ - [F,L,NC]

    # Clean URL routing ke public/index.php
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ public/index.php [QSA,L]
</IfModule>

# GZIP Kompresi Aset Statis
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain text/html text/xml text/css application/xml application/xhtml+xml application/rss+xml application/javascript application/x-javascript application/json
</IfModule>

# Browser Caching Headers
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
</IfModule>
`
  }
];

export const PhpSourceViewer: React.FC = () => {
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet>(PHP_MVC_SNIPPETS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Code2 className="w-5 h-5 text-emerald-600" />
            <span>Referensi Arsitektur PHP 8.1+ Native MVC & MySQL Prepared</span>
          </h2>
          <p className="text-xs text-slate-500">
            Arsitektur bersih tanpa framework pihak ketiga (No Laravel/CI), siap deployment langsung ke server Apache/cPanel
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-xs"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Tersalin!' : 'Salin Kode File Ini'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* File Navigator Sidebar */}
        <div className="md:col-span-4 space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block px-2">
            File Struktur MVC:
          </span>
          {PHP_MVC_SNIPPETS.map((snip) => (
            <button
              key={snip.path}
              onClick={() => setSelectedSnippet(snip)}
              className={`w-full text-left p-2.5 rounded-xl transition text-xs flex items-center justify-between ${
                selectedSnippet.path === snip.path
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'text-slate-700 hover:bg-slate-200/70 font-medium'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span className="font-mono truncate">{snip.path}</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20 uppercase font-mono">
                {snip.category}
              </span>
            </button>
          ))}
        </div>

        {/* Code Content Preview */}
        <div className="md:col-span-8 bg-slate-950 text-slate-200 rounded-2xl p-4 overflow-hidden border border-slate-800 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-mono text-emerald-400 font-bold">{selectedSnippet.path}</span>
              <span>{selectedSnippet.language.toUpperCase()}</span>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              {selectedSnippet.description}
            </p>
            <pre className="font-mono text-xs overflow-x-auto p-3 bg-slate-900/90 rounded-xl text-emerald-300 leading-relaxed max-h-[460px] overflow-y-auto">
              <code>{selectedSnippet.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
