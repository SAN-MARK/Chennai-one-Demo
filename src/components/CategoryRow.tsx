import React, { useState } from 'react';
import { BusIcon, TrainIcon, MetroIcon, CabIcon } from './CustomIcons';

export type TransitCategory = 'bus' | 'train' | 'metro' | 'cab';

interface CategoryRowProps {
  onSelectCategory?: (category: TransitCategory) => void;
  selectedCategory?: TransitCategory | null;
}

export const CategoryRow: React.FC<CategoryRowProps> = ({
  onSelectCategory,
  selectedCategory: externalSelected
}) => {
  const [internalSelected, setInternalSelected] = useState<TransitCategory | null>(null);
  const selected = externalSelected !== undefined ? externalSelected : internalSelected;

  const categories = [
    {
      id: 'bus' as TransitCategory,
      title: 'Bus',
      bgColor: '#D4A359', // Muted mustard
      icon: BusIcon
    },
    {
      id: 'train' as TransitCategory,
      title: 'Train',
      bgColor: '#7B8B6F', // Muted sage
      icon: TrainIcon
    },
    {
      id: 'metro' as TransitCategory,
      title: 'Metro',
      bgColor: '#5C768D', // Muted steel blue
      icon: MetroIcon
    },
    {
      id: 'cab' as TransitCategory,
      title: 'Auto/Cab',
      bgColor: '#8B5B6E', // Muted plum
      icon: CabIcon
    }
  ];

  const handleCategoryClick = (id: TransitCategory) => {
    const nextVal = selected === id ? null : id;
    setInternalSelected(nextVal);
    if (onSelectCategory) {
      onSelectCategory(id);
    }
  };

  return (
    <div className="w-full flex items-center gap-4 overflow-x-auto no-scrollbar py-2 px-1 select-none">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isSelected = selected === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.id)}
            className="flex flex-col items-center shrink-0 cursor-pointer outline-none transition-transform active:scale-95"
            aria-label={cat.title}
            title={cat.title}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isSelected ? 'ring-2 ring-[#C08B4F] ring-offset-2 ring-offset-[#111111]' : ''
              }`}
              style={{ backgroundColor: cat.bgColor }}
            >
              <Icon className="w-6 h-6 text-[#111111]" color="#111111" />
            </div>
            {/* Strict instruction: "icon inside. No text below." */}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryRow;
