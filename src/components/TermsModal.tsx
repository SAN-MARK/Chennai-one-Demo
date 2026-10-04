import React from 'react';
import { CloseIcon } from './CustomIcons';

interface TermsModalProps {
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#F2EBDC] text-[#111111] border border-[#E5DDC9] rounded-[2px] max-w-[440px] w-full max-h-[85vh] flex flex-col p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-[#E5DDC9] pb-3">
          <h2 className="font-display text-2xl font-bold">Terms of Service</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#E5DDC9] rounded-[2px] transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5 text-[#111111]" color="#111111" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 font-serif text-xs text-[#3A2B18] pr-2">
          <p className="font-bold">1. Acceptance of Terms</p>
          <p>
            By accessing and using the Chennai One transit platform, you agree to be bound by these Terms of Service and all applicable transit regulations issued by CUMTA, MTC, CMRL, and Southern Railways.
          </p>

          <p className="font-bold">2. Digital Pass & Ticket Rules</p>
          <p>
            Transit passes and single-journey tickets purchased via Chennai One are strictly non-transferable. Digital tickets must be produced upon demand along with valid government-issued photo identity verification.
          </p>

          <p className="font-bold">3. Verification & Compliance</p>
          <p>
            Inspectors and ticket checking personnel reserve the right to scan security QR codes. Any attempt to modify, alter, or falsify ticket barcodes or passes will result in cancellation without refund and potential fines under Railway / Motor Vehicles Acts.
          </p>

          <p className="font-bold">4. Wallet & Payments</p>
          <p>
            Payments made for monthly passes, daily passes, or ticket fare deductions are processed securely. Unused pass amounts are refundable in accordance with CUMTA fare policies.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#C08B4F] text-[#111111] font-sans text-xs uppercase tracking-wider font-semibold rounded-[2px] hover:bg-[#a87236] transition-colors mt-2"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
};

export default TermsModal;
