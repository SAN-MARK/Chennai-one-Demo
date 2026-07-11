import { MtcPass, UserProfile, BusRoute, BusMarker, TransactionHistory } from './types';
// @ts-expect-error - image file type declarations are handled at runtime
import selfieImg from './assets/images/sanjeev_selfie_id_1783758620472.jpg';

export const INITIAL_USER: UserProfile = {
  name: 'Sanjeev M',
  email: 'iamheresanjeev@gmail.com',
  phone: '+91 98401 23456',
  avatarUrl: selfieImg, // Will generate fallback avatar if empty
  role: 'OWNER'
};

export const INITIAL_PASS: MtcPass = {
  id: 'pass-01',
  passNo: '00481887',
  name: 'Sanjeev M',
  photoUrl: selfieImg, // Default profile image is now the selfie!
  type: 'General',
  amount: 1000,
  validFrom: '01/07/2026',
  validTo: '01/09/2026',
  status: 'Active',
  activatedAt: 'Jul 11 13:26:02'
};

export const CHENNAI_ROUTES: BusRoute[] = [
  {
    routeNumber: '21G',
    source: 'Broadway',
    destination: 'Tambaram',
    activeBuses: 4,
    stops: ['Broadway', 'Central Railway', 'Gemini Flyover', 'Teynampet', 'Guindy', 'Airport', 'Tambaram'],
    color: '#ef4444', // Red
    path: [
      { x: 50, y: 15 }, // Broadway
      { x: 48, y: 25 }, // Central Railway
      { x: 43, y: 45 }, // Gemini
      { x: 38, y: 55 }, // Teynampet
      { x: 32, y: 68 }, // Guindy
      { x: 25, y: 78 }, // Airport
      { x: 15, y: 90 }  // Tambaram
    ]
  },
  {
    routeNumber: '102',
    source: 'Broadway',
    destination: 'Kelambakkam',
    activeBuses: 3,
    stops: ['Broadway', 'Mylapore', 'Adyar', 'SRP Tools', 'Sholinganallur', 'Kelambakkam'],
    color: '#3b82f6', // Blue
    path: [
      { x: 50, y: 15 }, // Broadway
      { x: 55, y: 35 }, // Mylapore
      { x: 58, y: 52 }, // Adyar
      { x: 60, y: 65 }, // SRP Tools
      { x: 65, y: 78 }, // Sholinganallur
      { x: 70, y: 95 }  // Kelambakkam
    ]
  },
  {
    routeNumber: '19B',
    source: 'Saidapet',
    destination: 'Kovalam',
    activeBuses: 2,
    stops: ['Saidapet', 'Adyar', 'Thiruvanmiyur', 'Palavakkam', 'Sholinganallur', 'Kovalam'],
    color: '#10b981', // Green
    path: [
      { x: 35, y: 50 }, // Saidapet
      { x: 58, y: 52 }, // Adyar
      { x: 62, y: 60 }, // Thiruvanmiyur
      { x: 66, y: 70 }, // Palavakkam
      { x: 65, y: 78 }, // Sholinganallur
      { x: 75, y: 98 }  // Kovalam
    ]
  },
  {
    routeNumber: '570',
    source: 'CMBT',
    destination: 'Siruseri IT Park',
    activeBuses: 5,
    stops: ['CMBT', 'Vadapalani', 'Guindy', 'SRP Tools', 'Karapakkam', 'Siruseri'],
    color: '#f59e0b', // Amber
    path: [
      { x: 20, y: 30 }, // CMBT
      { x: 24, y: 45 }, // Vadapalani
      { x: 32, y: 68 }, // Guindy
      { x: 60, y: 65 }, // SRP Tools
      { x: 63, y: 73 }, // Karapakkam
      { x: 68, y: 88 }  // Siruseri
    ]
  }
];

export const INITIAL_BUSES: BusMarker[] = [
  {
    id: 'bus-21g-1',
    routeNumber: '21G',
    x: 43,
    y: 45,
    heading: 'Southbound',
    speed: 35,
    nextStop: 'Teynampet',
    status: 'On Time'
  },
  {
    id: 'bus-21g-2',
    routeNumber: '21G',
    x: 25,
    y: 78,
    heading: 'Northbound',
    speed: 42,
    nextStop: 'Guindy',
    status: 'Crowded'
  },
  {
    id: 'bus-102-1',
    routeNumber: '102',
    x: 58,
    y: 52,
    heading: 'Southbound',
    speed: 28,
    nextStop: 'SRP Tools',
    status: 'On Time'
  },
  {
    id: 'bus-19b-1',
    routeNumber: '19B',
    x: 62,
    y: 60,
    heading: 'Kovalam Bound',
    speed: 45,
    nextStop: 'Palavakkam',
    status: 'On Time'
  },
  {
    id: 'bus-570-1',
    routeNumber: '570',
    x: 32,
    y: 68,
    heading: 'IT Expressway Bound',
    speed: 15,
    nextStop: 'SRP Tools',
    status: 'Delayed'
  }
];

export const INITIAL_HISTORY: TransactionHistory[] = [
  {
    id: 'TXN-902381',
    timestamp: '2026-07-01 10:14:22',
    type: 'Renewal',
    amount: 1000,
    passNo: '00481887',
    paymentMethod: 'UPI (GPay)',
    status: 'Success'
  },
  {
    id: 'TXN-712893',
    timestamp: '2026-06-01 09:45:10',
    type: 'Renewal',
    amount: 1000,
    passNo: '00481887',
    paymentMethod: 'UPI (PhonePe)',
    status: 'Success'
  },
  {
    id: 'TXN-562910',
    timestamp: '2026-05-01 11:22:15',
    type: 'Purchase',
    amount: 1000,
    passNo: '00481887',
    paymentMethod: 'NetBanking (HDFC)',
    status: 'Success'
  }
];

export const CHENNAI_LANDMARKS = [
  { name: 'Chennai Central', x: 48, y: 25, type: 'terminal' },
  { name: 'CMBT (Koyambedu)', x: 20, y: 30, type: 'terminal' },
  { name: 'Marina Beach', x: 58, y: 30, type: 'scenic' },
  { name: 'Guindy National Park', x: 30, y: 65, type: 'park' },
  { name: 'TIDEL Park', x: 62, y: 62, type: 'it_hub' },
  { name: 'Tambaram MEST', x: 15, y: 90, type: 'terminal' }
];
