<?php
declare(strict_types=1);

// Konfigurasi Umum Toko Online
return [
    'app_name' => 'Nusantara Heritage Store',
    'app_url'  => getenv('APP_URL') ?: 'http://localhost:8000',
    'env'      => getenv('APP_ENV') ?: 'production',

    // Keamanan
    'session_lifetime' => 86400, // 24 jam
    'csrf_token_key'   => '_csrf_token',

    // Default Midtrans
    'midtrans' => [
        'server_key'    => getenv('MIDTRANS_SERVER_KEY') ?: 'SB-Mid-server-DemoKey123',
        'client_key'    => getenv('MIDTRANS_CLIENT_KEY') ?: 'SB-Mid-client-DemoKey123',
        'is_production' => filter_var(getenv('MIDTRANS_IS_PRODUCTION'), FILTER_VALIDATE_BOOLEAN)
    ],

    // Ongkir API
    'shipping' => [
        'provider' => getenv('SHIPPING_PROVIDER') ?: 'rajaongkir',
        'api_key'  => getenv('SHIPPING_API_KEY') ?: '',
        'origin'   => getenv('SHIPPING_ORIGIN_CITY') ?: 'Yogyakarta'
    ]
];
