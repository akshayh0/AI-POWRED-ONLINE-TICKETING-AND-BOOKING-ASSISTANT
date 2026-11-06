'use client';

import React from 'react';
import { Pin, Plus, Activity } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SessionsSidebarProps {
  activeSessionId?: string;
  onSelectSession?: (id: string) => void;
  onNewSession?: () => void;
}

export function SessionsSidebar({
  activeSessionId = 'cricket-weekend',
  onSelectSession,
  onNewSession,
}: SessionsSidebarProps) {
  const { language } = useLanguage();

  return (
    <aside className="hidden lg:flex flex-col bg-[#10162A] border border-white/10 rounded p-4 h-[calc(100vh-8rem)] sticky top-20 overflow-hidden justify-between shadow-md select-none">
      <div className="flex flex-col gap-4 overflow-y-auto pr-1">
        {/* Workspace Brand Meta */}
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <span className="font-['Space_Grotesk'] text-[11px] text-[#9CA8BD] font-bold tracking-wider uppercase">
            {language === 'KN' ? 'ಪ್ರಯಾಣ ಅಧಿವೇಶನಗಳು' : 'TRIP SESSIONS'}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#1C1F2D] font-['Inter'] text-[11px] text-[#8B5CF6] font-bold tabular-nums">
            04 TOTAL
          </span>
        </div>

        {/* Section: Pinned Active Session */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <Pin className="w-3.5 h-3.5 text-[#42D9FF]" />
            <span className="font-['Space_Grotesk'] text-[11px] text-[#42D9FF] font-bold uppercase tracking-wider">
              {language === 'KN' ? 'ಪಿನ್ ಮಾಡಲಾದ ಥ್ರೆಡ್' : 'PINNED THREAD'}
            </span>
          </div>

          <div
            onClick={() => onSelectSession?.('cricket-weekend')}
            className={`p-3 bg-[#1C1F2D] rounded cursor-pointer relative shadow-sm border transition-all ${
              activeSessionId === 'cricket-weekend'
                ? 'border-[#8B5CF6]/60 shadow-[#8B5CF6]/10'
                : 'border-white/5 hover:border-white/15'
            }`}
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8B5CF6] rounded-l"></div>
            <div className="flex items-start justify-between gap-2 pl-1">
              <span className="font-['Space_Grotesk'] text-xs font-bold text-[#F8FAFC] leading-snug">
                {language === 'KN' ? 'ಮೈಸೂರು ⇄ ಬೆಂಗಳೂರು ಕ್ರಿಕೆಟ್ ವಾರಾಂತ್ಯ' : 'Mysuru to BLR Cricket Weekend'}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2 pl-1 text-[11px]">
              <span className="font-['Space_Grotesk'] font-bold text-[#FF8A3D]">4 TRAVELLERS</span>
              <span className="text-[#9CA8BD]">•</span>
              <span className="font-['Inter'] tabular-nums text-[#9CA8BD]">₹25K CAP</span>
            </div>
          </div>
        </div>

        {/* Section: Today */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] uppercase tracking-wider font-bold">
            {language === 'KN' ? 'ಇಂದು' : 'TODAY'}
          </span>

          <div
            onClick={() => onSelectSession?.('metro-pass')}
            className={`p-2.5 rounded bg-[#080B18] border transition-colors cursor-pointer group ${
              activeSessionId === 'metro-pass'
                ? 'border-[#8B5CF6]/50 bg-[#1C1F2D]'
                : 'border-white/5 hover:bg-[#1C1F2D] hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-xs text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors truncate">
                Namma Metro Pass x4
              </span>
              <span className="font-['Inter'] tabular-nums text-[11px] text-[#9CA8BD]">14:20</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] block mt-0.5">
              Cubbon Park • Purple Line
            </span>
          </div>

          <div
            onClick={() => onSelectSession?.('tech-summit')}
            className={`p-2.5 rounded bg-[#080B18] border transition-colors cursor-pointer group ${
              activeSessionId === 'tech-summit'
                ? 'border-[#8B5CF6]/50 bg-[#1C1F2D]'
                : 'border-white/5 hover:bg-[#1C1F2D] hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-xs text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors truncate">
                Bangalore Tech Summit Pass
              </span>
              <span className="font-['Inter'] tabular-nums text-[11px] text-[#9CA8BD]">09:05</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] block mt-0.5">
              Palace Grounds Entry Pass
            </span>
          </div>
        </div>

        {/* Section: This Week */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] uppercase tracking-wider font-bold">
            {language === 'KN' ? 'ಈ ವಾರ' : 'THIS WEEK'}
          </span>

          <div
            onClick={() => onSelectSession?.('dasara-shuttle')}
            className={`p-2.5 rounded bg-[#080B18] border transition-colors cursor-pointer group ${
              activeSessionId === 'dasara-shuttle'
                ? 'border-[#8B5CF6]/50 bg-[#1C1F2D]'
                : 'border-white/5 hover:bg-[#1C1F2D] hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-['Inter'] text-xs text-[#F8FAFC] group-hover:text-[#8B5CF6] transition-colors truncate">
                Dasara Mysuru Shuttle 2025
              </span>
              <span className="font-['Inter'] tabular-nums text-[11px] text-[#9CA8BD]">OCT 24</span>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] block mt-0.5">
              Airavat Club • 6 Pax
            </span>
          </div>
        </div>

        {/* System Context Metric Card */}
        <div className="p-3 bg-[#080B18] border border-white/10 rounded mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] font-bold">
              KSRTC CORRIDOR API
            </span>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#42D9FF] font-bold">
              99.8% LIVE
            </span>
          </div>
          <div className="w-full bg-[#1C1F2D] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#42D9FF] h-full w-[99.8%] rounded-full"></div>
          </div>
          <div className="flex items-center justify-between mt-2 font-['Space_Grotesk'] text-[10px] text-[#9CA8BD]">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#22C55E]" />
              <span>LATENCY: 28ms</span>
            </span>
            <span className="text-[#22C55E] font-bold">SYNCHRONIZED</span>
          </div>
        </div>
      </div>

      {/* Column 1 Bottom Action */}
      <div className="pt-3 border-t border-white/5">
        <button
          type="button"
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#1C1F2D] hover:bg-[#262938] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold rounded transition-colors shadow-sm border border-white/10"
        >
          <Plus className="w-4 h-4 text-[#42D9FF]" />
          <span>{language === 'KN' ? '+ ಹೊಸ ಪ್ರವಾಸ ಪ್ರಶ್ನೆ' : '+ New Trip Query'}</span>
        </button>
      </div>
    </aside>
  );
}
