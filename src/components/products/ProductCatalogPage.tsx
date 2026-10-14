import React, { useState, useMemo } from 'react';
import { Product, Category, WebSettings } from '../../types';
import { ProductCard } from './ProductCard';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Tag, Sparkles } from 'lucide-react';

interface Props {
  products: Product[];
  categories: Category[];
  settings: WebSettings;
  initialCategory?: string;
  initialSearch?: string;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const ProductCatalogPage: React.FC<Props> = ({
  products,
  categories,
  settings,
  initialCategory,
  initialSearch,
  onSelectProduct,
  onQuickAddToCart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [search, setSearch] = useState<string>(initialSearch || '');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest'>('featured');
  const [filterPromoOnly, setFilterPromoOnly] = useState(false);
  const [filterBestSellerOnly, setFilterBestSellerOnly] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Must be active
      if (!p.isActive) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSku) return false;
      }

      // Badges filter
      if (filterPromoOnly && !p.isPromo) return false;
      if (filterBestSellerOnly && !p.isBestSeller) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.promoPrice || a.price;
      const priceB = b.promoPrice || b.price;

      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      // Default: featured (best sellers and selected first)
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [products, selectedCategory, search, sortBy, filterPromoOnly, filterBestSellerOnly]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Title & Intro */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <span>Katalog Produk Nusantara</span>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            {filteredProducts.length} Produk
          </span>
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Koleksi terlengkap produk warisan Nusantara, busana batik, kerajinan tangan, dan kopi spesial dari produsen lokal terbaik.
        </p>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama produk, batik, kopi, atau SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:bg-white focus:border-emerald-500 outline-none transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Urutkan:</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <option value="featured">Unggulan & Terpopuler</option>
              <option value="price_asc">Harga: Rendah ke Tinggi</option>
              <option value="price_desc">Harga: Tinggi ke Rendah</option>
              <option value="rating">Rating Tertinggi</option>
              <option value="newest">Produk Terbaru</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Semua Kategori
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {/* Toggle buttons for promo / bestseller */}
          <button
            onClick={() => setFilterPromoOnly(!filterPromoOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              filterPromoOnly
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>Sedang Diskon</span>
          </button>

          <button
            onClick={() => setFilterBestSellerOnly(!filterBestSellerOnly)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              filterBestSellerOnly
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Best Seller</span>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-3">
          <Filter className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Tidak ada produk ditemukan</h3>
          <p className="text-xs text-slate-400">
            Coba ubah kata kunci pencarian atau reset filter kategori yang dipilih.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('all');
              setFilterPromoOnly(false);
              setFilterBestSellerOnly(false);
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {paginatedProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              settings={settings}
              onSelect={onSelectProduct}
              onQuickAddToCart={onQuickAddToCart}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Sebelumnya
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                currentPage === i + 1
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
};
