export type MtcPassType = 'General' | 'Student' | 'AC' | 'Senior';

export interface MtcPass {
  id: string;
  passNo: string;
  name: string;
  photoUrl: string;
  type: MtcPassType;
  amount: number;
  validFrom: string;
  validTo: string;
  status: 'Active' | 'Expired' | 'Pending';
  activatedAt: string;
}

export type UserRole = 'OWNER' | 'FINDER' | 'HUB_OPERATOR';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  role: UserRole;
}

export type IdType = 'Aadhaar' | 'PAN' | 'Voter ID' | 'Driving License';

export interface IdVerification {
  idType: IdType;
  idNumber: string;
  status: 'Unverified' | 'Pending' | 'Verified' | 'Rejected';
  reviewNotes?: string;
  documentLink?: string;
}

export interface BusRoute {
  routeNumber: string;
  source: string;
  destination: string;
  activeBuses: number;
  stops: string[];
  color: string;
  path: { x: number; y: number }[]; // Coordinates for vector drawing on our custom grid map
}

export interface BusMarker {
  id: string;
  routeNumber: string;
  x: number; // coordinate x on vector grid
  y: number; // coordinate y on vector grid
  heading: string;
  speed: number;
  nextStop: string;
  status: 'On Time' | 'Delayed' | 'Crowded';
}

export type MapMode = 'standard' | 'satellite' | 'terrain';

export type TabType = 'home' | 'passes' | 'live' | 'ticket' | 'profile';

export interface TransactionHistory {
  id: string;
  timestamp: string;
  type: 'Renewal' | 'Purchase' | 'Fine Refund';
  amount: number;
  passNo: string;
  paymentMethod: string;
  status: 'Success' | 'Failed';
}
