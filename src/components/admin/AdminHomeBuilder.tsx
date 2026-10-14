import React, { useState } from 'react';
import { HomeSection, Product } from '../../types';
import { StorageService } from '../../services/storage';
import { ImageUpload } from '../common/ImageUpload';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Check,
  Save,
  X,
  Plus,
  Trash2,
  Palette,
  Sparkles,
  Layout
} from 'lucide-react';

interface Props {
  homeSections: HomeSection[];
  products: Product[];
  onRefresh: () => void;
}

export const AdminHomeBuilder: React.FC<Props> = ({ homeSections, products, onRefresh }) => {
  const [sections, setSections] = useState<HomeSection[]>(homeSections);
  const [editingSection, setEditingSection] = useState<HomeSection | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // re-assign order numbers
    updated.forEach((s, i) => {
      s.order = i + 1;
    });

    setSections(updated);
  };

  const handleToggleActive = (id: string) => {
    const updated = sections.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setSections(updated);
  };

  const handleSaveAll = () => {
    StorageService.saveHomeSections(sections);
    StorageService.addLog('homepage_updated', 'admin_action', 'Tata letak dan urutan section beranda diperbarui');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    onRefresh();
  };

  const handleUpdateEditingConfig = (field: string, value: any) => {
    if (!editingSection) return;
    setEditingSection({
      ...editingSection,
      config: {
        ...editingSection.config,
        [field]: value
      }
    });
  };

  const handleSaveSectionModal = () => {
    if (!editingSection) return;
    const updated = sections.map((s) => (s.id === editingSection.id ? editingSection : s));
    setSections(updated);
    setEditingSection(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Home Custom Section Builder
          </h1>
          <p className="text-xs text-slate-500">
            Atur urutan, aktivasi, dan sumber data produk beranda toko secara dinamis tanpa sentuh kode
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Tata Letak Beranda</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          Tata letak dan section beranda berhasil disimpan dan langsung aktif di toko!
        </div>
      )}

      {/* Sections List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition ${
              section.isActive ? 'bg-white' : 'bg-slate-50 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center font-mono">
                #{idx + 1}
              </span>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">{section.title}</h4>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                    {section.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {section.type === 'products_grid'
                    ? `Sumber Data: ${section.config?.source || 'Terlaris'} • Maks: ${section.config?.limit || 8} item`
                    : section.type === 'slider'
                    ? 'Hero Banner Promosi Utama (Otomatis Slide)'
                    : section.type === 'marquee'
                    ? `Teks Berjalan Marquee (${section.config?.speed || 25}s)`
                    : 'Section Konten Story / Testimoni'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Order movement buttons */}
              <button
                type="button"
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Pindah ke Atas"
              >
                <ArrowUp className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === sections.length - 1}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                title="Pindah ke Bawah"
              >
                <ArrowDown className="w-4 h-4" />
              </button>

              {/* Edit content button */}
              <button
                type="button"
                onClick={() => setEditingSection(section)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title="Kustomisasi Konten"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              {/* Toggle visibility */}
              <button
                type="button"
                onClick={() => handleToggleActive(section.id)}
                className={`p-2 rounded-xl transition ${
                  section.isActive
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                }`}
                title={section.isActive ? 'Sembunyikan' : 'Tampilkan'}
              >
                {section.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs p-3 sm:p-6 flex items-center justify-center animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] my-auto overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 p-5 shrink-0 bg-white">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Home Builder Editor • Tipe: {editingSection.type}
                </span>
                <h3 className="font-extrabold text-base text-slate-900">
                  Kustomisasi Section: {editingSection.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6 text-xs overflow-y-auto flex-1 overscroll-contain pr-3">
              {/* Common Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Judul Section:</label>
                  <input
                    type="text"
                    value={editingSection.title}
                    onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Subjudul (Deskripsi Singkat):</label>
                  <input
                    type="text"
                    value={editingSection.subtitle || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                    placeholder="Subjudul penjelas section..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                  />
                </div>
              </div>

              {/* SLIDER SECTION SPECIFIC CONTROLS */}
              {editingSection.type === 'slider' && (
                <div className="space-y-5">
                  {/* Slider Style Selector */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Palette className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pilihan Gaya / Tampilan Slider Hero (Dinamis):</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        {
                          id: 'modern_split',
                          name: '1. Modern Split Showcase',
                          desc: 'Split-screen elegan: teks di kiri, kartu produk 3D melayang di kanan'
                        },
                        {
                          id: 'cinematic_overlay',
                          name: '2. Cinematic Fullwidth',
                          desc: 'Layar penuh foto banner dramatis dengan gradasi sinematik'
                        },
                        {
                          id: 'minimal_clean',
                          name: '3. Nordic Minimal Clean',
                          desc: 'Desain putih bersih, tipografi tajam minimalis modern'
                        },
                        {
                          id: 'glass_card',
                          name: '4. Glassmorphism Card',
                          desc: 'Kartu kaca transparan melayang dengan blur effect mewah'
                        }
                      ].map((style) => {
                        const isCurrent =
                          (editingSection.config?.sliderStyle || 'modern_split') === style.id;
                        return (
                          <div
                            key={style.id}
                            onClick={() => handleUpdateEditingConfig('sliderStyle', style.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition ${
                              isCurrent
                                ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                                : 'bg-white border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <strong className={`block text-xs ${isCurrent ? 'text-emerald-900' : 'text-slate-800'}`}>
                              {style.name}
                            </strong>
                            <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                              {style.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slides List & Adder */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                        Daftar Slide Banner ({editingSection.config?.slides?.length || 0} Slide):
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentSlides = editingSection.config?.slides || [];
                          const newSlide = {
                            id: `slide-${Date.now()}`,
                            title: 'Koleksi Mahakarya Nusantara',
                            subtitle: 'Eksplorasi ragam busana tenun, batik, dan kriya pilihan.',
                            btnText: 'Jelajahi Sekarang',
                            btnLink: 'products',
                            image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1600&q=80'
                          };
                          handleUpdateEditingConfig('slides', [...currentSlides, newSlide]);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>+ Tambah Slide Baru</span>
                      </button>
                    </div>

                    {(editingSection.config?.slides || []).map((slide, sIdx) => (
                      <div
                        key={slide.id || sIdx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="font-extrabold text-slate-800 text-xs">
                            Slide #{sIdx + 1}
                          </span>
                          {(editingSection.config?.slides?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const currentSlides = [...(editingSection.config?.slides || [])];
                                currentSlides.splice(sIdx, 1);
                                handleUpdateEditingConfig('slides', currentSlides);
                              }}
                              className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 transition"
                              title="Hapus Slide Ini"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">
                              Judul Slide:
                            </label>
                            <input
                              type="text"
                              value={slide.title}
                              onChange={(e) => {
                                const newSlides = [...(editingSection.config?.slides || [])];
                                newSlides[sIdx] = { ...slide, title: e.target.value };
                                handleUpdateEditingConfig('slides', newSlides);
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-slate-600 block mb-1">
                              Teks Tombol CTA:
                            </label>
                            <input
                              type="text"
                              value={slide.btnText || 'Belanja Sekarang'}
                              onChange={(e) => {
                                const newSlides = [...(editingSection.config?.slides || [])];
                                newSlides[sIdx] = { ...slide, btnText: e.target.value };
                                handleUpdateEditingConfig('slides', newSlides);
                              }}
                              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 block mb-1">
                            Subjudul / Deskripsi Slide:
                          </label>
                          <textarea
                            rows={2}
                            value={slide.subtitle}
                            onChange={(e) => {
                              const newSlides = [...(editingSection.config?.slides || [])];
                              newSlides[sIdx] = { ...slide, subtitle: e.target.value };
                              handleUpdateEditingConfig('slides', newSlides);
                            }}
                            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs"
                          />
                        </div>

                        <div className="pt-1">
                          <ImageUpload
                            label={`Upload Foto Banner Slide #${sIdx + 1} (Bukan Link URL)`}
                            images={slide.image ? [slide.image] : []}
                            onChange={(imgs) => {
                              const newSlides = [...(editingSection.config?.slides || [])];
                              newSlides[sIdx] = { ...slide, image: imgs[0] || '' };
                              handleUpdateEditingConfig('slides', newSlides);
                            }}
                            multiple={false}
                            maxImages={1}
                            helperText="Unggah gambar rasio 16:9 dari file lokal laptop/HP Anda"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PRODUCTS GRID SPECIFIC CONTROLS */}
              {editingSection.type === 'products_grid' && (
                <div className="space-y-4">
                  {/* Grid Style Selector */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700 block">
                      Gaya Tampilan Grid Produk:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'grid_4_col', label: '4 Kolom Standar' },
                        { id: 'grid_3_col', label: '3 Kolom Lega' },
                        { id: 'compact_list', label: 'Daftar Kompak' },
                        { id: 'carousel_scroll', label: 'Scroll Samping' }
                      ].map((gs) => {
                        const isCurrent =
                          (editingSection.config?.gridStyle || 'grid_4_col') === gs.id;
                        return (
                          <button
                            key={gs.id}
                            type="button"
                            onClick={() => handleUpdateEditingConfig('gridStyle', gs.id)}
                            className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                              isCurrent
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {gs.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Sumber Data Produk (Filter):</label>
                      <select
                        value={editingSection.config?.source || 'terlaris'}
                        onChange={(e) => handleUpdateEditingConfig('source', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold outline-none cursor-pointer"
                      >
                        <option value="terlaris">Produk Terlaris (Best Seller)</option>
                        <option value="promo">Produk Promo / Diskon Coret</option>
                        <option value="random">Produk Acak (Random Shuffle)</option>
                        <option value="selected">Produk Pilihan (Selected by Admin)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Jumlah Produk yang Ditampilkan:</label>
                      <input
                        type="number"
                        min={2}
                        max={24}
                        value={editingSection.config?.limit || 8}
                        onChange={(e) => handleUpdateEditingConfig('limit', Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MARQUEE SPECIFIC CONTROLS */}
              {editingSection.type === 'marquee' && (
                <div className="space-y-4">
                  {/* Marquee Style Selector */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Palette className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pilihan Gaya Marquee:</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'ticker_tape', label: '1. Pita Klasik' },
                        { id: 'badge_pill', label: '2. Pill Modern' },
                        { id: 'bold_strip', label: '3. Garis Kontras' }
                      ].map((ms) => {
                        const isCurrent = (editingSection.config?.marqueeStyle || 'ticker_tape') === ms.id;
                        return (
                          <button
                            key={ms.id}
                            type="button"
                            onClick={() => handleUpdateEditingConfig('marqueeStyle', ms.id)}
                            className={`p-2.5 rounded-xl border text-center font-bold text-xs transition ${
                              isCurrent
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {ms.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Teks Pengumuman Promo Berjalan:</label>
                    <textarea
                      rows={2}
                      value={editingSection.config?.text || ''}
                      onChange={(e) => handleUpdateEditingConfig('text', e.target.value)}
                      placeholder="Contoh: PROMO SPESIAL GAJIAN • GRATIS ONGKIR SE-INDONESIA • VOUCHER DISKON 20%..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Warna Background Marquee:</label>
                      <input
                        type="color"
                        value={editingSection.config?.bgColor || '#0f172a'}
                        onChange={(e) => handleUpdateEditingConfig('bgColor', e.target.value)}
                        className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Warna Teks Marquee:</label>
                      <input
                        type="color"
                        value={editingSection.config?.textColor || '#fbbf24'}
                        onChange={(e) => handleUpdateEditingConfig('textColor', e.target.value)}
                        className="w-full h-9 rounded-xl border border-slate-200 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STORY / ABOUT BRAND SPECIFIC CONTROLS */}
              {(editingSection.type === 'story' || editingSection.type === 'about_brand') && (
                <div className="space-y-4">
                  {/* Story Style Selector */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Palette className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pilihan Gaya Tampilan Cerita Brand (Dinamis):</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'split_dark', label: '1. Split Dark Luxury', desc: 'Latar gelap mewah kontras' },
                        { id: 'magazine_light', label: '2. Editorial Majalah', desc: 'Latar putih bersih minimalis' },
                        { id: 'minimalist_center', label: '3. Sentral Modern', desc: 'Fokus cerita di tengah' }
                      ].map((st) => {
                        const isCurrent = (editingSection.config?.storyStyle || 'split_dark') === st.id;
                        return (
                          <div
                            key={st.id}
                            onClick={() => handleUpdateEditingConfig('storyStyle', st.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition ${
                              isCurrent
                                ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <strong className="block text-xs text-slate-800">{st.label}</strong>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{st.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Badge Label (Teks Kecil Atas):</label>
                    <input
                      type="text"
                      value={editingSection.config?.badge || ''}
                      onChange={(e) => handleUpdateEditingConfig('badge', e.target.value)}
                      placeholder="Contoh: CERITA & FILOSOFI KAMI"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Deskripsi / Narasi Cerita Brand:</label>
                    <textarea
                      rows={4}
                      value={editingSection.config?.content || ''}
                      onChange={(e) => handleUpdateEditingConfig('content', e.target.value)}
                      placeholder="Tuliskan cerita filosofi produk atau sejarah pengrajin..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                    />
                  </div>

                  {/* Story Image Upload */}
                  <ImageUpload
                    label="Foto Ilustrasi Cerita Brand (Upload File)"
                    images={editingSection.config?.image ? [editingSection.config.image] : []}
                    onChange={(imgs) => handleUpdateEditingConfig('image', imgs[0] || '')}
                    multiple={false}
                    maxImages={1}
                    helperText="Unggah foto workshop atau pengrajin dari komputer/HP Anda"
                  />
                </div>
              )}

              {/* TESTIMONIALS SPECIFIC CONTROLS */}
              {editingSection.type === 'testimonials' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Palette className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pilihan Gaya Testimoni Pelanggan:</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'grid_cards', label: '1. Grid 3 Kartu', desc: 'Tampilan kartu ulasan rapi' },
                        { id: 'carousel_slider', label: '2. Slider Melayang', desc: 'Kartu review interaktif' },
                        { id: 'modern_quotes', label: '3. Kutipan Besar', desc: 'Tipografi ulasan terkurasi' }
                      ].map((ts) => {
                        const isCurrent = (editingSection.config?.testimonialStyle || 'grid_cards') === ts.id;
                        return (
                          <div
                            key={ts.id}
                            onClick={() => handleUpdateEditingConfig('testimonialStyle', ts.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition ${
                              isCurrent
                                ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <strong className="block text-xs text-slate-800">{ts.label}</strong>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{ts.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* EXPERIENCE / KEUNGGULAN SPECIFIC CONTROLS */}
              {editingSection.type === 'experience' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Palette className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pilihan Gaya Keunggulan Layanan:</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'grid_cards_4', label: '1. 4 Kartu Box', desc: 'Kartu garansi berjejer' },
                        { id: 'horizontal_features', label: '2. Baris Horizontal', desc: 'Tampilan memanjang elegan' },
                        { id: 'compact_pills', label: '3. Pill Kompak', desc: 'Ikon badge ringkas' }
                      ].map((es) => {
                        const isCurrent = (editingSection.config?.experienceStyle || 'grid_cards_4') === es.id;
                        return (
                          <div
                            key={es.id}
                            onClick={() => handleUpdateEditingConfig('experienceStyle', es.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition ${
                              isCurrent
                                ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <strong className="block text-xs text-slate-800">{es.label}</strong>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{es.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA BANNER SPECIFIC CONTROLS */}
              {editingSection.type === 'cta' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Palette className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Pilihan Gaya Banner CTA:</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'gradient_emerald', label: '1. Gradasi Emerald', desc: 'Gradasi hijau segar' },
                        { id: 'dark_luxury', label: '2. Gelap Mewah', desc: 'Slate 950 elegan' },
                        { id: 'bordered_minimal', label: '3. Border Outline', desc: 'Garis modern minimalis' }
                      ].map((cs) => {
                        const isCurrent = (editingSection.config?.ctaStyle || 'gradient_emerald') === cs.id;
                        return (
                          <div
                            key={cs.id}
                            onClick={() => handleUpdateEditingConfig('ctaStyle', cs.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition ${
                              isCurrent
                                ? 'bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <strong className="block text-xs text-slate-800">{cs.label}</strong>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{cs.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Teks Tombol CTA:</label>
                      <input
                        type="text"
                        value={editingSection.config?.btnText || 'Daftar Member Sekarang'}
                        onChange={(e) => handleUpdateEditingConfig('btnText', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Tautan Tujuan Tombol:</label>
                      <input
                        type="text"
                        value={editingSection.config?.btnLink || 'products'}
                        onChange={(e) => handleUpdateEditingConfig('btnLink', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 flex-shrink-0">
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveSectionModal}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition shadow-xs"
              >
                Terapkan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
