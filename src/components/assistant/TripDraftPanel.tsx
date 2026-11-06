'use client';

import React, { useState } from 'react';
import {
  Trophy,
  Bus,
  Hotel,
  Coffee,
  Share2,
  Download,
  ShieldCheck,
  CheckCircle,
  LucideIcon,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

export interface DraftItem {
  id: string;
  icon: LucideIcon;
  iconColor: string;
  title: string;
  desc: string;
  price: number;
}

interface TripDraftPanelProps {
  items?: DraftItem[];
  totalBudget?: number;
  tier?: 'comfort' | 'saver';
  groupSize?: number;
  onShare?: () => void;
  onDownload?: () => void;
  onCheckout?: () => void;
}

export function TripDraftPanel({
  items,
  totalBudget = 25000,
  tier = 'saver',
  groupSize = 4,
  onShare,
  onDownload,
  onCheckout,
}: TripDraftPanelProps) {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(false);

  // Default demo items if not passed dynamically
  const defaultItems: DraftItem[] =
    tier === 'comfort'
      ? [
          {
            id: 'match-ticket',
            icon: Trophy,
            iconColor: 'text-[#FF8A3D]',
            title: 'RCB vs CSK Match',
            desc: 'East Stand Block D (4 tickets) @ ₹3,200',
            price: 12800,
          },
          {
            id: 'transit',
            icon: Bus,
            iconColor: 'text-[#42D9FF]',
            title: 'Shatabdi Express (Train 12008)',
            desc: 'Mysuru → SBC (4 CC Seats) @ ₹850',
            price: 3400,
          },
          {
            id: 'stay',
            icon: Hotel,
            iconColor: 'text-[#8B5CF6]',
            title: 'MG Road 4-Star Stay',
            desc: '1 Night • 2 Deluxe Rooms @ ₹5,800/rm',
            price: 11600,
          },
          {
            id: 'food-metro',
            icon: Coffee,
            iconColor: 'text-[#9CA8BD]',
            title: 'Food & Namma Metro',
            desc: 'Heritage meals allowance + Metro buffer',
            price: 4800,
          },
        ]
      : [
          {
            id: 'match-ticket',
            icon: Trophy,
            iconColor: 'text-[#FF8A3D]',
            title: 'RCB vs CSK Match',
            desc: 'South Stand Tier 2 (4 tickets) @ ₹2,400',
            price: 9600,
          },
          {
            id: 'transit',
            icon: Bus,
            iconColor: 'text-[#42D9FF]',
            title: 'KSRTC Airavat Express',
            desc: 'Mysuru → BLR (4 seats) @ ₹420',
            price: 1680,
          },
          {
            id: 'stay',
            icon: Hotel,
            iconColor: 'text-[#8B5CF6]',
            title: 'Indiranagar Homestay',
            desc: '1 Night • 2 Rooms @ ₹3,200/rm',
            price: 6400,
          },
          {
            id: 'food-metro',
            icon: Coffee,
            iconColor: 'text-[#9CA8BD]',
            title: 'Food & Namma Metro',
            desc: 'Meals allowance + Metro Purple Line buffer',
            price: 3020,
          },
        ];

  const currentItems = items || defaultItems;
  const totalCommitted = currentItems.reduce((acc, curr) => acc + curr.price, 0);
  const costPerPerson = Math.round(totalCommitted / groupSize);
  const utilizationPercent = Math.min(100, Math.round((totalCommitted / totalBudget) * 100));

  const handleShareClick = () => {
    setCopied(true);
    if (onShare) onShare();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadClick = () => {
    setDownloadNotice(true);
    if (onDownload) onDownload();
    setTimeout(() => setDownloadNotice(false), 2500);
  };

  return (
    <aside className="flex flex-col bg-[#10162A] border border-white/10 rounded p-4 h-[calc(100vh-8rem)] lg:sticky top-20 shadow-md justify-between">
      <div className="flex flex-col gap-3 overflow-y-auto pr-1">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex flex-col">
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-[#F8FAFC] leading-tight m-0">
              {language === 'KN' ? 'ಪ್ರಯಾಣ ಡ್ರಾಫ್ಟ್' : 'Trip Draft'}
            </h2>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#42D9FF] font-semibold">
              {language === 'KN' ? 'ಲೈವ್ ಡ್ರಾಫ್ಟ್ • ನೈಜ ಸಮಯ' : 'ಲೈವ್ ಡ್ರಾಫ್ಟ್ (LIVE DRAFT)'}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#42D9FF]/15 text-[#42D9FF] border border-[#42D9FF]/30 font-['Space_Grotesk'] text-[10px] font-bold tracking-wider animate-pulse">
            SYNCED
          </span>
        </div>

        {/* Draft Line Items Container */}
        <div className="flex flex-col gap-2.5">
          {currentItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-3 bg-[#1C1F2D] border border-white/5 rounded flex flex-col gap-1 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.iconColor} shrink-0`} />
                    <span className="font-['Space_Grotesk'] text-xs font-bold text-[#F8FAFC]">
                      {item.title}
                    </span>
                  </div>
                  <span className="font-['Inter'] text-xs font-bold text-[#F8FAFC] tabular-nums">
                    {formatINR(item.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-['Inter'] text-[#9CA8BD]">
                  <span className="truncate">{item.desc}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Financial Burn Gauge & Meter */}
        <div className="p-3 bg-[#080B18] border border-white/10 rounded mt-1 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] font-bold uppercase tracking-wider">
              BUDGET UTILIZATION
            </span>
            <span
              className={`font-['Space_Grotesk'] text-[10px] font-bold ${
                totalCommitted > totalBudget ? 'text-[#FB7185]' : 'text-[#8B5CF6]'
              }`}
            >
              {utilizationPercent}% USED
            </span>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-[#1C1F2D] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                totalCommitted > totalBudget
                  ? 'bg-gradient-to-r from-[#FF8A3D] to-[#FB7185]'
                  : 'bg-gradient-to-r from-[#42D9FF] via-[#8B5CF6] to-[#A078FF]'
              }`}
              style={{ width: `${Math.min(100, utilizationPercent)}%` }}
            ></div>
          </div>

          <div className="flex items-baseline justify-between pt-1 border-t border-white/5">
            <span className="font-['Inter'] text-xs text-[#9CA8BD]">
              {language === 'KN' ? 'ಒಟ್ಟು ಬದ್ಧ ಮೊತ್ತ:' : 'Total Committed:'}
            </span>
            <div className="text-right">
              <span className="font-['Inter'] text-base font-bold text-[#F8FAFC] tabular-nums leading-none">
                {formatINR(totalCommitted)}
              </span>
              <span className="font-['Inter'] text-[10px] text-[#9CA8BD] block tabular-nums">
                / {formatINR(totalBudget)} Budget Cap
              </span>
            </div>
          </div>

          {/* Per Person Breakdown Box */}
          <div className="pt-1 flex items-center justify-between text-xs">
            <span className="font-['Inter'] text-[#9CA8BD]">
              {language === 'KN' ? 'ಪ್ರತಿ ವ್ಯಕ್ತಿಗೆ ವೆಚ್ಚ:' : 'Cost Per Person:'}
            </span>
            <span className="font-['Space_Grotesk'] font-bold text-[#FF8A3D] tabular-nums">
              {formatINR(costPerPerson)} / person
            </span>
          </div>
        </div>

        {/* Route Quick Badge Graphic */}
        <div className="p-3 bg-[#1C1F2D] border border-white/5 rounded">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] font-bold uppercase tracking-wider">
              TRANSIT LINK MATRIX
            </span>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#42D9FF] font-bold">
              142 KM RUN
            </span>
          </div>
          <div className="flex items-center justify-between text-xs font-['Inter'] font-semibold text-[#F8FAFC]">
            <span className="tabular-nums">MYS 06:15</span>
            <div className="flex-1 mx-2 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
              <div className="flex-1 h-px bg-white/10 mx-1"></div>
              <Bus className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <div className="flex-1 h-px bg-white/10 mx-1"></div>
              <span className="w-1.5 h-1.5 rounded-full bg-[#42D9FF]"></span>
            </div>
            <span className="tabular-nums">SBC 09:45</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons in Column 3 */}
      <div className="flex flex-col gap-2 pt-3 border-t border-white/5 mt-auto">
        <button
          type="button"
          onClick={handleShareClick}
          className="w-full py-2 px-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-['Space_Grotesk'] text-xs font-bold rounded transition-all shadow-md shadow-[#8B5CF6]/20 flex items-center justify-center gap-2"
        >
          {copied ? <CheckCircle className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4" />}
          <span>{copied ? 'Link Copied to Clipboard!' : 'Share link with 3 friends'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadClick}
          className="w-full py-2 px-3 bg-[#1C1F2D] hover:bg-[#262938] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold rounded transition-colors flex items-center justify-center gap-2 border border-white/10"
        >
          <Download className="w-4 h-4 text-[#42D9FF]" />
          <span>{downloadNotice ? 'Summary PNR Downloaded (Demo)!' : 'Download Summary Ticket'}</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-center mt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#42D9FF]" />
          <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] font-bold">
            IRCTC &amp; KSRTC TICKET LOCK SECURED (DEMO)
          </span>
        </div>
      </div>
    </aside>
  );
}
