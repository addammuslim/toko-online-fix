import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { ShieldCheck, FileText, RotateCcw, Lock } from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'refund'>('privacy');
  const policyPage = StorageService.getCustomPageById('policies');

  const title = policyPage?.title || 'Kebijakan & Ketentuan Layanan';
  const subtitle = policyPage?.subtitle || 'Komitmen transparansi, perlindungan privasi data pelanggan, dan jaminan keamanan bertransaksi.';
  const badge = policyPage?.badge || 'Legal & Compliance';

  const sections = policyPage?.sections || [];
  const privacySection = sections[0];
  const refundSection = sections[1];
  const securitySection = sections[2];
  const shippingSection = sections[3];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 animate-fadeIn space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          {badge}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          {subtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        {[
          { id: 'privacy', label: 'Kebijakan Privasi (Privacy Policy)', icon: Lock },
          { id: 'terms', label: 'Syarat & Ketentuan (Terms of Service)', icon: FileText },
          { id: 'refund', label: 'Kebijakan Retur & Garansi', icon: RotateCcw }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl transition ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-6">
        {activeTab === 'privacy' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-slate-900">1. Kebijakan Privasi Data Pelanggan</h2>
            <p>
              {privacySection?.description ||
                'Kami sangat menghargai privasi Anda. Seluruh data identitas, nomor WhatsApp, email, dan alamat pengiriman hanya digunakan untuk keperluan pengiriman pesanan, resi ekspedisi, dan program loyalty resmi toko.'}
            </p>

            <h3 className="text-base font-bold text-slate-800">Keamanan Enkripsi Pembayaran:</h3>
            <p>
              {securitySection?.description ||
                'Semua transaksi online dilindungi sertifikasi keamanan Midtrans dengan enkripsi SSL 256-bit dan standar PCI-DSS. Toko kami tidak pernah menyimpan data kartu kredit atau PIN pelanggan.'}
            </p>

            <h3 className="text-base font-bold text-slate-800">Penyimpanan & Penggunaan Data:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Nama & Telepon: Untuk pengiriman struk digital & notifikasi WhatsApp otomatis saat resi terbit.</li>
              <li>Alamat Lengkap: Digunakan untuk hitung ongkir real-time via API RajaOngkir.</li>
              <li>Akun Google & Password: Diamankan dengan hash salt enkripsi, data tidak dibagikan ke pihak ketiga.</li>
            </ul>
          </div>
        )}

        {activeTab === 'terms' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-slate-900">2. Syarat & Ketentuan Layanan</h2>
            <p>
              Dengan mengakses dan berbelanja di toko kami, Anda menyetujui syarat transaksi berikut:
            </p>

            <h3 className="text-base font-bold text-slate-800">Pemesanan & Harga Produk:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Seluruh harga yang tertera disajikan dalam mata uang Rupiah (IDR) resmi.</li>
              <li>Ketersediaan stok disinkronkan secara real-time antara katalog online dan sistem POS offline.</li>
              <li>Pesanan dianggap sah setelah verifikasi status pembayaran otomatis atau konfirmasi WhatsApp.</li>
            </ul>

            <h3 className="text-base font-bold text-slate-800">Pengiriman & Resi RajaOngkir:</h3>
            <p>
              {shippingSection?.description ||
                'Pengiriman dilakukan melalui kurir partner resmi (JNE, J&T, SiCepat, AnterAja, POS Indonesia). Nomor resi otomatis diinput ke sistem maksimal 1x24 jam kerja setelah pembayaran terkonfirmasi dan dapat dilacak real-time.'}
            </p>
          </div>
        )}

        {activeTab === 'refund' && (
          <div className="space-y-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-slate-900">3. Kebijakan Retur & Garansi Kepuasan Pelanggan</h2>
            <p>
              {refundSection?.description ||
                'Jika barang yang Anda terima cacat produksi, rusak saat pengiriman, atau tidak sesuai spesifikasi ukuran/warna, Anda berhak mengajukan retur gratis dalam 2x24 jam sejak paket diterima menurut riwayat kurir.'}
            </p>

            <h3 className="text-base font-bold text-slate-800">Ketentuan Klaim Pengembalian:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Menyertakan video unboxing paket saat pertama kali dibuka.</li>
              <li>Tag label produk dan kemasan asli masih utuh dan belum dicuci/dipakai berulang.</li>
              <li>Klaim diajukan via WhatsApp Customer Service resmi kami dalam 2x24 jam setelah status resi menunjukkan Delivered.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
