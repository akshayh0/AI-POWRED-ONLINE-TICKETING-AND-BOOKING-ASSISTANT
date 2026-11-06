'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Mic, ArrowRight, Terminal, AlertCircle } from 'lucide-react';
import { PROMPT_SHORTCUTS } from '@/lib/mockData';
import { useLanguage } from '@/context/LanguageContext';

export function HeroSearchPanel() {
  const router = useRouter();
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Requirement 3: Connect Execute button to /assistant
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetQuery = query.trim() || 'Plan a cricket trip from Mysuru to Bengaluru for 4 of us, RCB match this Saturday, budget around ₹40,000';
    router.push(`/assistant?q=${encodeURIComponent(targetQuery)}`);
  };

  // Requirement 4: Make prompt shortcut links populate the AI search input
  const handleShortcutClick = (text: string) => {
    setQuery(text);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Requirement 5: Browser-supported voice input with graceful fallback
  const handleVoiceInput = () => {
    setVoiceNotice(null);

    // Check for standard or webkit speech recognition
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };

    const SpeechRecognitionClass =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setVoiceNotice('Voice input is not supported in this browser. Please type your query in the terminal.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'KN' ? 'kn-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: SpeechRecognitionEventInstance) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery(transcript);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
        setIsListening(false);
      };

      recognition.onerror = (event: { error?: string }) => {
        setIsListening(false);
        const errMsg = event.error === 'not-allowed'
          ? 'Microphone permission denied. Please allow microphone access.'
          : 'Could not capture speech. Please try typing instead.';
        setVoiceNotice(errMsg);
        setTimeout(() => setVoiceNotice(null), 4000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Microphone initialization failed. Please use text search.');
      setTimeout(() => setVoiceNotice(null), 4000);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#080B18] pt-6 pb-12 lg:pt-8 lg:pb-16 select-none">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Requirement 1: Improved vertical balance & alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch relative">
          {/* ================= LEFT 58% CONTENT & AI TERMINAL ================= */}
          <div className="lg:col-span-7 z-20 flex flex-col justify-center">
            {/* Telemetry Indicator */}
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-['Space_Grotesk'] font-bold uppercase tracking-wider bg-[#1C1F2D] text-[#42D9FF] border border-[#42D9FF]/30">
                TRANSIT TELEMETRY • LIVE
              </span>
              <span className="font-['Space_Grotesk'] text-xs text-[#9CA8BD] font-medium">
                {language === 'KN'
                  ? 'ಬೆಂಗಳೂರು ⇄ ಮೈಸೂರು 139 ಕಿಮೀ ಕಾರಿಡಾರ್'
                  : 'BLR ⇄ MYS 139 KM CORRIDOR'}
              </span>
            </div>

            {/* Main Headline (Bilingual) */}
            <h1 className="font-['Space_Grotesk'] text-3xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight leading-[1.08] mb-5 select-none">
              <span className="text-[#F8FAFC] block">
                {language === 'KN' ? 'ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಪ್ರಯಾಣ.' : 'Your entire journey.'}
              </span>
              <span className="text-[#9CA8BD] block mt-1">
                {language === 'KN' ? 'ಒಂದೇ ಬುದ್ಧಿವಂತ ಅನುಭವ.' : 'One intelligent experience.'}
              </span>
            </h1>

            {/* Largest Interactive Object: AI Search Panel */}
            <div className="w-full bg-[#10162A] border border-white/10 rounded p-4 md:p-5 shadow-2xl relative">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-[#42D9FF]">
                  <Terminal className="w-4 h-4 text-[#42D9FF]" />
                  <span className="font-['Space_Grotesk'] text-xs font-bold tracking-wide uppercase">
                    {language === 'KN' ? 'ಎಐ ಮಾರ್ಗ & ಆಸನ ಎಂಜಿನ್' : 'AI ROUTE & SEAT ENGINE'}
                  </span>
                </div>
                <div className="flex items-center bg-[#1C1F2D] rounded px-2 py-0.5 gap-2 text-[10px] font-['Space_Grotesk'] font-bold">
                  <span className="text-[#FF8A3D]">DEMO ENGINE</span>
                  <span className="text-white/30">•</span>
                  <span className="text-[#42D9FF]">CORRIDOR V4.2</span>
                </div>
              </div>

              {/* Form Input Box */}
              <form onSubmit={handleSubmit}>
                <div
                  className={`relative flex items-center bg-[#080B18] rounded min-h-[54px] px-3.5 transition-all duration-200 border ${
                    isFocused
                      ? 'border-[#8B5CF6] shadow-[0_0_0_1px_#8B5CF6,0_0_15px_rgba(139,92,246,0.25)]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Search className="w-4 h-4 text-[#9CA8BD] mr-2.5 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={
                      language === 'KN'
                        ? 'ಕೇಳಿ: ಮೈಸೂರಿನಿಂದ 4 ಟಿಕೆಟ್‌ಗಳು + ಶನಿವಾರ ಶತಾಬ್ದಿ ರೈಲು...'
                        : 'Ask e.g. 4 tickets to Chinnaswamy + Shatabdi train from Mysuru Saturday...'
                    }
                    className="w-full bg-transparent text-[#F8FAFC] placeholder:text-[#9CA8BD]/50 text-xs sm:text-sm font-['Inter'] focus:outline-none"
                  />
                  {/* Blinking AI Cursor Indicator */}
                  <span className="inline-block w-2 h-4 bg-[#42D9FF] animate-pulse ml-1 mr-2 shrink-0"></span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleVoiceInput}
                      title={
                        isListening
                          ? 'Listening... Speak now'
                          : language === 'KN'
                          ? 'ಧ್ವನಿ ಹುಡುಕಾಟ (ಕನ್ನಡ/English)'
                          : 'Voice Search (Kannada/English)'
                      }
                      className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                        isListening
                          ? 'bg-[#FF8A3D] text-[#080B18] animate-pulse shadow-md shadow-[#FF8A3D]/40'
                          : 'bg-[#1C1F2D] hover:bg-[#262938] text-[#9CA8BD] hover:text-[#42D9FF]'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="submit"
                      className="h-8 px-3.5 rounded bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-['Space_Grotesk'] text-xs font-bold tracking-wide flex items-center gap-1.5 transition-all shadow-md shadow-[#8B5CF6]/30"
                    >
                      <span>{language === 'KN' ? 'ಪ್ರಾರಂಭಿಸಿ' : 'Execute'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </form>

              {/* Voice Notice Toast / Inline Alert */}
              {voiceNotice && (
                <div className="mt-2.5 p-2 bg-[#1C1F2D] border border-[#FF8A3D]/40 rounded text-[11px] font-['Inter'] text-[#FF8A3D] flex items-center gap-1.5 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{voiceNotice}</span>
                </div>
              )}

              {/* Prompt Shortcuts that populate the search input */}
              <div className="mt-3.5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs font-['Inter']">
                {PROMPT_SHORTCUTS.map((promptText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleShortcutClick(promptText)}
                    className="text-left text-[#9CA8BD] hover:text-[#8B5CF6] transition-colors flex items-center justify-between group py-1"
                    title="Click to populate search bar"
                  >
                    <span className="group-hover:translate-x-0.5 transition-transform truncate pr-1">
                      {promptText}
                    </span>
                    <span className="font-['Space_Grotesk'] text-[#9CA8BD]/40 group-hover:translate-x-1 group-hover:text-[#8B5CF6] transition-all shrink-0">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Official Certification Feed Bar */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-['Space_Grotesk'] text-[#9CA8BD]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]"></span>
                IRCTC CONNECTED (DEMO)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
                KSCA RECOGNISED CORRIDOR
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D]"></span>
                KSRTC DIRECT FEED (DEMO)
              </span>
            </div>
          </div>

          {/* ================= RIGHT 42% SHARP STADIUM GRAPHIC ================= */}
          {/* Requirement 2: Improved sharpness, cropping, and vertical balance */}
          <div className="lg:col-span-5 relative w-full min-h-[340px] sm:min-h-[380px] lg:h-[480px] z-10 flex flex-col">
            <div className="w-full h-full relative rounded overflow-hidden shadow-2xl bg-[#10162A] border border-white/10 group flex-1" style={{ minHeight: '340px', position: 'relative' }}>
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKS_gteVlDJrCOLMJ4YU2rXXhtGEyY1TDKAbhxAzn_5-1eZQFM-zma2uyF9Ayi8E2WN5AmQl8rskOKKqGvl4TPfmrJ286h77zzqhynA3G0YQGauVBXf8fREH_6dWp17nsHvES5C_oNhs-mKIKHtpMJ8jrU8Qktsugh_uxM36zog6VtY1kSFA_Hk5yGOojEXUZgqSwA6zgAoL9nKueldllHIZ2ABnlvdiP3p-gutRg"
                  alt="M. Chinnaswamy Stadium floodlit cricket pitch under night lights in Bengaluru"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                  className="object-cover object-top filter saturate-[1.12] contrast-[1.08] group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Refined Vignette Gradients for cinematic contrast without washing out */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080B18] via-[#080B18]/30 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#080B18]/50 via-transparent to-transparent hidden lg:block"></div>

              {/* Stadium Telemetry Top Badge */}
              <div className="absolute top-4 right-4 bg-[#080B18]/90 backdrop-blur-md px-3 py-1.5 rounded border border-white/15 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF8A3D] animate-ping"></span>
                  <span className="font-['Space_Grotesk'] text-[10px] text-[#FF8A3D] font-bold tracking-widest uppercase">
                    LIVE SIGHTLINE • DEMO
                  </span>
                </div>
                <div className="font-['Space_Grotesk'] text-xs font-bold text-[#F8FAFC] mt-0.5">
                  M. Chinnaswamy Stadium
                </div>
                <div className="font-['Inter'] text-[11px] text-[#9CA8BD] tabular-nums">
                  Gate 7 • Pavilion Terrace West
                </div>
              </div>

              {/* Stadium Bottom Focus Card */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#10162A]/95 backdrop-blur-md p-3.5 rounded border border-white/15 flex items-center justify-between shadow-xl">
                <div>
                  <div className="font-['Space_Grotesk'] text-[10px] text-[#FF8A3D] font-bold uppercase tracking-wider">
                    {language === 'KN' ? 'ಮುಂಬರುವ ಪಂದ್ಯ (ಡೆಮೊ)' : 'Upcoming Match Focus (Demo)'}
                  </div>
                  <div className="font-['Space_Grotesk'] text-sm md:text-base font-bold text-[#F8FAFC]">
                    Royal Challengers vs Super Kings
                  </div>
                  <div className="font-['Inter'] text-xs text-[#9CA8BD] mt-0.5">
                    ಪಂದ್ಯಾವಳಿ ಬೆಂಗಳೂರು • Saturday, 19:30 IST
                  </div>
                </div>
                <div className="text-right pl-3 shrink-0">
                  <span className="font-['Inter'] tabular-nums text-lg font-bold text-[#8B5CF6]">
                    ₹1,800
                  </span>
                  <span className="block font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] uppercase">
                    Demo Starting Fare
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Minimal SpeechRecognition typing interfaces for TS check
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEventInstance) => void;
  onerror: (event: { error?: string }) => void;
  onend: () => void;
  start: () => void;
}

interface SpeechRecognitionEventInstance {
  results: Array<Array<{ transcript: string }>>;
}
