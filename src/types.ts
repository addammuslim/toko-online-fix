export type PaymentMode = 'midtrans' | 'whatsapp';

export type OrderStatus =
  | 'Pending'
  | 'Dibayar'
  | 'Diproses'
  | 'Dikirim'
  | 'Selesai'
  | 'Dibatalkan'
  | 'Gagal'
  | 'WA Inquiry';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  promoPrice?: number;
  stock: number;
  sku: string;
  barcode?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  shortDescription?: string;
  price: number;
  cogsPrice?: number; // Harga Pokok Penjualan (HPP / Biaya Beli Modal)
  promoPrice?: number;
  stock: number;
  weightGrams: number;
  sku: string;
  barcode?: string;
  images: string[];
  variants: ProductVariant[];
  isBestSeller: boolean;
  isPromo: boolean;
  isSelected: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  price: number;
  quantity: number;
  weightGrams: number;
  image: string;
}

export interface OrderTimeline {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  actor?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  variantName?: string;
  price: number;
  cogsPrice?: number; // HPP per item
  quantity: number;
  subtotal: number;
  image: string;
}

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  province: string;
  city: string;
  subdistrict: string;
  postalCode: string;
  courier: string;
  trackingNumber?: string;
  shippingCost: number;
  subtotal: number;
  discount: number;
  promoCode?: string;
  totalAmount: number;
  paymentMode: PaymentMode;
  paymentMethod: string;
  paymentStatus: 'unpaid' | 'paid' | 'expired' | 'refunded';
  orderStatus: OrderStatus;
  source: 'Online' | 'POS' | 'WhatsApp';
  items: OrderItem[];
  timelines: OrderTimeline[];
  notes?: string;
  cashierName?: string;
  amountPaid?: number;
  changeDue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourierOption {
  code: string;
  name: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export type ExpenseCategory =
  | 'iklan'
  | 'pembelian_stok'
  | 'operasional'
  | 'gaji'
  | 'utilitas'
  | 'lainnya';

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  paymentSource: string; // "Rekening BCA", "Kasir Kas", "Kartu Kredit"
  notes?: string;
  receiptNumber?: string;
  receiptImage?: string;
  createdAt: string;
}

export type PromoType = 'percentage' | 'fixed' | 'free_shipping' | 'subsidy_shipping';

export interface Promotion {
  id: string;
  code: string;
  title: string;
  description: string;
  type: PromoType;
  value: number; // percentage (e.g. 15 for 15%) or nominal (e.g. 25000)
  minOrderAmount: number; // 0 for no minimum
  maxDiscountAmount?: number; // cap for percentage discounts
  isForNewMembersOnly: boolean;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  termsAndConditions: string[];
  isActive: boolean;
}

export interface LoyaltyReward {
  id: string;
  orderMilestone: number; // e.g. 1, 2, 3, 5, 7, 10, 14, 20
  title: string;
  rewardDescription: string;
  rewardType: 'discount_percent' | 'free_item' | 'fixed_cashback' | 'free_shipping';
  discountPercent?: number;
  rewardItemName?: string;
  cashbackAmount?: number;
  icon?: string;
  badgeColor?: string;
  isActive?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  isGoogleAccount?: boolean;
  address?: string;
  province?: string;
  city?: string;
  subdistrict?: string;
  postalCode?: string;
  orderCount: number;
  totalSpent: number;
  loyaltyPoints: number;
  claimedRewards: string[]; // IDs of claimed rewards
  createdAt: string;
}

export interface WebSettings {
  storeName: string;
  tagline: string;
  logoType: 'icon_text' | 'image_only' | 'text_only';
  logoImageUrl: string;
  faviconUrl: string;
  primaryColor: string;
  primaryHoverColor: string;
  secondaryColor: string;
  accentColor: string;
  focusRingColor: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  paymentMode: PaymentMode;
  waGreetingTemplate: string;
  autoSendOrderWA: boolean;
  autoSendOrderEmail: boolean;
  autoSendStatusWA: boolean;
  midtransServerKey: string;
  midtransClientKey: string;
  midtransIsProduction: boolean;
  shippingProvider: 'rajaongkir' | 'biteship' | 'custom';
  shippingApiKey: string;
  originProvince: string;
  originCity: string;
  originSubdistrict: string;
  originPostalCode: string;
  defaultWeightGrams: number;
  freeShippingMinSpend: number;
  enableFreeShipping: boolean;
  flatRateShipping: number;
  enableFlatRate: boolean;
  activeCouriers: string[];
  // RajaOngkir Specific Config
  rajaongkirApiKey?: string;
  rajaongkirAccountType?: 'starter' | 'basic' | 'pro';
  rajaongkirOriginId?: string;
  // WhatsApp Automation Providers
  waProvider?: 'woowa' | 'wanotif' | 'fonnte' | 'wablas' | 'whacenter' | 'starsender' | 'twilio' | 'custom';
  waApiKey?: string;
  waSenderNumber?: string;
  autoSendStatusChangeWA?: boolean;
  autoSendFollowUpWA?: boolean;
  autoSendLoyaltyRewardWA?: boolean;
  waCustomWebhookUrl?: string;
  // Email Automation Providers
  emailProvider?: 'smtp' | 'resend' | 'sendgrid' | 'mailgun';
  emailSenderName?: string;
  emailSenderAddress?: string;
  emailApiKey?: string;
  // Visual Theme & Slider Presets
  sliderStyle?: 'modern_split' | 'cinematic_overlay' | 'minimal_clean' | 'glass_card';
  designTheme?: 'modern_elegance' | 'nordic_minimal' | 'vibrant_commerce' | 'earthy_artisan';
  cardStyle?: 'rounded_soft' | 'minimal_border' | 'elevated';
  // Pixel & Tracking
  fbPixelId: string;
  tiktokPixelId: string;
  gaMeasurementId: string;
  customHeadScript: string;
  customBodyScript: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

export interface HomeSection {
  id: string;
  type:
    | 'slider'
    | 'marquee'
    | 'about_brand'
    | 'products_grid'
    | 'story'
    | 'experience'
    | 'testimonials'
    | 'cta';
  title: string;
  subtitle?: string;
  order: number;
  isActive: boolean;
  config: {
    source?: 'terlaris' | 'promo' | 'random' | 'selected';
    selectedProductIds?: string[];
    limit?: number;
    text?: string;
    speed?: number;
    bgColor?: string;
    textColor?: string;
    linkUrl?: string;
    slides?: Array<{
      id: string;
      image: string;
      title: string;
      subtitle: string;
      btnText: string;
      btnLink: string;
    }>;
    sliderStyle?: 'modern_split' | 'cinematic_overlay' | 'minimal_clean' | 'glass_card';
    gridStyle?: 'grid_4_col' | 'grid_3_col' | 'compact_list' | 'carousel_scroll';
    marqueeStyle?: 'ticker_tape' | 'badge_pill' | 'bold_strip';
    storyStyle?: 'split_dark' | 'magazine_light' | 'minimalist_center';
    testimonialStyle?: 'grid_cards' | 'carousel_slider' | 'modern_quotes';
    experienceStyle?: 'grid_cards_4' | 'horizontal_features' | 'compact_pills';
    ctaStyle?: 'gradient_emerald' | 'dark_luxury' | 'bordered_minimal';
    btnText?: string;
    btnLink?: string;
    layoutStyle?: string;
    content?: string;
    image?: string;
    badge?: string;
  };
}

export interface PosShift {
  id: string;
  cashierId: string;
  cashierName: string;
  openedAt: string;
  closedAt?: string;
  initialCash: number;
  totalCashSales: number;
  totalNonCashSales: number;
  totalDiscounts: number;
  totalTransactions: number;
  status: 'open' | 'closed';
  notes?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  userEmail?: string;
  rating: number;
  comment: string;
  createdAt: string;
  isApproved: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  featured: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'replied';
  replyNotes?: string;
}

export interface ActivityLog {
  id: string;
  event: string;
  category:
    | 'page_view'
    | 'product_view'
    | 'cart'
    | 'checkout'
    | 'payment'
    | 'whatsapp'
    | 'admin_action'
    | 'auth';
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userId?: string;
  createdAt: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin' | 'cashier' | 'staff';
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
}

export interface CustomPageSection {
  title: string;
  description: string;
  icon?: string;
}

export interface CustomPage {
  id: string; // 'about' | 'policies' | 'terms' | 'contact'
  slug: string;
  title: string;
  subtitle: string;
  badge?: string;
  content: string;
  imageUrl?: string;
  sections?: CustomPageSection[];
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  operatingHours?: string;
  updatedAt: string;
}
