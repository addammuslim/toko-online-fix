import React from 'react';
import { ContactMessage } from '../../types';
import { StorageService } from '../../services/storage';
import { MessageSquare, Mail, Phone, Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  inbox: ContactMessage[];
  onRefresh: () => void;
}

export const AdminInbox: React.FC<Props> = ({ inbox, onRefresh }) => {
  const handleDelete = (id: string) => {
    StorageService.deleteInbox(id);
    onRefresh();
  };

  const handleToggleRead = (id: string) => {
    StorageService.markInboxRead(id);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Pesan Masuk (Kontak & CS)
        </h1>
        <p className="text-xs text-slate-500">
          Daftar pesan dan pertanyaan yang dikirimkan oleh pengunjung melalui formulir Kontak Kami
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {inbox.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            Belum ada pesan masuk di kotak surat.
          </div>
        ) : (
          inbox.map((msg) => (
            <div key={msg.id} className="p-5 flex flex-col sm:flex-row justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900">{msg.name}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {msg.status === 'unread' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      Baru
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {msg.email}
                  </span>
                  {msg.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {msg.phone}
                    </span>
                  )}
                  <span className="font-semibold text-slate-700">Subjek: {msg.subject}</span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {msg.message}
                </p>
              </div>

              <div className="flex items-center sm:flex-col justify-end gap-2 shrink-0">
                {msg.phone && (
                  <a
                    href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Balas WA</span>
                  </a>
                )}

                <button
                  onClick={() => handleToggleRead(msg.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 transition"
                  title="Tandai Sudah Dibaca"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 transition"
                  title="Hapus Pesan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
