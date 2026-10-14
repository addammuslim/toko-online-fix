import React, { useState } from 'react';
import { Promotion, LoyaltyReward, PromoType } from '../../types';
import { StorageService } from '../../services/storage';
import { LoyaltyStampGrid } from '../loyalty/LoyaltyStampGrid';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  Check,
  Percent,
  Truck,
  Sparkles,
  Award,
  Gift,
  Copy,
  Users
} from 'lucide-react';

interface Props {
  promotions: Promotion[];
  loyaltyRewards: LoyaltyReward[];
  onRefresh: () => void;
}

export const AdminPromotions: React.FC<Props> = ({
  promotions,
  loyaltyRewards,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'vouchers' | 'loyalty'>('vouchers');
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isEditingPromo, setIsEditingPromo] = useState<Promotion | null>(null);

  // Form states for voucher
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PromoType>('percentage');
  const [value, setValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(0);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number | undefined>(50000);
  const [isForNewMembersOnly, setIsForNewMembersOnly] = useState(false);
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [usageLimit, setUsageLimit] = useState<number>(500);
  const [termsText, setTermsText] = useState('Minimal belanja berlaku\n1 kali per akun member\nTidak dapat digabung promo lain');
  const [isActive, setIsActive] = useState(true);

  // Loyalty rewards editing state
  const [localRewards, setLocalRewards] = useState<LoyaltyReward[]>(loyaltyRewards);

  const handleOpenCreatePromo = () => {
    setIsEditingPromo(null);
    setCode(`PROMO${Math.floor(10 + Math.random() * 90)}`);
    setTitle('');
    setDescription('');
    setType('percentage');
    setValue(15);
    setMinOrderAmount(0);
    setMaxDiscountAmount(50000);
    setIsForNewMembersOnly(false);
    setStartDate(new Date().toISOString().slice(0, 10));
    setEndDate('2026-12-31');
    setUsageLimit(500);
    setTermsText('Minimal belanja produk berlaku\nKhusus checkout di website\nBerlaku selama kuota tersedia');
    setIsActive(true);
    setIsPromoModalOpen(true);
  };

  const handleOpenEditPromo = (p: Promotion) => {
    setIsEditingPromo(p);
    setCode(p.code);
    setTitle(p.title);
    setDescription(p.description);
    setType(p.type);
    setValue(p.value);
    setMinOrderAmount(p.minOrderAmount);
    setMaxDiscountAmount(p.maxDiscountAmount);
    setIsForNewMembersOnly(p.isForNewMembersOnly);
    setStartDate(p.startDate);
    setEndDate(p.endDate);
    setUsageLimit(p.usageLimit);
    setTermsText(p.termsAndConditions.join('\n'));
    setIsActive(p.isActive);
    setIsPromoModalOpen(true);
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    const terms = termsText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPromo: Promotion = {
      id: isEditingPromo ? isEditingPromo.id : `promo-${Date.now()}`,
      code: code.trim().toUpperCase(),
      title,
      description,
      type,
      value: Number(value),
      minOrderAmount: Number(minOrderAmount),
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
      isForNewMembersOnly,
      startDate,
      endDate,
      usageLimit: Number(usageLimit),
      usageCount: isEditingPromo ? isEditingPromo.usageCount : 0,
      termsAndConditions: terms,
      isActive
    };

    if (isEditingPromo) {
      StorageService.updatePromotion(newPromo);
    } else {
      StorageService.addPromotion(newPromo);
    }

    StorageService.addLog(
      isEditingPromo ? 'promo_updated' : 'promo_created',
      'admin_action',
      `Voucher promo "${newPromo.code}" berhasil disimpan`
    );

    setIsPromoModalOpen(false);
    onRefresh();
  };

  const handleDeletePromo = (id: string, promoCode: string) => {
    if (confirm(`Hapus voucher promo "${promoCode}"?`)) {
      StorageService.deletePromotion(id);
      StorageService.addLog('promo_deleted', 'admin_action', `Voucher "${promoCode}" dihapus`);
      onRefresh();
    }
  };

  const handleSaveLoyalty = () => {
    StorageService.saveLoyaltyRewards(localRewards);
    StorageService.addLog('loyalty_rewards_updated', 'admin_action', 'Konfigurasi reward loyalty pelanggan diperbarui');
    alert('Aturan reward loyalty pelanggan berhasil disimpan!');
    onRefresh();
  };

  const handleAddTier = () => {
    const nextMilestone = localRewards.length > 0
      ? Math.max(...localRewards.map((r) => r.orderMilestone)) + 3
      : 3;
    const newTier: LoyaltyReward = {
      id: `tier-${Date.now()}`,
      orderMilestone: nextMilestone,
      title: `Pembelian Ke-${nextMilestone}: Diskon ${Math.min(30, nextMilestone * 2)}%`,
      rewardDescription: `Reward spesial bagi member setia untuk pembelanjaan ke-${nextMilestone}!`,
      rewardType: 'discount_percent',
      discountPercent: 15,
      badgeColor: '#10b981',
      isActive: true
    };
    const updated = [...localRewards, newTier].sort((a, b) => a.orderMilestone - b.orderMilestone);
    setLocalRewards(updated);
  };

  const handleDeleteTier = (id: string) => {
    if (confirm('Hapus tier reward loyalty ini?')) {
      const updated = localRewards.filter((r) => r.id !== id);
      setLocalRewards(updated);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Promosi & Loyalty Reward
          </h1>
          <p className="text-xs text-slate-500">
            Kelola kupon diskon (persen/nominal, gratis ongkir, member baru) dan skema reward loyalitas bertingkat
          </p>
        </div>

        {activeTab === 'vouchers' && (
          <button
            onClick={handleOpenCreatePromo}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Voucher Promo Baru</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('vouchers')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'vouchers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Daftar Voucher & Promo ({promotions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('loyalty')}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
            activeTab === 'loyalty'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Reward Loyalty Bertingkat (Tingkat 1, 2, 3)</span>
        </button>
      </div>

      {/* TAB 1: VOUCHERS LIST */}
      {activeTab === 'vouchers' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Kode Kupon</th>
                <th className="py-3.5 px-4">Judul & Tipe</th>
                <th className="py-3.5 px-4">Nilai Potongan</th>
                <th className="py-3.5 px-4">Minimal Order</th>
                <th className="py-3.5 px-4">Target Khusus</th>
                <th className="py-3.5 px-4">Pemakaian</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promotions.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                      {p.code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <strong className="block text-slate-900">{p.title}</strong>
                    <span className="text-[11px] text-slate-400 capitalize">Tipe: {p.type.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">
                    {p.type === 'percentage'
                      ? `${p.value}% (Maks Rp ${(p.maxDiscountAmount || 0).toLocaleString('id-ID')})`
                      : `Rp ${p.value.toLocaleString('id-ID')}`}
                  </td>
                  <td className="py-3.5 px-4">
                    {p.minOrderAmount === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-[10px]">
                        Tanpa Minimal
                      </span>
                    ) : (
                      `Rp ${p.minOrderAmount.toLocaleString('id-ID')}`
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {p.isForNewMembersOnly ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                        Khusus Member Baru
                      </span>
                    ) : (
                      <span className="text-slate-500">Semua Pelanggan</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {p.usageCount} / {p.usageLimit}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.isActive ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditPromo(p)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePromo(p.id, p.code)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: LOYALTY PROGRAM REWARDS */}
      {activeTab === 'loyalty' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-black text-base text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Konfigurasi Reward Bertingkat Pelanggan (Multi-Tier Loyalty)</span>
              </h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Bebas tambah jenjang loyalty sebanyak mungkin (bisa lebih dari 3 tingkat: order ke-1, 2, 3, 5, 7, 10, 14, 20, dll).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddTier}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>+ Tambah Tier Loyalty Baru</span>
              </button>
              <button
                type="button"
                onClick={handleSaveLoyalty}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition shadow-xs"
              >
                Simpan Semua Aturan
              </button>
            </div>
          </div>

          {/* Cards for each tier */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {localRewards.map((rew, idx) => (
              <div
                key={rew.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5 relative group hover:border-emerald-400 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      style={{ backgroundColor: rew.badgeColor || '#10b981' }}
                      className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs shadow-xs"
                    >
                      #{rew.orderMilestone}
                    </span>
                    <span className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px]">
                      Jenjang Tier #{idx + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteTier(rew.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 transition"
                    title="Hapus Tier"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">
                      Milestone (Order Ke-X):
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={rew.orderMilestone}
                      onChange={(e) => {
                        const copy = [...localRewards];
                        copy[idx].orderMilestone = Number(e.target.value);
                        setLocalRewards(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-black text-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Warna Badge:</label>
                    <input
                      type="color"
                      value={rew.badgeColor || '#10b981'}
                      onChange={(e) => {
                        const copy = [...localRewards];
                        copy[idx].badgeColor = e.target.value;
                        setLocalRewards(copy);
                      }}
                      className="w-full h-8 rounded-xl border border-slate-300 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Judul Reward:</label>
                  <input
                    type="text"
                    value={rew.title}
                    onChange={(e) => {
                      const copy = [...localRewards];
                      copy[idx].title = e.target.value;
                      setLocalRewards(copy);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-600 block mb-1">Tipe Reward:</label>
                  <select
                    value={rew.rewardType}
                    onChange={(e) => {
                      const copy = [...localRewards];
                      copy[idx].rewardType = e.target.value as any;
                      setLocalRewards(copy);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-semibold"
                  >
                    <option value="discount_percent">Diskon Persentase (%)</option>
                    <option value="free_shipping">Gratis Ongkir Seluruh Indonesia</option>
                    <option value="fixed_cashback">Potongan Nominal / Cashback (Rp)</option>
                    <option value="free_item">Barang / Merchandise Gratis</option>
                  </select>
                </div>

                {rew.rewardType === 'discount_percent' && (
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Besar Diskon (%):</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={rew.discountPercent || 10}
                      onChange={(e) => {
                        const copy = [...localRewards];
                        copy[idx].discountPercent = Number(e.target.value);
                        setLocalRewards(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold"
                    />
                  </div>
                )}

                {rew.rewardType === 'fixed_cashback' && (
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Nominal Potongan (Rp):</label>
                    <input
                      type="number"
                      step={5000}
                      value={rew.cashbackAmount || 50000}
                      onChange={(e) => {
                        const copy = [...localRewards];
                        copy[idx].cashbackAmount = Number(e.target.value);
                        setLocalRewards(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold"
                    />
                  </div>
                )}

                {rew.rewardType === 'free_item' && (
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Nama Hadiah Produk/Item:</label>
                    <input
                      type="text"
                      value={rew.rewardItemName || ''}
                      placeholder="Contoh: Kemeja Batik Sutra Free Gift"
                      onChange={(e) => {
                        const copy = [...localRewards];
                        copy[idx].rewardItemName = e.target.value;
                        setLocalRewards(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="font-bold text-slate-600 block mb-1">
                    Deskripsi Lengkap Reward:
                  </label>
                  <textarea
                    rows={2}
                    value={rew.rewardDescription}
                    onChange={(e) => {
                      const copy = [...localRewards];
                      copy[idx].rewardDescription = e.target.value;
                      setLocalRewards(copy);
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-[11px]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Live Preview of Stamp Matrix */}
          <div className="pt-6 border-t border-slate-200">
            <div className="mb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                Live Preview Tampilan Kalender Kotak-Kotak (Frontend Customer):
              </span>
            </div>
            <LoyaltyStampGrid
              orderCount={6}
              loyaltyRewards={localRewards}
              customerName="Contoh Member (6x Transaksi)"
            />
          </div>
        </div>
      )}

      {/* CREATE / EDIT VOUCHER MODAL */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                {isEditingPromo ? `Edit Voucher ${isEditingPromo.code}` : 'Buat Voucher Promo Baru'}
              </h3>
              <button
                onClick={() => setIsPromoModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kode Voucher *</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="CONTOH: MERDEKA10"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 uppercase font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Promo *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                  >
                    <option value="percentage">Diskon Persentase (%)</option>
                    <option value="fixed">Potongan Nominal Tetap (Rp)</option>
                    <option value="free_shipping">Subsidi / Gratis Ongkir</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul Promo *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Diskon 10% Spesial Gajian..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Ringkas</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Gunakan kode ini saat checkout untuk potongan langsung..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nilai ({type === 'percentage' ? '%' : 'Rp'}) *
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Minimal Order (0 = Tanpa Min)
                  </label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Maks Diskon (Rp)
                  </label>
                  <input
                    type="number"
                    value={maxDiscountAmount || ''}
                    onChange={(e) =>
                      setMaxDiscountAmount(e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="Kosongkan jika bebas"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Syarat & Ketentuan (S&K) — Satu per baris:
                </label>
                <textarea
                  rows={3}
                  value={termsText}
                  onChange={(e) => setTermsText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-[11px]"
                />
              </div>

              <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isForNewMembersOnly}
                    onChange={(e) => setIsForNewMembersOnly(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-bold text-slate-700">Khusus Akun Member Baru</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-bold text-slate-700">Aktifkan Voucher Ini</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-emerald-600 transition"
                >
                  Simpan Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
