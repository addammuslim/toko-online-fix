import React, { useState } from 'react';
import { Customer, LoyaltyReward, Order } from '../../types';
import { StorageService } from '../../services/storage';
import { CaptchaBox } from '../common/CaptchaBox';
import { LoyaltyStampGrid } from '../loyalty/LoyaltyStampGrid';
import {
  User,
  Mail,
  Lock,
  Phone,
  X,
  Sparkles,
  Award,
  Gift,
  ShoppingBag,
  CheckCircle2,
  LogOut,
  MapPin,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentCustomer: Customer | null;
  onCustomerChange: (customer: Customer | null) => void;
  loyaltyRewards: LoyaltyReward[];
  orders: Order[];
}

export const CustomerAuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentCustomer,
  onCustomerChange,
  loyaltyRewards,
  orders
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [captchaValid, setCaptchaValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // If customer is already logged in, show Profile & Loyalty Rewards view
  if (currentCustomer) {
    const customerOrders = orders.filter(
      (o) =>
        o.customerId === currentCustomer.id ||
        o.customerEmail === currentCustomer.email ||
        o.customerPhone === currentCustomer.phone
    );

    const orderCount = customerOrders.length;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-black text-sm text-white">
                {currentCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">{currentCustomer.name}</h3>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {currentCustomer.email} • {currentCustomer.isGoogleAccount ? 'Google Account' : 'Member Terdaftar'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  StorageService.setLoggedInCustomer(null);
                  onCustomerChange(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Profile & Loyalty Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
            {/* Digital Loyalty Stamp Calendar / Matrix */}
            <LoyaltyStampGrid
              orderCount={orderCount}
              loyaltyRewards={loyaltyRewards}
              customerName={currentCustomer.name}
              orders={customerOrders}
            />

            {/* Customer Saved Info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[11px]">
                Informasi Pengiriman Tersimpan:
              </span>
              <p className="text-slate-600 leading-relaxed">
                <strong>Alamat:</strong> {currentCustomer.address || 'Belum diisi'}
                {currentCustomer.subdistrict ? `, Kec. ${currentCustomer.subdistrict}` : ''}
                {currentCustomer.city ? `, ${currentCustomer.city}` : ''}
                {currentCustomer.province ? `, ${currentCustomer.province}` : ''}
              </p>
              <p className="text-slate-600">
                <strong>Telepon/WhatsApp:</strong> {currentCustomer.phone}
              </p>
            </div>

            {/* Order History */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                <span>Riwayat Pesanan Anda ({customerOrders.length})</span>
              </h4>

              {customerOrders.length === 0 ? (
                <div className="p-6 text-center text-slate-400 italic bg-slate-50 rounded-2xl">
                  Belum ada transaksi. Silakan jelajahi katalog dan lakukan pesanan pertama Anda!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 font-mono">{ord.id}</strong>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {ord.orderStatus}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {new Date(ord.createdAt).toLocaleDateString('id-ID')} • {ord.courier}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">
                          Rp {ord.totalAmount.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {ord.items.length} macam produk
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle Normal Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!captchaValid) {
      setErrorMessage('Jawaban Captcha salah atau belum diisi!');
      return;
    }

    const customers = StorageService.getCustomers();
    const found = customers.find(
      (c) =>
        (c.username.toLowerCase() === username.trim().toLowerCase() ||
          c.email.toLowerCase() === username.trim().toLowerCase())
    );

    if (found) {
      StorageService.setLoggedInCustomer(found);
      onCustomerChange(found);
      onClose();
    } else {
      setErrorMessage('Username/Email atau Password tidak cocok!');
    }
  };

  // Handle Google Login Simulation
  const handleGoogleLogin = () => {
    if (!captchaValid) {
      setErrorMessage('Mohon selesaikan verifikasi Captcha terlebih dahulu demi keamanan!');
      return;
    }

    // Google Verified Profile simulation
    const customers = StorageService.getCustomers();
    const googleEmail = 'user.google@gmail.com';
    let user = customers.find((c) => c.email === googleEmail);

    if (!user) {
      user = {
        id: `cust-${Date.now()}`,
        name: 'Pengguna Google Terverifikasi',
        username: 'google_user',
        email: googleEmail,
        phone: '081299998888',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        isGoogleAccount: true,
        orderCount: 1,
        totalSpent: 429000,
        loyaltyPoints: 42,
        claimedRewards: [],
        createdAt: new Date().toISOString()
      };
      StorageService.addCustomer(user);
    }

    StorageService.setLoggedInCustomer(user);
    onCustomerChange(user);

    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
    onClose();
  };

  // Handle Register
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!captchaValid) {
      setErrorMessage('Jawaban Captcha salah atau belum diisi!');
      return;
    }

    const customers = StorageService.getCustomers();
    if (customers.some((c) => c.email.toLowerCase() === email.trim().toLowerCase())) {
      setErrorMessage('Alamat email sudah terdaftar!');
      return;
    }

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name,
      username: username.trim().toLowerCase() || email.split('@')[0],
      email: email.trim(),
      phone,
      isGoogleAccount: false,
      orderCount: 0,
      totalSpent: 0,
      loyaltyPoints: 50, // Welcome 50 points
      claimedRewards: [],
      createdAt: new Date().toISOString()
    };

    StorageService.addCustomer(newCust);
    StorageService.setLoggedInCustomer(newCust);
    onCustomerChange(newCust);

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch (e) {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Tabs */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setTab('login');
                setErrorMessage('');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                tab === 'login' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Masuk Akun
            </button>
            <button
              onClick={() => {
                setTab('register');
                setErrorMessage('');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                tab === 'register' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              Daftar Member
            </button>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 transition flex items-center justify-center gap-3 font-bold text-slate-700 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Lanjutkan dengan Google</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[10px] uppercase font-bold">
              atau dengan Username/Email
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Username / Email</label>
                <input
                  type="text"
                  placeholder="Contoh: ananda_putri / ananda@gmail.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              {/* Captcha requirement */}
              <CaptchaBox onVerify={setCaptchaValid} label="Verifikasi Captcha Sebelum Masuk" />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-emerald-600 transition shadow-md"
              >
                Masuk ke Akun
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  placeholder="Nama Lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Email *</label>
                <input
                  type="email"
                  placeholder="email@anda.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="08123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Kata Sandi (Password) *</label>
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
                />
              </div>

              {/* Captcha requirement */}
              <CaptchaBox onVerify={setCaptchaValid} label="Verifikasi Captcha Pendaftaran" />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition shadow-md"
              >
                Daftar & Dapatkan Bonus 50 Poin
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
