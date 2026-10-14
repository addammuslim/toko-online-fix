import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { CaptchaBox } from '../common/CaptchaBox';
import { ShieldCheck, Lock, Mail, AlertTriangle, KeyRound } from 'lucide-react';

interface Props {
  onSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<Props> = ({ onSuccess, onBackToStore }) => {
  const [email, setEmail] = useState('admin@nusantarastore.id');
  const [password, setPassword] = useState('admin123');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const MAX_ATTEMPTS = 5;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (!captchaVerified) {
      setErrorMsg('Mohon selesaikan verifikasi Captcha terlebih dahulu!');
      return;
    }

    if (attempts >= MAX_ATTEMPTS) {
      setIsLocked(true);
      setErrorMsg('Terlalu banyak percobaan gagal. Akun dikunci sementara demi keamanan (Rate Limit Brute-Force).');
      return;
    }

    if (email === 'admin@nusantarastore.id' && password === 'admin123') {
      StorageService.setAdminLoggedIn(true);
      StorageService.addLog('admin_login_success', 'admin_action', `Admin logged in (${email})`);
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      StorageService.addLog('admin_login_failed', 'auth', `Failed login attempt for ${email} (attempt ${newAttempts})`);

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setErrorMsg('Batas 5 kali percobaan gagal tercapai. Sistem keamanan mengunci form login (Brute-Force Lockout).');
      } else {
        setErrorMsg(`Email atau kata sandi salah. Sisa kesempatan: ${MAX_ATTEMPTS - newAttempts}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 text-white">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Admin & POS Login</h1>
          <p className="text-xs text-slate-400">
            Panel Kontrol Toko Online & Sistem Kasir POS Nusantara
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Demo: <code>admin@nusantarastore.id</code> / <code>admin123</code></span>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1">Email Administrator</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                disabled={isLocked}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-emerald-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Kata Sandi (Password)</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                disabled={isLocked}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-hidden focus:border-emerald-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Captcha requirement */}
          <div className="text-slate-900">
            <CaptchaBox onVerify={setCaptchaVerified} label="Verifikasi Captcha Admin" />
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:opacity-40 text-white font-bold text-xs transition shadow-lg shadow-emerald-900/30"
          >
            Masuk ke Panel Admin
          </button>
        </form>

        <div className="pt-2 text-center">
          <button
            onClick={onBackToStore}
            className="text-xs text-slate-400 hover:text-white transition underline"
          >
            ← Kembali ke Tampilan Depan Toko
          </button>
        </div>
      </div>
    </div>
  );
};
