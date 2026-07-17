import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Camera, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  ShieldCheck, 
  User, 
  FileText, 
  Calendar,
  Zap,
  Info
} from 'lucide-react';
import { MtcPass } from '../types';

interface QrScannerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  pass: MtcPass;
}

type ScanResultType = 'idle' | 'scanning' | 'granted' | 'denied_expired' | 'denied_fake';

export default function QrScannerOverlay({ isOpen, onClose, pass }: QrScannerOverlayProps) {
  const [scanState, setScanState] = useState<ScanResultType>('idle');
  const [flashlight, setFlashlight] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Trigger scanning simulation
  const startScan = (type: 'valid' | 'expired' | 'fake') => {
    setScanState('scanning');
    setProgress(0);
  };

  // Handle mock scan progress
  useEffect(() => {
    if (scanState !== 'scanning') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 8;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [scanState]);

  // Handle outcome once progress hits 100
  useEffect(() => {
    if (scanState === 'scanning' && progress >= 100) {
      // We need to determine if we are scanning a valid, expired, or fake one.
      // For this, we check what was chosen. We can store the chosen type in a state.
      // Let's use a temporary flag or a separate state variable.
    }
  }, [progress, scanState]);

  // To track chosen mode cleanly:
  const [chosenMode, setChosenMode] = useState<'valid' | 'expired' | 'fake'>('valid');

  const triggerScanWithMode = (mode: 'valid' | 'expired' | 'fake') => {
    setChosenMode(mode);
    setScanState('scanning');
    setProgress(0);
  };

  // When scanning completes
  useEffect(() => {
    if (scanState === 'scanning' && progress >= 100) {
      const timer = setTimeout(() => {
        if (chosenMode === 'valid') {
          // If the actual pass status is Expired, it should be Denied! Otherwise Granted.
          if (pass.status === 'Expired') {
            setScanState('denied_expired');
          } else {
            setScanState('granted');
          }
        } else if (chosenMode === 'expired') {
          setScanState('denied_expired');
        } else {
          setScanState('denied_fake');
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [progress, scanState, chosenMode, pass]);

  const resetScanner = () => {
    setScanState('idle');
    setProgress(0);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-between p-5 font-sans overflow-hidden">
      
      {/* 1. HEADER SECTION */}
      <div className="flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-2 text-white">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <div>
            <h3 className="text-sm font-bold tracking-wide uppercase font-mono text-slate-200">MTC-SCAN-v4.1</h3>
            <p className="text-[10px] text-slate-400 font-mono">STATIONARY FIELD TERMINAL</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white active:scale-90 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. MAIN CAMERA VIEWPORT PORTAL */}
      <div className="flex-grow flex flex-col items-center justify-center my-4 relative">
        <AnimatePresence mode="wait">
          
          {/* STATE A: IDLE / VIEWPORT ACTIVE */}
          {(scanState === 'idle' || scanState === 'scanning') && (
            <motion.div 
              key="viewport"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-[320px] aspect-square rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl flex flex-col items-center justify-center bg-slate-900"
            >
              {/* Mock camera stream canvas background (styled abstract shapes grid) */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
              
              {/* Dynamic noise and overlay sweep */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/40 to-slate-900/10 pointer-events-none" />
              {flashlight && <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none transition-all" />}

              {/* Four bright corner brackets */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-red-500 rounded-tl-lg" />
              <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-red-500 rounded-tr-lg" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-red-500 rounded-bl-lg" />
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-red-500 rounded-br-lg" />

              {/* Scanning laser line */}
              {scanState === 'scanning' ? (
                <motion.div 
                  initial={{ top: '15%' }}
                  animate={{ top: '80%' }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: 'reverse', 
                    duration: 1.5,
                    ease: 'easeInOut'
                  }}
                  className="absolute left-6 right-6 h-[3px] bg-red-500 shadow-[0_0_12px_#ef4444] z-10"
                />
              ) : (
                <div className="absolute left-1/2 -translate-x-1/2 w-48 h-48 border border-dashed border-red-500/30 rounded-2xl flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-red-500/20 stroke-[1.2]" />
                </div>
              )}

              {/* Live camera status metrics */}
              <div className="absolute top-4 left-6 text-[8px] font-mono text-red-500 font-bold flex items-center gap-1">
                <Camera className="w-3 h-3 text-red-500" />
                <span>REC 1080P @60FPS</span>
              </div>
              <div className="absolute bottom-4 right-6 text-[8px] font-mono text-slate-400">
                ZOOM: 1.2X
              </div>

              {/* Overlapping progress wheel */}
              {scanState === 'scanning' && (
                <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center p-6 z-20">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    {/* SVG circular progress */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="32" 
                        cy="32" 
                        r="28" 
                        className="stroke-slate-800 fill-none" 
                        strokeWidth="4" 
                      />
                      <circle 
                        cx="32" 
                        cy="32" 
                        r="28" 
                        className="stroke-red-500 fill-none transition-all duration-100" 
                        strokeWidth="4" 
                        strokeDasharray={175}
                        strokeDashoffset={175 - (175 * progress) / 100}
                      />
                    </svg>
                    <span className="absolute text-xs font-mono font-bold text-white">{progress}%</span>
                  </div>
                  <p className="text-xs font-bold font-mono mt-3.5 text-slate-300 tracking-wider">DECRYPTING CODES...</p>
                  <p className="text-[9px] font-mono text-slate-500 mt-1">Verifying signatures and certificates</p>
                </div>
              )}
            </motion.div>
          )}

          {/* STATE B: ACCESS GRANTED ANIMATED CARD */}
          {scanState === 'granted' && (
            <motion.div 
              key="granted"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-[340px] bg-emerald-950/90 border border-emerald-500/30 rounded-[36px] p-6 text-center shadow-[0_20px_50px_rgba(16,185,129,0.2)] flex flex-col items-center space-y-4"
            >
              {/* Big Animated Circle Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg relative"
              >
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-25" />
                <CheckCircle2 className="w-12 h-12 text-emerald-950 stroke-[2.5]" />
              </motion.div>

              <div className="space-y-1">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-black px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-widest font-mono">
                  Access Approved
                </span>
                <h3 className="text-2xl font-display font-black text-white pt-2">Transit Pass Valid</h3>
                <p className="text-[11px] text-emerald-400/80 font-mono">METROPOLITAN TRANSPORT CORP • SECURITY GRID</p>
              </div>

              {/* Scanning passenger manifest metadata */}
              <div className="w-full bg-emerald-900/40 rounded-2xl p-4 border border-emerald-800/40 text-left space-y-2.5 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-emerald-900/50 pb-1.5">
                  <span className="text-emerald-400 text-[10px]">PASSENGER NAME</span>
                  <span className="text-slate-100 font-bold">{pass.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-emerald-900/50 pb-1.5">
                  <span className="text-emerald-400 text-[10px]">PASS NUMBER</span>
                  <span className="text-slate-100 font-bold font-mono">{pass.passNo}</span>
                </div>
                <div className="flex justify-between items-center border-b border-emerald-900/50 pb-1.5">
                  <span className="text-emerald-400 text-[10px]">PASS CATEGORY</span>
                  <span className="text-amber-400 font-bold">{pass.type} Pass</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 text-[10px]">EXPIRY TIMELOCK</span>
                  <span className="text-emerald-400 font-bold">{pass.validTo}</span>
                </div>
              </div>

              <div className="flex gap-2.5 text-[10px] text-emerald-300 font-medium px-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cryptographic verification matches central databases. Hardware keys active.</span>
              </div>
            </motion.div>
          )}

          {/* STATE C: ACCESS DENIED (EXPIRED PASS) ANIMATED CARD */}
          {scanState === 'denied_expired' && (
            <motion.div 
              key="denied_expired"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-[340px] bg-rose-950/90 border border-rose-500/30 rounded-[36px] p-6 text-center shadow-[0_20px_50px_rgba(239,68,68,0.2)] flex flex-col items-center space-y-4"
            >
              {/* Big Animated Circle Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-rose-500 flex items-center justify-center shadow-lg relative"
              >
                <div className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-25" />
                <AlertTriangle className="w-12 h-12 text-rose-950 stroke-[2.5]" />
              </motion.div>

              <div className="space-y-1">
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-black px-3 py-1 rounded-full border border-rose-500/30 uppercase tracking-widest font-mono">
                  Access Refused
                </span>
                <h3 className="text-2xl font-display font-black text-white pt-2">Pass Expired</h3>
                <p className="text-[11px] text-rose-400/80 font-mono">MTC CARD INVALID • SUSPENDED</p>
              </div>

              {/* Expired Metadata info container */}
              <div className="w-full bg-rose-900/40 rounded-2xl p-4 border border-rose-800/40 text-left space-y-2.5 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-rose-900/50 pb-1.5">
                  <span className="text-rose-400 text-[10px]">PASSENGER NAME</span>
                  <span className="text-slate-200 font-bold">{pass.name}</span>
                </div>
                <div className="flex justify-between items-center border-b border-rose-900/50 pb-1.5">
                  <span className="text-rose-400 text-[10px]">PASS NUMBER</span>
                  <span className="text-slate-200 font-bold">{pass.passNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-rose-400 text-[10px]">EXPIRED SINCE</span>
                  <span className="text-red-400 font-black font-mono">{pass.validTo || '01/09/2026'}</span>
                </div>
              </div>

              <div className="flex gap-2 text-[10px] text-rose-300 font-medium px-4 text-left leading-normal">
                <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>The system clock indicates that this monthly ticket duration has terminated. Please renew your pass immediately using your wallet.</span>
              </div>
            </motion.div>
          )}

          {/* STATE D: ACCESS DENIED (FAKE/FORGED CODE) ANIMATED CARD */}
          {scanState === 'denied_fake' && (
            <motion.div 
              key="denied_fake"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-[340px] bg-red-950/95 border border-red-500/40 rounded-[36px] p-6 text-center shadow-[0_20px_50px_rgba(220,38,38,0.25)] flex flex-col items-center space-y-4"
            >
              {/* Big Animated Danger Badge */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg relative"
              >
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-25" />
                <X className="w-12 h-12 text-red-955 stroke-[3]" />
              </motion.div>

              <div className="space-y-1">
                <span className="text-[10px] bg-red-600/20 text-red-300 font-black px-3 py-1 rounded-full border border-red-600/30 uppercase tracking-widest font-mono">
                  Validation Error
                </span>
                <h3 className="text-2xl font-display font-black text-white pt-2">Invalid Signatures</h3>
                <p className="text-[11px] text-red-400/80 font-mono font-bold uppercase">Signature Mismatch / Fraud Warning</p>
              </div>

              {/* Fake info */}
              <div className="w-full bg-red-900/40 rounded-2xl p-4 border border-red-800/40 text-left space-y-2.5 font-mono text-xs">
                <div className="flex justify-between items-center border-b border-red-900/50 pb-1.5">
                  <span className="text-red-400 text-[10px]">SECURITY CERT</span>
                  <span className="text-red-400 font-black">FAIL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-400 text-[10px]">VERDICT</span>
                  <span className="text-red-300 font-bold uppercase">Unregistered QR Checksum</span>
                </div>
              </div>

              <div className="flex gap-2 text-[10px] text-red-300 font-semibold px-4 text-left leading-normal">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                <span>The scanned digital code does not match any official Metropolitan Transport Corporation templates or security hashes. Access is strictly blocked.</span>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 3. LOWER CONTROL CONSOLE PANEL */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-[28px] shrink-0 space-y-4">
        {scanState === 'idle' ? (
          <>
            <div className="text-center">
              <p className="text-xs font-bold text-slate-300">Point scanner at QR code or choose simulation</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">Select code type to simulate a physical camera scan:</p>
            </div>

            {/* Quick Actions presets */}
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => triggerScanWithMode('valid')}
                className="p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold text-[10px] tracking-wide uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Valid Pass</span>
              </button>

              <button 
                onClick={() => triggerScanWithMode('expired')}
                className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 font-bold text-[10px] tracking-wide uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Expired Pass</span>
              </button>

              <button 
                onClick={() => triggerScanWithMode('fake')}
                className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-[10px] tracking-wide uppercase transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4 text-red-400" />
                <span>Fake/Other QR</span>
              </button>
            </div>

            {/* Flashlight toggle */}
            <div className="flex justify-center pt-1.5">
              <button 
                onClick={() => setFlashlight(!flashlight)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold font-mono border transition-all flex items-center gap-1.5 cursor-pointer ${
                  flashlight 
                    ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5" /> FLASHLIGHT: {flashlight ? 'ON' : 'OFF'}
              </button>
            </div>
          </>
        ) : scanState === 'scanning' ? (
          <div className="text-center py-4 text-slate-400 font-mono text-[11px] font-bold animate-pulse">
            CAMERA LENS ACTIVE • ANALYZING DOT MATRIX FRAME...
          </div>
        ) : (
          /* RESULT SCREEN BACK/RESET BUTTONS */
          <div className="flex gap-3">
            <button 
              onClick={resetScanner}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 active:scale-98 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider"
            >
              <RotateCcw className="w-4 h-4 text-slate-300" /> Scan Another Code
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-3 bg-[#ff0055] hover:bg-[#db0048] active:scale-98 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider"
            >
              Done Scanning
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
