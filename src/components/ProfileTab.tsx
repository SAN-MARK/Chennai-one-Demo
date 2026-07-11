import React, { useState } from 'react';
import { UserProfile, IdVerification, IdType, UserRole } from '../types';
import { INITIAL_USER } from '../data';
import { ShieldCheck, User, Settings, ShieldAlert, BadgeCheck, Eye, EyeOff, FileLock, Users, ClipboardList, Database, Check, X } from 'lucide-react';

interface ProfileTabProps {
  user: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
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

export default function ProfileTab({ user, onUserUpdate }: ProfileTabProps) {
  const [role, setRole] = useState<UserRole>(user.role);
  const [showIdMask, setShowIdMask] = useState(true);
  
  // State for user's own identity verification details
  const [idVerification, setIdVerification] = useState<IdVerification>({
    idType: 'Aadhaar',
    idNumber: '1234-5678-9012',
    status: 'Verified',
    reviewNotes: 'Authenticated profile successfully validated through FindBack KYC gateway.'
  });

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
    <div className="flex flex-col h-full bg-ivory-sand text-charcoal p-5 overflow-y-auto no-scrollbar" id="profile-management-tab">
      
      {/* Profile Header Block */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-warm-gray/15 shrink-0">
        <div className="relative w-20 h-20 rounded-full border-4 border-warm-gray/25 bg-white flex items-center justify-center text-3xl font-display font-extrabold text-kumkum-maroon shadow-xl overflow-hidden mb-3">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            // Extract & capitalize leading character as fallback avatar
            <span>{user.name.trim().charAt(0).toUpperCase()}</span>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-kumkum-maroon py-0.5 text-[9px] text-white font-semibold uppercase font-mono">
            {role}
          </div>
        </div>

        <h2 className="text-lg font-display font-bold text-charcoal">{user.name}</h2>
        <p className="text-xs text-warm-gray font-mono mt-0.5">{user.email}</p>
        <p className="text-xs text-warm-gray font-mono mt-0.5">{user.phone}</p>
      </div>

      {/* Role-Based Access Control Switcher */}
      <div className="mt-5 bg-white p-4 rounded-2xl border border-warm-gray/20 shadow-sm">
        <h3 className="text-xs font-display font-bold tracking-wider text-warm-gray uppercase mb-3 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-kumkum-maroon" />
          System Privileges (RBAC Mode)
        </h3>
        <p className="text-[11px] text-warm-gray mb-4 leading-relaxed">
          Switch roles below to simulate system-level UI adaptations. Standard profiles undergo strict DOM removal of Operator components.
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs font-bold font-mono">
          {(['OWNER', 'FINDER', 'HUB_OPERATOR'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => handleRoleChange(r)}
              className={`py-2 rounded-xl transition-all border text-[10px] cursor-pointer ${
                role === r 
                  ? 'bg-kumkum-maroon text-white border-kumkum-maroon font-black' 
                  : 'bg-ivory-sand border-warm-gray/15 text-warm-gray hover:text-charcoal'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* FindBack Identity Verification Section */}
      <div className="mt-5 bg-white p-4 rounded-2xl border border-warm-gray/20 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-display font-bold tracking-wider text-warm-gray uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-kumkum-maroon" />
            FindBack Identity Verification
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            idVerification.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-700' :
            idVerification.status === 'Pending' ? 'bg-temple-gold/20 text-charcoal' :
            'bg-terracotta/10 text-terracotta'
          }`}>
            {idVerification.status}
          </span>
        </div>

        {idVerification.status === 'Verified' ? (
          <div className="space-y-3.5">
            <div className="bg-ivory-sand p-3 rounded-xl border border-warm-gray/15 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-warm-gray font-mono">ID CLASS</span>
                <span className="text-charcoal font-bold">{idVerification.idType}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-warm-gray font-mono">DOCUMENT ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-charcoal font-mono font-medium">
                    {maskIDValue(idVerification.idType, idVerification.idNumber)}
                  </span>
                  <button 
                    onClick={() => setShowIdMask(!showIdMask)}
                    className="p-1 rounded bg-white border border-warm-gray/20 text-warm-gray hover:text-charcoal transition-colors cursor-pointer"
                    title={showIdMask ? "Decrypt / Unmask ID" : "Encrypt / Mask ID"}
                  >
                    {showIdMask ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 text-[11px] leading-relaxed text-emerald-700">
              <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{idVerification.reviewNotes}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[11px] text-warm-gray leading-relaxed">
              Verify your identity with FindBack to unlock seamless multi-hub operations and premium transport pass management.
            </p>
            
            <form onSubmit={submitNewID} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {(['Aadhaar', 'PAN', 'Voter ID'] as IdType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInputType(type)}
                    className={`py-2 px-3 text-xs rounded-lg border font-semibold transition-all cursor-pointer ${
                      inputType === type 
                        ? 'bg-kumkum-maroon border-none text-white' 
                        : 'bg-ivory-sand border-warm-gray/15 text-warm-gray'
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
                  className="w-full bg-ivory-sand border border-warm-gray/20 rounded-xl py-2.5 px-4 text-xs text-charcoal placeholder-warm-gray/50 focus:outline-none focus:border-kumkum-maroon"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingID}
                className="w-full bg-kumkum-maroon hover:bg-kumkum-maroon/90 font-bold text-xs py-2.5 rounded-xl border-none text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmittingID ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <FileLock className="w-4 h-4 text-white" /> Secure Submission
                  </>
                )}
              </button>
            </form>

            {idVerification.status === 'Pending' && (
              <div className="bg-temple-gold/15 p-3 rounded-xl border border-temple-gold/30 text-[#856404] text-[11px] leading-relaxed flex items-start gap-2">
                <ShieldAlert className="w-5 h-5 text-kumkum-maroon shrink-0 mt-0.5" />
                <span>{idVerification.reviewNotes}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* STRICT PRIVILEGED MODULE: Hub Operator Console */}
      {/* EVALUATESPrivileges: ONLY renders when role === 'HUB_OPERATOR'. Otherwise absolute DOM removal! */}
      {role === 'HUB_OPERATOR' ? (
        <div className="mt-5 bg-deep-teal p-4 rounded-2xl border border-white/10 space-y-4 animate-[fadeIn_0.3s_ease] text-white shadow-lg" id="privileged-hub-operator-console">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h3 className="text-xs font-display font-black tracking-wider text-temple-gold uppercase flex items-center gap-1.5">
                <Database className="w-4 h-4 text-temple-gold" />
                Hub Operator Console
              </h3>
              <p className="text-[10px] text-slate-200 font-sans">Level 3 Administrative Authority</p>
            </div>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-kumkum-maroon text-white">
              PRIVILEGED
            </span>
          </div>

          {/* Section 1: Primary Users Ledger */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1 font-sans">
              <Users className="w-3.5 h-3.5 text-temple-gold" />
              Primary Users Ledger ({MOCK_USERS_LEDGER.length})
            </h4>
            <div className="space-y-1.5">
              {MOCK_USERS_LEDGER.map((userLedger, idx) => (
                <div key={idx} className="bg-[#072423] border border-white/5 p-2.5 rounded-xl text-[10px]">
                  <div className="flex justify-between font-bold text-white">
                    <span>{userLedger.Name}</span>
                    <span className="text-[9px] text-slate-300 font-mono">{userLedger.Timestamp}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 mt-1 font-mono">
                    <span>{userLedger.Email}</span>
                    <span>{userLedger.Phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: ID verification audit queue */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <h4 className="text-[10px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1 font-sans">
              <ClipboardList className="w-3.5 h-3.5 text-temple-gold" />
              Identity Verification Audit Queue
            </h4>
            
            <div className="space-y-2">
              {operatorVerifications.map((audit, idx) => (
                <div key={idx} className="bg-[#072423] border border-white/5 p-3 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-extrabold text-white">{audit.FullName}</span>
                      <p className="text-[9px] text-slate-300 font-mono mt-0.5">{audit.UserEmail}</p>
                    </div>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                      audit.VerificationStatus === 'Verified' ? 'bg-emerald-500/20 text-emerald-300' :
                      audit.VerificationStatus === 'Pending' ? 'bg-temple-gold/20 text-temple-gold' :
                      'bg-terracotta/20 text-terracotta'
                    }`}>
                      {audit.VerificationStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[9px] bg-deep-teal/40 p-1.5 rounded font-mono">
                    <div className="text-slate-300">Document Link:</div>
                    <div className="text-white text-right underline cursor-pointer">{audit.DocumentLink}</div>
                    <div className="text-slate-300">Document No:</div>
                    <div className="text-white text-right font-bold">
                      {/* Safety Rule - mask on display but allow audit if toggled */}
                      {maskIDValue(audit.IDType, audit.IDNumber)}
                    </div>
                  </div>

                  {audit.VerificationStatus === 'Pending' && (
                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => handleApproveID(audit.UserEmail)}
                        className="flex-grow py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-[9px] font-bold text-white flex items-center justify-center gap-1 border-none cursor-pointer"
                      >
                        <Check className="w-3 h-3" /> Approve Verification
                      </button>
                      <button
                        onClick={() => handleRejectID(audit.UserEmail)}
                        className="flex-grow py-1.5 rounded bg-terracotta hover:bg-terracotta/90 text-[9px] font-bold text-white flex items-center justify-center gap-1 border-none cursor-pointer"
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
    </div>
  );
}
