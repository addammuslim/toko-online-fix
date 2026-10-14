import React from 'react';
import { WebSettings } from '../../types';
import { StorageService } from '../../services/storage';
import { Award, ShieldCheck, Heart, Sparkles, MapPin, Users, ArrowRight } from 'lucide-react';

interface Props {
  settings: WebSettings;
  onNavigate: (view: string) => void;
}

export const AboutPage: React.FC<Props> = ({ settings, onNavigate }) => {
  const page = StorageService.getCustomPageById('about');

  const title = page?.title || `Menghubungkan Warisan Budaya Nusantara dengan Kehidupan Modern`;
  const subtitle = page?.subtitle || `${settings.tagline} — Didirikan dengan komitmen melestarikan mahakarya maestro lokal Indonesia dan memberdayakan ratusan perajin daerah di seluruh kepulauan.`;
  const badge = page?.badge || `Tentang ${settings.storeName}`;
  const content = page?.content || `Nusantara Heritage Store berawal dari keprihatinan kami melihat banyaknya mahakarya seni tradisional seperti batik tulis canting, tenun ikat NTT, dan ukiran kayu Jepara yang mulai tersisih oleh produksi massal luar negeri.\n\nKami berkeliling ke desa-desa sentra perajin di Solo, Yogyakarta, Jepara, hingga Toraja untuk membangun kemitraan adil (fair trade). Setiap helai kain dan setiap seduhan kopi di toko ini memiliki cerita manusia, dedikasi, dan doa di baliknya.`;
  const imageUrl = page?.imageUrl || `https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=1200&q=80`;
  const sections = page?.sections && page.sections.length > 0 ? page.sections : [
    {
      title: 'Pemberdayaan Pengrajin Lokal',
      description: 'Bermitra langsung dengan 150+ keluarga perajin batik, penenun, dan petani kopi nusantara tanpa perantara.',
      icon: 'ShieldCheck'
    },
    {
      title: 'Kualitas Mahakarya Kurasi Ketat',
      description: 'Setiap produk melewati standar kurasi bahan, jahitan rapi, dan keaslian material 100% original.',
      icon: 'Heart'
    },
    {
      title: 'Standar Mutu & Fair Trade',
      description: 'Packaging higienis, pengawasan mutu jahitan, dan kemasan kedap udara menjamin kepuasan saat paket tiba di tangan Anda.',
      icon: 'Award'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-16 animate-fadeIn">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          {badge}
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Main Story & Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-4/3 bg-slate-100">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Kisah & Komitmen Kami
          </h2>
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {content}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition inline-flex items-center gap-2 shadow-md shadow-slate-900/10"
            >
              <span>Jelajahi Koleksi Produk Kami</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Pillars / Values Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((sec, idx) => (
          <div key={idx} className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              {idx === 0 ? <ShieldCheck className="w-6 h-6" /> : idx === 1 ? <Heart className="w-6 h-6" /> : <Award className="w-6 h-6" />}
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">{sec.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {sec.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
