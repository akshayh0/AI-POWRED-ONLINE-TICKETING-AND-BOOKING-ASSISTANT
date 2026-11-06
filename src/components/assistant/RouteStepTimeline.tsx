'use client';

import React from 'react';
import { Bus, Hotel, Utensils, Train, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface RouteStepTimelineProps {
  tier?: 'comfort' | 'saver';
}

export function RouteStepTimeline({ tier = 'saver' }: RouteStepTimelineProps) {
  const { language } = useLanguage();
  const isComfort = tier === 'comfort';

  const stops = [
    {
      time: '06:15 AM',
      color: 'text-[#8B5CF6]',
      title: isComfort ? 'Shatabdi Express (Train 12008)' : 'KSRTC Airavat Club Class',
      badge: isComfort ? '₹670 × 4 = ₹2,680' : '₹420 × 4 = ₹1,680',
      badgeColor: 'text-[#FF8A3D]',
      desc: isComfort
        ? 'Mysuru Jn (MYS) → KSR Bengaluru (SBC). Express journey 2 hrs with tea/breakfast onboard.'
        : 'Mysuru Suburb Stand → Majestic (Kempegowda Bus Station). Expected arrival 09:45 AM via Express Corridor.',
      icon: isComfort ? Train : Bus,
    },
    {
      time: '10:30 AM',
      color: 'text-[#9CA8BD]',
      title: isComfort
        ? 'Check-in: MG Road 4-Star Business Hotel'
        : 'Check-in: Indiranagar Boutique Homestay',
      badge: isComfort ? '₹5,800/night × 2 Rooms' : '₹3,200/night × 2 Rooms',
      badgeColor: 'text-[#42D9FF]',
      desc: isComfort
        ? 'Drop luggage & freshen up. Located 400m from stadium Gate 1 perimeter.'
        : 'Drop luggage & freshen up. 8-minute walk to Indiranagar Metro Station.',
      icon: Hotel,
    },
    {
      time: '02:00 PM',
      color: 'text-[#9CA8BD]',
      title: 'Lunch at Vidyarthi Bhavan or MTR (Heritage Meals)',
      badge: isComfort ? '₹1,800 est.' : '₹1,400 est.',
      badgeColor: 'text-[#9CA8BD]',
      desc: 'Iconic Bengaluru heritage meal; table pre-queue assistance via AI corridor dispatcher (demo).',
      icon: Utensils,
    },
    {
      time: '05:00 PM',
      color: 'text-[#42D9FF]',
      title: 'Namma Metro Purple Line to Cubbon Park',
      badge: '₹30 × 4 = ₹120',
      badgeColor: 'text-[#8B5CF6]',
      desc: 'Avoid MG Road surface bottleneck. Cubbon Park Gate 2 exit opens directly into Chinnaswamy perimeter.',
      icon: Train,
    },
    {
      time: '07:30 PM',
      color: 'text-[#FF8A3D]',
      title: isComfort ? 'Match start • East Stand Block D' : 'Match start • South Stand Tier 2',
      badge: 'LIVE MATCH (DEMO)',
      badgeColor: 'text-[#FF8A3D]',
      desc: 'Chinnaswamy Stadium • RCB vs CSK under floodlights. High-energy corridor rivalry.',
      icon: Sparkles,
    },
    {
      time: '11:00 PM',
      color: 'text-[#9CA8BD]',
      title: 'Return Options to Mysuru',
      badge: 'TWO CHOICES',
      badgeColor: 'text-[#9CA8BD]',
      desc: 'Choice A: Midnight KSRTC Express (11:45 PM Satellite Station) OR Choice B: Sunday morning 12008 Shatabdi Express (06:00 AM).',
      icon: Bus,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <span className="font-['Space_Grotesk'] text-xs text-[#9CA8BD] uppercase tracking-wider font-bold">
          {language === 'KN'
            ? 'ಪ್ರಯಾಣ ಮಾರ್ಗ ವೇಳಾಪಟ್ಟಿ (ಶನಿವಾರ • ಡೆಮೊ)'
            : 'EXPEDITION ROUTE TIMELINE (SATURDAY • DEMO)'}
        </span>
        <span className="font-['Space_Grotesk'] text-[11px] text-[#42D9FF] font-bold">
          MYS → SBC CORRIDOR
        </span>
      </div>

      <div className="bg-[#1C1F2D] border border-white/10 rounded p-4 flex flex-col gap-4 shadow-sm">
        {stops.map((stop, idx) => {
          const Icon = stop.icon;
          const isLast = idx === stops.length - 1;
          return (
            <div key={idx} className="flex items-start gap-3 sm:gap-4">
              <div className="flex flex-col items-center shrink-0 w-16">
                <span className={`font-['Space_Grotesk'] text-xs font-bold tabular-nums ${stop.color}`}>
                  {stop.time}
                </span>
                {!isLast && <div className="w-px h-8 bg-white/10 my-1"></div>}
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Icon className="w-3.5 h-3.5 text-[#9CA8BD] shrink-0" />
                  <span className="font-['Space_Grotesk'] text-xs font-bold text-[#F8FAFC]">
                    {stop.title}
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded bg-[#080B18] font-['Inter'] text-[11px] font-bold tabular-nums border border-white/10 ${stop.badgeColor}`}
                  >
                    {stop.badge}
                  </span>
                </div>
                <p className="font-['Inter'] text-xs text-[#9CA8BD] mt-0.5 leading-relaxed">
                  {stop.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

