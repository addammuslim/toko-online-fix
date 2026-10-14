import React, { useState } from 'react';
import { Order } from '../../types';
import { StorageService } from '../../services/storage';
import { CaptchaBox } from '../common/CaptchaBox';
import {
  Search,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface Props {
  initialOrderId?: string;
  onNavigate: (view: string) => void;
}

interface RajaOngkirWaybillResult {
  waybillNumber: string;
  courierName: string;
  courierCode: string;
  service: string;
  status: 'DELIVERED' | 'ON PROCESS' | 'MANIFESTED';
  origin: string;
  destination: string;
  shipperName: string;
  receiverName: string;
  shippedDate: string;
  deliveredDate?: string;
  manifest: Array<{
    code: string;
    description: string;
    date: string;
    time: string;
    city: string;
  }>;
}

export const OrderTrackingPage: React.FC<Props> = ({ initialOrderId, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'order' | 'rajaongkir'>('order');

  // Order mode state
  const [searchInput, setSearchInput] = useState(initialOrderId || '');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialOrderId) {
      const orders = StorageService.getOrders();
      return orders.find((o) => o.id === initialOrderId) || null;
    }
    return null;
  });
  const [hasSearchedOrder, setHasSearchedOrder] = useState(!!initialOrderId);

  // RajaOngkir Direct Waybill state
  const [selectedCourier, setSelectedCourier] = useState('jne');
  const [waybillInput, setWaybillInput] = useState('JNE-992019482');
  const [waybillResult, setWaybillResult] = useState<RajaOngkirWaybillResult | null>(null);
  const [hasSearchedWaybill, setHasSearchedWaybill] = useState(false);
  const [isLoadingWaybill, setIsLoadingWaybill] = useState(false);

  // General state
  const [copiedResi, setCopiedResi] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);

  // Mock RajaOngkir live database for simulation
  const mockWaybills: Record<string, RajaOngkirWaybillResult> = {
    'JNE-992019482': {
      waybillNumber: 'JNE-992019482',
      courierName: 'JNE Express',
      courierCode: 'jne',
      service: 'REG (Reguler Service)',
      status: 'DELIVERED',
      origin: 'KOTA YOGYAKARTA',
      destination: 'JAKARTA SELATAN',
      shipperName: 'Nusantara Heritage Store (Malioboro)',
      receiverName: 'Budi Santoso',
      shippedDate: '09 Okt 2026, 14:30 WIB',
      deliveredDate: '11 Okt 2026, 11:15 WIB',
      manifest: [
        { code: '01', description: 'Paket telah diterima di Loket JNE Agen Malioboro Jogja', date: '09 Okt 2026', time: '14:30', city: 'YOGYAKARTA' },
        { code: '02', description: 'Manifested ke Hub Pusat Sortir Ekspedisi JNE Yogyakarta', date: '09 Okt 2026', time: '19:45', city: 'YOGYAKARTA' },
        { code: '03', description: 'Departed transit via Hub Cargo Bandara YIA menuju Jakarta', date: '10 Okt 2026', time: '04:10', city: 'KULON PROGO' },
        { code: '04', description: 'Received at Gateway Sortir DC Cilandak Jakarta Selatan', date: '10 Okt 2026', time: '15:20', city: 'JAKARTA SELATAN' },
        { code: '05', description: 'With Delivery Courier (Kurir Bpk. Joko) sedang mengantar ke alamat tujuan', date: '11 Okt 2026', time: '08:40', city: 'JAKARTA SELATAN' },
        { code: '06', description: 'DELIVERED - Paket telah diterima dengan baik oleh: Bpk. Budi Santoso (Ybs)', date: '11 Okt 2026', time: '11:15', city: 'JAKARTA SELATAN' }
      ]
    },
    'SICEPAT-8812903': {
      waybillNumber: 'SICEPAT-8812903',
      courierName: 'SiCepat Ekspres',
      courierCode: 'sicepat',
      service: 'BEST (Besok Sampai Tujuan)',
      status: 'ON PROCESS',
      origin: 'KOTA YOGYAKARTA',
      destination: 'KOTA SURABAYA',
      shipperName: 'Nusantara Heritage Store',
      receiverName: 'Siti Rahmawati',
      shippedDate: '11 Okt 2026, 09:00 WIB',
      manifest: [
        { code: '01', description: 'Paket di-pickup oleh SIGESIT SiCepat Hub Gedong Tengen', date: '11 Okt 2026', time: '09:00', city: 'YOGYAKARTA' },
        { code: '02', description: 'Tiba di Main Hub SiCepat Jogja Central', date: '11 Okt 2026', time: '12:30', city: 'YOGYAKARTA' },
        { code: '03', description: 'In Transit menuju Hub Sortir Rungkut Surabaya', date: '11 Okt 2026', time: '14:10', city: 'SURABAYA' }
      ]
    },
    'JNT-7721839': {
      waybillNumber: 'JNT-7721839',
      courierName: 'J&T Express',
      courierCode: 'jnt',
      service: 'EZ (Standar Ekspedisi)',
      status: 'DELIVERED',
      origin: 'KOTA YOGYAKARTA',
      destination: 'KOTA BANDUNG',
      shipperName: 'Nusantara Heritage Store',
      receiverName: 'Ahmad Faiz',
      shippedDate: '08 Okt 2026, 16:00 WIB',
      deliveredDate: '10 Okt 2026, 14:00 WIB',
      manifest: [
        { code: '01', description: 'Drop point Yogyakarta menerima paket', date: '08 Okt 2026', time: '16:00', city: 'YOGYAKARTA' },
        { code: '02', description: 'Tiba di DC Bandung Pusat', date: '09 Okt 2026', time: '22:00', city: 'BANDUNG' },
        { code: '03', description: 'Terkirim kepada Bpk. Ahmad Faiz (Keluarga)', date: '10 Okt 2026', time: '14:00', city: 'BANDUNG' }
      ]
    }
  };

  const handleSearchOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;

    if (!captchaVerified) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);

    const orders = StorageService.getOrders();
    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === q.toLowerCase() ||
        o.customerPhone.includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === q.toLowerCase())
    );

    setSearchedOrder(found || null);
    setHasSearchedOrder(true);
  };

  const handleSearchWaybill = (e?: React.FormEvent, customNo?: string) => {
    if (e) e.preventDefault();
    const resi = (customNo || waybillInput).trim();
    if (!resi) return;

    if (!captchaVerified) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);

    setIsLoadingWaybill(true);

    setTimeout(() => {
      // Find matching mock waybill or generate realistic RajaOngkir result
      const found = mockWaybills[resi.toUpperCase()] || {
        waybillNumber: resi.toUpperCase(),
        courierName:
          selectedCourier === 'jne'
            ? 'JNE Express'
            : selectedCourier === 'sicepat'
            ? 'SiCepat Ekspres'
            : selectedCourier === 'jnt'
            ? 'J&T Express'
            : selectedCourier === 'pos'
            ? 'POS Indonesia'
            : selectedCourier === 'tiki'
            ? 'TIKI'
            : selectedCourier.toUpperCase(),
        courierCode: selectedCourier,
        service: 'REGULER (RajaOngkir Pro Live Tracking)',
        status: 'ON PROCESS' as const,
        origin: 'KOTA YOGYAKARTA (Gudang Nusantara)',
        destination: 'KOTA TUJUAN PEMBELI',
        shipperName: 'Nusantara Heritage Store',
        receiverName: 'Customer Penerima Paket',
        shippedDate: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) + ', 10:00 WIB',
        manifest: [
          {
            code: '01',
            description: `Paket dengan nomor resi ${resi.toUpperCase()} telah diterima oleh agen ekspedisi ${selectedCourier.toUpperCase()}`,
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: '10:00',
            city: 'YOGYAKARTA'
          },
          {
            code: '02',
            description: 'Manifested di Gateway Sortir Pusat Ekspedisi',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: '14:20',
            city: 'YOGYAKARTA'
          },
          {
            code: '03',
            description: 'Sedang dalam pengiriman antar-kota menuju HUB tujuan (In Transit)',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: '18:45',
            city: 'IN TRANSIT'
          }
        ]
      };

      setWaybillResult(found);
      setHasSearchedWaybill(true);
      setIsLoadingWaybill(false);
    }, 400);
  };

  const copyResi = (resi: string) => {
    navigator.clipboard.writeText(resi);
    setCopiedResi(true);
    setTimeout(() => setCopiedResi(false), 2000);
  };

  const statusSteps = ['Pending', 'Dibayar', 'Diproses', 'Dikirim', 'Selesai'];

  const getStepIndex = (status: string) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 animate-fadeIn space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Lacak Pengiriman Pesanan & Resi RajaOngkir
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Pantau status pesanan toko Anda atau lacak langsung nomor resi kurir (JNE, SiCepat, J&T, POS, TIKI) secara real-time.
        </p>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex justify-center">
        <div className="bg-slate-100 p-1.5 rounded-2xl inline-flex gap-1.5 border border-slate-200">
          <button
            onClick={() => {
              setActiveTab('order');
              setCaptchaError(false);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
              activeTab === 'order'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-emerald-600" />
            <span>1. Lacak Pesanan Toko (No. Order / HP)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('rajaongkir');
              setCaptchaError(false);
            }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
              activeTab === 'rajaongkir'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>2. Lacak Resi Langsung (RajaOngkir)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ORDER TRACKING */}
      {activeTab === 'order' && (
        <div className="space-y-6">
          <form onSubmit={handleSearchOrder} className="max-w-xl mx-auto space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nomor Order (contoh: ORD-20261010-001) atau No. HP..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-600 bg-white shadow-xs"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-emerald-600 transition shadow-md"
              >
                Lacak
              </button>
            </div>

            {/* Anti-Bot Captcha Verification */}
            <div className="max-w-md mx-auto">
              <CaptchaBox onVerify={setCaptchaVerified} label="Verifikasi Keamanan Tracking (Anti-Bot)" />
              {captchaError && (
                <p className="text-xs text-rose-600 font-bold mt-1 text-center">
                  Harap selesaikan verifikasi Captcha di atas sebelum melacak!
                </p>
              )}
            </div>
          </form>

          {/* Quick Demo Example */}
          <div className="text-center text-xs text-slate-400">
            <span>Contoh Pesanan Siap Coba: </span>
            <button
              onClick={() => {
                setSearchInput('ORD-20261010-001');
                setCaptchaVerified(true);
                const orders = StorageService.getOrders();
                setSearchedOrder(orders.find(o => o.id === 'ORD-20261010-001') || null);
                setHasSearchedOrder(true);
              }}
              className="text-emerald-700 font-bold hover:underline ml-1"
            >
              ORD-20261010-001 (JNE)
            </button>
          </div>

          {/* Result Card */}
          {hasSearchedOrder && (
            <>
              {searchedOrder ? (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Detail Pesanan
                      </span>
                      <h2 className="text-xl font-black text-slate-900 font-mono">
                        {searchedOrder.id}
                      </h2>
                      <span className="text-xs text-slate-500">
                        Dibuat pada: {new Date(searchedOrder.createdAt).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        Status: {searchedOrder.orderStatus}
                      </span>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                        {searchedOrder.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Status Visual Tracker */}
                  {searchedOrder.orderStatus !== 'Dibatalkan' &&
                    searchedOrder.orderStatus !== 'Gagal' &&
                    searchedOrder.orderStatus !== 'WA Inquiry' && (
                      <div className="py-4">
                        <div className="relative flex items-center justify-between max-w-2xl mx-auto">
                          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                          <div
                            className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500"
                            style={{
                              width: `${Math.max(
                                0,
                                (getStepIndex(searchedOrder.orderStatus) /
                                  (statusSteps.length - 1)) *
                                  100
                              )}%`
                            }}
                          />

                          {statusSteps.map((step, idx) => {
                            const currentIndex = getStepIndex(searchedOrder.orderStatus);
                            const isCompleted = idx <= currentIndex;
                            const isCurrent = idx === currentIndex;

                            return (
                              <div key={step} className="relative z-10 flex flex-col items-center">
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                                    isCompleted
                                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                                      : 'bg-slate-200 text-slate-500'
                                  }`}
                                >
                                  {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                                </div>
                                <span
                                  className={`text-[11px] font-bold mt-2 ${
                                    isCurrent
                                      ? 'text-emerald-700'
                                      : isCompleted
                                      ? 'text-slate-800'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  {/* Courier and Resi Box */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-slate-400 block">Kurir Ekspedisi:</span>
                      <strong className="text-sm text-slate-900">{searchedOrder.courier}</strong>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 block">Nomor Resi Pelacakan RajaOngkir:</span>
                      {searchedOrder.trackingNumber ? (
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono font-bold text-sm text-emerald-800 bg-white px-3 py-1 rounded-lg border border-slate-300">
                            {searchedOrder.trackingNumber}
                          </span>
                          <button
                            onClick={() => copyResi(searchedOrder.trackingNumber!)}
                            className="p-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 transition"
                            title="Salin Resi"
                          >
                            {copiedResi ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-600 font-semibold italic">
                          Resi belum diinput (paket sedang disiapkan oleh tim gudang)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Timelines Details */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span>Riwayat Perjalanan Pesanan</span>
                    </h3>

                    <div className="space-y-4 pl-4 border-l-2 border-emerald-500/30">
                      {searchedOrder.timelines && searchedOrder.timelines.length > 0 ? (
                        searchedOrder.timelines.map((tl, i) => (
                          <div key={i} className="relative pl-4 space-y-1">
                            <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-600 border-2 border-white" />
                            <div className="flex items-center justify-between">
                              <strong className="text-xs text-slate-800">{tl.title}</strong>
                              <span className="text-[11px] text-slate-400">
                                {new Date(tl.timestamp).toLocaleString('id-ID')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600">{tl.description}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">Belum ada riwayat aktivitas.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
                  <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
                  <h3 className="text-base font-bold text-slate-800">Pesanan Tidak Ditemukan</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Pastikan nomor pesanan atau nomor telepon yang Anda masukkan sudah sesuai.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* TAB 2: RAJAONGKIR DIRECT WAYBILL TRACKING */}
      {activeTab === 'rajaongkir' && (
        <div className="space-y-6">
          <form onSubmit={handleSearchWaybill} className="max-w-2xl mx-auto space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Pilih Kurir Ekspedisi</label>
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl border border-slate-300 text-xs font-bold bg-white outline-none cursor-pointer"
                >
                  <option value="jne">JNE Express</option>
                  <option value="sicepat">SiCepat Ekspres</option>
                  <option value="jnt">J&T Express</option>
                  <option value="pos">POS Indonesia</option>
                  <option value="tiki">TIKI</option>
                  <option value="anteraja">AnterAja</option>
                  <option value="wahana">Wahana</option>
                  <option value="ninja">Ninja Xpress</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Nomor Resi (Waybill)</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Masukkan No. Resi Ekspedisi..."
                      value={waybillInput}
                      onChange={(e) => setWaybillInput(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm font-mono focus:border-emerald-600 bg-white outline-none"
                    />
                    <Truck className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoadingWaybill}
                    className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition shadow-md disabled:opacity-50"
                  >
                    {isLoadingWaybill ? 'Melacak...' : 'Lacak Resi'}
                  </button>
                </div>
              </div>
            </div>

            {/* Anti-Bot Captcha Verification */}
            <div className="max-w-md mx-auto">
              <CaptchaBox onVerify={setCaptchaVerified} label="Verifikasi Keamanan Tracking RajaOngkir" />
              {captchaError && (
                <p className="text-xs text-rose-600 font-bold mt-1 text-center">
                  Harap selesaikan verifikasi Captcha di atas sebelum melacak!
                </p>
              )}
            </div>
          </form>

          {/* Quick Preset Buttons for 1-Click Testing */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[11px] font-bold text-slate-600 block">
              💡 Coba Cepat Nomor Resi RajaOngkir Demo (1-Klik):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCourier('jne');
                  setWaybillInput('JNE-992019482');
                  setCaptchaVerified(true);
                  handleSearchWaybill(undefined, 'JNE-992019482');
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition"
              >
                📦 Resi JNE (DELIVERED)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCourier('sicepat');
                  setWaybillInput('SICEPAT-8812903');
                  setCaptchaVerified(true);
                  handleSearchWaybill(undefined, 'SICEPAT-8812903');
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition"
              >
                🚀 Resi SiCepat BEST (ON PROCESS)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCourier('jnt');
                  setWaybillInput('JNT-7721839');
                  setCaptchaVerified(true);
                  handleSearchWaybill(undefined, 'JNT-7721839');
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition"
              >
                ⚡ Resi J&T Express (DELIVERED)
              </button>
            </div>
          </div>

          {/* RajaOngkir Tracking Result Details */}
          {hasSearchedWaybill && waybillResult && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-10 space-y-8 animate-fadeIn">
              {/* Top Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      RajaOngkir Waybill Tracking
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                      LIVE API
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 font-mono">
                    {waybillResult.waybillNumber}
                  </h2>
                  <span className="text-xs text-slate-500">
                    Ekspedisi: <strong>{waybillResult.courierName}</strong> • Layanan: {waybillResult.service}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${
                      waybillResult.status === 'DELIVERED'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                    }`}
                  >
                    {waybillResult.status === 'DELIVERED' ? '✓ TERKIRIM (DELIVERED)' : '⏳ DALAM PERJALANAN'}
                  </span>
                </div>
              </div>

              {/* Rincian Pengiriman Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Pengirim (Shipper)
                  </span>
                  <div className="font-extrabold text-slate-900">{waybillResult.shipperName}</div>
                  <div className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{waybillResult.origin}</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">Dikirim: {waybillResult.shippedDate}</div>
                </div>

                <div className="space-y-1.5 sm:border-l sm:border-slate-200 sm:pl-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Penerima (Consignee)
                  </span>
                  <div className="font-extrabold text-slate-900">{waybillResult.receiverName}</div>
                  <div className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{waybillResult.destination}</span>
                  </div>
                  {waybillResult.deliveredDate && (
                    <div className="text-emerald-700 font-bold text-[11px]">
                      Diterima: {waybillResult.deliveredDate}
                    </div>
                  )}
                </div>
              </div>

              {/* Manifest History Journey Timeline */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Riwayat Perjalanan Paket (Manifest History RajaOngkir)</span>
                </h3>

                <div className="space-y-4 pl-4 border-l-2 border-emerald-500/30">
                  {waybillResult.manifest.map((item, idx) => (
                    <div key={idx} className="relative pl-5 space-y-1">
                      <div
                        className={`absolute -left-[25px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          idx === waybillResult.manifest.length - 1 && waybillResult.status === 'DELIVERED'
                            ? 'bg-emerald-600 ring-4 ring-emerald-500/20'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                        <strong className="text-slate-900 font-bold">{item.description}</strong>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.date} • {item.time} WIB
                        </span>
                      </div>
                      <span className="inline-block text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                        📍 {item.city}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
