import React, { useState, useEffect, useRef } from 'react';
import { Order, Expense, Product } from '../../types';
import {
  Chart,
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Printer,
  FileSpreadsheet,
  PieChart,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

Chart.register(
  BarController,
  BarElement,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);

interface Props {
  orders: Order[];
  expenses: Expense[];
  products: Product[];
}

export const AdminReports: React.FC<Props> = ({ orders, expenses, products }) => {
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // 1-12 (Oktober = 10)
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-11');

  const chartRef = useRef<HTMLCanvasElement | null>(null);

  // Filter paid orders according to period
  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');

  const filteredOrders = paidOrders.filter((o) => {
    const oDate = new Date(o.createdAt);
    if (reportType === 'daily') {
      return o.createdAt.slice(0, 10) === selectedDate;
    }
    if (reportType === 'monthly') {
      return oDate.getFullYear() === selectedYear && oDate.getMonth() + 1 === selectedMonth;
    }
    if (reportType === 'yearly') {
      return oDate.getFullYear() === selectedYear;
    }
    return true;
  });

  // Filter expenses according to period
  const filteredExpenses = expenses.filter((e) => {
    const eDate = new Date(e.date);
    if (reportType === 'daily') {
      return e.date === selectedDate;
    }
    if (reportType === 'monthly') {
      return eDate.getFullYear() === selectedYear && eDate.getMonth() + 1 === selectedMonth;
    }
    if (reportType === 'yearly') {
      return eDate.getFullYear() === selectedYear;
    }
    return true;
  });

  // 1. Gross Revenue
  const grossSales = filteredOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDiscountsGiven = filteredOrders.reduce((sum, o) => sum + o.discount, 0);
  const netSales = Math.max(0, grossSales - totalDiscountsGiven);

  // 2. COGS (HPP / Harga Pokok Penjualan)
  // Calculate based on order items and product cogsPrice
  let totalCOGS = 0;
  for (const o of filteredOrders) {
    for (const it of o.items) {
      const prod = products.find((p) => p.id === it.productId);
      const cogsItem = it.cogsPrice || prod?.cogsPrice || Math.round(it.price * 0.5);
      totalCOGS += cogsItem * it.quantity;
    }
  }

  // 3. Gross Profit
  const grossProfit = netSales - totalCOGS;

  // 4. Operating Expenses
  const totalOperatingExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  // 5. Net Profit / Loss
  const netProfit = grossProfit - totalOperatingExpenses;
  const isProfit = netProfit >= 0;
  const netProfitMargin = netSales > 0 ? ((netProfit / netSales) * 100).toFixed(1) : '0';

  // Render Financial Chart
  useEffect(() => {
    let myChart: Chart | null = null;
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Pendapatan Kotor', 'HPP Modal (COGS)', 'Laba Kotor', 'Biaya Operasional', 'Laba Bersih'],
            datasets: [
              {
                label: 'Nominal (Rp)',
                data: [grossSales, totalCOGS, grossProfit, totalOperatingExpenses, Math.abs(netProfit)],
                backgroundColor: [
                  '#3b82f6', // Biru
                  '#f59e0b', // Amber
                  '#10b981', // Hijau
                  '#ef4444', // Merah
                  netProfit >= 0 ? '#059669' : '#dc2626' // Hijau gelap / Merah gelap
                ],
                borderRadius: 8
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => ` Rp ${(context.raw as number).toLocaleString('id-ID')}`
                }
              }
            },
            scales: {
              y: {
                ticks: {
                  callback: (value) => `Rp ${(Number(value) / 1000).toLocaleString('id-ID')}k`,
                  font: { size: 10 }
                }
              },
              x: {
                ticks: { font: { size: 10 } }
              }
            }
          }
        });
      }
    }

    return () => {
      if (myChart) myChart.destroy();
    };
  }, [grossSales, totalCOGS, grossProfit, totalOperatingExpenses, netProfit]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Laporan Keuangan & Laba Rugi
          </h1>
          <p className="text-xs text-slate-500">
            Rekap laporan performa harian, bulanan, dan tahunan beserta perhitungan HPP dan pengeluaran operasional
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-emerald-600" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Period Selection Controls */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 font-bold">
          <button
            onClick={() => setReportType('daily')}
            className={`px-4 py-2 rounded-xl transition ${
              reportType === 'daily' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Laporan Harian
          </button>
          <button
            onClick={() => setReportType('monthly')}
            className={`px-4 py-2 rounded-xl transition ${
              reportType === 'monthly' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Laporan Bulanan
          </button>
          <button
            onClick={() => setReportType('yearly')}
            className={`px-4 py-2 rounded-xl transition ${
              reportType === 'yearly' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Laporan Tahunan
          </button>
        </div>

        {/* Dynamic Selectors depending on reportType */}
        <div className="flex items-center gap-3">
          {reportType === 'daily' && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">Pilih Tanggal:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold bg-white"
              />
            </div>
          )}

          {reportType === 'monthly' && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">Bulan & Tahun:</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold bg-white"
              >
                {[
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ].map((name, i) => (
                  <option key={i + 1} value={i + 1}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold bg-white"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          )}

          {reportType === 'yearly' && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-600">Pilih Tahun:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-1.5 rounded-xl border border-slate-300 font-bold bg-white"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Pendapatan Kotor
          </span>
          <div className="text-2xl font-black text-slate-900">
            Rp {grossSales.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-slate-500 block">
            {filteredOrders.length} transaksi selesai
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            HPP Modal Produk (COGS)
          </span>
          <div className="text-2xl font-black text-amber-600">
            Rp {totalCOGS.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-slate-500 block">
            Harga modal pembelian bahan
          </span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Beban Operasional
          </span>
          <div className="text-2xl font-black text-rose-600">
            Rp {totalOperatingExpenses.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-slate-500 block">
            {filteredExpenses.length} pos pengeluaran toko
          </span>
        </div>

        <div
          className={`p-5 rounded-3xl border shadow-xs space-y-2 ${
            isProfit
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/80 border-rose-200 text-rose-950'
          }`}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
            Laba Bersih (Net Profit)
          </span>
          <div
            className={`text-2xl font-black ${
              isProfit ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            Rp {netProfit.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold">
            {isProfit ? (
              <span className="text-emerald-700 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> Margin: {netProfitMargin}% (Untung)
              </span>
            ) : (
              <span className="text-rose-700 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> Margin: {netProfitMargin}% (Rugi)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Chart & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-bold text-sm text-slate-900">
            Grafik Struktur Keuangan & Laba Rugi
          </h2>
          <div className="h-64 sm:h-72 w-full relative">
            <canvas ref={chartRef} />
          </div>
        </div>

        {/* Detailed Income Statement Table */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-xs">
          <h2 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
            Laporan Laba Rugi Komprehensif
          </h2>

          <div className="space-y-2.5">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Pendapatan Kotor (Gross Sales)</span>
              <span>Rp {grossSales.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between text-rose-600 pl-3">
              <span>(-) Diskon & Kupon Promo</span>
              <span>- Rp {totalDiscountsGiven.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
              <span>Pendapatan Bersih (Net Sales)</span>
              <span>Rp {netSales.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between text-amber-700 pl-3">
              <span>(-) Harga Pokok Penjualan (HPP)</span>
              <span>- Rp {totalCOGS.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between font-extrabold text-blue-900 pt-1 border-t border-slate-100">
              <span>LABA KOTOR (GROSS PROFIT)</span>
              <span>Rp {grossProfit.toLocaleString('id-ID')}</span>
            </div>

            <div className="flex justify-between text-rose-600 pl-3">
              <span>(-) Biaya Operasional Toko</span>
              <span>- Rp {totalOperatingExpenses.toLocaleString('id-ID')}</span>
            </div>

            <div
              className={`flex justify-between items-baseline font-black text-sm pt-3 border-t-2 ${
                isProfit ? 'border-emerald-500 text-emerald-800' : 'border-rose-500 text-rose-800'
              }`}
            >
              <span>LABA BERSIH (NET PROFIT / LOSS)</span>
              <span className="text-base">Rp {netProfit.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
