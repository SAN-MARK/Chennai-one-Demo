import React, { useState } from 'react';
import { QrCodeIcon, RefreshIcon, CheckIcon } from './CustomIcons';

export interface PassDetails {
  id: string;
  passType: string;
  validity: string;
  routes: string;
  passId: string;
  price: string;
  status: 'Active' | 'Expired';
}

interface PassCardProps {
  pass?: PassDetails;
  onRenewClick?: () => void;
  onHistoryClick?: () => void;
  onAddPassClick?: () => void;
}

export const PassCard: React.FC<PassCardProps> = ({
  pass = {
    id: 'pass-01',
    passType: 'Monthly Metro Pass',
    validity: 'Oct 1 - Oct 31, 2026',
    routes: 'All MRTS & Metro Lines',
    passId: 'CHN-METRO-9921',
    price: '₹1000',
    status: 'Active'
  },
  onRenewClick,
  onHistoryClick,
  onAddPassClick
}) => {
  const [isQrZoomed, setIsQrZoomed] = useState(false);

  return (
    <div className="flex flex-col items-center w-full my-2">
      {/* Digital Pass Card (320px x 480px, bg #111111, border 1px #C08B4F, radius 2px) */}
      <div 
        className="w-[320px] h-[480px] bg-[#111111] border border-[#C08B4F] rounded-[2px] p-6 flex flex-col justify-between relative shadow-lg select-none"
        style={{
          boxShadow: '0 0 0 1px #C08B4F inset'
        }}
      >
        {/* Top Branding */}
        <div className="flex justify-between items-start border-b border-[#2A2A2A] pb-3">
          <div>
            <h2 className="font-sans font-semibold text-xs tracking-[0.25em] text-[#C08B4F] uppercase">
              CHENNAI ONE
            </h2>
            <p className="font-serif text-[11px] text-[#A89984] mt-0.5">Official Transit Pass</p>
          </div>
          <span className="font-sans text-[9px] uppercase tracking-wider font-semibold bg-[#2A2A2A] text-[#C08B4F] px-2 py-0.5 rounded-[2px] border border-[#C08B4F]/30">
            {pass.status}
          </span>
        </div>

        {/* Middle: 160x160px Custom Fine-Line QR Code Graphic */}
        <div className="flex flex-col items-center justify-center my-auto py-2">
          <button
            onClick={() => setIsQrZoomed(true)}
            className="w-[160px] h-[160px] bg-[#1A1A1A] border border-[#C08B4F]/50 p-2 rounded-[2px] flex items-center justify-center cursor-pointer hover:border-[#C08B4F] transition-colors relative group"
            title="Tap to enlarge QR Code"
          >
            {/* Custom fine-line SVG QR code simulation */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#F2EBDC]" fill="currentColor">
              {/* Finder Top-Left */}
              <rect x="5" y="5" width="25" height="25" fill="none" stroke="#C08B4F" strokeWidth="2" />
              <rect x="10" y="10" width="15" height="15" fill="#C08B4F" />
              {/* Finder Top-Right */}
              <rect x="70" y="5" width="25" height="25" fill="none" stroke="#C08B4F" strokeWidth="2" />
              <rect x="75" y="10" width="15" height="15" fill="#C08B4F" />
              {/* Finder Bottom-Left */}
              <rect x="5" y="70" width="25" height="25" fill="none" stroke="#C08B4F" strokeWidth="2" />
              <rect x="10" y="75" width="15" height="15" fill="#C08B4F" />

              {/* Fine Grid matrix simulation */}
              <rect x="35" y="10" width="8" height="8" fill="#F2EBDC" />
              <rect x="48" y="5" width="12" height="6" fill="#A89984" />
              <rect x="38" y="22" width="10" height="10" fill="#F2EBDC" />

              <rect x="35" y="40" width="12" height="12" fill="#C08B4F" />
              <rect x="52" y="35" width="8" height="18" fill="#F2EBDC" />
              <rect x="65" y="42" width="10" height="10" fill="#A89984" />

              <rect x="5" y="40" width="12" height="8" fill="#A89984" />
              <rect x="20" y="42" width="8" height="12" fill="#F2EBDC" />

              <rect x="40" y="70" width="10" height="10" fill="#F2EBDC" />
              <rect x="55" y="75" width="15" height="8" fill="#C08B4F" />
              <rect x="75" y="70" width="12" height="12" fill="#F2EBDC" />
              <rect x="72" y="86" width="18" height="8" fill="#A89984" />
            </svg>

            <span className="absolute bottom-1 right-1 text-[8px] font-sans text-[#C08B4F] uppercase tracking-wider bg-[#111111]/90 px-1 border border-[#C08B4F]/30 opacity-0 group-hover:opacity-100 transition-opacity">
              Zoom
            </span>
          </button>
          <p className="font-sans text-[10px] uppercase tracking-wider text-[#A89984] mt-2">
            Tap QR to scan / verify
          </p>
        </div>

        {/* Details Section */}
        <div className="space-y-2 border-t border-[#2A2A2A] pt-3 text-left">
          <div>
            <span className="font-sans text-[9px] uppercase tracking-widest text-[#6B5F52]">Pass Type</span>
            <p className="font-display text-lg text-[#F2EBDC] font-semibold leading-tight">{pass.passType}</p>
          </div>

          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#6B5F52]">Validity</span>
              <p className="font-serif text-sm text-[#F2EBDC]">{pass.validity}</p>
            </div>
            <div className="text-right">
              <span className="font-sans text-[9px] uppercase tracking-widest text-[#6B5F52]">Fare</span>
              <p className="font-mono text-sm text-[#C08B4F] font-bold">{pass.price}</p>
            </div>
          </div>

          <div>
            <span className="font-sans text-[9px] uppercase tracking-widest text-[#6B5F52]">Routes Covered</span>
            <p className="font-serif text-xs text-[#A89984]">{pass.routes}</p>
          </div>
        </div>

        {/* Bottom Barcode Graphic + Pass ID */}
        <div className="border-t border-[#2A2A2A] pt-3 flex flex-col items-center gap-1.5">
          {/* Custom SVG Barcode with thin vertical lines */}
          <div className="w-full h-7 flex items-center justify-between px-1 bg-[#1A1A1A] border border-[#2A2A2A]">
            {Array.from({ length: 42 }).map((_, i) => (
              <div 
                key={i} 
                className="h-5 bg-[#F2EBDC]" 
                style={{ width: i % 3 === 0 ? '3px' : i % 5 === 0 ? '1px' : '2px', opacity: i % 7 === 0 ? 0.3 : 0.9 }}
              />
            ))}
          </div>
          <p className="font-mono text-xs tracking-wider text-[#C08B4F] uppercase">
            Pass ID: {pass.passId}
          </p>
        </div>
      </div>

      {/* Action Row below the card (Strict: DM Sans, 12px, uppercase, bg transparent, border 1px #111111) */}
      <div className="w-full max-w-[320px] flex flex-wrap gap-2 mt-4">
        <button
          onClick={onRenewClick}
          className="flex-1 py-2.5 px-3 bg-transparent border border-[#111111] text-[#111111] font-sans font-semibold text-[11px] uppercase tracking-wider rounded-[2px] hover:bg-[#111111] hover:text-[#F2EBDC] transition-colors cursor-pointer text-center"
        >
          Renew Pass
        </button>

        <button
          onClick={onHistoryClick}
          className="flex-1 py-2.5 px-3 bg-transparent border border-[#111111] text-[#111111] font-sans font-semibold text-[11px] uppercase tracking-wider rounded-[2px] hover:bg-[#111111] hover:text-[#F2EBDC] transition-colors cursor-pointer text-center"
        >
          View History
        </button>

        <button
          onClick={onAddPassClick}
          className="w-full py-2.5 px-3 bg-[#C08B4F] border border-[#A87236] text-[#111111] font-sans font-semibold text-[11px] uppercase tracking-wider rounded-[2px] hover:bg-[#a87236] transition-colors cursor-pointer text-center"
        >
          Add New Pass
        </button>
      </div>

      {/* Zoomed QR Modal */}
      {isQrZoomed && (
        <div 
          onClick={() => setIsQrZoomed(false)}
          className="fixed inset-0 z-50 bg-[#111111]/90 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#111111] border border-[#C08B4F] p-6 rounded-[2px] max-w-[340px] w-full flex flex-col items-center space-y-4"
          >
            <div className="text-center">
              <h3 className="font-display text-2xl text-[#F2EBDC]">Pass Verification QR</h3>
              <p className="font-sans text-xs text-[#A89984] uppercase tracking-wider mt-1">{pass.passId}</p>
            </div>

            <div className="w-[220px] h-[220px] bg-[#1A1A1A] p-4 border border-[#C08B4F]">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#F2EBDC]" fill="currentColor">
                <rect x="5" y="5" width="25" height="25" fill="none" stroke="#C08B4F" strokeWidth="2" />
                <rect x="10" y="10" width="15" height="15" fill="#C08B4F" />
                <rect x="70" y="5" width="25" height="25" fill="none" stroke="#C08B4F" strokeWidth="2" />
                <rect x="75" y="10" width="15" height="15" fill="#C08B4F" />
                <rect x="5" y="70" width="25" height="25" fill="none" stroke="#C08B4F" strokeWidth="2" />
                <rect x="10" y="75" width="15" height="15" fill="#C08B4F" />
                <rect x="35" y="10" width="8" height="8" fill="#F2EBDC" />
                <rect x="48" y="5" width="12" height="6" fill="#A89984" />
                <rect x="38" y="22" width="10" height="10" fill="#F2EBDC" />
                <rect x="35" y="40" width="12" height="12" fill="#C08B4F" />
                <rect x="52" y="35" width="8" height="18" fill="#F2EBDC" />
                <rect x="65" y="42" width="10" height="10" fill="#A89984" />
                <rect x="5" y="40" width="12" height="8" fill="#A89984" />
                <rect x="20" y="42" width="8" height="12" fill="#F2EBDC" />
                <rect x="40" y="70" width="10" height="10" fill="#F2EBDC" />
                <rect x="55" y="75" width="15" height="8" fill="#C08B4F" />
                <rect x="75" y="70" width="12" height="12" fill="#F2EBDC" />
              </svg>
            </div>

            <p className="font-serif text-xs text-center text-[#A89984]">
              Scan using official MTC or CMRL verifier device
            </p>

            <button
              onClick={() => setIsQrZoomed(false)}
              className="w-full py-2.5 bg-[#C08B4F] text-[#111111] font-sans text-xs uppercase tracking-wider font-semibold rounded-[2px]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassCard;
