import React, { useState, useEffect } from 'react';
import {
  Product,
  Category,
  WebSettings,
  HomeSection,
  Order,
  CartItem,
  PosShift,
  ActivityLog,
  StaffUser,
  ContactMessage,
  Review,
  Testimonial,
  ProductVariant,
  Expense,
  Promotion,
  LoyaltyReward,
  Customer
} from './types';
import { StorageService } from './services/storage';
import { trackEvent } from './services/pixelTracker';
import { updatePageSeo } from './services/seo';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MarqueeBanner } from './components/layout/MarqueeBanner';

// Storefront Pages
import { HomeHeroSlider } from './components/home/HomeHeroSlider';
import { HomeSections } from './components/home/HomeSections';
import { ProductCatalogPage } from './components/products/ProductCatalogPage';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderTrackingPage } from './components/tracking/OrderTrackingPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { PromotionsPage } from './components/pages/PromotionsPage';
import { PoliciesPage } from './components/pages/PoliciesPage';

// Customer Suite
import { CustomerAuthModal } from './components/customer/CustomerAuthModal';

// Admin Suite
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { PhpSourceViewer } from './components/admin/PhpSourceViewer';

export function App() {
  // App state from persistent StorageService
  const [settings, setSettings] = useState<WebSettings>(() => StorageService.getSettings());
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [categories, setCategories] = useState<Category[]>(() => StorageService.getCategories());
  const [homeSections, setHomeSections] = useState<HomeSection[]>(() => StorageService.getHomeSections());
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [cart, setCart] = useState<CartItem[]>(() => StorageService.getCart());
  const [posShift, setPosShift] = useState<PosShift>(() => StorageService.getShift());
  const [logs, setLogs] = useState<ActivityLog[]>(() => StorageService.getLogs());
  const [staff, setStaff] = useState<StaffUser[]>(() => StorageService.getStaff());
  const [inbox, setInbox] = useState<ContactMessage[]>(() => StorageService.getInbox());
  const [reviews, setReviews] = useState<Review[]>(() => StorageService.getReviews());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => StorageService.getTestimonials());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => StorageService.isAdminLoggedIn());

  // New modules states
  const [expenses, setExpenses] = useState<Expense[]>(() => StorageService.getExpenses());
  const [promotions, setPromotions] = useState<Promotion[]>(() => StorageService.getPromotions());
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>(() => StorageService.getLoyaltyRewards());
  const [customers, setCustomers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => StorageService.getLoggedInCustomer());

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<any>({});

  // Modals & Drawers State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);

  // Checkout state
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutPromoCode, setCheckoutPromoCode] = useState('');

  // Toast alert state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const refreshAllState = () => {
    setSettings(StorageService.getSettings());
    setProducts(StorageService.getProducts());
    setCategories(StorageService.getCategories());
    setHomeSections(StorageService.getHomeSections());
    setOrders(StorageService.getOrders());
    setCart(StorageService.getCart());
    setPosShift(StorageService.getShift());
    setLogs(StorageService.getLogs());
    setStaff(StorageService.getStaff());
    setInbox(StorageService.getInbox());
    setReviews(StorageService.getReviews());
    setTestimonials(StorageService.getTestimonials());
    setIsAdminLoggedIn(StorageService.isAdminLoggedIn());
    setExpenses(StorageService.getExpenses());
    setPromotions(StorageService.getPromotions());
    setLoyaltyRewards(StorageService.getLoyaltyRewards());
    setCustomers(StorageService.getCustomers());
    setCurrentCustomer(StorageService.getLoggedInCustomer());
  };

  // Sync brand CSS variables on mount & settings change
  useEffect(() => {
    document.documentElement.style.setProperty('--brand-primary', settings.primaryColor);
    document.documentElement.style.setProperty('--brand-primary-hover', settings.primaryHoverColor);
    document.documentElement.style.setProperty('--brand-secondary', settings.secondaryColor);
    document.documentElement.style.setProperty('--brand-accent', settings.accentColor);
    document.documentElement.style.setProperty('--brand-focus', settings.focusRingColor);
  }, [settings]);

  // Dynamic SEO meta tag & JSON-LD schema update
  useEffect(() => {
    let title: string | undefined = undefined;
    let desc: string | undefined = undefined;

    switch (currentView) {
      case 'products':
        title = 'Katalog Koleksi Produk Lengkap';
        desc = `Jelajahi seluruh koleksi produk pilihan di ${settings.storeName}.`;
        break;
      case 'promo':
        title = 'Voucher Promo & Program Loyalty Member';
        desc = `Klaim kode kupon diskon hemat dan kumpulkan stempel kalender loyalty di ${settings.storeName}.`;
        break;
      case 'tracking':
        title = 'Lacak Resi Pengiriman RajaOngkir';
        desc = `Lacak perjalanan paket pesanan Anda secara real-time melalui ekspedisi JNE, J&T, SiCepat di ${settings.storeName}.`;
        break;
      case 'about':
        title = 'Tentang Kami & Cerita Pengrajin';
        break;
      case 'contact':
        title = 'Hubungi Kami & Layanan Pelanggan';
        break;
      case 'policies':
        title = 'Syarat, Ketentuan & Kebijakan Garansi';
        break;
      case 'checkout':
        title = 'Checkout Pembayaran Aman';
        break;
      default:
        title = undefined;
    }

    updatePageSeo(settings, title, desc, undefined, selectedProduct || undefined);
  }, [currentView, settings, selectedProduct]);

  // Handle navigation
  const handleNavigate = (view: string, params: any = {}) => {
    setCurrentView(view);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    trackEvent('PageView', {
      page: view,
      ...params
    });
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const price = variant ? (variant.promoPrice || variant.price) : (product.promoPrice || product.price);
    const updatedCart = [...cart];

    const existingIndex = updatedCart.findIndex(
      (item) => item.productId === product.id && item.variantName === variant?.name
    );

    if (existingIndex >= 0) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({
        productId: product.id,
        productName: product.name,
        variantId: variant?.id,
        variantName: variant?.name,
        price,
        quantity,
        weightGrams: product.weightGrams,
        image: product.images[0] || ''
      });
    }

    setCart(updatedCart);
    StorageService.saveCart(updatedCart);
    showToast(`✓ "${product.name}" ditambahkan ke keranjang`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (productId: string, variantName: string | undefined, qty: number) => {
    let updatedCart = [...cart];
    if (qty <= 0) {
      updatedCart = updatedCart.filter(
        (i) => !(i.productId === productId && i.variantName === variantName)
      );
    } else {
      updatedCart = updatedCart.map((i) =>
        i.productId === productId && i.variantName === variantName ? { ...i, quantity: qty } : i
      );
    }
    setCart(updatedCart);
    StorageService.saveCart(updatedCart);
  };

  const handleRemoveCartItem = (productId: string, variantName: string | undefined) => {
    const updated = cart.filter(
      (i) => !(i.productId === productId && i.variantName === variantName)
    );
    setCart(updated);
    StorageService.saveCart(updated);
  };

  const handleProceedToCheckout = (discount: number, promo: string) => {
    setCheckoutDiscount(discount);
    setCheckoutPromoCode(promo);
    setIsCartOpen(false);
    handleNavigate('checkout');
  };

  const handleDirectBuyNow = (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    handleAddToCart(product, variant, quantity);
    setSelectedProduct(null);
    handleNavigate('checkout');
  };

  const sliderSection = homeSections.find((s) => s.type === 'slider' && s.isActive);
  const marqueeSection = homeSections.find((s) => s.type === 'marquee' && s.isActive);

  // If view is 'admin', render Admin Suite
  if (currentView === 'admin') {
    if (!isAdminLoggedIn) {
      return (
        <AdminLogin
          onSuccess={() => {
            setIsAdminLoggedIn(true);
            refreshAllState();
          }}
          onBackToStore={() => handleNavigate('home')}
        />
      );
    }

    return (
      <AdminLayout
        settings={settings}
        orders={orders}
        products={products}
        categories={categories}
        homeSections={homeSections}
        posShift={posShift}
        logs={logs}
        staff={staff}
        inbox={inbox}
        reviews={reviews}
        expenses={expenses}
        promotions={promotions}
        loyaltyRewards={loyaltyRewards}
        customers={customers}
        onBackToStore={() => handleNavigate('home')}
        onRefreshAll={refreshAllState}
        onLogout={() => {
          StorageService.setAdminLoggedIn(false);
          setIsAdminLoggedIn(false);
          handleNavigate('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold py-3 px-5 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Marquee Info Promo (Controllable from Admin) */}
      <MarqueeBanner section={marqueeSection} settings={settings} />

      {/* Storefront Navigation */}
      <Navbar
        settings={settings}
        cart={cart}
        currentCustomer={currentCustomer}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCodeViewer={() => setIsCodeModalOpen(true)}
        onOpenCustomerAuth={() => setIsCustomerAuthOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div>
            {sliderSection && (
              <HomeHeroSlider
                section={sliderSection}
                settings={settings}
                onNavigate={handleNavigate}
              />
            )}

            <HomeSections
              sections={homeSections}
              products={products}
              categories={categories}
              testimonials={testimonials}
              settings={settings}
              onSelectProduct={(p) => setSelectedProduct(p)}
              onQuickAddToCart={(p) => handleAddToCart(p, p.variants?.[0], 1)}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {currentView === 'products' && (
          <ProductCatalogPage
            products={products}
            categories={categories}
            settings={settings}
            initialCategory={routeParams.category}
            initialSearch={routeParams.search}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onQuickAddToCart={(p) => handleAddToCart(p, p.variants?.[0], 1)}
          />
        )}

        {currentView === 'promo' && (
          <PromotionsPage
            promotions={promotions}
            loyaltyRewards={loyaltyRewards}
            currentCustomer={currentCustomer}
            onOpenAuth={() => setIsCustomerAuthOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'policies' && (
          <PoliciesPage />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            cart={cart}
            settings={settings}
            appliedDiscount={checkoutDiscount}
            promoCode={checkoutPromoCode}
            onClearCart={() => {
              setCart([]);
              StorageService.clearCart();
            }}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'tracking' && (
          <OrderTrackingPage
            initialOrderId={routeParams.orderId}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && (
          <AboutPage settings={settings} onNavigate={handleNavigate} />
        )}

        {currentView === 'contact' && (
          <ContactPage settings={settings} />
        )}
      </main>

      {/* Storefront Footer */}
      <Footer settings={settings} onNavigate={handleNavigate} />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          settings={settings}
          reviews={reviews}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, v, q) => {
            handleAddToCart(p, v, q);
            setSelectedProduct(null);
          }}
          onBuyNow={handleDirectBuyNow}
          onAddReview={(rev) => {
            StorageService.addReview(rev);
            setReviews(StorageService.getReviews());
            showToast('✓ Ulasan berhasil ditambahkan!');
          }}
          onSelectRelatedProduct={(rel) => setSelectedProduct(rel)}
          allProducts={products}
        />
      )}

      {/* Cart Drawer (only active in Midtrans mode) */}
      <CartDrawer
        isOpen={isCartOpen && settings.paymentMode === 'midtrans'}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        settings={settings}
        onUpdateQuantity={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Customer Login / Register / Loyalty Modal */}
      <CustomerAuthModal
        isOpen={isCustomerAuthOpen}
        onClose={() => setIsCustomerAuthOpen(false)}
        currentCustomer={currentCustomer}
        onCustomerChange={(cust) => {
          setCurrentCustomer(cust);
          refreshAllState();
        }}
        loyaltyRewards={loyaltyRewards}
        orders={orders}
      />

      {/* PHP Source Code & Architecture Modal */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-extrabold text-sm tracking-tight">
                Arsitektur & Kode PHP 8.1+ Native MVC & MySQL Prepared
              </span>
              <button
                onClick={() => setIsCodeModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <PhpSourceViewer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
