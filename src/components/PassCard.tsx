import React, { useEffect, useState } from 'react';
import { MtcPass } from '../types';
import { ShieldCheck, Calendar, Info, QrCode, Camera, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PassCardProps {
  pass: MtcPass;
  onRenewClick: () => void;
  onPhotoUpload?: (url: string) => void;
}

export default function PassCard({ pass, onRenewClick, onPhotoUpload }: PassCardProps) {
  const [liveTime, setLiveTime] = useState<Date>(new Date());
  const [isQrZoomed, setIsQrZoomed] = useState<boolean>(false);

  // Update clock every second to match the dynamic live verification clock
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format month and day: "Jul 11"
  const formatMonthDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format time: "13:26:02"
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // Default profile picture fallback (Avatar with initials or elegant vector profile)
  const defaultProfilePic = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`;

  return (
    <div className="flex flex-col items-center w-full select-none" id="mtc-pass-card-container">
      {/* The Gold Card Wrapper */}
      <div 
        className="relative w-full max-w-[420px] aspect-[1/1.5] rounded-[40px] p-6 shadow-2xl flex flex-col justify-between overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #fce074 0%, #dbb030 50%, #ad8010 100%)',
          boxShadow: '0 25px 50px -12px rgba(173, 128, 16, 0.4)'
        }}
        id="gold-card-body"
      >
        {/* Subtle dot pattern grid overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.18]"
          style={{
            backgroundImage: 'radial-gradient(#1e293b 15%, transparent 15%)',
            backgroundSize: '12px 12px'
          }}
        />

        {/* Shiny sweep effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_5s_infinite] pointer-events-none" />

        {/* TOP SECTION: MTC circle and Pass Info */}
        <div className="flex flex-col items-center justify-center z-10 w-full text-center relative" id="pass-header-section">
          {/* MTC Double Circular Logo - Absolutely positioned to the left within card padding bounds */}
          <div className="absolute left-0 top-0 flex items-center justify-center border-[2px] border-white/60 rounded-full p-[3px]" id="mtc-logo-outer">
            <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-inner">
              <span className="font-display font-bold text-white text-sm tracking-wider">MTC</span>
            </div>
          </div>

          {/* Pass Number and Subtitles Centered */}
          <div className="text-center flex flex-col items-center justify-center">
            <h3 className="font-mono font-bold text-slate-900 text-lg md:text-xl tracking-wide flex items-center justify-center gap-1.5" id="pass-number-text">
              PASS NO: <span className="text-slate-950 font-sans tracking-tight">{pass.passNo}</span>
            </h3>
            {/* Tamil Description */}
            <p className="text-[10px] md:text-[11px] font-sans font-medium text-slate-900 mt-1 max-w-[220px] leading-tight text-center opacity-90">
              விருப்பம் போல் பயணம் செய்ய மாதச்சலுகை சீட்டு
            </p>
          </div>
        </div>

        {/* MIDDLE SECTION: White Card Frame */}
        <div className="relative bg-white rounded-[28px] p-2.5 flex flex-col items-center justify-between shadow-xl border border-white/80 z-10 w-[50%] max-w-[195px] h-[48%] mx-auto my-2.5 flex-shrink-0" id="pass-white-inner-card">
          
          {/* Golden Badge Seal overlapping the right-middle boundary */}
          <div className="absolute -right-7 top-10 z-20 w-14 h-14 rounded-full bg-gradient-to-br from-[#ffe074] via-[#dbb030] to-[#ad8010] shadow-md border-2 border-white/90 flex flex-col items-center justify-center select-none" id="pass-golden-seal">
            {/* Concentric subtle inner ring */}
            <div className="absolute inset-0.5 rounded-full border border-white/30 flex items-center justify-center">
              <div className="absolute inset-1 rounded-full border border-amber-600/30 flex flex-col items-center justify-center p-0.5">
                <span className="text-[5px] font-bold text-amber-950 uppercase tracking-tighter leading-none font-sans">Monthly</span>
                {/* Tick Checkmark Icon */}
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-950 stroke-[3.5] fill-none mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-[5px] font-bold text-amber-950 uppercase tracking-tighter leading-none mt-0.5 font-sans">₹1000</span>
              </div>
            </div>
          </div>

          {/* Picture-in-Picture Miniature Replica Photo Frame with click-to-upload action */}
          <button 
            type="button"
            onClick={() => document.getElementById('pass-direct-file-input')?.click()}
            className="relative w-[88px] h-[88px] rounded-2xl overflow-hidden shadow-md border-2 border-[#ecd695] bg-slate-50 flex items-center justify-center group flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform outline-none"
            title="Click to upload custom photo from device"
          >
            {/* Embedded profile image */}
            <img 
              src={pass.photoUrl || defaultProfilePic} 
              alt="Pass Holder Profile" 
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              referrerPolicy="no-referrer"
            />
            {/* Hover Camera Icon Indicator overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
              <Camera className="w-5 h-5 text-amber-400" />
              <span className="text-[7px] text-white font-bold uppercase tracking-wider">Change</span>
            </div>

            {/* Subtle watermark overlay on user photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
            
            {/* Real-time mini overlay info inside photo frame */}
            <div className="absolute bottom-1 right-1 bg-white/90 backdrop-blur-[1px] px-1 py-0.5 rounded text-[6px] font-mono font-bold text-slate-800 border border-slate-200">
              MTC {pass.passNo.slice(-4)}
            </div>
          </button>

          {/* Large Price Display */}
          <div className="text-center mt-1" id="pass-amount-display">
            <span className="text-xl font-extrabold text-[#111c38] font-sans tracking-tight">
              ₹{pass.amount}
            </span>
          </div>

          {/* Dashed Line */}
          <div className="w-full border-t border-dashed border-slate-300 my-1" />

          {/* Validation Info */}
          <div className="text-center pb-1" id="pass-valid-duration">
            <p className="text-[8px] font-display font-bold tracking-widest text-slate-400">
              VALID FOR
            </p>
            <p className="text-lg font-extrabold text-[#111c38] mt-0.5 whitespace-nowrap">
              {pass.validTo}
            </p>
          </div>
        </div>

        {/* BOTTOM SECTION: Floating Badges and Interactive Indicators */}
        <div className="flex justify-between items-end z-10 w-full mt-2">
          
          {/* Monospace Clock / Timestamp Badge (Left) */}
          <div className="bg-white rounded-2xl px-3 py-1.5 shadow-md flex flex-col items-center justify-center min-w-[100px] border border-slate-200" id="activation-clock-badge">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{formatMonthDay(liveTime)}</span>
            <span className="text-xs font-mono font-bold text-slate-800 tracking-tight mt-0.5">{formatTime(liveTime)}</span>
          </div>

          {/* Glossy Active Badge (Center overlapping) */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-12 bg-gradient-to-r from-[#1d63ed] to-[#0a48cb] text-white px-5 py-2.5 rounded-[20px] shadow-lg flex flex-col items-center justify-center border border-blue-400/30 scale-105 active:scale-95 transition-transform"
            id="activation-pill-badge"
          >
            <span className="text-[9px] font-medium tracking-wide uppercase text-blue-100 leading-none">Pass</span>
            <div className="flex items-baseline gap-1 mt-0.5 leading-none">
              <span className="text-sm font-extrabold tracking-wider">Activated!</span>
              <span className="text-lg font-black font-display italic text-[#72f5ff]">1</span>
            </div>
          </div>

          {/* Mini matrix grid validator icon / Block Symbol (Right) */}
          <button 
            onClick={() => setIsQrZoomed(true)}
            className="bg-white rounded-xl p-1 shadow-md border border-slate-200 w-11 h-11 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer overflow-hidden" 
            id="validation-matrix-badge"
            title="Tap to verify/zoom QR Code"
          >
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(`MTC-PASS-VERIFIED\nNo: ${pass.passNo}\nName: ${pass.name}\nType: ${pass.type}\nValid To: ${pass.validTo}`)}`} 
              alt="Mini QR" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>

        {/* Absolute Bottom Center: Terms and Conditions Link */}
        <div className="text-center w-full z-10 pt-1.5 pb-0.5">
          <button 
            onClick={() => alert("Terms & Conditions:\n1. This MTC Pass is strictly non-transferable.\n2. Must be produced along with valid Government Issued ID on demand.\n3. Valid only inside Metropolitan Transport Corporation (Chennai) limits.\n4. Tampering with visual/digital elements voids verification.")}
            className="text-[10px] font-bold text-amber-950 underline hover:text-amber-900 active:scale-95 transition-all outline-none"
          >
            Terms & Conditions
          </button>
        </div>
      </div>

      {/* Official Broadcast Alert Banner */}
      <p className="text-xs font-semibold text-white/90 text-center max-w-[340px] leading-relaxed mt-7 mb-4 px-2" id="official-mtc-broadcast">
        *Official MTC Update: No OTP Required. Your Pass is Activated and Ready to Use.
      </p>

      {/* Hidden file input for direct device uploads */}
      <input 
        id="pass-direct-file-input"
        type="file" 
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && onPhotoUpload) {
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                onPhotoUpload(event.target.result as string);
              }
            };
            reader.readAsDataURL(file);
          }
        }}
      />

      {/* Action Buttons Row */}
      <div className="w-full max-w-[380px] flex gap-3 mt-1" id="pass-actions-row">
        <button
          onClick={onRenewClick}
          className="flex-1 bg-[#222222] hover:bg-[#333333] active:bg-[#111111] text-white font-semibold text-sm py-3.5 px-4 rounded-xl text-center shadow-md active:scale-[0.98] transition-all border border-neutral-800"
          id="renew-pass-button"
        >
          Renew Pass
        </button>

        <button
          onClick={() => document.getElementById('pass-direct-file-input')?.click()}
          className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.98] text-slate-950 font-bold text-sm py-3.5 px-4 rounded-xl text-center shadow-md transition-all flex items-center justify-center gap-1.5"
          id="direct-upload-button"
        >
          <Upload className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          Upload Photo
        </button>
      </div>

      {/* Full screen blurred QR Modal */}
      <AnimatePresence>
        {isQrZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsQrZoomed(false)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white text-slate-900 rounded-[32px] p-6 max-w-[340px] w-full shadow-2xl flex flex-col items-center border border-slate-200"
            >
              {/* Subtle decorative dot pattern */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-[32px]"
                style={{
                  backgroundImage: 'radial-gradient(#000 15%, transparent 15%)',
                  backgroundSize: '10px 10px'
                }}
              />

              {/* Modal Header */}
              <div className="text-center mb-5 w-full">
                <div className="flex items-center justify-center gap-1.5 text-[#111c38] font-bold text-sm uppercase tracking-wider mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  MTC Live Verifier
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Scan this code to verify Monthly Pass authenticity</p>
              </div>

              {/* Large High-Res QR Code */}
              <div className="relative bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner w-[240px] h-[240px] flex items-center justify-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`MTC-PASS-VERIFIED\nNo: ${pass.passNo}\nName: ${pass.name}\nType: ${pass.type}\nValid To: ${pass.validTo}\nVerified At: ${formatMonthDay(liveTime)} ${formatTime(liveTime)}`)}`}
                  alt="MTC Pass QR Code" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Details List */}
              <div className="w-full mt-5 space-y-2 text-xs border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">PASS NUMBER</span>
                  <span className="text-slate-900 font-bold font-mono">{pass.passNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">PASS HOLDER</span>
                  <span className="text-slate-900 font-bold">{pass.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">PASS TYPE</span>
                  <span className="text-[#1d63ed] font-bold">{pass.type} Monthly Pass</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">VALID UNTIL</span>
                  <span className="text-slate-900 font-extrabold text-amber-600">{pass.validTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">VERIFIED AT</span>
                  <span className="text-slate-600 font-mono text-[10px]">{formatMonthDay(liveTime)} {formatTime(liveTime)}</span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setIsQrZoomed(false)}
                className="mt-6 w-full py-3 bg-[#111c38] hover:bg-[#1a2d58] text-white font-bold text-sm rounded-2xl transition-all shadow-md active:scale-95"
              >
                Close Verifier
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
