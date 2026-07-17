import React, { useEffect, useState } from 'react';
import { MtcPass } from '../types';
import { ShieldCheck, Calendar, Info, QrCode, Camera, Upload, Download, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  const fetchImageAsBase64 = async (url: string): Promise<string> => {
    if (!url) return '';
    if (url.startsWith('data:image')) {
      return url;
    }
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error fetching image for PDF:", error);
      return ''; // return empty so fallback silhouette is used instead of crashing the doc
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');

      // 1. Fetch images (QR Code and custom profile photo if present)
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        `MTC-PASS-VERIFIED\nNo: ${pass.passNo}\nName: ${pass.name}\nType: ${pass.type}\nValid To: ${pass.validTo}\nVerified At: ${formatMonthDay(liveTime)} ${formatTime(liveTime)}`
      )}`;

      const [qrBase64, photoBase64] = await Promise.all([
        fetchImageAsBase64(qrUrl),
        pass.photoUrl ? fetchImageAsBase64(pass.photoUrl) : Promise.resolve('')
      ]);

      // --- PAGE HEADER (A4 size: 210 x 297 mm) ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42); // deep slate
      doc.text("METROPOLITAN TRANSPORT CORPORATION (CHENNAI) LTD.", 105, 20, { align: 'center' });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105); // light slate
      doc.text("Official Digital Travel Pass - Printable Offline Backup", 105, 26, { align: 'center' });

      // Solid dividing line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(20, 31, 190, 31);

      // --- PRINT CUTTING GUIDELINES ---
      // Dashed rectangle to show where to cut
      doc.setLineDashPattern([2, 2], 0);
      doc.setDrawColor(148, 163, 184); // slate-400
      doc.setLineWidth(0.3);
      // Card coordinates: width=100, height=150, centered at X=55, Y=40
      doc.rect(53.5, 38.5, 103, 153, 'S');
      doc.setLineDashPattern([], 0); // reset

      // Scissor label
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text("Cut along dashed lines to print & keep as a wallet card", 105, 36, { align: 'center' });

      // --- GOLD PASS CARD (CR80/Vertical Badge Format: 100mm x 150mm) ---
      // Draw rich gold-bronze fill
      doc.setFillColor(235, 180, 44); // Gold Base (#EBB42C)
      doc.roundedRect(55, 40, 100, 150, 8, 8, 'F');

      // Draw premium dark-gold outline
      doc.setDrawColor(148, 113, 23); // #947117
      doc.setLineWidth(1.2);
      doc.roundedRect(55, 40, 100, 150, 8, 8, 'S');

      // --- CARD LOGO EMBLEM (Dynamic Vector Drawing) ---
      // Outer light golden ring
      doc.setFillColor(255, 243, 179); // #FFF3B3
      doc.setDrawColor(84, 60, 1); // #543C01
      doc.setLineWidth(0.4);
      doc.circle(67, 51, 6.5, 'FD');

      // Inner dashed ring
      doc.setDrawColor(140, 102, 3);
      doc.setLineDashPattern([0.5, 0.5], 0);
      doc.circle(67, 51, 5.2, 'S');
      doc.setLineDashPattern([], 0); // Reset

      // Golden Ribbon banner overlapping emblem
      doc.setFillColor(209, 161, 25); // #D1A119
      doc.setDrawColor(84, 60, 1);
      doc.roundedRect(60, 49.5, 14, 3.2, 0.5, 0.5, 'FD');

      // Lettering inside emblem
      doc.setFont("helvetica", "bold");
      doc.setFontSize(4.5);
      doc.setTextColor(84, 60, 1);
      doc.text("MTC", 67, 51.8, { align: 'center' });

      // Pass number and description headers
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("PASS NO: " + pass.passNo, 116, 49, { align: 'center' });

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text("MONTHLY CONCESSION TRAVEL PASS", 116, 53.5, { align: 'center' });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.2);
      doc.setTextColor(51, 65, 85); // slate-700
      doc.text("Metropolitan Transport Corporation (Chennai) Ltd.", 116, 57, { align: 'center' });

      // --- MIDDLE SECTION: INNER WHITE DISPLAY PANEL ---
      // Rounded white frame
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(255, 255, 255);
      doc.roundedRect(62, 62, 53, 80, 5, 5, 'FD');

      // Golden Badge Seal overlapping white frame (Right-Middle)
      doc.setFillColor(235, 180, 44); // Gold Fill
      doc.setDrawColor(148, 113, 23); // Gold Outline
      doc.setLineWidth(0.4);
      doc.circle(115, 82, 8, 'FD');

      // Seal inner ring
      doc.setDrawColor(255, 243, 179);
      doc.circle(115, 82, 6.8, 'S');

      // Seal text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(4);
      doc.setTextColor(84, 60, 1);
      doc.text("MONTHLY", 115, 81.5, { align: 'center' });
      doc.text("₹1000", 115, 84.5, { align: 'center' });

      // --- HOLDER PORTRAIT IMAGE OR SILHOUETTE ---
      // Frame container for portrait
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.5);
      doc.roundedRect(72.5, 66, 32, 32, 4, 4, 'FD');

      if (photoBase64) {
        // Embed loaded portrait image
        doc.addImage(photoBase64, 'JPEG', 73.5, 67, 30, 30);
      } else {
        // Draw highly polished vector silhouette
        // Head circle
        doc.setFillColor(203, 213, 225); // slate-300
        doc.circle(88.5, 78, 4.5, 'F');
        // Neck
        doc.setFillColor(203, 213, 225);
        doc.rect(87, 82, 3, 2.5, 'F');
        // Shoulders/Body arc
        doc.setFillColor(148, 163, 184); // slate-400
        doc.ellipse(88.5, 91.5, 9, 5, 'F');

        doc.setFont("helvetica", "bold");
        doc.setFontSize(5.5);
        doc.setTextColor(148, 163, 184);
        doc.text("PORTRAIT PHOTO", 88.5, 96, { align: 'center' });
      }

      // --- HOLDER SPECIFICS (INSIDE WHITE PANEL) ---
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(pass.name.toUpperCase(), 88.5, 104, { align: 'center' });

      // Pass Type Badge
      doc.setFillColor(240, 246, 255); // light blue bg
      doc.roundedRect(71.5, 107.5, 34, 4.5, 1, 1, 'F');

      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.5);
      doc.setTextColor(29, 78, 216); // blue-700
      doc.text((pass.type + " Monthly Pass").toUpperCase(), 88.5, 110.8, { align: 'center' });

      // Pass Validity Details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(220, 38, 38); // red-600
      doc.text("VALID UP TO: " + pass.validTo, 88.5, 118, { align: 'center' });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.2);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text("Activated: " + pass.activatedAt, 88.5, 122.5, { align: 'center' });

      // Official holographic-style watermark text
      doc.setFont("helvetica", "bold");
      doc.setFontSize(4.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text("DIGITAL SIGNATURE SECURE", 88.5, 128, { align: 'center' });
      doc.text("★ MTC METRO PORTAL VERIFIED ★", 88.5, 131, { align: 'center' });

      // --- BOTTOM SECTION: QR CODE & DIGITAL ATTRIBUTES ---
      // Center the QR Code
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(255, 255, 255);
      doc.roundedRect(91.5, 147.5, 25, 25, 3, 3, 'FD');

      if (qrBase64) {
        doc.addImage(qrBase64, 'PNG', 92.5, 148.5, 23, 23);
      } else {
        // Fallback QR simulation pattern
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.8);
        doc.rect(93.5, 149.5, 21, 21, 'S');
        doc.setFont("helvetica", "normal");
        doc.setFontSize(5);
        doc.setTextColor(0, 0, 0);
        doc.text("[QR CODE]", 104, 161, { align: 'center' });
      }

      // Security guidelines & attributes (Left of QR)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(255, 255, 255);
      doc.text("SECURE DIGITAL BACKUP", 61, 155);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(5.5);
      doc.setTextColor(241, 245, 249); // slate-100
      doc.text("• Strictly Non-Transferable ID", 61, 159.5);
      doc.text("• Valid inside Chennai limits", 61, 163.5);
      doc.text("• Digital signature active", 61, 167.5);

      // Active Pass Badge on card bottom
      doc.setFillColor(16, 185, 129); // emerald-500
      doc.roundedRect(61, 171.5, 16, 4.5, 0.8, 0.8, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(4);
      doc.setTextColor(255, 255, 255);
      doc.text("ACTIVE PASS", 69, 174.8, { align: 'center' });

      // --- INSTRUCTIONS & DOCUMENT LEGAL FOOTER ---
      doc.setDrawColor(203, 213, 225); // slate-300
      doc.setLineWidth(0.4);
      doc.line(20, 212, 190, 212);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.text("OFFLINE PORTAL INSTRUCTIONS & BACKUP VERIFICATION:", 20, 221);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.2);
      doc.setTextColor(71, 85, 105); // slate-600
      doc.text("1. Print this digital PDF file in high-quality scale (100% size) on heavy cardstock or A4 photo paper.", 20, 227.5);
      doc.text("2. Carefully trim along the outer dashed cut lines (measuring exactly 100mm x 150mm card boundaries).", 20, 233.5);
      doc.text("3. Fold and place the finished travel pass inside your pocket ID wallet or transparent cardholder sleeve.", 20, 239.5);
      doc.text("4. Present this printed pass physically to ticket checkers, conductors, or smartgate inspectors when requested.", 20, 245.5);
      doc.text("5. Transit inspectors can instantly verify pass authenticity by scanning the security QR code with any smartphone camera.", 20, 251.5);

      // Footer signature
      doc.setFont("helvetica", "italic");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text(
        `Generated securely via Chennai One Metro Pass Portal on ${new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })} at ${new Date().toLocaleTimeString('en-US')}`,
        105,
        278,
        { align: 'center' }
      );

      // Save pass
      doc.save(`MTC_Transit_Pass_${pass.passNo}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Failed to generate PDF backup. Please check your network and try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };


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

      {/* Download Pass PDF Button */}
      <button
        onClick={handleDownloadPdf}
        disabled={isGeneratingPdf}
        className="w-full max-w-[380px] bg-amber-500 hover:bg-amber-400 disabled:opacity-75 text-slate-950 font-bold text-sm py-3.5 px-6 rounded-2xl text-center shadow-lg active:scale-[0.98] transition-all border border-amber-600/20 flex items-center justify-center gap-2 mt-3 cursor-pointer select-none"
        id="download-pass-pdf-button"
      >
        {isGeneratingPdf ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            <span>Generating Secure PDF...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4 text-slate-950" />
            <span>Download Offline PDF Backup</span>
          </>
        )}
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
