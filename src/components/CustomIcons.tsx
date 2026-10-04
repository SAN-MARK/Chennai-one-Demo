import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
  filled?: boolean;
}

export const HomeIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor", filled = false }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
  </svg>
);

export const PassesIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor", filled = false }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <rect x="2" y="5" width="20" height="14" rx="1" />
    <path d="M2 10h20" />
    <path d="M6 15h4" />
    <path d="M15 15h3" />
  </svg>
);

export const LiveIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor", filled = false }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <circle cx="12" cy="12" r="3" fill={filled ? color : "none"} />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14" />
  </svg>
);

export const TicketIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor", filled = false }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <path d="M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V9z" />
    <path d="M9 7v10" strokeDasharray="2 2" />
  </svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor", filled = false }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" fill={filled ? color : "none"} />
  </svg>
);

export const BusIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <rect x="4" y="3" width="16" height="15" rx="1" />
    <path d="M4 11h16" />
    <path d="M8 15h.01M16 15h.01" strokeWidth="2" strokeLinecap="round" />
    <path d="M6 18v2M18 18v2" />
  </svg>
);

export const TrainIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <rect x="4" y="3" width="16" height="14" rx="1" />
    <path d="M4 11h16" />
    <path d="M12 3v8" />
    <circle cx="8" cy="14" r="1" fill={color} />
    <circle cx="16" cy="14" r="1" fill={color} />
    <path d="M7 17l-3 4M17 17l3 4" />
  </svg>
);

export const MetroIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <path d="M4 4h16v12H4z" />
    <path d="M4 10h16" />
    <path d="M8 7h3M13 7h3" />
    <circle cx="8" cy="13" r="1" fill={color} />
    <circle cx="16" cy="13" r="1" fill={color} />
    <path d="M6 16l-2 5M18 16l2 5M9 21h6" />
  </svg>
);

export const CabIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <path d="M5 17h14v-5l-2-5H7L5 12v5z" />
    <path d="M9 4h6v3H9z" />
    <circle cx="7.5" cy="14.5" r="1.5" fill={color} />
    <circle cx="16.5" cy="14.5" r="1.5" fill={color} />
    <path d="M5 17v2M19 17v2" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

export const QrCodeIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <path d="M14 14h3v3h-3zM17 17h4v4h-4zM14 20h3" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ className = "w-4 h-4", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ className = "w-4 h-4", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = "w-4 h-4", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className = "w-4 h-4", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>
);

export const LocationIcon: React.FC<IconProps> = ({ className = "w-5 h-5", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <path d="M12 21s-7-5.33-7-11.5a7 7 0 0 1 14 0C19 15.67 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ className = "w-4 h-4", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ className = "w-4 h-4", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const RefreshIcon: React.FC<IconProps> = ({ className = "w-4 h-4", color = "currentColor" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square">
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);
