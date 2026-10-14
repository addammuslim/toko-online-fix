import React, { useState } from 'react';
import { Product, ProductVariant, WebSettings, Review } from '../../types';
import {
  X,
  Star,
  ShoppingBag,
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Sparkles,
  Share2,
  Send,
  User
} from 'lucide-react';
import { trackEvent } from '../../services/pixelTracker';

interface Props {
  product: Product;
  settings: WebSettings;
  reviews: Review[];
  onClose: () => void;
  onAddToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  onBuyNow: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  onAddReview: (review: Review) => void;
  onSelectRelatedProduct: (product: Product) => void;
  allProducts: Product[];
}

export const ProductDetailModal: React.FC<Props> = ({
  product,
  settings,
  reviews,
  onClose,
  onAddToCart,
  onBuyNow,
  onAddReview,
  onSelectRelatedProduct,
  allProducts
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'shipping'>('desc');

  // Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [ratingScore, setRatingScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const isMidtransMode = settings.paymentMode === 'midtrans';

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const currentPrice = selectedVariant
    ? (selectedVariant.promoPrice || selectedVariant.price)
    : (product.promoPrice || product.price);

  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;

  const productReviews = reviews.filter((r) => r.productId === product.id);

  const relatedProducts = allProducts
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 3);

  const handleWhatsAppBuy = () => {
    trackEvent('Lead', {
      content_name: product.name,
      content_id: product.id,
      value: currentPrice * quantity,
      method: 'WhatsApp'
    });

    const cleanWa = settings.whatsappNumber.replace(/[^0-9]/g, '');
    const productUrl = `${window.location.origin}/#product-${product.id}`;
    let message = settings.waGreetingTemplate
      .replace('{nama_toko}', settings.storeName)
      .replace('{produk}', product.name)
      .replace('{varian}', selectedVariant?.name || 'Standard')
      .replace('{harga}', formatIDR(currentPrice))
      .replace('{qty}', quantity.toString())
      .replace('{link_produk}', productUrl);

    window.open(`https://wa.me/${cleanWa}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      userName: reviewerName.trim(),
      rating: ratingScore,
      comment: reviewComment.trim(),
      isApproved: true,
      createdAt: new Date().toISOString()
    };

    onAddReview(newRev);
    setReviewerName('');
    setReviewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top bar with close button */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Detail Produk Nusantara
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        selectedImage === img
                          ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Value proposition badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600">
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="font-bold">100% Asli</span>
                  <span className="text-[9px] text-slate-400">Garansi Kualitas</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <Truck className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="font-bold">Kirim Cepat</span>
                  <span className="text-[9px] text-slate-400">JNE, J&T, SiCepat</span>
                </div>
                <div className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <RotateCcw className="w-4 h-4 text-emerald-600 mb-1" />
                  <span className="font-bold">Retur Mudah</span>
                  <span className="text-[9px] text-slate-400">Garansi 7 Hari</span>
                </div>
              </div>
            </div>

            {/* Product Meta & Actions */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">{productReviews.length} ulasan pelanggan</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-emerald-600 font-medium">SKU: {selectedVariant?.sku || product.sku}</span>
                </div>

                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                    {formatIDR(currentPrice)}
                  </div>
                  {originalPrice > currentPrice && (
                    <div className="text-sm text-slate-400 line-through">
                      {formatIDR(originalPrice)}
                    </div>
                  )}
                  {originalPrice > currentPrice && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase">
                      Hemat {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Variants Selection */}
                {product.variants && product.variants.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Pilih Varian / Ukuran:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            selectedVariant?.id === v.id
                              ? 'bg-slate-900 text-white shadow-md'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {v.name}
                          {v.promoPrice && v.promoPrice < v.price && (
                            <span className="text-[10px] opacity-80">({formatIDR(v.promoPrice)})</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Stock */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="uppercase tracking-wider">Jumlah:</span>
                    <span className={currentStock > 0 ? 'text-emerald-600' : 'text-red-500'}>
                      Stok Tersedia: {currentStock} unit
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-slate-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                        disabled={quantity >= currentStock}
                        className="p-1.5 rounded-lg hover:bg-white text-slate-600 transition disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-500">
                      Subtotal: <strong className="text-slate-900">{formatIDR(currentPrice * quantity)}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons based on Payment Mode */}
              <div className="space-y-2.5 pt-4 border-t border-slate-200">
                {isMidtransMode ? (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onAddToCart(product, selectedVariant, quantity)}
                      disabled={currentStock <= 0}
                      className="py-3 px-4 rounded-2xl border-2 border-slate-900 hover:bg-slate-900 hover:text-white font-bold text-slate-900 text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>+ Keranjang</span>
                    </button>
                    <button
                      onClick={() => onBuyNow(product, selectedVariant, quantity)}
                      disabled={currentStock <= 0}
                      className="py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" />
                      <span>Beli Langsung</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleWhatsAppBuy}
                    disabled={currentStock <= 0}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm transition flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-700/25 disabled:opacity-50"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Beli Sekarang via WhatsApp CS</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Product Tabs: Deskripsi / Ulasan / Pengiriman */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
              <button
                onClick={() => setActiveTab('desc')}
                className={`pb-3 transition relative ${
                  activeTab === 'desc'
                    ? 'text-emerald-700 border-b-2 border-emerald-600 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Deskripsi Lengkap
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 transition relative ${
                  activeTab === 'reviews'
                    ? 'text-emerald-700 border-b-2 border-emerald-600 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Ulasan ({productReviews.length})
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-3 transition relative ${
                  activeTab === 'shipping'
                    ? 'text-emerald-700 border-b-2 border-emerald-600 font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Ketentuan Pengiriman & Garansi
              </button>
            </div>

            {activeTab === 'desc' && (
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                {product.description}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Submit review */}
                <form
                  onSubmit={handleSubmitReview}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Tulis Ulasan Anda
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nama Anda"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      required
                      className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <span>Rating:</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRatingScore(star)}
                            className="p-1 hover:scale-110 transition"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                ratingScore >= star
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Ceritakan pengalaman Anda mengenai produk ini..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Ulasan</span>
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {productReviews.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">
                      Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan ulasan!
                    </p>
                  ) : (
                    productReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {rev.userName}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-normal">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="text-xs text-slate-600 space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <p>
                  • <strong>Pengiriman:</strong> Diproses dalam 1x24 jam pada hari kerja (Senin - Sabtu). Tersedia ekspedisi JNE, J&T, SiCepat, dan Anteraja.
                </p>
                <p>
                  • <strong>Gratis Ongkir:</strong> Berlaku otomatis untuk transaksi di atas batas minimal belanja yang aktif.
                </p>
                <p>
                  • <strong>Garansi Retur 7 Hari:</strong> Jika produk rusak atau tidak sesuai, Anda berhak mendapatkan penggantian unit baru atau pengembalian dana 100%.
                </p>
              </div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider">
                Produk Terkait Pilihan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedProduct(rel)}
                    className="p-3 rounded-2xl border border-slate-200 hover:border-emerald-500 cursor-pointer transition flex items-center gap-3 bg-white"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{rel.name}</h4>
                      <p className="text-xs font-black text-emerald-600 mt-0.5">
                        {formatIDR(rel.promoPrice || rel.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
