'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Bus, Hotel, Ticket } from 'lucide-react';
import { MOCK_MULTI_LEG_BUNDLES } from '@/lib/mockData';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export function MultiLegBundles() {
  const { language } = useLanguage();

  return (
    <section className="w-full bg-[#080B18] py-12 md:py-16 border-t border-white/5 select-none">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 font-['Space_Grotesk'] text-xs text-[#42D9FF] uppercase tracking-wider mb-1 font-bold">
              <span>MULTI-LEG ITINERARIES</span>
              <span>//</span>
              <span>{language === 'KN' ? 'ಸ್ಮಾರ್ಟ್ ಪ್ಯಾಕೇಜ್‌ಗಳು (ಡೆಮೊ)' : 'SMART BUNDLES (DEMO)'}</span>
            </div>
            <h2 className="font-['Space_Grotesk'] text-2xl md:text-3xl font-bold text-[#F8FAFC] tracking-tight">
              {language === 'KN' ? 'ಸಂಯೋಜಿತ ಪಂದ್ಯ ಮತ್ತು ಸಾರಿಗೆ ಪ್ಯಾಕೇಜ್‌ಗಳು' : 'Integrated Matchday & Transit Bundles'}
            </h2>
          </div>
          <div className="font-['Space_Grotesk'] text-xs text-[#9CA8BD] flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
            <span className="text-[#22C55E] font-bold">ALL-INCLUSIVE VERIFIED SLOTS (DEMO)</span>
          </div>
        </div>

        {/* Comparison Matrix Table Container */}
        <div className="w-full bg-[#10162A] border border-white/10 rounded overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[860px]">
              <thead>
                <tr className="bg-[#171E35] text-[#9CA8BD] font-['Space_Grotesk'] text-xs uppercase tracking-wider border-b border-white/10 font-bold">
                  <th className="py-4 px-6 w-[26%]">{language === 'KN' ? 'ಪ್ರಯಾಣ ಪ್ಯಾಕೇಜ್ (ಡೆಮೊ)' : 'Trip Package (Demo)'}</th>
                  <th className="py-4 px-6 w-[22%]">{language === 'KN' ? 'ಸಾರಿಗೆ ವಿಭಾಗ' : 'Transport Segment'}</th>
                  <th className="py-4 px-6 w-[20%]">{language === 'KN' ? 'ವಸತಿ / ಹೋಟೆಲ್' : 'Stay / Accommodation'}</th>
                  <th className="py-4 px-6 w-[18%]">{language === 'KN' ? 'ಪಂದ್ಯದ ಟಿಕೆಟ್' : 'Match Tickets'}</th>
                  <th className="py-4 px-6 w-[14%] text-right">{language === 'KN' ? 'ಒಟ್ಟು ವೆಚ್ಚ' : 'Total Price'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm font-['Inter']">
                {MOCK_MULTI_LEG_BUNDLES.map((bundle) => (
                  <tr key={bundle.id} className="hover:bg-[#181B29]/70 transition-colors">
                    {/* Column 1: Package Title */}
                    <td className="py-5 px-6 align-top">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-bold ${
                            bundle.badgeText === 'BEST VALUE'
                              ? 'bg-[#FF8A3D] text-[#080B18]'
                              : 'bg-[#1C1F2D] text-[#42D9FF] border border-[#42D9FF]/30'
                          }`}
                        >
                          {bundle.badgeText}
                        </span>
                        <span className="px-1.5 py-0.2 bg-[#080B18] text-[9px] text-[#9CA8BD] rounded border border-white/10">
                          DEMO
                        </span>
                      </div>
                      <div className="font-['Space_Grotesk'] text-base font-bold text-[#F8FAFC]">
                        {bundle.packageName}
                      </div>
                      <div className="text-xs text-[#9CA8BD] mt-0.5">{bundle.packageSubtitle}</div>
                    </td>

                    {/* Column 2: Transport */}
                    <td className="py-5 px-6 align-top">
                      <div className="flex items-center gap-1.5 text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold">
                        <Bus className="w-3.5 h-3.5 text-[#42D9FF]" />
                        <span>{bundle.transport.serviceName}</span>
                      </div>
                      <div className="text-xs text-[#9CA8BD] mt-0.5">{bundle.transport.timing}</div>
                      <div className="font-['Inter'] text-xs text-[#FF8A3D] mt-1 tabular-nums font-semibold">
                        {formatINR(bundle.transport.pricePerPerson)} / seat (demo)
                      </div>
                    </td>

                    {/* Column 3: Stay */}
                    <td className="py-5 px-6 align-top">
                      <div className="flex items-center gap-1.5 text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold">
                        <Hotel className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        <span>{bundle.stay.hotelName}</span>
                      </div>
                      <div className="text-xs text-[#9CA8BD] mt-0.5">{bundle.stay.proximity}</div>
                      <div className="font-['Inter'] text-xs text-[#9CA8BD] mt-1 tabular-nums">
                        {formatINR(bundle.stay.pricePerNight)} / night (demo)
                      </div>
                    </td>

                    {/* Column 4: Match */}
                    <td className="py-5 px-6 align-top">
                      <div className="flex items-center gap-1.5 text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold">
                        <Ticket className="w-3.5 h-3.5 text-[#FF8A3D]" />
                        <span>{bundle.match.standName}</span>
                      </div>
                      <div className="text-xs text-[#9CA8BD] mt-0.5">{bundle.match.gateAccess}</div>
                      <div className="font-['Inter'] text-xs text-[#9CA8BD] mt-1 tabular-nums">
                        {formatINR(bundle.match.pricePerTicket)} / ticket (demo)
                      </div>
                    </td>

                    {/* Column 5: Total & Action */}
                    <td className="py-5 px-6 align-top text-right">
                      <div className="font-['Inter'] text-xl font-bold text-[#8B5CF6] tabular-nums">
                        {formatINR(bundle.totalPriceForTwo)}
                      </div>
                      <div className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] uppercase">
                        DEMO TOTAL FOR 2 PERSONS
                      </div>
                      <Link
                        href={`/assistant?q=Configure%20bundle:%20${encodeURIComponent(bundle.packageName)}`}
                        className="mt-2.5 inline-block w-full py-1.5 px-3 rounded bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-['Space_Grotesk'] text-xs font-bold transition-colors text-center shadow-md shadow-[#8B5CF6]/20"
                      >
                        {language === 'KN' ? 'ಪ್ಯಾಕೇಜ್ ಲಾಕ್ ಮಾಡಿ' : 'Lock Bundle (Demo)'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
