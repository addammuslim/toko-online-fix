import React, { useState } from 'react';
import { Customer, Order, LoyaltyReward } from '../../types';
import { StorageService } from '../../services/storage';
import { LoyaltyStampGrid } from '../loyalty/LoyaltyStampGrid';
import {
  Users,
  Search,
  MessageSquare,
  ShoppingBag,
  Award,
  Sparkles,
  Eye,
  CheckCircle2,
  Clock,
  Phone,
  Mail
} from 'lucide-react';

interface Props {
  customers: Customer[];
  orders: Order[];
  loyaltyRewards: LoyaltyReward[];
  onRefresh: () => void;
}

export const AdminCustomers: React.FC<Props> = ({
  customers,
  orders,
  loyaltyRewards,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.username.toLowerCase().includes(q)
    );
  });

  const getCustomerOrders = (customer: Customer) => {
    return orders.filter(
      (o) =>
        o.customerId === customer.id ||
        o.customerEmail === customer.email ||
        o.customerPhone === customer.phone
    );
  };

  const sendWhatsAppDirect = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = `Halo Kak ${name}, terima kasih telah menjadi pelanggan setia Nusantara Heritage! Ada yang bisa kami bantu seputar pesanan atau promo terbaru hari ini? 😊`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Database Pelanggan & Loyalty Progress
          </h1>
          <p className="text-xs text-slate-500">
            Daftar member terdaftar, riwayat transaksi belanja, status loyalty reward, dan komunikasi WhatsApp langsung
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Cari nama, email, no HP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Nama Pelanggan</th>
                <th className="py-3.5 px-4">Kontak (Email / WA)</th>
                <th className="py-3.5 px-4">Akun Login</th>
                <th className="py-3.5 px-4">Total Order</th>
                <th className="py-3.5 px-4">Total Belanja</th>
                <th className="py-3.5 px-4">Poin & Tier Loyalty</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => {
                const custOrders = getCustomerOrders(cust);
                const orderCount = custOrders.length;
                const totalSpend = custOrders.reduce((sum, o) => sum + o.totalAmount, 0);

                return (
                  <tr key={cust.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                          {cust.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="block text-slate-900 font-bold">{cust.name}</strong>
                          <span className="text-[11px] text-slate-400 font-mono">@{cust.username}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-800 block">{cust.phone}</span>
                      <span className="text-slate-400 text-[11px] block">{cust.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {cust.isGoogleAccount ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          Google Login
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          Password
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {orderCount}x Transaksi
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-700">
                      Rp {totalSpend.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                          {cust.loyaltyPoints} Pts
                        </span>
                        {orderCount >= 14 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                            Tier 3 (Baju Gratis)
                          </span>
                        ) : orderCount >= 7 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            Tier 2 (Diskon 20%)
                          </span>
                        ) : orderCount >= 3 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Tier 1 (Diskon 10%)
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">New Member</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => sendWhatsAppDirect(cust.phone, cust.name)}
                          className="p-1.5 rounded-lg bg-[#25D366] text-white hover:bg-[#1EBE5D]"
                          title="Chat WhatsApp Customer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedCustomer(cust)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-emerald-600 flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Riwayat</span>
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

      {/* CUSTOMER DETAIL MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Detail Profil & Riwayat Belanja Customer
                </span>
                <h3 className="font-bold text-base text-slate-900">{selectedCustomer.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block">Nomor WhatsApp:</span>
                  <strong className="text-slate-800">{selectedCustomer.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Email:</span>
                  <strong className="text-slate-800">{selectedCustomer.email}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Transaksi:</span>
                  <strong className="text-slate-900">
                    {getCustomerOrders(selectedCustomer).length} Pesanan
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Poin Loyalty:</span>
                  <strong className="text-emerald-700">
                    {selectedCustomer.loyaltyPoints} Poin
                  </strong>
                </div>
              </div>

              {/* Digital Loyalty Stamp Calendar */}
              <LoyaltyStampGrid
                orderCount={getCustomerOrders(selectedCustomer).length}
                loyaltyRewards={loyaltyRewards}
                customerName={selectedCustomer.name}
                orders={getCustomerOrders(selectedCustomer)}
              />

              {/* Order History List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>Daftar Transaksi Pembelian:</span>
                </h4>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {getCustomerOrders(selectedCustomer).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="font-mono text-slate-900">{ord.id}</strong>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {ord.orderStatus}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {new Date(ord.createdAt).toLocaleString('id-ID')} • {ord.paymentMethod}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-slate-900 block">
                          Rp {ord.totalAmount.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ord.items.length} macam produk
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  onClick={() =>
                    sendWhatsAppDirect(selectedCustomer.phone, selectedCustomer.name)
                  }
                  className="px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Pesan WhatsApp Langsung</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
