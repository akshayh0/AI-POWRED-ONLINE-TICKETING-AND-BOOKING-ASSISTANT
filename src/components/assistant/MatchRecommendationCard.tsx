'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Trophy } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { formatINR } from '@/lib/utils';

interface MatchRecommendationCardProps {
  tier?: 'comfort' | 'saver';
}

export function MatchRecommendationCard({ tier = 'saver' }: MatchRecommendationCardProps) {
  const { language } = useLanguage();

  const isComfort = tier === 'comfort';
  const standName = isComfort ? 'East Stand, Block D' : 'South Stand, Tier 2';
  const perTicketPrice = isComfort ? 3200 : 2400;
  const totalPrice = perTicketPrice * 4;

  return (
    <div className="bg-[#1C1F2D] border border-white/10 rounded p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF8A3D] animate-pulse"></span>
          <span className="font-['Space_Grotesk'] text-sm md:text-base font-bold text-[#F8FAFC] uppercase tracking-tight">
            RCB vs CSK • Sat 7:30 PM • M. Chinnaswamy Stadium
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-[#FF8A3D]/15 text-[#FF8A3D] border border-[#FF8A3D]/30 font-['Space_Grotesk'] text-[10px] font-bold uppercase">
          MATCH DAY CONFIRMED (DEMO)
        </span>
      </div>

      {/* Recommendation Row */}
      <div className="p-3 bg-[#080B18] border border-white/10 rounded flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-[#FF8A3D] shrink-0" />
            <span className="font-['Space_Grotesk'] text-xs font-bold text-[#8B5CF6]">
              {standName}
            </span>
            <span className="text-[#9CA8BD]">•</span>
            <span className="font-['Inter'] text-xs font-bold text-[#F8FAFC] tabular-nums">
              {formatINR(perTicketPrice)} each ({formatINR(totalPrice)} total for 4 pax • demo)
            </span>
          </div>
          <p className="font-['Inter'] text-xs text-[#9CA8BD]">
            {isComfort
              ? 'Shaded after 5:00 PM, direct sightline of bowler run-up, rapid Gate 7 exit to Cubbon Park Metro.'
              : 'Clear high vantage point of outfield, best value within budget cap, Gate 12 entry.'}
          </p>
        </div>
        <Link
          href="/stadium"
          className="shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#262938] hover:bg-[#313443] text-white font-['Space_Grotesk'] text-xs font-bold rounded transition-colors shadow-sm border border-white/10"
        >
          <Eye className="w-3.5 h-3.5 text-[#42D9FF]" />
          <span>{language === 'KN' ? '3D ಯಲ್ಲಿ ಆಸನಗಳನ್ನು ವೀಕ್ಷಿಸಿ →' : 'View seats in 3D →'}</span>
        </Link>
      </div>
    </div>
  );
}

