import React, { useState, useEffect } from 'react';
import { Phone, Clock, Bus, CheckCircle2, X } from 'lucide-react';

interface PassProps {
  user?: {
    name: string;
    photoUrl?: string;
  };
  passNo?: string;
  amount?: number;
  validTo?: string;
  onRenew?: () => void;
  onHelp?: () => void;
  onHistory?: () => void;
}

export default function PassesPage({
  user = {
    name: 'Sanjeev M',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  },
  passNo = '85885182',
  amount = 1000,
  validTo = '30/09/2026',
  onRenew,
  onHelp,
  onHistory
}: PassProps) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');

  // Ticking real-time digital clock for authentication validity
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const monthStr = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      const dayStr = now.getDate().toString().padStart(2, '0');
      
      setCurrentTime(timeStr);
      setCurrentDate(`${monthStr} ${dayStr}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRenewClick = () => {
    if (onRenew) {
      onRenew();
    } else {
      setToastMessage('Official MTC Pass renewal initiated! Your request is being processed.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#0b0e14] text-white font-sans select-none p-4 pb-20 max-w-[480px] mx-auto relative overflow-y-auto no-scrollbar">
      
      {/* Toast Popup Notification */}
      {showToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 border border-slate-700 animate-[bounce_0.4s_ease]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <div className="flex items-center justify-between pb-3 shrink-0">
        <h1 className="text-2xl font-serif font-black text-white tracking-tight">
          Passes
        </h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={onHelp}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1a1f2c] hover:bg-[#282f42] text-white text-xs font-bold rounded-full border border-slate-700/60 shadow-sm cursor-pointer transition-all"
          >
            <Phone className="w-3.5 h-3.5" /> Help
          </button>
          <button 
            onClick={onHistory}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1a1f2c] hover:bg-[#282f42] text-white text-xs font-bold rounded-full border border-slate-700/60 shadow-sm cursor-pointer transition-all"
          >
            <Clock className="w-3.5 h-3.5" /> History
          </button>
        </div>
      </div>

      {/* Below Title: Filter Chip "Bus(1/1)" */}
      <div className="self-start mb-4">
        <div className="flex items-center gap-1.5 bg-white text-black px-3.5 py-1.5 rounded-full font-extrabold text-xs shadow-sm">
          <Bus className="w-3.5 h-3.5 text-black fill-current" />
          <span>Bus(1/1)</span>
        </div>
      </div>

      {/* MAIN VIBRANT MTC PASS CARD CONTAINER (YELLOW #F5C518 WITH DOTTED GRID) */}
      <div 
        className="relative w-full bg-[#F5C518] text-[#002D72] rounded-[32px] p-5 shadow-2xl border-2 border-amber-300 overflow-hidden flex flex-col justify-between"
        style={{
          backgroundImage: 'radial-gradient(#d49d00 1.2px, transparent 1.2px)',
          backgroundSize: '12px 12px'
        }}
      >
        
        {/* 1. TOP HEADER (Inside Yellow Card) */}
        <div className="flex items-center justify-between mb-4">
          {/* Official MTC Circular Seal */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border-2 border-[#002D72] flex items-center justify-center p-0.5 shadow-sm shrink-0">
            <div className="w-full h-full rounded-full border border-amber-900/60 flex flex-col items-center justify-center bg-amber-300/40">
              <span className="text-[10px] font-black text-[#002D72] tracking-tighter leading-none">MTC</span>
            </div>
          </div>

          {/* Center: Large Bold PASS NO & Tamil Subtitle */}
          <div className="text-center flex-1 px-2">
            <h2 className="text-lg md:text-xl font-black text-[#002D72] tracking-wide font-sans leading-tight">
              PASS NO: {passNo}
            </h2>
            <p className="text-[13px] font-bold text-[#002D72] leading-tight mt-0.5 font-serif">
              விருப்பம் போல் பயணம் செய்ய மாதச்சலுகை சீட்டு
            </p>
          </div>

          {/* Right spacer / emblem balance */}
          <div className="w-10 shrink-0" />
        </div>

        {/* 2. CENTER ID CARD (White Box) */}
        <div className="bg-white rounded-[24px] p-5 shadow-lg border border-amber-200 text-center relative mb-4">
          
          {/* Top Row: User Photo + Gold MONTHLY Badge */}
          <div className="flex items-center justify-center gap-4 mb-3">
            {/* User Profile Photo */}
            <div className="w-[100px] h-[120px] rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm shrink-0 bg-slate-100 flex items-center justify-center">
              {user.photoUrl ? (
                <img 
                  src={user.photoUrl} 
                  alt="Pass Holder" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <span className="text-3xl font-bold">👤</span>
                </div>
              )}
            </div>

            {/* Gold MONTHLY Badge next to Photo */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-500 border-2 border-amber-300 shadow-md flex flex-col items-center justify-center text-[#002D72] p-1 shrink-0">
              <span className="text-[9px] font-extrabold uppercase tracking-tight leading-none">MONTHLY</span>
              <span className="text-xs font-black mt-1">₹{amount}</span>
            </div>
          </div>

          {/* Middle Details: Large Price & Validity */}
          <div className="space-y-2">
            <h3 className="text-3xl md:text-4xl font-black text-[#002D72] tracking-tight font-sans">
              ₹{amount}
            </h3>

            <div className="border-t border-dashed border-slate-300 my-2 w-3/4 mx-auto" />

            <div className="space-y-0.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
                VALID FOR
              </span>
              <span className="text-2xl font-black text-[#002D72] tracking-tight font-sans block">
                {validTo}
              </span>
            </div>
          </div>
        </div>

        {/* 3. BOTTOM DETAILS (Inside Yellow Card, below White Box) */}
        <div className="relative pt-1 pb-2">
          
          {/* Left Pill: Time/Date stamp & Right QR code */}
          <div className="flex items-center justify-between px-1">
            {/* Left: White rounded pill containing Date & Time stamp */}
            <div className="bg-white/95 backdrop-blur-xs text-[#002D72] px-3.5 py-1.5 rounded-2xl shadow-sm border border-amber-300/80 text-center font-mono">
              <p className="text-[10px] font-extrabold tracking-wider text-slate-600 uppercase leading-none">
                {currentDate || 'SEP 22'}
              </p>
              <p className="text-sm font-black tracking-tight mt-0.5 leading-none">
                {currentTime || '10:38:21'}
              </p>
            </div>

            {/* Right: Standard Square QR Code */}
            <button 
              onClick={() => setShowQrModal(true)}
              className="w-12 h-12 bg-white rounded-xl p-1 shadow-sm border border-amber-300 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
              title="Click to zoom QR"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                <rect x="10" y="10" width="30" height="30" fill="currentColor" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="currentColor" />

                <rect x="60" y="10" width="30" height="30" fill="currentColor" />
                <rect x="65" y="15" width="20" height="20" fill="white" />
                <rect x="70" y="20" width="10" height="10" fill="currentColor" />

                <rect x="10" y="60" width="30" height="30" fill="currentColor" />
                <rect x="15" y="65" width="20" height="20" fill="white" />
                <rect x="20" y="70" width="10" height="10" fill="currentColor" />

                <rect x="50" y="50" width="12" height="12" fill="currentColor" />
                <rect x="70" y="50" width="15" height="15" fill="currentColor" />
                <rect x="50" y="70" width="15" height="15" fill="currentColor" />
                <rect x="75" y="75" width="15" height="15" fill="currentColor" />
              </svg>
            </button>
          </div>

          {/* Prominent Floating Blue Pill Button: PASS Activated! (1) */}
          <div className="flex justify-center my-3">
            <div className="bg-[#0056D2] text-white px-5 py-2.5 rounded-full flex items-center justify-between gap-3 shadow-xl border-2 border-white/80 active:scale-95 transition-all">
              <span className="text-sm font-black tracking-tight">
                PASS Activated!
              </span>
              <div className="w-7 h-7 rounded-full bg-[#28A745] text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                1
              </div>
            </div>
          </div>

          {/* Terms & Conditions link */}
          <div className="text-center">
            <button 
              onClick={() => alert("MTC Monthly Transit Pass Terms & Conditions:\n\n1. Pass non-transferable.\n2. Valid across all MTC non-AC routes in Chennai urban sector.\n3. Must produce valid identity document upon conductor inspection.")}
              className="text-xs font-bold text-[#002D72] underline hover:opacity-80 cursor-pointer bg-transparent border-none p-0"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </div>

      {/* 4. FOOTER (Below Yellow Card) */}
      <div className="mt-4 space-y-3 text-center">
        <p className="text-[12px] text-slate-400 leading-tight font-medium">
          *Official MTC Update: No OTP Required. Your Pass is Activated and Ready to Use.
        </p>

        <button 
          onClick={handleRenewClick}
          className="w-full bg-[#1A1A1A] hover:bg-[#2b2b2b] text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md active:scale-98 cursor-pointer text-sm uppercase tracking-wide border border-slate-800"
        >
          Renew Pass
        </button>
      </div>

      {/* QR Code Zoom Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs text-center space-y-4 shadow-2xl animate-[fadeIn_0.2s_ease]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">Official Pass QR</h3>
              <button 
                onClick={() => setShowQrModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex justify-center">
              <svg viewBox="0 0 100 100" className="w-48 h-48 text-slate-950 fill-current">
                <rect x="10" y="10" width="30" height="30" fill="currentColor" />
                <rect x="15" y="15" width="20" height="20" fill="white" />
                <rect x="20" y="20" width="10" height="10" fill="currentColor" />

                <rect x="60" y="10" width="30" height="30" fill="currentColor" />
                <rect x="65" y="15" width="20" height="20" fill="white" />
                <rect x="70" y="20" width="10" height="10" fill="currentColor" />

                <rect x="10" y="60" width="30" height="30" fill="currentColor" />
                <rect x="15" y="65" width="20" height="20" fill="white" />
                <rect x="20" y="70" width="10" height="10" fill="currentColor" />

                <rect x="50" y="50" width="12" height="12" fill="currentColor" />
                <rect x="70" y="50" width="15" height="15" fill="currentColor" />
                <rect x="50" y="70" width="15" height="15" fill="currentColor" />
                <rect x="75" y="75" width="15" height="15" fill="currentColor" />
              </svg>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Show this QR code to the bus conductor for instant handheld terminal validation.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
