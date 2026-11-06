'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { formatINR } from '@/lib/utils';

interface PackageComparisonProps {
  selectedTier: 'comfort' | 'saver';
  onSelectTier: (tier: 'comfort' | 'saver') => void;
  budgetCap?: number;
}

export function PackageComparison({
  selectedTier,
  onSelectTier,
  budgetCap = 25000,
}: PackageComparisonProps) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-['Space_Grotesk'] text-xs text-[#9CA8BD] uppercase tracking-wider font-bold">
          {language === 'KN' ? 'ಪ್ಯಾಕೇಜ್ ಹೋಲಿಕೆ (ಡೆಮೊ)' : 'PACKAGE VARIANT COMPARISON (DEMO)'}
        </span>
        <span className="font-['Space_Grotesk'] text-[11px] text-[#FF8A3D] font-bold">
          TARGET CAP: {formatINR(budgetCap)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option 01: Comfort */}
        <div
          onClick={() => onSelectTier('comfort')}
          className={`bg-[#1C1F2D] border rounded p-4 flex flex-col justify-between cursor-pointer transition-all ${
            selectedTier === 'comfort'
              ? 'border-[#8B5CF6] shadow-md shadow-[#8B5CF6]/15'
              : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#8B5CF6] font-bold uppercase">
                  PLAN OPTION 01
                </span>
                <h2 className="font-['Space_Grotesk'] text-base font-bold text-[#F8FAFC] m-0">
                  Comfort Tier
                </h2>
              </div>
              <div className="text-right">
                <span className="font-['Inter'] text-lg font-bold text-[#8B5CF6] tabular-nums block">
                  ₹32,600
                </span>
                <span className="font-['Inter'] text-[10px] text-[#9CA8BD] tabular-nums">
                  ₹8,150 / person
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-['Inter']">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA8BD]">Transit: Shatabdi Train (CC)</span>
                <span className="text-[#F8FAFC] tabular-nums">₹3,400 (4 pax)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA8BD]">Hotel: MG Road 4-Star Stay</span>
                <span className="text-[#8B5CF6] font-bold tabular-nums">₹11,600 (2 rms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA8BD]">Match: East Stand Block D</span>
                <span className="text-[#F8FAFC] tabular-nums">₹12,800</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA8BD]">Food &amp; Buffer</span>
                <span className="text-[#F8FAFC] tabular-nums">₹4,800</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] font-bold text-[#8B5CF6]">
              PREMIUM EXPERIENCE • SHADED STAND
            </span>
            {selectedTier === 'comfort' && (
              <span className="px-1.5 py-0.2 rounded bg-[#8B5CF6] text-white text-[9px] font-['Space_Grotesk'] font-bold">
                ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Option 02: Saver */}
        <div
          onClick={() => onSelectTier('saver')}
          className={`bg-[#1C1F2D] border rounded p-4 flex flex-col justify-between cursor-pointer transition-all ${
            selectedTier === 'saver'
              ? 'border-[#42D9FF] shadow-md shadow-[#42D9FF]/15'
              : 'border-white/10 hover:border-white/20'
          }`}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div>
                <span className="font-['Space_Grotesk'] text-[10px] text-[#42D9FF] font-bold uppercase">
                  PLAN OPTION 02
                </span>
                <h2 className="font-['Space_Grotesk'] text-base font-bold text-[#F8FAFC] m-0">
                  Saver Tier
                </h2>
              </div>
              <div className="text-right">
                <span className="font-['Inter'] text-lg font-bold text-[#42D9FF] tabular-nums block">
                  ₹20,700
                </span>
                <span className="font-['Inter'] text-[10px] text-[#9CA8BD] tabular-nums">
                  ₹5,175 / person
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-['Inter']">
              <div className="flex items-center justify-between">
                <span className="text-[#9CA8BD]">Transit: KSRTC Airavat Bus</span>
                <span className="text-[#F8FAFC] tabular-nums">₹1,680 (4 pax)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA8BD]">Hotel: Indiranagar Homestay</span>
                <span className="text-[#42D9FF] font-bold tabular-nums">₹6,400 (2 rms)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA8BD]">Match: South Stand Tier 2</span>
                <span className="text-[#F8FAFC] tabular-nums">₹9,600</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9CA8BD]">Food &amp; Buffer</span>
                <span className="text-[#F8FAFC] tabular-nums">₹3,020</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] font-bold text-[#42D9FF]">
              SAVES ₹4,300 VS ₹25,000 BUDGET
            </span>
            {selectedTier === 'saver' && (
              <span className="px-1.5 py-0.2 rounded bg-[#42D9FF] text-[#080B18] text-[9px] font-['Space_Grotesk'] font-bold">
                ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

