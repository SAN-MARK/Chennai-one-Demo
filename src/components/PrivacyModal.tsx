import React from 'react';
import { CloseIcon } from './CustomIcons';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#F2EBDC] text-[#111111] border border-[#E5DDC9] rounded-[2px] max-w-[440px] w-full max-h-[85vh] flex flex-col p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-[#E5DDC9] pb-3">
          <h2 className="font-display text-2xl font-bold">Privacy Policy</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#E5DDC9] rounded-[2px] transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5 text-[#111111]" color="#111111" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 font-serif text-xs text-[#3A2B18] pr-2">
          <p className="font-bold">1. Information We Collect</p>
          <p>
            Chennai One collects phone numbers, verified identity credentials, location data (when location permission is granted), and transit booking history solely to facilitate public transit services across Chennai.
          </p>

          <p className="font-bold">2. How Location Data Is Used</p>
          <p>
            Location data is utilized to detect nearby bus stops, calculate distance-based fares, and display real-time live ETA for MTC buses and Chennai Metro trains. Your location is never sold to third-party advertisers.
          </p>

          <p className="font-bold">3. Data Security</p>
          <p>
            All account records, tokenized pass keys, and audit logs are transmitted via encrypted TLS 1.3 tunnels and stored on secure database ledgers with strict role access policies.
          </p>

          <p className="font-bold">4. Your Rights</p>
          <p>
            You may request account deletion or export your travel history at any time from your Profile settings page.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#C08B4F] text-[#111111] font-sans text-xs uppercase tracking-wider font-semibold rounded-[2px] hover:bg-[#a87236] transition-colors mt-2"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};

export default PrivacyModal;
