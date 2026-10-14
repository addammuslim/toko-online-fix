import React, { useState } from 'react';
import { WebSettings, CartItem, Customer } from '../../types';
import { StorageService } from '../../services/storage';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  ShieldCheck,
  Truck,
  PhoneCall,
  Sparkles,
  Code2,
  Tag,
  User,
  ShieldAlert,
  ChevronDown,
  Package,
  Award
} from 'lucide-react';

interface Props {
  settings: WebSettings;
  cart: CartItem[];
  currentCustomer: Customer | null;
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onOpenCart: () => void;
  onOpenCodeViewer: () => void;
  onOpenCustomerAuth: () => void;
}

export const Navbar: React.FC<Props> = ({
  settings,
  cart,
  currentCustomer,
  currentView,
  onNavigate,
  onOpenCart,
  onOpenCodeViewer,
  onOpenCustomerAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = StorageService.getCategories();
  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isMidtransMode = settings.paymentMode === 'midtrans';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('products', { search: searchQuery.trim() });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top utility bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp CS: <strong className="text-white">+{settings.whatsappNumber}</strong>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              Kirim ke Seluruh Indonesia (JNE, J&T, SiCepat)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 border border-slate-700">
              <span
                className={`w-2 h-2 rounded-full ${
                  isMidtransMode ? 'bg-blue-400 animate-pulse' : 'bg-emerald-400 animate-pulse'
                }`}
              ></span>
              Mode: <strong className="text-white uppercase ml-0.5">{settings.paymentMode}</strong>
            </span>

            <button
              onClick={onOpenCodeViewer}
              className="text-slate-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition border border-slate-700"
              title="Lihat Arsitektur & Source Code PHP Native MVC"
            >
              <Code2 className="w-3 h-3 text-emerald-400" />
              <span>PHP MVC Code</span>
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 hover:underline"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin & POS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Name (Configurable from Admin: icon_text, image_only, text_only) */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            {settings.logoType === 'image_only' && settings.logoImageUrl ? (
              <img
                src={settings.logoImageUrl}
                alt={settings.storeName}
                className="h-10 w-auto object-contain"
              />
            ) : settings.logoType === 'text_only' ? (
              <div>
                <span className="font-black text-xl text-slate-900 tracking-tight block leading-tight">
                  {settings.storeName}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                  {settings.tagline}
                </span>
              </div>
            ) : (
              // Default: icon_text
              <>
                <div
                  style={{ backgroundColor: settings.primaryColor }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition"
                >
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight block leading-tight">
                    {settings.storeName}
                  </span>
                  <span className="text-[11px] text-slate-500 hidden sm:block line-clamp-1">
                    {settings.tagline}
                  </span>
                </div>
              </>
            )}
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
            <button
              onClick={() => onNavigate('home')}
              className={`transition hover:text-emerald-600 ${
                currentView === 'home' ? 'text-emerald-600 font-extrabold' : ''
              }`}
            >
              Beranda
            </button>

            {/* Menu Produk with Dynamic Category Dropdown */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setProductsDropdownOpen(true)}
              onMouseLeave={() => setProductsDropdownOpen(false)}
            >
              <button
                onClick={() => onNavigate('products')}
                className={`transition hover:text-emerald-600 flex items-center gap-1.5 ${
                  currentView === 'products' ? 'text-emerald-600 font-extrabold' : ''
                }`}
              >
                <Package className="w-4 h-4 text-emerald-600" />
                <span>Katalog Produk</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-emerald-100 text-emerald-800 font-extrabold uppercase">
                  {categories.length} Kategori
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
              </button>

              {/* Dynamic Dropdown Menu */}
              {productsDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2.5 z-50 animate-fadeIn space-y-1">
                  <button
                    onClick={() => {
                      onNavigate('products');
                      setProductsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-800"
                  >
                    <span>Semua Koleksi Produk</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono">ALL</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onNavigate('products', { category: cat.id });
                        setProductsDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-xs font-medium text-slate-700"
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">→</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('promo')}
              className={`transition hover:text-emerald-600 flex items-center gap-1.5 ${
                currentView === 'promo' ? 'text-emerald-600 font-extrabold' : ''
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-amber-500" />
              <span>Promo & Kupon</span>
            </button>

            <button
              onClick={onOpenCustomerAuth}
              className="transition hover:text-emerald-600 flex items-center gap-1.5"
              title="Cek Kalender Kotak Cap Loyalty Member"
            >
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>Program Loyalty</span>
            </button>

            <button
              onClick={() => onNavigate('tracking')}
              className={`transition hover:text-emerald-600 flex items-center gap-1.5 ${
                currentView === 'tracking' ? 'text-emerald-600 font-extrabold' : ''
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Lacak Resi RajaOngkir</span>
            </button>
          </nav>

          {/* Search bar & Actions */}
          <div className="flex items-center gap-2.5">
            <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center relative">
              <input
                type="text"
                placeholder="Cari batik, kopi, dompet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 pl-9 pr-3 py-1.5 text-xs rounded-full border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            </form>

            {/* Customer Account Button (Login / Register / Profile) */}
            <button
              onClick={onOpenCustomerAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
              title="Akun Member & Loyalty Reward"
            >
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">
                {currentCustomer ? currentCustomer.name.split(' ')[0] : 'Akun'}
              </span>
            </button>

            {/* CART ICON: ONLY SHOWN IF MIDTRANS MODE */}
            {isMidtransMode && (
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-xl text-slate-700 hover:text-emerald-600 hover:bg-slate-100 transition"
                title="Lihat Keranjang Belanja"
                aria-label="Keranjang Belanja"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartTotalCount > 0 && (
                  <span
                    style={{ backgroundColor: settings.primaryColor }}
                    className="absolute -top-1 -right-1 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs"
                  >
                    {cartTotalCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-slate-200 space-y-3 pb-2 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-slate-50"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            </form>

            <div className="flex flex-col space-y-1.5 text-xs font-semibold">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 font-bold text-slate-800"
              >
                Beranda
              </button>

              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <button
                  onClick={() => {
                    onNavigate('products');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white font-extrabold text-emerald-800 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Katalog Semua Produk</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded font-mono">ALL</span>
                </button>
                <div className="pl-6 space-y-1 text-slate-600">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onNavigate('products', { category: cat.id });
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-1 hover:text-emerald-700 block text-xs"
                    >
                      • {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onNavigate('promo');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-amber-700 flex items-center gap-2 font-bold"
              >
                <Tag className="w-4 h-4 text-amber-500" />
                <span>Kupon Promo & Diskon</span>
              </button>

              <button
                onClick={() => {
                  onOpenCustomerAuth();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-purple-700 flex items-center gap-2 font-bold"
              >
                <Award className="w-4 h-4 text-purple-600" />
                <span>Program Loyalty (Kartu Cap Kalender)</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('tracking');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-emerald-700 flex items-center gap-2 font-bold"
              >
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Lacak Resi RajaOngkir</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
