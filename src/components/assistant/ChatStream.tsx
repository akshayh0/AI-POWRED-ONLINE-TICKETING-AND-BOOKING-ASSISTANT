'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Hotel,
  ShieldCheck,
  CheckCircle,
  MoreVertical,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { InteractiveGroupSelector, GroupType } from './InteractiveGroupSelector';
import { MatchRecommendationCard } from './MatchRecommendationCard';
import { RouteStepTimeline } from './RouteStepTimeline';
import { PackageComparison } from './PackageComparison';
import { TatkalRadarBadge } from './TatkalRadarBadge';
import { ChatInputBar } from './ChatInputBar';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  senderName: string;
  text: string;
  isInitial?: boolean;
}

interface ChatStreamProps {
  initialQuery?: string;
  selectedTier: 'comfort' | 'saver';
  groupType: GroupType;
  budgetCap?: number;
  onPlanSelected: (tier: 'comfort' | 'saver') => void;
  onGroupTypeChanged: (type: GroupType) => void;
  onBookEverything: (amount: number) => void;
}

export function ChatStream({
  initialQuery,
  selectedTier,
  groupType,
  budgetCap = 25000,
  onPlanSelected,
  onGroupTypeChanged,
  onBookEverything,
}: ChatStreamProps) {
  const { language, setLanguage } = useLanguage();
  const [isBooked, setIsBooked] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const defaultUserQuery =
    initialQuery ||
    'Plan a trip from Mysuru to Bengaluru for four friends to watch an RCB match, including transport and hotel, within ₹25,000.';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      timestamp: '11:42 AM',
      senderName: 'SUHAS K. (YOU)',
      text: defaultUserQuery,
      isInitial: true,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleBookTrigger = () => {
    const amount = selectedTier === 'comfort' ? 32600 : 20700;
    setIsBooked(true);
    if (onBookEverything) onBookEverything(amount);
    setTimeout(() => setIsBooked(false), 3500);
  };

  const handleSendMessage = (userText: string) => {
    const newMsgId = `usr-${Date.now()}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: newMsgId,
        sender: 'user',
        timestamp: timeString,
        senderName: 'SUHAS K. (YOU)',
        text: userText,
      },
    ]);

    // Simulate realistic AI Corridor response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const lower = userText.toLowerCase();
      let reply = `Understood for 4 travellers. Checked live KSRTC Airavat & Shatabdi timetables: Shatabdi 12008 leaves SBC Sunday 06:00 AM (₹670/seat). Updated in your trip draft!`;

      if (lower.includes('hotel') || lower.includes('stay') || lower.includes('homestay')) {
        reply = `Found alternate stay: Indiranagar Boutique Homestay with 2 deluxe rooms is locked at ₹6,400 total. Metro Purple Line station is an 8-minute walk.`;
      } else if (lower.includes('shatabdi') || lower.includes('train')) {
        reply = `Train 12008 Shatabdi Express has 48 CC seats available on Sunday morning departure from KSR Bengaluru (06:00 AM → 08:00 AM MYS). Direct booking locked in draft.`;
      } else if (lower.includes('split') || lower.includes('upi') || lower.includes('pay')) {
        const splitAmount = selectedTier === 'comfort' ? 8150 : 5175;
        reply = `Payment split calculated: ₹${splitAmount} each for 4 travellers. Sent UPI demo payment links to group members.`;
      } else if (lower.includes('comfort')) {
        onPlanSelected('comfort');
        reply = `Switched to Comfort Tier (₹32,600). Upgraded to East Stand Block D and MG Road 4-Star stay.`;
      } else if (lower.includes('saver')) {
        onPlanSelected('saver');
        reply = `Switched to Saver Tier (₹20,700). Preserved ₹4,300 savings under your ₹25,000 budget cap.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          senderName: 'TicketEase AI Engine',
          text: reply,
        },
      ]);
    }, 1200);
  };

  return (
    <section className="flex flex-col bg-[#10162A] border border-white/10 rounded overflow-hidden min-h-[calc(100vh-8rem)] relative shadow-md">
      {/* ================= STREAM HEADER ================= */}
      <div className="px-4 md:px-6 py-3 bg-[#171E35] border-b border-white/10 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded bg-[#1C1F2D] border border-white/10">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#42D9FF] animate-pulse"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-['Space_Grotesk'] text-sm md:text-base font-bold text-[#F8FAFC] leading-none m-0">
                TicketEase Assistant
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
            </div>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] mt-1 leading-none font-semibold">
              HIGH-SPEED MULTI-MODAL DISPATCHER (DEMO)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-['Space_Grotesk'] text-[11px] text-[#9CA8BD] hidden sm:inline font-bold">
            MODE:
          </span>
          <div className="flex items-center bg-[#080B18] p-0.5 rounded border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setLanguage('EN')}
              className={`px-2 py-0.5 font-['Space_Grotesk'] font-bold rounded-sm transition-colors ${
                language === 'EN' ? 'bg-[#1C1F2D] text-white shadow-sm' : 'text-[#9CA8BD] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('KN')}
              className={`px-2 py-0.5 font-['Space_Grotesk'] font-bold rounded-sm transition-colors ${
                language === 'KN' ? 'bg-[#1C1F2D] text-[#42D9FF] shadow-sm' : 'text-[#9CA8BD] hover:text-white'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>
          <button
            type="button"
            className="p-1 rounded text-[#9CA8BD] hover:text-white transition-colors"
            title="Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= CHAT SCROLL AREA ================= */}
      <div className="flex-1 p-4 md:p-6 flex flex-col gap-6 overflow-y-auto pb-32">
        {/* Timestamp Divider */}
        <div className="flex items-center gap-4 my-1 select-none">
          <div className="flex-1 h-px bg-white/5"></div>
          <span className="font-['Space_Grotesk'] text-[10px] font-bold text-[#9CA8BD] uppercase tracking-widest">
            SATURDAY EXPEDITION DISPATCH • 11:42 IST
          </span>
          <div className="flex-1 h-px bg-white/5"></div>
        </div>

        {/* Dynamic Message History */}
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div
                key={msg.id}
                className="flex flex-col items-end w-full max-w-[85%] self-end animate-fadeIn"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-['Inter'] tabular-nums text-xs text-[#9CA8BD]">
                    {msg.timestamp}
                  </span>
                  <span className="font-['Space_Grotesk'] text-xs font-bold text-[#FF8A3D]">
                    {msg.senderName}
                  </span>
                </div>
                {/* User message: Crisp typography, strictly NO bubble background per Stitch design */}
                <p className="font-['Inter'] text-sm sm:text-base text-[#F8FAFC] text-right font-medium leading-relaxed tracking-tight bg-[#181B29]/60 px-4 py-2.5 rounded border border-white/5">
                  {msg.text}
                </p>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className="flex flex-col gap-2 relative pl-4 border-l-2 border-[#42D9FF] animate-fadeIn"
            >
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#1C1F2D] font-['Space_Grotesk'] text-[11px] font-bold text-[#42D9FF] uppercase tracking-wider">
                  {msg.senderName}
                </span>
                <span className="font-['Inter'] tabular-nums text-xs text-[#9CA8BD]">
                  {msg.timestamp}
                </span>
              </div>
              <p className="font-['Inter'] text-sm text-[#F8FAFC] leading-relaxed">
                {msg.text}
              </p>
            </div>
          );
        })}

        {/* ================= PRIMARY AI STREAM RESPONSE (STITCH SPEC) ================= */}
        {/* AI MESSAGE STREAM: Left border cyan (#42D9FF), structured modular blocks */}
        <div className="flex flex-col gap-6 relative pl-4 border-l-2 border-[#42D9FF]">
          {/* AI Header Tag */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#1C1F2D] font-['Space_Grotesk'] text-[11px] font-bold text-[#42D9FF] uppercase tracking-wider">
                TicketEase AI Engine
              </span>
              <span className="font-['Inter'] tabular-nums text-xs text-[#9CA8BD]">11:43 AM</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#42D9FF] font-['Space_Grotesk'] text-xs font-bold">
              <Zap className="w-3.5 h-3.5 text-[#42D9FF]" />
              <span>OPTIMIZED FOR ₹25,000 BUDGET CAP (DEMO)</span>
            </div>
          </div>

          {/* Block a: Interactive Group Selector */}
          <InteractiveGroupSelector
            selectedGroup={groupType}
            onSelectGroup={onGroupTypeChanged}
          />

          {/* Block b: Match Recommendation Card */}
          <MatchRecommendationCard tier={selectedTier} />

          {/* Block c: Vertical Step Timeline (Itinerary) */}
          <RouteStepTimeline tier={selectedTier} />

          {/* Block d: Package Comparison Block */}
          <PackageComparison
            selectedTier={selectedTier}
            onSelectTier={onPlanSelected}
            budgetCap={budgetCap}
          />

          {/* Block e: Realistic AI Uncertainty badge (Tatkal Radar) */}
          <TatkalRadarBadge />

          {/* Block f: Action Buttons Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleBookTrigger}
              className="px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-['Space_Grotesk'] text-xs font-bold rounded transition-all shadow-md shadow-[#8B5CF6]/20 flex items-center gap-2"
            >
              {isBooked ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-white" />
              )}
              <span>
                {isBooked
                  ? 'Locked in Demo Bucket!'
                  : `Book everything ${selectedTier === 'comfort' ? '₹32,600' : '₹20,700'} (Demo)`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleSendMessage('Swap the hotel to a stay closer to Cubbon Park')}
              className="px-4 py-2.5 bg-[#1C1F2D] hover:bg-[#262938] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold rounded transition-colors flex items-center gap-2 border border-white/10"
            >
              <Hotel className="w-4 h-4 text-[#9CA8BD]" />
              <span>Swap the hotel</span>
            </button>

            <button
              type="button"
              onClick={() => handleSendMessage('Calculate UPI split between 4 travellers')}
              className="px-4 py-2.5 bg-[#1C1F2D] hover:bg-[#262938] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold rounded transition-colors flex items-center gap-2 border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-[#42D9FF]" />
              <span>Split payment between 4</span>
            </button>
          </div>
        </div>

        {/* Live AI typing / working indicator */}
        {isTyping && (
          <div className="flex items-center gap-3 pl-4 py-1 select-none animate-fadeIn">
            <div className="flex items-end gap-1 h-4">
              <span className="w-1 bg-[#42D9FF] rounded-full animate-bounce [animation-delay:-0.3s] h-3"></span>
              <span className="w-1 bg-[#42D9FF] rounded-full animate-bounce [animation-delay:-0.15s] h-4"></span>
              <span className="w-1 bg-[#42D9FF] rounded-full animate-bounce h-2"></span>
            </div>
            <span className="font-['Space_Grotesk'] text-xs text-[#42D9FF] tracking-wide font-bold">
              Checking Saturday's buses &amp; Tatkal queues…
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ================= STICKY BOTTOM INPUT BAR ================= */}
      <ChatInputBar onSendMessage={handleSendMessage} disabled={isTyping} />
    </section>
  );
}
