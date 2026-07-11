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
    <div className="flex flex-col h-full bg-ivory-sand text-charcoal p-5 overflow-y-auto no-scrollbar" id="mtc-ticket-simulator">
      
      {/* Header */}
      <div className="mb-5 flex items-center gap-2.5">
        <div className="p-2.5 bg-kumkum-maroon/10 rounded-xl border border-kumkum-maroon/20">
          <Ticket className="w-5 h-5 text-kumkum-maroon" />
        </div>
        <div>
          <h2 className="text-lg font-display font-bold text-charcoal">Route Ticket Dispenser</h2>
          <p className="text-xs text-warm-gray">Generate instantly verifiable digital MTC route tickets</p>
        </div>
      </div>

      {!purchasedTicket ? (
        <form onSubmit={handlePurchase} className="space-y-4">
          {/* Source Stop Selection */}
          <div>
            <label className="block text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2">From Stop</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full bg-white border border-warm-gray/25 rounded-xl py-3 px-4 text-charcoal focus:outline-none focus:border-kumkum-maroon text-sm font-medium cursor-pointer"
            >
              {CHENNAI_STOPS_LIST.map(stop => (
                <option key={`src-${stop}`} value={stop} className="text-charcoal bg-white">{stop}</option>
              ))}
            </select>
          </div>

          {/* Destination Stop Selection */}
          <div>
            <label className="block text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2">To Stop</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-white border border-warm-gray/25 rounded-xl py-3 px-4 text-charcoal focus:outline-none focus:border-kumkum-maroon text-sm font-medium cursor-pointer"
            >
              {CHENNAI_STOPS_LIST.map(stop => (
                <option key={`dest-${stop}`} value={stop} className="text-charcoal bg-white">{stop}</option>
              ))}
            </select>
          </div>

          {/* Ticket Type Pill Selector */}
          <div>
            <label className="block text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2">Ticket Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Single', 'Return', 'Daily'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTicketType(type)}
                  className={`py-3 px-2 text-xs rounded-xl font-bold border transition-all cursor-pointer ${
                    ticketType === type 
                      ? 'bg-kumkum-maroon/10 border-kumkum-maroon text-kumkum-maroon' 
                      : 'bg-white border-warm-gray/15 text-warm-gray hover:text-charcoal'
                  }`}
                >
                  {type === 'Daily' ? 'Daily Pass' : `${type} Route`}
                </button>
              ))}
            </div>
          </div>

          {/* Passenger count */}
          <div>
            <label className="block text-xs font-semibold text-warm-gray uppercase tracking-wider mb-2">Passengers</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPassengers(num)}
                  className={`flex-grow py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                    passengers === num 
                      ? 'bg-kumkum-maroon text-white border-kumkum-maroon' 
                      : 'bg-white border-warm-gray/15 text-warm-gray hover:text-charcoal'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket pricing info */}
          <div className="bg-white p-4 rounded-xl border border-warm-gray/20 shadow-sm flex justify-between items-center mt-6">
            <div>
              <span className="text-[10px] font-bold text-warm-gray uppercase block tracking-wider">Estimated Fare</span>
              <span className="text-xs text-warm-gray">{passengers} Passenger(s) • {ticketType} Trip</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold text-kumkum-maroon">₹{calculateFare()}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-kumkum-maroon hover:bg-kumkum-maroon/90 disabled:bg-warm-gray/20 disabled:text-warm-gray/50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 text-sm border-none cursor-pointer"
          >
            {isProcessing ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
          <div className="bg-white text-charcoal rounded-[28px] overflow-hidden shadow-lg relative border-2 border-[#EADFC9]">
            
            {/* Top Bar with deep teal aesthetic */}
            <div className="bg-[#0F3D3B] text-[#C9A227] p-4 text-center relative border-b border-white/5">
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase opacity-80 text-white/90">Chennai Metropolitan Transport Corp</span>
              <h3 className="text-base font-display font-extrabold mt-0.5 text-white">MTC QUICK PASS</h3>
              <div className="absolute top-1/2 -translate-y-1/2 left-4 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            {/* Main Ticket Info */}
            <div className="p-5 space-y-4">
              
              {/* Ticket ID */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold text-warm-gray">{purchasedTicket.id}</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase bg-emerald-500/10 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> PAID
                </span>
              </div>

              {/* Route Path Indicator */}
              <div className="flex items-center gap-3 bg-ivory-sand p-3 rounded-xl border border-warm-gray/10">
                <div className="flex flex-col items-center">
                  <span className="w-3 h-3 rounded-full border-2 border-kumkum-maroon bg-white" />
                  <div className="h-6 w-0 px-0 border-l-2 border-dashed border-warm-gray/30" />
                  <span className="w-3 h-3 rounded-full bg-kumkum-maroon" />
                </div>
                <div className="flex-grow flex flex-col justify-between h-14 py-1">
                  <div>
                    <span className="text-[9px] text-warm-gray block font-bold uppercase leading-none">ORIGIN</span>
                    <span className="text-xs font-bold text-charcoal leading-tight">{purchasedTicket.source}</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[9px] text-warm-gray block font-bold uppercase leading-none">DESTINATION</span>
                    <span className="text-xs font-bold text-charcoal leading-tight">{purchasedTicket.destination}</span>
                  </div>
                </div>
              </div>

              {/* Parameters Grid */}
              <div className="grid grid-cols-2 gap-3.5 pt-1 text-xs border-t border-b border-warm-gray/10 py-3.5">
                <div>
                  <span className="text-warm-gray text-[9px] font-bold block uppercase">PASSENGERS</span>
                  <span className="text-charcoal font-bold">{purchasedTicket.passengers} Adults</span>
                </div>
                <div>
                  <span className="text-warm-gray text-[9px] font-bold block uppercase">TICKET TYPE</span>
                  <span className="text-charcoal font-bold">{purchasedTicket.ticketType} Journey</span>
                </div>
                <div>
                  <span className="text-warm-gray text-[9px] font-bold block uppercase">BOOKING TIME</span>
                  <span className="text-charcoal font-medium font-mono text-[10px]">{purchasedTicket.timestamp}</span>
                </div>
                <div>
                  <span className="text-warm-gray text-[9px] font-bold block uppercase">FARE CHARGED</span>
                  <span className="text-base font-extrabold text-kumkum-maroon leading-none">₹{purchasedTicket.fare}.00</span>
                </div>
              </div>

              {/* QR and Verification Block */}
              <div className="flex flex-col items-center justify-center pt-3 pb-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsQrZoomed(true)}
                  className="bg-ivory-sand p-2.5 rounded-2xl border border-warm-gray/15 shadow-inner flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  title="Tap to verify/zoom QR Code"
                >
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=112x112&data=${encodeURIComponent(`MTC-TICKET-VERIFIED\nID: ${purchasedTicket.id}\nRoute: ${purchasedTicket.source} to ${purchasedTicket.destination}\nType: ${purchasedTicket.ticketType}\nPassengers: ${purchasedTicket.passengers}\nFare: ₹${purchasedTicket.fare}\nTime: ${purchasedTicket.timestamp}`)}`}
                    alt="Ticket QR Code"
                    className="w-28 h-28 object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
                <span className="text-[9px] font-mono font-bold tracking-widest text-warm-gray uppercase">SCAN ON MTC BUS VERIFIER</span>
              </div>
            </div>

            {/* Bottom tear aesthetic */}
            <div className="bg-[#FBF9F4] p-3 text-center border-t border-dashed border-warm-gray/20">
              <span className="text-[9px] font-bold text-warm-gray">MTC Official Digital Token • Ticket non-refundable after purchase</span>
            </div>
          </div>

          <button
            onClick={() => setPurchasedTicket(null)}
            className="w-full bg-[#0F3D3B] hover:bg-[#072423] text-white font-bold py-3 rounded-xl transition-all border-none text-xs cursor-pointer"
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
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-deep-teal/95 backdrop-blur-xl cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white text-charcoal rounded-[32px] p-6 max-w-[340px] w-full shadow-2xl flex flex-col items-center border border-[#EADFC9]"
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
                <div className="flex items-center justify-center gap-1.5 text-kumkum-maroon font-bold text-sm uppercase tracking-wider mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  MTC Ticket Verifier
                </div>
                <p className="text-[11px] text-warm-gray font-medium">Scan this code on the bus verifier to check-in</p>
              </div>

              {/* Large High-Res QR Code */}
              <div className="relative bg-ivory-sand p-4 rounded-2xl border border-warm-gray/15 shadow-inner w-[240px] h-[240px] flex items-center justify-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`MTC-TICKET-VERIFIED\nID: ${purchasedTicket.id}\nRoute: ${purchasedTicket.source} to ${purchasedTicket.destination}\nType: ${purchasedTicket.ticketType}\nPassengers: ${purchasedTicket.passengers}\nFare: ₹${purchasedTicket.fare}\nTime: ${purchasedTicket.timestamp}`)}`}
                  alt="MTC Ticket QR Code" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Details List */}
              <div className="w-full mt-5 space-y-2 text-xs border-t border-warm-gray/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-warm-gray font-semibold uppercase tracking-wider text-[10px]">TICKET ID</span>
                  <span className="text-charcoal font-bold font-mono">{purchasedTicket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray font-semibold uppercase tracking-wider text-[10px]">ROUTE</span>
                  <span className="text-charcoal font-bold">{purchasedTicket.source} → {purchasedTicket.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray font-semibold uppercase tracking-wider text-[10px]">PASSENGERS</span>
                  <span className="text-charcoal font-bold">{purchasedTicket.passengers} Adult(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray font-semibold uppercase tracking-wider text-[10px]">FARE PAID</span>
                  <span className="text-emerald-700 font-extrabold text-sm">₹{purchasedTicket.fare}.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray font-semibold uppercase tracking-wider text-[10px]">BOOKED AT</span>
                  <span className="text-warm-gray font-mono text-[10px]">{purchasedTicket.timestamp}</span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setIsQrZoomed(false)}
                className="mt-6 w-full py-3 bg-[#0F3D3B] hover:bg-[#072423] text-white font-bold text-sm rounded-2xl transition-all shadow-md active:scale-95 border-none cursor-pointer"
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
