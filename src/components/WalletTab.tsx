import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, Plus, ArrowUpRight, ArrowDownRight, Info, Coins, Sparkles, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { WalletTransaction, MtcPass } from '../types';

interface WalletTabProps {
  balance: number;
  transactions: WalletTransaction[];
  pass: MtcPass;
  isOffline?: boolean;
  onTopUp: (amount: number) => void;
}

export default function WalletTab({ balance, transactions, pass, isOffline = false, onTopUp }: WalletTabProps) {
  const [topUpAmount, setTopUpAmount] = useState<string>('500');
  const [isTopUpLoading, setIsTopUpLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleQuickAdd = (value: number) => {
    setTopUpAmount(value.toString());
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(topUpAmount);
    if (isNaN(parsed) || parsed <= 0) return;

    setIsTopUpLoading(true);
    setSuccessMessage(null);

    // Simulate standard payment gateway loading delay
    setTimeout(() => {
      onTopUp(parsed);
      setIsTopUpLoading(false);
      if (isOffline) {
        setSuccessMessage(`Offline Top Up: Securely saved ₹${parsed.toLocaleString('en-IN')} to local offline cache!`);
      } else {
        setSuccessMessage(`Successfully added ₹${parsed.toLocaleString('en-IN')} to your e-wallet!`);
      }
      setTimeout(() => setSuccessMessage(null), 3500);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Tab Header */}
      <div className="flex justify-between items-center shrink-0">
        <div>
          <span className="text-[10px] text-[#ff0055] font-extrabold uppercase tracking-wider font-sans">e-Payment Gateway</span>
          <h2 className="text-xl font-display font-black text-slate-950 mt-0.5">Transit Wallet</h2>
        </div>
        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
          <Wallet className="w-4 h-4 text-[#ff0055]" />
        </div>
      </div>

      {/* Offline cache notice banner */}
      {isOffline && (
        <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600 animate-pulse" />
            <div>
              <p className="font-extrabold uppercase text-[9.5px] tracking-wider text-amber-800">Offline Cache Active</p>
              <p className="text-[10px] text-slate-600 leading-tight">Displaying wallet balance from local cache.</p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-700 px-2 py-0.5 rounded-full uppercase border border-amber-500/30">
            Local Cache
          </span>
        </div>
      )}

      {/* WALLET BALANCE HERO CARD (Classic Slate Dark Theme Matching) */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md relative overflow-hidden">
        {/* Decorative ambient gold light overlay */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-24 h-24 bg-[#ff0055]/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Simulated Balance</p>
            <h3 className="text-3xl font-display font-black tracking-tight mt-1.5 text-slate-100 font-mono">
              ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <span className="text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1">
            <Coins className="w-3 h-3 text-amber-400" /> ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-800 relative z-10 text-[11px]">
          <div>
            <span className="text-slate-400 block uppercase font-bold tracking-wider text-[9px]">Linked Transit Pass</span>
            <span className="text-slate-200 font-bold block mt-1 font-mono">{pass.passNo}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-bold tracking-wider text-[9px]">Pass Renewal Price</span>
            <span className="text-slate-200 font-bold block mt-1 text-red-400">₹{pass.amount} / {pass.type}</span>
          </div>
        </div>
      </div>

      {/* TOP UP FUNDS FORM */}
      <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-3xl space-y-4">
        <div className="flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-[#ff0055]" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Up Wallet</h3>
        </div>

        <form onSubmit={handleTopUpSubmit} className="space-y-3.5">
          <div className="relative font-mono">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
            <input 
              type="number"
              min="10"
              max="10000"
              value={topUpAmount}
              onChange={(e) => setTopUpAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-8 pr-4 text-sm text-slate-800 font-bold focus:outline-none focus:border-red-500"
              required
            />
          </div>

          {/* Quick preset buttons */}
          <div className="flex gap-2">
            {[100, 500, 1000, 2000].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAdd(val)}
                className={`flex-1 py-1.5 text-xs font-bold font-mono rounded-lg border transition-all ${
                  topUpAmount === val.toString()
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                +₹{val}
              </button>
            ))}
          </div>

          <button 
            type="submit"
            disabled={isTopUpLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff0a24] to-[#db0060] hover:opacity-90 disabled:opacity-75 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98 cursor-pointer uppercase tracking-wider"
          >
            {isTopUpLoading ? 'Authorizing Mock payment...' : 'Load Mock Funds'}
          </button>
        </form>

        {/* Success message banner */}
        {successMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] p-2.5 rounded-xl flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </motion.div>
        )}
      </div>

      {/* WALLET INTEGRATION EXPLANATION / ADVISORY */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl space-y-2 text-xs">
        <div className="flex items-center gap-1.5 text-amber-800">
          <AlertCircle className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-wider">Pass Renewal Integration</span>
        </div>
        <p className="text-slate-700 leading-relaxed font-sans text-[11px] font-medium">
          When renewing your travel pass, the portal will automatically deduct the matching pass amount (e.g. ₹{pass.amount} for {pass.type}) directly from your Transit Wallet balance instead of letting you renew for free. Keep your wallet topped up to avoid service interruption!
        </p>
      </div>

      {/* TRANSACTION LEDGER */}
      <div className="bg-white border border-slate-100 shadow-sm p-4 rounded-3xl space-y-3.5">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Wallet Ledger History</h3>
        
        <div className="space-y-2 max-h-[220px] overflow-y-auto no-scrollbar">
          {transactions.length === 0 ? (
            <div className="text-center py-6 text-slate-400">
              <Info className="w-8 h-8 mx-auto stroke-[1.2] mb-1.5" />
              <p className="text-[10px] font-medium">No wallet ledger transactions recorded yet</p>
            </div>
          ) : (
            transactions.slice().reverse().map((tx) => (
              <div 
                key={tx.id} 
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${
                    tx.type === 'Top Up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {tx.type === 'Top Up' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-800">{tx.description}</h4>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">{tx.timestamp}</p>
                  </div>
                </div>
                <span className={`text-[11px] font-mono font-bold ${
                  tx.type === 'Top Up' ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {tx.type === 'Top Up' ? '+' : '-'}₹{tx.amount}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
