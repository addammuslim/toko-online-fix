import React, { useState, useRef } from 'react';
import {
  Product,
  ProductVariant,
  Order,
  PosShift,
  CartItem,
  WebSettings,
  Customer,
  LoyaltyReward,
  Promotion
} from '../../types';
import { StorageService } from '../../services/storage';
import { LoyaltyStampGrid } from '../loyalty/LoyaltyStampGrid';
import {
  Search,
  Barcode,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  DollarSign,
  Printer,
  Sparkles,
  Award,
  User,
  CheckCircle2,
  X,
  Clock,
  Check,
  UserPlus,
  Tag,
  Percent,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  products: Product[];
  settings: WebSettings;
  posShift: PosShift;
  customers: Customer[];
  loyaltyRewards: LoyaltyReward[];
  promotions?: Promotion[];
  onRefreshOrders: () => void;
}

export const AdminPos: React.FC<Props> = ({
  products,
  settings,
  posShift,
  customers: initialCustomers,
  loyaltyRewards,
  promotions = [],
  onRefreshOrders
}) => {
  const [customersList, setCustomersList] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');

  // Customer Loyalty selection
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // New Member Modal State
  const [isNewMemberModalOpen, setIsNewMemberModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');

  // Promo code & discount
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  // Stamp Card Modal State
  const [isStampModalOpen, setIsStampModalOpen] = useState(false);

  // Payment Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qris' | 'edc'>('cash');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Variant selector modal for POS
  const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const filteredProducts = products.filter((p) => {
    if (!p.isActive) return false;
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const subtotal = posCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Calculate Loyalty perks if customer is selected
  const customerPastOrdersCount = selectedCustomer ? selectedCustomer.orderCount : 0;
  const nextOrderNumber = customerPastOrdersCount + 1;
  const activeMilestone = loyaltyRewards.find((r) => r.orderMilestone === nextOrderNumber);
  const loyaltyDiscount = selectedCustomer && activeMilestone && activeMilestone.discountPercent
    ? Math.round((subtotal * activeMilestone.discountPercent) / 100)
    : 0;

  // Promo discount calculation
  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.minOrderAmount && subtotal < appliedPromo.minOrderAmount) {
      promoDiscount = 0;
    } else if (appliedPromo.type === 'percentage') {
      const calc = Math.round((subtotal * appliedPromo.value) / 100);
      promoDiscount = appliedPromo.maxDiscountAmount ? Math.min(calc, appliedPromo.maxDiscountAmount) : calc;
    } else if (appliedPromo.type === 'fixed') {
      promoDiscount = Math.min(subtotal, appliedPromo.value);
    } else {
      promoDiscount = Math.min(subtotal, appliedPromo.value);
    }
  }

  const totalDiscount = loyaltyDiscount + promoDiscount;
  const totalPayable = Math.max(0, subtotal - totalDiscount);
  const changeDue = Math.max(0, cashTendered - totalPayable);

  const handleApplyPromo = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    const found = promotions.find((p) => p.code.toUpperCase() === trimmed && p.isActive);
    if (!found) {
      setPromoMessage({ text: `Kode voucher "${trimmed}" tidak valid atau sudah kadaluarsa!`, isError: true });
      return;
    }

    if (found.minOrderAmount && subtotal < found.minOrderAmount) {
      setPromoMessage({
        text: `Minimal belanja untuk kode "${found.code}" adalah ${formatIDR(found.minOrderAmount)}.`,
        isError: true
      });
      return;
    }

    setAppliedPromo(found);
    setPromoMessage({ text: `✓ Promo ${found.code} (${found.title}) berhasil diterapkan!`, isError: false });
    setIsPromoModalOpen(false);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoMessage(null);
  };

  const handleCreateNewCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: newCustName.trim(),
      username: newCustName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.floor(100 + Math.random() * 900),
      email: newCustEmail.trim() || `${newCustPhone.trim()}@member.store`,
      phone: newCustPhone.trim(),
      address: newCustAddress.trim() || 'Pembelian Langsung di Toko',
      orderCount: 0,
      totalSpent: 0,
      loyaltyPoints: 50, // Poin sambutan member baru
      claimedRewards: [],
      createdAt: new Date().toISOString()
    };

    StorageService.addCustomer(newCust);
    setCustomersList((prev) => [newCust, ...prev]);
    setSelectedCustomer(newCust);
    setIsNewMemberModalOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustAddress('');

    StorageService.addLog(
      'customer_registered_pos',
      'auth',
      `Member baru "${newCust.name}" didaftarkan langsung melalui Moka POS Kasir`
    );
  };

  const handleAddToCart = (product: Product, variant?: ProductVariant) => {
    const price = variant ? (variant.promoPrice || variant.price) : (product.promoPrice || product.price);
    const existingIndex = posCart.findIndex(
      (item) => item.productId === product.id && item.variantName === variant?.name
    );

    let updated = [...posCart];
    if (existingIndex >= 0) {
      updated[existingIndex].quantity += 1;
    } else {
      updated.push({
        productId: product.id,
        productName: product.name,
        variantId: variant?.id,
        variantName: variant?.name,
        price,
        quantity: 1,
        weightGrams: product.weightGrams,
        image: product.images[0] || ''
      });
    }

    setPosCart(updated);
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = barcodeInput.trim();
    if (!code) return;

    const found = products.find(
      (p) => p.sku.toLowerCase() === code.toLowerCase() || p.barcode === code
    );

    if (found) {
      if (found.variants && found.variants.length > 1) {
        setVariantModalProduct(found);
      } else {
        handleAddToCart(found, found.variants[0]);
      }
      setBarcodeInput('');
    } else {
      alert(`Produk dengan SKU / Barcode "${code}" tidak ditemukan!`);
    }
  };

  const handleOpenPay = () => {
    if (posCart.length === 0) return;
    setCashTendered(totalPayable);
    setIsPayModalOpen(true);
  };

  const handleProcessTransaction = () => {
    if (paymentMethod === 'cash' && cashTendered < totalPayable) {
      alert('Uang tunai yang diterima kurang dari total belanja!');
      return;
    }

    const orderId = `POS-${Date.now().toString().slice(-6)}-${Math.floor(10 + Math.random() * 90)}`;

    const newOrder: Order = {
      id: orderId,
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Pelanggan Kasir Walk-In',
      customerPhone: selectedCustomer ? selectedCustomer.phone : '080000000000',
      address: 'Transaksi Langsung di Kasir (Offline POS Store)',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      subdistrict: 'Senopati Store',
      postalCode: '12190',
      courier: 'Ambil di Toko (POS Kasir)',
      shippingCost: 0,
      subtotal,
      discount: totalDiscount,
      promoCode: appliedPromo?.code || (activeMilestone ? `LOYALTY-${activeMilestone.orderMilestone}` : undefined),
      totalAmount: totalPayable,
      paymentMode: 'midtrans',
      paymentMethod:
        paymentMethod === 'cash'
          ? 'Tunai (Cash Kasir)'
          : paymentMethod === 'qris'
          ? 'QRIS Statis Kasir'
          : 'Mesin EDC BCA / Mandiri',
      paymentStatus: 'paid',
      orderStatus: 'Selesai',
      source: 'POS',
      items: posCart.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        variantName: i.variantName,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity,
        image: i.image
      })),
      timelines: [
        {
          status: 'Selesai',
          title: 'Transaksi Kasir POS Berhasil',
          description: `Kasir: ${posShift.cashierName || 'Staff Kasir'}. Pembayaran ${formatIDR(totalPayable)} selesai.`,
          timestamp: new Date().toISOString(),
          actor: posShift.cashierName || 'Kasir'
        }
      ],
      cashierName: posShift.cashierName || 'Kasir Utama',
      amountPaid: paymentMethod === 'cash' ? cashTendered : totalPayable,
      changeDue: paymentMethod === 'cash' ? changeDue : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save order
    StorageService.addOrder(newOrder);

    // Update customer stats if selected
    if (selectedCustomer) {
      const updatedCust = {
        ...selectedCustomer,
        orderCount: selectedCustomer.orderCount + 1,
        totalSpent: selectedCustomer.totalSpent + totalPayable,
        loyaltyPoints: selectedCustomer.loyaltyPoints + Math.floor(totalPayable / 10000)
      };
      StorageService.updateCustomer(updatedCust);
    }

    setCompletedOrder(newOrder);
    setIsPayModalOpen(false);
    setPosCart([]);
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoMessage(null);
    onRefreshOrders();

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Shift Info Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold">Moka POS Offline Ready</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">
            Kasir: <strong className="text-white">{posShift.cashierName || 'Admin Utama'}</strong>
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">
            Modal Awal Kas: <strong className="text-white">{formatIDR(posShift.initialCash || 500000)}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section: Catalog & Barcode Scanner */}
        <div className="lg:col-span-7 space-y-4">
          {/* Barcode & Search toolbar */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleBarcodeSubmit} className="relative flex-1">
              <Barcode className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Scan Barcode / Tekan Enter SKU..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono outline-none focus:bg-white focus:border-emerald-500"
              />
            </form>

            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  if (p.variants && p.variants.length > 1) {
                    setVariantModalProduct(p);
                  } else {
                    handleAddToCart(p, p.variants[0]);
                  }
                }}
                className="group p-3 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{p.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-black text-xs text-emerald-700">
                    {formatIDR(p.promoPrice || p.price)}
                  </span>
                  <span className="text-[10px] text-slate-400">Stok: {p.stock}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section: Kasir Cart & Loyalty & Payment */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Keranjang Kasir ({posCart.reduce((a, b) => a + b.quantity, 0)})</span>
              </span>
              {posCart.length > 0 && (
                <button
                  onClick={() => setPosCart([])}
                  className="text-xs font-bold text-red-500 hover:underline"
                >
                  Kosongkan
                </button>
              )}
            </h3>

            {/* Customer Loyalty Selector */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pelanggan / Member:</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewMemberModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold shadow-xs transition"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>+ Member Baru</span>
                  </button>
                  {selectedCustomer && (
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(null)}
                      className="text-red-500 text-[10px] hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <select
                value={selectedCustomer?.id || ''}
                onChange={(e) => {
                  const cust = customersList.find((c) => c.id === e.target.value) || null;
                  setSelectedCustomer(cust);
                }}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="">-- Pembeli Umum (Non-Member) --</option>
                {customersList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - {c.orderCount}x Belanja
                  </option>
                ))}
              </select>

              {/* Loyalty Milestone Banner */}
              {selectedCustomer && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Member: {selectedCustomer.name} (Pesanan ke-{nextOrderNumber})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsStampModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-extrabold flex items-center gap-1 transition shadow-xs"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Lihat Matriks Stempel ({selectedCustomer.orderCount} Cap)</span>
                    </button>
                  </div>
                  {activeMilestone ? (
                    <p className="text-[11px] text-amber-800 font-bold">
                      🎉 Berhak Reward Milestone {activeMilestone.orderMilestone}: {activeMilestone.title} ({activeMilestone.rewardDescription})!
                    </p>
                  ) : (
                    <p className="text-[10px] text-amber-700">
                      Total Poin: {selectedCustomer.loyaltyPoints} poin. Belanja lagi untuk reward berikutnya!
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Promo & Voucher Box */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kupon & Diskon Promo POS:</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(true)}
                  className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Percent className="w-3 h-3" />
                  <span>Pilih Promo ({promotions.filter(p => p.isActive).length})</span>
                </button>
              </div>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-300 text-[11px]">
                      {appliedPromo.code}
                    </span>
                    <span className="text-emerald-800 font-semibold truncate text-[11px]">
                      {appliedPromo.title} (-{formatIDR(promoDiscount)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 transition"
                    title="Batalkan Promo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Masukkan kode promo (contoh: WELCOME10)..."
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs uppercase font-mono tracking-wider outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromo(promoCodeInput)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition"
                  >
                    Terapkan
                  </button>
                </div>
              )}

              {promoMessage && (
                <p className={`text-[10px] font-semibold ${promoMessage.isError ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {posCart.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400 space-y-1">
                  <p>Keranjang kasir masih kosong.</p>
                  <p className="text-[11px]">Pilih produk di samping atau scan barcode.</p>
                </div>
              ) : (
                posCart.map((item, idx) => (
                  <div
                    key={`${item.productId}-${item.variantName}-${idx}`}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-slate-900 truncate">{item.productName}</h5>
                      <div className="text-[10px] text-slate-500">
                        {item.variantName ? `${item.variantName} • ` : ''}
                        {formatIDR(item.price)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              setPosCart(posCart.filter((_, i) => i !== idx));
                            } else {
                              const updated = [...posCart];
                              updated[idx].quantity -= 1;
                              setPosCart(updated);
                            }
                          }}
                          className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => {
                            const updated = [...posCart];
                            updated[idx].quantity += 1;
                            setPosCart(updated);
                          }}
                          className="p-1 text-slate-500 hover:bg-slate-100 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="w-20 text-right font-black text-slate-900">
                        {formatIDR(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Pay Button */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">{formatIDR(subtotal)}</span>
              </div>

              {loyaltyDiscount > 0 && (
                <div className="flex items-center justify-between text-amber-600 font-bold">
                  <span>Diskon Loyalty Milestone ({activeMilestone?.orderMilestone}x Belanja):</span>
                  <span>-{formatIDR(loyaltyDiscount)}</span>
                </div>
              )}

              {promoDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span>Voucher Promo ({appliedPromo?.code}):</span>
                  <span>-{formatIDR(promoDiscount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Tagihan:</span>
                <span className="text-emerald-700 text-xl">{formatIDR(totalPayable)}</span>
              </div>

              <button
                onClick={handleOpenPay}
                disabled={posCart.length === 0}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 disabled:opacity-40"
              >
                <CreditCard className="w-4 h-4" />
                <span>Bayar Transaksi ({formatIDR(totalPayable)})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Proses Pembayaran Kasir</h3>
              <button onClick={() => setIsPayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                Total yang Harus Dibayar
              </span>
              <div className="text-3xl font-black text-emerald-700">{formatIDR(totalPayable)}</div>
            </div>

            {/* Payment Method tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                💵 Tunai (Cash)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('qris')}
                className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                  paymentMethod === 'qris'
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                📱 QRIS Kasir
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('edc')}
                className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                  paymentMethod === 'edc'
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                💳 Mesin EDC
              </button>
            </div>

            {/* Cash Input */}
            {paymentMethod === 'cash' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Uang Diterima (IDR):</label>
                  <input
                    type="number"
                    value={cashTendered || ''}
                    onChange={(e) => setCashTendered(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Quick cash pills */}
                <div className="flex flex-wrap gap-1.5">
                  {[totalPayable, 50000, 100000, 200000, 500000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setCashTendered(amt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700"
                    >
                      {formatIDR(amt)}
                    </button>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">Kembalian:</span>
                  <span className="text-base font-black text-emerald-700">{formatIDR(changeDue)}</span>
                </div>
              </div>
            )}

            <button
              onClick={handleProcessTransaction}
              className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs transition"
            >
              Selesaikan Transaksi & Simpan
            </button>
          </div>
        </div>
      )}

      {/* Variant Selection Modal */}
      {variantModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900">Pilih Varian {variantModalProduct.name}</h3>
              <button onClick={() => setVariantModalProduct(null)} className="text-slate-400">
                ✕
              </button>
            </div>
            <div className="space-y-2">
              {variantModalProduct.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    handleAddToCart(variantModalProduct, v);
                    setVariantModalProduct(null);
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-left text-xs font-bold transition flex items-center justify-between"
                >
                  <span>{v.name}</span>
                  <span className="text-emerald-700">{formatIDR(v.promoPrice || v.price)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Completed Modal */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200 text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-black text-lg text-slate-900">Transaksi Selesai & Berhasil!</h3>
            <p className="text-xs text-slate-500">ID: {completedOrder.id}</p>

            {/* Thermal Receipt Preview (58mm style) */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left font-mono text-[11px] space-y-2 text-slate-700">
              <div className="text-center border-b border-dashed border-slate-300 pb-2">
                <strong className="block text-xs uppercase">{settings.storeName}</strong>
                <span>{settings.address}</span>
              </div>
              <div className="space-y-1">
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.quantity}x {it.productName}</span>
                    <span>{formatIDR(it.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>TOTAL:</span>
                  <span>{formatIDR(completedOrder.totalAmount)}</span>
                </div>
                {completedOrder.changeDue !== undefined && (
                  <div className="flex justify-between text-slate-500">
                    <span>KEMBALI:</span>
                    <span>{formatIDR(completedOrder.changeDue)}</span>
                  </div>
                )}
              </div>
              <div className="text-center pt-2 text-[10px] text-slate-400">
                Terima kasih atas kunjungan Anda!
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handlePrintReceipt}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Struk (Print)</span>
              </button>
              <button
                onClick={() => setCompletedOrder(null)}
                className="px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Member Registration Modal in POS */}
      {isNewMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  Daftarkan Member Toko Baru (Moka POS)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewMemberModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap Pelanggan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp / HP *</label>
                <input
                  type="tel"
                  required
                  placeholder="Contoh: 081234567890"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none font-mono"
                />
                <span className="text-[10px] text-slate-400">Digunakan untuk kirim struk digital & poin reward</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email (Opsional)</label>
                <input
                  type="email"
                  placeholder="budi@gmail.com"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Alamat / Catatan Domisili</label>
                <input
                  type="text"
                  placeholder="Jl. Malioboro / Kota..."
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold transition shadow-md shadow-emerald-600/20"
                >
                  Simpan & Pilih Member
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewMemberModalOpen(false)}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Select Active Promo Modal */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-fadeIn max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">Pilih Kupon & Promo Aktif POS</h3>
                  <span className="text-[10px] text-slate-400">Total belanja saat ini: {formatIDR(subtotal)}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPromoModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-2.5 pr-1">
              {promotions.length === 0 ? (
                <p className="text-center py-8 text-xs text-slate-400">Belum ada promo voucher yang aktif.</p>
              ) : (
                promotions.map((promo) => {
                  const isEligible = subtotal >= promo.minOrderAmount;
                  const isSelected = appliedPromo?.id === promo.id;

                  return (
                    <div
                      key={promo.id}
                      className={`p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-500'
                          : isEligible
                          ? 'border-slate-200 bg-slate-50 hover:border-emerald-400 hover:bg-white'
                          : 'border-slate-200 bg-slate-100/50 opacity-60'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-xs text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-300">
                            {promo.code}
                          </span>
                          <span className="text-xs font-bold text-slate-800 truncate">{promo.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2">{promo.description}</p>
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500">
                          <span>Min. Belanja: <strong>{formatIDR(promo.minOrderAmount)}</strong></span>
                          <span>•</span>
                          <span>Diskon: <strong>{promo.type === 'percentage' ? `${promo.value}%` : formatIDR(promo.value)}</strong></span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {isSelected ? (
                          <button
                            type="button"
                            onClick={handleRemovePromo}
                            className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-700 text-xs font-bold hover:bg-rose-200 transition"
                          >
                            Lepas
                          </button>
                        ) : isEligible ? (
                          <button
                            type="button"
                            onClick={() => handleApplyPromo(promo.code)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                          >
                            Terapkan
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">
                            Kurang {formatIDR(promo.minOrderAmount - subtotal)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAMP CARD MATRIX MODAL FOR POS */}
      {isStampModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider">
                  Program Loyalitas Toko • Kasir POS
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Kartu Stempel Digital: {selectedCustomer.name} ({selectedCustomer.phone})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsStampModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <LoyaltyStampGrid
                orderCount={selectedCustomer.orderCount}
                loyaltyRewards={loyaltyRewards}
                customerName={selectedCustomer.name}
              />
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setIsStampModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Tutup Kartu Stempel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
