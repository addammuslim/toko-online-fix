import React, { useState } from 'react';
import { ActivityLog } from '../../types';
import { Activity, Search, ShieldCheck, Clock, Terminal, Filter } from 'lucide-react';

interface Props {
  logs: ActivityLog[];
}

export const AdminLogs: React.FC<Props> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredLogs = logs.filter((l) => {
    if (categoryFilter !== 'all' && l.category !== categoryFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.event.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Audit Log Aktivitas Sistem
        </h1>
        <p className="text-xs text-slate-500">
          Catatan otomatis seluruh aktivitas keamanan, perubahan transaksi, login kasir, dan event admin
        </p>
      </div>

      {/* Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kata kunci event atau user..."
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
            <option value="auth">Autentikasi (Auth / Brute Force)</option>
            <option value="admin_action">Aksi Admin & Pengaturan</option>
            <option value="product_management">Manajemen Produk</option>
            <option value="customer_activity">Aktivitas Pelanggan</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Waktu (WIB)</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Event Code</th>
                <th className="py-3 px-4">Detail Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-700">{log.event}</td>
                  <td className="py-3 px-4 text-slate-800 font-sans text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
