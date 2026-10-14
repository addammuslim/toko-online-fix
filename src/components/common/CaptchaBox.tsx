import React, { useState, useEffect } from 'react';
import { RotateCw, ShieldCheck } from 'lucide-react';

interface Props {
  onVerify: (isValid: boolean) => void;
  label?: string;
}

export const CaptchaBox: React.FC<Props> = ({ onVerify, label = 'Verifikasi Keamanan (Captcha)' }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const n2 = Math.floor(Math.random() * 8) + 1; // 1 to 8
    setNum1(n1);
    setNum2(n2);
    setUserInput('');
    setIsCorrect(null);
    onVerify(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (val: string) => {
    setUserInput(val);
    const parsed = parseInt(val.trim(), 10);
    if (!isNaN(parsed) && parsed === num1 + num2) {
      setIsCorrect(true);
      onVerify(true);
    } else {
      setIsCorrect(false);
      onVerify(false);
    }
  };

  return (
    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition"
          title="Acak Soal Captcha Baru"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-black text-sm tracking-widest select-none shadow-xs">
          {num1} + {num2} = ?
        </div>
        <input
          type="number"
          placeholder="Jawaban..."
          value={userInput}
          onChange={(e) => handleInputChange(e.target.value)}
          className={`flex-1 px-3 py-1.5 text-xs rounded-xl border font-bold transition focus:outline-hidden ${
            isCorrect === true
              ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800'
              : isCorrect === false && userInput.length > 0
              ? 'border-rose-400 bg-rose-50/50 text-rose-800'
              : 'border-slate-300 bg-white text-slate-900'
          }`}
        />
        {isCorrect === true && (
          <span className="text-xs text-emerald-600 font-bold px-1.5">✓ Benar</span>
        )}
      </div>
    </div>
  );
};
