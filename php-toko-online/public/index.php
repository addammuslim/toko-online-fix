<?php
/**
 * TOKO ONLINE & POS NUSANTARA HERITAGE
 * Front Controller (Entry Point)
 * PHP 8.1+ Native MVC Tanpa Framework
 */
declare(strict_types=1);

session_start([
    'cookie_httponly' => true,
    'cookie_secure'   => isset($_SERVER['HTTPS']),
    'cookie_samesite' => 'Lax'
]);

// Autoload sederhana PSR-4
spl_autoload_register(function (string $class) {
    $prefix = 'App\\\\';
    $baseDir = __DIR__ . '/../app/';

    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    $relativeClass = substr($class, $len);
    $file = $baseDir . str_replace('\\\\', '/', $relativeClass) . '.php';

    if (file_exists($file)) {
        require $file;
    }
});

// Load config & security helpers
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../app/core/Security.php';

use App\\Core\\Router;
use App\\Controllers\\HomeController;
use App\\Controllers\\ProductController;
use App\\Controllers\\CheckoutController;
use App\\Controllers\\MidtransWebhookController;
use App\\Controllers\\PosController;
use App\\Controllers\\AdminController;

$router = new Router();

// Frontend Routes
$router->get('/', [HomeController::class, 'index']);
$router->get('/products', [ProductController::class, 'index']);
$router->get('/product/detail', [ProductController::class, 'detail']);
$router->get('/cart', [CheckoutController::class, 'cart']);
$router->get('/checkout', [CheckoutController::class, 'index']);
$router->post('/checkout/process', [CheckoutController::class, 'process']);
$router->get('/tracking', [CheckoutController::class, 'trackOrder']);

// Webhook Midtrans (No CSRF check, signature verified via SHA512)
$router->post('/webhook/midtrans', [MidtransWebhookController::class, 'handle']);

// POS (Offline Cashier)
$router->get('/admin/pos', [PosController::class, 'index']);
$router->post('/admin/pos/transact', [PosController::class, 'transact']);
$router->post('/admin/pos/shift/close', [PosController::class, 'closeShift']);

// Admin Panel Routes
$router->get('/admin', [AdminController::class, 'dashboard']);
$router->get('/admin/orders', [AdminController::class, 'orders']);
$router->post('/admin/orders/update-status', [AdminController::class, 'updateOrderStatus']);
$router->get('/admin/products', [AdminController::class, 'products']);
$router->post('/admin/products/save', [AdminController::class, 'saveProduct']);
$router->get('/admin/builder', [AdminController::class, 'homeBuilder']);
$router->post('/admin/builder/save', [AdminController::class, 'saveBuilder']);
$router->get('/admin/settings', [AdminController::class, 'settings']);
$router->post('/admin/settings/save', [AdminController::class, 'saveSettings']);
$router->get('/admin/logs', [AdminController::class, 'logs']);

// Jalankan Router
$router->dispatch($_SERVER['REQUEST_URI'] ?? '/', $_SERVER['REQUEST_METHOD'] ?? 'GET');
