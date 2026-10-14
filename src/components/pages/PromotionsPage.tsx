import React, { useState } from 'react';
import { Promotion, LoyaltyReward, Customer } from '../../types';
import { LoyaltyStampGrid } from '../loyalty/LoyaltyStampGrid';
import {
  Tag,
  Copy,
  Check,
  Sparkles,
  Award,
  Gift,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Percent,
  Truck,
  Users
} from 'lucide-react';

interface Props {
  promotions: Promotion[];
  loyaltyRewards: LoyaltyReward[];
  currentCustomer: Customer | null;
  onOpenAuth: () => void;
  onNavigate: (view: string, params?: any) => void;
}

export const PromotionsPage: React.FC<Props> = ({
  promotions,
  loyaltyRewards,
  currentCustomer,
  onOpenAuth,
  onNavigate
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedPromoId, setExpandedPromoId] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const activePromos = promotions.filter((p) => p.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 animate-fadeIn space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Katalog Promo & Reward Nusantara</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Voucher Belanja & Program Loyalty Pelanggan
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Gunakan kode promo aktif saat checkout atau kumpulkan transaksi belanja untuk membuka reward diskon hingga 20% dan hadiah baju eksklusif gratis.
        </p>
      </div>

      {/* LOYALTY PROGRAM TIER BANNER */}
      <section className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest block">
              Program Member Bertingkat
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Tingkat Reward Loyalitas Pelanggan
            </h2>
          </div>

          {currentCustomer ? (
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-300 block">Status Akun Anda:</span>
                <strong className="text-emerald-400 text-xs">{currentCustomer.name}</strong>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black">
                {currentCustomer.orderCount}x Order
              </span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition shadow-md"
            >
              Masuk / Daftar untuk Cek Reward
            </button>
          )}
        </div>

        {/* Multi-Tier Milestones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loyaltyRewards.map((tier) => (
            <div
              key={tier.id}
              className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-400/50 transition space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ backgroundColor: tier.badgeColor || '#10b981' }}
                  className="w-8 h-8 rounded-xl text-white flex items-center justify-center font-black text-xs shadow-xs"
                >
                  #{tier.orderMilestone}
                </span>
                <span className="text-[11px] font-mono text-emerald-300 font-bold bg-white/10 px-2.5 py-0.5 rounded-full">
                  Target: {tier.orderMilestone}x Belanja
                </span>
              </div>
              <h3 className="font-extrabold text-base text-white">{tier.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{tier.rewardDescription}</p>
            </div>
          ))}
        </div>

        {/* Digital Stamp Matrix Grid Preview */}
        <div className="pt-2">
          <LoyaltyStampGrid
            orderCount={currentCustomer ? currentCustomer.orderCount : 0}
            loyaltyRewards={loyaltyRewards}
            customerName={currentCustomer ? currentCustomer.name : undefined}
          />
        </div>
      </section>

      {/* ACTIVE VOUCHER CARDS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-600" />
            <span>Kupon & Voucher Diskon Aktif</span>
          </h2>
          <span className="text-xs text-slate-500">
            Tersedia {activePromos.length} penawaran spesial
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePromos.map((promo) => {
            const isExpanded = expandedPromoId === promo.id;

            let iconColor = 'bg-emerald-50 text-emerald-700';
            if (promo.type === 'free_shipping') iconColor = 'bg-blue-50 text-blue-700';
            if (promo.type === 'percentage') iconColor = 'bg-amber-50 text-amber-700';

            return (
              <div
                key={promo.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`p-2.5 rounded-xl ${iconColor} flex items-center justify-center font-bold`}
                    >
                      {promo.type === 'free_shipping' ? (
                        <Truck className="w-5 h-5" />
                      ) : (
                        <Percent className="w-5 h-5" />
                      )}
                    </span>
                    {promo.isForNewMembersOnly && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 uppercase">
                        Member Baru
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-base text-slate-900">{promo.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{promo.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {/* Voucher code box & copy button */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Kode Kupon:
                      </span>
                      <strong className="font-mono text-sm text-slate-900 tracking-wider">
                        {promo.code}
                      </strong>
                    </div>
                    <button
                      onClick={() => handleCopy(promo.code)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center gap-1"
                    >
                      {copiedCode === promo.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* S&K Accordion */}
                  <div>
                    <button
                      onClick={() => setExpandedPromoId(isExpanded ? null : promo.id)}
                      className="w-full flex items-center justify-between text-[11px] font-bold text-slate-600 hover:text-emerald-700 py-1"
                    >
                      <span>Lihat Syarat & Ketentuan (S&K)</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <ul className="mt-2 space-y-1 text-[11px] text-slate-500 pl-4 list-disc bg-slate-50 p-3 rounded-xl border border-slate-200 animate-fadeIn">
                        {promo.termsAndConditions.map((tc, i) => (
                          <li key={i}>{tc}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
