import React, { useState } from 'react';
import { HelpCircle, Phone, Clock, MessageSquare, CornerDownRight, Send, X } from 'lucide-react';

interface HelpSupportProps {
  onClose: () => void;
}

const FAQS = [
  { q: "Is an OTP required for pass validation?", a: "No! Official MTC Update: Your pass is automatically activated on purchase/renewal. No SMS or OTP verification is needed during transit checks." },
  { q: "Can I transfer my pass to another phone?", a: "MTC Bus Passes are securely tied to your registered device and registered ID. Transferring files or mirroring void verification security." },
  { q: "How do I renew my monthly pass?", a: "Simply tap the 'Renew' button on the Passes screen, select your package and payload, pay via integrated UPI portals, and your ticket is automatically compiled." },
  { q: "Is my document identity masked?", a: "Yes. In compliance with data safety standards, all national ID parameters (like Aadhaar and PAN) are heavily masked on client interfaces and secure transmission grids." }
];

export default function HelpSupport({ onClose }: HelpSupportProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<any[]>([
    { sender: 'bot', text: 'Vanakkom! Welcome to Chennai Metropolitan Transport Support. How can I assist you with your active bus pass today?' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Simulate Transit bot response
    setTimeout(() => {
      let botResponse = "I can certainly help you with that! MTC support agent has logged your concern. Would you like us to review your ticket or pass status?";
      if (userMsg.toLowerCase().includes('renew') || userMsg.toLowerCase().includes('price')) {
        botResponse = "Renewals are automated on our secure gateway! You can purchase general monthly passes for ₹1000, students subsidized passes for ₹500, or premium AC routes for ₹1500.";
      } else if (userMsg.toLowerCase().includes('otp') || userMsg.toLowerCase().includes('activation')) {
        botResponse = "Official MTC update confirms that NO OTP is required! Your pass is pre-activated and instantly valid on any security scanner.";
      } else if (userMsg.toLowerCase().includes('aadhaar') || userMsg.toLowerCase().includes('id')) {
        botResponse = "Rest assured, your Aadhaar/national identity numbers are fully masked. We only show safety placeholders on display, securing your data.";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
    }, 1000);
  };

  return (
    <div className="absolute inset-0 bg-ivory-sand text-charcoal p-5 flex flex-col z-50 overflow-hidden" id="mtc-help-pane">
      
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-warm-gray/15 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-white rounded-xl border border-warm-gray/20">
            <HelpCircle className="w-5 h-5 text-kumkum-maroon animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-display font-bold text-charcoal font-sans">MTC Support Hub</h2>
            <p className="text-[10px] text-warm-gray">Chennai Transit Helpline and automated AI chat desk</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 rounded-full bg-white text-warm-gray hover:text-charcoal transition-all active:scale-90 border border-warm-gray/20 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main split: FAQs and active chat */}
      <div className="flex-grow overflow-y-auto no-scrollbar space-y-5 pt-4">
        
        {/* FAQs */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-display font-bold text-warm-gray uppercase tracking-wider flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-kumkum-maroon" />
            Frequently Answered Questions
          </h3>

          <div className="space-y-2">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx}
                  className="bg-white border border-warm-gray/20 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-3 flex justify-between items-center text-xs font-bold text-charcoal hover:text-kumkum-maroon cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className={`text-kumkum-maroon text-base transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                  </button>
                  {isOpen && (
                    <div className="px-3 pb-3 text-[11px] leading-relaxed text-warm-gray border-t border-warm-gray/15 pt-2 flex gap-2">
                      <CornerDownRight className="w-3.5 h-3.5 text-kumkum-maroon shrink-0" />
                      <span>{faq.a}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Chat Screen */}
        <div className="space-y-2.5 flex flex-col h-[280px]">
          <h3 className="text-xs font-display font-bold text-warm-gray uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <MessageSquare className="w-4 h-4 text-kumkum-maroon" />
            24/7 Transit Support Chat
          </h3>

          <div className="flex-grow bg-white border border-warm-gray/20 rounded-2xl flex flex-col overflow-hidden shadow-inner">
            {/* Messages body */}
            <div className="flex-grow p-3 overflow-y-auto no-scrollbar space-y-2 text-[11px]">
              {chatMessages.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`max-w-[85%] rounded-xl p-2.5 leading-relaxed ${
                    msg.sender === 'bot' 
                      ? 'bg-ivory-sand border border-warm-gray/20 text-charcoal mr-auto' 
                      : 'bg-kumkum-maroon text-white font-medium ml-auto shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input field */}
            <form onSubmit={handleSend} className="p-2 border-t border-warm-gray/15 bg-ivory-sand shrink-0 flex gap-1.5">
              <input
                type="text"
                placeholder="Type your transit query..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-grow bg-white border border-warm-gray/20 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-kumkum-maroon"
              />
              <button 
                type="submit"
                className="bg-kumkum-maroon text-white hover:bg-kumkum-maroon/90 rounded-xl p-2 font-bold transition-all active:scale-95 shrink-0 cursor-pointer border-none"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
