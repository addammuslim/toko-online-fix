import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '../../types';
import { StorageService } from '../../services/storage';
import { ImageUpload } from '../common/ImageUpload';
import {
  Plus,
  Trash2,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Tag,
  CreditCard,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface Props {
  expenses: Expense[];
  onRefresh: () => void;
}

export const AdminExpenses: React.FC<Props> = ({ expenses, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Form states
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [category, setCategory] = useState<ExpenseCategory>('iklan');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentSource, setPaymentSource] = useState('Rekening BCA Bisnis');
  const [notes, setNotes] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');

  const filteredExpenses = expenses.filter((e) => {
    if (selectedCategory !== 'all' && e.category !== selectedCategory) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      (e.receiptNumber && e.receiptNumber.toLowerCase().includes(q)) ||
      (e.notes && e.notes.toLowerCase().includes(q))
    );
  });

  const totalExpenseAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || amount <= 0) return;

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      date,
      category,
      title,
      amount: Number(amount),
      paymentSource,
      notes,
      receiptNumber: receiptNumber || undefined,
      receiptImage: receiptImage || undefined,
      createdAt: new Date().toISOString()
    };

    StorageService.addExpense(newExpense);
    StorageService.addLog(
      'expense_created',
      'admin_action',
      `Pengeluaran "${title}" sebesar Rp ${amount.toLocaleString('id-ID')} dicatat`
    );

    setIsModalOpen(false);
    setTitle('');
    setAmount(0);
    setNotes('');
    setReceiptNumber('');
    setReceiptImage('');
    onRefresh();
  };

  const handleDelete = (id: string, expTitle: string) => {
    if (confirm(`Hapus catatan pengeluaran "${expTitle}"?`)) {
      StorageService.deleteExpense(id);
      StorageService.addLog('expense_deleted', 'admin_action', `Pengeluaran "${expTitle}" dihapus`);
      onRefresh();
    }
  };

  const getCategoryBadge = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'iklan':
        return 'bg-purple-100 text-purple-800';
      case 'pembelian_stok':
        return 'bg-blue-100 text-blue-800';
      case 'operasional':
        return 'bg-amber-100 text-amber-800';
      case 'gaji':
        return 'bg-emerald-100 text-emerald-800';
      case 'utilitas':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Pengeluaran & Beban Toko
          </h1>
          <p className="text-xs text-slate-500">
            Catat spent iklan (Meta/TikTok/Google Ads), pembelian stok/bahan baku A, B, C, operasional, dan utilitas
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Pengeluaran Baru</span>
        </button>
      </div>

      {/* Summary Strip */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Pengeluaran (Tersaring)
            </span>
            <div className="text-2xl font-black text-rose-700">
              Rp {totalExpenseAmount.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        <span className="text-xs text-slate-500">
          Menampilkan {filteredExpenses.length} transaksi pengeluaran
        </span>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Semua Kategori' },
            { id: 'iklan', label: 'Spent Iklan (Ads)' },
            { id: 'pembelian_stok', label: 'Pembelian Stok / Bahan' },
            { id: 'operasional', label: 'Operasional & Packing' },
            { id: 'gaji', label: 'Gaji & Komisi' },
            { id: 'utilitas', label: 'Utilitas (Listrik/Net)' },
            { id: 'lainnya', label: 'Lain-lain' }
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari judul pengeluaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Keterangan Pengeluaran</th>
                <th className="py-3.5 px-4">Nominal (Rp)</th>
                <th className="py-3.5 px-4">Sumber Dana</th>
                <th className="py-3.5 px-4">No. Bukti/Kwitansi</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 italic">
                    Belum ada pengeluaran yang tercatat pada kategori ini.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-mono text-slate-600">{exp.date}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getCategoryBadge(exp.category)}`}>
                        {exp.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <strong className="block text-slate-900">{exp.title}</strong>
                      {exp.notes && <span className="text-[11px] text-slate-400 block">{exp.notes}</span>}
                      {exp.receiptImage && (
                        <a
                          href={exp.receiptImage}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-600 hover:underline font-bold"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Lihat Bukti Kwitansi</span>
                        </a>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-rose-600">
                      Rp {exp.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{exp.paymentSource}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {exp.receiptNumber || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(exp.id, exp.title)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Catat Pengeluaran Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Kategori Beban *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="iklan">Spent Iklan (Meta/TikTok/GA)</option>
                    <option value="pembelian_stok">Pembelian Stok / Bahan A, B, C</option>
                    <option value="operasional">Operasional Packaging & Toko</option>
                    <option value="gaji">Gaji Staf & Komisi</option>
                    <option value="utilitas">Utilitas (Listrik, Internet)</option>
                    <option value="lainnya">Lain-lain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul / Uraian Beban *</label>
                <input
                  type="text"
                  placeholder="Contoh: Meta Ads Promo Kemerdekaan / Pembelian Kain Sutra Supplier B"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Nominal (Rp) *</label>
                  <input
                    type="number"
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    placeholder="Contoh: 1500000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sumber Rekening Dana</label>
                  <select
                    value={paymentSource}
                    onChange={(e) => setPaymentSource(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="Rekening BCA Bisnis">Rekening BCA Bisnis</option>
                    <option value="Kartu Kredit Corporate">Kartu Kredit Corporate</option>
                    <option value="Kasir Kas Kecil">Kasir Kas Kecil</option>
                    <option value="Rekening Mandiri">Rekening Mandiri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">No. Bukti / Invoice Kwitansi</label>
                <input
                  type="text"
                  placeholder="Contoh: INV-META-88219"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
                <input
                  type="text"
                  placeholder="Catatan detail supplier atau periode..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <ImageUpload
                  label="Upload Foto / Scan Struk Bukti Pengeluaran (Bukan Link)"
                  images={receiptImage ? [receiptImage] : []}
                  onChange={(imgs) => setReceiptImage(imgs[0] || '')}
                  multiple={false}
                  maxImages={1}
                  helperText="Upload foto nota, bukti transfer bank, atau screenshot invoice kwitansi"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold transition shadow-md"
                >
                  Simpan Pengeluaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
