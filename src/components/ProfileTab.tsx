import React, { useState } from 'react';
import { UserProfile, IdVerification, IdType, UserRole, MtcPass } from '../types';
import { 
  Heart, 
  Sliders, 
  Train, 
  Wallet, 
  Share2, 
  MapPin, 
  Headphones, 
  ShieldCheck, 
  Info, 
  Globe, 
  LogOut, 
  ChevronRight, 
  ArrowLeft,
  Settings,
  Calendar,
  Eye,
  EyeOff,
  Database,
  Users,
  ClipboardList,
  Check,
  X
} from 'lucide-react';

interface ProfileTabProps {
  user: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  pass: MtcPass;
  onPassUpdate: (updatedPass: MtcPass) => void;
  onLogout?: () => void;
}

export default function ProfileTab({ user, onUserUpdate, pass, onPassUpdate, onLogout }: ProfileTabProps) {
  const [showDeveloperControls, setShowDeveloperControls] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);
  const [showIdMask, setShowIdMask] = useState(true);

  // Initial letter for fallback avatar
  const initial = user.name ? user.name.trim().charAt(0).toUpperCase() : 'S';

  const handleRoleChange = (selectedRole: UserRole) => {
    setRole(selectedRole);
    onUserUpdate({ ...user, role: selectedRole });
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] text-slate-800 p-4 overflow-y-auto no-scrollbar" id="profile-page-view">
      
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between pb-3 shrink-0">
        <button 
          onClick={() => window.history.back()}
          className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile</span>
        <button 
          onClick={() => setShowDeveloperControls(!showDeveloperControls)}
          className="text-[10px] font-bold text-slate-400 hover:text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-lg"
          title="Toggle Admin / RBAC Controls"
        >
          {showDeveloperControls ? "Hide Admin" : "Admin"}
        </button>
      </div>

      {/* User Avatar & Name Lockup (Matching Image 7 exactly) */}
      <div className="flex items-center gap-4 py-4 mb-2">
        {/* Bright red circle with bold white initial */}
        <div className="w-16 h-16 rounded-full bg-[#ff3b30] text-white flex items-center justify-center text-2xl font-black shadow-sm shrink-0">
          {initial}
        </div>

        <div className="flex flex-col">
          <h2 className="text-xl font-sans font-black text-slate-900 tracking-tight leading-tight uppercase">
            {user.name || 'SANJEEV'}
          </h2>
          <p className="text-xs font-sans text-slate-500 font-medium leading-tight mt-0.5">
            {user.email || 'iamheresanjeev@gmail.com'}
          </p>
          <button 
            onClick={() => alert(`Profile Info:\nName: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}`)}
            className="text-xs font-bold text-[#007aff] hover:underline text-left mt-1"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Group 1: Preferences & Payments (Matching Image 7) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs mb-3 overflow-hidden divide-y divide-slate-100">
        <button className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Heart className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-800">Favourites</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-800">Preferences</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Train className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-800">Transit Preferences</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Wallet className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-800">Payment Management</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Group 2: Rides & Support (Matching Image 7) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs mb-3 overflow-hidden divide-y divide-slate-100">
        <button className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Share2 className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-800">Share with Friends</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-800">My Rides</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Headphones className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-800">Help and Support</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-800">Safety</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Group 3: About & Logout (Matching Image 7) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs mb-6 overflow-hidden divide-y divide-slate-100">
        <button className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-800">About Us</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left">
          <div className="flex items-center gap-3">
            <Globe className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-800">App Language</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button 
          onClick={onLogout}
          className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left text-slate-900"
        >
          <div className="flex items-center gap-3">
            <LogOut className="w-4 h-4 text-slate-800" />
            <span className="text-xs font-bold text-slate-800">Logout</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* Developer / RBAC Controls Panel (collapsible for testing) */}
      {showDeveloperControls && (
        <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3 mb-6 animate-[fadeIn_0.2s_ease]">
          <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-amber-400" /> Admin / RBAC Mode
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {(['OWNER', 'FINDER', 'HUB_OPERATOR'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`py-1.5 px-2 rounded-xl text-[10px] font-mono font-bold transition-all ${
                  role === r ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Active Role: <span className="text-amber-300 font-bold">{role}</span>
          </div>
        </div>
      )}

    </div>
  );
}
