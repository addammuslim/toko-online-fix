import React, { useState } from 'react';
import { CustomPage, WebSettings } from '../../types';
import { StorageService } from '../../services/storage';
import { ImageUpload } from '../common/ImageUpload';
import {
  FileText,
  Save,
  Check,
  Sparkles,
  Info,
  ShieldCheck,
  PhoneCall,
  Clock,
  MapPin,
  Mail,
  Plus,
  Trash2
} from 'lucide-react';

interface Props {
  settings: WebSettings;
  onRefresh: () => void;
}

export const AdminPages: React.FC<Props> = ({ settings, onRefresh }) => {
  const [pages, setPages] = useState<CustomPage[]>(() => StorageService.getCustomPages());
  const [activePageId, setActivePageId] = useState<'about' | 'policies' | 'contact'>('about');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states for currently selected page
  const currentPage = pages.find((p) => p.id === activePageId) || pages[0];

  const [title, setTitle] = useState(currentPage?.title || '');
  const [subtitle, setSubtitle] = useState(currentPage?.subtitle || '');
  const [badge, setBadge] = useState(currentPage?.badge || '');
  const [content, setContent] = useState(currentPage?.content || '');
  const [imageUrl, setImageUrl] = useState(currentPage?.imageUrl || '');
  const [sections, setSections] = useState(currentPage?.sections || []);
  const [contactEmail, setContactEmail] = useState(currentPage?.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(currentPage?.contactPhone || '');
  const [address, setAddress] = useState(currentPage?.address || '');
  const [operatingHours, setOperatingHours] = useState(currentPage?.operatingHours || '');

  // When switching page tab, load its current state
  const handleSelectPageTab = (id: 'about' | 'policies' | 'contact') => {
    setActivePageId(id);
    const p = pages.find((item) => item.id === id);
    if (p) {
      setTitle(p.title);
      setSubtitle(p.subtitle);
      setBadge(p.badge || '');
      setContent(p.content);
      setImageUrl(p.imageUrl || '');
      setSections(p.sections || []);
      setContactEmail(p.contactEmail || '');
      setContactPhone(p.contactPhone || '');
      setAddress(p.address || '');
      setOperatingHours(p.operatingHours || '');
    }
  };

  const handleSaveCurrentPage = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPage: CustomPage = {
      id: activePageId,
      slug: activePageId,
      title,
      subtitle,
      badge,
      content,
      imageUrl,
      sections,
      contactEmail,
      contactPhone,
      address,
      operatingHours,
      updatedAt: new Date().toISOString()
    };

    StorageService.updateCustomPage(updatedPage);
    setPages(StorageService.getCustomPages());

    StorageService.addLog(
      'page_updated',
      'admin_action',
      `Konten halaman "${activePageId}" berhasil diperbarui secara dinamis`
    );

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    onRefresh();
  };

  const handleUpdateSection = (idx: number, field: 'title' | 'description', val: string) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [field]: val };
    setSections(updated);
  };

  const handleAddSection = () => {
    setSections([...sections, { title: 'Poin Baru', description: 'Deskripsi poin baru...' }]);
  };

  const handleRemoveSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" />
            <span>Manajemen Halaman Dinamis (CMS)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Edit teks, foto cerita brand, poin garansi, dan kontak secara dinamis langsung dari dashboard admin
          </p>
        </div>

        <button
          onClick={handleSaveCurrentPage}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition shadow-md shadow-emerald-700/20"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Perubahan Halaman</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          Perubahan halaman berhasil disimpan dan langsung tayang di frontend toko!
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {[
          { id: 'about', label: '1. Tentang Kami (About Us)', icon: Info },
          { id: 'policies', label: '2. Kebijakan & Garansi Toko', icon: ShieldCheck },
          { id: 'contact', label: '3. Kontak & Jam Operasional', icon: PhoneCall }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePageId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectPageTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition ${
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
        onSubmit={handleSaveCurrentPage}
        className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6 text-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Badge Atas / Kategori Halaman</label>
            <input
              type="text"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="Contoh: Tentang Nusantara Heritage Store"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Judul Utama Halaman (Hero Title) *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-extrabold text-slate-900"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Subjudul / Deskripsi Singkat</label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Konten Cerita & Narasi Utama</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 leading-relaxed font-sans"
            />
          </div>
        </div>

        {/* Upload Foto Khusus Halaman Tentang Kami */}
        {activePageId === 'about' && (
          <div className="pt-2 border-t border-slate-100">
            <ImageUpload
              label="Upload Foto Banner / Galeri Tentang Kami"
              images={imageUrl ? [imageUrl] : []}
              onChange={(imgs) => setImageUrl(imgs[0] || '')}
              multiple={false}
              maxImages={1}
              helperText="Unggah foto perajin, workshop, atau toko Anda langsung dari komputer / HP"
            />
          </div>
        )}

        {/* Khusus Kontak */}
        {activePageId === 'contact' && (
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-800 uppercase tracking-wider block">
              Detail Alamat & Informasi Kontak Resmi:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email Resmi CS</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor Telepon / WhatsApp CS</label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Alamat Lengkap Workshop</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Jam Operasional Toko</label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="Senin - Minggu: 08:00 - 22:00 WIB"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section Blocks / Pillars (Keunggulan / Poin Garansi) */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 uppercase tracking-wider">
              {activePageId === 'about'
                ? 'Poin Keunggulan / Nilai Luhur Brand (Pillars)'
                : activePageId === 'policies'
                ? 'Poin Pasal Kebijakan & Garansi Konsumen'
                : 'Poin Layanan Tambahan'}
            </span>
            <button
              type="button"
              onClick={handleAddSection}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-[11px] hover:bg-emerald-600 transition"
            >
              <Plus className="w-3 h-3" />
              <span>+ Tambah Poin</span>
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 text-[11px]">Poin #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="text-rose-500 hover:text-rose-700"
                    title="Hapus Poin"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => handleUpdateSection(idx, 'title', e.target.value)}
                    placeholder="Judul Poin (contoh: Garansi Retur 2x24 Jam)"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    value={sec.description}
                    onChange={(e) => handleUpdateSection(idx, 'description', e.target.value)}
                    placeholder="Deskripsi penjelasan poin..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan Halaman Ini</span>
          </button>
        </div>
      </form>
    </div>
  );
};
