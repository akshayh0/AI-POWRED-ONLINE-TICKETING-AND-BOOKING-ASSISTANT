'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Train, Ticket } from 'lucide-react';
import { MOCK_REGIONAL_EXPERIENCES } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export function RegionalBento() {
  const { language } = useLanguage();
  const [largeCard, smallCard1, smallCard2] = MOCK_REGIONAL_EXPERIENCES;

  return (
    <section className="w-full bg-[#080B18] py-12 md:py-16 border-t border-white/5 select-none">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 font-['Space_Grotesk'] text-xs text-[#42D9FF] uppercase tracking-wider mb-1 font-bold">
              <span>CURATED PASSAGES</span>
              <span>//</span>
              <span>{language === 'KN' ? 'ವಿಶೇಷ ಅನುಭವಗಳು (ಡೆಮೊ)' : 'SPECIAL EXPERIENCES (DEMO)'}</span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              {language === 'KN' ? 'ಪ್ರಾದೇಶಿಕ ವಿಶೇಷ ಅನುಭವಗಳು' : 'Featured Regional Experiences'}
            </h2>
          </div>
          <Link
            href="/assistant?q=Show%20me%20all%20curated%20regional%20packages%20in%20Karnataka"
            className="font-['Space_Grotesk'] text-xs font-bold text-[#8B5CF6] hover:text-[#7C3AED] flex items-center gap-1 transition-colors"
          >
            <span>{language === 'KN' ? 'ಎಲ್ಲಾ 24 ಪ್ಯಾಕೇಜ್‌ಗಳನ್ನು ನೋಡಿ' : 'Explore All 24 Packages'}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Asymmetric Bento Grid (7 cols + 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* ================= LARGE PRIMARY FEATURE (7 cols) ================= */}
          {largeCard && (
            <div className="lg:col-span-7 bg-[#10162A] border border-white/10 rounded overflow-hidden flex flex-col justify-between group hover:border-white/20 transition-all duration-300">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#181B29]" style={{ minHeight: '260px' }}>
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image
                    src={largeCard.image}
                    alt={largeCard.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#10162A] via-[#10162A]/40 to-transparent"></div>

                {/* Badge Top Left */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded text-[10px] font-['Space_Grotesk'] font-bold bg-[#FF8A3D] text-[#080B18] uppercase tracking-wider">
                    {largeCard.badge}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-bold bg-[#080B18]/80 text-white/80 border border-white/15 uppercase">
                    DEMO
                  </span>
                </div>

                {/* Price Bottom Right */}
                <div className="absolute bottom-4 right-4 bg-[#080B18]/90 backdrop-blur-md px-3.5 py-1.5 rounded border border-white/10">
                  <span className="font-['Inter'] text-lg font-bold text-[#FF8A3D] tabular-nums">
                    {formatINR(largeCard.price)}
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] ml-1 uppercase">
                    {largeCard.perPersonLabel} (DEMO)
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 font-['Space_Grotesk'] text-xs text-[#9CA8BD] mb-1 font-bold">
                    <span>{largeCard.location}</span>
                    <span>•</span>
                    <span>{largeCard.timing}</span>
                  </div>
                  <h3 className="font-['Space_Grotesk'] text-xl md:text-2xl font-bold text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors">
                    {largeCard.title}
                  </h3>
                  <p className="font-['Inter'] text-sm text-[#9CA8BD] mt-2 leading-relaxed">
                    {largeCard.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-xs font-['Space_Grotesk'] text-[#9CA8BD]">
                    <span className="flex items-center gap-1.5">
                      <Train className="w-4 h-4 text-[#42D9FF]" />
                      Express Transit Included
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-4 h-4 text-[#8B5CF6]" />
                      Royal Gate A
                    </span>
                  </div>

                  <Link
                    href={`/assistant?q=${encodeURIComponent(largeCard.title)}`}
                    className="px-4 py-2 rounded bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-['Space_Grotesk'] text-xs font-bold transition-colors"
                  >
                    {language === 'KN' ? 'ವಿವರಗಳನ್ನು ನೋಡಿ' : 'View Itinerary (Demo)'}
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2 STACKED FEATURES (5 cols) ================= */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            {/* Small Card 1 */}
            {smallCard1 && (
              <div className="bg-[#10162A] border border-white/10 rounded overflow-hidden flex flex-col sm:flex-row group hover:border-white/20 transition-all duration-300 flex-1">
                <div className="sm:w-2/5 h-44 sm:h-auto min-h-[176px] relative bg-[#181B29] shrink-0 overflow-hidden">
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <Image
                      src={smallCard1.image}
                      alt={smallCard1.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 20vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-bold bg-[#101320] text-[#42D9FF] border border-[#42D9FF]/30">
                      {smallCard1.badge}
                    </span>
                    <span className="px-1.5 py-0.2 bg-[#080B18]/80 text-[9px] text-[#9CA8BD] rounded border border-white/10">
                      DEMO
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] font-bold uppercase tracking-wider">
                      {smallCard1.location}
                    </span>
                    <h4 className="font-['Space_Grotesk'] text-base font-bold text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors mt-0.5 leading-snug">
                      {smallCard1.title}
                    </h4>
                    <p className="font-['Inter'] text-xs text-[#9CA8BD] mt-1.5 line-clamp-2 leading-relaxed">
                      {smallCard1.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="font-['Inter'] text-base font-bold text-[#F8FAFC] tabular-nums">
                      {formatINR(smallCard1.price)}
                    </span>
                    <Link
                      href={`/assistant?q=${encodeURIComponent(smallCard1.title)}`}
                      className="font-['Space_Grotesk'] text-xs font-bold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors flex items-center gap-1"
                    >
                      <span>{language === 'KN' ? 'ವಿವರ' : 'Details'}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Small Card 2 */}
            {smallCard2 && (
              <div className="bg-[#10162A] border border-white/10 rounded overflow-hidden flex flex-col sm:flex-row group hover:border-white/20 transition-all duration-300 flex-1">
                <div className="sm:w-2/5 h-44 sm:h-auto min-h-[176px] relative bg-[#181B29] shrink-0 overflow-hidden">
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <Image
                      src={smallCard2.image}
                      alt={smallCard2.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 20vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-bold bg-[#101320] text-[#FF8A3D] border border-[#FF8A3D]/30">
                      {smallCard2.badge}
                    </span>
                    <span className="px-1.5 py-0.2 bg-[#080B18]/80 text-[9px] text-[#9CA8BD] rounded border border-white/10">
                      DEMO
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] font-bold uppercase tracking-wider">
                      {smallCard2.location}
                    </span>
                    <h4 className="font-['Space_Grotesk'] text-base font-bold text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors mt-0.5 leading-snug">
                      {smallCard2.title}
                    </h4>
                    <p className="font-['Inter'] text-xs text-[#9CA8BD] mt-1.5 line-clamp-2 leading-relaxed">
                      {smallCard2.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="font-['Inter'] text-base font-bold text-[#F8FAFC] tabular-nums">
                      {formatINR(smallCard2.price)}
                    </span>
                    <Link
                      href={`/assistant?q=${encodeURIComponent(smallCard2.title)}`}
                      className="font-['Space_Grotesk'] text-xs font-bold text-[#8B5CF6] hover:text-[#7C3AED] transition-colors flex items-center gap-1"
                    >
                      <span>{language === 'KN' ? 'ವಿವರ' : 'Details'}</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
