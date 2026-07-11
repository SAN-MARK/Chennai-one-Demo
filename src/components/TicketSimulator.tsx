import React, { useState } from 'react';
import { Ticket, QrCode, CreditCard, ChevronRight, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CHENNAI_STOPS_LIST = [
  'Broadway', 'Chennai Central', 'Guindy', 'Adyar', 'Tambaram', 'CMBT', 'Mylapore', 'SRP Tools', 'Sholinganallur', 'Kelambakkam', 'Kovalam', 'Siruseri'
];

export default function TicketSimulator() {
  const [source, setSource] = useState('Chennai Central');
  const [destination, setDestination] = useState('Adyar');
  const [ticketType, setTicketType] = useState<'Single' | 'Return' | 'Daily'>('Single');
  const [passengers, setPassengers] = useState(1);
  const [purchasedTicket, setPurchasedTicket] = useState<any | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQrZoomed, setIsQrZoomed] = useState<boolean>(false);

  // Simple dynamic fare calculation based on mock stops distance
  const calculateFare = () => {
    const sIdx = CHENNAI_STOPS_LIST.indexOf(source);
    const dIdx = CHENNAI_STOPS_LIST.indexOf(destination);
    const distanceFactor = Math.max(1, Math.abs(sIdx - dIdx));
    let baseFare = distanceFactor * 5 + 10; // e.g. ₹15 to ₹50
    if (ticketType === 'Return') baseFare *= 1.8;
    if (ticketType === 'Daily') baseFare = 50; // Flat 50 for daily
    return Math.round(baseFare) * passengers;
  };

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (source === destination) {
      alert("Source and Destination cannot be the same!");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPurchasedTicket({
        id: `TKT-${Math.floor(10000000 + Math.random() * 90000000)}`,
        source,
        destination,
        ticketType,
        passengers,
        fare: calculateFare(),
        timestamp: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }) + ' ' + new Date().toLocaleTimeString('en-US', { hour12: false }),
        qrValue: `MTC-TKT-${source.slice(0, 3)}-${destination.slice(0, 3)}-${ticketType}`
      });
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-5 overflow-y-auto no-scrollbar" id="mtc-ticket-simulator">
      
      {/* Header */}
      <div className="mb-5 flex items-center gap-2.5">
        <div className="p-2.5 bg-[#ecd695]/10 rounded-xl border border-[#ecd695]/30">
          <Ticket className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-lg font-display font-bold text-white">Route Ticket Dispenser</h2>
          <p className="text-xs text-slate-400">Generate instantly verifiable digital MTC route tickets</p>
        </div>
      </div>

      {!purchasedTicket ? (
        <form onSubmit={handlePurchase} className="space-y-4">
          {/* Source Stop Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">From Stop</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 text-sm font-medium"
            >
              {CHENNAI_STOPS_LIST.map(stop => (
                <option key={`src-${stop}`} value={stop}>{stop}</option>
              ))}
            </select>
          </div>

          {/* Destination Stop Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">To Stop</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-amber-500 text-sm font-medium"
            >
              {CHENNAI_STOPS_LIST.map(stop => (
                <option key={`dest-${stop}`} value={stop}>{stop}</option>
              ))}
            </select>
          </div>

          {/* Ticket Type Pill Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ticket Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Single', 'Return', 'Daily'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTicketType(type)}
                  className={`py-3 px-2 text-xs rounded-xl font-bold border transition-all ${
                    ticketType === type 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'Daily' ? 'Daily Pass' : `${type} Route`}
                </button>
              ))}
            </div>
          </div>

          {/* Passenger count */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Passengers</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPassengers(num)}
                  className={`flex-grow py-2.5 rounded-xl text-sm font-bold border transition-all ${
                    passengers === num 
                      ? 'bg-amber-500 text-slate-950 border-amber-500' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket pricing info */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center mt-6">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Estimated Fare</span>
              <span className="text-xs text-slate-500">{passengers} Passenger(s) • {ticketType} Trip</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-amber-400">₹{calculateFare()}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 text-sm"
          >
            {isProcessing ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard className="w-4 h-4" /> Book Digital Ticket
              </>
            )}
          </button>
        </form>
      ) : (
        /* Virtual Ticket Preview */
        <div className="space-y-4 animate-[fadeIn_0.3s_ease]">
          <div className="bg-white text-slate-900 rounded-[28px] overflow-hidden shadow-2xl relative border-2 border-white">
            
            {/* Top Bar with blue aesthetic */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 text-center relative">
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase opacity-75">Chennai Metropolitan Transport Corp</span>
              <h3 className="text-base font-display font-extrabold mt-0.5">MTC QUICK PASS</h3>
              <div className="absolute top-1/2 -translate-y-1/2 left-4 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Main Ticket Info */}
            <div className="p-5 space-y-4">
              
              {/* Ticket ID */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-slate-400">{purchasedTicket.id}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> PAID
                </span>
              </div>

              {/* Route Path Indicator */}
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex flex-col items-center">
                  <span className="w-3 h-3 rounded-full border-2 border-blue-600 bg-white" />
                  <div className="h-6 w-0.5 bg-dashed bg-slate-300" />
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                </div>
                <div className="flex-grow flex flex-col justify-between h-14 py-1">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">ORIGIN</span>
                    <span className="text-xs font-bold text-slate-800 leading-tight">{purchasedTicket.source}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[9px] text-slate-400 block font-bold uppercase leading-none">DESTINATION</span>
                    <span className="text-xs font-bold text-slate-800 leading-tight">{purchasedTicket.destination}</span>
                  </div>
                </div>
              </div>

              {/* Parameters Grid */}
              <div className="grid grid-cols-2 gap-3.5 pt-1 text-xs border-t border-b border-slate-100 py-3.5">
                <div>
                  <span className="text-slate-400 text-[9px] font-bold block uppercase">PASSENGERS</span>
                  <span className="text-slate-800 font-bold">{purchasedTicket.passengers} Adults</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] font-bold block uppercase">TICKET TYPE</span>
                  <span className="text-slate-800 font-bold">{purchasedTicket.ticketType} Journey</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] font-bold block uppercase">BOOKING TIME</span>
                  <span className="text-slate-800 font-medium font-mono text-[10px]">{purchasedTicket.timestamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] font-bold block uppercase">FARE CHARGED</span>
                  <span className="text-base font-extrabold text-blue-800 leading-none">₹{purchasedTicket.fare}.00</span>
                </div>
              </div>

              {/* QR and Verification Block */}
              <div className="flex flex-col items-center justify-center pt-3 pb-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsQrZoomed(true)}
                  className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shadow-inner flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  title="Tap to verify/zoom QR Code"
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=112x112&data=${encodeURIComponent(`MTC-TICKET-VERIFIED\nID: ${purchasedTicket.id}\nRoute: ${purchasedTicket.source} to ${purchasedTicket.destination}\nType: ${purchasedTicket.ticketType}\nPassengers: ${purchasedTicket.passengers}\nFare: ₹${purchasedTicket.fare}\nTime: ${purchasedTicket.timestamp}`)}`}
                    alt="Ticket QR Code"
                    className="w-28 h-28 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
                <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 uppercase">SCAN ON MTC BUS VERIFIER</span>
              </div>
            </div>

            {/* Bottom tear aesthetic */}
            <div className="bg-slate-50 p-3 text-center border-t border-dashed border-slate-200">
              <span className="text-[9px] font-bold text-slate-500">MTC Official Digital Token • Ticket non-refundable after purchase</span>
            </div>
          </div>

          <button
            onClick={() => setPurchasedTicket(null)}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-all border border-slate-750 text-xs"
          >
            Buy Another Ticket
          </button>
        </div>
      )}

      {/* Full screen blurred QR Modal */}
      <AnimatePresence>
        {isQrZoomed && purchasedTicket && (
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
                <div className="flex items-center justify-center gap-1.5 text-blue-900 font-bold text-sm uppercase tracking-wider mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  MTC Ticket Verifier
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Scan this code on the bus verifier to check-in</p>
              </div>

              {/* Large High-Res QR Code */}
              <div className="relative bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner w-[240px] h-[240px] flex items-center justify-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`MTC-TICKET-VERIFIED\nID: ${purchasedTicket.id}\nRoute: ${purchasedTicket.source} to ${purchasedTicket.destination}\nType: ${purchasedTicket.ticketType}\nPassengers: ${purchasedTicket.passengers}\nFare: ₹${purchasedTicket.fare}\nTime: ${purchasedTicket.timestamp}`)}`}
                  alt="MTC Ticket QR Code" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Details List */}
              <div className="w-full mt-5 space-y-2 text-xs border-t border-slate-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">TICKET ID</span>
                  <span className="text-slate-900 font-bold font-mono">{purchasedTicket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">ROUTE</span>
                  <span className="text-slate-900 font-bold">{purchasedTicket.source} → {purchasedTicket.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">PASSENGERS</span>
                  <span className="text-slate-900 font-bold">{purchasedTicket.passengers} Adult(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">FARE PAID</span>
                  <span className="text-emerald-600 font-extrabold text-sm">₹{purchasedTicket.fare}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">BOOKED AT</span>
                  <span className="text-slate-600 font-mono text-[10px]">{purchasedTicket.timestamp}</span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setIsQrZoomed(false)}
                className="mt-6 w-full py-3 bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm rounded-2xl transition-all shadow-md active:scale-95"
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
