'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { MOCK_UPCOMING_EVENTS } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export function EventsTimeline() {
  const router = useRouter();
  const { language } = useLanguage();
  const [pnrInput, setPnrInput] = useState('');

  const handleSyncPnr = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrInput.trim()) {
      router.push(`/my-journey?pnr=${encodeURIComponent(pnrInput.trim())}`);
    } else {
      router.push('/my-journey');
    }
  };

  return (
    <section className="w-full bg-[#080B18] py-12 md:py-16 border-t border-white/5 select-none">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 font-['Space_Grotesk'] text-xs text-[#42D9FF] uppercase tracking-wider mb-1 font-bold">
              <span>CALENDAR ENGINE</span>
              <span>//</span>
              <span>{language === 'KN' ? 'ಮುಂದಿನ ದಿನಾಂಕಗಳು (ಡೆಮೊ)' : 'UPCOMING DATES (DEMO)'}</span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              {language === 'KN' ? 'ಮುಂದಿನ ಕಾರ್ಯಕ್ರಮಗಳ ವೇಳಾಪಟ್ಟಿ' : 'Upcoming Events Timeline'}
            </h2>
          </div>
          <div className="font-['Space_Grotesk'] text-xs text-[#9CA8BD] font-medium">
            SYNCHRONIZED WITH REGIONAL TIMETABLES (DEMO)
          </div>
        </div>

        {/* Timeline Events Stack */}
        <div className="flex flex-col gap-4">
          {MOCK_UPCOMING_EVENTS.map((event) => (
            <div
              key={event.id}
              className="bg-[#10162A] border border-white/10 rounded p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-start md:items-center gap-6">
                {/* Large Date Callout */}
                <div className="shrink-0 w-20 md:w-24 text-left border-r border-white/10 pr-4 md:pr-6">
                  <span className="font-['Space_Grotesk'] text-4xl md:text-5xl font-bold leading-none text-[#F8FAFC] block tabular-nums">
                    {event.dayNumber}
                  </span>
                  <span className="font-['Space_Grotesk'] text-xs md:text-sm font-bold text-[#FF8A3D] uppercase tracking-wider mt-1 block">
                    {event.month}
                  </span>
                </div>

                {/* Event Data */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-bold bg-[#FF8A3D]/15 text-[#FF8A3D] uppercase border border-[#FF8A3D]/25">
                      {event.badgeText}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-['Space_Grotesk'] bg-[#080B18] text-[#9CA8BD] border border-white/10">
                      DEMO
                    </span>
                    <span className="font-['Space_Grotesk'] text-xs text-[#9CA8BD] font-semibold">
                      {event.seriesCode}
                    </span>
                  </div>

                  <h3 className="font-['Space_Grotesk'] text-lg md:text-xl font-bold text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors">
                    {event.title}
                  </h3>
                  <p className="font-['Inter'] text-xs md:text-sm text-[#9CA8BD] mt-1 leading-relaxed">
                    {event.venueAndTransit}
                  </p>
                </div>
              </div>

              {/* Fare & Action */}
              <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                <div className="text-left md:text-right">
                  <span className="font-['Inter'] text-lg font-bold text-[#F8FAFC] tabular-nums block">
                    {formatINR(event.startingPrice)}
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] uppercase">
                    {event.fareLabel} (DEMO)
                  </span>
                </div>

                <Link
                  href={`/assistant?q=Book%20event:%20${encodeURIComponent(event.title)}`}
                  className="px-4 py-2.5 rounded bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-['Space_Grotesk'] text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#8B5CF6]/20"
                >
                  <span>{language === 'KN' ? 'ಪ್ರಯಾಣ ಕಾಯ್ದಿರಿಸಿ' : 'Reserve Journey (Demo)'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action: My Journey / PNR Sync Prompt Banner */}
        <div className="mt-10 bg-[#10162A] border border-white/10 p-6 md:p-8 rounded flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="font-['Space_Grotesk'] text-xs text-[#42D9FF] font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#42D9FF]" />
              <span>TRANSIT PASSPORT // ನನ್ನ ಪ್ರಯಾಣ</span>
            </div>
            <div className="font-['Space_Grotesk'] text-xl font-bold text-[#F8FAFC]">
              {language === 'KN'
                ? 'ಈಗಾಗಲೇ ಟಿಕೆಟ್ ಅಥವಾ ಪಿಎನ್‌ಆರ್ ಹೊಂದಿರುವಿರಾ?'
                : 'Already holding a ticket or PNR?'}
            </div>
            <p className="font-['Inter'] text-sm text-[#9CA8BD] mt-1 max-w-xl">
              {language === 'KN'
                ? 'ಭಾರತೀಯ ರೈಲ್ವೆ 10-ಅಂಕಿಯ ಪಿಎನ್‌ಆರ್ ಅಥವಾ ಕೆಎಸ್‌ಸಿಎ ಕ್ಯೂಆರ್ ಕೋಡ್ ಅನ್ನು ಸಿಂಕ್ ಮಾಡಿ ಲೈವ್ ಗೇಟ್ ಜ್ಞಾಪನೆಗಳನ್ನು ಪಡೆಯಿರಿ (ಡೆಮೊ).'
                : 'Connect your Indian Railways 10-digit PNR or KSCA physical QR code to synchronize live gate reminders and transit schedules (Demo).'}
            </p>
          </div>

          <form onSubmit={handleSyncPnr} className="flex items-center gap-2 shrink-0 w-full md:w-auto">
            <input
              type="text"
              maxLength={10}
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value)}
              placeholder="Enter 10-digit PNR"
              className="bg-[#080B18] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-medium px-4 py-2.5 rounded border border-white/10 focus:outline-none focus:border-[#8B5CF6] placeholder:text-[#9CA8BD]/60 w-full md:w-48 tracking-wider uppercase"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-['Space_Grotesk'] text-xs font-bold transition-colors shrink-0 shadow-md shadow-[#8B5CF6]/20"
            >
              {language === 'KN' ? 'ಸಿಂಕ್ ಮಾಡಿ' : 'Sync Trip'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
