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
  Battery, 
  Sliders, 
  Database,
  ArrowUpDown,
  Mail,
  X,
  Calendar,
  Camera,
  Upload,
  Wallet
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

  const [loginName, setLoginName] = useState('');
  const [loginMobile, setLoginMobile] = useState('');
  const [loginAadhaar, setLoginAadhaar] = useState('');
  const [loginEmail, setLoginEmail] = useState('');

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('findback_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  const [pass, setPass] = useState<MtcPass>(() => {
    const saved = localStorage.getItem('findback_pass');
    return saved ? JSON.parse(saved) : INITIAL_PASS;
  });
  const [activeTab, setActiveTab] = useState<TabType>('passes');

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
            <div className="absolute top-0 inset-x-0 h-7 bg-slate-950 z-50 flex justify-between items-center px-6 text-xs pointer-events-none select-none">
              <span className="font-sans font-bold text-slate-400 text-[11px]"></span>
              {/* Central Camera pill */}
              <div className="hidden md:block w-24 h-4 bg-black rounded-full mx-auto border border-neutral-900 absolute left-1/2 -translate-x-1/2 top-1.5" />
              <div className="flex items-center gap-1.5 text-slate-400">
              </div>
            </div>

            {/* Smart Screen Canvas Body */}
            <div className="flex-grow flex flex-col pt-7 pb-16 relative overflow-hidden" id="simulated-touch-screen">
              
              {!isLoggedIn ? (
                /* BEAUTIFUL CHENNAI ONE RED & WHITE LOGIN SCREEN */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-grow flex flex-col p-6 overflow-y-auto no-scrollbar bg-gradient-to-b from-[#ff0a24] via-[#ff0055] to-[#db0060] justify-center relative select-none"
                  id="mtc-login-screen"
                >
                  {/* Visual logo and title matching the attached image exactly */}
                  <div className="text-center mb-8 shrink-0 mt-4">
                    <div className="flex justify-center mb-4">
                      <svg viewBox="0 0 100 100" className="w-24 h-24 text-white fill-none stroke-current animate-[pulse_3s_infinite]">
                        {/* Open circle contour with gap at bottom-right */}
                        <path d="M 50 15 A 35 35 0 1 0 71 71" strokeWidth="10" strokeLinecap="round" />
                        {/* Number 1 inside */}
                        <path d="M 51 35 L 51 72 M 41 45 L 51 35" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <h1 className="text-4xl font-sans font-black tracking-tighter text-white uppercase leading-none">chennai</h1>
                    <h1 className="text-4xl font-sans font-black tracking-tighter text-white uppercase leading-none mt-1">one</h1>
                    <p className="text-[10px] text-red-100 font-bold tracking-wider mt-3.5 opacity-90 uppercase font-mono">
                      Chennai Metro Transit Pass Portal
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleLoginSubmit} className="space-y-5 font-sans text-xs">
                    {/* Name input */}
                    <div className="flex flex-col">
                      <label className="block text-[11px] uppercase font-bold text-white tracking-wider mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                        placeholder="e.g. Sanjeev M"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 font-medium font-sans shadow-sm transition-all"
                      />
                    </div>

                    {/* Mobile Input */}
                    <div className="flex flex-col">
                      <label className="block text-[11px] uppercase font-bold text-white tracking-wider mb-1.5">Mobile Number</label>
                      <input 
                        type="tel" 
                        required
                        value={loginMobile}
                        onChange={(e) => setLoginMobile(e.target.value)}
                        placeholder="e.g. +91 98401 23456"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 font-medium font-mono shadow-sm transition-all"
                      />
                    </div>

                    {/* Aadhaar Input */}
                    <div className="flex flex-col">
                      <label className="block text-[11px] uppercase font-bold text-white tracking-wider mb-1.5">Aadhaar Number</label>
                      <input 
                        type="text" 
                        required
                        value={loginAadhaar}
                        onChange={handleAadhaarChange}
                        placeholder="e.g. 1234-5678-9012"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 font-medium font-mono shadow-sm transition-all"
                      />
                    </div>

                    {/* Email Input (Replaced Password section as requested) */}
                    <div className="flex flex-col">
                      <label className="block text-[11px] uppercase font-bold text-white tracking-wider mb-1.5 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email Address
                      </label>
                      <input 
                        type="email" 
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. sanjeev@chennai.gov.in"
                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 font-medium font-mono shadow-sm transition-all"
                      />
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit"
                      className="w-full mt-6 py-3.5 rounded-xl bg-white text-[#ff0055] font-black text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-95 cursor-pointer uppercase tracking-wider"
                    >
                      Authenticate & Access Pass
                    </button>
                  </form>
                </motion.div>
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
                          <p className="text-[9px] text-emerald-100 opacity-90 leading-none mt-0.5">Your pass was securely updated inside the active database ledger.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* MAIN SCROLL ZONE (TOUCH OPTIMIZED CONTAINER) */}
                  <div 
                    className={`flex-grow overflow-y-auto no-scrollbar p-5 flex flex-col justify-start transition-colors duration-200 ${
                      activeTab === 'passes' ? 'bg-slate-950 text-white' : 'bg-[#f8f9fa] text-slate-800'
                    }`} 
                    id="active-screen-scroll-container"
                  >
                    
                    {/* 1. HOME SCREEN TAB */}
                    {activeTab === 'home' && (
                      <motion.div 
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-5"
                      >
                        {/* Welcome Header */}
                        <div className="flex justify-between items-center shrink-0">
                          <div>
                            <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-wider font-sans">Chennai Metro Transit</span>
                            <h2 className="text-xl font-display font-black text-slate-950 mt-0.5">Vanakkom, {user.name.split(' ')[0]}!</h2>
                          </div>
                          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                            <Sparkles className="w-4 h-4 text-red-500" />
                          </div>
                        </div>

                        {/* Active Pass overview widget */}
                        <div 
                          onClick={() => setActiveTab('passes')}
                          className="bg-white border border-slate-100 shadow-sm p-4 rounded-3xl hover:border-slate-200 cursor-pointer transition-all space-y-3 active:scale-[0.99]"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-slate-500 font-bold uppercase">Active Bus Pass</span>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">Activated</span>
                          </div>
                          
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-lg font-mono font-bold text-slate-900">{pass.passNo}</p>
                              <p className="text-xs text-slate-500 mt-1">Expiring: {pass.validTo}</p>
                            </div>
                            <span className="text-xl font-extrabold text-[#ff0055]">₹{pass.amount}</span>
                          </div>
                        </div>

                        {/* Chennai Route Planner Widget */}
                        <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-3xl space-y-4">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">MTC Route Planner</h3>
                          </div>

                          <form onSubmit={handleRouteSearch} className="space-y-3.5">
                            <div className="space-y-2.5">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">FROM</span>
                                <select 
                                  value={plannerSource} 
                                  onChange={(e) => setPlannerSource(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-14 pr-3 text-xs text-slate-800 focus:outline-none focus:border-red-500"
                                >
                                  <option value="Broadway">Broadway</option>
                                  <option value="Chennai Central">Chennai Central</option>
                                  <option value="Guindy">Guindy</option>
                                  <option value="Adyar">Adyar</option>
                                  <option value="Tambaram">Tambaram</option>
                                  <option value="CMBT">CMBT</option>
                                </select>
                              </div>

                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">TO</span>
                                <select 
                                  value={plannerDest} 
                                  onChange={(e) => setPlannerDest(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-14 pr-3 text-xs text-slate-800 focus:outline-none focus:border-red-500"
                                >
                                  <option value="Broadway">Broadway</option>
                                  <option value="Chennai Central">Chennai Central</option>
                                  <option value="Guindy">Guindy</option>
                                  <option value="Adyar">Adyar</option>
                                  <option value="Tambaram">Tambaram</option>
                                  <option value="CMBT">CMBT</option>
                                </select>
                              </div>
                            </div>

                            <button 
                              type="submit"
                              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff0a24] to-[#db0060] text-white font-black text-xs hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                            >
                              Find Transit Route
                            </button>
                          </form>

                          {plannerResult && (
                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs mt-3 animate-[fadeIn_0.2s_ease]">
                              {plannerResult.error ? (
                                <div className="flex gap-2 text-rose-600 font-bold">
                                  <AlertCircle className="w-4 h-4 shrink-0" />
                                  <p className="leading-relaxed">{plannerResult.error}</p>
                                </div>
                              ) : (
                                <div className="space-y-2.5">
                                  <div className="flex justify-between items-center">
                                    <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-800" style={{ borderLeft: `3px solid ${plannerResult.color}` }}>
                                      MTC {plannerResult.routeNo}
                                    </span>
                                    <span className="text-[#ff0055] font-black text-sm">₹{plannerResult.fare}</span>
                                  </div>
                                  <p className="text-slate-500 text-[11px] leading-tight font-medium">
                                    Runs {plannerResult.source} ➔ {plannerResult.destination} with {plannerResult.stopsCount} intermediate segments. {plannerResult.activeBuses} active buses currently monitored on live GPS grid.
                                  </p>
                                  <button 
                                    onClick={() => setActiveTab('live')}
                                    className="text-[10px] font-extrabold text-red-500 hover:underline flex items-center gap-1"
                                  >
                                    View Live Map Location <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* MTC Transit Board Advisory News */}
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl space-y-2 text-xs">
                          <span className="text-[10px] text-amber-800 font-black uppercase tracking-wider">Advisory Notice</span>
                          <p className="text-slate-700 leading-relaxed font-sans text-[11px] font-medium">
                            Festive special buses scheduled to run towards Adyar and Tambaram on weekends. Fares remain subsidized. Please verify identity documents prior to ticket inspections.
                          </p>
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
                            {/* QR Scanner Button */}
                            <button 
                              onClick={() => setShowScanner(true)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff0055] hover:bg-[#db0048] active:scale-95 transition-all text-xs font-bold rounded-full text-white border border-[#ff0055]/20 shadow-md cursor-pointer select-none"
                              id="btn-scan-qr"
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

                  {/* PERSISTENT STICKY BOTTOM UTILITY NAVIGATION BAR */}
                  <div 
                    className="absolute bottom-0 inset-x-0 h-16 bg-[#0a0a0a] border-t border-neutral-900 flex justify-around items-center z-40 select-none"
                    id="sticky-bottom-nav"
                  >
                    {/* 1. Home button */}
                    <button 
                      onClick={() => setActiveTab('home')}
                      className={`flex flex-col items-center justify-center w-12 h-12 transition-all ${
                        activeTab === 'home' ? 'text-white scale-105' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <Home className="w-5 h-5 stroke-[2]" />
                      <span className="text-[9px] font-sans font-semibold mt-0.5">Home</span>
                    </button>

                    {/* 2. Passes button with numeric notification badge */}
                    <button 
                      onClick={() => setActiveTab('passes')}
                      className={`relative flex flex-col items-center justify-center w-12 h-12 transition-all ${
                        activeTab === 'passes' ? 'text-white scale-105' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 stroke-[2]" />
                      <span className="text-[9px] font-sans font-semibold mt-0.5">Passes</span>
                      
                      {/* Red alert bubble numeric "1" matching screenshot exactly! */}
                      <div className="absolute top-0.5 right-1.5 bg-[#df3d3d] text-white font-sans text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black shadow">
                        1
                      </div>
                    </button>

                    {/* 3. Live tracking button */}
                    <button 
                      onClick={() => setActiveTab('live')}
                      className={`flex flex-col items-center justify-center w-12 h-12 transition-all ${
                        activeTab === 'live' ? 'text-white scale-105' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <Radio className="w-5 h-5 stroke-[2]" />
                      <span className="text-[9px] font-sans font-semibold mt-0.5">Live</span>
                    </button>

                    {/* 4. Ticket dispenser button */}
                    <button 
                      onClick={() => setActiveTab('ticket')}
                      className={`flex flex-col items-center justify-center w-12 h-12 transition-all ${
                        activeTab === 'ticket' ? 'text-white scale-105' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <Ticket className="w-5 h-5 stroke-[2]" />
                      <span className="text-[9px] font-sans font-semibold mt-0.5">Ticket</span>
                    </button>

                    {/* 5. Wallet button */}
                    <button 
                      onClick={() => setActiveTab('wallet')}
                      className={`flex flex-col items-center justify-center w-12 h-12 transition-all ${
                        activeTab === 'wallet' ? 'text-white scale-105' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <Wallet className="w-5 h-5 stroke-[2]" />
                      <span className="text-[9px] font-sans font-semibold mt-0.5">Wallet</span>
                    </button>

                    {/* 6. Profile setup button */}
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={`flex flex-col items-center justify-center w-12 h-12 transition-all ${
                        activeTab === 'profile' ? 'text-white scale-105' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      <User className="w-5 h-5 stroke-[2]" />
                      <span className="text-[9px] font-sans font-semibold mt-0.5">Profile</span>
                    </button>
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

                    {/* QR Scanner Overlay */}
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
