import React from 'react';
import { HomeIcon, PassesIcon, LiveIcon, TicketIcon, ProfileIcon } from './CustomIcons';

export type NavTab = 'home' | 'passes' | 'live' | 'ticket' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<any> }[] = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'passes', label: 'Passes', icon: PassesIcon },
    { id: 'live', label: 'Live', icon: LiveIcon },
    { id: 'ticket', label: 'Ticket', icon: TicketIcon },
    { id: 'profile', label: 'Profile', icon: ProfileIcon },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 h-16 bg-[#F2EBDC] border-t border-[#E5DDC9] flex justify-around items-center z-40 select-none">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        const activeColor = "#C08B4F";
        const inactiveColor = "#A89984";

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center w-16 h-full transition-colors cursor-pointer outline-none group"
            aria-label={tab.label}
          >
            <IconComponent
              className="w-5 h-5 transition-transform group-active:scale-95"
              color={isActive ? activeColor : inactiveColor}
              filled={isActive}
            />
            <span
              className="text-[10px] font-sans font-medium uppercase tracking-wider mt-1 transition-colors"
              style={{ color: isActive ? activeColor : inactiveColor }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
