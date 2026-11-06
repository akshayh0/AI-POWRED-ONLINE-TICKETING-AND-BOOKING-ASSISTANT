'use client';

import React from 'react';
import { Check, Users } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export type GroupType = '4adults' | 'family';

interface InteractiveGroupSelectorProps {
  selectedGroup: GroupType;
  onSelectGroup: (group: GroupType) => void;
}

export function InteractiveGroupSelector({
  selectedGroup,
  onSelectGroup,
}: InteractiveGroupSelectorProps) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <p className="font-['Inter'] text-sm text-[#F8FAFC]">
        {language === 'KN'
          ? 'ಮೈಸೂರಿನಿಂದ 4 ಜನರಿಗೆ ದಾಖಲಿಸಲಾಗಿದೆ. ಆಸನ ಮತ್ತು ಸಾರಿಗೆ ದೃಢೀಕರಿಸಲು:'
          : 'Noted for 4 people from Mysuru. To confirm seating & transport:'}
      </p>
      <div className="bg-[#1C1F2D] p-3 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/5 shadow-sm">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[#42D9FF] shrink-0" />
          <span className="font-['Space_Grotesk'] text-xs font-bold text-[#F8FAFC]">
            {language === 'KN'
              ? 'ನಿಮ್ಮ ಗುಂಪಿನಲ್ಲಿ 2 ವಯಸ್ಕರು + 2 ಮಕ್ಕಳು ಅಥವಾ 4 ವಯಸ್ಕರೇ?'
              : 'Is your group 2 Adults + 2 Children or 4 Adults?'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onSelectGroup('family')}
            className={`px-3 py-1.5 rounded font-['Space_Grotesk'] text-xs font-bold transition-all ${
              selectedGroup === 'family'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'bg-[#080B18] hover:bg-[#262938] text-[#9CA8BD] hover:text-white border border-white/10'
            }`}
          >
            {selectedGroup === 'family' && <Check className="w-3.5 h-3.5 inline mr-1" />}
            <span>{language === 'KN' ? '2 ವಯಸ್ಕರು + 2 ಮಕ್ಕಳು' : '2 Adults + 2 Kids'}</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectGroup('4adults')}
            className={`px-3 py-1.5 rounded font-['Space_Grotesk'] text-xs font-bold flex items-center gap-1.5 transition-all ${
              selectedGroup === '4adults'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'bg-[#080B18] hover:bg-[#262938] text-[#9CA8BD] hover:text-white border border-white/10'
            }`}
          >
            {selectedGroup === '4adults' && <Check className="w-3.5 h-3.5" />}
            <span>{language === 'KN' ? '4 ವಯಸ್ಕರು' : '4 Adults'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

