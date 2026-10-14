import React, { useState } from 'react';
import { StaffUser } from '../../types';
import { StorageService } from '../../services/storage';
import { Users, Plus, ShieldCheck, Mail, Lock, UserCheck, Trash2, X } from 'lucide-react';

interface Props {
  staff: StaffUser[];
  onRefresh: () => void;
}

export const AdminUsers: React.FC<Props> = ({ staff, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'superadmin' | 'admin' | 'cashier' | 'staff'>('cashier');

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newStaff: StaffUser = {
      id: `staff-${Date.now()}`,
      name,
      email,
      role,
      permissions: role === 'superadmin' ? ['all'] : [role],
      isActive: true,
      lastLogin: new Date().toISOString()
    };

    const updated = [...staff, newStaff];
    StorageService.saveStaff(updated);
    StorageService.addLog('staff_added', 'admin_action', `Staff baru ditambahkan: ${name} (${role})`);

    setIsModalOpen(false);
    setName('');
    setEmail('');
    onRefresh();
  };

  const handleToggleStaff = (id: string) => {
    const updated = staff.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    StorageService.saveStaff(updated);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Staf & Hak Akses (RBAC)
          </h1>
          <p className="text-xs text-slate-500">
            Kelola akun internal untuk Super Admin, Admin Toko, Kasir POS, dan Tim Gudang
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Staf</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-3.5 px-4">Nama Staf</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Peran (Role)</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staff.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/80">
                <td className="py-3.5 px-4 font-bold text-slate-900">{s.name}</td>
                <td className="py-3.5 px-4 text-slate-500">{s.email}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      s.role === 'superadmin'
                        ? 'bg-purple-100 text-purple-800'
                        : s.role === 'cashier'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {s.role}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {s.isActive ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleToggleStaff(s.id)}
                    className="text-xs font-bold text-slate-600 hover:text-emerald-700 underline"
                  >
                    {s.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Tambah Staf Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Lengkap:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email Staf:</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Peran / Hak Akses:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none cursor-pointer"
                >
                  <option value="superadmin">Super Admin (Akses Penuh)</option>
                  <option value="admin">Admin Toko</option>
                  <option value="cashier">Kasir POS (Hanya POS & Order)</option>
                  <option value="staff">Staf Gudang (Hanya Stok)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition"
                >
                  Simpan Staf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
