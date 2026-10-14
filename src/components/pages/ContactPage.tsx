import React, { useState } from 'react';
import { WebSettings, ContactMessage } from '../../types';
import { StorageService } from '../../services/storage';
import { trackEvent } from '../../services/pixelTracker';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

interface Props {
  settings: WebSettings;
}

export const ContactPage: React.FC<Props> = ({ settings }) => {
  const contactPage = StorageService.getCustomPageById('contact');

  const pageTitle = contactPage?.title || 'Hubungi Tim ' + settings.storeName;
  const pageSubtitle = contactPage?.subtitle || 'Punya pertanyaan seputar pesanan, kustomisasi produk batik, atau kemitraan bisnis? Kami siap membantu dengan senang hati.';
  const officialAddress = contactPage?.address || settings.address;
  const officialPhone = contactPage?.contactPhone || settings.whatsappNumber;
  const officialEmail = contactPage?.contactEmail || settings.email;
  const officialHours = contactPage?.operatingHours || 'Senin - Minggu: 08:00 - 22:00 WIB (Online CS Fast Response)';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      phone,
      subject: subject || 'Pertanyaan Umum',
      message,
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    StorageService.addInbox(newMessage);
    StorageService.addLog('contact_form_submitted', 'whatsapp', `Pesan baru dari ${name} (${email})`);

    trackEvent('Contact', {
      name,
      email
    });

    setIsSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');

    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12 animate-fadeIn">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {pageTitle}
        </h1>
        <p className="text-sm text-slate-500">
          {pageSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Contact Info Card */}
        <div className="md:col-span-5 bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight">Informasi Layanan Pelanggan</h2>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Kantor & Galeri Utama:</span>
                  <p className="leading-relaxed">{officialAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">WhatsApp Hotline:</span>
                  <p>{officialPhone.startsWith('+') ? officialPhone : `+${officialPhone}`}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Email Resmi:</span>
                  <p>{officialEmail}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">Jam Operasional CS:</span>
                  <p>{officialHours}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <a
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat WhatsApp Langsung</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Kirimkan Pesan Anda</h2>

          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Pesan Anda telah berhasil kami terima. Tim support kami akan menghubungi Anda sesegera mungkin.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Nomor Telepon / WA</label>
                <input
                  type="tel"
                  placeholder="081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Alamat Email *</label>
              <input
                type="email"
                required
                placeholder="email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Subjek Pesan</label>
              <input
                type="text"
                placeholder="Contoh: Konsultasi Seragam Batik Kantor"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Pesan Anda *</label>
              <textarea
                required
                rows={4}
                placeholder="Tuliskan pertanyaan atau kebutuhan Anda secara detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs outline-none focus:bg-white focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirimkan Sekarang</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
