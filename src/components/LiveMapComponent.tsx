import React, { useState, useEffect } from 'react';
import { BusIcon, LocationIcon, RefreshIcon } from './CustomIcons';
import { CHENNAI_ROUTES, INITIAL_BUSES } from '../data';
import { BusRoute, BusMarker } from '../types';

interface LiveMapComponentProps {
  selectedCategory?: string | null;
  selectedRouteNumber?: string | null;
  onSelectBusRoute?: (route: BusRoute) => void;
  showBottomSheet?: boolean;
}

export const LiveMapComponent: React.FC<LiveMapComponentProps> = ({
  selectedCategory,
  selectedRouteNumber: externalRouteNumber,
  onSelectBusRoute,
  showBottomSheet = false
}) => {
  const [buses, setBuses] = useState<BusMarker[]>(INITIAL_BUSES);
  const [activeRouteNumber, setActiveRouteNumber] = useState<string | null>(externalRouteNumber || '21G');
  const [sheetExpanded, setSheetExpanded] = useState(true);

  // Sync external route number if provided
  useEffect(() => {
    if (externalRouteNumber) {
      setActiveRouteNumber(externalRouteNumber);
    }
  }, [externalRouteNumber]);

  // Subtle bus coordinate animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          x: Math.max(10, Math.min(90, bus.x + (Math.random() - 0.5) * 1.5)),
          y: Math.max(10, Math.min(90, bus.y + (Math.random() - 0.5) * 1.5))
        }))
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const activeRoute = CHENNAI_ROUTES.find((r) => r.routeNumber === activeRouteNumber);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#111111] overflow-hidden select-none">
      {/* Custom Dark Minimal Vector Map Tile Canvas */}
      <svg className="w-full h-full absolute inset-0 pointer-events-none opacity-80" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Dark Grid Background Lines (Subtle Streets) */}
        <pattern id="street-grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#2A2A2A" strokeWidth="0.3" />
        </pattern>
        <rect width="100" height="100" fill="url(#street-grid)" />

        {/* Primary Arterial Road Lines (Anna Salai, OMR, GST Road) */}
        <path d="M 10 90 L 30 65 L 43 45 L 48 25 L 50 15" fill="none" stroke="#1A1A1A" strokeWidth="2.5" />
        <path d="M 50 15 L 55 35 L 58 52 L 65 78 L 70 95" fill="none" stroke="#1A1A1A" strokeWidth="2" />
        <path d="M 20 30 L 32 68 L 60 65 L 68 88" fill="none" stroke="#1A1A1A" strokeWidth="2" />

        {/* Bay of Bengal Shoreline Accent */}
        <path d="M 75 0 C 70 30, 80 60, 85 100 L 100 100 L 100 0 Z" fill="#161b22" opacity="0.5" />

        {/* Active Route Path Line */}
        {activeRoute && (
          <path
            d={activeRoute.path.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '')}
            fill="none"
            stroke="#C08B4F"
            strokeWidth="1.2"
            strokeDasharray="2 1"
          />
        )}

        {/* Route Stops / Stations */}
        {activeRoute &&
          activeRoute.path.map((pt, idx) => (
            <circle key={idx} cx={pt.x} cy={pt.y} r="1.2" fill="#F2EBDC" stroke="#C08B4F" strokeWidth="0.5" />
          ))}
      </svg>

      {/* Live Moving Bus Icons / Markers */}
      <div className="absolute inset-0 pointer-events-auto">
        {buses.map((bus) => {
          const isSelected = bus.routeNumber === activeRouteNumber;

          return (
            <div
              key={bus.id}
              onClick={() => {
                setActiveRouteNumber(bus.routeNumber);
                const foundRoute = CHENNAI_ROUTES.find((r) => r.routeNumber === bus.routeNumber);
                if (foundRoute && onSelectBusRoute) onSelectBusRoute(foundRoute);
              }}
              style={{ left: `${bus.x}%`, top: `${bus.y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-1000 z-10 ${
                isSelected ? 'scale-110' : 'opacity-80 hover:opacity-100'
              }`}
            >
              {/* Bus Marker Tag */}
              <div
                className={`px-2 py-0.5 rounded-[2px] border text-[9px] font-mono font-bold flex items-center gap-1 shadow-md ${
                  isSelected
                    ? 'bg-[#C08B4F] text-[#111111] border-[#F2EBDC]'
                    : 'bg-[#1A1A1A] text-[#F2EBDC] border-[#2A2A2A]'
                }`}
              >
                <BusIcon className="w-3 h-3 text-current" color="currentColor" />
                <span>{bus.routeNumber}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Control Button (Refresh & Center) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button
          onClick={() => {
            setBuses((prev) =>
              prev.map((b) => ({ ...b, x: b.x + (Math.random() - 0.5) * 2, y: b.y + (Math.random() - 0.5) * 2 }))
            );
          }}
          className="p-2 bg-[#1A1A1A] text-[#F2EBDC] border border-[#2A2A2A] rounded-[2px] hover:bg-[#2A2A2A] shadow-md transition-colors"
          title="Refresh GPS positions"
          aria-label="Refresh GPS positions"
        >
          <RefreshIcon className="w-4 h-4 text-[#F2EBDC]" color="#F2EBDC" />
        </button>
      </div>

      {/* Half-Height Bottom Sheet for Screen 4 (Live Buses) */}
      {showBottomSheet && (
        <div
          className={`absolute bottom-0 inset-x-0 bg-[#F2EBDC] text-[#111111] border-t border-[#E5DDC9] rounded-t-[2px] transition-all duration-300 z-30 shadow-2xl ${
            sheetExpanded ? 'h-[50vh]' : 'h-16'
          } flex flex-col`}
        >
          {/* Drag Handle */}
          <div
            onClick={() => setSheetExpanded(!sheetExpanded)}
            className="w-full py-2.5 flex items-center justify-center cursor-pointer border-b border-[#E5DDC9] shrink-0"
          >
            <div className="w-12 h-1 bg-[#111111] rounded-[1px]" />
          </div>

          {/* Heading */}
          <div className="px-5 pt-3 pb-2 flex justify-between items-center shrink-0">
            <h3 className="font-display text-2xl font-bold text-[#111111]">
              Live Buses Near You
            </h3>
            <span className="font-mono text-xs font-semibold text-[#C08B4F] bg-[#111111] px-2 py-0.5 rounded-[2px]">
              GPS Live
            </span>
          </div>

          {/* List of Bus Routes */}
          <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-3 font-serif">
            {CHENNAI_ROUTES.map((route) => {
              const isSelected = route.routeNumber === activeRouteNumber;

              return (
                <div
                  key={route.routeNumber}
                  onClick={() => {
                    setActiveRouteNumber(route.routeNumber);
                    if (onSelectBusRoute) onSelectBusRoute(route);
                  }}
                  className={`p-3.5 border rounded-[2px] flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#111111] text-[#F2EBDC] border-[#C08B4F]'
                      : 'bg-transparent text-[#111111] border-[#E5DDC9] hover:bg-[#E5DDC9]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-bold text-sm uppercase text-[#C08B4F]">
                        Route {route.routeNumber}
                      </span>
                      <span className="text-[10px] font-mono text-[#A89984] bg-[#2A2A2A] px-1.5 py-0.2 rounded-[2px]">
                        {route.activeBuses} Active
                      </span>
                    </div>

                    <p className={`text-sm ${isSelected ? 'text-[#F2EBDC]' : 'text-[#111111]'}`}>
                      {route.source} ➔ {route.destination}
                    </p>
                  </div>

                  {/* ETA in DM Mono 14px #C08B4F */}
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-[#C08B4F]">
                      {Math.floor(Math.random() * 8) + 3} MINS
                    </span>
                    <p className="text-[10px] font-sans text-[#6B5F52] uppercase tracking-wider block">
                      ETA Stop
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMapComponent;
