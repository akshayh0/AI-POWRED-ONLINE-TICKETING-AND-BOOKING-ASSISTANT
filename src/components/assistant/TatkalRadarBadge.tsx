'use client';

import React from 'react';
import { BellRing } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function TatkalRadarBadge() {
  const { language } = useLanguage();

  return (
    <div className="bg-[#1C1F2D] border border-white/10 rounded p-3 flex items-center justify-between gap-3 relative shadow-sm">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-[#FF8A3D] shrink-0 animate-ping"></span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-['Space_Grotesk'] text-xs font-bold text-[#F8FAFC]">
              {language === 'KN'
                ? 'ಆಸನ ಬೆಲೆಗಳು ಬದಲಾಗಬಹುದು (ಡೆಮೊ ರಾಡಾರ್)'
                : 'Seat prices may fluctuate (Demo Radar)'}
            </span>
            <span className="text-white/20">•</span>
            <span className="font-['Space_Grotesk'] text-[10px] font-bold text-[#FF8A3D]">
              TATKAL RADAR ON
            </span>
          </div>
          <span className="font-['Inter'] text-xs text-[#9CA8BD] mt-0.5">
            {language === 'KN'
              ? 'ಪಂದ್ಯದ ದಿನದ ಬೇಡಿಕೆ ಹೆಚ್ಚಿದೆ; ಬೆಲೆಗಳು ₹2,000 ಕ್ಕಿಂತ ಕಡಿಮೆಯಾದರೆ ಸ್ವಯಂಚಾಲಿತ ಎಚ್ಚರಿಕೆ.'
              : 'Match-day corridor demand detected; auto-alerts configured if seats drop below threshold.'}
          </span>
        </div>
      </div>
      <BellRing className="w-5 h-5 text-[#FF8A3D] shrink-0" />
    </div>
  );
}

