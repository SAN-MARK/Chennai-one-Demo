import React, { useState } from 'react';
import { MtcPass, MtcPassType } from '../types';
import { X, Check, CreditCard, User, Tag, Calendar, Image as ImageIcon } from 'lucide-react';

interface PassFormProps {
  pass: MtcPass;
  onUpdate: (updatedPass: MtcPass) => void;
  onClose: () => void;
}

const PRESET_AVATARS = [
  { name: 'Sanjeev M', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { name: 'Aravind Swamy', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { name: 'Priya Dharshini', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { name: 'Ananya Ram', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' }
];

export default function PassForm({ pass, onUpdate, onClose }: PassFormProps) {
  const [passNo, setPassNo] = useState(pass.passNo);
  const [name, setName] = useState(pass.name);
  const [type, setType] = useState<MtcPassType>(pass.type);
  const [amount, setAmount] = useState(pass.amount);
  const [validTo, setValidTo] = useState(pass.validTo);
  const [photoUrl, setPhotoUrl] = useState(pass.photoUrl);
  const [isSaved, setIsSaved] = useState(false);

  // Automatically adjust price depending on pass type
  const handleTypeChange = (selectedType: MtcPassType) => {
    setType(selectedType);
    if (selectedType === 'Student') {
      setAmount(500);
    } else if (selectedType === 'AC') {
      setAmount(1500);
    } else if (selectedType === 'Senior') {
      setAmount(300);
    } else {
      setAmount(1000); // General
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...pass,
      passNo,
      name,
      type,
      amount,
      validTo,
      photoUrl
    });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 max-h-[85%] rounded-t-[32px] bg-slate-900 border-t border-slate-800 text-white z-50 p-6 flex flex-col shadow-2xl overflow-y-auto no-scrollbar" id="pass-customization-form">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-500" />
            Pass Configurator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Customize your MTC Bus Pass parameters</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-all active:scale-90"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 mt-5">
        {/* Pass No */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Pass Number</label>
          <div className="relative">
            <input 
              type="text" 
              maxLength={8}
              value={passNo}
              onChange={(e) => setPassNo(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono tracking-widest text-lg"
              placeholder="e.g. 00481887"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">
              {passNo.length}/8 Digits
            </span>
          </div>
        </div>

        {/* Holder Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Pass Holder Name</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <User className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans text-base"
              placeholder="e.g. Sanjeev M"
              required
            />
          </div>
        </div>

        {/* Pass Type Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Pass Classification</label>
          <div className="grid grid-cols-2 gap-2">
            {(['General', 'Student', 'AC', 'Senior'] as MtcPassType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-between ${
                  type === t 
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{t}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {t === 'Student' ? '₹500' : t === 'AC' ? '₹1500' : t === 'Senior' ? '₹300' : '₹1000'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Expiry Date input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Expiry Date (Valid For)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <Calendar className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              value={validTo}
              onChange={(e) => setValidTo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans font-medium"
              placeholder="DD/MM/YYYY"
              required
            />
          </div>
        </div>

        {/* Custom Photo Upload & Preset Avatar Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Pass Photo Identification</label>
          
          {/* Presets Grid */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESET_AVATARS.map((avatar, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPhotoUrl(avatar.url);
                  setName(avatar.name);
                }}
                className={`group relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                  photoUrl === avatar.url ? 'border-amber-500 scale-105' : 'border-slate-800 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] text-white text-center font-bold px-0.5">{avatar.name.split(' ')[0]}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Drag & Drop File Upload from User's Local System */}
          <div 
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-amber-500', 'bg-amber-500/5');
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-amber-500', 'bg-amber-500/5');
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove('border-amber-500', 'bg-amber-500/5');
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  if (event.target?.result) {
                    setPhotoUrl(event.target.result as string);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
            onClick={() => document.getElementById('pass-image-file-input')?.click()}
            className="border-2 border-dashed border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center bg-slate-950 hover:border-amber-500 hover:bg-slate-900/40 transition-all cursor-pointer text-center group mb-3"
          >
            <input 
              id="pass-image-file-input"
              type="file" 
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    if (event.target?.result) {
                      setPhotoUrl(event.target.result as string);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <ImageIcon className="w-5 h-5 text-slate-500 group-hover:text-amber-500 group-hover:scale-110 transition-all mb-1" />
            <span className="text-xs font-bold text-slate-300">Drag & drop photo here</span>
            <span className="text-[10px] text-slate-500 mt-0.5">or <span className="text-amber-500 underline font-semibold">browse files</span> from system</span>
          </div>

          {/* Custom URL Input Fallback */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <ImageIcon className="w-4 h-4" />
            </span>
            <input 
              type="text" 
              value={photoUrl.startsWith('data:') ? 'Custom local file loaded successfully ✅' : photoUrl}
              onChange={(e) => {
                if (!e.target.value.includes('loaded successfully')) {
                  setPhotoUrl(e.target.value);
                }
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-sans text-xs"
              placeholder="Or paste external custom image URL here..."
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full py-4 rounded-xl text-center font-bold text-base transition-all flex items-center justify-center gap-2 ${
            isSaved 
              ? 'bg-emerald-600 text-white' 
              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 active:scale-98'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-5 h-5" /> Saved & Activated
            </>
          ) : (
            'Apply Configuration'
          )}
        </button>
      </form>
    </div>
  );
}
