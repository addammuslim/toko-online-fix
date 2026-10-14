import React from 'react';
import { LoyaltyReward, Order } from '../../types';
import {
  CheckCircle2,
  Gift,
  Award,
  Sparkles,
  Truck,
  Star,
  Check,
  Calendar,
  Zap,
  Info
} from 'lucide-react';

interface Props {
  orderCount: number;
  loyaltyRewards: LoyaltyReward[];
  customerName?: string;
  totalSpent?: number;
  orders?: Order[];
  maxDisplayBoxes?: number;
  compact?: boolean;
}

export const LoyaltyStampGrid: React.FC<Props> = ({
  orderCount,
  loyaltyRewards,
  customerName,
  totalSpent,
  orders = [],
  maxDisplayBoxes = 20,
  compact = false
}) => {
  // Determine maximum boxes to render: at least 20, or highest milestone + 2
  const maxMilestone = loyaltyRewards.reduce(
    (max, r) => Math.max(max, r.orderMilestone),
    14
  );
  const totalBoxes = Math.max(maxDisplayBoxes, Math.ceil((maxMilestone + 2) / 5) * 5);

  const sortedRewards = [...loyaltyRewards].sort((a, b) => a.orderMilestone - b.orderMilestone);
  const nextReward = sortedRewards.find((r) => r.orderMilestone > orderCount);
  const ordersRemaining = nextReward ? nextReward.orderMilestone - orderCount : 0;
  const claimedRewardsCount = sortedRewards.filter((r) => r.orderMilestone <= orderCount).length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-base text-slate-900 tracking-tight">
              Kartu Stempel Loyalitas Bertingkat (Digital Stamp Matrix)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {customerName ? `Pelanggan: ${customerName} • ` : ''}
            Setiap 1 kali transaksi berhasil otomatis mendapatkan 1 cap stempel stempel di kalender
          </p>
        </div>

        {/* Progress pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-extrabold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{orderCount} Cap Stempel Terkumpul</span>
          </div>

          {nextReward ? (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>
                Kurang <strong>{ordersRemaining}x</strong> ke {nextReward.title.split(':')[0]}
              </span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 font-bold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Semua Tier Terbuka!</span>
            </div>
          )}
        </div>
      </div>

      {/* The Stamp Matrix Grid (Kotak-Kotak Kalender) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] text-slate-500">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Matriks Cap Transaksi (1 s/d {totalBoxes}):</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {claimedRewardsCount} dari {sortedRewards.length} Reward Terbuka
          </span>
        </div>

        <div className={`grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2.5 sm:gap-3`}>
          {Array.from({ length: totalBoxes }, (_, i) => {
            const boxNumber = i + 1;
            const isStamped = boxNumber <= orderCount;
            const isCurrentTarget = boxNumber === orderCount + 1;
            const milestoneReward = loyaltyRewards.find((r) => r.orderMilestone === boxNumber);

            // Optional order info if matched
            const matchedOrder = orders[boxNumber - 1];

            return (
              <div
                key={boxNumber}
                className={`relative rounded-2xl p-2.5 flex flex-col items-center justify-between transition-all duration-300 min-h-[92px] ${
                  isStamped
                    ? milestoneReward
                      ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                      : 'bg-gradient-to-b from-emerald-600 to-emerald-700 text-white shadow-sm'
                    : isCurrentTarget
                    ? 'bg-white border-2 border-emerald-500 text-slate-900 shadow-md ring-4 ring-emerald-500/20 animate-pulse'
                    : milestoneReward
                    ? 'bg-amber-50/70 border-2 border-dashed border-amber-300 text-amber-900'
                    : 'bg-slate-50 border border-slate-200 text-slate-400'
                }`}
              >
                {/* Number Badge Top */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-black ${
                      isStamped ? 'text-white/80' : isCurrentTarget ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    #{boxNumber}
                  </span>

                  {milestoneReward && (
                    <span
                      title={milestoneReward.title}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isStamped
                          ? 'bg-white text-amber-700 shadow-xs'
                          : 'bg-amber-400 text-white shadow-xs'
                      }`}
                    >
                      <Gift className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Center Stamp Mark */}
                <div className="my-auto text-center flex flex-col items-center justify-center">
                  {isStamped ? (
                    <div className="relative">
                      {/* Stamp Seal Graphic */}
                      <div className="w-9 h-9 rounded-full border-2 border-dashed border-white/90 flex flex-col items-center justify-center rotate-[-12deg] bg-white/10 backdrop-blur-xs">
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span className="text-[7px] font-black uppercase tracking-tighter">CAP #{boxNumber}</span>
                      </div>
                    </div>
                  ) : isCurrentTarget ? (
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-0.5">
                        🎯
                      </div>
                      <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-tight">
                        Berikutnya
                      </span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-300 text-[10px]">
                      {boxNumber}
                    </div>
                  )}
                </div>

                {/* Bottom Reward description if milestone */}
                {milestoneReward ? (
                  <div className="w-full text-center mt-1">
                    <span
                      className={`block text-[9px] font-black truncate px-1 py-0.5 rounded leading-tight ${
                        isStamped
                          ? 'bg-black/20 text-white'
                          : 'bg-amber-200/60 text-amber-900 font-extrabold'
                      }`}
                      title={milestoneReward.rewardDescription}
                    >
                      {milestoneReward.rewardType === 'discount_percent'
                        ? `Diskon ${milestoneReward.discountPercent}%`
                        : milestoneReward.rewardType === 'free_shipping'
                        ? 'Gratis Ongkir'
                        : milestoneReward.rewardType === 'fixed_cashback'
                        ? `Cashback Rp ${(milestoneReward.cashbackAmount || 0) / 1000}k`
                        : 'Hadiah Baju'}
                    </span>
                  </div>
                ) : (
                  <span
                    className={`text-[8px] font-bold ${
                      isStamped ? 'text-white/60' : 'text-slate-300'
                    }`}
                  >
                    {isStamped ? 'Selesai' : 'Belum Cap'}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards Catalog Legend */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Daftar Jenjang Reward Loyalitas Anda:</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sortedRewards.map((reward) => {
            const isUnlocked = orderCount >= reward.orderMilestone;
            return (
              <div
                key={reward.id}
                className={`p-3.5 rounded-xl border flex items-start gap-3 transition ${
                  isUnlocked
                    ? 'bg-white border-emerald-300 shadow-xs ring-1 ring-emerald-400/30'
                    : 'bg-white/80 border-slate-200 opacity-80'
                }`}
              >
                <div
                  style={{ backgroundColor: reward.badgeColor || '#10b981' }}
                  className="w-8 h-8 rounded-xl text-white flex items-center justify-center flex-shrink-0 font-bold text-xs shadow-xs"
                >
                  #{reward.orderMilestone}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {reward.title}
                    </span>
                    {isUnlocked ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 flex-shrink-0">
                        ✓ TERCAPAI
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 flex-shrink-0 font-mono">
                        -{reward.orderMilestone - orderCount}x lagi
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {reward.rewardDescription}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
