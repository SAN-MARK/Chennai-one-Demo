import React, { useState } from 'react';
import { Bus, ArrowDownRight, Ticket as TicketIcon, Clock, Plus, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PastTicket {
  id: string;
  source: string;
  destination: string;
  amount: number;
  date: string;
  time: string;
  status: 'Expired' | 'Active';
}

const PAST_TICKETS_DATA: PastTicket[] = [
  {
    id: 'TKT-101',
    source: 'SHOLINGANALLUR P.U.OFFICE',
    destination: 'PUTHUNAGAR',
    amount: 15,
    date: 'Jul 18, 2026',
    time: '3:50 PM',
    status: 'Expired'
  },
  {
    id: 'TKT-102',
    source: 'VELACHERY',
    destination: 'GURU NANAK COLLEGE',
    amount: 33,
    date: 'Jun 17, 2026',
    time: '10:01 AM',
    status: 'Expired'
  },
  {
    id: 'TKT-103',
    source: 'Tambaram West Bus Stand',
    destination: 'Sithalapakkam',
    amount: 25,
    date: 'Apr 28, 2026',
    time: '2:24 PM',
    status: 'Expired'
  },
  {
    id: 'TKT-104',
    source: 'CHITHALAPAKKAM JUNCTION',
    destination: 'Sithalapakkam',
    amount: 5,
    date: 'Mar 22, 2026',
    time: '6:58 PM',
    status: 'Expired'
  },
  {
    id: 'TKT-105',
    source: 'Guru Nanak College',
    destination: 'CHITHALAPAKKAM JUNCTION',
    amount: 10,
    date: 'Feb 14, 2026',
    time: '8:15 AM',
    status: 'Expired'
  }
];

export default function TicketSimulator() {
  const [selectedTicket, setSelectedTicket] = useState<PastTicket | null>(null);

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] text-slate-800 p-4 overflow-y-auto no-scrollbar" id="past-tickets-screen">
      
      {/* Screen Title (Matching Image 6) */}
      <div className="py-2 mb-3 text-center shrink-0">
        <h1 className="text-lg font-sans font-extrabold text-slate-700 tracking-tight">
          Past Tickets
        </h1>
      </div>

      {/* Ticket List (Matching Image 6 layout) */}
      <div className="space-y-3 pb-8">
        {PAST_TICKETS_DATA.map((tkt) => (
          <div 
            key={tkt.id}
            onClick={() => setSelectedTicket(tkt)}
            className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 hover:border-slate-200 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3">
              
              {/* Left Side: 3D White Bus Illustration + Info */}
              <div className="flex items-start gap-3">
                
                {/* 3D Bus Graphic representation */}
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                  <svg viewBox="0 0 64 64" className="w-9 h-9 text-slate-400">
                    <rect x="8" y="16" width="48" height="32" rx="6" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                    <rect x="14" y="22" width="10" height="12" rx="2" fill="#94a3b8" />
                    <rect x="28" y="22" width="10" height="12" rx="2" fill="#94a3b8" />
                    <rect x="42" y="22" width="10" height="12" rx="2" fill="#94a3b8" />
                    <circle cx="18" cy="48" r="4" fill="#475569" />
                    <circle cx="46" cy="48" r="4" fill="#475569" />
                  </svg>
                </div>

                {/* Route details */}
                <div className="flex flex-col">
                  {/* Yellow BUS Badge */}
                  <div className="inline-flex items-center gap-1 bg-[#fff8e1] text-[#f57f17] px-2 py-0.5 rounded-full text-[9px] font-black tracking-wide uppercase w-fit mb-1.5 border border-[#ffe082]/50">
                    <Bus className="w-2.5 h-2.5 fill-current" />
                    <span>BUS</span>
                  </div>

                  {/* Origin */}
                  <p className="text-xs font-sans font-bold text-slate-800 uppercase tracking-tight leading-tight">
                    {tkt.source}
                  </p>

                  {/* Destination with arrow */}
                  <div className="flex items-center gap-1 text-xs font-sans font-bold text-slate-600 uppercase tracking-tight mt-0.5">
                    <ArrowDownRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{tkt.destination}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Fare Amount */}
              <div className="text-right shrink-0">
                <span className="text-xl font-sans font-black text-slate-800 font-mono tracking-tight">
                  ₹{tkt.amount}
                </span>
              </div>
            </div>

            {/* Dashed Separator Line */}
            <div className="w-full border-t border-dashed border-slate-200 my-3" />

            {/* Bottom Row: Date/Time + Status Badge */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>{tkt.date} · {tkt.time}</span>
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                {tkt.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Details Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTicket(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-5 max-w-[320px] w-full shadow-2xl text-slate-900 border border-slate-100"
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-1 bg-[#fff8e1] text-[#f57f17] px-3 py-1 rounded-full text-xs font-black uppercase mb-1">
                  <Bus className="w-3.5 h-3.5" /> MTC Ticket Receipt
                </div>
                <h3 className="text-base font-bold text-slate-800">Unified Ticket Receipt</h3>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl space-y-2 text-xs mb-4 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">TICKET ID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedTicket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">ORIGIN</span>
                  <span className="font-bold text-slate-800 text-right">{selectedTicket.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">DESTINATION</span>
                  <span className="font-bold text-slate-800 text-right">{selectedTicket.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">DATE & TIME</span>
                  <span className="font-mono text-slate-700">{selectedTicket.date} · {selectedTicket.time}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">TOTAL FARE</span>
                  <span className="font-mono font-black text-slate-900 text-sm">₹{selectedTicket.amount}.00</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all uppercase tracking-wider"
              >
                Close Receipt
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
