import React from 'react';
import { WebSettings } from '../../types';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Tag,
  FileText
} from 'lucide-react';

interface Props {
  settings: WebSettings;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<Props> = ({ settings, onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Value props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800 text-slate-300">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">100% Produk Asli & Terjamin</h4>
              <p className="text-xs text-slate-400 mt-1">
                Karya otentik langsung dari pengrajin & petani lokal berdedikasi tinggi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Ekspedisi Aman & Terpercaya</h4>
              <p className="text-xs text-slate-400 mt-1">
                Dukungan JNE, J&T, SiCepat, AnterAja dengan nomor resi terintegrasi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Garansi Kepuasan Pelanggan</h4>
              <p className="text-xs text-slate-400 mt-1">
                Retur mudah jika produk cacat atau tidak sesuai deskripsi dalam 2x24 jam.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: settings.primaryColor }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white">{settings.storeName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{settings.tagline}</p>
            <div className="flex items-center gap-3 pt-2">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-600 transition"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-emerald-600 transition"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Nav Links Column 1: Belanja & Program */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm tracking-wide">Belanja & Promo</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition">
                  Beranda Toko
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-emerald-400 transition">
                  Katalog Semua Produk
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('promo')} className="hover:text-emerald-400 transition flex items-center gap-1.5 text-amber-400 font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Katalog Promo & S&K Voucher</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('promo')} className="hover:text-emerald-400 transition text-slate-300">
                  Reward Loyalty Bertingkat
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracking')} className="hover:text-emerald-400 transition flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Lacak Resi (RajaOngkir)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Nav Links Column 2: Informasi & Kebijakan Toko */}
          <div className="space-y-3">
            <h5 className="font-bold text-white text-sm tracking-wide">Informasi & Kebijakan</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition">
                  Tentang {settings.storeName}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition">
                  Hubungi Kami & Layanan CS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-emerald-400 transition flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kebijakan Privasi Data</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-emerald-400 transition">
                  Garansi Retur 2x24 Jam
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('policies')} className="hover:text-emerald-400 transition">
                  Syarat & Ketentuan Layanan
                </button>
              </li>
            </ul>
          </div>

          {/* Alamat & Kontak */}
          <div className="space-y-3 text-xs text-slate-400">
            <h5 className="font-bold text-white text-sm tracking-wide">Workshop & Galeri</h5>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>WhatsApp: +{settings.whatsappNumber}</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{settings.email}</span>
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Arsitektur: <strong className="text-slate-300">PHP 8.1+ Native MVC & MySQL Prepared</strong>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
