import React, { useEffect, useState } from 'react';
import { MtcPass } from '../types';
import { ShieldCheck, Calendar, Info, QrCode, Camera, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MtcLogoSvg = () => (
  <svg viewBox="0 0 100 100" className="w-14 h-14 select-none drop-shadow-md">
    <defs>
      {/* Golden gradient for the emblem */}
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff3b3" />
        <stop offset="30%" stopColor="#d1a119" />
        <stop offset="70%" stopColor="#8c6603" />
        <stop offset="100%" stopColor="#ffe680" />
      </linearGradient>
      {/* Dark outline/shadow gradient for text/lines */}
      <linearGradient id="darkGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#543c01" />
        <stop offset="100%" stopColor="#2e2100" />
      </linearGradient>
    </defs>

    {/* Ribbon Wings in Background (Left and Right Triangles/Tails) */}
    {/* Left Ribbon Wing */}
    <path 
      d="M 15,50 L 30,35 L 35,50 L 30,65 Z" 
      fill="url(#goldGrad)" 
      stroke="url(#darkGoldGrad)" 
      strokeWidth="1.5" 
      strokeLinejoin="round"
    />
    {/* Right Ribbon Wing */}
    <path 
      d="M 85,50 L 70,35 L 65,50 L 70,65 Z" 
      fill="url(#goldGrad)" 
      stroke="url(#darkGoldGrad)" 
      strokeWidth="1.5" 
      strokeLinejoin="round"
    />

    {/* Outer Double-Stroke Circle */}
    <circle 
      cx="50" 
      cy="50" 
      r="38" 
      fill="url(#goldGrad)" 
      stroke="url(#darkGoldGrad)" 
      strokeWidth="1.8" 
    />
    <circle 
      cx="50" 
      cy="50" 
      r="33" 
      fill="none" 
      stroke="url(#darkGoldGrad)" 
      strokeWidth="1" 
      strokeDasharray="2,2" 
    />
    <circle 
      cx="50" 
      cy="50" 
      r="30" 
      fill="none" 
      stroke="url(#darkGoldGrad)" 
      strokeWidth="1" 
    />

    {/* Middle Banner/Ribbon */}
    {/* Banner background box */}
    <rect 
      x="12" 
      y="38" 
      width="76" 
      height="24" 
      rx="3" 
      ry="3" 
      fill="url(#goldGrad)" 
      stroke="url(#darkGoldGrad)" 
      strokeWidth="1.8" 
    />
    
    {/* Horizontal lines inside the banner border */}
    <line x1="16" y1="42" x2="84" y2="42" stroke="url(#darkGoldGrad)" strokeWidth="0.8" />
    <line x1="16" y1="58" x2="84" y2="58" stroke="url(#darkGoldGrad)" strokeWidth="0.8" />

    {/* Banner fold creases on left & right sides */}
    <line x1="16" y1="38" x2="16" y2="62" stroke="url(#darkGoldGrad)" strokeWidth="1" />
    <line x1="84" y1="38" x2="84" y2="62" stroke="url(#darkGoldGrad)" strokeWidth="1" />

    {/* "MTC" text inside the banner */}
    <text 
      x="50" 
      y="55" 
      textAnchor="middle" 
      fill="url(#darkGoldGrad)" 
      fontSize="13" 
      fontWeight="900" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      letterSpacing="1.2"
    >
      MTC
    </text>
  </svg>
);

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
          {/* MTC Golden Emblem Logo - Absolutely positioned to the left */}
          <div className="absolute left-[-4px] top-[-10px] z-10" id="mtc-logo-outer">
            <MtcLogoSvg />
          </div>

          {/* Pass Number and Subtitles Centered */}
          <div className="text-center flex flex-col items-center justify-center">
            <h3 className="font-sans font-bold text-slate-900 text-lg md:text-xl tracking-wide flex items-center justify-center gap-1.5" id="pass-number-text">
              PASS NO: <span className="text-slate-950 font-mono tracking-tight">{pass.passNo}</span>
            </h3>
            {/* Tamil Description */}
            <p className="text-[10px] md:text-[11px] font-sans font-medium text-slate-900 mt-1 max-w-[220px] leading-tight text-center opacity-90">
              விருப்பம் போல் பயணம் செய்ய மாதச்சலுகை சீட்டு
            </p>
          </div>
        </div>

        {/* MIDDLE SECTION: White Card Frame */}
        <div className="relative bg-white rounded-[32px] p-3 flex flex-col items-center justify-between shadow-xl border border-white/80 z-10 w-[54%] max-w-[210px] h-[54%] mx-auto my-3 flex-shrink-0" id="pass-white-inner-card">
          
          {/* Golden Badge Seal overlapping the right-middle boundary */}
          <div className="absolute -right-8 top-12 z-20 w-16 h-16 rounded-full bg-gradient-to-br from-[#ffe074] via-[#dbb030] to-[#ad8010] shadow-md border-2 border-white/90 flex flex-col items-center justify-center select-none" id="pass-golden-seal">
            {/* Concentric subtle inner ring */}
            <div className="absolute inset-0.5 rounded-full border border-white/30 flex items-center justify-center">
              <div className="absolute inset-1 rounded-full border border-amber-600/30 flex flex-col items-center justify-center p-0.5">
                <span className="text-[6px] font-bold text-amber-950 uppercase tracking-tighter leading-none font-sans">Monthly</span>
                {/* Tick Checkmark Icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-950 stroke-[3.5] fill-none mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-[6px] font-bold text-amber-950 uppercase tracking-tighter leading-none mt-0.5 font-mono">₹1000</span>
              </div>
            </div>
          </div>

          {/* Picture-in-Picture Miniature Replica Photo Frame with click-to-upload action */}
          <button 
            type="button"
            onClick={() => document.getElementById('pass-direct-file-input')?.click()}
            className="relative w-[110px] h-[110px] rounded-2xl overflow-hidden shadow-md border-[3px] border-[#ecd695] bg-slate-50 flex items-center justify-center group flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform outline-none"
            title="Click to upload custom photo from device"
          >
            {/* Embedded profile image or person SVG */}
            {pass.photoUrl ? (
              <img 
                src={pass.photoUrl} 
                alt="Pass Holder Profile" 
                className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center p-2 text-slate-400 group-hover:bg-slate-200 transition-colors">
                <svg viewBox="0 0 24 24" className="w-16 h-16 stroke-slate-300 fill-slate-200/50 stroke-[1.2]">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5-4-8-4z" />
                </svg>
                <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wide -mt-1 leading-none">Photo</span>
              </div>
            )}
            {/* Hover Camera Icon Indicator overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
              <Camera className="w-5 h-5 text-amber-400" />
              <span className="text-[7px] text-white font-bold uppercase tracking-wider">Change</span>
            </div>

            {/* Subtle watermark overlay on user photo */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none" />
          </button>

          {/* Large Price Display */}
          <div className="text-center mt-2" id="pass-amount-display">
            <span className="text-2xl font-bold text-[#111c38] font-mono tracking-tight">
              ₹{pass.amount}
            </span>
          </div>

          {/* Dashed Line */}
          <div className="w-full border-t border-dashed border-slate-300 my-2" />

          {/* Validation Info */}
          <div className="text-center pb-1" id="pass-valid-duration">
            <p className="text-[9px] font-sans font-bold tracking-widest text-slate-400">
              VALID FOR
            </p>
            <p className="text-xl font-bold text-[#111c38] mt-0.5 whitespace-nowrap font-mono">
              {pass.validTo}
            </p>
          </div>
        </div>

        {/* BOTTOM SECTION: Floating Badges and Interactive Indicators */}
        <div className="flex justify-between items-end z-10 w-full mt-2">
          
          {/* Monospace Clock / Timestamp Badge (Left) */}
          <div className="bg-white rounded-2xl px-3 py-1.5 shadow-md flex flex-col items-center justify-center min-w-[100px] border border-slate-200" id="activation-clock-badge">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">{formatMonthDay(liveTime)}</span>
            <span className="text-xs font-mono font-bold text-slate-800 tracking-tight mt-0.5">{formatTime(liveTime)}</span>
          </div>

          {/* Authentic Pass Activated Badge (Designed to match the user's image exactly) */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-11 bg-[#0052cc] text-white px-4 py-2 rounded-[22px] shadow-xl border-[3px] border-white flex items-center justify-between gap-3 min-w-[155px] scale-105 active:scale-95 transition-transform select-none z-20"
            id="activation-pill-badge"
          >
            {/* Left Column: Pass Activated Text */}
            <div className="flex flex-col items-start leading-[1.1] text-left">
              <span className="text-[12px] font-black uppercase text-white tracking-wide">Pass</span>
              <span className="text-[16px] font-extrabold text-white tracking-tight">Activated!</span>
            </div>
            
            {/* Right Column: Custom Green/Lime Circular Emblem with Italic 1 */}
            <div className="relative w-9 h-9 rounded-full bg-[#a3d43c] flex items-center justify-center flex-shrink-0">
              {/* Outer stroke detail */}
              <div className="absolute inset-0.5 rounded-full border border-white/20" />
              {/* Giant bold italic number 1 */}
              <span className="text-[22px] font-black italic text-[#0052cc] font-mono leading-none -mt-0.5">
                1
              </span>
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

      {/* Renew Button */}
      <button
        onClick={onRenewClick}
        className="w-full max-w-[380px] bg-[#222222] hover:bg-[#333333] active:bg-[#111111] text-white font-semibold text-base py-3.5 px-6 rounded-2xl text-center shadow-lg active:scale-[0.98] transition-all border border-neutral-800 animate-pulse-subtle"
        id="renew-pass-button"
      >
        Renew Pass
      </button>

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
                  <span className="text-slate-900 font-bold text-amber-600 font-mono">{pass.validTo}</span>
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
