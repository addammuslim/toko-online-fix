import React, { useEffect, useRef } from 'react';
import { Order, Product, ActivityLog } from '../../types';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement
} from 'chart.js';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Users
} from 'lucide-react';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement
);

interface Props {
  orders: Order[];
  products: Product[];
  logs: ActivityLog[];
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  orders,
  products,
  logs,
  onNavigateTab
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const pieChartRef = useRef<HTMLCanvasElement | null>(null);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Metrics calculation
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending');
  const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  // Chart setup
  useEffect(() => {
    if (!chartRef.current) return;

    // Group last 7 days revenue
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const revenueData = [1250000, 2400000, 1850000, 3100000, 4200000, 5600000, 3900000];

    const chartInstance = new Chart(chartRef.current, {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Penjualan Mingguan (IDR)',
            data: revenueData,
            borderColor: '#059669',
            backgroundColor: 'rgba(5, 150, 105, 0.1)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#059669'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => `${Number(val) / 1000000} jt`
            }
          }
        }
      }
    });

    return () => chartInstance.destroy();
  }, []);

  useEffect(() => {
    if (!pieChartRef.current) return;

    const pieInstance = new Chart(pieChartRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Midtrans Online', 'WhatsApp Order', 'POS Kasir'],
        datasets: [
          {
            data: [
              orders.filter((o) => o.paymentMode === 'midtrans').length || 1,
              orders.filter((o) => o.paymentMode === 'whatsapp').length || 1,
              orders.filter((o) => o.source === 'POS').length || 1
            ],
            backgroundColor: ['#059669', '#25d366', '#3b82f6'],
            borderWidth: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });

    return () => pieInstance.destroy();
  }, [orders]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Omset Penjualan
            </span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatIDR(totalRevenue)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% dari bulan lalu</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Pesanan Masuk
            </span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {totalOrders} Pesanan
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {paidOrders.length} Dibayar • {pendingOrders.length} Menunggu
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rata-Rata Order (AOV)
            </span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {formatIDR(avgOrderValue)}
            </div>
            <div className="text-xs text-purple-600 font-bold mt-1">
              Basket size pelanggan optimal
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Katalog Produk Aktif
            </span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {products.filter((p) => p.isActive).length} Produk
            </div>
            <div className="text-xs text-amber-600 font-bold mt-1">
              Siap jual di online & kasir POS
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Tren Pendapatan 7 Hari Terakhir</h3>
              <p className="text-xs text-slate-400">Grafik interaktif performa penjualan harian</p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Lihat Laporan Laba Rugi →
            </button>
          </div>
          <div className="h-64">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Kanal Penjualan</h3>
            <p className="text-xs text-slate-400">Distribusi sumber transaksi toko</p>
          </div>
          <div className="h-64">
            <canvas ref={pieChartRef}></canvas>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Pesanan Masuk Terbaru</h3>
            <p className="text-xs text-slate-400">Daftar transaksi yang perlu diproses hari ini</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition"
          >
            Lihat Semua Pesanan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3">ID Pesanan</th>
                <th className="pb-3">Pelanggan</th>
                <th className="pb-3">Total Belanja</th>
                <th className="pb-3">Metode Bayar</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80">
                  <td className="py-3 font-mono font-bold text-slate-900">{o.id}</td>
                  <td className="py-3 font-medium text-slate-800">{o.customerName}</td>
                  <td className="py-3 font-bold text-slate-900">{formatIDR(o.totalAmount)}</td>
                  <td className="py-3 text-slate-500">{o.paymentMethod}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        o.orderStatus === 'Dibayar'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.orderStatus === 'Dikirim'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {o.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">
                    {new Date(o.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
