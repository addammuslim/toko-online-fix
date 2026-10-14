import React from 'react';
import { HomeSection, Product, WebSettings, Testimonial, Category } from '../../types';
import { ProductCard } from '../products/ProductCard';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  HeartHandshake,
  CheckCircle2,
  Award,
  Zap,
  Coffee,
  ShoppingBag
} from 'lucide-react';

interface Props {
  sections: HomeSection[];
  products: Product[];
  categories: Category[];
  testimonials: Testimonial[];
  settings: WebSettings;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onNavigate: (view: string, params?: any) => void;
}

export const HomeSections: React.FC<Props> = ({
  sections,
  products,
  categories,
  testimonials,
  settings,
  onSelectProduct,
  onQuickAddToCart,
  onNavigate
}) => {
  // Sort sections by their display order and filter active ones
  const activeSections = [...sections]
    .filter((s) => s.isActive && s.type !== 'slider' && s.type !== 'marquee')
    .sort((a, b) => a.order - b.order);

  // Helper to resolve product list based on data source
  const getProductsForSection = (dataSource: string = 'terlaris', limit: number = 8) => {
    let result = products.filter((p) => p.isActive);

    if (dataSource === 'terlaris') {
      result = result.filter((p) => p.isBestSeller);
    } else if (dataSource === 'promo') {
      result = result.filter((p) => p.isPromo);
    } else if (dataSource === 'selected') {
      result = result.filter((p) => p.isSelected);
    } else if (dataSource === 'random') {
      result = [...result].sort(() => 0.5 - Math.random());
    }

    if (result.length === 0) {
      result = products.filter((p) => p.isActive);
    }

    return result.slice(0, limit);
  };

  return (
    <div className="space-y-16 py-12">
      {/* Category Quick Browse Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kategori Produk Warisan
            </h2>
            <p className="text-xs text-slate-500">Pilih kategori untuk melihat koleksi pilihan</p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
          >
            <span>Lihat Semua Katalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('products', { category: cat.id })}
              className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200/80 p-5 shadow-xs hover:shadow-xl hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between min-h-[140px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs text-slate-400 font-bold group-hover:text-emerald-600 transition">
                  Koleksi →
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800 group-hover:text-emerald-700 transition">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1">{cat.description || 'Pilihan terbaik'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Render Dynamic Admin Sections */}
      {activeSections.map((section) => {
        // 1. PRODUCTS GRID SECTION
        if (section.type === 'products_grid') {
          const sectionProducts = getProductsForSection(
            section.config?.source || 'terlaris',
            section.config?.limit || 8
          );

          return (
            <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-2">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    {section.config?.badge || 'Pilihan Terbaik'}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {section.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
                    {section.subtitle || 'Produk terkurasi dengan standar mutu terbaik Nusantara'}
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('products')}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition inline-flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Lihat Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dynamic Grid Layout according to admin chosen style */}
              <div
                className={
                  section.config?.gridStyle === 'grid_3_col'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : section.config?.gridStyle === 'compact_list'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-4'
                    : section.config?.gridStyle === 'carousel_scroll'
                    ? 'flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin'
                    : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
                }
              >
                {sectionProducts.map((p) => (
                  <div
                    key={p.id}
                    className={
                      section.config?.gridStyle === 'carousel_scroll'
                        ? 'min-w-[260px] sm:min-w-[280px] snap-start'
                        : ''
                    }
                  >
                    <ProductCard
                      product={p}
                      settings={settings}
                      onSelect={onSelectProduct}
                      onQuickAddToCart={onQuickAddToCart}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // 2. BRAND STORY SECTION
        if (section.type === 'story' || section.type === 'about_brand') {
          const storyStyle = section.config?.storyStyle || 'split_dark';

          if (storyStyle === 'magazine_light') {
            return (
              <div key={section.id} className="bg-amber-50/60 text-slate-900 py-16 border-y border-amber-200/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-4/3">
                      <img
                        src={
                          section.config?.image ||
                          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80'
                        }
                        alt="Story Nusantara"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="lg:col-span-7 space-y-5">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase bg-amber-200 text-amber-900">
                        {section.config?.badge || 'Filosofi & Karya'}
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight leading-tight text-slate-900">
                        {section.title || 'Melestarikan Mahakarya Pengrajin Nusantara'}
                      </h2>
                      <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                        {section.config?.content ||
                          section.subtitle ||
                          'Nusantara Store hadir sebagai wadah kurasi mahakarya lokal, membawa sentuhan perajin tradisional ke panggung modern.'}
                      </p>
                      <div className="flex items-center gap-8 pt-4 border-t border-amber-200">
                        <div>
                          <strong className="text-2xl font-black text-amber-700 block">500+</strong>
                          <span className="text-[11px] text-slate-500 font-bold uppercase">Mitra Perajin</span>
                        </div>
                        <div>
                          <strong className="text-2xl font-black text-emerald-700 block">100%</strong>
                          <span className="text-[11px] text-slate-500 font-bold uppercase">Orisinalitas</span>
                        </div>
                        <div>
                          <strong className="text-2xl font-black text-blue-700 block">15.000+</strong>
                          <span className="text-[11px] text-slate-500 font-bold uppercase">Konsumen Setia</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          if (storyStyle === 'minimalist_center') {
            return (
              <div key={section.id} className="max-w-5xl mx-auto px-4 sm:px-8 py-16 text-center space-y-6">
                <span className="text-xs font-black tracking-widest uppercase text-emerald-600 block">
                  {section.config?.badge || 'Cerita Kami'}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                  {section.title || 'Warisan Budaya untuk Generasi Masa Kini'}
                </h2>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto">
                  {section.config?.content || section.subtitle || 'Perpaduan nilai luhur dan kreativitas perajin Nusantara.'}
                </p>
                {section.config?.image && (
                  <div className="pt-4 max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl">
                    <img src={section.config.image} alt="Story" className="w-full h-80 object-cover" />
                  </div>
                )}
              </div>
            );
          }

          // Default: split_dark
          return (
            <div key={section.id} className="bg-slate-900 text-white py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <span className="text-xs font-black tracking-widest uppercase text-amber-400">
                      {section.config?.badge || 'Cerita & Filosofi Kami'}
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                      {section.title || 'Melestarikan Mahakarya Pengrajin Nusantara'}
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                      {section.config?.content ||
                        section.subtitle ||
                        'Didirikan dengan cinta pada keanekaragaman budaya Indonesia, Nusantara Store hadir sebagai jembatan bagi para maestro batik, barista kopi daerah, dan perajin ukir lokal untuk membawa karya orisinal mereka ke panggung modern dengan kualitas terbaik.'}
                    </p>

                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-amber-400">500+</div>
                        <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                          Perajin Lokal
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
                        <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                          Karya Asli
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-blue-400">15.000+</div>
                        <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                          Pelanggan Puas
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-4/3">
                    <img
                      src={
                        section.config?.image ||
                        'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80'
                      }
                      alt="Story Nusantara"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // 3. EXPERIENCE / KEUNGGULAN SECTION
        if (section.type === 'experience') {
          return (
            <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {section.title || 'Mengapa Berbelanja di Nusantara Store?'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {section.subtitle || 'Komitmen kami menghadirkan pelayanan terbaik dan kenyamanan transaksi Anda'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">100% Orisinal & Asli</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Setiap produk kurasi langsung dari sumbernya, bebas dari produk tiruan atau cetakan murah.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">Ekspedisi Terlengkap</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bekerja sama dengan JNE, J&T, SiCepat dengan nomor resi otomatis dan pelacakan transparan.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">Garansi Retur 7 Hari</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Pesanan tidak sesuai atau cacat produksi? Kami ganti baru tanpa ribet.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900">Bantuan CS Responsif</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tim customer service siap mendampingi Anda via WhatsApp setiap hari dari 08:00 - 21:00 WIB.
                  </p>
                </div>
              </div>
            </div>
          );
        }

        // 4. TESTIMONIALS SECTION
        if (section.type === 'testimonials') {
          return (
            <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <div className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  Kepuasan Pelanggan 4.9 / 5.0
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {section.title || 'Apa Kata Mereka Tentang Kami?'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {section.subtitle || 'Testimoni nyata dari ribuan kolektor dan pembeli setia Nusantara Store'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.slice(0, 3).map((t) => (
                  <div
                    key={t.id}
                    className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                        "{t.content}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-900">{t.name}</h4>
                        <p className="text-[10px] text-slate-400">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // 5. CALL TO ACTION (CTA) SECTION
        if (section.type === 'cta') {
          const ctaStyle = section.config?.ctaStyle || 'gradient_emerald';

          return (
            <div key={section.id} className="max-w-7xl mx-auto px-4 sm:px-8">
              <div
                className={`rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 ${
                  ctaStyle === 'dark_luxury'
                    ? 'bg-slate-950 border border-slate-800'
                    : ctaStyle === 'bordered_minimal'
                    ? 'bg-white text-slate-900 border-2 border-emerald-600 shadow-emerald-500/10'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-700'
                }`}
              >
                <div className={`space-y-3 max-w-xl text-center md:text-left ${ctaStyle === 'bordered_minimal' ? 'text-slate-900' : 'text-white'}`}>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${
                    ctaStyle === 'bordered_minimal' ? 'bg-emerald-100 text-emerald-800' : 'bg-white/20 text-white'
                  }`}>
                    {section.config?.badge || 'Promo Terbatas'}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                    {section.title || 'Dapatkan Voucher Diskon 25% untuk Pesanan Pertama Anda!'}
                  </h2>
                  <p className={`text-xs sm:text-sm ${ctaStyle === 'bordered_minimal' ? 'text-slate-600' : 'text-white/90'}`}>
                    {section.subtitle || 'Daftar sebagai member dan nikmati reward bertingkat, gratis ongkir, dan penawaran khusus mingguan.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => onNavigate('promo')}
                    className={`px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition shadow-lg ${
                      ctaStyle === 'bordered_minimal'
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-white text-slate-900 hover:bg-slate-100 shadow-black/10'
                    }`}
                  >
                    {section.config?.btnText || 'Klaim Kupon Sekarang'}
                  </button>
                  <button
                    onClick={() => onNavigate(section.config?.btnLink || 'products')}
                    className={`px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition backdrop-blur-md ${
                      ctaStyle === 'bordered_minimal'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : 'bg-black/20 hover:bg-black/30 text-white'
                    }`}
                  >
                    Buka Katalog
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
