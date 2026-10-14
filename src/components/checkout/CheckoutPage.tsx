import React, { useState, useEffect } from 'react';
import { CartItem, WebSettings, Order, CourierOption } from '../../types';
import {
  INDONESIA_LOCATIONS,
  calculateShippingOptions
} from '../../services/shipping';
import { StorageService } from '../../services/storage';
import { trackEvent } from '../../services/pixelTracker';
import {
  CreditCard,
  Truck,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  ShoppingBag,
  Sparkles,
  Phone,
  Mail,
  User,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  cart: CartItem[];
  settings: WebSettings;
  appliedDiscount: number;
  promoCode: string;
  onClearCart: () => void;
  onNavigate: (view: string, params?: any) => void;
}

export const CheckoutPage: React.FC<Props> = ({
  cart,
  settings,
  appliedDiscount,
  promoCode,
  onClearCart,
  onNavigate
}) => {
  // Recipient form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [province, setProvince] = useState(INDONESIA_LOCATIONS[0].province);
  const [city, setCity] = useState(INDONESIA_LOCATIONS[0].cities[0].city);
  const [subdistrict, setSubdistrict] = useState(
    INDONESIA_LOCATIONS[0].cities[0].subdistricts[0]
  );
  const [postalCode, setPostalCode] = useState('12190');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Shipping selection
  const [availableCouriers, setAvailableCouriers] = useState<CourierOption[]>([]);
  const [selectedCourier, setSelectedCourier] = useState<CourierOption | null>(null);

  // Payment method selection
  const [paymentChannel, setPaymentChannel] = useState<'qris' | 'bca_va' | 'mandiri_va' | 'gopay' | 'cc'>('qris');

  // Checkout flow state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const totalWeight = cart.reduce((acc, item) => acc + item.weightGrams * item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Recalculate shipping options whenever province/city/weight changes
  useEffect(() => {
    const options = calculateShippingOptions(
      settings,
      province,
      city,
      totalWeight,
      subtotal
    );
    setAvailableCouriers(options);
    if (options.length > 0) {
      setSelectedCourier(options[0]);
    } else {
      setSelectedCourier(null);
    }
  }, [province, city, totalWeight, subtotal, settings]);

  // Selected city options
  const selectedProvinceData = INDONESIA_LOCATIONS.find((p) => p.province === province);
  const availableCities = selectedProvinceData?.cities || [];
  const selectedCityData = availableCities.find((c) => c.city === city);
  const availableSubdistricts = selectedCityData?.subdistricts || [];

  const shippingCost = selectedCourier ? selectedCourier.cost : 0;
  const grandTotal = Math.max(0, subtotal - appliedDiscount + shippingCost);

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address || !selectedCourier) {
      alert('Mohon lengkapi semua data penerima dan pilih kurir pengiriman!');
      return;
    }

    setIsProcessing(true);

    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: orderId,
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      address,
      province,
      city,
      subdistrict,
      postalCode,
      courier: `${selectedCourier.name} (${selectedCourier.service})`,
      trackingNumber: `ID${Date.now().toString().slice(-8)}EXP`,
      shippingCost,
      subtotal,
      discount: appliedDiscount,
      promoCode: promoCode || undefined,
      totalAmount: grandTotal,
      paymentMode: 'midtrans',
      paymentMethod:
        paymentChannel === 'qris'
          ? 'Midtrans QRIS (GoPay / Dana / OVO)'
          : paymentChannel === 'bca_va'
          ? 'Midtrans BCA Virtual Account'
          : paymentChannel === 'mandiri_va'
          ? 'Midtrans Mandiri Bill'
          : paymentChannel === 'gopay'
          ? 'Midtrans GoPay Instant'
          : 'Kartu Kredit (Visa/Mastercard)',
      paymentStatus: 'paid', // Instant simulation confirmation
      orderStatus: 'Dibayar',
      source: 'Online',
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        variantName: item.variantName,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        image: item.image
      })),
      timelines: [
        {
          status: 'Pending',
          title: 'Pesanan Dibuat',
          description: 'Checkout berhasil dibuat oleh pelanggan melalui sistem.',
          timestamp: new Date().toISOString()
        },
        {
          status: 'Dibayar',
          title: 'Pembayaran Dikonfirmasi (Midtrans Snap)',
          description: `Pembayaran ${formatIDR(grandTotal)} lunas via Midtrans Snap. Notifikasi otomatis dikirim ke admin & pelanggan.`,
          timestamp: new Date().toISOString(),
          actor: 'Midtrans Webhook'
        }
      ],
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save order
    StorageService.addOrder(newOrder);

    // Track Pixel Purchase
    trackEvent('Purchase', {
      order_id: newOrder.id,
      value: newOrder.totalAmount,
      currency: 'IDR',
      num_items: cart.length
    });

    // Auto send notifications simulation
    if (settings.autoSendOrderWA) {
      console.log(`[Auto-Send WA] Notifikasi order baru ${orderId} terkirim ke customer ${customerPhone}`);
    }
    if (settings.autoSendOrderEmail && customerEmail) {
      console.log(`[Auto-Send Email] Invoice order ${orderId} terkirim ke ${customerEmail}`);
    }

    // Clear cart and show success
    onClearCart();
    setCompletedOrder(newOrder);
    setIsProcessing(false);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-fadeIn space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Pembayaran Berhasil!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Terima kasih, pesanan Anda telah kami terima dan sedang dipersiapkan oleh tim Nusantara.
            </p>
          </div>

          {/* Order ID box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between max-w-md mx-auto">
            <div className="text-left">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Nomor Pesanan Anda
              </span>
              <span className="text-base font-black text-slate-900 font-mono">
                {completedOrder.id}
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(completedOrder.id);
                setCopiedOrderId(true);
                setTimeout(() => setCopiedOrderId(false), 2000);
              }}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 transition flex items-center gap-1 text-xs font-bold"
            >
              {copiedOrderId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedOrderId ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>

          {/* Quick Notification to WhatsApp CS */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs text-left space-y-2">
            <div className="flex items-center gap-2 font-black">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Kirim Konfirmasi Pesanan ke WhatsApp CS Kami?</span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Anda juga dapat langsung menginfokan nomor pesanan ke admin agar proses packing lebih diprioritaskan.
            </p>
            <button
              onClick={() => {
                const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');
                const text = `Halo Admin ${settings.storeName}, saya sudah menyelesaikan pesanan dengan nomor order: *${completedOrder.id}* sebesar *${formatIDR(completedOrder.totalAmount)}*. Mohon diproses ya kak, terima kasih!`;
                window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold inline-flex items-center gap-2 transition"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Konfirmasi via WhatsApp</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => onNavigate('tracking', { orderId: completedOrder.id })}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>Lacak Status Pengiriman</span>
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART GUARD
  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-800">Keranjang Belanja Masih Kosong</h2>
        <p className="text-xs text-slate-400">Silakan pilih produk terlebih dahulu sebelum melakukan checkout.</p>
        <button
          onClick={() => onNavigate('products')}
          className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-emerald-600 transition"
        >
          Lihat Katalog Produk
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 animate-fadeIn">
      <div className="mb-8 space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-7 h-7 text-emerald-600" />
          <span>Checkout & Pembayaran Aman (Midtrans Snap)</span>
        </h1>
        <p className="text-xs text-slate-500">
          Lengkapi data alamat penerima dan pilih metode pembayaran favorit Anda.
        </p>
      </div>

      <form onSubmit={handleCreateOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Data Penerima & Ekspedisi */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Data Penerima */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-4 h-4 text-emerald-600" />
              <span>1. Informasi Penerima</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nomor WhatsApp *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Alamat Email (Untuk Bukti Invoice)</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="budi@gmail.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Alamat Pengiriman */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>2. Alamat Tujuan Pengiriman</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Provinsi *</label>
                <select
                  value={province}
                  onChange={(e) => {
                    const newProv = e.target.value;
                    setProvince(newProv);
                    const pData = INDONESIA_LOCATIONS.find((p) => p.province === newProv);
                    if (pData && pData.cities.length > 0) {
                      setCity(pData.cities[0].city);
                      setSubdistrict(pData.cities[0].subdistricts[0]);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none cursor-pointer focus:border-emerald-500"
                >
                  {INDONESIA_LOCATIONS.map((p) => (
                    <option key={p.province} value={p.province}>
                      {p.province}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kota / Kabupaten *</label>
                <select
                  value={city}
                  onChange={(e) => {
                    const newCity = e.target.value;
                    setCity(newCity);
                    const cData = availableCities.find((c) => c.city === newCity);
                    if (cData && cData.subdistricts.length > 0) {
                      setSubdistrict(cData.subdistricts[0]);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none cursor-pointer focus:border-emerald-500"
                >
                  {availableCities.map((c) => (
                    <option key={c.city} value={c.city}>
                      {c.city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kecamatan *</label>
                <select
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none cursor-pointer focus:border-emerald-500"
                >
                  {availableSubdistricts.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Kode Pos</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Contoh: 12190"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Alamat Lengkap (Jalan, RT/RW, No. Rumah) *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jl. Senopati No. 42, RT 02/RW 03, Kel. Selong"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700">Catatan Khusus untuk Penjual / Kurir (Opsional)</label>
                <input
                  type="text"
                  placeholder="Misal: Titip di pos satpam bila rumah kosong"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Pilih Kurir Pengiriman */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>3. Ekspedisi & Ongkos Kirim</span>
              </span>
              <span className="text-xs text-slate-500 font-normal">
                Berat Total: <strong>{totalWeight} gram</strong>
              </span>
            </h2>

            <div className="space-y-2.5">
              {availableCouriers.map((courier, idx) => (
                <label
                  key={`${courier.code}-${courier.service}-${idx}`}
                  className={`p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                    selectedCourier?.code === courier.code && selectedCourier?.service === courier.service
                      ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="courierOption"
                      checked={
                        selectedCourier?.code === courier.code &&
                        selectedCourier?.service === courier.service
                      }
                      onChange={() => setSelectedCourier(courier)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">
                        {courier.name} - {courier.service}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {courier.description} • Estimasi: {courier.etd}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-black text-emerald-700">
                    {courier.cost === 0 ? 'GRATIS ONGKIR' : formatIDR(courier.cost)}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Ringkasan Pesanan & Pembayaran */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5 sticky top-24">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Ringkasan & Metode Bayar</span>
            </h2>

            {/* Items summary */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 truncate">{item.productName}</h4>
                    <p className="text-[10px] text-slate-400">
                      {item.variantName || 'Standar'} • {item.quantity} pcs
                    </p>
                  </div>
                  <div className="font-black text-slate-900">
                    {formatIDR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Metode Pembayaran (Midtrans Snap):
              </label>

              <div className="space-y-1.5 text-xs font-bold text-slate-800">
                <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${paymentChannel === 'qris' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={paymentChannel === 'qris'} onChange={() => setPaymentChannel('qris')} />
                    <span>QRIS (GoPay, OVO, Dana, ShopeePay)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Instan</span>
                </label>

                <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${paymentChannel === 'bca_va' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={paymentChannel === 'bca_va'} onChange={() => setPaymentChannel('bca_va')} />
                    <span>BCA Virtual Account</span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${paymentChannel === 'mandiri_va' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={paymentChannel === 'mandiri_va'} onChange={() => setPaymentChannel('mandiri_va')} />
                    <span>Mandiri Bill / VA</span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer ${paymentChannel === 'cc' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <input type="radio" checked={paymentChannel === 'cc'} onChange={() => setPaymentChannel('cc')} />
                    <span>Kartu Kredit (Visa / Mastercard)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal Barang:</span>
                <span className="font-bold text-slate-800">{formatIDR(subtotal)}</span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span>Kupon Promo ({promoCode}):</span>
                  <span>-{formatIDR(appliedDiscount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-500">
                <span>Ongkos Kirim ({selectedCourier?.name || '-'}):</span>
                <span className="font-bold text-slate-800">
                  {shippingCost === 0 ? 'GRATIS' : formatIDR(shippingCost)}
                </span>
              </div>

              <div className="flex items-center justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Pembayaran:</span>
                <span className="text-emerald-700 text-lg">{formatIDR(grandTotal)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              style={{ backgroundColor: settings.primaryColor }}
              className="w-full py-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-700/25 hover:opacity-95 transition disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Memproses Transaksi...</span>
              ) : (
                <>
                  <span>Bayar Sekarang ({formatIDR(grandTotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-slate-400 space-y-1">
              <p>🔒 Dilindungi enkripsi SSL 256-bit dan Midtrans Payment Gateway</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
