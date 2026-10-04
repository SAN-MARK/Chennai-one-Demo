import React, { useState } from 'react';
import { UserProfile, MtcPass } from '../types';
import { 
  ArrowLeft, 
  Heart, 
  Sliders, 
  Train, 
  CreditCard, 
  Send, 
  MapPin, 
  Headphones, 
  ShieldCheck, 
  Info, 
  Languages, 
  LogOut, 
  ChevronRight,
  User,
  CheckCircle2,
  X
} from 'lucide-react';

interface ProfileTabProps {
  user: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  pass: MtcPass;
  onPassUpdate: (updatedPass: MtcPass) => void;
  onLogout?: () => void;
  onBack?: () => void;
}

export default function ProfileTab({ user, onUserUpdate, pass, onPassUpdate, onLogout, onBack }: ProfileTabProps) {
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [activeSubView, setActiveSubView] = useState<string | null>(null);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialLetter = user.name ? user.name.trim().charAt(0).toUpperCase() : 'S';

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUserUpdate({
      ...user,
      name: editName,
      email: editEmail,
      phone: editPhone
    });
    onPassUpdate({
      ...pass,
      name: editName
    });
    setShowEditProfileModal(false);
    triggerToast('Profile details updated successfully');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8f9fa] text-slate-800 p-4 font-sans select-none pb-20">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl z-50 flex items-center gap-2 animate-[bounce_0.5s_ease]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Row with Back Button matching screenshot */}
      <div className="flex items-center mb-5">
        <button 
          onClick={onBack} 
          className="w-10 h-10 rounded-full bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* User Header Section matching screenshot */}
      <div className="flex items-center gap-4 mb-6 px-1">
        {/* Red Avatar Circle */}
        <div className="w-16 h-16 rounded-full bg-[#ff3b30] text-white flex items-center justify-center font-bold text-2xl shadow-md shrink-0">
          {initialLetter}
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight uppercase">
            {user.name || 'SANJEEV'}
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            {user.email || 'iamheresanjeev@gmail.com'}
          </p>
          <button 
            onClick={() => setShowEditProfileModal(true)}
            className="text-sm font-bold text-[#007aff] mt-1 block hover:underline cursor-pointer bg-transparent p-0 border-none outline-none"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Grouped Settings Cards (Exact copy of screenshot) */}

      {/* Group 1 Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs divide-y divide-slate-100 mb-4 overflow-hidden">
        <button 
          onClick={() => triggerToast('Favourites opened')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-slate-800 fill-slate-800/20" />
            <span className="text-sm font-bold text-slate-800">Favourites</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={() => triggerToast('Preferences opened')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-slate-800" />
            <span className="text-sm font-bold text-slate-800">Preferences</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={() => triggerToast('Transit Preferences opened')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Train className="w-5 h-5 text-slate-800" />
            <span className="text-sm font-bold text-slate-800">Transit Preferences</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={() => triggerToast('Payment Management opened')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-slate-800" />
            <span className="text-sm font-bold text-slate-800">Payment Management</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Group 2 Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs divide-y divide-slate-100 mb-4 overflow-hidden">
        <button 
          onClick={() => triggerToast('Share link copied to clipboard')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Send className="w-5 h-5 text-slate-800" />
            <span className="text-sm font-bold text-slate-800">Share with Friends</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={() => triggerToast('My Rides history loaded')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-slate-800" />
            <span className="text-sm font-bold text-slate-800">My Rides</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={() => triggerToast('Connecting to Help and Support...')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Headphones className="w-5 h-5 text-slate-800" />
            <span className="text-sm font-bold text-slate-800">Help and Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={() => triggerToast('Safety & Emergency features active')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-slate-800" />
            <span className="text-sm font-bold text-slate-800">Safety</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Group 3 Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs divide-y divide-slate-100 mb-4 overflow-hidden">
        <button 
          onClick={() => triggerToast('Chennai One Transit Portal v3.2.0')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-slate-800" />
            <span className="text-sm font-bold text-slate-800">About Us</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={() => triggerToast('Language set to English (Tamil available)')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Languages className="w-5 h-5 text-slate-800" />
            <span className="text-sm font-bold text-slate-800">App Language</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={onLogout}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-rose-50 transition-colors text-left cursor-pointer text-rose-600"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-rose-600" />
            <span className="text-sm font-bold text-rose-600">Logout</span>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>

      {/* View/Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm space-y-4 text-slate-900 shadow-2xl animate-[fadeIn_0.2s_ease]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">User Profile Details</h3>
              <button 
                onClick={() => setShowEditProfileModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#007aff]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#007aff]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mobile Number</label>
                <input 
                  type="text" 
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#007aff]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowEditProfileModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 rounded-xl bg-[#007aff] text-white font-bold hover:bg-blue-600 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
