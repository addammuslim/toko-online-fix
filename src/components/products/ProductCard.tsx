import React from 'react';
import { Product, WebSettings } from '../../types';
import { Star, ShoppingBag, MessageSquare, Flame, Tag } from 'lucide-react';
import { trackEvent } from '../../services/pixelTracker';

interface Props {
  product: Product;
  settings: WebSettings;
  onSelect: (product: Product) => void;
  onQuickAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<Props> = ({
  product,
  settings,
  onSelect,
  onQuickAddToCart
}) => {
  const isMidtransMode = settings.paymentMode === 'midtrans';

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const discountPercent =
    product.promoPrice && product.promoPrice < product.price
      ? Math.round(((product.price - product.promoPrice) / product.price) * 100)
      : null;

  const currentPrice = product.promoPrice || product.price;

  const handleCardClick = () => {
    trackEvent('ViewContent', {
      content_name: product.name,
      content_id: product.id,
      content_type: 'product',
      value: currentPrice,
      currency: 'IDR'
    });
    onSelect(product);
  };

  const handleWhatsAppBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    trackEvent('Lead', {
      content_name: product.name,
      content_id: product.id,
      value: currentPrice,
      method: 'WhatsApp'
    });

    const cleanWa = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const productUrl = `${window.location.origin}/#product-${product.id}`;
    let message = settings.waGreetingTemplate
      .replace('{nama_toko}', settings.storeName)
      .replace('{produk}', product.name)
      .replace('{varian}', product.variants[0]?.name || 'Standard')
      .replace('{harga}', formatIDR(currentPrice))
      .replace('{qty}', '1')
      .replace('{link_produk}', productUrl);

    window.open(`https://wa.me/${cleanWa}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 sm:aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-md">
              <Flame className="w-3 h-3 fill-current" />
              Terlaris
            </span>
          )}
          {discountPercent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
              <Tag className="w-3 h-3" />
              Hemat {discountPercent}%
            </span>
          )}
        </div>

        {/* Stock status overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({product.reviewCount} ulasan)</span>
          </div>

          <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-2 group-hover:text-emerald-700 transition">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-1">
            {product.shortDescription || product.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {formatIDR(currentPrice)}
            </div>
            {product.promoPrice && product.promoPrice < product.price && (
              <div className="text-xs text-slate-400 line-through">
                {formatIDR(product.price)}
              </div>
            )}
          </div>

          {/* Quick action button depending on paymentMode */}
          {isMidtransMode ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickAddToCart) onQuickAddToCart(product);
              }}
              disabled={product.stock <= 0}
              className="p-2.5 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white transition shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Tambah ke Keranjang"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleWhatsAppBuy}
              disabled={product.stock <= 0}
              className="px-3 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm flex items-center gap-1.5 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Pesan via WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Order WA</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
