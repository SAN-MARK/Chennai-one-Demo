import React, { useState } from 'react';
import { SearchIcon, CloseIcon } from './CustomIcons';

interface SearchBarProps {
  onSearchSubmit?: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearchSubmit,
  placeholder = 'Where are you going?'
}) => {
  const [query, setQuery] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      if (onSearchSubmit) onSearchSubmit(query);
      setIsOpenModal(false);
    }
  };

  const handleQuickSelect = (destination: string) => {
    setQuery(destination);
    if (onSearchSubmit) onSearchSubmit(destination);
    setIsOpenModal(false);
  };

  const popularStops = [
    'Chennai Central',
    'Guindy Metro',
    'Sholinganallur',
    'Broadway Bus Stand',
    'CMBT Koyambedu',
    'Adyar Signal'
  ];

  return (
    <div className="relative w-full z-20">
      {/* Floating Search Bar */}
      <div 
        onClick={() => setIsOpenModal(true)}
        className="w-full bg-[#C08B4F] text-[#111111] rounded-[2px] px-4 py-3 flex items-center gap-3 cursor-pointer shadow-sm border border-[#A87236] transition-opacity hover:opacity-95"
      >
        <SearchIcon className="w-5 h-5 text-[#111111] shrink-0" color="#111111" />
        <input
          type="text"
          readOnly
          value={query}
          placeholder={placeholder}
          className="w-full bg-transparent font-serif text-base text-[#111111] placeholder-[#3A2B18] focus:outline-none cursor-pointer"
        />
      </div>

      {/* Interactive Search Route Modal */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-xs flex items-start justify-center p-4 pt-12">
          <div className="w-full max-w-[440px] bg-[#F2EBDC] text-[#111111] border border-[#E5DDC9] rounded-[2px] p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5DDC9] pb-3">
              <h3 className="font-display text-2xl font-semibold">Plan Your Transit Route</h3>
              <button 
                onClick={() => setIsOpenModal(false)}
                className="p-1 hover:bg-[#E5DDC9] rounded-[2px] transition-colors"
                aria-label="Close"
              >
                <CloseIcon className="w-5 h-5 text-[#111111]" color="#111111" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-sans font-medium uppercase tracking-wider text-[#6B5F52] mb-1">
                  Destination
                </label>
                <div className="flex items-center gap-2 bg-[#111111] text-[#F2EBDC] p-3 rounded-[2px] border border-[#2A2A2A]">
                  <SearchIcon className="w-5 h-5 text-[#C08B4F]" color="#C08B4F" />
                  <input
                    type="text"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search bus stop, metro or train station..."
                    className="w-full bg-transparent font-serif text-base text-[#F2EBDC] placeholder-[#A89984] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#6B5F52] mb-2">
                  Popular Transit Hubs
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularStops.map((stop) => (
                    <button
                      key={stop}
                      onClick={() => handleQuickSelect(stop)}
                      className="px-3 py-1.5 bg-[#E5DDC9] text-[#111111] font-serif text-sm rounded-[2px] hover:bg-[#C08B4F] transition-colors border border-[#A89984]/30"
                    >
                      {stop}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  if (query.trim()) {
                    if (onSearchSubmit) onSearchSubmit(query);
                    setIsOpenModal(false);
                  }
                }}
                className="w-full py-3 bg-[#C08B4F] text-[#111111] font-sans font-semibold text-xs uppercase tracking-wider rounded-[2px] hover:bg-[#a87236] transition-colors"
              >
                Find Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
