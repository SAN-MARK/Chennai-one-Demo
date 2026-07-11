import React, { useState, useEffect, useRef } from 'react';
import { BusRoute, BusMarker, MapMode } from '../types';
import { CHENNAI_ROUTES, INITIAL_BUSES, CHENNAI_LANDMARKS } from '../data';
import { Map, Eye, Compass, Navigation, Radio, Waves, MapPin, Search } from 'lucide-react';

interface LiveMapProps {
  onBackToPasses?: () => void;
}

export default function LiveMap({ onBackToPasses }: LiveMapProps) {
  const [mapMode, setMapMode] = useState<MapMode>('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [selectedBus, setSelectedBus] = useState<BusMarker | null>(null);
  const [buses, setBuses] = useState<BusMarker[]>(INITIAL_BUSES);
  const [activeRouteFilter, setActiveRouteFilter] = useState<string[]>(['21G', '102', '19B', '570']);

  // Ref for the container to get responsive size
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Simulate bus movement along their respective route paths in real-time!
  useEffect(() => {
    const moveBuses = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          // Find matching route
          const route = CHENNAI_ROUTES.find((r) => r.routeNumber === bus.routeNumber);
          if (!route) return bus;

          // Find current path index or find closest node
          // Let's increment or move towards the next coordinate node
          const path = route.path;
          
          // Custom linear interpolation movement logic for visual smoothness
          // To make it easy, we find where the bus is, and move it 0.5% closer to the next stop
          // We can maintain a pseudo-progress index on each bus
          // For simplicity, let's fluctuate the coordinates slightly to represent movement, or cycle them through the route stops!
          let currentIdx = path.findIndex(node => Math.abs(node.x - bus.x) < 3 && Math.abs(node.y - bus.y) < 3);
          if (currentIdx === -1) currentIdx = 0;

          const nextIdx = (currentIdx + 1) % path.length;
          const targetNode = path[nextIdx];

          // Compute step
          const dx = targetNode.x - bus.x;
          const dy = targetNode.y - bus.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let nextX = bus.x;
          let nextY = bus.y;
          let nextStop = bus.nextStop;

          if (distance < 2.5) {
            // Arrived at stop, transition to next stop name
            nextX = targetNode.x;
            nextY = targetNode.y;
            const stopIdx = Math.min(nextIdx + 1, route.stops.length - 1);
            nextStop = route.stops[stopIdx];
          } else {
            // Move small step towards target node
            const speedStep = 1.2; 
            nextX += (dx / distance) * speedStep;
            nextY += (dy / distance) * speedStep;
          }

          return {
            ...bus,
            x: Number(nextX.toFixed(2)),
            y: Number(nextY.toFixed(2)),
            nextStop
          };
        })
      );
    }, 1500);

    return () => clearInterval(moveBuses);
  }, []);

  // Update selected bus if it moves
  useEffect(() => {
    if (selectedBus) {
      const updated = buses.find(b => b.id === selectedBus.id);
      if (updated) {
        setSelectedBus(updated);
      }
    }
  }, [buses, selectedBus]);

  const handleRouteToggle = (routeNo: string) => {
    if (activeRouteFilter.includes(routeNo)) {
      setActiveRouteFilter(activeRouteFilter.filter((r) => r !== routeNo));
      if (selectedRoute === routeNo) setSelectedRoute(null);
    } else {
      setActiveRouteFilter([...activeRouteFilter, routeNo]);
    }
  };

  const filteredRoutes = CHENNAI_ROUTES.filter(route => 
    activeRouteFilter.includes(route.routeNumber) &&
    (route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
     route.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
     route.destination.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayedBuses = buses.filter(bus => 
    activeRouteFilter.includes(bus.routeNumber) &&
    (!selectedRoute || bus.routeNumber === selectedRoute)
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white font-sans" id="chennai-live-bus-map">
      
      {/* Upper control layout */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold flex items-center gap-1.5 text-amber-400">
              <Radio className="w-4 h-4 animate-pulse text-red-500" />
              Live MTC Tracker
            </h2>
            <p className="text-[11px] text-slate-400"> चेन्नई महानगर परिवहन (Chennai Hub)</p>
          </div>

          {/* Tile switcher */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-[10px] font-bold">
            {(['standard', 'satellite', 'terrain'] as MapMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setMapMode(mode)}
                className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                  mapMode === mode 
                    ? 'bg-amber-500 text-slate-950 font-extrabold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Route filters and Search */}
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search route or stop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Route Pills Selector */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CHENNAI_ROUTES.map((route) => {
            const isActive = activeRouteFilter.includes(route.routeNumber);
            return (
              <button
                key={route.routeNumber}
                onClick={() => handleRouteToggle(route.routeNumber)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 border transition-all shrink-0 ${
                  isActive 
                    ? 'bg-slate-800 border-slate-700 text-white' 
                    : 'bg-slate-950 border-slate-900 text-slate-600'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isActive ? route.color : '#475569' }} />
                Route {route.routeNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* MAP CANVAS CONTAINER */}
      <div 
        ref={mapContainerRef} 
        className="relative flex-grow overflow-hidden select-none bg-slate-950"
        id="map-canvas-frame"
      >
        {/* Dynamic Map Rendering with SVG */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* MAP MODE SPECIFIC BACKDROP */}

          {/* 1. Water: Bay of Bengal (always on the right side from x=75 to x=100) */}
          <path 
            d="M 75 0 L 100 0 L 100 100 L 80 100 Q 77 50 75 0 Z" 
            fill={
              mapMode === 'standard' ? '#0d1f3d' : 
              mapMode === 'satellite' ? '#031424' : 
              '#09243a'
            }
            className="transition-colors duration-500"
          />

          {/* Standard Map styling grids */}
          {mapMode === 'standard' && (
            <>
              {/* Ground Grid Lines */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="#1e293b" strokeWidth="0.1" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#1e293b" strokeWidth="0.1" />
              <line x1="0" y1="60" x2="100" y2="60" stroke="#1e293b" strokeWidth="0.1" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#1e293b" strokeWidth="0.1" />
              <line x1="20" y1="0" x2="20" y2="100" stroke="#1e293b" strokeWidth="0.1" />
              <line x1="40" y1="0" x2="40" y2="100" stroke="#1e293b" strokeWidth="0.1" />
              <line x1="60" y1="0" x2="60" y2="100" stroke="#1e293b" strokeWidth="0.1" />
              <line x1="80" y1="0" x2="80" y2="100" stroke="#1e293b" strokeWidth="0.1" />
            </>
          )}

          {/* Satellite Map styling grids */}
          {mapMode === 'satellite' && (
            <>
              {/* Dense urban grid rectangles overlay */}
              <rect x="5" y="5" width="20" height="20" fill="#142116" opacity="0.3" rx="2" />
              <rect x="30" y="8" width="35" height="25" fill="#171c26" opacity="0.4" rx="3" />
              <rect x="10" y="55" width="22" height="30" fill="#1d2217" opacity="0.3" rx="2" />
              {/* Radar radial scans sweep */}
              <circle cx="48" cy="25" r="25" stroke="#22c55e" strokeWidth="0.05" fill="none" opacity="0.1" strokeDasharray="1 3" />
              <circle cx="48" cy="25" r="10" stroke="#22c55e" strokeWidth="0.05" fill="none" opacity="0.1" />
            </>
          )}

          {/* Terrain Map styling grids */}
          {mapMode === 'terrain' && (
            <>
              {/* Topographical concentric contours on left */}
              <path d="M 5 20 Q 15 15 10 35 Q 8 50 2 55" fill="none" stroke="#475569" strokeWidth="0.15" strokeDasharray="1 1" />
              <path d="M -2 15 Q 8 10 3 30 Q 0 45 -5 48" fill="none" stroke="#475569" strokeWidth="0.15" strokeDasharray="1 1" />
              <path d="M 15 70 Q 25 75 22 85 T 10 95" fill="none" stroke="#475569" strokeWidth="0.15" strokeDasharray="1 1" />
              <path d="M 8 65 Q 18 70 15 80 T 5 90" fill="none" stroke="#475569" strokeWidth="0.1" strokeDasharray="1 1" />
            </>
          )}

          {/* DRAW ROUTE PATHS */}
          {filteredRoutes.map((route) => {
            // Build SVG path string
            const pathStr = route.path.reduce(
              (acc, pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
              ''
            );

            const isSelected = selectedRoute === route.routeNumber;

            return (
              <g key={route.routeNumber}>
                {/* Glowing glow backdrop for route path */}
                <path
                  d={pathStr}
                  fill="none"
                  stroke={route.color}
                  strokeWidth={isSelected ? '2.5' : '1.2'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isSelected ? '0.4' : '0.15'}
                  className="transition-all duration-300"
                />
                {/* Core path line */}
                <path
                  d={pathStr}
                  fill="none"
                  stroke={route.color}
                  strokeWidth={isSelected ? '1.0' : '0.5'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={isSelected ? '1.0' : '0.7'}
                  className="transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedRoute(isSelected ? null : route.routeNumber)}
                />
              </g>
            );
          })}

          {/* DRAW ROUTE STOP INDICATORS */}
          {filteredRoutes.map((route) => {
            const isSelected = selectedRoute === route.routeNumber;
            return route.path.map((pt, idx) => (
              <circle
                key={`${route.routeNumber}-stop-${idx}`}
                cx={pt.x}
                cy={pt.y}
                r={isSelected ? '0.9' : '0.6'}
                fill="#ffffff"
                stroke={route.color}
                strokeWidth="0.3"
                className="cursor-pointer transition-all hover:scale-150"
                opacity={selectedRoute && !isSelected ? '0.2' : '1.0'}
                onClick={() => {
                  setSelectedRoute(route.routeNumber);
                  setSelectedBus(null);
                }}
              />
            ));
          })}

          {/* DRAW LANDMARKS */}
          {CHENNAI_LANDMARKS.map((landmark, idx) => (
            <g key={`landmark-${idx}`} opacity={selectedRoute ? '0.2' : '1.0'}>
              <circle cx={landmark.x} cy={landmark.y} r="0.8" fill="#eab308" />
              <circle cx={landmark.x} cy={landmark.y} r="2.5" fill="none" stroke="#eab308" strokeWidth="0.05" strokeDasharray="1 1" />
            </g>
          ))}
        </svg>

        {/* FLOATING LABELS & MARKERS ON THE CANVAS */}

        {/* Floating Landmark names */}
        {CHENNAI_LANDMARKS.map((landmark, idx) => (
          <div
            key={`landmark-lbl-${idx}`}
            style={{ left: `${landmark.x}%`, top: `${landmark.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-5 bg-slate-900/90 border border-amber-500/30 text-[8px] font-bold text-amber-400 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap pointer-events-none transition-opacity ${
              selectedRoute ? 'opacity-20' : 'opacity-100'
            }`}
          >
            {landmark.name}
          </div>
        ))}

        {/* Floating Water label */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 -rotate-90 select-none flex items-center gap-1.5 opacity-40 pointer-events-none">
          <Waves className="w-3 h-3 text-blue-400" />
          <span className="text-[10px] font-display font-semibold tracking-widest text-blue-300 uppercase">Bay of Bengal</span>
        </div>

        {/* RENDER ACTIVE BUSES */}
        {displayedBuses.map((bus) => {
          const route = CHENNAI_ROUTES.find(r => r.routeNumber === bus.routeNumber);
          const color = route ? route.color : '#eab308';
          const isSelected = selectedBus?.id === bus.id;

          return (
            <div
              key={bus.id}
              style={{ left: `${bus.x}%`, top: `${bus.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group transition-all duration-300"
              onClick={() => {
                setSelectedBus(bus);
                setSelectedRoute(bus.routeNumber);
              }}
            >
              {/* Pulsing ring indicator */}
              <div 
                className="absolute inset-0 rounded-full scale-150 animate-ping opacity-60"
                style={{ backgroundColor: color }}
              />
              
              {/* Bus dot marker wrapper */}
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                  isSelected ? 'scale-125 border-2 border-white' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              >
                <span className="text-[9px] font-mono font-extrabold text-white leading-none">
                  {bus.routeNumber}
                </span>
              </div>

              {/* Mini directional triangle indicator */}
              <div 
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-white"
                style={{ transform: `rotate(${bus.heading === 'Northbound' ? '0' : '180'}deg)` }}
              />
            </div>
          );
        })}
      </div>

      {/* FOOTER DETAIL CARD: Displays selected Bus info or selected route details */}
      <div className="p-4 bg-slate-900 border-t border-slate-800" id="live-map-footer-card">
        {selectedBus ? (
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span 
                  className="text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: CHENNAI_ROUTES.find(r => r.routeNumber === selectedBus.routeNumber)?.color }}
                >
                  MTC BUS {selectedBus.routeNumber}
                </span>
                <h4 className="text-sm font-bold text-white mt-1.5 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  Heading {selectedBus.heading}
                </h4>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  selectedBus.status === 'On Time' ? 'bg-emerald-500/10 text-emerald-400' :
                  selectedBus.status === 'Crowded' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-rose-500/10 text-rose-400'
                }`}>
                  {selectedBus.status}
                </span>
                <p className="text-xs font-mono text-slate-400 mt-1">{selectedBus.speed} km/h</p>
              </div>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] block">Next Stop</span>
                <span className="text-slate-200 font-semibold">{selectedBus.nextStop}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Operators Route</span>
                <span className="text-slate-200 font-semibold truncate">
                  {(() => {
                    const r = CHENNAI_ROUTES.find(r => r.routeNumber === selectedBus.routeNumber);
                    return r ? `${r.source} ➔ ${r.destination}` : 'Unknown';
                  })()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedBus(null)}
                className="flex-grow py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-semibold text-xs active:scale-95 transition-all"
              >
                Clear Selection
              </button>
            </div>
          </div>
        ) : selectedRoute ? (
          <div>
            {(() => {
              const route = CHENNAI_ROUTES.find(r => r.routeNumber === selectedRoute);
              if (!route) return null;
              return (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }} />
                        Route {route.routeNumber} Details
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">{route.source} ➔ {route.destination}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedRoute(null)}
                      className="text-xs text-amber-500 font-bold hover:underline"
                    >
                      All Routes
                    </button>
                  </div>

                  {/* Route progress dots */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-500 block mb-2 uppercase font-bold tracking-wider">Line Sequence & Stops</span>
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                      {route.stops.map((stop, idx) => (
                        <React.Fragment key={idx}>
                          <div className="flex flex-col items-center shrink-0">
                            <span className="w-2.5 h-2.5 rounded-full border border-white bg-slate-800 flex items-center justify-center">
                              <span className="w-1 h-1 rounded-full bg-amber-500" />
                            </span>
                            <span className="text-[9px] text-slate-300 font-medium mt-1 whitespace-nowrap">{stop}</span>
                          </div>
                          {idx < route.stops.length - 1 && (
                            <div className="h-[1px] w-5 bg-slate-800 shrink-0" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200">Interactive Chennai GIS Platform</h4>
              <p className="text-[10px] text-slate-500">Tap route pills or bus indicators to view detailed spatial diagnostics.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
