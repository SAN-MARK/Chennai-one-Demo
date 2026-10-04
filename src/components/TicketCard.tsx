import React from 'react';
import { BusIcon } from './CustomIcons';

export interface TicketItem {
  id: string;
  source: string;
  destination: string;
  dateTime: string;
  price: string;
  status: 'Expired' | 'Active';
  transportType?: string;
}

interface TicketCardProps {
  ticket: TicketItem;
  onClick?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-full bg-[#F2EBDC] border border-[#E5DDC9] p-4 rounded-[2px] shadow-2xl flex flex-col justify-between cursor-pointer hover:border-[#C08B4F] transition-colors relative"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Bus Icon Container */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-[#E5DDC9] rounded-[2px] border border-[#A89984]/30 flex items-center justify-center shrink-0 mt-0.5">
            <BusIcon className="w-5 h-5 text-[#8B4A3D]" color="#8B4A3D" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Bus Tag */}
            <span className="font-sans text-[10px] uppercase font-medium tracking-wider text-[#C08B4F] bg-[#C08B4F]/10 px-1.5 py-0.5 rounded-[2px]">
              {ticket.transportType || 'BUS'}
            </span>

            {/* Route Name (Lora 16px) */}
            <h4 className="font-serif text-base text-[#111111] font-semibold leading-snug mt-1 truncate">
              {ticket.source} <span className="text-[#8B4A3D] mx-1">➔</span> {ticket.destination}
            </h4>
          </div>
        </div>

        {/* Price (DM Mono 18px #111111) */}
        <div className="text-right shrink-0">
          <span className="font-mono text-lg font-bold text-[#111111]">
            {ticket.price}
          </span>
        </div>
      </div>

      {/* Dashed Separator Line */}
      <div className="w-full border-t border-dashed border-[#E5DDC9] my-3" />

      {/* Date/Time and Status */}
      <div className="flex justify-between items-center text-xs">
        {/* Date/Time (DM Sans 12px #6B5F52) */}
        <span className="font-sans text-xs text-[#6B5F52]">
          {ticket.dateTime}
        </span>

        {/* Status (DM Sans 11px uppercase #8B4A3D) */}
        <span className="font-sans text-[11px] uppercase font-semibold tracking-wider text-[#8B4A3D] bg-[#8B4A3D]/10 px-2 py-0.5 rounded-[2px]">
          {ticket.status}
        </span>
      </div>
    </div>
  );
};

export default TicketCard;
