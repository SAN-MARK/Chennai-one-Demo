import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ChevronDownIcon, LocationIcon } from './CustomIcons';

interface OnboardingStepperProps {
  onComplete: (userPhone: string, userName: string) => void;
  onOpenTerms?: () => void;
}

export const OnboardingStepper: React.FC<OnboardingStepperProps> = ({ onComplete, onOpenTerms }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState('9042999788');
  const [otp, setOtp] = useState(['5', '8', '2', '0']);
  const [language, setLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    let interval: any;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep(2);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (/^\d*$/.test(val) && val.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = val;
      setOtp(newOtp);

      // Auto-focus next field
      if (val && index < 3) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const isPhoneValid = phone.trim().length >= 10;
  const isOtpValid = otp.every((d) => d !== '');

  const languages = ['English', 'Tamil (தமிழ்)', 'Hindi (हिंदी)', 'Telugu (తెలుగు)'];

  return (
    <div className="min-h-screen bg-[#F2EBDC] text-[#111111] flex flex-col justify-between p-6 select-none font-serif relative">
      {/* Top Header & Progress */}
      {step < 3 && (
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (step === 2) setStep(1);
              }}
              className={`p-2 rounded-[2px] border border-[#E5DDC9] hover:bg-[#E5DDC9] transition-colors ${
                step === 1 ? 'opacity-30 pointer-events-none' : ''
              }`}
              aria-label="Back"
            >
              <ArrowLeftIcon className="w-5 h-5 text-[#111111]" color="#111111" />
            </button>

            {/* Progress Bar */}
            <div className="flex-1 max-w-[180px] mx-4 h-1 bg-[#E5DDC9] rounded-[2px] overflow-hidden">
              <div
                className="h-full bg-[#C08B4F] transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <span className="font-sans text-xs font-semibold text-[#6B5F52]">
              {step}/3
            </span>
          </div>

          <h1 className="font-display text-[32px] text-[#111111] font-semibold leading-tight mt-4">
            Let's get you trip-ready!
          </h1>
        </div>
      )}

      {/* STEP 1: Phone Number */}
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-between mt-6">
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            {/* Card */}
            <div className="bg-[#F2EBDC] border border-[#E5DDC9] p-6 rounded-[2px] space-y-4 shadow-sm">
              <label className="block font-sans text-xs font-semibold uppercase tracking-wider text-[#111111]">
                Enter your Mobile Number
              </label>

              {/* Input Row */}
              <div className="flex gap-3">
                {/* Indian Flag + +91 */}
                <div className="bg-transparent border border-[#111111] p-2 px-3 rounded-[2px] flex items-center gap-2 shrink-0">
                  <span className="text-base">🇮🇳</span>
                  <span className="font-sans text-sm font-semibold text-[#111111]">+91</span>
                </div>

                {/* Field */}
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="flex-1 bg-transparent border border-[#111111] p-2 px-3 rounded-[2px] font-sans text-sm text-[#111111] placeholder-[#6B5F52] focus:outline-none focus:border-[#C08B4F]"
                />
              </div>
            </div>

            {/* Footer T&Cs */}
            <p className="font-serif text-xs text-[#6B5F52] text-center">
              By clicking Continue, you agree to our{' '}
              <button
                type="button"
                onClick={onOpenTerms}
                className="underline text-[#111111] hover:text-[#C08B4F] cursor-pointer"
              >
                T&Cs
              </button>
            </p>

            {/* Language Selector */}
            <div className="relative flex justify-center">
              <button
                type="button"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="font-sans text-xs text-[#111111] flex items-center gap-1 hover:text-[#C08B4F] cursor-pointer"
              >
                <span>Language: {language}</span>
                <ChevronDownIcon className="w-3 h-3 text-[#111111]" color="#111111" />
              </button>

              {showLanguageDropdown && (
                <div className="absolute bottom-6 bg-[#F2EBDC] border border-[#E5DDC9] rounded-[2px] shadow-lg py-1 w-40 z-20">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.split(' ')[0]);
                        setShowLanguageDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 font-sans text-xs text-[#111111] hover:bg-[#E5DDC9]"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>

          <button
            type="button"
            disabled={!isPhoneValid}
            onClick={() => setStep(2)}
            className={`w-full py-3.5 font-sans text-xs uppercase tracking-wider font-semibold rounded-[2px] transition-colors mt-auto ${
              isPhoneValid
                ? 'bg-[#C08B4F] text-[#111111] cursor-pointer hover:bg-[#a87236]'
                : 'bg-[#E5DDC9] text-[#6B5F52] cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {/* STEP 2: OTP Verification */}
      {step === 2 && (
        <div className="flex-1 flex flex-col justify-between mt-6">
          <div className="space-y-6">
            {/* Card */}
            <div className="bg-[#F2EBDC] border border-[#E5DDC9] p-6 rounded-[2px] space-y-4">
              <p className="font-sans text-xs text-[#111111]">
                OTP sent to +91 {phone || '9042999788'}
              </p>

              {/* 4 OTP Input Boxes */}
              <div className="flex justify-between gap-3 my-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-14 h-14 bg-transparent border border-[#111111] rounded-[2px] text-center font-mono text-xl text-[#111111] focus:outline-none focus:border-[#C08B4F]"
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="flex justify-between items-center">
                <span className="font-sans text-xs text-[#6B5F52]">
                  Resend OTP ({timer > 0 ? timer : '0'})
                </span>
                {timer === 0 && (
                  <button
                    onClick={() => setTimer(30)}
                    className="font-sans text-xs text-[#C08B4F] uppercase tracking-wider font-semibold cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={!isOtpValid}
            onClick={() => setStep(3)}
            className={`w-full py-3.5 font-sans text-xs uppercase tracking-wider font-semibold rounded-[2px] transition-colors mt-auto ${
              isOtpValid
                ? 'bg-[#C08B4F] text-[#111111] cursor-pointer hover:bg-[#a87236]'
                : 'bg-[#E5DDC9] text-[#6B5F52] cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      )}

      {/* STEP 3: Location Permission Modal */}
      {step === 3 && (
        <div className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-xs flex items-center justify-center p-6">
          <div className="bg-[#F2EBDC] border border-[#E5DDC9] p-8 rounded-[2px] max-w-[400px] w-full space-y-6 shadow-2xl text-left">
            <div className="w-12 h-12 bg-[#C08B4F]/20 rounded-[2px] border border-[#C08B4F] flex items-center justify-center">
              <LocationIcon className="w-6 h-6 text-[#C08B4F]" color="#C08B4F" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-[#111111] leading-snug">
                Hey SANJEEV, Welcome to Chennai One!
              </h2>
              <p className="font-serif text-sm text-[#6B5F52] leading-relaxed">
                To start booking rides, please allow us to find you by providing location access.
              </p>
            </div>

            <button
              onClick={() => onComplete(phone, 'SANJEEV')}
              className="w-full py-3.5 bg-[#C08B4F] text-[#111111] font-sans text-xs uppercase tracking-wider font-semibold rounded-[2px] hover:bg-[#a87236] transition-colors cursor-pointer"
            >
              Grant Location Access
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingStepper;
