import React, { useState } from 'react';
import { Product, Category, ProductVariant } from '../../types';
import { StorageService } from '../../services/storage';
import { ImageUpload } from '../common/ImageUpload';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Check,
  Star,
  Image as ImageIcon,
  Tag,
  Package,
  Layers,
  Sparkles,
  Flame,
  X
} from 'lucide-react';

interface Props {
  products: Product[];
  categories: Category[];
  onRefresh: () => void;
}

export const AdminProducts: React.FC<Props> = ({ products, categories, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'cat-fashion');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(100000);
  const [cogsPrice, setCogsPrice] = useState<number>(60000);
  const [promoPrice, setPromoPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(50);
  const [weightGrams, setWeightGrams] = useState<number>(500);
  const [sku, setSku] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Variants state
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'all' && p.categoryId !== categoryFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setCategoryId(categories[0]?.id || 'cat-fashion');
    setDescription('');
    setPrice(150000);
    setCogsPrice(85000);
    setPromoPrice(undefined);
    setStock(25);
    setWeightGrams(500);
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setImages(['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80']);
    setIsBestSeller(false);
    setIsPromo(false);
    setIsSelected(false);
    setIsActive(true);
    setVariants([
      { id: 'v1', name: 'Ukuran M', price: 150000, stock: 15, sku: 'SKU-M' },
      { id: 'v2', name: 'Ukuran L', price: 150000, stock: 10, sku: 'SKU-L' }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategoryId(p.categoryId);
    setDescription(p.description);
    setPrice(p.price);
    setCogsPrice(p.cogsPrice || Math.round(p.price * 0.6));
    setPromoPrice(p.promoPrice);
    setStock(p.stock);
    setWeightGrams(p.weightGrams);
    setSku(p.sku);
    setImages(p.images && p.images.length > 0 ? p.images : ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80']);
    setIsBestSeller(p.isBestSeller);
    setIsPromo(p.isPromo);
    setIsSelected(p.isSelected);
    setIsActive(p.isActive);
    setVariants(p.variants || []);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || price <= 0) return;

    const finalImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80'];

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const productData: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      slug,
      categoryId,
      description,
      price: Number(price),
      cogsPrice: Number(cogsPrice) || Math.round(Number(price) * 0.6),
      promoPrice: promoPrice && Number(promoPrice) > 0 ? Number(promoPrice) : undefined,
      stock: Number(stock),
      weightGrams: Number(weightGrams) || 500,
      sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
      images: finalImages,
      variants: variants.length > 0 ? variants : [
        { id: 'v-def', name: 'Standar', price: Number(price), promoPrice: promoPrice ? Number(promoPrice) : undefined, stock: Number(stock), sku: sku || 'SKU-DEF' }
      ],
      isBestSeller,
      isPromo: Boolean(promoPrice && promoPrice < price) || isPromo,
      isSelected,
      isActive,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 0,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString()
    };

    StorageService.updateProduct(productData);
    StorageService.addLog(
      editingProduct ? 'product_updated' : 'product_created',
      'admin_action',
      `Produk "${productData.name}" (${productData.id}) berhasil disimpan`
    );

    setIsModalOpen(false);
    onRefresh();
  };

  const handleDeleteProduct = (p: Product) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${p.name}"?`)) {
      StorageService.deleteProduct(p.id);
      StorageService.addLog('product_deleted', 'admin_action', `Produk "${p.name}" (${p.id}) dihapus`);
      onRefresh();
    }
  };

  const handleAddVariantRow = () => {
    const newV: ProductVariant = {
      id: `v-${Date.now()}`,
      name: `Varian Baru`,
      price: Number(price),
      stock: 10,
      sku: `${sku}-V${variants.length + 1}`
    };
    setVariants([...variants, newV]);
  };

  const handleUpdateVariant = (index: number, field: keyof ProductVariant, val: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: val };
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Produk & Varian
          </h1>
          <p className="text-xs text-slate-500">
            Kelola katalog barang, HPP modal, harga jual, stok gudang, dan SKU
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama produk atau SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-slate-500">Kategori:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">HPP Modal</th>
                <th className="py-3.5 px-4">Harga Jual</th>
                <th className="py-3.5 px-4">Stok</th>
                <th className="py-3.5 px-4">Badges</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const cat = categories.find((c) => c.id === p.categoryId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-900 block truncate max-w-xs">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{cat?.name || '-'}</td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {formatIDR(p.cogsPrice || Math.round(p.price * 0.6))}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-black text-slate-900">
                        {formatIDR(p.promoPrice || p.price)}
                      </div>
                      {p.promoPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatIDR(p.price)}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <span className={p.stock <= 5 ? 'text-red-500 font-black' : ''}>
                        {p.stock} unit
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isBestSeller && (
                          <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-bold">
                            Best Seller
                          </span>
                        )}
                        {p.isPromo && (
                          <span className="px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[9px] font-bold">
                            Promo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          p.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {p.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition"
                          title="Edit Produk"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-base text-slate-900">
                {editingProduct ? 'Edit Informasi Produk' : 'Tambah Produk Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Nama Produk *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kategori *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Kode SKU *</label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Harga Jual Normal (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Harga Promo / Coret (Opsional)</label>
                  <input
                    type="number"
                    value={promoPrice || ''}
                    placeholder="Kosongkan jika tidak ada diskon"
                    onChange={(e) => setPromoPrice(e.target.value ? Number(e.target.value) : undefined)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">HPP / Biaya Beli Modal (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={cogsPrice}
                    onChange={(e) => setCogsPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Digunakan untuk perhitungan laba bersih otomatis</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Total Stok *</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Berat Barang (Gram) *</label>
                  <input
                    type="number"
                    required
                    value={weightGrams}
                    onChange={(e) => setWeightGrams(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>

                <div className="sm:col-span-2 pt-2">
                  <ImageUpload
                    label="Foto & Galeri Produk (Multi-Image Upload)"
                    images={images}
                    onChange={setImages}
                    multiple={true}
                    maxImages={8}
                    helperText="Unggah satu atau banyak foto langsung dari galeri / komputer Anda. Foto paling pertama (#1) otomatis menjadi Foto Utama (Cover)."
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Deskripsi Produk</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Badges and Active toggle */}
              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-slate-100 text-xs font-bold">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isBestSeller} onChange={(e) => setIsBestSeller(e.target.checked)} />
                  <span>Tandai Terlaris (Best Seller)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isSelected} onChange={(e) => setIsSelected(e.target.checked)} />
                  <span>Produk Pilihan (Featured)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  <span>Status Aktif</span>
                </label>
              </div>

              {/* Variants Builder */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Varian / Ukuran Produk ({variants.length})
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Varian</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {variants.map((v, idx) => (
                    <div key={v.id || idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2 rounded-xl">
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Nama Varian"
                          value={v.name}
                          onChange={(e) => handleUpdateVariant(idx, 'name', e.target.value)}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="Harga"
                          value={v.price}
                          onChange={(e) => handleUpdateVariant(idx, 'price', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          placeholder="Stok"
                          value={v.stock}
                          onChange={(e) => handleUpdateVariant(idx, 'stock', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-2 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveVariant(idx)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
