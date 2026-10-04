import React, { useState } from 'react';
import { CloseIcon, CheckIcon } from './CustomIcons';

interface RenewPassModalProps {
  onClose: () => void;
  onRenewSuccess: (newPassType: string, newValidity: string) => void;
}

export const RenewPassModal: React.FC<RenewPassModalProps> = ({ onClose, onRenewSuccess }) => {
  const [passType, setPassType] = useState('Monthly Metro Pass');
  const [duration, setDuration] = useState('1 Month (₹1000)');
  const [paymentMethod, setPaymentMethod] = useState('UPI / GPay');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRenewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onRenewSuccess(passType, 'Nov 1 - Nov 30, 2026');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111111]/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#F2EBDC] text-[#111111] border border-[#E5DDC9] rounded-[2px] max-w-[420px] w-full p-6 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-[#E5DDC9] pb-3">
          <div>
            <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-[#C08B4F]">
              CHENNAI ONE PASS PORTAL
            </span>
            <h2 className="font-display text-2xl font-bold text-[#111111]">Renew Transit Pass</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[#E5DDC9] rounded-[2px] transition-colors"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5 text-[#111111]" color="#111111" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleRenewSubmit} className="space-y-4 font-serif text-xs">
            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#6B5F52] mb-1">
                Select Pass Category
              </label>
              <select
                value={passType}
                onChange={(e) => setPassType(e.target.value)}
                className="w-full bg-[#111111] text-[#F2EBDC] border border-[#2A2A2A] rounded-[2px] p-2.5 font-serif text-sm focus:outline-none focus:border-[#C08B4F]"
              >
                <option value="Monthly Metro Pass">Monthly Metro Pass (₹1000)</option>
                <option value="MTC General Express Monthly Pass">MTC General Express Monthly Pass (₹1000)</option>
                <option value="Suburban Railway Monthly Season Pass">Suburban Railway Monthly Pass (₹450)</option>
                <option value="All-Transit Combo Pass">All-Transit CUMTA Combo Pass (₹1500)</option>
              </select>
            </div>

            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#6B5F52] mb-1">
                Validity Period
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-[#111111] text-[#F2EBDC] border border-[#2A2A2A] rounded-[2px] p-2.5 font-serif text-sm focus:outline-none focus:border-[#C08B4F]"
              >
                <option value="1 Month (₹1000)">1 Month (Nov 1 - Nov 30, 2026)</option>
                <option value="3 Months (₹2800)">3 Months (Nov 1 - Jan 31, 2027)</option>
              </select>
            </div>

            <div>
              <label className="block font-sans text-[11px] font-semibold uppercase tracking-wider text-[#6B5F52] mb-1">
                Payment Option
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['UPI / GPay', 'Chennai One Wallet', 'Net Banking', 'Credit/Debit Card'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 px-3 border rounded-[2px] font-sans text-xs font-medium text-left transition-colors ${
                      paymentMethod === method
                        ? 'bg-[#111111] text-[#C08B4F] border-[#111111]'
                        : 'bg-transparent text-[#111111] border-[#E5DDC9] hover:bg-[#E5DDC9]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#C08B4F] text-[#111111] font-sans text-xs uppercase tracking-wider font-semibold rounded-[2px] hover:bg-[#a87236] transition-colors mt-2"
            >
              Confirm & Pay {duration.split(' ')[2] || '₹1000'}
            </button>
          </form>
        ) : (
          <div className="py-8 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="w-12 h-12 bg-[#C08B4F] text-[#111111] rounded-full flex items-center justify-center">
              <CheckIcon className="w-6 h-6 text-[#111111]" color="#111111" />
            </div>
            <h3 className="font-display text-2xl text-[#111111] font-bold">Pass Renewed Successfully!</h3>
            <p className="font-serif text-xs text-[#6B5F52]">
              New Validity: Nov 1 - Nov 30, 2026. Updated in your Digital Pass Wallet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RenewPassModal;
