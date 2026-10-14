import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  X,
  Star,
  Image as ImageIcon,
  Check,
  Plus,
  Link,
  Sparkles
} from 'lucide-react';

interface Props {
  label: string;
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
  maxImages?: number;
  helperText?: string;
}

export const ImageUpload: React.FC<Props> = ({
  label,
  images,
  onChange,
  multiple = true,
  maxImages = 8,
  helperText
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  // Sample curated photos for quick testing
  const samplePresets = [
    { name: 'Batik Tulis Sutra', url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=80' },
    { name: 'Kopi Arabika Gayo', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop&q=80' },
    { name: 'Kerajinan Kulit Asli', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80' },
    { name: 'Tenun Tradisional', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80' },
    { name: 'Logo Toko Heritage', url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80' }
  ];

  // Resize and compress image using Canvas to ensure fast loading and prevent localStorage overflow
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            resolve(dataUrl);
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    try {
      const processedPromises: Promise<string>[] = [];
      const countToProcess = multiple ? Math.min(files.length, maxImages - images.length) : 1;

      for (let i = 0; i < countToProcess; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          processedPromises.push(processImageFile(file));
        }
      }

      const newUrls = await Promise.all(processedPromises);

      if (multiple) {
        onChange([...images, ...newUrls].slice(0, maxImages));
      } else {
        onChange(newUrls.slice(0, 1));
      }
    } catch (err) {
      console.error('Error uploading image files:', err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(images.filter((_, i) => i !== indexToRemove));
  };

  const handleSetPrimary = (indexToPrimary: number) => {
    if (indexToPrimary === 0) return;
    const item = images[indexToPrimary];
    const rest = images.filter((_, i) => i !== indexToPrimary);
    onChange([item, ...rest]);
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (multiple) {
      onChange([...images, manualUrl.trim()].slice(0, maxImages));
    } else {
      onChange([manualUrl.trim()]);
    }
    setManualUrl('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800">
          {label} {multiple && <span className="text-slate-400 font-normal">({images.length}/{maxImages} Foto)</span>}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
          >
            <Link className="w-3 h-3" />
            <span>{showUrlInput ? 'Tutup URL' : 'Input URL / Contoh'}</span>
          </button>
        </div>
      </div>

      {helperText && <p className="text-[11px] text-slate-500">{helperText}</p>}

      {/* Manual URL / Preset Box */}
      {showUrlInput && (
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-fadeIn">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Tempel link URL gambar (https://...)"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
            />
            <button
              type="button"
              onClick={handleAddManualUrl}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
            >
              Tambah
            </button>
          </div>

          <div className="pt-1">
            <span className="text-[10px] font-bold text-slate-400 block mb-1">
              Atau pilih contoh foto demo:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePresets.map((sp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (multiple) {
                      onChange([...images, sp.url].slice(0, maxImages));
                    } else {
                      onChange([sp.url]);
                    }
                  }}
                  className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-semibold text-slate-700 hover:border-emerald-500 hover:text-emerald-700 transition"
                >
                  + {sp.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Upload Drag & Drop Box */}
      {(multiple ? images.length < maxImages : images.length === 0) && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/60'
              : 'border-slate-300 hover:border-emerald-500 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-emerald-600">
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <span className="font-extrabold text-xs text-slate-800 block">
              {isProcessing
                ? 'Mengunggah & Mengoptimasi Foto...'
                : 'Pilih Foto dari Galeri / Komputer'}
            </span>
            <span className="text-[11px] text-slate-500">
              {multiple
                ? `Mendukung multi-upload hingga ${maxImages} gambar (JPG, PNG, WEBP)`
                : 'Pilih file gambar dari perangkat Anda'}
            </span>
          </div>
        </div>
      )}

      {/* Thumbnail Gallery & Controls */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
          {images.map((imgUrl, index) => {
            const isPrimary = index === 0;
            return (
              <div
                key={`${imgUrl.slice(0, 30)}-${index}`}
                className={`relative group rounded-2xl overflow-hidden border transition bg-slate-100 aspect-square shadow-xs ${
                  isPrimary ? 'border-2 border-emerald-600 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Badge */}
                {isPrimary ? (
                  <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-10">
                    <Star className="w-2.5 h-2.5 fill-white" />
                    <span>Utama</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetPrimary(index);
                    }}
                    title="Jadikan Gambar Utama / Cover"
                    className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 bg-black/70 hover:bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full transition shadow-md flex items-center gap-1 z-10"
                  >
                    <Star className="w-2.5 h-2.5" />
                    <span>Jadikan Utama</span>
                  </button>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(index);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 hover:scale-110 transition shadow-md z-10"
                  title="Hapus Foto"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Bottom numbering */}
                <div className="absolute bottom-1 right-1.5 bg-black/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-xs">
                  #{index + 1}
                </div>
              </div>
            );
          })}

          {/* Add more button tile if multi-image and not full */}
          {multiple && images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/30 transition aspect-square"
            >
              <Plus className="w-6 h-6 mb-1" />
              <span className="text-[10px] font-bold">+ Tambah Foto</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
