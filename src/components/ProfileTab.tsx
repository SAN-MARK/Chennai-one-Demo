import React, { useState } from 'react';
import { UserProfile, IdVerification, IdType, UserRole } from '../types';
import { INITIAL_USER } from '../data';
import { ShieldCheck, User, Settings, ShieldAlert, BadgeCheck, Eye, EyeOff, FileLock, Users, ClipboardList, Database, Check, X } from 'lucide-react';

interface ProfileTabProps {
  user: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  onLogout?: () => void;
}

// Initial mock ledger of users for the Hub Operator Console
const MOCK_USERS_LEDGER = [
  { Timestamp: '2026-07-11 09:12:00', Name: 'Sanjeev M', Email: 'iamheresanjeev@gmail.com', Phone: '+91 98401 23456' },
  { Timestamp: '2026-07-10 14:45:10', Name: 'Aravind Swamy', Email: 'aravind@gmail.com', Phone: '+91 94440 12345' },
  { Timestamp: '2026-07-09 11:22:15', Name: 'Priya Dharshini', Email: 'priya@outlook.com', Phone: '+91 98840 56789' }
];

// Initial mock pending identity submissions for operator audit
const INITIAL_ID_VERIFICATIONS = [
  { Timestamp: '2026-07-11 10:05:00', UserEmail: 'iamheresanjeev@gmail.com', FullName: 'Sanjeev M', IDType: 'Aadhaar' as IdType, IDNumber: '1234-5678-9012', VerificationStatus: 'Verified', ReviewNotes: 'Primary details validated successfully.', DocumentLink: 'doc_aadhaar_ref.pdf' },
  { Timestamp: '2026-07-10 16:30:11', UserEmail: 'aravind@gmail.com', FullName: 'Aravind Swamy', IDType: 'PAN' as IdType, IDNumber: 'ABCDE1234F', VerificationStatus: 'Pending', ReviewNotes: 'Awaiting visual photo clear verification.', DocumentLink: 'doc_pan_ref.pdf' },
  { Timestamp: '2026-07-09 13:10:05', UserEmail: 'priya@outlook.com', FullName: 'Priya Dharshini', IDType: 'Voter ID' as IdType, IDNumber: 'XYZ9876543', VerificationStatus: 'Verified', ReviewNotes: 'Electoral data fully synchronized.', DocumentLink: 'doc_voter_ref.pdf' }
];

export default function ProfileTab({ user, onUserUpdate, onLogout }: ProfileTabProps) {
  const [role, setRole] = useState<UserRole>(user.role);
  const [showIdMask, setShowIdMask] = useState(true);
  
  // State for user's own identity verification details
  const [idVerification, setIdVerification] = useState<IdVerification>(() => {
    const saved = localStorage.getItem('findback_id_verification');
    return saved ? JSON.parse(saved) : {
      idType: 'Aadhaar',
      idNumber: '1234-5678-9012',
      status: 'Verified',
      reviewNotes: 'Authenticated profile successfully validated through FindBack KYC gateway.'
    };
  });

  // Keep it in sync with localStorage
  React.useEffect(() => {
    localStorage.setItem('findback_id_verification', JSON.stringify(idVerification));
  }, [idVerification]);

  // Operators database states
  const [operatorVerifications, setOperatorVerifications] = useState(INITIAL_ID_VERIFICATIONS);
  const [inputIDNum, setInputIDNum] = useState('');
  const [inputType, setInputType] = useState<IdType>('Aadhaar');
  const [isSubmittingID, setIsSubmittingID] = useState(false);

  const handleRoleChange = (selectedRole: UserRole) => {
    setRole(selectedRole);
    onUserUpdate({ ...user, role: selectedRole });
  };

  const submitNewID = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputIDNum) return;
    
    setIsSubmittingID(true);
    setTimeout(() => {
      setIdVerification({
        idType: inputType,
        idNumber: inputIDNum,
        status: 'Pending',
        reviewNotes: 'Your document submission is in queue for Hub Operator review.'
      });
      
      // Also inject into the simulated Operator Ledger for real-time audit!
      setOperatorVerifications(prev => [
        {
          Timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          UserEmail: user.email,
          FullName: user.name,
          IDType: inputType,
          IDNumber: inputIDNum,
          VerificationStatus: 'Pending',
          ReviewNotes: 'Auto-logged from user dashboard.',
          DocumentLink: 'doc_custom_uploaded.pdf'
        },
        ...prev
      ]);

      setInputIDNum('');
      setIsSubmittingID(false);
    }, 1000);
  };

  const handleApproveID = (email: string) => {
    setOperatorVerifications(prev => 
      prev.map(item => 
        item.UserEmail === email 
          ? { ...item, VerificationStatus: 'Verified', ReviewNotes: 'Manually audited & approved by active operator.' } 
          : item
      )
    );
    if (email === user.email) {
      setIdVerification(prev => ({ ...prev, status: 'Verified', reviewNotes: 'Manually audited & approved by active operator.' }));
    }
  };

  const handleRejectID = (email: string) => {
    setOperatorVerifications(prev => 
      prev.map(item => 
        item.UserEmail === email 
          ? { ...item, VerificationStatus: 'Rejected', ReviewNotes: 'Document upload blurred or incorrect parameters.' } 
          : item
      )
    );
    if (email === user.email) {
      setIdVerification(prev => ({ ...prev, status: 'Rejected', reviewNotes: 'Document upload blurred or incorrect parameters.' }));
    }
  };

  // Helper to mask Aadhaar/National ID strictly as requested
  const maskIDValue = (type: IdType, value: string) => {
    if (showIdMask) {
      return `[${type} Redacted]`;
    }
    // Mask but show last 4 chars for legibility if toggled off
    const clean = value.replace(/[-\s]/g, '');
    const lastFour = clean.slice(-4);
    return `•••• •••• ${lastFour}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-5 overflow-y-auto no-scrollbar" id="profile-management-tab">
      
      {/* Profile Header Block */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-slate-900 shrink-0">
        <div className="relative w-20 h-20 rounded-full border-4 border-slate-800 bg-slate-900 flex items-center justify-center text-3xl font-display font-extrabold text-amber-500 shadow-xl overflow-hidden mb-3">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            // Extract & capitalize leading character as fallback avatar
            <span>{user.name.trim().charAt(0).toUpperCase()}</span>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-slate-950/70 py-0.5 text-[9px] text-slate-400 font-semibold uppercase font-mono">
            {role}
          </div>
        </div>

        <h2 className="text-lg font-display font-bold text-slate-100">{user.name}</h2>
        <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
        <p className="text-xs text-slate-500 font-mono mt-0.5">{user.phone}</p>
      </div>

      {/* Role-Based Access Control Switcher */}
      <div className="mt-5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <h3 className="text-xs font-display font-bold tracking-wider text-slate-400 uppercase mb-3 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-amber-400" />
          System Privileges (RBAC Mode)
        </h3>
        <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
          Switch roles below to simulate system-level UI adaptations. Standard profiles undergo strict DOM removal of Operator components.
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs font-semibold font-sans">
          {(['OWNER', 'FINDER', 'HUB_OPERATOR'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => handleRoleChange(r)}
              className={`py-2 rounded-xl transition-all border text-[10px] ${
                role === r 
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-black' 
                  : 'bg-slate-950 border-slate-850 text-slate-400 hover:text-white'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* FindBack Identity Verification Section */}
      <div className="mt-5 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-display font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            FindBack Identity Verification
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            idVerification.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' :
            idVerification.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
            'bg-rose-500/10 text-rose-400'
          }`}>
            {idVerification.status}
          </span>
        </div>

        {idVerification.status === 'Verified' ? (
          <div className="space-y-3.5">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850/80 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-sans font-bold text-[10px] uppercase tracking-wider">ID Class</span>
                <span className="text-slate-300 font-bold font-sans">{idVerification.idType}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-500 font-sans font-bold text-[10px] uppercase tracking-wider">Document ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-300 font-mono font-medium">
                    {maskIDValue(idVerification.idType, idVerification.idNumber)}
                  </span>
                  <button 
                    onClick={() => setShowIdMask(!showIdMask)}
                    className="p-1 rounded bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
                    title={showIdMask ? "Decrypt / Unmask ID" : "Encrypt / Mask ID"}
                  >
                    {showIdMask ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20 text-[11px] leading-relaxed text-emerald-400">
              <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{idVerification.reviewNotes}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Verify your identity with FindBack to unlock seamless multi-hub operations and premium transport pass management.
            </p>
            
            <form onSubmit={submitNewID} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {(['Aadhaar', 'PAN', 'Voter ID'] as IdType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInputType(type)}
                    className={`py-2 px-3 text-xs rounded-lg border font-semibold transition-all ${
                      inputType === type 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-950 border-slate-900 text-slate-500'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={`Enter your ${inputType} ID...`}
                  value={inputIDNum}
                  onChange={(e) => setInputIDNum(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingID}
                className="w-full bg-slate-800 hover:bg-slate-750 font-bold text-xs py-2.5 rounded-xl border border-slate-700 text-white flex items-center justify-center gap-2"
              >
                {isSubmittingID ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FileLock className="w-4 h-4 text-amber-400" /> Secure Submission
                  </>
                )}
              </button>
            </form>

            {idVerification.status === 'Pending' && (
              <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 text-[11px] leading-relaxed text-amber-400 flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>{idVerification.reviewNotes}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* STRICT PRIVILEGED MODULE: Hub Operator Console */}
      {/* EVALUATESPrivileges: ONLY renders when role === 'HUB_OPERATOR'. Otherwise absolute DOM removal! */}
      {role === 'HUB_OPERATOR' ? (
        <div className="mt-5 bg-[#0f212f]/80 p-4 rounded-2xl border border-blue-900/40 space-y-4 animate-[fadeIn_0.3s_ease]" id="privileged-hub-operator-console">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-blue-900/30">
            <div>
              <h3 className="text-xs font-display font-black tracking-wider text-blue-400 uppercase flex items-center gap-1.5">
                <Database className="w-4 h-4 text-blue-400" />
                Hub Operator Console
              </h3>
              <p className="text-[10px] text-blue-300">Level 3 Administrative Authority</p>
            </div>
            <span className="text-[9px] font-sans font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
              PRIVILEGED
            </span>
          </div>

          {/* Section 1: Primary Users Ledger */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              Primary Users Ledger ({MOCK_USERS_LEDGER.length})
            </h4>
            <div className="space-y-1.5">
              {MOCK_USERS_LEDGER.map((userLedger, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl text-[10px]">
                  <div className="flex justify-between font-bold text-slate-300">
                    <span>{userLedger.Name}</span>
                    <span className="text-[9px] text-slate-600 font-mono">{userLedger.Timestamp}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 mt-1 font-mono">
                    <span>{userLedger.Email}</span>
                    <span>{userLedger.Phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: ID verification audit queue */}
          <div className="space-y-2 pt-2 border-t border-blue-900/20">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <ClipboardList className="w-3.5 h-3.5 text-blue-400" />
              Identity Verification Audit Queue
            </h4>
            
            <div className="space-y-2">
              {operatorVerifications.map((audit, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-900 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-200">{audit.FullName}</span>
                      <p className="text-[9px] text-slate-500 font-mono mt-0.5">{audit.UserEmail}</p>
                    </div>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                      audit.VerificationStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' :
                      audit.VerificationStatus === 'Pending' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-rose-500/10 text-rose-400'
                    }`}>
                      {audit.VerificationStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[9px] bg-slate-900 p-1.5 rounded font-sans">
                    <div className="text-slate-500 font-bold">Document Link:</div>
                    <div className="text-slate-300 text-right underline cursor-pointer font-mono">{audit.DocumentLink}</div>
                    <div className="text-slate-500 font-bold">Document No:</div>
                    <div className="text-slate-300 text-right font-mono">
                      {/* Safety Rule - mask on display but allow audit if toggled */}
                      {maskIDValue(audit.IDType, audit.IDNumber)}
                    </div>
                  </div>

                  {audit.VerificationStatus === 'Pending' && (
                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => handleApproveID(audit.UserEmail)}
                        className="flex-grow py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-[9px] font-bold text-white flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Approve Verification
                      </button>
                      <button
                        onClick={() => handleRejectID(audit.UserEmail)}
                        className="flex-grow py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center gap-1"
                      >
                        <X className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ABSOLUTE DOM-LEVEL REMOVAL OF PRIVILEGED MODULE FOR STANDARD PROFILES */
        null
      )}

      {/* Sign Out Button */}
      {onLogout && (
        <button
          onClick={onLogout}
          className="mt-6 w-full py-3.5 px-4 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 border border-rose-900/40 text-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Sign Out & Clear Session
        </button>
      )}
    </div>
  );
}
