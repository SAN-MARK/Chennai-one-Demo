import React, { useState } from 'react';
import { TransactionHistory } from '../types';
import { INITIAL_HISTORY } from '../data';
import { History, Search, Download, Clock, CreditCard, ChevronRight, X } from 'lucide-react';

interface HistoryLogsProps {
  onClose?: () => void;
}

export default function HistoryLogs({ onClose }: HistoryLogsProps) {
  const [history, setHistory] = useState<TransactionHistory[]>(INITIAL_HISTORY);
  const [search, setSearch] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<TransactionHistory | null>(null);

  const filteredHistory = history.filter(txn => 
    txn.id.toLowerCase().includes(search.toLowerCase()) ||
    txn.passNo.toLowerCase().includes(search.toLowerCase()) ||
    txn.paymentMethod.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute inset-0 bg-ivory-sand text-charcoal p-5 flex flex-col z-50 overflow-hidden" id="mtc-history-pane">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-warm-gray/15 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-white rounded-xl border border-warm-gray/20">
            <History className="w-5 h-5 text-kumkum-maroon animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-charcoal">Transaction Logs</h2>
            <p className="text-[10px] text-warm-gray">Audit trail of previous digital bus pass renewals</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-white text-warm-gray hover:text-charcoal transition-all active:scale-90 border border-warm-gray/20 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mt-4 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-warm-gray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by Txn ID, Pass No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-warm-gray/20 rounded-xl py-2.5 pl-10 pr-4 text-xs text-charcoal focus:outline-none focus:border-kumkum-maroon"
          />
        </div>
      </div>

      {/* History Ledger List */}
      <div className="flex-grow overflow-y-auto no-scrollbar space-y-2.5 mt-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((txn) => (
            <div 
              key={txn.id}
              onClick={() => setSelectedTxn(txn)}
              className="bg-white border border-warm-gray/20 hover:border-kumkum-maroon/30 p-3.5 rounded-2xl flex justify-between items-center cursor-pointer transition-all active:scale-[0.99] shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ivory-sand flex items-center justify-center text-warm-gray border border-warm-gray/15">
                  <CreditCard className="w-5 h-5 text-warm-gray" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-charcoal">{txn.type} (₹{txn.amount})</h4>
                  <p className="text-[10px] text-warm-gray font-mono mt-0.5">{txn.id} • {txn.paymentMethod}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-1.5">
                <div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    txn.status === 'Success' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-terracotta/10 text-terracotta'
                  }`}>
                    {txn.status}
                  </span>
                  <p className="text-[9px] text-warm-gray mt-1">{txn.timestamp.split(' ')[0]}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-warm-gray" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-warm-gray flex flex-col items-center justify-center space-y-2">
            <Clock className="w-8 h-8 text-warm-gray stroke-[1.5]" />
            <p className="text-xs">No previous transactions match your query.</p>
          </div>
        )}
      </div>

      {/* Detailed Transaction Drawer Modal */}
      {selectedTxn && (
        <div className="absolute inset-0 bg-deep-teal/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-warm-gray/20 rounded-3xl w-full max-w-[340px] overflow-hidden shadow-2xl animate-[scaleIn_0.2s_ease]">
            <div className="p-4 border-b border-warm-gray/15 flex justify-between items-center bg-ivory-sand">
              <span className="text-xs font-bold text-warm-gray">TXN AUDIT</span>
              <button 
                onClick={() => setSelectedTxn(null)}
                className="text-warm-gray hover:text-charcoal p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs">
              <div className="text-center py-3">
                <span className="text-warm-gray text-[10px] uppercase font-bold tracking-wider">Amount Paid</span>
                <h3 className="text-3xl font-extrabold text-kumkum-maroon mt-1">₹{selectedTxn.amount}.00</h3>
                <span className="text-[9px] text-emerald-600 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full mt-2 inline-block">
                  SECURE TRANSACTION
                </span>
              </div>

              <div className="space-y-2.5 border-t border-warm-gray/15 pt-3">
                <div className="flex justify-between">
                  <span className="text-warm-gray font-medium">Receipt ID</span>
                  <span className="text-charcoal font-mono font-bold">{selectedTxn.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray font-medium">Assoc. Pass No</span>
                  <span className="text-charcoal font-mono font-bold">{selectedTxn.passNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray font-medium">Gateway Vendor</span>
                  <span className="text-charcoal font-semibold">{selectedTxn.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray font-medium">Timestamp</span>
                  <span className="text-charcoal font-medium font-mono">{selectedTxn.timestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-gray font-medium">Settlement Status</span>
                  <span className="text-emerald-600 font-bold">SETTLED (SUCCESS)</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  alert(`Receipt ${selectedTxn.id} successfully compiled for download. Check local storage folder.`);
                  setSelectedTxn(null);
                }}
                className="w-full bg-kumkum-maroon hover:bg-kumkum-maroon/90 text-white font-bold py-3 rounded-xl transition-all text-center flex items-center justify-center gap-2 mt-4 cursor-pointer border-none"
              >
                <Download className="w-4 h-4 text-white" /> Export Digital Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
