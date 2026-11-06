'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MOCK_CORRIDOR_DESTINATIONS } from '@/lib/mockData';
import { useLanguage } from '@/context/LanguageContext';

export function DestinationCards() {
  const { language } = useLanguage();

  return (
    <section className="w-full bg-[#080B18] py-12 md:py-16 border-t border-white/5 select-none">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="font-['Space_Grotesk'] text-xs text-[#42D9FF] uppercase tracking-wider mb-1 font-bold">
              NETWORK HUBS // ಸ್ಥಳಗಳು
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              {language === 'KN' ? 'ಕಾರಿಡಾರ್ ಸಂಪರ್ಕ ತಾಣಗಳು' : 'Corridor Destinations'}
            </h2>
          </div>
          <div className="font-['Space_Grotesk'] text-xs text-[#9CA8BD] hidden sm:block font-medium">
            5 CONNECTED TERMINALS (MYS-BLR ROUTE • DEMO)
          </div>
        </div>

        {/* 5-Column Vertical Editorial Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 items-stretch">
          {MOCK_CORRIDOR_DESTINATIONS.map((dest, idx) => (
            <Link
              key={dest.id}
              href={`/assistant?q=Plan%20a%20trip%20to%20${encodeURIComponent(dest.name)}`}
              className={`bg-[#10162A] border border-white/10 rounded h-96 relative overflow-hidden group flex flex-col justify-between p-5 hover:border-white/30 transition-all duration-500 ${
                idx === 4 ? 'col-span-2 md:col-span-1' : ''
              }`}
              style={{ minHeight: '384px', position: 'relative' }}
            >
              {/* Background Photo with Zoom on Hover */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
              </div>

              {/* Vignette Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B18] via-[#080B18]/65 to-transparent"></div>

              {/* Rotated Vertical Edge Text (Exact Stitch Design Signature) */}
              <div className="absolute top-4 right-3.5 vertical-rl font-['Space_Grotesk'] text-[11px] font-bold tracking-widest text-[#9CA8BD] uppercase select-none opacity-80 group-hover:text-[#42D9FF] transition-colors">
                {dest.verticalLabel}
              </div>

              {/* Top Badge */}
              <div className="relative z-10 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-bold bg-[#080B18]/80 backdrop-blur-sm border border-white/15 text-[#42D9FF] tracking-wider uppercase">
                  {dest.badgeText}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-['Space_Grotesk'] bg-[#080B18]/80 text-[#9CA8BD] border border-white/10">
                  DEMO
                </span>
              </div>

              {/* Bottom Card Information */}
              <div className="relative z-10">
                <div className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] font-bold uppercase tracking-wider">
                  {dest.code}
                </div>
                <h3 className="font-['Space_Grotesk'] text-xl font-bold text-[#F8FAFC] leading-tight group-hover:text-[#8B5CF6] transition-colors mt-0.5">
                  {language === 'KN' ? dest.kannadaName : dest.name}
                </h3>
                <p className="font-['Inter'] text-xs text-[#9CA8BD] mt-1">
                  {dest.kannadaName} • {dest.stationSubtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
