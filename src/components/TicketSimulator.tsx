import React, { useState } from 'react';
import { Bus, ArrowDownRight, Plus, X, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

interface TicketItem {
  id: string;
  category: string;
  source: string;
  destination: string;
  price: number;
  date: string;
  time: string;
  status: string;
}

const PAST_TICKETS_DATA: TicketItem[] = [
  {
    id: 'TKT-101',
    category: 'BUS',
    source: 'SHOLINGANALLUR P.U.OFFICE',
    destination: 'PUTHUNAGAR',
    price: 15,
    date: 'Jul 18, 2026',
    time: '3:50 PM',
    status: 'Expired'
  },
  {
    id: 'TKT-102',
    category: 'BUS',
    source: 'VELACHERY',
    destination: 'GURU NANAK COLLEGE',
    price: 33,
    date: 'Jun 17, 2026',
    time: '10:01 AM',
    status: 'Expired'
  },
  {
    id: 'TKT-103',
    category: 'BUS',
    source: 'Tambaram West Bus Stand',
    destination: 'Sithalapakkam',
    price: 25,
    date: 'Apr 28, 2026',
    time: '2:24 PM',
    status: 'Expired'
  },
  {
    id: 'TKT-104',
    category: 'BUS',
    source: 'CHITHALAPAKKAM JUNCTION',
    destination: 'Sithalapakkam',
    price: 5,
    date: 'Mar 22, 2026',
    time: '6:58 PM',
    status: 'Expired'
  },
  {
    id: 'TKT-105',
    category: 'BUS',
    source: 'Guru Nanak College',
    destination: 'CHITHALAPAKKAM JUNCTION',
    price: 10,
    date: 'Feb 12, 2026',
    time: '11:15 AM',
    status: 'Expired'
  }
];

export default function TicketSimulator() {
  const [ticketsList, setTicketsList] = useState<TicketItem[]>(PAST_TICKETS_DATA);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newSource, setNewSource] = useState('Broadway Terminal');
  const [newDestination, setNewDestination] = useState('Alandur Metro Station');
  const [newPrice, setNewPrice] = useState('15');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleBookTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource || !newDestination) return;

    const newTicket: TicketItem = {
      id: `TKT-${Math.floor(100 + Math.random() * 900)}`,
      category: 'BUS',
      source: newSource.toUpperCase(),
      destination: newDestination.toUpperCase(),
      price: Number(newPrice) || 15,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      status: 'Active'
    };

    setTicketsList([newTicket, ...ticketsList]);
    setShowBookingModal(false);
    setToastMsg('Ticket booked successfully! Valid for today.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fa] text-slate-800 p-4 font-sans select-none pb-24 overflow-y-auto no-scrollbar">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl z-50 flex items-center gap-2 animate-[bounce_0.5s_ease]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Screen Title matching Image 2 screenshot */}
      <div className="flex items-center justify-between my-2">
        <h2 className="text-base font-bold text-slate-700 tracking-tight mx-auto text-center">
          Past Tickets
        </h2>
        <button 
          onClick={() => setShowBookingModal(true)}
          className="absolute right-4 p-1.5 rounded-full bg-[#e60026] text-white hover:bg-red-700 shadow-sm text-xs font-bold flex items-center gap-1 px-3 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Book
        </button>
      </div>

      {/* Vertical List of Ticket Cards matching Image 2 screenshot */}
      <div className="space-y-3 mt-3">
        {ticketsList.map((tkt) => (
          <div 
            key={tkt.id}
            className="bg-white rounded-2xl p-4 shadow-2xs border border-slate-100 flex flex-col justify-between hover:shadow-xs transition-shadow"
          >
            {/* Top row: Bus 3D Icon + Route info + Price */}
            <div className="flex items-start justify-between gap-2">
              
              {/* Left Side: 3D Bus Illustration & Route details */}
              <div className="flex items-start gap-3">
                {/* 3D Bus graphic SVG */}
                <div className="w-14 h-11 shrink-0 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-1">
                  <svg viewBox="0 0 100 70" className="w-full h-full text-slate-400 fill-current drop-shadow-xs">
                    {/* Isometric bus roof & body */}
                    <path d="M 15 25 L 45 10 L 85 20 L 55 35 Z" fill="#e2e8f0" />
                    <path d="M 15 25 L 55 35 L 55 55 L 15 45 Z" fill="#cbd5e1" />
                    <path d="M 55 35 L 85 20 L 85 40 L 55 55 Z" fill="#94a3b8" />
                    {/* Windows */}
                    <path d="M 20 30 L 32 26 L 32 36 L 20 38 Z" fill="#64748b" />
                    <path d="M 36 25 L 48 21 L 48 31 L 36 34 Z" fill="#64748b" />
                    {/* Wheels */}
                    <circle cx="28" cy="46" r="5" fill="#334155" />
                    <circle cx="70" cy="42" r="5" fill="#334155" />
                  </svg>
                </div>

                {/* Category tag & Route names */}
                <div>
                  {/* Category Pill */}
                  <div className="bg-[#fef9c3] text-[#ca8a04] text-[9.5px] font-black uppercase px-2 py-0.5 rounded-md inline-flex items-center gap-1 mb-1.5">
                    <Bus className="w-2.5 h-2.5 fill-current" />
                    <span>{tkt.category}</span>
                  </div>

                  {/* Origin Station */}
                  <h3 className="text-xs font-black text-slate-800 tracking-tight uppercase leading-snug">
                    {tkt.source}
                  </h3>

                  {/* Downward arrow & Destination Station */}
                  <p className="text-xs font-black text-slate-600 tracking-tight uppercase flex items-center gap-1 mt-0.5">
                    <span className="text-slate-400 text-sm font-bold">↘</span>
                    <span>{tkt.destination}</span>
                  </p>
                </div>
              </div>

              {/* Right Side: Bold Fare Price */}
              <div className="shrink-0 text-right">
                <span className="text-xl font-black text-slate-800 tracking-tight">
                  ₹{tkt.price}
                </span>
              </div>
            </div>

            {/* Dashed Separator Line */}
            <div className="border-b border-dashed border-slate-200 my-3" />

            {/* Bottom Row: Date/Time + Status Badge */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium text-[11px]">
                {tkt.date} • {tkt.time}
              </span>

              <span className={`px-3 py-0.5 rounded-md font-bold text-[11px] ${
                tkt.status === 'Active' 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : 'bg-[#f1f5f9] text-[#94a3b8]'
              }`}>
                {tkt.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm space-y-4 text-slate-900 shadow-2xl animate-[fadeIn_0.2s_ease]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Book New Bus Ticket</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">From Boarding Stop</label>
                <input 
                  type="text" 
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#e60026]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">To Destination Stop</label>
                <input 
                  type="text" 
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#e60026]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Ticket Price (₹)</label>
                <input 
                  type="number" 
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#e60026]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 rounded-xl bg-[#e60026] text-white font-bold hover:bg-red-700 shadow-sm"
                >
                  Pay & Issue Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
