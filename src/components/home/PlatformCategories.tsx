'use client';

import React from 'react';
import Link from 'next/link';
import {
  Trophy,
  Film,
  Trees,
  Landmark,
  Music,
  Hotel,
  Bus,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function PlatformCategories() {
  const { language } = useLanguage();

  const categories = [
    {
      id: 'cricket',
      name: 'Cricket & Sports',
      kannadaName: 'ಕ್ರಿಕೆಟ್ & ಕ್ರೀಡೆ',
      count: 'IPL & Ranji',
      icon: Trophy,
      color: 'text-[#FF8A3D] group-hover:text-[#FF8A3D]',
      borderColor: 'hover:border-[#FF8A3D]/40',
      href: '/stadium',
    },
    {
      id: 'cinema',
      name: 'Cinema & Premieres',
      kannadaName: 'ಚಿತ್ರಮಂದಿರ & ಶೋ',
      count: 'Kannada & Pan-India',
      icon: Film,
      color: 'text-[#8B5CF6] group-hover:text-[#8B5CF6]',
      borderColor: 'hover:border-[#8B5CF6]/40',
      href: '/assistant?q=Show%20me%20cinema%20and%20movie%20tickets%20in%20Bengaluru%20and%20Mysuru',
    },
    {
      id: 'zoo',
      name: 'Zoo & Safaris',
      kannadaName: 'ಮೃಗಾಲಯ & ಸಫಾರಿ',
      count: 'Mysuru Zoo & Bannerghatta',
      icon: Trees,
      color: 'text-[#22C55E] group-hover:text-[#22C55E]',
      borderColor: 'hover:border-[#22C55E]/40',
      href: '/assistant?q=Book%20Mysuru%20Zoo%20and%20Bannerghatta%20Safari%20passes',
    },
    {
      id: 'heritage',
      name: 'Heritage & Tourism',
      kannadaName: 'ಪಾರಂಪರಿಕ ತಾಣಗಳು',
      count: 'Palace, Hampi, Belur',
      icon: Landmark,
      color: 'text-[#42D9FF] group-hover:text-[#42D9FF]',
      borderColor: 'hover:border-[#42D9FF]/40',
      href: '/assistant?q=Explore%20Karnataka%20heritage%20packages%20and%20palace%20entry',
    },
    {
      id: 'concerts',
      name: 'Concerts & Events',
      kannadaName: 'ಸಂಗೀತ ಕಚೇರಿಗಳು',
      count: 'Palace Grounds & Live',
      icon: Music,
      color: 'text-[#FB7185] group-hover:text-[#FB7185]',
      borderColor: 'hover:border-[#FB7185]/40',
      href: '/assistant?q=Find%20upcoming%20live%20music%20and%20concerts%20in%20Bengaluru',
    },
    {
      id: 'hotels',
      name: 'Hotels & Stays',
      kannadaName: 'ಹೋಟೆಲ್ & ಹೋಮ್‌ಸ್ಟೇ',
      count: 'Corridor Accommodations',
      icon: Hotel,
      color: 'text-[#8B5CF6] group-hover:text-[#8B5CF6]',
      borderColor: 'hover:border-[#8B5CF6]/40',
      href: '/assistant?q=Find%20hotel%20stays%20near%20Chinnaswamy%20Stadium%20and%20Mysuru',
    },
    {
      id: 'transit',
      name: 'Corridor Transit',
      kannadaName: 'ಸಾರಿಗೆ ಕಾರಿಡಾರ್',
      count: 'KSRTC, Shatabdi & Metro',
      icon: Bus,
      color: 'text-[#42D9FF] group-hover:text-[#42D9FF]',
      borderColor: 'hover:border-[#42D9FF]/40',
      href: '/assistant?q=Plan%20KSRTC%20Airavat%20and%20Shatabdi%20transit%20options',
    },
  ];

  return (
    <section className="w-full bg-[#080B18] py-6 border-b border-white/5 select-none">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2 font-['Space_Grotesk'] text-[#42D9FF] font-bold uppercase tracking-wider text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'KN'
                ? 'ಟಿಕೆಟ್‌ಈಸ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಪರಿಸರ ವ್ಯವಸ್ಥೆ'
                : 'TICKETEASE MULTIMODAL ECOSYSTEM'}
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] font-semibold uppercase hidden sm:inline">
            CRICKET • CINEMA • ZOO • HERITAGE • CONCERTS • STAYS • TRANSIT
          </span>
        </div>

        {/* Categories Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className={`bg-[#10162A] border border-white/10 rounded p-3 flex flex-col justify-between group transition-all duration-200 ${cat.borderColor} hover:bg-[#171E35] shadow-sm`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-7 h-7 rounded bg-[#1C1F2D] flex items-center justify-center border border-white/5">
                    <Icon className={`w-4 h-4 ${cat.color} transition-colors`} />
                  </div>
                  <span className="font-['Space_Grotesk'] text-[9px] text-[#9CA8BD] uppercase tracking-wider">
                    DEMO
                  </span>
                </div>

                <div>
                  <div className="font-['Space_Grotesk'] text-xs font-bold text-[#F8FAFC] group-hover:text-white transition-colors leading-tight">
                    {language === 'KN' ? cat.kannadaName : cat.name}
                  </div>
                  <div className="font-['Inter'] text-[10px] text-[#9CA8BD] mt-0.5 truncate">
                    {cat.count}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

