import React from 'react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
      className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-between p-8 select-none overflow-hidden font-sans"
      id="chennai-one-splash-screen"
    >
      {/* Top spacing area with subtle skip hint */}
      <div className="w-full flex justify-end pt-2">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onComplete}
          className="text-[11px] font-bold text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition-all cursor-pointer outline-none"
        >
          Skip ➔
        </motion.button>
      </div>

      {/* Main Center Brand Hero Lockup */}
      <div className="flex flex-col items-center justify-center my-auto w-full max-w-xs text-center">
        {/* Animated Squircle App Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 260, 
            damping: 20, 
            delay: 0.1 
          }}
          className="relative w-40 h-40 md:w-48 md:h-48 rounded-[38px] md:rounded-[44px] flex items-center justify-center shadow-[0_20px_50px_rgba(244,0,87,0.3)] mb-8 overflow-hidden group cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #f40057 0%, #ff1e38 45%, #ff5e00 85%, #ff7700 100%)'
          }}
          onClick={onComplete}
        >
          {/* Subtle shine sweep overlay */}
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '200%' }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', delay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
          />

          {/* White Circular Arc + "1" Icon matching exact image artwork */}
          <svg 
            viewBox="0 0 100 100" 
            className="w-28 h-28 md:w-32 md:h-32 text-white fill-none select-none drop-shadow-sm"
          >
            {/* Smooth outer white ring arc with open gap at bottom-right */}
            <motion.path 
              d="M 50 16 A 34 34 0 1 0 73 73" 
              stroke="currentColor" 
              strokeWidth="9" 
              strokeLinecap="round" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
            />
            {/* Bold white numeral "1" in center */}
            <motion.path 
              d="M 50 36 L 50 72 M 39 47 L 50 36" 
              stroke="currentColor" 
              strokeWidth="9" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.7 }}
            />
          </svg>
        </motion.div>

        {/* Animated Brand Name: chennai one */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center justify-center tracking-tight"
        >
          <h1 className="text-4xl md:text-5xl font-black text-[#1f232b] tracking-[-0.03em] leading-none select-none">
            chennai
          </h1>
          <h1 className="text-4xl md:text-5xl font-black text-[#1f232b] tracking-[-0.03em] leading-none mt-1 select-none">
            one
          </h1>
        </motion.div>
      </div>

      {/* Footer Attribution Section: CUMTA & Agency Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="w-full flex flex-col items-center shrink-0 space-y-4 pb-2"
      >
        {/* Powered By CUMTA Branding */}
        <div className="flex flex-col items-center text-center">
          <p className="text-sm font-bold text-[#1f232b] mb-1">Powered by</p>
          <p className="text-[9px] font-semibold text-slate-500 uppercase tracking-tight max-w-[240px] leading-tight mb-1.5">
            Chennai Unified Metropolitan Transport Authority(CUMTA)
          </p>

          {/* Stylized CUMTA Graphic Logo */}
          <div className="flex items-center justify-center gap-1 my-0.5">
            <svg viewBox="0 0 200 40" className="h-8 text-[#1d4ed8] fill-current">
              {/* C */}
              <path d="M 25 10 C 10 10 10 30 25 30 L 35 30 L 35 36 L 22 36 C 4 36 4 4 22 4 L 35 4 L 35 10 Z" />
              {/* U */}
              <path d="M 45 4 L 53 4 L 53 26 C 53 30 58 30 58 26 L 58 4 L 66 4 L 66 27 C 66 36 45 36 45 27 Z" />
              {/* M with train wheel graphic */}
              <path d="M 75 4 L 83 4 L 89 22 L 95 4 L 103 4 L 103 36 L 95 36 L 95 16 L 89 32 L 83 16 L 83 36 L 75 36 Z" />
              {/* T */}
              <path d="M 108 4 L 128 4 L 128 10 L 122 10 L 122 36 L 114 36 L 114 10 L 108 10 Z" />
              {/* A */}
              <path d="M 138 36 L 146 36 L 148 28 L 158 28 L 160 36 L 168 36 L 157 4 L 149 4 Z M 153 12 L 156 22 L 150 22 Z" />
              {/* Underline base track */}
              <rect x="10" y="37" width="168" height="3" rx="1.5" fill="#1d4ed8" />
              {/* Bus dot icon on CUMTA */}
              <circle cx="178" cy="22" r="3.5" fill="#3b82f6" />
            </svg>
          </div>
        </div>

        {/* Agency Partner Logos Row */}
        <div className="flex items-center justify-center gap-4 pt-2 opacity-80">
          {/* 1. Tamil Nadu State Crest */}
          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center p-1" title="Tamil Nadu Government">
            <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-800 fill-current">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
              <path d="M 50 20 L 65 75 L 35 75 Z" />
              <circle cx="50" cy="35" r="8" fill="gold" />
            </svg>
          </div>

          {/* 2. MTC Emblem */}
          <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center p-1" title="MTC Chennai">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-700 fill-current">
              <circle cx="50" cy="50" r="45" fill="#fef3c7" stroke="currentColor" strokeWidth="4" />
              <rect x="25" y="42" width="50" height="16" rx="3" fill="#d97706" />
              <text x="50" y="54" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">MTC</text>
            </svg>
          </div>

          {/* 3. CMRL Metro Crest */}
          <div className="w-8 h-8 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center p-1" title="CMRL Metro">
            <svg viewBox="0 0 100 100" className="w-full h-full text-sky-700 fill-current">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
              <path d="M 30 65 Q 50 25 70 65" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </div>

          {/* 4. Southern Railways */}
          <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center p-1" title="Indian Railways">
            <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-800 fill-current">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="6" />
              <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
