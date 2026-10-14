import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { StorageService } from '../../services/storage';
import {
  Search,
  Download,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Package,
  Calendar,
  AlertCircle,
  MessageSquare,
  Send,
  Share2
} from 'lucide-react';

interface Props {
  orders: Order[];
  onRefreshOrders: () => void;
}

export const AdminOrders: React.FC<Props> = ({ orders, onRefreshOrders }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status transition form state
  const [shippingCourierInput, setShippingCourierInput] = useState('');
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // WhatsApp quick send modal
  const [waModalOrder, setWaModalOrder] = useState<Order | null>(null);
  const [waTemplateType, setWaTemplateType] = useState<
    'payment_confirmed' | 'shipping_resi' | 'delivered' | 'custom'
  >('payment_confirmed');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase() === q.toLowerCase())
    );
  });

  const handleExportCSV = () => {
    const headers = [
      'ID Pesanan',
      'Pelanggan',
      'Telepon',
      'Metode Bayar',
      'Status',
      'Total (Rp)',
      'Kurir',
      'No Resi',
      'Tanggal'
    ];
    const rows = filteredOrders.map((o) => [
      o.id,
      `"${o.customerName}"`,
      `"${o.customerPhone}"`,
      `"${o.paymentMethod}"`,
      o.orderStatus,
      o.totalAmount,
      `"${o.courier}"`,
      `"${o.trackingNumber || '-'}"`,
      `"${new Date(o.createdAt).toLocaleString('id-ID')}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_order_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateWhatsAppMessage = (order: Order, type: string) => {
    const store = StorageService.getSettings();
    if (type === 'payment_confirmed') {
      return `Halo Kak *${order.customerName}*,

Pembayaran untuk pesanan *${order.id}* di *${store.storeName}* telah kami terima dengan status *LUNAS*.
Total: Rp ${order.totalAmount.toLocaleString('id-ID')} (${order.paymentMethod}).

Paket Anda saat ini sedang disiapkan dan dicek kualitasnya oleh tim gudang kami. Terima kasih! 🙏`;
    }

    if (type === 'shipping_resi') {
      return `Halo Kak *${order.customerName}*,

Kabar gembira! Pesanan *${order.id}* telah diserahkan ke pihak ekspedisi *${order.courier}*.
Nomor Resi: *${order.trackingNumber || 'Dalam Proses'}*

Anda dapat melacak posisi paket secara live di website kami:
${window.location.origin}/#tracking

Terima kasih atas kepercayaannya berbelanja di *${store.storeName}*! 📦✨`;
    }

    if (type === 'delivered') {
      return `Halo Kak *${order.customerName}*,

Pesanan *${order.id}* telah berstatus *SELESAI*. Semoga produk kami bermanfaat dan memuaskan ya Kak!

Jangan lupa berikan ulasan dan rating di website kami untuk mendapatkan poin loyalty tambahan. Sampai jumpa di pesanan berikutnya! 😊`;
    }

    return `Halo Kak *${order.customerName}*, informasi pesanan *${order.id}* di *${store.storeName}*.`;
  };

  const sendWhatsAppNotification = (order: Order, type: string) => {
    const phone = order.customerPhone.replace(/[^0-9]/g, '');
    const text = generateWhatsAppMessage(order, type);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const updateOrderStatus = (targetStatus: OrderStatus) => {
    if (!selectedOrder) return;

    const updatedOrder: Order = { ...selectedOrder };
    updatedOrder.orderStatus = targetStatus;
    updatedOrder.updatedAt = new Date().toISOString();

    if (targetStatus === 'Dikirim' && trackingNumberInput.trim()) {
      updatedOrder.trackingNumber = trackingNumberInput.trim();
      if (shippingCourierInput.trim()) {
        updatedOrder.courier = shippingCourierInput.trim();
      }
    }

    let timelineTitle = `Status Diubah ke: ${targetStatus}`;
    let timelineDesc = adminNoteInput || `Status diperbarui oleh Admin`;

    if (targetStatus === 'Dibayar') {
      timelineTitle = 'Pembayaran Dikonfirmasi Admin';
      updatedOrder.paymentStatus = 'paid';
    } else if (targetStatus === 'Diproses') {
      timelineTitle = 'Pesanan Diproses Gudang';
    } else if (targetStatus === 'Dikirim') {
      timelineTitle = 'Paket Dikirim via Ekspedisi';
      timelineDesc = `Nomor Resi: ${updatedOrder.trackingNumber || 'Dalam perjalanan'}`;
    } else if (targetStatus === 'Selesai') {
      timelineTitle = 'Pesanan Telah Selesai';
    } else if (targetStatus === 'Dibatalkan') {
      timelineTitle = 'Pesanan Dibatalkan';
    }

    updatedOrder.timelines = [
      ...(updatedOrder.timelines || []),
      {
        status: targetStatus,
        title: timelineTitle,
        description: timelineDesc,
        timestamp: new Date().toISOString(),
        actor: 'Admin'
      }
    ];

    StorageService.updateOrder(updatedOrder);
    StorageService.addLog(
      'order_status_updated',
      'admin_action',
      `Pesanan ${updatedOrder.id} status diubah ke ${targetStatus}`,
      { orderId: updatedOrder.id, status: targetStatus }
    );

    // AUTO SEND WHATSAPP NOTIFICATION IF ACTIVE
    const settings = StorageService.getSettings();
    if (settings.autoSendStatusWA) {
      if (targetStatus === 'Dikirim') {
        sendWhatsAppNotification(updatedOrder, 'shipping_resi');
      } else if (targetStatus === 'Dibayar') {
        sendWhatsAppNotification(updatedOrder, 'payment_confirmed');
      } else if (targetStatus === 'Selesai') {
        sendWhatsAppNotification(updatedOrder, 'delivered');
      }
    }

    setSelectedOrder(updatedOrder);
    setAdminNoteInput('');
    onRefreshOrders();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manajemen Pesanan & Kirim WhatsApp
          </h1>
          <p className="text-xs text-slate-500">
            Kelola transaksi masuk, perbarui resi, dan kirim update status otomatis/manual via WhatsApp
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', label: 'Semua Status' },
            { id: 'Pending', label: 'Pending' },
            { id: 'Dibayar', label: 'Dibayar' },
            { id: 'Diproses', label: 'Diproses' },
            { id: 'Dikirim', label: 'Dikirim' },
            { id: 'Selesai', label: 'Selesai' },
            { id: 'Dibatalkan', label: 'Dibatalkan' },
            { id: 'WA Inquiry', label: 'WA Inquiry' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                statusFilter === st.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Cari ID, Nama, No HP, Resi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">ID Pesanan</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Sumber / Metode</th>
                <th className="py-3.5 px-4">Total Tagihan</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">No. Resi</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4 text-right">Kirim WA & Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 italic">
                    Tidak ada data pesanan yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  let badgeColor = 'bg-slate-100 text-slate-700';
                  if (order.orderStatus === 'Dibayar') badgeColor = 'bg-blue-100 text-blue-800';
                  else if (order.orderStatus === 'Diproses') badgeColor = 'bg-purple-100 text-purple-800';
                  else if (order.orderStatus === 'Dikirim') badgeColor = 'bg-amber-100 text-amber-800';
                  else if (order.orderStatus === 'Selesai') badgeColor = 'bg-emerald-100 text-emerald-800';
                  else if (order.orderStatus === 'Dibatalkan') badgeColor = 'bg-rose-100 text-rose-800';
                  else if (order.orderStatus === 'WA Inquiry') badgeColor = 'bg-green-100 text-[#25D366] font-bold';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {order.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <strong className="block text-slate-900">{order.customerName}</strong>
                        <span className="text-slate-400 text-[11px]">{order.customerPhone}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mr-1">
                          {order.source}
                        </span>
                        <span className="text-slate-600 block text-[11px] truncate max-w-[120px]">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        Rp {order.totalAmount.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${badgeColor}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {order.trackingNumber || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(order.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* TOMBOL WA LANGSUNG KE CUSTOMER */}
                          <button
                            onClick={() => {
                              setWaModalOrder(order);
                            }}
                            className="p-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white transition shadow-xs"
                            title="Kirim Notifikasi WhatsApp ke Customer"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShippingCourierInput(order.courier);
                              setTrackingNumberInput(order.trackingNumber || '');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-[11px] hover:bg-emerald-600 transition inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Kelola</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WHATSAPP NOTIFICATION MODAL */}
      {waModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-[#25D366] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-bold text-sm">Kirim Notifikasi WhatsApp ke Pelanggan</h3>
              </div>
              <button onClick={() => setWaModalOrder(null)} className="p-1 text-white hover:opacity-80">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block">Penerima:</span>
                <strong className="text-slate-900 text-sm">
                  {waModalOrder.customerName} ({waModalOrder.customerPhone})
                </strong>
                <span className="text-slate-500 block text-[11px]">
                  Order ID: {waModalOrder.id} • Status: {waModalOrder.orderStatus}
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Pilih Template Informasi:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setWaTemplateType('payment_confirmed')}
                    className={`p-2.5 rounded-xl border text-center transition font-semibold ${
                      waTemplateType === 'payment_confirmed'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Konfirmasi Bayar
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaTemplateType('shipping_resi')}
                    className={`p-2.5 rounded-xl border text-center transition font-semibold ${
                      waTemplateType === 'shipping_resi'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Kirim No. Resi
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaTemplateType('delivered')}
                    className={`p-2.5 rounded-xl border text-center transition font-semibold ${
                      waTemplateType === 'delivered'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Pesanan Selesai
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Pratinjau Pesan WA:</label>
                <textarea
                  rows={6}
                  readOnly
                  value={generateWhatsAppMessage(waModalOrder, waTemplateType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setWaModalOrder(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-600 font-bold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sendWhatsAppNotification(waModalOrder, waTemplateType);
                    setWaModalOrder(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold transition flex items-center gap-1.5 shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim via WhatsApp Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL & STATUS ACTION MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Detail & Status Transaksi
                </span>
                <h3 className="text-base font-black text-slate-900 font-mono">
                  {selectedOrder.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Order Info Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block">Pelanggan:</span>
                  <strong className="text-slate-800">{selectedOrder.customerName}</strong>
                  <span className="text-slate-500 block">{selectedOrder.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Metode Bayar:</span>
                  <strong className="text-slate-800">{selectedOrder.paymentMethod}</strong>
                  <span className="text-emerald-700 font-semibold block uppercase">
                    Status: {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Status Pesanan:</span>
                  <strong className="text-slate-900 text-sm font-bold">
                    {selectedOrder.orderStatus}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Tagihan:</span>
                  <strong className="text-emerald-800 text-sm font-black">
                    Rp {selectedOrder.totalAmount.toLocaleString('id-ID')}
                  </strong>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider">Item Dipesan:</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-200"
                        />
                        <div>
                          <strong className="text-slate-900">{item.productName}</strong>
                          {item.variantName && (
                            <span className="text-slate-500 block">({item.variantName})</span>
                          )}
                        </div>
                      </div>
                      <span className="font-bold text-slate-800">
                        {item.quantity} x Rp {item.price.toLocaleString('id-ID')} = Rp{' '}
                        {(item.quantity * item.price).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address & Resi Form */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-white">
                <h4 className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Pengiriman & Resi Kurir</span>
                </h4>

                <p className="text-slate-600 leading-relaxed">
                  <strong>Alamat:</strong> {selectedOrder.address}, Kec. {selectedOrder.subdistrict},{' '}
                  {selectedOrder.city}, {selectedOrder.province} {selectedOrder.postalCode}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">Kurir Ekspedisi</label>
                    <input
                      type="text"
                      value={shippingCourierInput}
                      onChange={(e) => setShippingCourierInput(e.target.value)}
                      placeholder="JNE / J&T / SiCepat..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-600 block mb-1">
                      Nomor Resi Pelacakan
                    </label>
                    <input
                      type="text"
                      value={trackingNumberInput}
                      onChange={(e) => setTrackingNumberInput(e.target.value)}
                      placeholder="Contoh: JNE88291048201"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <label className="font-bold text-slate-800 uppercase tracking-wider block">
                  Aksi Ubah Status Pesanan:
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateOrderStatus('Dibayar')}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    ✓ Konfirmasi Dibayar
                  </button>
                  <button
                    onClick={() => updateOrderStatus('Diproses')}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold"
                  >
                    ⚡ Proses Pesanan
                  </button>
                  <button
                    onClick={() => updateOrderStatus('Dikirim')}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                  >
                    🚚 Kirimkan (Input Resi)
                  </button>
                  <button
                    onClick={() => updateOrderStatus('Selesai')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    ★ Selesaikan Order
                  </button>
                  <button
                    onClick={() => updateOrderStatus('Dibatalkan')}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  >
                    ✕ Batalkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
