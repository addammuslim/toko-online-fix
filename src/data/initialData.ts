import {
  Category,
  Product,
  WebSettings,
  HomeSection,
  PosShift,
  Order,
  Testimonial,
  Review,
  StaffUser,
  Expense,
  Promotion,
  LoyaltyReward,
  Customer,
  CustomPage
} from '../types';

export const initialCategories: Category[] = [
  {
    id: 'cat-fashion',
    name: 'Fashion & Batik',
    slug: 'fashion-batik',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80',
    description: 'Koleksi busana lokal kontemporer dan batik tulis modern'
  },
  {
    id: 'cat-coffee',
    name: 'Kopi & Rempah Nusantara',
    slug: 'kopi-rempah',
    icon: 'Coffee',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    description: 'Biji kopi pilihan single origin dan racikan rempah nusantara'
  },
  {
    id: 'cat-craft',
    name: 'Kerajinan & Aksesoris',
    slug: 'kerajinan-aksesoris',
    icon: 'Gem',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'Aksesoris kulit asli, tas tenun, dan dekorasi rumah artisan'
  },
  {
    id: 'cat-wellness',
    name: 'Herbal & Perawatan',
    slug: 'herbal-perawatan',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1608248597359-009d172e90be?w=600&auto=format&fit=crop&q=80',
    description: 'Sabun alami, essential oil organik, dan ramuan tradisional nusantara'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Kemeja Batik Tulis Sutra Parang Modern',
    slug: 'kemeja-batik-tulis-sutra-parang-modern',
    categoryId: 'cat-fashion',
    shortDescription: 'Batik tulis otentik dengan sentuhan potongan slim-fit kontemporer',
    description: 'Dibuat dengan dedikasi pengrajin Pekalongan menggunakan malam alami dan bahan sutra ATBM pilihan. Nyaman dipakai seharian untuk acara formal maupun semi-formal dengan sirkulasi udara optimal.',
    price: 485000,
    cogsPrice: 240000, // HPP Modal
    promoPrice: 429000,
    stock: 24,
    weightGrams: 350,
    sku: 'BTK-PRG-01',
    barcode: '8991001001',
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-001-m', name: 'Size M', price: 485000, promoPrice: 429000, stock: 8, sku: 'BTK-PRG-M', barcode: '89910010011' },
      { id: 'v-001-l', name: 'Size L', price: 485000, promoPrice: 429000, stock: 10, sku: 'BTK-PRG-L', barcode: '89910010012' },
      { id: 'v-001-xl', name: 'Size XL', price: 495000, promoPrice: 439000, stock: 6, sku: 'BTK-PRG-XL', barcode: '89910010013' }
    ],
    isBestSeller: true,
    isPromo: true,
    isSelected: true,
    isActive: true,
    rating: 4.9,
    reviewCount: 38,
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'prod-002',
    name: 'Gayo Arabica Wine Specialty 250g',
    slug: 'gayo-arabica-wine-specialty-250g',
    categoryId: 'cat-coffee',
    shortDescription: 'Biji kopi fermentasi alami dengan aroma fruity winey elegan',
    description: 'Dipetik dari ketinggian 1600 mdpl di dataran tinggi Takengon, Aceh. Proses wine anaerobic fermentation selama 30 hari menghasilkan cupping notes anggur merah, kismis, dan dark chocolate yang pekat dan beraroma harum.',
    price: 135000,
    cogsPrice: 65000, // HPP Modal
    promoPrice: 119000,
    stock: 45,
    weightGrams: 280,
    sku: 'KOP-GYO-250',
    barcode: '8991002001',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-002-beans', name: 'Biji Utuh (Whole Beans)', price: 135000, promoPrice: 119000, stock: 25, sku: 'KOP-GYO-WB', barcode: '89910020011' },
      { id: 'v-002-grind-coarse', name: 'Giling Kasar', price: 135000, promoPrice: 119000, stock: 10, sku: 'KOP-GYO-GC', barcode: '89910020012' },
      { id: 'v-002-grind-fine', name: 'Giling Halus', price: 135000, promoPrice: 119000, stock: 10, sku: 'KOP-GYO-GF', barcode: '89910020013' }
    ],
    isBestSeller: true,
    isPromo: true,
    isSelected: true,
    isActive: true,
    rating: 4.95,
    reviewCount: 52,
    createdAt: '2026-09-05T12:00:00Z'
  },
  {
    id: 'prod-003',
    name: 'Dompet Kulit Nabati Pull-Up Handmade',
    slug: 'dompet-kulit-nabati-pull-up-handmade',
    categoryId: 'cat-craft',
    shortDescription: 'Kulit sapi nabati asli dengan jahitan tangan (hand-stitched) tahan seumur hidup',
    description: 'Dompet bifold minimalis berbahan vegetable tanned leather premium. Semakin sering dipakai akan membentuk patina alami yang unik dan berkilau mewah.',
    price: 295000,
    cogsPrice: 140000,
    promoPrice: undefined,
    stock: 18,
    weightGrams: 200,
    sku: 'LHR-WLT-01',
    barcode: '8991003001',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-003-tan', name: 'Warna Tan Natural', price: 295000, stock: 8, sku: 'LHR-WLT-TAN', barcode: '89910030011' },
      { id: 'v-003-brown', name: 'Warna Dark Brown', price: 295000, stock: 10, sku: 'LHR-WLT-BRN', barcode: '89910030012' }
    ],
    isBestSeller: false,
    isPromo: false,
    isSelected: true,
    isActive: true,
    rating: 4.8,
    reviewCount: 19,
    createdAt: '2026-09-10T14:00:00Z'
  },
  {
    id: 'prod-004',
    name: 'Botanical Artisan Soap Set (3 Bars)',
    slug: 'botanical-artisan-soap-set-3-bars',
    categoryId: 'cat-wellness',
    shortDescription: 'Sabun mandi alami cold process dengan minyak kelapa dara & calendula',
    description: 'Bebas SLS, paraben, dan pewangi sintetis. Mengandung kelapa dara lokal, minyak zaitun, shea butter dan ekstrak rempah sirih kunyit untuk merawat kulit sensitif dengan kelembapan alami.',
    price: 125000,
    cogsPrice: 45000,
    promoPrice: 99000,
    stock: 32,
    weightGrams: 350,
    sku: 'WLL-SOP-SET',
    barcode: '8991004001',
    images: [
      'https://images.unsplash.com/photo-1608248597359-009d172e90be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&auto=format&fit=crop&q=80'
    ],
    variants: [
      { id: 'v-004-aromabox', name: 'Paket Lavender, Kunyit & Serai', price: 125000, promoPrice: 99000, stock: 32, sku: 'WLL-SOP-3', barcode: '89910040011' }
    ],
    isBestSeller: false,
    isPromo: true,
    isSelected: false,
    isActive: true,
    rating: 4.85,
    reviewCount: 27,
    createdAt: '2026-09-12T09:00:00Z'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-001',
    date: '2026-10-01',
    category: 'iklan',
    title: 'Meta Ads Instagram & Facebook Promo Oktober',
    amount: 1500000,
    paymentSource: 'Kartu Kredit Corporate',
    notes: 'Kampanye iklan video reels katalog batik',
    receiptNumber: 'INV-FB-992144',
    createdAt: '2026-10-01T08:00:00Z'
  },
  {
    id: 'exp-002',
    date: '2026-10-03',
    category: 'pembelian_stok',
    title: 'Pembelian Kain Sutra ATBM & Malam Bahan Batik (Supplier A)',
    amount: 3800000,
    paymentSource: 'Rekening BCA Bisnis',
    notes: 'Restock bahan kemeja parang 30 meter',
    receiptNumber: 'PO-KAP-0021',
    createdAt: '2026-10-03T11:30:00Z'
  },
  {
    id: 'exp-003',
    date: '2026-10-05',
    category: 'pembelian_stok',
    title: 'Pembelian Green Beans Kopi Gayo 50kg (Petani B Takengon)',
    amount: 4500000,
    paymentSource: 'Rekening BCA Bisnis',
    notes: 'Single origin wine grade 1 specialty',
    receiptNumber: 'PO-KOP-104',
    createdAt: '2026-10-05T14:15:00Z'
  },
  {
    id: 'exp-004',
    date: '2026-10-07',
    category: 'operasional',
    title: 'Kardus Packaging Sablon, Bubble Wrap & Lakban Toko',
    amount: 650000,
    paymentSource: 'Kasir Kas Kecil',
    notes: 'Dus packaging ramah lingkungan 300 pcs',
    receiptNumber: 'NOTA-PKG-881',
    createdAt: '2026-10-07T16:00:00Z'
  },
  {
    id: 'exp-005',
    date: '2026-10-10',
    category: 'utilitas',
    title: 'Listrik Workshop & WiFi Internet Fiber',
    amount: 850000,
    paymentSource: 'Rekening BCA Bisnis',
    notes: 'Tagihan PLN Token & IndiHome 100Mbps',
    receiptNumber: 'PLN-998821',
    createdAt: '2026-10-10T09:00:00Z'
  }
];

export const initialPromotions: Promotion[] = [
  {
    id: 'promo-001',
    code: 'WELCOME10',
    title: 'Voucher Selamat Datang Member Baru',
    description: 'Diskon 10% tanpa minimal belanja khusus pendaftaran akun customer baru.',
    type: 'percentage',
    value: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 50000,
    isForNewMembersOnly: true,
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    usageLimit: 500,
    usageCount: 42,
    termsAndConditions: [
      'Berlaku khusus untuk akun baru yang telah melakukan registrasi',
      'Diskon 10% dengan maksimal potongan Rp 50.000',
      'Tanpa minimal pembelanjaan produk',
      'Berlaku untuk 1 kali transaksi pertama'
    ],
    isActive: true
  },
  {
    id: 'promo-002',
    code: 'BEBASONGKIR',
    title: 'Gratis Ongkos Kirim Seluruh Indonesia',
    description: 'Subsidi ongkir hingga Rp 30.000 dengan minimal belanja Rp 250.000.',
    type: 'free_shipping',
    value: 30000,
    minOrderAmount: 250000,
    maxDiscountAmount: 30000,
    isForNewMembersOnly: false,
    startDate: '2026-10-01',
    endDate: '2026-11-30',
    usageLimit: 1000,
    usageCount: 118,
    termsAndConditions: [
      'Minimal total belanja produk Rp 250.000',
      'Maksimal potongan subsidi ongkir Rp 30.000',
      'Berlaku untuk semua kurir ekspedisi (JNE, J&T, SiCepat, AnterAja)'
    ],
    isActive: true
  },
  {
    id: 'promo-003',
    code: 'NUSANTARA25K',
    title: 'Potongan Langsung Rp 25.000',
    description: 'Potongan belanja langsung Rp 25.000 dengan minimal belanja Rp 350.000.',
    type: 'fixed',
    value: 25000,
    minOrderAmount: 350000,
    isForNewMembersOnly: false,
    startDate: '2026-10-05',
    endDate: '2026-11-15',
    usageLimit: 300,
    usageCount: 65,
    termsAndConditions: [
      'Minimal transaksi Rp 350.000',
      'Dapat digabungkan dengan promo ongkir bila berlaku',
      'Dapat digunakan oleh seluruh customer terdaftar'
    ],
    isActive: true
  }
];

export const initialLoyaltyRewards: LoyaltyReward[] = [
  {
    id: 'tier-1',
    orderMilestone: 3,
    title: 'Pembelian Ke-3: Diskon 10%',
    rewardDescription: 'Selamat! Pada pembelian ke-3 Anda berhak mendapatkan diskon 10% untuk semua koleksi.',
    rewardType: 'discount_percent',
    discountPercent: 10,
    badgeColor: '#10b981',
    icon: 'Sparkles',
    isActive: true
  },
  {
    id: 'tier-2',
    orderMilestone: 5,
    title: 'Pembelian Ke-5: Gratis Ongkir Seluruh Indonesia',
    rewardDescription: 'Nikmati subsidi bebas ongkos kirim ke seluruh kota/kabupaten di Indonesia.',
    rewardType: 'free_shipping',
    badgeColor: '#0ea5e9',
    icon: 'Truck',
    isActive: true
  },
  {
    id: 'tier-3',
    orderMilestone: 7,
    title: 'Pembelian Ke-7: Diskon Spesial 20%',
    rewardDescription: 'Loyalitas Anda luar biasa! Nikmati potongan diskon eksklusif 20% pada pesanan ke-7.',
    rewardType: 'discount_percent',
    discountPercent: 20,
    badgeColor: '#f59e0b',
    icon: 'Award',
    isActive: true
  },
  {
    id: 'tier-4',
    orderMilestone: 10,
    title: 'Pembelian Ke-10: Cashback Belanja Rp 100.000',
    rewardDescription: 'Potongan instan Rp 100.000 langsung dipotong saat transaksi pesanan ke-10.',
    rewardType: 'fixed_cashback',
    cashbackAmount: 100000,
    badgeColor: '#8b5cf6',
    icon: 'Gift',
    isActive: true
  },
  {
    id: 'tier-5',
    orderMilestone: 14,
    title: 'Pembelian Ke-14: Hadiah Baju Batik Eksklusif Gratis',
    rewardDescription: 'Member Sultan! Dapatkan 1 buah kemeja batik sutra/tenun eksklusif gratis dikirim ke alamat Anda.',
    rewardType: 'free_item',
    rewardItemName: 'Kemeja Batik Sutra Nusantara Eksklusif Free Gift',
    badgeColor: '#ec4899',
    icon: 'Gift',
    isActive: true
  },
  {
    id: 'tier-6',
    orderMilestone: 20,
    title: 'Pembelian Ke-20: VIP Gold Hamper Nusantara',
    rewardDescription: 'Paket bingkisan kriya artisan pilihan & kopi specialty premium senilai Rp 750.000.',
    rewardType: 'free_item',
    rewardItemName: 'VIP Artisan Craft Gift Box & Specialty Coffee Set',
    badgeColor: '#eab308',
    icon: 'Award',
    isActive: true
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Ananda Putri',
    username: 'ananda_putri',
    email: 'ananda.putri@gmail.com',
    phone: '081299887766',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    isGoogleAccount: true,
    address: 'Jl. Senopati Raya No. 45, RT 02/RW 04',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    subdistrict: 'Kebayoran Baru',
    postalCode: '12110',
    orderCount: 6,
    totalSpent: 2840000,
    loyaltyPoints: 280,
    claimedRewards: ['tier-1'],
    createdAt: '2026-06-15T09:00:00Z'
  },
  {
    id: 'cust-002',
    name: 'Dimas Prasetyo',
    username: 'dimas_p',
    email: 'dimas.prasetyo@yahoo.com',
    phone: '085711223344',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    isGoogleAccount: false,
    address: 'Jl. Dago Asri No. 18',
    province: 'Jawa Barat',
    city: 'Kota Bandung',
    subdistrict: 'Coblong',
    postalCode: '40135',
    orderCount: 2,
    totalSpent: 414000,
    loyaltyPoints: 40,
    claimedRewards: [],
    createdAt: '2026-08-20T14:30:00Z'
  },
  {
    id: 'cust-003',
    name: 'Siti Rahmawati',
    username: 'siti_rahma',
    email: 'siti.rahmawati@gmail.com',
    phone: '081377889900',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    isGoogleAccount: true,
    address: 'Jl. Kaliurang KM 5 No. 88',
    province: 'D.I. Yogyakarta',
    city: 'Kabupaten Sleman',
    subdistrict: 'Depok',
    postalCode: '55281',
    orderCount: 13,
    totalSpent: 6200000,
    loyaltyPoints: 620,
    claimedRewards: ['tier-1', 'tier-2'],
    createdAt: '2026-03-10T10:00:00Z'
  }
];

export const initialWebSettings: WebSettings = {
  storeName: 'Nusantara Heritage Store',
  tagline: 'Karya Terbaik Pengrajin Nusantara untuk Gaya Hidup Modern',
  logoType: 'icon_text', // 'icon_text' | 'image_only' | 'text_only'
  logoImageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=200&auto=format&fit=crop&q=80',
  faviconUrl: '',
  primaryColor: '#059669', // Emerald 600
  primaryHoverColor: '#047857', // Emerald 700
  secondaryColor: '#0f172a', // Slate 900
  accentColor: '#d97706', // Amber 600
  focusRingColor: '#10b981', // Emerald 500
  phone: '0812-3456-7890',
  whatsappNumber: '628123456789',
  email: 'halo@nusantarastore.id',
  address: 'Jl. Malioboro No. 88, Sosromenduran, Gedong Tengen, Kota Yogyakarta, D.I. Yogyakarta 55271',
  instagram: 'https://instagram.com/nusantara.store',
  tiktok: 'https://tiktok.com/@nusantara.store',
  facebook: 'https://facebook.com/nusantarastore.official',
  paymentMode: 'midtrans',
  waGreetingTemplate: `Halo Admin {nama_toko}, saya tertarik dan ingin memesan produk ini:

*Produk:* {produk}
*Varian:* {varian}
*Jumlah:* {qty} pcs
*Total Estimasi:* {harga}
*Link Produk:* {link_produk}

Mohon info ketersediaan stok & ongkos kirim ke alamat saya ya. Terima kasih! 🙏`,
  autoSendOrderWA: true,
  autoSendOrderEmail: true,
  autoSendStatusWA: true,
  midtransServerKey: 'SB-Mid-server-DemoKeySandbox1234567890',
  midtransClientKey: 'SB-Mid-client-DemoKeySandboxClient987654',
  midtransIsProduction: false,
  shippingProvider: 'rajaongkir',
  shippingApiKey: 'RO_PRO_DEMO_KEY_9921',
  originProvince: 'D.I. Yogyakarta',
  originCity: 'Kota Yogyakarta',
  originSubdistrict: 'Gedong Tengen',
  originPostalCode: '55271',
  defaultWeightGrams: 300,
  freeShippingMinSpend: 300000,
  enableFreeShipping: true,
  flatRateShipping: 18000,
  enableFlatRate: false,
  activeCouriers: ['jne', 'jnt', 'sicepat', 'anteraja', 'pos', 'tiki'],
  // RajaOngkir Pro Config
  rajaongkirApiKey: 'ro_pro_live_9921820491823901',
  rajaongkirAccountType: 'pro',
  rajaongkirOriginId: '501', // Yogyakarta
  // WhatsApp Automation Providers
  waProvider: 'fonnte',
  waApiKey: 'FONNTE_TOKEN_DEMO_998811',
  waSenderNumber: '628123456789',
  autoSendStatusChangeWA: true,
  autoSendFollowUpWA: true,
  autoSendLoyaltyRewardWA: true,
  waCustomWebhookUrl: 'https://api.fonnte.com/send',
  // Email Automation Providers
  emailProvider: 'resend',
  emailSenderName: 'Nusantara Heritage Official',
  emailSenderAddress: 'order@nusantarastore.id',
  emailApiKey: 're_123456789_DemoKey',
  // Visual Theme & Slider Presets
  sliderStyle: 'modern_split',
  designTheme: 'modern_elegance',
  cardStyle: 'rounded_soft',
  fbPixelId: 'FB-98765432101',
  tiktokPixelId: 'TT-C98124801',
  gaMeasurementId: 'G-ID10293847',
  customHeadScript: '',
  customBodyScript: '',
  metaTitle: 'Nusantara Store - Toko Online Produk Lokal & Batik Modern',
  metaDescription: 'Belanja aneka produk karya anak bangsa: batik tulis sutra, kopi specialty gayo, kerajinan kulit asli, dan perawatan tubuh ramah lingkungan.',
  metaKeywords: 'batik modern, kopi gayo wine, kerajinan kulit, produk lokal indonesia, toko online jogja'
};

export const initialHomeSections: HomeSection[] = [
  {
    id: 'sec-slider',
    type: 'slider',
    title: 'Hero Banner Slider',
    order: 1,
    isActive: true,
    config: {
      slides: [
        {
          id: 'slide-1',
          image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1600&auto=format&fit=crop&q=80',
          title: 'Mahakarya Batik & Tradisi Indonesia',
          subtitle: 'Koleksi busana eksklusif tenun & batik tulis dengan potongan modern berkelas.',
          btnText: 'Jelajahi Koleksi',
          btnLink: '/products?category=fashion-batik'
        },
        {
          id: 'slide-2',
          image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop&q=80',
          title: 'Biji Kopi Specialty Single Origin',
          subtitle: 'Petikan tangan petani dataran tinggi Gayo & Toraja dipanggang segar tiap minggu.',
          btnText: 'Beli Kopi Segar',
          btnLink: '/products?category=kopi-rempah'
        },
        {
          id: 'slide-3',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&auto=format&fit=crop&q=80',
          title: 'Kerajinan Kulit Asli & Tenun Ikat NTT',
          subtitle: 'Sentuhan tangan pengrajin lokal untuk aksesori tahan lama berkarakter kuat.',
          btnText: 'Lihat Kerajinan',
          btnLink: '/products?category=kerajinan-aksesoris'
        }
      ]
    }
  },
  {
    id: 'sec-marquee',
    type: 'marquee',
    title: 'Marquee Pengumuman & Promo',
    order: 2,
    isActive: true,
    config: {
      text: '🔥 PROMO SPESIAL: GRATIS ONGKIR SELURUH INDONESIA DENGAN MINIMAL BELANJA RP 300.000 • PROGRAM REWARD LOYALTY MEMBER: BELANJA KE-7 DISKON 20% & KE-14 BAJU GRATIS • METODE BAYAR MIDTRANS & WHATSAPP READY!',
      speed: 25,
      bgColor: '#059669',
      textColor: '#ffffff',
      linkUrl: '/promo'
    }
  },
  {
    id: 'sec-about',
    type: 'about_brand',
    title: 'Dedikasi Untuk Pengrajin Nusantara',
    subtitle: 'Menghubungkan karya seni lokal dengan pecinta kualitas tinggi di seluruh dunia',
    order: 3,
    isActive: true,
    config: {
      content: 'Nusantara Heritage lahir dari kecintaan pada warisan budaya Indonesia. Kami bekerja sama langsung dengan para penenun di NTT, pembatik di Pekalongan, dan petani kopi di Gayo untuk menghadirkan produk dengan nilai estetika tinggi, etis, dan berkelanjutan.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
      badge: '100% Produk Asli & Etis'
    }
  },
  {
    id: 'sec-best-seller',
    type: 'products_grid',
    title: 'Produk Terlaris Minggu Ini',
    subtitle: 'Pilihan paling diminati pelanggan dengan ulasan bintang lima',
    order: 4,
    isActive: true,
    config: {
      source: 'terlaris',
      limit: 4
    }
  },
  {
    id: 'sec-experience',
    type: 'experience',
    title: 'Mengapa Memilih Nusantara Heritage?',
    subtitle: 'Komitmen kami pada kualitas dan kepuasan pengalaman belanja Anda',
    order: 5,
    isActive: true,
    config: {}
  },
  {
    id: 'sec-promo',
    type: 'products_grid',
    title: 'Promo Spesial & Penawaran Terbatas',
    subtitle: 'Dapatkan potongan harga eksklusif untuk koleksi terpilih',
    order: 6,
    isActive: true,
    config: {
      source: 'promo',
      limit: 4
    }
  },
  {
    id: 'sec-testimonials',
    type: 'testimonials',
    title: 'Cerita Pelanggan Kami',
    subtitle: 'Apa kata mereka yang telah merasakan keindahan karya nusantara',
    order: 7,
    isActive: true,
    config: {}
  },
  {
    id: 'sec-cta',
    type: 'cta',
    title: 'Siap Tampil Beda dengan Produk Lokal?',
    subtitle: 'Konsultasi ukuran & rekomendasi produk langsung dengan tim kami via WhatsApp atau checkout mudah dengan Midtrans.',
    order: 8,
    isActive: true,
    config: {}
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Bima Satria',
    role: 'Arsitek, Jakarta Selatan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    content: 'Kemeja batik sutra parangnya luar biasa halus dan potongannya pas di badan. Dipakai presentasi di depan klien sangat berwibawa. Pengiriman cepat dan packaging sangat rapi dengan aroma kayu manis.',
    rating: 5,
    featured: true
  },
  {
    id: 't-2',
    name: 'Siti Rahmawati',
    role: 'Home Brewer & Pecinta Kopi, Bandung',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    content: 'Gayo wine process-nya aromatik sekali! Saat di-grind wangi anggur langsung semerbak. Sangat recommended bagi yang menyukai kopi pour-over berkarakter asam manis menyegarkan.',
    rating: 5,
    featured: true
  },
  {
    id: 't-3',
    name: 'dr. Hendra Wicaksono',
    role: 'Dokter Umum, Surabaya',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    content: 'Dompet kulit pull-up-nya tebal dan jahitan tangan sangat presisi. Sudah 6 bulan pakai makin kinclong warnanya. Belanja via WhatsApp respon admin ramah dan gercep!',
    rating: 5,
    featured: true
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-001',
    productName: 'Kemeja Batik Tulis Sutra Parang Modern',
    userName: 'Arya Pratama',
    userEmail: 'arya@example.com',
    rating: 5,
    comment: 'Bahan adem, jahitannya rapi standar butik. Puas banget!',
    createdAt: '2026-09-20T08:30:00Z',
    isApproved: true
  },
  {
    id: 'rev-2',
    productId: 'prod-002',
    productName: 'Gayo Arabica Wine Specialty 250g',
    userName: 'Dewi Lestari',
    userEmail: 'dewi@example.com',
    rating: 5,
    comment: 'Roasting date masih baru 5 hari lalu. Fresh banget!',
    createdAt: '2026-09-22T14:15:00Z',
    isApproved: true
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-20261010-001',
    customerId: 'cust-001',
    customerName: 'Ananda Putri',
    customerPhone: '081299887766',
    customerEmail: 'ananda.putri@gmail.com',
    address: 'Jl. Senopati Raya No. 45, Kebayoran Baru',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    subdistrict: 'Kebayoran Baru',
    postalCode: '12110',
    courier: 'JNE - YES',
    trackingNumber: 'JNE88291048201',
    shippingCost: 24000,
    subtotal: 429000,
    discount: 0,
    totalAmount: 453000,
    paymentMode: 'midtrans',
    paymentMethod: 'Midtrans Snap (BCA Virtual Account)',
    paymentStatus: 'paid',
    orderStatus: 'Dikirim',
    source: 'Online',
    items: [
      {
        productId: 'prod-001',
        productName: 'Kemeja Batik Tulis Sutra Parang Modern',
        variantName: 'Size L',
        price: 429000,
        cogsPrice: 240000,
        quantity: 1,
        subtotal: 429000,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&auto=format&fit=crop&q=80'
      }
    ],
    timelines: [
      {
        status: 'Pending',
        title: 'Pesanan Dibuat',
        description: 'Menunggu pembayaran dari pelanggan via BCA VA',
        timestamp: '2026-10-10T09:12:00Z'
      },
      {
        status: 'Dibayar',
        title: 'Pembayaran Terkonfirmasi',
        description: 'Midtrans Webhook: settlement berhasil',
        timestamp: '2026-10-10T09:15:30Z'
      },
      {
        status: 'Diproses',
        title: 'Pesanan Dipersiapkan',
        description: 'Barang dicek QC dan dibungkus rapi',
        timestamp: '2026-10-10T11:00:00Z'
      },
      {
        status: 'Dikirim',
        title: 'Diserahkan ke Kurir',
        description: 'Kurir JNE mengambil paket, Resi: JNE88291048201',
        timestamp: '2026-10-10T14:30:00Z'
      }
    ],
    createdAt: '2026-10-10T09:12:00Z',
    updatedAt: '2026-10-10T14:30:00Z'
  },
  {
    id: 'ORD-20261011-POS-01',
    customerId: 'cust-002',
    customerName: 'Dimas Prasetyo (Kasir Walk-In)',
    customerPhone: '085711223344',
    address: 'Belanja Langsung di Store Malioboro',
    province: 'D.I. Yogyakarta',
    city: 'Kota Yogyakarta',
    subdistrict: 'Gedong Tengen',
    postalCode: '55271',
    courier: 'Ambil di Toko / Langsung',
    shippingCost: 0,
    subtotal: 238000,
    discount: 10000,
    promoCode: 'POSDISC',
    totalAmount: 228000,
    paymentMode: 'midtrans',
    paymentMethod: 'Tunai (Cash)',
    paymentStatus: 'paid',
    orderStatus: 'Selesai',
    source: 'POS',
    cashierName: 'Rian Kasir 1',
    amountPaid: 250000,
    changeDue: 22000,
    items: [
      {
        productId: 'prod-002',
        productName: 'Gayo Arabica Wine Specialty 250g',
        variantName: 'Biji Utuh (Whole Beans)',
        price: 119000,
        cogsPrice: 65000,
        quantity: 2,
        subtotal: 238000,
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&auto=format&fit=crop&q=80'
      }
    ],
    timelines: [
      {
        status: 'Selesai',
        title: 'Transaksi POS Selesai',
        description: 'Pembayaran tunai diterima, struk thermal dicetak',
        timestamp: '2026-10-11T10:45:00Z',
        actor: 'Rian Kasir 1'
      }
    ],
    createdAt: '2026-10-11T10:45:00Z',
    updatedAt: '2026-10-11T10:45:00Z'
  }
];

export const initialStaffUsers: StaffUser[] = [
  {
    id: 'usr-admin-1',
    name: 'Admin Utama (Superadmin)',
    email: 'admin@nusantarastore.id',
    role: 'superadmin',
    permissions: ['all'],
    isActive: true,
    lastLogin: '2026-10-11T12:00:00Z'
  },
  {
    id: 'usr-cashier-1',
    name: 'Rian Hidayat',
    email: 'rian.pos@nusantarastore.id',
    role: 'cashier',
    permissions: ['pos.access', 'pos.discount'],
    isActive: true,
    lastLogin: '2026-10-11T08:00:00Z'
  }
];

export const initialActiveShift: PosShift = {
  id: 'SHIFT-20261011-01',
  cashierId: 'usr-cashier-1',
  cashierName: 'Rian Hidayat',
  openedAt: '2026-10-11T08:00:00Z',
  initialCash: 500000,
  totalCashSales: 228000,
  totalNonCashSales: 0,
  totalDiscounts: 10000,
  totalTransactions: 1,
  status: 'open',
  notes: 'Shift pagi lancar, uang kembalian Rp 500.000 lengkap'
};

export const initialCustomPages: CustomPage[] = [
  {
    id: 'about',
    slug: 'about',
    title: 'Menghubungkan Warisan Budaya Nusantara dengan Kehidupan Modern',
    subtitle: 'Karya Terbaik Pengrajin Nusantara untuk Gaya Hidup Modern — Didirikan untuk melestarikan mahakarya maestro lokal Indonesia dan memberdayakan ratusan perajin daerah di seluruh kepulauan.',
    badge: 'Tentang Nusantara Heritage Store',
    content: `Nusantara Heritage Store berawal dari keprihatinan kami melihat banyaknya mahakarya seni tradisional seperti batik tulis canting, tenun ikat NTT, dan ukiran kayu Jepara yang mulai tersisih oleh produksi massal luar negeri.\n\nKami berkeliling ke desa-desa sentra perajin di Solo, Pekalongan, Yogyakarta, Jepara, hingga Toraja untuk membangun kemitraan perdagangan yang adil (fair trade). Setiap helai kain, setiap seduhan kopi single origin, dan setiap kerajinan kulit di toko ini memiliki cerita manusia, dedikasi, serta doa keberkahan di baliknya.`,
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80',
    sections: [
      {
        title: 'Pemberdayaan Pengrajin Lokal',
        description: 'Bermitra langsung dengan 150+ keluarga perajin batik, penenun, dan petani kopi nusantara tanpa perantara.',
        icon: 'Award'
      },
      {
        title: 'Kualitas Mahakarya Kurasi Ketat',
        description: 'Setiap produk melewati standar kurasi bahan, jahitan rapi, dan keaslian material 100% original.',
        icon: 'ShieldCheck'
      },
      {
        title: 'Kearifan Ekologis Berkelanjutan',
        description: 'Mengutamakan pewarna alami ramah lingkungan dan pengemasan daur ulang bebas plastik sekali pakai.',
        icon: 'Heart'
      }
    ],
    updatedAt: '2026-10-11T12:00:00Z'
  },
  {
    id: 'policies',
    slug: 'policies',
    title: 'Kebijakan Privasi, Garansi & Keamanan Pelanggan',
    subtitle: 'Komitmen kami terhadap transparansi data pribadi, keaslian barang, serta perlindungan hak konsumen.',
    badge: 'Kebijakan & Keamanan Resmi',
    content: `Kami menghargai privasi dan keamanan Anda. Kebijakan ini menjelaskan bagaimana Nusantara Heritage Store melindungi informasi identitas serta menjamin kepuasan belanja Anda baik melalui transaksi online Midtrans maupun pemesanan WhatsApp.`,
    sections: [
      {
        title: 'Kebijakan Privasi & Data Pribadi',
        description: 'Data nama, nomor WhatsApp, email, dan alamat pengiriman hanya digunakan untuk keperluan pemrosesan pesanan, resi pengiriman, dan program loyalty. Kami tidak pernah menjual atau membagikan data kepada pihak ketiga tanpa izin Anda.'
      },
      {
        title: 'Garansi Retur 2x24 Jam (Uang Kembali / Tukar Barang)',
        description: 'Jika barang yang Anda terima cacat produksi, rusak saat pengiriman, atau tidak sesuai spesifikasi ukuran/warna, Anda berhak mengajukan retur gratis dalam 2x24 jam sejak paket diterima menurut riwayat kurir.'
      },
      {
        title: 'Keamanan Transaksi & Enkripsi Pembayaran',
        description: 'Semua transaksi via Midtrans dilindungi enkripsi SSL 256-bit dan sertifikasi PCI-DSS. Kami tidak menyimpan informasi kartu kredit atau PIN pelanggan di server kami.'
      },
      {
        title: 'Ketentuan Pengiriman & Resi RajaOngkir',
        description: 'Pesanan diproses setiap hari kerja Senin - Sabtu. Resi pengiriman resmi RajaOngkir otomatis diperbarui dan dapat dilacak real-time di halaman pelacakan toko.'
      }
    ],
    updatedAt: '2026-10-11T12:00:00Z'
  },
  {
    id: 'contact',
    slug: 'contact',
    title: 'Hubungi Kami & Layanan Pelanggan',
    subtitle: 'Punya pertanyaan seputar produk batik khusus, pesanan grosir/souvenir perusahaan, atau pelacakan pesanan? Tim kami siap melayani Anda.',
    badge: 'Layanan Pelanggan 24/7',
    content: `Kami selalu senang mendengar dari Anda! Silakan hubungi kami melalui formulir pesan di bawah ini atau hubungi saluran WhatsApp CS resmi kami untuk respon secepat kilat.`,
    contactEmail: 'halo@nusantarastore.id',
    contactPhone: '+62 812-3456-7890',
    address: 'Jl. Malioboro No. 88, Sosromenduran, Gedong Tengen, Kota Yogyakarta, D.I. Yogyakarta 55271',
    operatingHours: 'Senin - Minggu: 08:00 - 22:00 WIB (Online CS Fast Response)',
    updatedAt: '2026-10-11T12:00:00Z'
  }
];
