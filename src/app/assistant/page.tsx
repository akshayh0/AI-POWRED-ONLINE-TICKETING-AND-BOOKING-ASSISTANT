'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MessageSquare, Receipt, Layers } from 'lucide-react';
import { TelemetryStatusBar } from '@/components/layout/TelemetryStatusBar';
import { SessionsSidebar } from '@/components/assistant/SessionsSidebar';
import { ChatStream } from '@/components/assistant/ChatStream';
import { TripDraftPanel } from '@/components/assistant/TripDraftPanel';
import { GroupType } from '@/components/assistant/InteractiveGroupSelector';
import { useLanguage } from '@/context/LanguageContext';

function AssistantContent() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get('q');
  const initialQuery =
    rawQuery ||
    'Plan a trip from Mysuru to Bengaluru for four friends to watch an RCB match, including transport and hotel, within ₹25,000.';

  const { language } = useLanguage();
  const [activeSessionId, setActiveSessionId] = useState('cricket-weekend');
  const [selectedTier, setSelectedTier] = useState<'comfort' | 'saver'>('saver');
  const [groupType, setGroupType] = useState<GroupType>('4adults');
  const [mobileTab, setMobileTab] = useState<'chat' | 'draft' | 'sessions'>('chat');

  // Budget cap extraction (defaults to 25000 if not specified)
  const budgetCap = 25000;

  const handleNewSession = () => {
    setActiveSessionId('new-session');
    setSelectedTier('saver');
    setGroupType('4adults');
    setMobileTab('chat');
  };

  return (
    <div className="flex flex-col w-full bg-[#080B18] min-h-[calc(100vh-4rem)]">
      {/* Top Telemetry Corridor Ribbon */}
      <TelemetryStatusBar />

      {/* Mobile/Tablet Tab Switcher (< lg) */}
      <div className="lg:hidden w-full bg-[#10162A] border-b border-white/10 px-4 py-2 flex items-center justify-between z-30 sticky top-16 select-none">
        <div className="flex items-center gap-1.5 w-full">
          <button
            type="button"
            onClick={() => setMobileTab('chat')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-1.5 transition-colors ${
              mobileTab === 'chat'
                ? 'bg-[#8B5CF6] text-white shadow-sm'
                : 'bg-[#1C1F2D] text-[#9CA8BD] hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{language === 'KN' ? 'ಸಂಭಾಷಣೆ' : 'Chat Stream'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('draft')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-1.5 transition-colors ${
              mobileTab === 'draft'
                ? 'bg-[#42D9FF] text-[#080B18] shadow-sm'
                : 'bg-[#1C1F2D] text-[#9CA8BD] hover:text-white'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{language === 'KN' ? 'ಡ್ರಾಫ್ಟ್ ರಶೀದಿ' : 'Trip Draft'}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('sessions')}
            className={`flex-1 py-1.5 px-2 rounded text-xs font-['Space_Grotesk'] font-bold flex items-center justify-center gap-1.5 transition-colors ${
              mobileTab === 'sessions'
                ? 'bg-[#1C1F2D] text-[#F8FAFC] border border-white/20'
                : 'bg-[#1C1F2D] text-[#9CA8BD] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'KN' ? 'ಅಧಿವೇಶನಗಳು' : 'Sessions'}</span>
          </button>
        </div>
      </div>

      {/* 3-Column Workspace Grid */}
      <div className="max-w-[1440px] w-full mx-auto px-4 md:px-8 lg:px-12 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-4 items-start relative">
          {/* COLUMN 1: LEFT SIDEBAR (260px) */}
          <div className={`${mobileTab === 'sessions' ? 'block' : 'hidden'} lg:block`}>
            <SessionsSidebar
              activeSessionId={activeSessionId}
              onSelectSession={(id) => {
                setActiveSessionId(id);
                setMobileTab('chat');
              }}
              onNewSession={handleNewSession}
            />
          </div>

          {/* COLUMN 2: CENTER CHAT STREAM (Flexible) */}
          <div className={`${mobileTab === 'chat' ? 'block' : 'hidden'} lg:block`}>
            <ChatStream
              initialQuery={initialQuery}
              selectedTier={selectedTier}
              groupType={groupType}
              budgetCap={budgetCap}
              onPlanSelected={(tier) => setSelectedTier(tier)}
              onGroupTypeChanged={(type) => setGroupType(type)}
              onBookEverything={() => {
                setMobileTab('draft');
              }}
            />
          </div>

          {/* COLUMN 3: RIGHT SIDEBAR (320px) */}
          <div className={`${mobileTab === 'draft' ? 'block' : 'hidden'} lg:block`}>
            <TripDraftPanel
              totalBudget={budgetCap}
              tier={selectedTier}
              groupSize={groupType === '4adults' ? 4 : 4}
              onCheckout={() => {
                alert('DEMO MODE: Checkout locked for Karnataka Corridor Demo.');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-[#080B18] flex items-center justify-center text-[#42D9FF] font-['Space_Grotesk'] text-sm font-bold">
          LOADING TICKET EASE AI WORKSPACE…
        </div>
      }
    >
      <AssistantContent />
    </Suspense>
  );
}
