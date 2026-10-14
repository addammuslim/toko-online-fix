import React, { useState } from 'react';
import { CartItem, WebSettings } from '../../types';
import { StorageService } from '../../services/storage';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, ShieldCheck, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  settings: WebSettings;
  onUpdateQuantity: (productId: string, variantName: string | undefined, qty: number) => void;
  onRemoveItem: (productId: string, variantName: string | undefined) => void;
  onProceedToCheckout: (discount: number, promo: string) => void;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  cart,
  settings,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    setPromoError(null);
    const allPromotions = StorageService.getPromotions();
    const promo = allPromotions.find((p) => p.code.toUpperCase() === code && p.isActive);

    if (promo) {
      if (promo.minOrderAmount > 0 && subtotal < promo.minOrderAmount) {
        setPromoError(`Minimal belanja untuk kupon ini adalah ${formatIDR(promo.minOrderAmount)}`);
        return;
      }

      let calcDiscount = 0;
      if (promo.type === 'percentage') {
        calcDiscount = (subtotal * promo.value) / 100;
        if (promo.maxDiscountAmount && calcDiscount > promo.maxDiscountAmount) {
          calcDiscount = promo.maxDiscountAmount;
        }
      } else if (promo.type === 'fixed') {
        calcDiscount = promo.value;
      } else if (promo.type === 'free_shipping' || promo.type === 'subsidy_shipping') {
        calcDiscount = Math.min(20000, promo.value || 20000); // subsidi ongkir
      }

      setDiscountAmount(calcDiscount);
      setAppliedPromo(promo.code);
      setPromoCodeInput('');
    } else {
      // Demo fallback codes
      if (code === 'NUSANTARA35' || code === 'HEMAT20') {
        const rate = code === 'NUSANTARA35' ? 0.35 : 0.20;
        const disc = Math.round(subtotal * rate);
        setDiscountAmount(disc);
        setAppliedPromo(code);
        setPromoCodeInput('');
      } else {
        setPromoError('Kode promo tidak valid atau telah kedaluwarsa.');
      }
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h2 className="font-extrabold text-base text-slate-900">
              Keranjang Belanja ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-700 text-sm">Keranjang Anda masih kosong</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Temukan aneka batik eksklusif, kopi single origin, dan kerajinan tangan Nusantara terbaik.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition"
              >
                Mulai Berbelanja
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.productId}-${item.variantName || 'def'}-${idx}`}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-center gap-3.5"
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-bold text-xs text-slate-800 truncate">{item.productName}</h4>
                  {item.variantName && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-600 font-medium inline-block">
                      {item.variantName}
                    </span>
                  )}
                  <div className="text-xs font-extrabold text-emerald-700">
                    {formatIDR(item.price)}
                  </div>
                </div>

                {/* Qty controls */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => onRemoveItem(item.productId, item.variantName)}
                    className="text-slate-400 hover:text-red-500 p-1"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.variantName, item.quantity - 1)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.productId, item.variantName, item.quantity + 1)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout button */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-white space-y-4">
            {/* Promo Voucher Code */}
            <div>
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Kupon {appliedPromo} Aktif (-{formatIDR(discountAmount)})</span>
                  </div>
                  <button
                    onClick={() => {
                      setAppliedPromo(null);
                      setDiscountAmount(0);
                    }}
                    className="text-slate-400 hover:text-red-500 text-[11px] font-bold"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Punya Kode Promo / Kupon?"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold uppercase outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition"
                  >
                    Terapkan
                  </button>
                </form>
              )}
              {promoError && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{promoError}</p>
              )}
            </div>

            {/* Price calculation */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-500">
                <span>Subtotal Barang:</span>
                <span className="font-bold text-slate-800">{formatIDR(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span>Potongan Promo:</span>
                  <span>-{formatIDR(discountAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Biaya Pengiriman:</span>
                <span>Dihitung saat checkout</span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Estimasi Total:</span>
                <span className="text-emerald-700">{formatIDR(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => onProceedToCheckout(discountAmount, appliedPromo || '')}
              style={{ backgroundColor: settings.primaryColor }}
              className="w-full py-3.5 px-4 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 hover:opacity-95 transition"
            >
              <span>Lanjut ke Form Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
