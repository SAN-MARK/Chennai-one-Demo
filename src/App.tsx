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
  ArrowUpDown
} from 'lucide-react';
import { MtcPass, UserProfile, TabType } from './types';
import { INITIAL_USER, INITIAL_PASS, CHENNAI_ROUTES } from './data';
import PassCard from './components/PassCard';
import PassForm from './components/PassForm';
import LiveMap from './components/LiveMap';
import TicketSimulator from './components/TicketSimulator';
import ProfileTab from './components/ProfileTab';
import HistoryLogs from './components/HistoryLogs';
import HelpSupport from './components/HelpSupport';

export default function App() {
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

  // Modular screen/form display states
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
    // Renew pass
    const updated = {
      ...pass,
      passNo: String(Math.floor(10000000 + Math.random() * 90000000)),
      validTo: '01/09/2026', // Updated to 01/09/2026 per user's instruction
      activatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + new Date().toLocaleTimeString('en-US', { hour12: false })
    };
    setPass(updated);
    setShowRenewalBanner(true);
    setTimeout(() => {
      setShowRenewalBanner(false);
    }, 4000);
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
    <div className="min-h-screen bg-[#0b2423] font-sans flex flex-col items-center justify-center p-0 md:p-6 select-none overflow-hidden" id="mtc-root-canvas">
      
      {/* Background radial art for desktop framing layout */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(201,162,39,0.06)_0%,_transparent_60%)] pointer-events-none" />

      {/* Main Responsive Grid layout (Desktop sidebar + Centered mobile canvas frame) */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10" id="main-grid-frame">
        
        {/* Left Side: Simulation Informational Deck (Visible ONLY on wider footprints) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col space-y-5 pr-4 animate-[fadeIn_0.5s_ease]" id="desktop-control-deck">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-temple-gold/15 text-temple-gold font-extrabold px-2.5 py-1 rounded-full border border-temple-gold/30">
                Simulation Mode
              </span>
              <span className="text-xs bg-kumkum-maroon/20 text-white font-bold px-2 py-1 rounded-full border border-kumkum-maroon/30">
                Temple & Coastal Theme
              </span>
            </div>
            <h1 className="text-3xl font-display font-black text-white leading-tight">
              MTC Chennai <br />Pass Simulator
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              Experience Chennai's digital transit grid interface. Fully interactive simulation of monthly passes, GPS bus maps, ticket booking, and Hub Operator privileges with strict masking controls.
            </p>
          </div>

          {/* Quick Simulation controls widget */}
          <div className="bg-[#0F3D3B]/40 rounded-2xl p-4 border border-deep-teal/30 space-y-3">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-temple-gold" />
              Developer Controls
            </h3>
            
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setShowConfigurator(true)}
                className="py-2.5 px-3 rounded-xl bg-deep-teal hover:bg-deep-teal/80 border border-temple-gold/20 text-left transition-all cursor-pointer"
              >
                <span className="text-[9px] text-slate-300 block font-bold uppercase">Pass Body</span>
                <span className="text-xs text-white font-bold">Configure Card</span>
              </button>

              <button 
                onClick={handleRenewPass}
                className="py-2.5 px-3 rounded-xl bg-deep-teal hover:bg-deep-teal/80 border border-temple-gold/20 text-left transition-all cursor-pointer"
              >
                <span className="text-[9px] text-slate-300 block font-bold uppercase">Quick Reset</span>
                <span className="text-xs text-white font-bold">Renew Pass</span>
              </button>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
              <Database className="w-3.5 h-3.5 text-temple-gold" />
              <span>Durable state handled via React Context simulation.</span>
            </div>
          </div>

          {/* Footer credentials */}
          <div className="text-[10px] text-slate-400 space-y-1 font-mono">
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
            className="relative w-full max-w-[480px] h-[100vh] md:h-[840px] bg-deep-teal md:rounded-[48px] overflow-hidden shadow-2xl md:border-8 md:border-deep-teal flex flex-col text-white"
            id="smartphone-bezel-frame"
          >
            {/* Top Smartphone Camera Notch element (Mock Bezel details for realism) */}
            <div className="absolute top-0 inset-x-0 h-7 bg-deep-teal z-50 flex justify-between items-center px-6 text-xs pointer-events-none select-none">
              <span className="font-sans font-bold text-white/80 text-[11px]">{phoneClock}</span>
              {/* Central Camera pill */}
              <div className="hidden md:block w-24 h-4 bg-[#0a2928] rounded-full mx-auto border border-white/5 absolute left-1/2 -translate-x-1/2 top-1.5" />
              <div className="flex items-center gap-1.5 text-white/80">
                <Wifi className="w-3.5 h-3.5" />
                <span className="font-mono text-[9px] font-bold">5G</span>
                <Battery className="w-4 h-4 text-emerald-400 fill-current" />
              </div>
            </div>

            {/* Smart Screen Canvas Body - Styled in warm Ivory Sand Mode with Charcoal text! */}
            <div className="flex-grow flex flex-col pt-7 pb-16 relative overflow-hidden bg-ivory-sand text-charcoal" id="simulated-touch-screen">
              
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
              <div className="flex-grow overflow-y-auto no-scrollbar p-5 flex flex-col justify-start" id="active-screen-scroll-container">
                
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
                        <span className="text-[10px] text-kumkum-maroon font-bold uppercase tracking-wider font-mono">Chennai Metro Transit</span>
                        <h2 className="text-xl font-display font-black text-charcoal mt-0.5">Vanakkom, {user.name.split(' ')[0]}!</h2>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-warm-gray/25">
                        <Sparkles className="w-4 h-4 text-temple-gold" />
                      </div>
                    </div>

                    {/* Active Pass overview widget */}
                    <div 
                      onClick={() => setActiveTab('passes')}
                      className="bg-white border-2 border-temple-gold/60 p-4 rounded-2xl hover:border-temple-gold cursor-pointer transition-all space-y-3 active:scale-[0.99] shadow-sm"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono text-warm-gray">ACTIVE BUS PASS</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-kumkum-maroon/10 text-kumkum-maroon uppercase">Activated</span>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-lg font-mono font-bold text-charcoal">{pass.passNo}</p>
                          <p className="text-xs text-warm-gray mt-1">Expiring: {pass.validTo}</p>
                        </div>
                        <span className="text-xl font-black text-kumkum-maroon">₹{pass.amount}</span>
                      </div>
                    </div>

                    {/* Chennai Route Planner Widget */}
                    <div className="bg-white border border-warm-gray/25 p-4 rounded-2xl space-y-4 shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-kumkum-maroon" />
                        <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">MTC Route Planner</h3>
                      </div>

                      <form onSubmit={handleRouteSearch} className="space-y-3.5">
                        <div className="space-y-2.5">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray text-[10px] font-bold">FROM</span>
                            <select 
                              value={plannerSource} 
                              onChange={(e) => setPlannerSource(e.target.value)}
                              className="w-full bg-ivory-sand border border-warm-gray/25 rounded-xl py-2.5 pl-14 pr-3 text-xs text-charcoal focus:outline-none"
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
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray text-[10px] font-bold">TO</span>
                            <select 
                              value={plannerDest} 
                              onChange={(e) => setPlannerDest(e.target.value)}
                              className="w-full bg-ivory-sand border border-warm-gray/25 rounded-xl py-2.5 pl-14 pr-3 text-xs text-charcoal focus:outline-none"
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
                          className="w-full py-2.5 rounded-xl bg-kumkum-maroon text-white font-bold text-xs hover:bg-kumkum-maroon/90 transition-colors flex items-center justify-center gap-1.5 shadow"
                        >
                          Find Transit Route
                        </button>
                      </form>

                      {plannerResult && (
                        <div className="bg-ivory-sand p-3.5 rounded-xl border border-warm-gray/25 text-xs mt-3 animate-[fadeIn_0.2s_ease]">
                          {plannerResult.error ? (
                            <div className="flex gap-2 text-terracotta">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <p className="leading-relaxed font-bold">{plannerResult.error}</p>
                            </div>
                          ) : (
                            <div className="space-y-2.5">
                              <div className="flex justify-between items-center">
                                <span className="font-mono font-bold px-2 py-0.5 rounded bg-deep-teal text-white border-l-4" style={{ borderLeftColor: plannerResult.color }}>
                                  MTC {plannerResult.routeNo}
                                </span>
                                <span className="text-kumkum-maroon font-extrabold text-sm">₹{plannerResult.fare}</span>
                              </div>
                              <p className="text-warm-gray text-[11px] leading-tight">
                                Runs {plannerResult.source} ➔ {plannerResult.destination} with {plannerResult.stopsCount} intermediate segments. {plannerResult.activeBuses} active buses currently monitored on live GPS grid.
                              </p>
                              <button 
                                onClick={() => setActiveTab('live')}
                                className="text-[10px] font-bold text-kumkum-maroon hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                View Live Map Location <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* MTC Transit Board Advisory News */}
                    <div className="bg-marina-blue/10 border border-marina-blue/20 p-4 rounded-2xl space-y-2 text-xs">
                      <span className="text-[10px] text-marina-blue font-bold uppercase tracking-wider">Advisory Notice</span>
                      <p className="text-charcoal leading-relaxed font-sans text-[11px]">
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
                      <h1 className="text-2xl font-display font-black text-charcoal" id="passes-screen-title">Passes</h1>
                      <div className="flex gap-2">
                        {/* Help Button */}
                        <button 
                          onClick={() => setShowHelp(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-ivory-sand active:scale-95 transition-all text-xs font-bold rounded-full text-charcoal border border-warm-gray/25 cursor-pointer animate-none"
                        >
                          <Phone className="w-3.5 h-3.5 text-kumkum-maroon" /> Help
                        </button>
                        {/* History Button */}
                        <button 
                          onClick={() => setShowHistory(true)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-ivory-sand active:scale-95 transition-all text-xs font-bold rounded-full text-charcoal border border-warm-gray/25 cursor-pointer animate-none"
                        >
                          <Clock className="w-3.5 h-3.5 text-kumkum-maroon" /> History
                        </button>
                      </div>
                    </div>

                    {/* Active Bus route indicator pill */}
                    <div className="self-start mb-4" id="mtc-pill-active-route">
                      <div className="flex items-center gap-1.5 bg-kumkum-maroon text-white px-3.5 py-1.5 rounded-full font-bold text-xs shadow-md">
                        <Bus className="w-3.5 h-3.5 text-white fill-current" />
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
                    <ProfileTab user={user} onUserUpdate={setUser} />
                  </motion.div>
                )}
              </div>

              {/* PERSISTENT STICKY BOTTOM UTILITY NAVIGATION BAR */}
              <div 
                className="absolute bottom-0 inset-x-0 h-16 bg-deep-teal border-t border-white/10 flex justify-around items-center z-40 select-none"
                id="sticky-bottom-nav"
              >
                {/* 1. Home button */}
                <button 
                  onClick={() => setActiveTab('home')}
                  className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${
                    activeTab === 'home' ? 'text-temple-gold scale-105' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Home className="w-5 h-5 stroke-[2]" />
                  <span className="text-[9px] font-sans font-semibold mt-0.5">Home</span>
                </button>

                {/* 2. Passes button with numeric notification badge */}
                <button 
                  onClick={() => setActiveTab('passes')}
                  className={`relative flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${
                    activeTab === 'passes' ? 'text-temple-gold scale-105' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 stroke-[2]" />
                  <span className="text-[9px] font-sans font-semibold mt-0.5">Passes</span>
                  
                  {/* Red alert bubble numeric "1" matching screenshot exactly! */}
                  <div className="absolute top-0.5 right-1.5 bg-kumkum-maroon text-white font-sans text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white/20 shadow">
                    1
                  </div>
                </button>

                {/* 3. Live tracking button */}
                <button 
                  onClick={() => setActiveTab('live')}
                  className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${
                    activeTab === 'live' ? 'text-temple-gold scale-105' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Radio className="w-5 h-5 stroke-[2]" />
                  <span className="text-[9px] font-sans font-semibold mt-0.5">Live</span>
                </button>

                {/* 4. Ticket dispenser button */}
                <button 
                  onClick={() => setActiveTab('ticket')}
                  className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${
                    activeTab === 'ticket' ? 'text-temple-gold scale-105' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Ticket className="w-5 h-5 stroke-[2]" />
                  <span className="text-[9px] font-sans font-semibold mt-0.5">Ticket</span>
                </button>

                {/* 5. Profile setup button */}
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex flex-col items-center justify-center w-12 h-12 transition-all cursor-pointer ${
                    activeTab === 'profile' ? 'text-temple-gold scale-105' : 'text-white/60 hover:text-white'
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
              </AnimatePresence>

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
