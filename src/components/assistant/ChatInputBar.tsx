'use client';

import React, { useState, useRef } from 'react';
import { Send, Mic, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ChatInputBarProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export function ChatInputBar({ onSendMessage, disabled }: ChatInputBarProps) {
  const { language, setLanguage } = useLanguage();
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || disabled) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleVoiceInput = () => {
    setVoiceNotice(null);
    const windowWithSpeech = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };

    const SpeechRecognitionClass =
      windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setVoiceNotice('Voice input is not supported in this browser. Please type your query.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'KN' ? 'kn-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: SpeechRecognitionEventInstance) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          inputRef.current?.focus();
        }
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('Microphone permission denied or speech not captured.');
        setTimeout(() => setVoiceNotice(null), 4000);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Voice recognition initialization failed.');
      setTimeout(() => setVoiceNotice(null), 4000);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#10162A]/95 backdrop-blur-md border-t border-white/10 z-20">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center bg-[#080B18] border border-white/10 rounded p-1.5 focus-within:border-[#8B5CF6] focus-within:shadow-[0_0_0_1px_#8B5CF6,0_0_12px_rgba(139,92,246,0.2)] transition-all">
          <button
            type="button"
            onClick={handleVoiceInput}
            title={
              isListening
                ? 'Listening... Speak now'
                : language === 'KN'
                ? 'ಧ್ವನಿ ಹುಡುಕಾಟ (ಕನ್ನಡ/English)'
                : 'Voice Query in Kannada or English'
            }
            className={`p-2 transition-colors shrink-0 rounded ${
              isListening
                ? 'bg-[#FF8A3D] text-[#080B18] animate-pulse'
                : 'text-[#9CA8BD] hover:text-[#42D9FF]'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={disabled}
            placeholder={
              language === 'KN'
                ? 'ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಕೇಳಿ (ಉದಾ: ನಾವು ಶತಾಬ್ದಿಯಲ್ಲಿ ಹಿಂತಿರುಗಬಹುದೇ?)'
                : 'Ask in English or ಕನ್ನಡ (e.g. Can we take Shatabdi back?)'
            }
            className="w-full bg-transparent px-2 text-[#F8FAFC] placeholder:text-[#9CA8BD]/50 font-['Inter'] text-xs sm:text-sm focus:outline-none disabled:opacity-50"
          />

          <div className="flex items-center gap-1.5 shrink-0 pr-1">
            <button
              type="button"
              onClick={() => setLanguage(language === 'EN' ? 'KN' : 'EN')}
              className="hidden sm:flex items-center bg-[#1C1F2D] px-2 py-1 rounded text-xs font-['Space_Grotesk'] font-bold text-[#9CA8BD] hover:text-white border border-white/5"
            >
              <span>{language === 'EN' ? 'EN / ಕನ್ನಡ' : 'ಕನ್ನಡ / EN'}</span>
            </button>

            <button
              type="submit"
              disabled={disabled || !inputText.trim()}
              className="w-8 h-8 flex items-center justify-center rounded bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white transition-colors shadow-md shadow-[#8B5CF6]/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {voiceNotice && (
        <div className="mt-2 p-1.5 bg-[#1C1F2D] border border-[#FF8A3D]/40 rounded text-[11px] font-['Inter'] text-[#FF8A3D] flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{voiceNotice}</span>
        </div>
      )}

      <div className="flex items-center justify-between px-1 mt-2 font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] select-none font-semibold">
        <span>PRESS ENTER TO SEND • CONTEXT LOCK: 4 PAX • SATURDAY FIXTURE (DEMO)</span>
        <span className="hidden md:inline text-white/40">
          TICKETEASE AI • BENGALURU-MYSURU TRANSIT PROTOCOL
        </span>
      </div>
    </div>
  );
}

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

