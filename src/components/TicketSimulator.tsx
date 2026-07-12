import React, { useState, useEffect } from 'react';
import { 
  Bus, 
  Train, 
  Search, 
  Plus, 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ArrowLeftRight, 
  Users, 
  Check, 
  ChevronRight, 
  QrCode, 
  Sparkles,
  Ticket as TicketIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CHENNAI_STOPS_LIST = [
  'Nandambakkam Bus Stand',
  'Alandur Metro Station',
  'Broadway Terminal',
  'Chennai Central',
  'Guindy Kathipara',
  'Adyar Depot',
  'Tambaram West',
  'CMBT Koyambedu',
  'Mylapore Tank',
  'SRP Tools OMR',
  'Sholinganallur',
  'Siruseri IT Park'
];

export default function TicketSimulator() {
  const [source, setSource] = useState('Nandambakkam Bus Stand');
  const [destination, setDestination] = useState('Alandur Metro Station');
  
  // Choose Modes toggles (Screen 3 references)
  const [busChecked, setBusChecked] = useState(true);
  const [metroChecked, setMetroChecked] = useState(true);
  const [trainChecked, setTrainChecked] = useState(false);
  const [busType, setBusType] = useState<'Ordinary' | 'Express' | 'Deluxe' | 'AC'>('Deluxe');
  
  const [activeCategory, setActiveCategory] = useState<'bus' | 'train' | 'metro' | 'search'>('bus');
  const [passengers, setPassengers] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchasedTicket, setPurchasedTicket] = useState<any | null>(null);
  const [isQrZoomed, setIsQrZoomed] = useState(false);

  // Countdown timer for purchased ticket
  const [secondsRemaining, setSecondsRemaining] = useState(1200); // 20 minutes countdown

  useEffect(() => {
    if (!purchasedTicket) return;
    setSecondsRemaining(1200);
    const interval = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [purchasedTicket]);

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleSwapStops = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const calculateFare = () => {
    const sIdx = CHENNAI_STOPS_LIST.indexOf(source);
    const dIdx = CHENNAI_STOPS_LIST.indexOf(destination);
    const distanceFactor = Math.max(1, Math.abs(sIdx - dIdx));
    
    let baseFare = 10;
    if (busChecked) {
      if (busType === 'Ordinary') baseFare += distanceFactor * 3;
      else if (busType === 'Express') baseFare += distanceFactor * 5;
      else if (busType === 'Deluxe') baseFare += distanceFactor * 7;
      else if (busType === 'AC') baseFare += distanceFactor * 12;
    }
    if (metroChecked) baseFare += 20;
    if (trainChecked) baseFare += 15;

    return Math.max(15, baseFare) * passengers;
  };

  const handleBookTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (source === destination) {
      alert("Source and Destination stops must be different.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      
      // Determine active modes on the ticket
      const selectedModes = [];
      if (busChecked) selectedModes.push('Bus');
      if (metroChecked) selectedModes.push('Metro');
      if (trainChecked) selectedModes.push('Train');

      setPurchasedTicket({
        id: `UT-${Math.floor(10000000 + Math.random() * 90000000)}`,
        source,
        destination,
        busType,
        modes: selectedModes,
        passengers,
        fare: calculateFare(),
        timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] text-slate-800 p-4 overflow-y-auto no-scrollbar" id="mtc-ticket-simulator">
      
      {!purchasedTicket ? (
        <div className="space-y-4 pb-12">
          
          {/* Section: Red-pink "Plan your journey" header matching screenshots */}
          <div className="bg-gradient-to-r from-[#ff0a24] via-[#ff0055] to-[#db0060] rounded-[24px] p-5 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8 pointer-events-none" />
            
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-black uppercase tracking-wider">→ Plan your journey</span>
            </div>
            <h2 className="text-xl font-black tracking-tight mb-4">Where would you like to go?</h2>

            <form onSubmit={handleBookTicket} className="space-y-3 relative z-10 text-slate-900">
              
              {/* Source Field */}
              <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#ff0055] bg-white shrink-0" />
                <div className="flex-grow">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none mb-1">Origin Stop</span>
                  <select 
                    value={source} 
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none appearance-none cursor-pointer"
                  >
                    {CHENNAI_STOPS_LIST.map(stop => (
                      <option key={`src-${stop}`} value={stop}>{stop}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-end -my-5 mr-6 relative z-20">
                <button
                  type="button"
                  onClick={handleSwapStops}
                  className="w-8 h-8 rounded-full bg-white text-[#ff0055] shadow-md border border-slate-100 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Swap Stops"
                >
                  <ArrowLeftRight className="w-4 h-4 rotate-90" />
                </button>
              </div>

              {/* Destination Field */}
              <div className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm border border-slate-100">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff0055] shrink-0" />
                <div className="flex-grow">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none mb-1">Destination Stop</span>
                  <select 
                    value={destination} 
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none appearance-none cursor-pointer"
                  >
                    {CHENNAI_STOPS_LIST.map(stop => (
                      <option key={`dest-${stop}`} value={stop}>{stop}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Section: Mode Switching Circle Buttons matching reference precisely */}
          <div className="grid grid-cols-4 gap-2.5">
            {/* Bus Option */}
            <button
              onClick={() => {
                setActiveCategory('bus');
                setBusChecked(true);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${
                activeCategory === 'bus' 
                  ? 'bg-[#fbc02d] text-slate-900 ring-2 ring-amber-300' 
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}>
                <Bus className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold ${activeCategory === 'bus' ? 'text-slate-900' : 'text-slate-500'}`}>Bus</span>
            </button>

            {/* Train Option */}
            <button
              onClick={() => {
                setActiveCategory('train');
                setTrainChecked(true);
                setBusChecked(false);
                setMetroChecked(false);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${
                activeCategory === 'train' 
                  ? 'bg-[#4caf50] text-white ring-2 ring-emerald-300' 
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}>
                <Train className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold ${activeCategory === 'train' ? 'text-slate-900' : 'text-slate-500'}`}>Train</span>
            </button>

            {/* Metro Option */}
            <button
              onClick={() => {
                setActiveCategory('metro');
                setMetroChecked(true);
                setBusChecked(false);
                setTrainChecked(false);
              }}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${
                activeCategory === 'metro' 
                  ? 'bg-[#2196f3] text-white ring-2 ring-blue-300' 
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}>
                <Train className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold ${activeCategory === 'metro' ? 'text-slate-900' : 'text-slate-500'}`}>Metro</span>
            </button>

            {/* Search Option */}
            <button
              onClick={() => setActiveCategory('search')}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all ${
                activeCategory === 'search' 
                  ? 'bg-slate-700 text-white ring-2 ring-slate-400' 
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}>
                <Search className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-bold ${activeCategory === 'search' ? 'text-slate-900' : 'text-slate-500'}`}>Search</span>
            </button>
          </div>

          {/* Section: Favorites Quick Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block px-0.5">Favorites</span>
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button 
                type="button"
                onClick={() => {
                  setSource('Guindy Kathipara');
                  setDestination('Alandur Metro Station');
                }}
                className="bg-white border border-slate-200 hover:border-[#ff0055]/30 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-slate-700 flex items-center gap-1 shrink-0 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#ff0055]" />
                <span>Guindy Kathipara</span>
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  setSource('Nandambakkam Bus Stand');
                  setDestination('Broadway Terminal');
                }}
                className="bg-white border border-slate-200 hover:border-[#ff0055]/30 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-slate-700 flex items-center gap-1 shrink-0 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#ff0055]" />
                <span>Broadway Route</span>
              </button>

              <button 
                type="button"
                onClick={() => {
                  setSource('Adyar Depot');
                  setDestination('Siruseri IT Park');
                }}
                className="bg-white border border-slate-200 hover:border-[#ff0055]/30 rounded-full px-3.5 py-1.5 text-[11px] font-bold text-slate-700 flex items-center gap-1 shrink-0 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3 text-[#ff0055]" />
                <span>OMR Corridor</span>
              </button>
            </div>
          </div>

          {/* Section: Setup Safety Now! (SOS Yellow card from screenshot 1) */}
          <div className="bg-[#fbc02d] rounded-[24px] p-4 text-slate-950 shadow-sm relative overflow-hidden flex justify-between items-center">
            {/* Background elements */}
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-black/5 rounded-full pointer-events-none" />
            
            <div className="space-y-1 relative z-10 max-w-[65%]">
              <h3 className="text-base font-black tracking-tight leading-snug">Setup Safety Now!</h3>
              <p className="text-[10px] font-bold text-slate-800 leading-tight">
                Safe and Reliable Rides. Push SOS button in case of any transit emergency.
              </p>
            </div>

            {/* SOS Phone Mock graphic */}
            <div className="w-16 h-20 bg-slate-900 rounded-xl p-1 shadow-md border-2 border-slate-850 flex flex-col justify-between shrink-0 relative">
              <div className="w-4 h-1 bg-slate-850 rounded-full mx-auto" />
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mx-auto shadow-inner border border-red-500">
                <span className="text-[8px] font-black text-white tracking-tighter">SOS</span>
              </div>
              <div className="w-8 h-1 bg-slate-800 rounded-full mx-auto mb-1" />
            </div>
          </div>

          {/* Section: Choose modes config card precisely matching Screen 3 layout */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Choose modes</h3>

            {/* Mode 1: Bus Transit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Bus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Bus Transit</h4>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase">Frequently available</span>
                  </div>
                </div>
                
                {/* Switch Toggle */}
                <button 
                  type="button"
                  onClick={() => setBusChecked(!busChecked)}
                  className={`w-11 h-6 rounded-full p-0.5 transition-all cursor-pointer ${
                    busChecked ? 'bg-blue-600' : 'bg-slate-200'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                    busChecked ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Sub-types selection chips matching the green chips screenshot */}
              {busChecked && (
                <div className="grid grid-cols-4 gap-1.5 pl-11 pt-1">
                  {(['Ordinary', 'Express', 'Deluxe', 'AC'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBusType(type)}
                      className={`py-1.5 px-1 text-[10px] rounded-lg font-extrabold border text-center transition-all cursor-pointer ${
                        busType === type 
                          ? 'bg-[#4caf50] border-[#4caf50] text-white shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Mode 2: Metro Transit */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Metro Transit</h4>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase">Less Frequently available</span>
                </div>
              </div>
              
              {/* Switch Toggle */}
              <button 
                type="button"
                onClick={() => setMetroChecked(!metroChecked)}
                className={`w-11 h-6 rounded-full p-0.5 transition-all cursor-pointer ${
                  metroChecked ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  metroChecked ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <hr className="border-slate-100" />

            {/* Mode 3: Local Train */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Train className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Local Train</h4>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase">Less Frequently available</span>
                </div>
              </div>
              
              {/* Switch Toggle */}
              <button 
                type="button"
                onClick={() => setTrainChecked(!trainChecked)}
                className={`w-11 h-6 rounded-full p-0.5 transition-all cursor-pointer ${
                  trainChecked ? 'bg-blue-600' : 'bg-slate-200'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                  trainChecked ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Passenger count and fare */}
          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Passenger Count Selector */}
            <div className="col-span-6 bg-white border border-slate-100 p-3 rounded-2xl shadow-xs flex flex-col justify-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Passengers</span>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPassengers(p => Math.max(1, p - 1))}
                  className="w-7 h-7 bg-slate-100 text-slate-700 rounded-full font-black flex items-center justify-center cursor-pointer"
                >
                  -
                </button>
                <span className="font-bold text-slate-800 text-sm font-mono">{passengers}</span>
                <button
                  type="button"
                  onClick={() => setPassengers(p => Math.min(5, p + 1))}
                  className="w-7 h-7 bg-slate-100 text-slate-700 rounded-full font-black flex items-center justify-center cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Fare visualizer */}
            <div className="col-span-6 bg-white border border-slate-100 p-3.5 rounded-2xl shadow-xs flex flex-col justify-center text-right">
              <span className="text-[9px] font-bold text-slate-400 uppercase block leading-none mb-1">Unified Fare</span>
              <span className="text-xl font-black text-slate-900 font-mono">₹{calculateFare()}</span>
            </div>
          </div>

          {/* Submit Checkout Button */}
          <button
            onClick={handleBookTicket}
            disabled={isProcessing || (!busChecked && !metroChecked && !trainChecked)}
            className="w-full bg-gradient-to-r from-[#ff0a24] to-[#db0060] text-white font-black py-4 rounded-[20px] transition-all shadow-md active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-widest cursor-pointer"
          >
            {isProcessing ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <TicketIcon className="w-4 h-4" /> Book Digital ticket
              </>
            )}
          </button>
        </div>
      ) : (
        /* Virtual Unified Ticket Display - matching the high fidelity screenshots */
        <div className="space-y-4 animate-[fadeIn_0.3s_ease] pb-12">
          
          <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl relative border-2 border-slate-100" id="unified-ticket-coupon">
            
            {/* Top Bar matching Unified Ticket design with Tamil */}
            <div className="bg-gradient-to-r from-red-600 to-pink-700 text-white py-3 px-4 text-center relative border-b border-white/10">
              <span className="text-[8px] font-black tracking-widest uppercase opacity-75">UNIFIED TICKET / ஒருங்கிணைந்த பயணச் சீட்டு</span>
              <div className="absolute top-1/2 -translate-y-1/2 left-3 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Ticket header details info banner */}
            <div className="px-5 pt-4 flex justify-between items-center text-[10px] font-bold text-slate-400 font-mono">
              <span>DATE: {purchasedTicket.timestamp.split(' ')[0]}</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">👤 x{purchasedTicket.passengers} Adults</span>
              <span className="text-slate-500">MODES: {purchasedTicket.modes.join(' + ')}</span>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Highlight Validity Timer band styled exactly like the screenshot */}
              <div className="bg-[#eafaf1] border border-emerald-200 rounded-2xl p-3 text-center space-y-1">
                <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block">Ticket is valid till</span>
                <span className="text-3xl font-black text-emerald-600 font-mono tracking-tight flex items-center justify-center gap-1.5">
                  <Clock className="w-5 h-5 text-emerald-500 animate-pulse" />
                  {formatCountdown(secondsRemaining)}
                </span>
              </div>

              {/* QR and Verification Block */}
              <div className="flex flex-col items-center justify-center py-2 space-y-3">
                <button
                  type="button"
                  onClick={() => setIsQrZoomed(true)}
                  className="bg-slate-50 p-4 rounded-[24px] border border-slate-100 shadow-inner flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer relative"
                  title="Tap to verify/zoom QR Code"
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`VERIFIED_UNIFIED_TICKET\nID: ${purchasedTicket.id}\nFrom: ${purchasedTicket.source}\nTo: ${purchasedTicket.destination}\nPassengers: ${purchasedTicket.passengers}\nModes: ${purchasedTicket.modes.join(', ')}\nFare: ₹${purchasedTicket.fare}`)}`}
                    alt="Unified Ticket QR Code"
                    className="w-32 h-32 object-contain"
                    referrerPolicy="no-referrer"
                  />
                  {/* Small absolute logo inside QR for high-fidelity look */}
                  <div className="absolute w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100">
                    <div className="w-5 h-5 rounded-full bg-[#ff0055] flex items-center justify-center">
                      <span className="text-[8px] text-white font-black">1</span>
                    </div>
                  </div>
                </button>
                <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">TAP QR TO ZOOM VERIFIER</span>
              </div>

              {/* Route Indicator Info */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 uppercase">
                  <span>{purchasedTicket.busType} ROUTE</span>
                  <span className="text-[#ff0055] font-mono">{purchasedTicket.id}</span>
                </div>
                
                {/* Route stations details */}
                <div className="flex items-start gap-3 pt-1">
                  <div className="flex flex-col items-center py-1 shrink-0">
                    <span className="w-3 h-3 rounded-full border-2 border-[#ff0055] bg-white" />
                    <div className="h-6 w-0.5 bg-dashed border-l-2 border-slate-200 my-0.5" />
                    <span className="w-3 h-3 rounded-full bg-[#ff0055]" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between h-14 text-xs font-bold text-slate-800">
                    <div className="leading-tight">
                      <span className="text-[8px] text-slate-400 block font-bold uppercase tracking-wider leading-none mb-0.5">ORIGIN STATION</span>
                      {purchasedTicket.source}
                    </div>
                    <div className="leading-tight mt-1">
                      <span className="text-[8px] text-slate-400 block font-bold uppercase tracking-wider leading-none mb-0.5">DESTINATION STATION</span>
                      {purchasedTicket.destination}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parameters Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-4 pb-2">
                <div>
                  <span className="text-slate-400 text-[8px] font-bold block uppercase">BOOKING TIME</span>
                  <span className="text-slate-800 font-mono font-medium">{purchasedTicket.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[8px] font-bold block uppercase">FARE CHARGED</span>
                  <span className="text-sm font-black text-[#ff0055] font-mono leading-none">₹{purchasedTicket.fare}.00</span>
                </div>
              </div>

            </div>

            {/* Edge tear cutouts for realistic coupon styling */}
            <div className="absolute left-0 bottom-12 w-4 h-8 bg-[#f8f9fa] rounded-r-full -translate-x-2 border-r border-slate-100" />
            <div className="absolute right-0 bottom-12 w-4 h-8 bg-[#f8f9fa] rounded-l-full translate-x-2 border-l border-slate-100" />

            {/* Tear separator line */}
            <div className="border-t border-dashed border-slate-200 mx-5 my-0.5" />

            {/* Bottom tear branding */}
            <div className="bg-slate-50 py-3.5 px-5 text-center text-[10px] font-bold text-slate-400">
              MTC Official Digital Token • Unified Ticket non-refundable
            </div>
          </div>

          {/* Book another ticket button */}
          <button
            onClick={() => setPurchasedTicket(null)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 rounded-2xl transition-all border border-slate-800 text-xs uppercase tracking-wider cursor-pointer shadow-md"
          >
            ← Book Another Journey
          </button>
        </div>
      )}

      {/* Full screen high contrast QR Zoom Modal */}
      <AnimatePresence>
        {isQrZoomed && purchasedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsQrZoomed(false)}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white text-slate-900 rounded-[32px] p-6 max-w-[340px] w-full shadow-2xl flex flex-col items-center border border-slate-100"
            >
              {/* Modal Header */}
              <div className="text-center mb-5 w-full">
                <div className="flex items-center justify-center gap-1.5 text-red-600 font-black text-xs uppercase tracking-widest mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  MTC Unified Verifier
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scan code on the transit verifier</p>
              </div>

              {/* Large High-Res QR Code */}
              <div className="relative bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner w-[240px] h-[240px] flex items-center justify-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`VERIFIED_UNIFIED_TICKET\nID: ${purchasedTicket.id}\nFrom: ${purchasedTicket.source}\nTo: ${purchasedTicket.destination}\nPassengers: ${purchasedTicket.passengers}\nModes: ${purchasedTicket.modes.join(', ')}\nFare: ₹${purchasedTicket.fare}`)}`}
                  alt="MTC Ticket QR Code" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
                {/* Center circle */}
                <div className="absolute w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-7 h-7 rounded-full bg-[#ff0055] flex items-center justify-center">
                    <span className="text-[11px] text-white font-black">1</span>
                  </div>
                </div>
              </div>

              {/* Details List */}
              <div className="w-full mt-5 space-y-2 text-xs border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">TICKET ID</span>
                  <span className="text-slate-900 font-black font-mono">{purchasedTicket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">ROUTE</span>
                  <span className="text-slate-900 font-black text-right">{purchasedTicket.source} → {purchasedTicket.destination}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">MODES</span>
                  <span className="text-slate-900 font-bold">{purchasedTicket.modes.join(' + ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-extrabold uppercase text-[9px] tracking-wider">FARE PAID</span>
                  <span className="text-red-600 font-black text-sm font-mono">₹{purchasedTicket.fare}.00</span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setIsQrZoomed(false)}
                className="mt-6 w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer"
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
