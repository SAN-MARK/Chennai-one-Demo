import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Bus, Train, Navigation, Crosshair, Share2, Send, QrCode, ArrowRight } from 'lucide-react';
import LiveMap from './LiveMap';

interface HomePageProps {
  onSelectCategory: (category: string) => void;
  onOpenQrScanner: () => void;
  onNavigateToTab: (tab: any) => void;
}

export default function HomePage({ onSelectCategory, onOpenQrScanner, onNavigateToTab }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBusToggleOn, setIsBusToggleOn] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Bus');
  const [showShareToast, setShowShareToast] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Chennai One App',
        text: 'Download Chennai One app for seamless bus, metro, and train tickets in Chennai!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#f8f9fa] overflow-hidden font-sans select-none">
      
      {/* Toast notification */}
      {showShareToast && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl z-50 animate-[fadeIn_0.2s_ease]">
          🚀 Share link copied to clipboard!
        </div>
      )}

      {/* TOP SECTION: MAP WITH FLOATING CONTROLS MATCHING SCREENSHOT */}
      <div className="relative w-full h-[45%] shrink-0 overflow-hidden">
        {/* Render interactive LiveMap underneath */}
        <div className="absolute inset-0 z-0">
          <LiveMap />
        </div>

        {/* Overlay map control widgets matching screenshot */}
        {/* Floating Dark Bus Toggle Pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={() => setIsBusToggleOn(!isBusToggleOn)}
            className="bg-[#2a2c33]/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full flex items-center gap-3 shadow-lg border border-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative flex items-center gap-1">
              <Bus className="w-4 h-4 text-white" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            
            {/* Toggle switch track */}
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center ${isBusToggleOn ? 'bg-slate-500/80 justify-end' : 'bg-slate-700/80 justify-start'}`}>
              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
            </div>
          </button>
        </div>

        {/* Floating Locate Button at bottom right of map */}
        <button 
          onClick={() => onNavigateToTab('live')}
          className="absolute bottom-4 right-4 z-10 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-slate-200/80 flex items-center justify-center text-slate-800 hover:bg-white active:scale-95 transition-all cursor-pointer"
          title="Recenter Map"
        >
          <Crosshair className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* BOTTOM SHEET / DRAWER MATCHING SCREENSHOT */}
      <div className="flex-grow bg-[#f8f9fa] rounded-t-[32px] -mt-6 z-10 px-4 pt-2 pb-20 flex flex-col justify-between overflow-y-auto no-scrollbar shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
        
        {/* Rounded Drag Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto my-1 shrink-0" />

        <div className="space-y-4 my-1">
          {/* SEARCH BAR: VIVID RED GRADIENT PILL MATCHING SCREENSHOT */}
          <div className="relative w-full">
            <div className="bg-gradient-to-r from-[#e60026] via-[#ff1e38] to-[#ff3b00] rounded-[22px] p-3.5 flex items-center gap-3 text-white shadow-md">
              <Search className="w-5 h-5 text-white shrink-0 stroke-[2.5]" />
              <input 
                type="text" 
                placeholder="Where are you going?" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onNavigateToTab('live');
                }}
                className="w-full bg-transparent text-white placeholder:text-white/80 font-bold text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* TRANSPORT CATEGORIES GRID MATCHING SCREENSHOT */}
          <div className="bg-white rounded-2xl p-3 shadow-2xs border border-slate-100/80 grid grid-cols-4 gap-2 text-center">
            {/* 1. Bus */}
            <button 
              onClick={() => {
                setSelectedCategory('Bus');
                onSelectCategory('Bus');
                onNavigateToTab('passes');
              }}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#ffed94] flex items-center justify-center text-slate-900 group-hover:scale-105 transition-transform shadow-xs">
                <Bus className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 mt-1.5">Bus</span>
            </button>

            {/* 2. Train */}
            <button 
              onClick={() => {
                setSelectedCategory('Train');
                onSelectCategory('Train');
                onNavigateToTab('ticket');
              }}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#c1f0c8] flex items-center justify-center text-slate-900 group-hover:scale-105 transition-transform shadow-xs">
                <Train className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 mt-1.5">Train</span>
            </button>

            {/* 3. Metro */}
            <button 
              onClick={() => {
                setSelectedCategory('Metro');
                onSelectCategory('Metro');
                onNavigateToTab('ticket');
              }}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#b8e6fe] flex items-center justify-center text-slate-900 group-hover:scale-105 transition-transform shadow-xs">
                <Train className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 mt-1.5">Metro</span>
            </button>

            {/* 4. Auto/Cab */}
            <button 
              onClick={() => {
                setSelectedCategory('Auto/Cab');
                onSelectCategory('Auto/Cab');
              }}
              className="flex flex-col items-center justify-center p-1.5 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-[#e6d8ff] flex items-center justify-center text-slate-900 group-hover:scale-105 transition-transform shadow-xs">
                <Navigation className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-extrabold text-slate-800 mt-1.5">Auto/Cab</span>
            </button>
          </div>

          {/* PROMOTIONAL BANNER: PURPLE EDUCATE CARD MATCHING SCREENSHOT */}
          <div className="relative bg-[#9333ea] rounded-2xl p-4 text-white overflow-hidden shadow-sm flex flex-col items-center text-center">
            
            {/* Top gold coin emblem matching screenshot */}
            <div className="w-10 h-10 rounded-full bg-[#eab308] border-2 border-amber-300 flex items-center justify-center shadow-md mb-2">
              <span className="text-amber-950 font-black text-sm">1</span>
            </div>

            {/* Headline */}
            <h3 className="text-base font-extrabold text-white max-w-[220px] leading-tight mb-3">
              Educate your friends about Chennai One
            </h3>

            {/* Share Button */}
            <button 
              onClick={handleShare}
              className="bg-[#18181b] hover:bg-black text-white text-xs font-extrabold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-white" />
              <span>Share App with Friends</span>
            </button>
          </div>

          {/* Bottom Premium Bus Card Strip */}
          <div className="bg-white rounded-2xl p-3 shadow-2xs border border-slate-100 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800">Premium Bus Booking</span>
            <button 
              onClick={() => onNavigateToTab('ticket')}
              className="text-xs font-bold text-[#e60026] flex items-center gap-1 hover:underline"
            >
              Explore Routes <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
