'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Ticket } from 'lucide-react';
import { MOCK_TRENDING_MATCHES } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

function StadiumIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="12" rx="10" ry="6" />
      <ellipse cx="12" cy="12" rx="6" ry="3" />
      <path d="M12 6v3" />
      <path d="M12 15v3" />
      <path d="M2 12h3" />
      <path d="M19 12h3" />
    </svg>
  );
}

export function TrendingMatches() {
  const { language } = useLanguage();

  return (
    <section className="w-full bg-[#080B18] py-12 md:py-16 border-t border-white/5 select-none">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 font-['Space_Grotesk'] text-xs text-[#42D9FF] uppercase tracking-wider mb-1 font-bold">
              <span>DISPATCH 01</span>
              <span>//</span>
              <span>{language === 'KN' ? 'ಕ್ರೀಡಾಂಗಣ ಪಂದ್ಯಗಳು (ಡೆಮೊ)' : 'STADIUM FIXTURES (DEMO)'}</span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              {language === 'KN' ? 'ಟ್ರೆಂಡಿಂಗ್ ಪಂದ್ಯಗಳು & ವೇಳಾಪಟ್ಟಿ' : 'Trending Matches & Fixtures'}
            </h2>
          </div>
          <div className="font-['Space_Grotesk'] text-xs text-[#9CA8BD] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
            <span className="text-[#22C55E] font-bold">SIMULATED INVENTORY FEED (DEMO)</span>
          </div>
        </div>

        {/* Ticket Stubs Stack */}
        <div className="flex flex-col gap-6">
          {MOCK_TRENDING_MATCHES.map((match) => (
            <div
              key={match.id}
              className="w-full bg-[#10162A] border border-white/10 rounded overflow-hidden shadow-lg hover:border-white/20 transition-all duration-300 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                {/* ================= STUB LEFT: DATE & VENUE ================= */}
                <div className="lg:col-span-2 bg-[#171E35] p-5 md:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 relative">
                  <div>
                    <span className="font-['Space_Grotesk'] text-[10px] text-[#FF8A3D] uppercase tracking-widest font-bold">
                      {match.tournament} (DEMO)
                    </span>
                    <div className="font-['Space_Grotesk'] text-3xl font-bold text-[#F8FAFC] mt-1 tabular-nums">
                      {match.date.dayNumber} {match.date.month}
                    </div>
                    <div className="font-['Space_Grotesk'] text-xs text-[#9CA8BD] font-medium">
                      {match.date.dayOfWeek} • {match.date.time}
                    </div>
                  </div>

                  <div className="mt-4 pt-2 font-['Inter'] text-xs text-[#9CA8BD] flex items-center gap-1.5 border-t border-white/10">
                    <StadiumIcon className="w-3.5 h-3.5 text-[#42D9FF] shrink-0" />
                    <span className="truncate uppercase font-['Space_Grotesk'] text-[11px] font-bold">
                      {match.venue.stadium.includes('Chinnaswamy') ? 'CHINNASWAMY' : 'KSCA HUBBALLI'}
                    </span>
                  </div>
                </div>

                {/* ================= STUB MIDDLE: TEAMS & TELEMETRY ================= */}
                <div className="lg:col-span-7 p-5 md:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap mb-1.5">
                      <h3 className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold text-[#F8FAFC] tracking-tight">
                        {match.teams.home} <span className="text-[#9CA8BD]">vs</span> {match.teams.away}
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-bold bg-[#FF8A3D]/15 text-[#FF8A3D] border border-[#FF8A3D]/30 uppercase">
                        {match.telemetry.demandLevel} (DEMO)
                      </span>
                      <span className="font-['Inter'] text-xs text-[#9CA8BD]">
                        {match.teams.kannadaTitle}
                      </span>
                    </div>

                    <p className="font-['Inter'] text-sm text-[#9CA8BD] flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#9CA8BD] shrink-0" />
                      <span>{match.venue.stadium}, {match.venue.city} • {match.venue.gateInfo}</span>
                    </p>
                  </div>

                  {/* Telemetry Progress Bar */}
                  <div className="mt-6 pt-2">
                    <div className="flex items-center justify-between text-xs font-['Space_Grotesk'] mb-1.5">
                      <span className="text-[#FF8A3D] font-bold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D]"></span>
                        {match.telemetry.bookedPercent}% SIMULATED BOOKED • {match.telemetry.seatsRemaining} DEMO SEATS
                      </span>
                      <span className="text-[#9CA8BD] hidden sm:inline text-[11px]">
                        {match.telemetry.tatkalReserveStatus}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#080B18] rounded overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FF8A3D] to-[#8B5CF6] rounded transition-all duration-500"
                        style={{ width: `${match.telemetry.bookedPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* ================= STUB RIGHT: FARE, BARCODE & ACTION ================= */}
                <div className="lg:col-span-3 bg-[#181B29] p-5 md:p-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 relative">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] uppercase tracking-wider block font-bold">
                        {match.pricing.tierName} • DEMO
                      </span>
                      <span className="font-['Inter'] text-2xl font-bold text-[#F8FAFC] tabular-nums">
                        {formatINR(match.pricing.startingPrice)}
                      </span>
                      <span className="font-['Inter'] text-xs text-[#9CA8BD] block mt-0.5">
                        {match.pricing.entryGate}
                      </span>
                    </div>

                    {/* Simulated 1D Barcode Pattern */}
                    <div className="flex gap-0.5 items-end h-9 opacity-40 shrink-0" title="Demo Barcode">
                      <span className="w-0.5 h-9 bg-white"></span>
                      <span className="w-1 h-9 bg-white"></span>
                      <span className="w-0.5 h-7 bg-white"></span>
                      <span className="w-1.5 h-9 bg-white"></span>
                      <span className="w-0.5 h-6 bg-white"></span>
                      <span className="w-1 h-9 bg-white"></span>
                      <span className="w-0.5 h-8 bg-white"></span>
                      <span className="w-1.5 h-9 bg-white"></span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <Link
                      href="/stadium"
                      className="w-full py-2.5 px-4 rounded bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-['Space_Grotesk'] text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#8B5CF6]/20"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>{language === 'KN' ? 'ಟಿಕೆಟ್ ಬುಕ್ ಮಾಡಿ (3D ನೋಟ)' : 'Book Match Pass (3D View)'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
