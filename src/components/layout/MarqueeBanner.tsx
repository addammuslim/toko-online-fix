import React from 'react';
import { WebSettings, HomeSection } from '../../types';
import { Megaphone, ExternalLink, Sparkles } from 'lucide-react';

interface Props {
  section?: HomeSection;
  settings: WebSettings;
}

export const MarqueeBanner: React.FC<Props> = ({ section, settings }) => {
  // If section is explicitly provided and disabled, hide it
  if (section && !section.isActive) return null;

  const config = section?.config || {};
  const text = config.text || '🎉 PROMO SPESIAL BULAN INI: DISKON HINGGA 35% & GRATIS ONGKIR SELURUH INDONESIA DENGAN KODE: NUSANTARA35! DAPATKAN VOUCHER TAMBAHAN UNTUK MEMBER BARU!';
  const link = config.linkUrl || '/promo';
  const bgColor = config.bgColor || '#0f172a';
  const textColor = config.textColor || '#fbbf24';
  const speed = config.speed ? `${config.speed}s` : '25s';

  return (
    <div
      style={{ backgroundColor: bgColor, color: textColor }}
      className="overflow-hidden whitespace-nowrap py-2 px-4 relative z-20 border-b border-slate-800 text-xs font-bold tracking-wider select-none shadow-xs"
    >
      <div className="flex items-center">
        <div
          className="inline-flex items-center gap-12 animate-marquee"
          style={{ animationDuration: speed }}
        >
          {/* Repeating segment for infinite loop effect */}
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="inline-flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] uppercase tracking-widest font-black">
                <Sparkles className="w-3 h-3 text-amber-400" />
                INFO PROMO
              </span>
              <span>{text}</span>
              {link && (
                <a
                  href={link}
                  className="underline underline-offset-2 hover:opacity-80 inline-flex items-center gap-1"
                >
                  <span>Cek Sekarang</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <span className="opacity-40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
