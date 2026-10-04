import React, { useState, useEffect } from 'react';
import { QrCodeIcon, CloseIcon, CheckIcon } from './CustomIcons';

interface QrScannerOverlayProps {
  onClose: () => void;
  onSuccess?: (codeData: string) => void;
}

export const QrScannerOverlay: React.FC<QrScannerOverlayProps> = ({ onClose, onSuccess }) => {
  const [scanState, setScanState] = useState<'scanning' | 'success'>('scanning');
  const [ticketValidated, setTicketValidated] = useState(false);

  // Simulate automatic detection after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setScanState('success');
      setTicketValidated(true);
      if (onSuccess) {
        onSuccess('MTC-BUS-QR-VERIFIED-7782');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/90 backdrop-blur-xs flex flex-col justify-between p-6 select-none">
      {/* Top Header */}
      <div className="flex justify-between items-center z-10">
        <div>
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C08B4F]">
            CHENNAI ONE SCANNER
          </span>
          <h2 className="font-display text-2xl text-[#F2EBDC] font-bold">Bus & Metro QR Scanner</h2>
        </div>

        <button
          onClick={onClose}
          className="p-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-[2px] text-[#F2EBDC] hover:bg-[#2A2A2A] transition-colors"
          aria-label="Close Scanner"
        >
          <CloseIcon className="w-5 h-5 text-[#F2EBDC]" color="#F2EBDC" />
        </button>
      </div>

      {/* Center Scanner Frame */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto relative">
        {scanState === 'scanning' ? (
          <div className="relative w-64 h-64 border-2 border-[#C08B4F] rounded-[2px] p-4 flex flex-col items-center justify-center bg-[#1A1A1A]/50">
            {/* Corner Bracket Accents */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#C08B4F]" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#C08B4F]" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#C08B4F]" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#C08B4F]" />

            {/* Scanning Laser Sweep Animation */}
            <div className="absolute inset-x-0 top-0 h-1 bg-[#C08B4F] animate-[bounce_2s_infinite] opacity-80" />

            <QrCodeIcon className="w-16 h-16 text-[#A89984] animate-pulse" color="#A89984" />
            <p className="font-serif text-xs text-[#A89984] mt-4 text-center">
              Align conductor or bus QR code within frame
            </p>
          </div>
        ) : (
          <div className="w-64 h-64 bg-[#1A1A1A] border-2 border-[#C08B4F] rounded-[2px] p-6 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-12 h-12 bg-[#C08B4F] text-[#111111] rounded-full flex items-center justify-center">
              <CheckIcon className="w-6 h-6 text-[#111111]" color="#111111" />
            </div>

            <h3 className="font-display text-2xl text-[#F2EBDC] font-bold">Scan Successful!</h3>
            <p className="font-serif text-xs text-[#A89984]">
              Ticket Verified: Route 21G (Broadway ➔ Tambaram)
            </p>
            <span className="font-sans text-[10px] uppercase font-semibold text-[#111111] bg-[#C08B4F] px-2 py-0.5 rounded-[2px]">
              Fare Deducted: ₹15
            </span>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="z-10 space-y-3 text-center">
        {scanState === 'success' ? (
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#C08B4F] text-[#111111] font-sans text-xs uppercase tracking-wider font-semibold rounded-[2px] hover:bg-[#a87236] transition-colors"
          >
            Done & View Ticket
          </button>
        ) : (
          <p className="font-serif text-xs text-[#6B5F52]">
            Simulating live QR scanning... Camera active.
          </p>
        )}
      </div>
    </div>
  );
};

export default QrScannerOverlay;
