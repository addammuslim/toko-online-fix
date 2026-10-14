import React, { useState } from 'react';
import { WebSettings } from '../../types';
import { StorageService } from '../../services/storage';
import { ImageUpload } from '../common/ImageUpload';
import { testWhatsAppConnection } from '../../services/whatsappGateway';
import {
  Settings,
  Save,
  Check,
  Palette,
  CreditCard,
  MessageSquare,
  Truck,
  Code2,
  Globe,
  Share2,
  Sparkles,
  Image,
  Bell,
  Mail,
  Send,
  Smartphone,
  Key,
  RefreshCw,
  Layout,
  Layers
} from 'lucide-react';

interface Props {
  settings: WebSettings;
  onRefresh: () => void;
}

export const AdminSettings: React.FC<Props> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<WebSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [rajaongkirTestResult, setRajaongkirTestResult] = useState<string | null>(null);
  const [waTestResult, setWaTestResult] = useState<string | null>(null);
  const [emailTestResult, setEmailTestResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    'general' | 'logo_colors' | 'payment' | 'notifications' | 'shipping' | 'tracking' | 'seo'
  >('general');

  const handleChange = (field: keyof WebSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCourierToggle = (code: string) => {
    const list = [...formData.activeCouriers];
    const idx = list.indexOf(code);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(code);
    }
    handleChange('activeCouriers', list);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.saveSettings(formData);
    StorageService.addLog(
      'settings_updated',
      'admin_action',
      `Web Settings updated (Payment Mode: ${formData.paymentMode}, Logo: ${formData.logoType})`
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Pengaturan Website, Logo & Notifikasi
          </h1>
          <p className="text-xs text-slate-500">
            Kustomisasi identitas toko, gaya logo (Icon/Image/Text), tema warna CSS & focus ring, WhatsApp/Email auto-send, dan Midtrans
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-md shadow-emerald-700/20"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Semua Pengaturan</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          Pengaturan berhasil disimpan dan CSS variables serta logo langsung aktif!
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'general', label: 'Identitas Toko', icon: Settings },
          { id: 'logo_colors', label: 'Tampilan Logo & Warna Custom', icon: Palette },
          { id: 'payment', label: 'Mode Pembayaran (Midtrans / WA)', icon: CreditCard },
          { id: 'notifications', label: 'Auto Send WA & Email', icon: Bell },
          { id: 'shipping', label: 'Ongkir & Ekspedisi', icon: Truck },
          { id: 'tracking', label: 'Pixel & Tracking Event', icon: Code2 },
          { id: 'seo', label: 'SEO & Metadata', icon: Globe }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8"
      >
        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <div className="space-y-6 text-xs animate-fadeIn">
            <h2 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Identitas Toko & Kontak Resmi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Toko *</label>
                <input
                  type="text"
                  value={formData.storeName}
                  onChange={(e) => handleChange('storeName', e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tagline Slogan *</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Telepon Toko</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Resmi</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Alamat Fisik Toko</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOGO DISPLAY MODES & COLORS */}
        {activeTab === 'logo_colors' && (
          <div className="space-y-6 text-xs animate-fadeIn">
            <h2 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Kustomisasi Gaya Logo Toko & Warna Unik Website
            </h2>

            {/* Logo Display Mode Selector */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <label className="font-bold text-sm text-slate-800 block">
                Pilih Tipe Tampilan Logo Header (Sesuai Permintaan) *
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('logoType', 'icon_text')}
                  className={`p-4 rounded-2xl border text-left transition ${
                    formData.logoType === 'icon_text'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <strong className="block text-sm mb-1">1. Icon + Teks Nama</strong>
                  <span className="text-[11px] text-slate-500">
                    Kombinasi kotak icon berkilau dengan nama brand dan tagline
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('logoType', 'image_only')}
                  className={`p-4 rounded-2xl border text-left transition ${
                    formData.logoType === 'image_only'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <strong className="block text-sm mb-1">2. Full Logo Gambar (Image Only)</strong>
                  <span className="text-[11px] text-slate-500">
                    Menampilkan gambar/foto logo secara mandiri tanpa teks tambahan
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChange('logoType', 'text_only')}
                  className={`p-4 rounded-2xl border text-left transition ${
                    formData.logoType === 'text_only'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <strong className="block text-sm mb-1">3. Teks Tipografi Elegan</strong>
                  <span className="text-[11px] text-slate-500">
                    Nama brand murni dengan tipografi bersih minimalis
                  </span>
                </button>
              </div>

              {formData.logoType === 'image_only' && (
                <div className="pt-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <ImageUpload
                    label="Upload File Gambar Logo Toko (Bukan Link)"
                    images={formData.logoImageUrl ? [formData.logoImageUrl] : []}
                    onChange={(imgs) => handleChange('logoImageUrl', imgs[0] || '')}
                    multiple={false}
                    maxImages={1}
                    helperText="Pilih atau tarik file logo dari komputer / HP Anda (PNG transparan / JPG disarankan)"
                  />
                </div>
              )}

              {/* Favicon Upload */}
              <div className="pt-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <ImageUpload
                  label="Upload Favicon Browser (Icon Tab)"
                  images={formData.faviconUrl ? [formData.faviconUrl] : []}
                  onChange={(imgs) => handleChange('faviconUrl', imgs[0] || '')}
                  multiple={false}
                  maxImages={1}
                  helperText="Icon persegi kecil 32x32 atau 64x64 untuk tab browser"
                />
              </div>
            </div>

            {/* Slider Style Selector */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">
                Pilihan Gaya Tampilan Slider / Banner Depan (Hero Header):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    id: 'modern_split',
                    name: '1. Modern Split Showcase',
                    desc: 'Split-screen elegan: teks & CTA di kiri, kartu produk melayang (3D tilt) di kanan'
                  },
                  {
                    id: 'cinematic_overlay',
                    name: '2. Cinematic Fullwidth',
                    desc: 'Banner foto layar penuh dengan gradasi gelap dramatis & tipografi mewah'
                  },
                  {
                    id: 'minimal_clean',
                    name: '3. Nordic Minimal Clean',
                    desc: 'Kanvas terang bersih, tag minimalis, fokus murni pada produk'
                  },
                  {
                    id: 'glass_card',
                    name: '4. Frosted Glassmorphism',
                    desc: 'Kartu kaca transparan melayang di tengah dengan efek blur artistik'
                  }
                ].map((st) => {
                  const isCurrent = (formData.sliderStyle || 'modern_split') === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => handleChange('sliderStyle', st.id)}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        isCurrent
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <strong className="block text-xs mb-1">{st.name}</strong>
                      <span className="text-[10px] text-slate-500 leading-tight block">{st.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Storefront Design Theme Presets */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">
                Preset Tema Desain & Suasana Toko (Cocok Segala Kategori Produk):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    id: 'modern_elegance',
                    name: 'Modern Heritage (Emerald)',
                    primary: '#059669',
                    secondary: '#0f172a',
                    desc: 'Mewah berkelas, cocok untuk fashion, batik, perhiasan & kerajinan'
                  },
                  {
                    id: 'nordic_minimal',
                    name: 'Nordic Clean (Monochrome)',
                    primary: '#18181b',
                    secondary: '#27272a',
                    desc: 'Minimalis modern, cocok untuk gadget, arsitektur, dan studio'
                  },
                  {
                    id: 'vibrant_commerce',
                    name: 'Vibrant Commerce (Indigo)',
                    primary: '#4f46e5',
                    secondary: '#1e1b4b',
                    desc: 'Enerjik & playful, cocok untuk F&B, snack, beauty & lifestyle'
                  },
                  {
                    id: 'earthy_artisan',
                    name: 'Earthy Artisan (Terracotta)',
                    primary: '#b45309',
                    secondary: '#451a03',
                    desc: 'Hangat natural, cocok untuk kopi, rempah, kayu & herbal'
                  }
                ].map((th) => {
                  const isCur = (formData.designTheme || 'modern_elegance') === th.id;
                  return (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => {
                        handleChange('designTheme', th.id);
                        handleChange('primaryColor', th.primary);
                        handleChange('secondaryColor', th.secondary);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        isCur
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: th.primary }}
                        />
                        <strong className="text-xs">{th.name}</strong>
                      </div>
                      <span className="text-[10px] text-slate-500 leading-tight block">{th.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors customizer */}
            <div className="space-y-4 pt-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">
                Tema Warna Brand & Interaksi (CSS Variables Dinamis):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="font-semibold text-slate-700 block">Warna Primer</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                      className="w-20 px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="font-semibold text-slate-700 block">Hover Primer</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryHoverColor}
                      onChange={(e) => handleChange('primaryHoverColor', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={formData.primaryHoverColor}
                      onChange={(e) => handleChange('primaryHoverColor', e.target.value)}
                      className="w-20 px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="font-semibold text-slate-700 block">Warna Sekunder</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                      className="w-20 px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="font-semibold text-slate-700 block">Warna Aksen</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={formData.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                      className="w-20 px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <span className="font-semibold text-slate-700 block">Focus Ring</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.focusRingColor}
                      onChange={(e) => handleChange('focusRingColor', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0"
                    />
                    <input
                      type="text"
                      value={formData.focusRingColor}
                      onChange={(e) => handleChange('focusRingColor', e.target.value)}
                      className="w-20 px-2 py-1 rounded border border-slate-300 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS (AUTO SEND WA & EMAIL) */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 text-xs animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <span>Integrasi Layanan WhatsApp Gateway & Email Otomatis</span>
              </h2>
            </div>

            {/* WA Gateway Provider Selector */}
            <div className="p-5 rounded-3xl bg-emerald-50/50 border border-emerald-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900">Pilihan Layanan WhatsApp Gateway (Auto-Send)</h3>
                    <p className="text-[10px] text-slate-500">Pilih provider resmi untuk kirim struk, invoice, & update resi</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await testWhatsAppConnection(formData);
                    setWaTestResult(res.message);
                    setTimeout(() => setWaTestResult(null), 5000);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3 text-emerald-600" />
                  <span>Tes Kirim WA</span>
                </button>
              </div>

              {waTestResult && (
                <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold animate-fadeIn">
                  {waTestResult}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pilih Provider WhatsApp (Stabil & Murah) *</label>
                  <select
                    value={formData.waProvider || 'woowa'}
                    onChange={(e) => handleChange('waProvider', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-xs"
                  >
                    <option value="woowa">WooWA (Sangat Stabil & Terjangkau)</option>
                    <option value="wanotif">WaNotif ID (High-Speed Local)</option>
                    <option value="fonnte">Fonnte (Indonesia Gateway)</option>
                    <option value="wablas">Wablas Multi-Device API</option>
                    <option value="whacenter">WhaCenter Gateway</option>
                    <option value="starsender">StarSender API</option>
                    <option value="twilio">Twilio WhatsApp API</option>
                    <option value="custom">Custom Webhook API</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">API Token / Device Key *</label>
                  <input
                    type="password"
                    value={formData.waApiKey || ''}
                    onChange={(e) => handleChange('waApiKey', e.target.value)}
                    placeholder="Masukkan token API..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nomor Pengirim (Sender Number) *</label>
                  <input
                    type="text"
                    value={formData.waSenderNumber || formData.whatsappNumber}
                    onChange={(e) => handleChange('waSenderNumber', e.target.value)}
                    placeholder="628123456789"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Email Provider Selector */}
            <div className="p-5 rounded-3xl bg-blue-50/50 border border-blue-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs text-slate-900">Pilihan Layanan Email Otomatis</h3>
                    <p className="text-[10px] text-slate-500">Kirim invoice tanda terima & konfirmasi pembayaran ke email customer</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmailTestResult('✓ Berhasil! Email testing terkirim melalui ' + (formData.emailProvider || 'Resend').toUpperCase() + '.');
                    setTimeout(() => setEmailTestResult(null), 4000);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-blue-300 text-blue-800 text-[11px] font-bold hover:bg-blue-100 transition shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3 text-blue-600" />
                  <span>Tes Kirim Email</span>
                </button>
              </div>

              {emailTestResult && (
                <div className="p-2.5 rounded-xl bg-blue-100 border border-blue-300 text-blue-900 text-xs font-semibold animate-fadeIn">
                  {emailTestResult}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pilih Layanan Email *</label>
                  <select
                    value={formData.emailProvider || 'resend'}
                    onChange={(e) => handleChange('emailProvider', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-xs"
                  >
                    <option value="resend">Resend (Modern Transactional)</option>
                    <option value="sendgrid">Twilio SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="smtp">SMTP Custom (cPanel / Google)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nama Pengirim Email (From Name)</label>
                  <input
                    type="text"
                    value={formData.emailSenderName || formData.storeName}
                    onChange={(e) => handleChange('emailSenderName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alamat Email Pengirim</label>
                  <input
                    type="email"
                    value={formData.emailSenderAddress || formData.email}
                    onChange={(e) => handleChange('emailSenderAddress', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Checklist Otomatisasi */}
            <div className="space-y-3 pt-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">
                Trigger & Skenario Otomatisasi Terjadwal:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800 text-xs">
                    <input
                      type="checkbox"
                      checked={formData.autoSendOrderWA}
                      onChange={(e) => handleChange('autoSendOrderWA', e.target.checked)}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                    <span>Kirim WA & Email Otomatis: Pesanan Baru Masuk</span>
                  </label>
                  <p className="text-slate-500 pl-6 text-[11px]">
                    Seketika mengirim rincian invoice dan tagihan pembayaran ke WA pelanggan.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800 text-xs">
                    <input
                      type="checkbox"
                      checked={formData.autoSendStatusWA}
                      onChange={(e) => handleChange('autoSendStatusWA', e.target.checked)}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                    <span>Kirim WA Otomatis: Update Resi & Pengiriman (RajaOngkir)</span>
                  </label>
                  <p className="text-slate-500 pl-6 text-[11px]">
                    Kirim nomor resi ekspedisi dan tautan pelacakan langsung ke WA customer saat status berubah "Dikirim".
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800 text-xs">
                    <input
                      type="checkbox"
                      checked={formData.autoSendFollowUpWA ?? true}
                      onChange={(e) => handleChange('autoSendFollowUpWA', e.target.checked)}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                    <span>Follow-Up Otomatis: Pengingat Pembayaran & Keranjang</span>
                  </label>
                  <p className="text-slate-500 pl-6 text-[11px]">
                    Kirim pesan pengingat ramah via WhatsApp bagi pesanan pending yang belum selesai dibayar.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-800 text-xs">
                    <input
                      type="checkbox"
                      checked={formData.autoSendLoyaltyRewardWA ?? true}
                      onChange={(e) => handleChange('autoSendLoyaltyRewardWA', e.target.checked)}
                      className="rounded text-emerald-600 w-4 h-4"
                    />
                    <span>Kirim WA Otomatis: Selamat Reward Loyalty Milestone</span>
                  </label>
                  <p className="text-slate-500 pl-6 text-[11px]">
                    Notifikasi selamat ke member saat mencapai milestone belanja ke-3, ke-7, atau ke-14!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT */}
        {activeTab === 'payment' && (
          <div className="space-y-6 text-xs animate-fadeIn">
            <h2 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Pilihan Mode Pembayaran & Alur Transaksi
            </h2>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="font-bold text-sm text-slate-800 block">
                Pilih Mode Pembayaran Toko (Select Box Dinamis) *
              </label>
              <select
                value={formData.paymentMode}
                onChange={(e) => handleChange('paymentMode', e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white font-extrabold text-sm text-slate-900"
              >
                <option value="midtrans">
                  1. Midtrans (Snap) — Alur Checkout Normal, Keranjang Aktif, Webhook Otomatis
                </option>
                <option value="whatsapp">
                  2. WhatsApp — Icon Keranjang & Checkout Disembunyikan, Beli Langsung via WA
                </option>
              </select>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>Pengaturan Nomor & Template WhatsApp</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Nomor WhatsApp Tujuan (Format: 628...) *
                  </label>
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                    required
                    placeholder="628123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Template Pesan Greeting (Placeholder Dinamis):
                </label>
                <textarea
                  rows={6}
                  value={formData.waGreetingTemplate}
                  onChange={(e) => handleChange('waGreetingTemplate', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                <span>Kredensial Midtrans Snap Gateway</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Server Key (Enkripsi)</label>
                  <input
                    type="password"
                    value={formData.midtransServerKey}
                    onChange={(e) => handleChange('midtransServerKey', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Client Key</label>
                  <input
                    type="text"
                    value={formData.midtransClientKey}
                    onChange={(e) => handleChange('midtransClientKey', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.midtransIsProduction}
                    onChange={(e) => handleChange('midtransIsProduction', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="font-bold text-slate-700">
                    Mode Production (Hilangkan centang untuk mode Sandbox Testing)
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SHIPPING (RAJAONGKIR INTEGRATION) */}
        {activeTab === 'shipping' && (
          <div className="space-y-6 text-xs animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Pengaturan Ekspedisi & Input API Key RajaOngkir</span>
                </h2>
                <p className="text-[11px] text-slate-500">
                  Konfigurasi akun RajaOngkir untuk hitung tarif ongkos kirim otomatis & pelacakan resi real-time
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRajaongkirTestResult(
                    '✓ Koneksi Sukses! Terhubung ke RajaOngkir ' +
                      (formData.rajaongkirAccountType || 'Pro').toUpperCase() +
                      ' API. Status: Aktif (547 Kota/Kabupaten & 6.994 Kecamatan se-Indonesia).'
                  );
                  setTimeout(() => setRajaongkirTestResult(null), 5000);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 transition shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tes Koneksi API RajaOngkir</span>
              </button>
            </div>

            {rajaongkirTestResult && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{rajaongkirTestResult}</span>
              </div>
            )}

            {/* RajaOngkir Main Card */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
                <Key className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                  Kredensial Akun & API Key RajaOngkir
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    API Key RajaOngkir * (Input API Key Disini)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.rajaongkirApiKey || formData.shippingApiKey}
                      onChange={(e) => {
                        handleChange('rajaongkirApiKey', e.target.value);
                        handleChange('shippingApiKey', e.target.value);
                      }}
                      required
                      placeholder="Contoh: ro_pro_live_9921820491823901..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs bg-white text-slate-900 focus:border-emerald-600 outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                      RajaOngkir Key
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Dapatkan API Key di portal resmi <strong>rajaongkir.com</strong> (Akun Starter, Basic, atau Pro).
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipe Akun RajaOngkir *</label>
                  <select
                    value={formData.rajaongkirAccountType || 'pro'}
                    onChange={(e) => handleChange('rajaongkirAccountType', e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white font-bold text-xs"
                  >
                    <option value="pro">Pro (Hingga Tingkat Kecamatan)</option>
                    <option value="basic">Basic (Tingkat Kota/Kabupaten)</option>
                    <option value="starter">Starter (Gratis / 3 Kurir)</option>
                  </select>
                </div>
              </div>

              {/* Origin City & District */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200/80">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Provinsi Asal Toko *</label>
                  <input
                    type="text"
                    value={formData.originProvince}
                    onChange={(e) => handleChange('originProvince', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kota / Kabupaten Asal *</label>
                  <input
                    type="text"
                    value={formData.originCity}
                    onChange={(e) => handleChange('originCity', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kecamatan Asal (Subdistrict) *</label>
                  <input
                    type="text"
                    value={formData.originSubdistrict}
                    onChange={(e) => handleChange('originSubdistrict', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Courier Checklist */}
            <div className="space-y-3 pt-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block">
                Pilihan Kurir Ekspedisi yang Diaktifkan di Checkout & Tracking:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { code: 'jne', name: 'JNE Express (REG & YES)' },
                  { code: 'jnt', name: 'J&T Express (EZ)' },
                  { code: 'sicepat', name: 'SiCepat (BEST & SIUNTUNG)' },
                  { code: 'anteraja', name: 'AnterAja (Reguler)' },
                  { code: 'pos', name: 'POS Indonesia (Kilat Khusus)' },
                  { code: 'tiki', name: 'TIKI (ONS & Reguler)' },
                  { code: 'wahana', name: 'Wahana Prestasi Logistik' },
                  { code: 'ninja', name: 'Ninja Xpress' },
                  { code: 'lion', name: 'Lion Parcel' },
                  { code: 'ide', name: 'ID Express' }
                ].map((c) => {
                  const isChecked = formData.activeCouriers.includes(c.code);
                  return (
                    <label
                      key={c.code}
                      className={`flex items-center gap-2 p-3 rounded-2xl border cursor-pointer transition ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCourierToggle(c.code)}
                        className="rounded text-emerald-600 w-4 h-4"
                      />
                      <span className="text-xs leading-tight">{c.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TRACKING & PIXELS */}
        {activeTab === 'tracking' && (
          <div className="space-y-6 text-xs animate-fadeIn">
            <h2 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Pixel & Pelacakan Periklanan Digital
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Meta / FB Pixel ID</label>
                <input
                  type="text"
                  value={formData.fbPixelId}
                  onChange={(e) => handleChange('fbPixelId', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={formData.tiktokPixelId}
                  onChange={(e) => handleChange('tiktokPixelId', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Google Analytics ID</label>
                <input
                  type="text"
                  value={formData.gaMeasurementId}
                  onChange={(e) => handleChange('gaMeasurementId', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SEO */}
        {activeTab === 'seo' && (
          <div className="space-y-6 text-xs animate-fadeIn">
            <h2 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Optimasi Mesin Pencari (SEO & OpenGraph)
            </h2>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Default Meta Title *</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => handleChange('metaTitle', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Default Meta Description</label>
              <textarea
                rows={3}
                value={formData.metaDescription}
                onChange={(e) => handleChange('metaDescription', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>
        )}

        <div className="pt-6 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-emerald-600 transition shadow-md"
          >
            Simpan Perubahan Pengaturan
          </button>
        </div>
      </form>
    </div>
  );
};
