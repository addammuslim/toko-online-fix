import React, { useState, useEffect } from 'react';
import { HomeSection, WebSettings } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Star,
  Tag,
  Layers,
  Check
} from 'lucide-react';

interface Props {
  section: HomeSection;
  settings: WebSettings;
  onNavigate: (view: string, params?: any) => void;
  onSelectSliderStyle?: (style: string) => void;
}

export const HomeHeroSlider: React.FC<Props> = ({
  section,
  settings,
  onNavigate,
  onSelectSliderStyle
}) => {
  const slides = section.config?.slides || [
    {
      id: 's1',
      title: 'Mahakarya Seni & Busana Nusantara',
      subtitle: 'Koleksi busana tenun ikat & batik tulis otentik dengan sentuhan potongan kontemporer yang elegan.',
      btnText: 'Jelajahi Koleksi',
      btnLink: 'products',
      image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 's2',
      title: 'Biji Kopi Specialty Single Origin',
      subtitle: 'Dipetik tangan dari dataran tinggi Gayo, Toraja & Kintamani dengan aroma fruity dan cita rasa mendalam.',
      btnText: 'Beli Kopi Spesial',
      btnLink: 'products',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 's3',
      title: 'Kerajinan Kulit Asli & Artisan Kriya',
      subtitle: 'Dompet vegetable-tanned leather dan ukiran kayu jati Jepara berkualitas ekspor.',
      btnText: 'Lihat Kerajinan',
      btnLink: 'products',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeStyle, setActiveStyle] = useState<'modern_split' | 'cinematic_overlay' | 'minimal_clean' | 'glass_card'>(
    (section.config?.sliderStyle as any) || settings.sliderStyle || 'modern_split'
  );
  const [showStyleSwitcher, setShowStyleSwitcher] = useState(false);

  useEffect(() => {
    if (section.config?.sliderStyle) {
      setActiveStyle(section.config.sliderStyle as any);
    } else if (settings.sliderStyle) {
      setActiveStyle(settings.sliderStyle);
    }
  }, [section.config?.sliderStyle, settings.sliderStyle]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[currentIndex];

  const handleCtaClick = () => {
    if (currentSlide.btnLink === 'promo') {
      onNavigate('promo');
    } else {
      onNavigate('products');
    }
  };

  const changeStyle = (style: 'modern_split' | 'cinematic_overlay' | 'minimal_clean' | 'glass_card') => {
    setActiveStyle(style);
    if (onSelectSliderStyle) {
      onSelectSliderStyle(style);
    }
  };

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* 1. STYLE: MODERN SPLIT (Showcase Card on Right) */}
      {activeStyle === 'modern_split' && (
        <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-[500px] sm:min-h-[560px] flex items-center py-12">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 animate-fadeIn">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/10 text-emerald-300 border border-white/15 backdrop-blur-md shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Koleksi Terkurasi {settings.storeName}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] text-white">
                {currentSlide.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
                {currentSlide.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleCtaClick}
                  style={{ backgroundColor: settings.primaryColor }}
                  className="px-8 py-4 rounded-2xl text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-950/50 hover:scale-105 active:scale-95 transition-all group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{currentSlide.btnText || 'Beli Sekarang'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('promo')}
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/20 transition flex items-center gap-2"
                >
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>Cek Promo & Kupon</span>
                </button>
              </div>

              {/* Slide Dots */}
              <div className="flex items-center gap-2 pt-4">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      idx === currentIndex ? 'w-10 bg-emerald-400' : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Card Showcase with Glow */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                {/* Floating Badge on Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest block">
                      Garansi 100% Asli
                    </span>
                    <strong className="text-xs sm:text-sm font-extrabold truncate block">
                      {currentSlide.title}
                    </strong>
                  </div>
                  <button
                    onClick={handleCtaClick}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
                    title="Lihat Produk"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STYLE: CINEMATIC FULLWIDTH */}
      {activeStyle === 'cinematic_overlay' && (
        <div className="relative min-h-[500px] sm:min-h-[580px] flex items-center bg-slate-950 text-white">
          {slides.map((slide, idx) => (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
            </div>
          ))}

          <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 py-16 w-full">
            <div className="max-w-2xl space-y-6 text-white animate-fadeIn">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Karya Autentik Nusantara
              </span>

              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
                {currentSlide.title}
              </h1>

              <p className="text-sm sm:text-lg text-slate-200/90 leading-relaxed max-w-xl font-normal">
                {currentSlide.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleCtaClick}
                  style={{ backgroundColor: settings.primaryColor }}
                  className="px-8 py-4 rounded-2xl text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl hover:scale-105 active:scale-95 transition-all group"
                >
                  <span>{currentSlide.btnText || 'Beli Sekarang'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onNavigate('promo')}
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/20 transition"
                >
                  Cek Promo & Kupon
                </button>
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="absolute bottom-6 left-6 sm:left-8 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 3. STYLE: NORDIC MINIMAL CLEAN */}
      {activeStyle === 'minimal_clean' && (
        <div className="relative bg-white text-slate-900 border-b border-slate-200/80 min-h-[480px] sm:min-h-[520px] flex items-center py-10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
                {settings.storeName} • Koleksi Pilihan
              </span>

              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {currentSlide.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                {currentSlide.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleCtaClick}
                  style={{ backgroundColor: settings.primaryColor }}
                  className="px-8 py-3.5 rounded-2xl text-white font-bold text-sm hover:opacity-95 transition shadow-sm"
                >
                  {currentSlide.btnText || 'Belanja Sekarang'}
                </button>
                <button
                  onClick={() => onNavigate('promo')}
                  className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition"
                >
                  Kupon Promo
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. STYLE: FROSTED GLASS CARD */}
      {activeStyle === 'glass_card' && (
        <div className="relative min-h-[520px] sm:min-h-[580px] flex items-center justify-center p-6 bg-slate-950 overflow-hidden">
          {/* Ambient blurred backdrop image */}
          <div className="absolute inset-0">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover filter blur-md scale-110 opacity-40"
            />
            <div className="absolute inset-0 bg-slate-950/60" />
          </div>

          {/* Centered Floating Glass Container */}
          <div className="relative z-10 w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl text-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-fadeIn">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/15 text-emerald-300 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Frosted Edition
              </span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                {currentSlide.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {currentSlide.subtitle}
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCtaClick}
                  style={{ backgroundColor: settings.primaryColor }}
                  className="px-6 py-3.5 rounded-2xl text-white font-extrabold text-xs sm:text-sm shadow-xl hover:scale-105 transition"
                >
                  {currentSlide.btnText || 'Lihat Koleksi'}
                </button>
                <button
                  onClick={() => onNavigate('promo')}
                  className="px-5 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
                >
                  Voucher
                </button>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/20 shadow-xl aspect-4/3">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive Style Switcher Pill */}
      <div className="absolute top-4 right-4 z-30">
        <div className="relative">
          <button
            onClick={() => setShowStyleSwitcher(!showStyleSwitcher)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-bold backdrop-blur-md border border-white/20 shadow-lg transition"
            title="Ganti Layout Gaya Tampilan Slider"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gaya Slider: {activeStyle.replace('_', ' ').toUpperCase()}</span>
          </button>

          {showStyleSwitcher && (
            <div className="absolute right-0 top-9 w-64 bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-2xl p-2.5 space-y-1 text-xs animate-fadeIn z-40">
              <span className="text-[10px] font-bold text-slate-400 px-2 py-1 block uppercase">
                Pilih Layout Slider Depan:
              </span>
              {[
                { id: 'modern_split', name: '1. Modern Split Showcase' },
                { id: 'cinematic_overlay', name: '2. Cinematic Fullwidth' },
                { id: 'minimal_clean', name: '3. Nordic Minimal Clean' },
                { id: 'glass_card', name: '4. Frosted Glassmorphism' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    changeStyle(item.id as any);
                    setShowStyleSwitcher(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${
                    activeStyle === item.id
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span>{item.name}</span>
                  {activeStyle === item.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
