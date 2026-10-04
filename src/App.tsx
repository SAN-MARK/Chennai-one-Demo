import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  CreditCard, 
  Radio, 
  Ticket, 
  User, 
  Phone, 
  Clock, 
  Bus, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  RotateCcw, 
  QrCode, 
  Wifi, 
  WifiOff,
  Battery, 
  Sliders, 
  Database,
  ArrowUpDown,
  Mail,
  X,
  Calendar,
  Camera,
  Upload,
  Wallet,
  Search,
  Train
} from 'lucide-react';
import { MtcPass, UserProfile, TabType, IdType, WalletTransaction } from './types';
import { INITIAL_USER, INITIAL_PASS, CHENNAI_ROUTES } from './data';
import PassCard from './components/PassCard';
import PassForm from './components/PassForm';
import LiveMap from './components/LiveMap';
import TicketSimulator from './components/TicketSimulator';
import ProfileTab from './components/ProfileTab';
import HistoryLogs from './components/HistoryLogs';
import HelpSupport from './components/HelpSupport';
import WalletTab from './components/WalletTab';
import QrScannerOverlay from './components/QrScannerOverlay';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('findback_logged_in') === 'true';
  });

  const [loginStep, setLoginStep] = useState<'splash' | 'mobile' | 'otp'>('splash');
  const [mobileInput, setMobileInput] = useState('9042999788');
  const [otpDigits, setOtpDigits] = useState(['9', '0', '4', '2']);
  const [locationGranted, setLocationGranted] = useState(false);

  const [loginName, setLoginName] = useState('SANJEEV');
  const [loginMobile, setLoginMobile] = useState('9042999788');
  const [loginAadhaar, setLoginAadhaar] = useState('1234-5678-9012');
  const [loginEmail, setLoginEmail] = useState('iamheresanjeev@gmail.com');

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('findback_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [pass, setPass] = useState<MtcPass>(() => {
    const saved = localStorage.getItem('findback_pass');
    return saved ? JSON.parse(saved) : INITIAL_PASS;
  });
  const [activeTab, setActiveTab] = useState<TabType>('passes');
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return localStorage.getItem('findback_offline') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('findback_offline', isOffline ? 'true' : 'false');
  }, [isOffline]);

  useEffect(() => {
    localStorage.setItem('findback_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('findback_pass', JSON.stringify(pass));
  }, [pass]);

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^\d]/g, '').slice(0, 12);
    let formatted = '';
    for (let i = 0; i < rawVal.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += '-';
      }
      formatted += rawVal[i];
    }
    setLoginAadhaar(formatted);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName || !loginMobile || !loginAadhaar || !loginEmail) return;

    // 1. Update user profile details
    const updatedUser: UserProfile = {
      ...user,
      name: loginName,
      phone: loginMobile,
      email: loginEmail,
      role: 'OWNER'
    };
    setUser(updatedUser);
    localStorage.setItem('findback_user', JSON.stringify(updatedUser));

    // 2. Update pass holder name and properties
    const updatedPass: MtcPass = {
      ...pass,
      name: loginName,
      status: 'Active'
    };
    setPass(updatedPass);
    localStorage.setItem('findback_pass', JSON.stringify(updatedPass));

    // 3. Set the Aadhaar identity verification entry
    const updatedIdVerification = {
      idType: 'Aadhaar' as IdType,
      idNumber: loginAadhaar,
      status: 'Verified' as const,
      reviewNotes: 'Authenticated profile successfully validated through FindBack KYC gateway.'
    };
    localStorage.setItem('findback_id_verification', JSON.stringify(updatedIdVerification));

    // 4. Mark as logged in
    setIsLoggedIn(true);
    localStorage.setItem('findback_logged_in', 'true');

    // 5. Navigate to passes screen
    setActiveTab('passes');
  };

  const handleLogout = () => {
    localStorage.removeItem('findback_logged_in');
    localStorage.removeItem('findback_user');
    localStorage.removeItem('findback_pass');
    localStorage.removeItem('findback_id_verification');

    setUser(INITIAL_USER);
    setPass(INITIAL_PASS);
    setIsLoggedIn(false);
    setActiveTab('passes');

    // Reset input fields
    setLoginName('');
    setLoginMobile('');
    setLoginAadhaar('');
    setLoginEmail('');
  };

  // Modular screen/form display states
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [renewDate, setRenewDate] = useState('01/09/2026');
  const [renewPhotoUrl, setRenewPhotoUrl] = useState('');
  const [renewError, setRenewError] = useState<string | null>(null);

  // e-Wallet states
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('findback_wallet_balance');
    return saved ? parseFloat(saved) : 1500;
  });

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    const saved = localStorage.getItem('findback_wallet_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        id: 'tx-initial',
        type: 'Top Up',
        amount: 1500,
        timestamp: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN', { hour12: false }),
        description: 'Welcome Bonus Credited'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('findback_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('findback_wallet_transactions', JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  // Live clock in the phone header
  const [phoneClock, setPhoneClock] = useState<string>('13:26');

  // Trip planner state (Home Tab)
  const [plannerSource, setPlannerSource] = useState('Chennai Central');
  const [plannerDest, setPlannerDest] = useState('Adyar');
  const [plannerResult, setPlannerResult] = useState<any | null>(null);

  // Quick renewed animation states
  const [showRenewalBanner, setShowRenewalBanner] = useState(false);

  useEffect(() => {
    // Local device hour tracking for top bar
    const updateTime = () => {
      const now = new Date();
      setPhoneClock(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRenewPass = () => {
    setRenewDate(pass.validTo || '01/09/2026');
    setRenewPhotoUrl(pass.photoUrl || '');
    setRenewError(null);
    setShowRenewDialog(true);
  };

  const handleRouteSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (plannerSource === plannerDest) {
      setPlannerResult({ error: 'Source and Destination cannot be identical.' });
      return;
    }
    
    // Find matching route from CHENNAI_ROUTES
    const matchedRoute = CHENNAI_ROUTES.find(r => 
      r.stops.includes(plannerSource) && r.stops.includes(plannerDest)
    );

    if (matchedRoute) {
      setPlannerResult({
        routeNo: matchedRoute.routeNumber,
        color: matchedRoute.color,
        source: matchedRoute.source,
        destination: matchedRoute.destination,
        activeBuses: matchedRoute.activeBuses,
        stopsCount: Math.abs(matchedRoute.stops.indexOf(plannerSource) - matchedRoute.stops.indexOf(plannerDest)),
        fare: Math.round(Math.abs(matchedRoute.stops.indexOf(plannerSource) - matchedRoute.stops.indexOf(plannerDest)) * 5 + 10)
      });
    } else {
      setPlannerResult({
        error: 'No direct MTC route matches this stop pairing. Consider transferring via Adyar or Guindy.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col items-center justify-center p-0 md:p-6 select-none overflow-hidden" id="mtc-root-canvas">
      
      {/* Background radial art for desktop framing layout */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(243,202,82,0.04)_0%,_transparent_60%)] pointer-events-none" />

      {/* Main Responsive Grid layout (Desktop sidebar + Centered mobile canvas frame) */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10" id="main-grid-frame">
        
        {/* Left Side: Simulation Informational Deck (Visible ONLY on wider footprints) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col space-y-5 pr-4 animate-[fadeIn_0.5s_ease]" id="desktop-control-deck">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-amber-500/15 text-amber-400 font-extrabold px-2.5 py-1 rounded-full border border-amber-500/30">
                Simulation Mode
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2 py-1 rounded-full">
                Classic Slate Theme
              </span>
            </div>
            <h1 className="text-3xl font-display font-black text-white leading-tight">
              MTC Chennai <br />Pass Simulator
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience Chennai's digital transit grid interface. Fully interactive simulation of monthly passes, GPS bus maps, ticket booking, and Hub Operator privileges with strict masking controls.
            </p>
          </div>

          {/* Quick Simulation controls widget */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-amber-500" />
              Developer Controls
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setShowConfigurator(true)}
                className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition-all"
              >
                <span className="text-[9px] text-slate-500 block font-bold uppercase">Pass Body</span>
                <span className="text-xs text-slate-200 font-bold">Configure Card</span>
              </button>

              <button 
                onClick={handleRenewPass}
                className="py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left transition-all"
              >
                <span className="text-[9px] text-slate-500 block font-bold uppercase">Quick Reset</span>
                <span className="text-xs text-slate-200 font-bold">Renew Pass</span>
              </button>
            </div>

            {/* Offline Simulation toggle */}
            <button 
              onClick={() => setIsOffline(prev => !prev)}
              className={`w-full py-2.5 px-3 rounded-xl border text-left transition-all flex justify-between items-center cursor-pointer ${
                isOffline 
                  ? 'bg-rose-950/20 border-rose-900/40 text-rose-200 hover:bg-rose-950/30' 
                  : 'bg-emerald-950/20 border-emerald-900/30 text-emerald-200 hover:bg-emerald-950/30'
              }`}
            >
              <div>
                <span className="text-[9px] text-slate-400 block font-bold uppercase">Network Simulator</span>
                <span className="text-xs font-bold">
                  {isOffline ? 'Offline Cache-First' : 'Online API Syncing'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {isOffline ? (
                  <WifiOff className="w-4 h-4 text-rose-400 animate-pulse" />
                ) : (
                  <Wifi className="w-4 h-4 text-emerald-400" />
                )}
                <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              </div>
            </button>

            <button 
              onClick={handleLogout}
              className="w-full mt-1.5 py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-900/40 text-left transition-all flex justify-between items-center cursor-pointer"
            >
              <div>
                <span className="text-[9px] text-rose-400 block font-bold uppercase">Simulation Session</span>
                <span className="text-xs text-rose-200 font-bold">Reset App / Sign Out</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">CLEAR</span>
            </button>

            <div className="text-[10px] text-slate-500 flex items-center gap-1.5 pt-1">
              <Database className="w-3.5 h-3.5 text-blue-500" />
              <span>Durable state handled via React Context simulation.</span>
            </div>
          </div>

          {/* Footer credentials */}
          <div className="text-[10px] text-slate-500 space-y-1 font-mono">
            <p>User Account: {user.email}</p>
            <p>Security Node: ACTIVE (TLS 1.3)</p>
          </div>
        </div>

        {/* Center: The Core Hybrid Native Mobile Simulator Sandbox Container */}
        {/* Enforces restricted viewport maximum width of 480px, centered beautifully */}
        <div 
          className="col-span-1 lg:col-span-4 flex justify-center w-full"
          id="sandbox-viewport-container"
        >
          <div 
            className="relative w-full max-w-[480px] h-[100vh] md:h-[840px] bg-slate-950 md:rounded-[48px] overflow-hidden shadow-2xl md:border-8 md:border-slate-800 flex flex-col text-white"
            id="smartphone-bezel-frame"
          >
            {/* Top Smartphone Camera Notch element (Mock Bezel details for realism) */}
            <div className="absolute top-0 inset-x-0 h-7 bg-slate-950 z-50 flex justify-between items-center px-6 text-xs select-none">
              <span className="font-sans font-bold text-slate-400 text-[11px] pointer-events-none">{phoneClock}</span>
              {/* Central Camera pill */}
              <div className="hidden md:block w-24 h-4 bg-black rounded-full mx-auto border border-neutral-900 absolute left-1/2 -translate-x-1/2 top-1.5 pointer-events-none" />
              <button 
                onClick={() => setIsOffline(prev => !prev)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-all cursor-pointer bg-transparent border-none outline-none"
                title="Toggle Online/Offline Status"
              >
                {isOffline ? (
                  <span className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/25 px-1.5 py-0.5 rounded text-[8.5px] font-black text-rose-400 animate-pulse uppercase">
                    <WifiOff className="w-2.5 h-2.5" /> Offline
                  </span>
                ) : (
                  <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded text-[8.5px] font-black text-emerald-400 uppercase">
                    <Wifi className="w-2.5 h-2.5" /> Online
                  </span>
                )}
                <span className="text-[10px]">🔋</span>
              </button>
            </div>

            {/* Smart Screen Canvas Body */}
            <div className="flex-grow flex flex-col pt-7 pb-16 relative overflow-hidden" id="simulated-touch-screen">
              
              {!isLoggedIn ? (
                /* CHENNAI ONE AUTHENTICATION FLOW (Matching Screenshots 1, 2, 3) */
                <div className="flex-grow flex flex-col bg-white text-slate-900 relative overflow-y-auto no-scrollbar select-none" id="mtc-auth-flow">
                  
                  {/* SCREEN 1: SPLASH SCREEN */}
                  {loginStep === 'splash' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setLoginStep('mobile')}
                      className="flex-grow flex flex-col items-center justify-between p-6 cursor-pointer text-center"
                    >
                      <div className="my-auto flex flex-col items-center justify-center">
                        {/* Large rounded logo icon with vibrant gradient */}
                        <div 
                          className="w-36 h-36 rounded-[36px] flex items-center justify-center shadow-xl mb-6 relative overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, #e6005c 0%, #ff1a1a 50%, #ff7f00 100%)'
                          }}
                        >
                          {/* Inner white gap ring and number 1 */}
                          <svg viewBox="0 0 100 100" className="w-28 h-28 text-white fill-none stroke-current">
                            <path d="M 50 15 A 35 35 0 1 0 71 71" strokeWidth="11" strokeLinecap="round" />
                            <path d="M 51 35 L 51 72 M 41 45 L 51 35" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>

                        {/* Title text */}
                        <h1 className="text-4xl font-sans font-black tracking-tight text-slate-900 leading-none">chennai</h1>
                        <h1 className="text-4xl font-sans font-black tracking-tight text-slate-900 leading-none mt-1">one</h1>

                        {/* Quick Pass Access button */}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsLoggedIn(true);
                            setActiveTab('passes');
                          }}
                          className="mt-6 bg-slate-900 hover:bg-black text-amber-400 font-bold text-xs py-3 px-6 rounded-full shadow-lg flex items-center gap-2 border border-slate-800 active:scale-95 transition-all cursor-pointer"
                        >
                          <CreditCard className="w-4 h-4 text-amber-400" />
                          <span>View Active MTC Pass</span>
                        </button>
                      </div>

                      {/* Footer branding */}
                      <div className="w-full space-y-4 pb-4 shrink-0">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-400 block">Powered by</span>
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-[10px] font-extrabold text-slate-600 max-w-[200px] leading-tight">
                              Chennai Unified Metropolitan Transport Authority(CUMTA)
                            </span>
                          </div>
                          {/* Geometric CUMTA graphic */}
                          <div className="flex justify-center my-1">
                            <span className="font-mono font-black text-blue-600 text-lg tracking-widest border-b-2 border-blue-500 pb-0.5">CUMTA</span>
                          </div>
                        </div>

                        {/* Bottom Row of Govt / Transit Crests */}
                        <div className="flex items-center justify-center gap-4 opacity-75 pt-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">TN</div>
                          <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[8px] font-black text-blue-800">MTC</div>
                          <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">CMRL</div>
                          <div className="w-7 h-7 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-[8px] font-black text-purple-900">IR</div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN 2: LOGIN STEP 1/3 (MOBILE NUMBER ENTRY - Screenshot 2) */}
                  {loginStep === 'mobile' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-grow flex flex-col p-5 justify-between"
                    >
                      <div>
                        {/* Header bar */}
                        <div className="flex items-center justify-between pt-2 pb-4">
                          <button 
                            onClick={() => setLoginStep('splash')}
                            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
                          >
                            <ArrowRight className="w-5 h-5 rotate-180" />
                          </button>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1 bg-slate-200 rounded-full overflow-hidden">
                              <div className="w-1/3 h-full bg-slate-900" />
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-400">1/3</span>
                          </div>
                        </div>

                        {/* Heading */}
                        <h2 className="text-2xl font-sans font-black text-slate-900 tracking-tight mt-2 mb-6">
                          Let's get you trip-ready!
                        </h2>

                        {/* Card box */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-3">
                          <label className="block text-xs font-bold text-slate-700">
                            Enter your Mobile Number
                          </label>
                          <div className="flex gap-2">
                            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-extrabold text-slate-800 flex items-center gap-1 shrink-0">
                              <span>🇮🇳</span>
                              <span>+91</span>
                            </div>
                            <input 
                              type="tel"
                              maxLength={10}
                              value={mobileInput}
                              onChange={(e) => setMobileInput(e.target.value.replace(/\D/g, ''))}
                              placeholder="10-digit mobile number"
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-300 font-mono font-bold focus:outline-none focus:border-red-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bottom Footer */}
                      <div className="space-y-4 pt-4">
                        <div className="text-center space-y-1">
                          <p className="text-[11px] text-slate-500 font-medium">
                            By clicking Continue, you agree to our <button onClick={() => alert("Terms & Conditions applied.")} className="font-bold underline text-slate-800">T&Cs</button>
                          </p>
                          <div className="text-xs font-bold text-slate-500 flex items-center justify-center gap-1 cursor-pointer">
                            <span>Language: English</span>
                            <span>⌄</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            if (mobileInput.length === 10) setLoginStep('otp');
                            else alert("Please enter a valid 10-digit mobile number.");
                          }}
                          className={`w-full py-4 rounded-2xl font-black text-sm transition-all cursor-pointer shadow-sm ${
                            mobileInput.length === 10 
                              ? 'bg-[#ff0055] text-white hover:bg-[#db0048]' 
                              : 'bg-slate-200 text-slate-400'
                          }`}
                        >
                          Continue
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* SCREEN 3: LOGIN STEP 2/3 (OTP ENTRY - Screenshot 3) */}
                  {loginStep === 'otp' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-grow flex flex-col p-5 justify-between"
                    >
                      <div>
                        {/* Header bar */}
                        <div className="flex items-center justify-between pt-2 pb-4">
                          <button 
                            onClick={() => setLoginStep('mobile')}
                            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"
                          >
                            <ArrowRight className="w-5 h-5 rotate-180" />
                          </button>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1 bg-slate-200 rounded-full overflow-hidden">
                              <div className="w-2/3 h-full bg-slate-900" />
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-400">2/3</span>
                          </div>
                        </div>

                        {/* Heading */}
                        <h2 className="text-2xl font-sans font-black text-slate-900 tracking-tight mt-2 mb-6">
                          Let's get you trip-ready!
                        </h2>

                        {/* Card box */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-xs space-y-4">
                          <p className="text-xs font-bold text-slate-700">
                            OTP sent to +91 {mobileInput}
                          </p>

                          {/* 4 OTP Digit boxes */}
                          <div className="grid grid-cols-4 gap-3 py-1">
                            {otpDigits.map((digit, idx) => (
                              <input 
                                key={idx}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => {
                                  const newDigits = [...otpDigits];
                                  newDigits[idx] = e.target.value;
                                  setOtpDigits(newDigits);
                                }}
                                className="w-full h-12 rounded-2xl border-2 border-slate-200 text-center font-mono font-black text-lg text-slate-900 focus:border-red-500 focus:outline-none"
                              />
                            ))}
                          </div>

                          <button onClick={() => alert("OTP Resent successfully!")} className="text-xs font-bold text-slate-400 hover:text-slate-600 block">
                            Resend OTP(2)
                          </button>
                        </div>
                      </div>

                      {/* Bottom Footer Button */}
                      <div className="pt-4">
                        <button 
                          onClick={() => {
                            setUser(prev => ({ ...prev, name: 'SANJEEV', phone: `+91 ${mobileInput}`, email: 'iamheresanjeev@gmail.com' }));
                            setPass(prev => ({ ...prev, name: 'SANJEEV' }));
                            setIsLoggedIn(true);
                            localStorage.setItem('findback_logged_in', 'true');
                            setActiveTab('home');
                          }}
                          className="w-full py-4 rounded-2xl bg-[#ff0055] hover:bg-[#db0048] text-white font-black text-sm transition-all cursor-pointer shadow-md"
                        >
                          Continue
                        </button>
                      </div>
                    </motion.div>
                  )}

                </div>
              ) : (
                <>
                  {/* Dynamic Notification Banner for Renewal Confirmations */}
                  <AnimatePresence>
                    {showRenewalBanner && (
                      <motion.div 
                        initial={{ y: -60, opacity: 0 }}
                        animate={{ y: 8, opacity: 1 }}
                        exit={{ y: -60, opacity: 0 }}
                        className="absolute top-2 inset-x-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white p-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-emerald-500/20 z-50"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                        <div>
                          <p className="text-xs font-bold font-sans">Pass Renewal Activated!</p>
                          <p className="text-[9px] text-emerald-100 opacity-90 leading-none mt-0.5">
                            {isOffline 
                              ? "Your pass was securely saved inside the local offline cache database." 
                              : "Your pass was securely updated inside the active database ledger."
                            }
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* LOCATION PERMISSION DIALOG / SHEET (Screenshot 4) */}
                  {!locationGranted && activeTab === 'home' && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end">
                      <motion.div 
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="bg-white rounded-t-[36px] p-6 text-slate-900 space-y-4 shadow-2xl"
                      >
                        <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />
                        <h2 className="text-xl font-sans font-black tracking-tight leading-tight text-slate-900">
                          Hey SANJEEV,<br />Welcome to Chennai One!
                        </h2>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          To start booking rides, please allow us to find you by providing location access.
                        </p>
                        <button 
                          onClick={() => setLocationGranted(true)}
                          className="w-full py-4 bg-[#ff3b30] hover:bg-[#e03126] text-white font-black text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                        >
                          <MapPin className="w-4 h-4" /> Grant Location Access
                        </button>
                      </motion.div>
                    </div>
                  )}

                  {/* MAIN SCROLL ZONE (TOUCH OPTIMIZED CONTAINER) */}
                  <div 
                    className={`flex-grow overflow-y-auto no-scrollbar p-0 flex flex-col justify-start transition-colors duration-200 ${
                      activeTab === 'passes' ? 'bg-slate-950 text-white p-5' : 'bg-[#f8f9fa] text-slate-800'
                    }`} 
                    id="active-screen-scroll-container"
                  >
                    
                    {/* 1. HOME SCREEN TAB (Matching Screenshot 5) */}
                    {activeTab === 'home' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col min-h-full pb-20"
                      >
                        {/* Map View Frame */}
                        <div className="relative w-full h-[220px] bg-slate-100 shrink-0 overflow-hidden border-b border-slate-200">
                          <LiveMap />
                          
                          {/* Center Bus Toggle Switch Pill */}
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-slate-800">
                            <Bus className="w-4 h-4 text-emerald-400" />
                            <div className="w-7 h-4 bg-slate-700 rounded-full p-0.5 flex items-center">
                              <div className="w-3 h-3 rounded-full bg-white translate-x-3" />
                            </div>
                          </div>

                          {/* Location Target button */}
                          <div className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center border border-slate-200">
                            <MapPin className="w-4 h-4" />
                          </div>
                        </div>

                        {/* White Bottom Sheet Content Area */}
                        <div className="p-4 space-y-4 -mt-4 bg-white rounded-t-[28px] relative z-20 shadow-lg flex-grow">
                          
                          {/* Search Bar with Red-to-Orange Gradient */}
                          <div 
                            className="w-full py-3.5 px-4 rounded-2xl text-white shadow-md flex items-center gap-2.5 cursor-pointer"
                            style={{
                              background: 'linear-gradient(90deg, #e6005c 0%, #ff1a1a 50%, #ff7f00 100%)'
                            }}
                            onClick={() => setActiveTab('ticket')}
                          >
                            <Search className="w-4 h-4 text-white" />
                            <span className="text-xs font-black tracking-wide">Where are you going?</span>
                          </div>

                          {/* 4 Category Circles (Bus, Train, Metro, Auto/Cab) */}
                          <div className="grid grid-cols-4 gap-2 pt-1">
                            {/* Bus */}
                            <button onClick={() => setActiveTab('passes')} className="flex flex-col items-center gap-1.5 cursor-pointer">
                              <div className="w-13 h-13 rounded-full bg-[#fbc02d] text-slate-900 flex items-center justify-center shadow-xs">
                                <Bus className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-bold text-slate-700">Bus</span>
                            </button>

                            {/* Train */}
                            <button onClick={() => setActiveTab('ticket')} className="flex flex-col items-center gap-1.5 cursor-pointer">
                              <div className="w-13 h-13 rounded-full bg-[#81c784] text-slate-900 flex items-center justify-center shadow-xs">
                                <Train className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-bold text-slate-700">Train</span>
                            </button>

                            {/* Metro */}
                            <button onClick={() => setActiveTab('ticket')} className="flex flex-col items-center gap-1.5 cursor-pointer">
                              <div className="w-13 h-13 rounded-full bg-[#64b5f6] text-slate-900 flex items-center justify-center shadow-xs">
                                <Train className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-bold text-slate-700">Metro</span>
                            </button>

                            {/* Auto/Cab */}
                            <button onClick={() => alert("Auto/Cab booking coming soon!")} className="flex flex-col items-center gap-1.5 cursor-pointer">
                              <div className="w-13 h-13 rounded-full bg-[#ce93d8] text-slate-900 flex items-center justify-center shadow-xs">
                                <Bus className="w-6 h-6" />
                              </div>
                              <span className="text-xs font-bold text-slate-700">Auto/Cab</span>
                            </button>
                          </div>

                          {/* Promo Banner Card (Screenshot 5 - Purple Card) */}
                          <div className="bg-[#651fff] rounded-3xl p-5 text-white shadow-md relative overflow-hidden space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-slate-800 text-xs font-black">🤓</div>
                                <div className="w-8 h-8 rounded-full bg-pink-300 border-2 border-white flex items-center justify-center text-slate-800 text-xs font-black">👧</div>
                              </div>

                              {/* Gold coin icon */}
                              <div className="w-10 h-10 rounded-full bg-amber-400 border-2 border-amber-200 flex items-center justify-center text-amber-950 font-black text-sm shadow-md">
                                1
                              </div>
                            </div>

                            <h3 className="text-lg font-sans font-black leading-tight max-w-[220px]">
                              Educate your friends about Chennai One
                            </h3>

                            <button 
                              onClick={() => alert("Share link copied to clipboard!")}
                              className="bg-slate-900 hover:bg-black text-white text-xs font-black py-2.5 px-4 rounded-full inline-flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                            >
                              <span>✈ Share App with Friends</span>
                            </button>
                          </div>

                        </div>
                      </motion.div>
                    )}

                    {/* 2. PASSES SCREEN TAB (Pixel perfect match with screenshot!) */}
                    {activeTab === 'passes' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col h-full"
                      >
                        {/* UPPER CONTROL HEADER */}
                        <div className="flex items-center justify-between pb-4 shrink-0" id="mtc-passes-header">
                          <h1 className="text-2xl font-display font-black text-white" id="passes-screen-title">Passes</h1>
                          <div className="flex gap-2">
                            {/* Scan QR Button */}
                            <button 
                              onClick={() => setShowScanner(true)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#e6005c] hover:bg-[#c4004e] active:scale-95 transition-all text-xs font-bold rounded-full text-white shadow-md cursor-pointer"
                            >
                              <QrCode className="w-3.5 h-3.5" /> Scan QR
                            </button>
                            {/* Help Button */}
                            <button 
                              onClick={() => setShowHelp(true)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222222] hover:bg-[#333333] active:scale-95 transition-all text-xs font-bold rounded-full text-white border border-neutral-800"
                            >
                              <Phone className="w-3.5 h-3.5" /> Help
                            </button>
                            {/* History Button */}
                            <button 
                              onClick={() => setShowHistory(true)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222222] hover:bg-[#333333] active:scale-95 transition-all text-xs font-bold rounded-full text-white border border-neutral-800"
                            >
                              <Clock className="w-3.5 h-3.5" /> History
                            </button>
                          </div>
                        </div>

                        {/* Active Bus route indicator pill */}
                        <div className="self-start mb-4" id="mtc-pill-active-route">
                          <div className="flex items-center gap-1.5 bg-white text-black px-3.5 py-1.5 rounded-full font-bold text-xs shadow-sm">
                            <Bus className="w-3.5 h-3.5 text-black fill-current" />
                            <span>Bus(1/1)</span>
                          </div>
                        </div>

                        {/* THE CORE PASS CARD WITH LIVE TIME AND DETAILED VISUALS */}
                        <div className="flex-grow flex items-center justify-center">
                          <PassCard 
                            pass={pass} 
                            onRenewClick={handleRenewPass}
                            onPhotoUpload={(url) => setPass(prev => ({ ...prev, photoUrl: url }))}
                            isOffline={isOffline}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* 3. LIVE MAP SCREEN TAB */}
                    {activeTab === 'live' && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 pt-7 pb-16 flex flex-col"
                      >
                        <LiveMap />
                      </motion.div>
                    )}

                    {/* 4. TICKET DISPENSER SCREEN TAB */}
                    {activeTab === 'ticket' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-x-0 top-7 bottom-16 flex flex-col"
                      >
                        <TicketSimulator />
                      </motion.div>
                    )}

                    {/* 5. USER PROFILE SCREEN TAB */}
                    {activeTab === 'profile' && (
                      <motion.div 
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute inset-x-0 top-7 bottom-16 flex flex-col"
                      >
                        <ProfileTab 
                          user={user} 
                          onUserUpdate={setUser} 
                          pass={pass}
                          onPassUpdate={setPass}
                          onLogout={handleLogout} 
                        />
                      </motion.div>
                    )}

                    {/* 6. WALLET SCREEN TAB */}
                    {activeTab === 'wallet' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-x-0 top-7 bottom-16 flex flex-col p-5 overflow-y-auto no-scrollbar"
                      >
                        <WalletTab 
                          balance={walletBalance} 
                          transactions={walletTransactions} 
                          pass={pass} 
                          isOffline={isOffline}
                          onTopUp={(amount) => {
                            setWalletBalance(prev => prev + amount);
                            const newTx: WalletTransaction = {
                              id: 'tx-' + Date.now(),
                              type: 'Top Up',
                              amount: amount,
                              timestamp: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN', { hour12: false }),
                              description: 'Wallet Top Up'
                            };
                            setWalletTransactions(prev => [...prev, newTx]);
                          }} 
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* PERSISTENT STICKY BOTTOM UTILITY NAVIGATION BAR (Matching Screenshots 5, 6, 7) */}
                  <div className="relative border-t border-slate-200 bg-white z-40 select-none">
                    {/* Floating Center "BUS QR" Action Button */}
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-50">
                      <button 
                        onClick={() => setShowScanner(true)}
                        className="bg-[#111827] text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border-2 border-white cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                      >
                        <QrCode className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span className="text-xs font-black tracking-wide uppercase">BUS QR</span>
                      </button>
                    </div>

                    <div className="h-16 flex justify-around items-center px-2" id="sticky-bottom-nav">
                      {/* 1. Home button */}
                      <button 
                        onClick={() => setActiveTab('home')}
                        className={`flex flex-col items-center justify-center w-14 h-12 transition-all cursor-pointer ${
                          activeTab === 'home' ? 'text-[#ff0a24]' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                        <span className={`text-[10px] font-sans ${activeTab === 'home' ? 'font-black text-[#ff0a24]' : 'font-semibold'}`}>Home</span>
                      </button>

                      {/* 2. Passes button with numeric notification badge */}
                      <button 
                        onClick={() => setActiveTab('passes')}
                        className={`relative flex flex-col items-center justify-center w-14 h-12 transition-all cursor-pointer ${
                          activeTab === 'passes' ? 'text-[#ff0a24]' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <CreditCard className={`w-5 h-5 ${activeTab === 'passes' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                        <span className={`text-[10px] font-sans ${activeTab === 'passes' ? 'font-black text-[#ff0a24]' : 'font-semibold'}`}>Passes</span>
                        
                        {/* Red alert bubble numeric "1" matching screenshot exactly */}
                        <div className="absolute top-1 right-2.5 bg-[#df3d3d] text-white font-sans text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-xs">
                          1
                        </div>
                      </button>

                      {/* 3. Live tracking button */}
                      <button 
                        onClick={() => setActiveTab('live')}
                        className={`flex flex-col items-center justify-center w-14 h-12 transition-all cursor-pointer ${
                          activeTab === 'live' ? 'text-[#ff0a24]' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Radio className={`w-5 h-5 ${activeTab === 'live' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                        <span className={`text-[10px] font-sans ${activeTab === 'live' ? 'font-black text-[#ff0a24]' : 'font-semibold'}`}>Live</span>
                      </button>

                      {/* 4. Ticket dispenser button */}
                      <button 
                        onClick={() => setActiveTab('ticket')}
                        className={`flex flex-col items-center justify-center w-14 h-12 transition-all cursor-pointer ${
                          activeTab === 'ticket' ? 'text-[#ff0a24]' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <Ticket className={`w-5 h-5 ${activeTab === 'ticket' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                        <span className={`text-[10px] font-sans ${activeTab === 'ticket' ? 'font-black text-[#ff0a24]' : 'font-semibold'}`}>Ticket</span>
                      </button>

                      {/* 5. Profile setup button */}
                      <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex flex-col items-center justify-center w-14 h-12 transition-all cursor-pointer ${
                          activeTab === 'profile' ? 'text-[#ff0a24]' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                        <span className={`text-[10px] font-sans ${activeTab === 'profile' ? 'font-black text-[#ff0a24]' : 'font-semibold'}`}>Profile</span>
                      </button>
                    </div>
                  </div>

                  {/* OVERLAYS & DRAWER COMPONENTS */}
                  <AnimatePresence>
                    {/* 1. Configuration Drawer */}
                    {showConfigurator && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-50"
                      >
                        <PassForm 
                          pass={pass} 
                          onUpdate={(p) => {
                            setPass(p);
                            setUser(prev => ({ ...prev, name: p.name }));
                          }}
                          onClose={() => setShowConfigurator(false)} 
                        />
                      </motion.div>
                    )}

                    {/* 2. History logs Overlay */}
                    {showHistory && (
                      <motion.div 
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        className="absolute inset-0 z-50"
                      >
                        <HistoryLogs onClose={() => setShowHistory(false)} />
                      </motion.div>
                    )}

                    {/* 3. Support Help desk Overlay */}
                    {showHelp && (
                      <motion.div 
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        className="absolute inset-0 z-50"
                      >
                        <HelpSupport onClose={() => setShowHelp(false)} />
                      </motion.div>
                    )}

                    {/* 4. Camera & Simulated QR Code Scanner Overlay */}
                    <QrScannerOverlay 
                      isOpen={showScanner} 
                      onClose={() => setShowScanner(false)} 
                      pass={pass} 
                    />

                    {/* 4. Renew Pass Dialogue Box Modal */}
                    {showRenewDialog && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-[4px] z-50 flex items-center justify-center p-4"
                        onClick={() => setShowRenewDialog(false)}
                      >
                        <motion.div
                          initial={{ scale: 0.95, y: 15 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.95, y: 15 }}
                          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full max-w-[380px] bg-slate-900 border border-slate-800 rounded-[32px] p-5 shadow-2xl relative space-y-4 text-slate-100"
                        >
                          {/* Close button on top-right */}
                          <button 
                            onClick={() => setShowRenewDialog(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 p-1.5 rounded-full transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* Header with red shield/calendar accent */}
                          <div className="flex items-center gap-2.5">
                            <div className="p-2.5 bg-red-500/10 rounded-2xl border border-red-500/20">
                              <Calendar className="w-5 h-5 text-red-500" />
                            </div>
                            <div>
                              <h3 className="text-sm font-display font-black tracking-wide uppercase text-slate-100">Renew Transit Pass</h3>
                              <p className="text-[10px] text-slate-400 font-medium">Verify parameters and upload photo</p>
                            </div>
                          </div>

                          <div className="border-t border-slate-800 pt-3 space-y-3.5">
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                              Select or type your customized validity date and upload your confirmation photo to activate the pass.
                            </p>

                            <div className="space-y-3">
                              <div className="grid grid-cols-12 gap-2">
                                {/* Text Input */}
                                <div className="col-span-8 font-sans">
                                  <input 
                                    type="text"
                                    value={renewDate}
                                    onChange={(e) => setRenewDate(e.target.value)}
                                    placeholder="e.g. 01/09/2026"
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-red-500 font-mono font-bold"
                                  />
                                </div>

                                {/* Calendar Picker Wrapper */}
                                <div className="col-span-4 relative font-sans">
                                  <input 
                                    type="date"
                                    onChange={(e) => {
                                      if (!e.target.value) return;
                                      const [year, month, day] = e.target.value.split('-');
                                      setRenewDate(`${day}/${month}/${year}`);
                                    }}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  />
                                  <div className="w-full h-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all select-none">
                                    <Calendar className="w-4 h-4 text-red-400" />
                                    <span>Pick</span>
                                  </div>
                                </div>
                              </div>

                              {/* Quick Date Presets */}
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                <button
                                  onClick={() => {
                                    const d = new Date();
                                    d.setMonth(d.getMonth() + 1);
                                    const formatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                    setRenewDate(formatted);
                                  }}
                                  className="text-[10px] px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
                                >
                                  +1 Month
                                </button>
                                <button
                                  onClick={() => {
                                    const d = new Date();
                                    d.setMonth(d.getMonth() + 3);
                                    const formatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                    setRenewDate(formatted);
                                  }}
                                  className="text-[10px] px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
                                >
                                  +3 Months
                                </button>
                                <button
                                  onClick={() => {
                                    const d = new Date();
                                    d.setFullYear(d.getFullYear() + 1);
                                    const formatted = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                    setRenewDate(formatted);
                                  }}
                                  className="text-[10px] px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
                                >
                                  +1 Year
                                </button>
                              </div>
                            </div>

                            {/* Required Portrait Photo Upload section for renewal confirmation */}
                            <div className="border-t border-slate-800 pt-3.5 space-y-2.5">
                              <label className="block text-[11px] uppercase font-bold text-slate-300 tracking-wider">
                                Required Photo Confirmation
                              </label>
                              <p className="text-[10px] text-slate-400 leading-normal">
                                Upload a photo of yourself to give confirmation and associate it with this active transit pass.
                              </p>

                              <div className="flex items-center gap-3">
                                <button 
                                  type="button"
                                  onClick={() => document.getElementById('renew-modal-photo-input')?.click()}
                                  className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden shrink-0 relative group"
                                  title="Upload Portrait Photo"
                                >
                                  {renewPhotoUrl ? (
                                    <img 
                                      src={renewPhotoUrl} 
                                      alt="Profile Preview" 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-500">
                                      <Upload className="w-5 h-5 text-slate-400 mb-0.5" />
                                      <span className="text-[7px] font-black uppercase tracking-wider text-center leading-none">Upload</span>
                                    </div>
                                  )}
                                  {renewPhotoUrl && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <Camera className="w-4 h-4 text-white" />
                                    </div>
                                  )}
                                </button>

                                <div className="flex-1 min-h-[64px] flex flex-col justify-center">
                                  {renewPhotoUrl ? (
                                    <div className="space-y-1">
                                      <span className="text-[9px] font-mono font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md w-fit">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> PHOTO CONFIRMED
                                      </span>
                                      <button 
                                        type="button" 
                                        onClick={() => setRenewPhotoUrl('')}
                                        className="text-[10px] text-red-400 hover:text-red-300 font-bold underline cursor-pointer block"
                                      >
                                        Remove/Change
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-[9.5px] text-amber-400 flex items-start gap-1.5 bg-amber-500/5 border border-amber-500/10 p-2 rounded-xl">
                                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                                      <span>Please upload a portrait image to proceed with verification & activation.</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <input 
                                id="renew-modal-photo-input"
                                type="file" 
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      if (event.target?.result) {
                                        setRenewPhotoUrl(event.target.result as string);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </div>
                          </div>

                          {renewError && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs p-3 rounded-xl space-y-1.5 font-sans">
                              <p className="font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 text-rose-400" /> Payment Failed</p>
                              <p className="text-[10.5px] leading-relaxed text-slate-300">{renewError}</p>
                              <button
                                onClick={() => {
                                  setShowRenewDialog(false);
                                  setActiveTab('wallet');
                                }}
                                className="text-xs text-amber-400 hover:underline font-bold block pt-1"
                              >
                                Go to Wallet Tab to Top Up ➔
                              </button>
                            </div>
                          )}

                          {/* Final Action Button */}
                          <div className="pt-2">
                            <button
                              onClick={() => {
                                if (walletBalance < pass.amount) {
                                  setRenewError(`Your e-wallet balance (₹${walletBalance}) is insufficient for this ₹${pass.amount} renewal. please top up.`);
                                  return;
                                }

                                // Deduct balance
                                setWalletBalance(prev => prev - pass.amount);

                                // Create Wallet ledger entry
                                const newTx: WalletTransaction = {
                                  id: 'tx-' + Date.now(),
                                  type: 'Deduction',
                                  amount: pass.amount,
                                  timestamp: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString('en-IN', { hour12: false }),
                                  description: `Pass Renewal (${pass.type})`
                                };
                                setWalletTransactions(prev => [...prev, newTx]);

                                const updated = {
                                  ...pass,
                                  passNo: String(Math.floor(10000000 + Math.random() * 90000000)),
                                  validTo: renewDate,
                                  photoUrl: renewPhotoUrl,
                                  activatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour12: false }),
                                  status: 'Active' as const
                                };
                                setPass(updated);
                                setShowRenewDialog(false);
                                setShowRenewalBanner(true);
                                setTimeout(() => {
                                  setShowRenewalBanner(false);
                                }, 4000);
                              }}
                              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-sm font-bold uppercase tracking-wider shadow-lg active:scale-[0.98] transition-all cursor-pointer text-center"
                            >
                              Renew & Activate Pass
                            </button>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

            </div>
          </div>
        </div>

        {/* Right Side: Simulation Instructions & State Inspectors (Visible ONLY on larger viewports) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col space-y-5 pl-4 animate-[fadeIn_0.5s_ease]" id="desktop-state-inspections">
          
          {/* Active Pass State Auditor */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Database className="w-4 h-4 text-emerald-400" />
              State Inspector (Active Pass)
            </h3>

            <div className="space-y-2 text-xs font-mono bg-slate-950 p-3 rounded-xl border border-slate-900 overflow-x-auto text-slate-400">
              <p><span className="text-slate-600">ID:</span> {pass.id}</p>
              <p><span className="text-slate-600">PASS_NO:</span> {pass.passNo}</p>
              <p><span className="text-slate-600">HOLDER:</span> {pass.name}</p>
              <p><span className="text-slate-600">CLASSIF:</span> {pass.type}</p>
              <p><span className="text-slate-600">AMOUNT:</span> ₹{pass.amount}</p>
              <p><span className="text-slate-600">VALIDITY:</span> {pass.validTo}</p>
              <p><span className="text-slate-600">STATUS:</span> <span className="text-emerald-400">{pass.status}</span></p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
              <span className="text-slate-200 font-bold block">Quick Actions</span>
              <p>1. Open the <strong className="text-amber-500 cursor-pointer" onClick={() => setActiveTab('profile')}>Profile Tab</strong> to check or elevate your system roles.</p>
              <p>2. Toggle role to <strong className="text-blue-400">HUB_OPERATOR</strong> to inspect the administrative ledger & verify queue.</p>
            </div>
          </div>

          {/* Chennai GIS information */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-2">
            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Metropolitan GIS</span>
            <h4 className="text-xs font-bold text-slate-200">Autonomous Map Rendering</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Utilizing high-performance vector paths calibrated specifically for Chennai's operational corridors (Route 21G, 102, 19B, 570). GPS bus positions interpolate every 1.5s for realistic simulation metrics.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
