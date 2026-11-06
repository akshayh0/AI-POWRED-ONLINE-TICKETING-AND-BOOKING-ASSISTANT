'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function GlobalHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const navLinks = [
    { href: '/', label: 'Plan', labelKn: 'ಯೋಜನೆ' },
    { href: '/assistant', label: 'AI Assistant', labelKn: 'ಎಐ ಸಹಾಯಕ' },
    { href: '/stadium', label: 'Stadium & Match', labelKn: 'ಸ್ಟೇಡಿಯಂ & ಪಂದ್ಯ' },
    { href: '/my-journey', label: 'My Journey (ನನ್ನ ಪ್ರಯಾಣ)', labelKn: 'ನನ್ನ ಪ್ರಯಾಣ' },
    { href: '/resale', label: 'Resale', labelKn: 'ಮರುಮಾರಾಟ' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080B18]/95 backdrop-blur-md border-b border-white/10">
      <div className="h-16 max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand Logo & Telemetry Label */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#8B5CF6] via-[#FF8A3D] to-[#42D9FF] p-0.5 flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
            <div className="w-full h-full bg-[#080B18] rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#42D9FF]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-['Space_Grotesk'] text-base md:text-lg font-bold tracking-tight uppercase leading-none text-[#F8FAFC]">
              TicketEase <span className="text-[#42D9FF]">AI</span>
            </span>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] tracking-wider leading-none mt-1">
              BLR-MYS TRANSIT &amp; MATCH ENGINE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded font-['Space_Grotesk'] text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#1C1F2D] text-[#8B5CF6] border border-[#8B5CF6]/40 shadow-sm'
                    : 'text-[#9CA8BD] hover:text-[#F8FAFC] hover:bg-[#181B29] border border-transparent'
                }`}
              >
                {language === 'KN' ? link.labelKn : link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools (Language Toggle, Currency, Profile Avatar) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Demo Badge Indicator */}
          <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-bold uppercase tracking-wider bg-[#FF8A3D]/10 text-[#FF8A3D] border border-[#FF8A3D]/25">
            DEMO MODE
          </span>

          {/* Bilingual Switcher */}
          <div className="flex items-center bg-[#181B29] border border-white/10 rounded p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setLanguage('EN')}
              className={`px-2 py-0.5 font-['Space_Grotesk'] font-bold rounded-sm transition-colors ${
                language === 'EN'
                  ? 'bg-[#1C1F2D] text-[#F8FAFC] shadow-sm'
                  : 'text-[#9CA8BD] hover:text-[#F8FAFC]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('KN')}
              className={`px-2 py-0.5 font-['Space_Grotesk'] font-bold rounded-sm transition-colors ${
                language === 'KN'
                  ? 'bg-[#1C1F2D] text-[#42D9FF] shadow-sm'
                  : 'text-[#9CA8BD] hover:text-[#F8FAFC]'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          {/* Currency Indicator */}
          <div className="hidden sm:flex items-center px-2.5 py-1 bg-[#181B29] border border-white/10 rounded font-['Inter'] text-xs font-semibold text-[#42D9FF] tabular-nums">
            <span className="mr-1">₹</span>
            <span>INR</span>
          </div>

          {/* User Profile Thumbnail */}
          <div className="relative flex items-center pl-1">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/15 bg-[#1C1F2D] flex items-center justify-center text-xs font-bold text-[#8B5CF6]">
              SK
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-[#080B18]"></span>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#9CA8BD] hover:text-[#F8FAFC] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#101320] border-b border-white/10 px-4 py-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded text-sm font-['Space_Grotesk'] font-semibold text-[#9CA8BD] hover:text-[#F8FAFC] hover:bg-[#1C1F2D] transition-colors"
            >
              {language === 'KN' ? link.labelKn : link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#9CA8BD]">
            <span className="font-['Space_Grotesk']">SIMULATED HACKATHON DEMO</span>
            <span className="font-['Inter'] tabular-nums text-[#42D9FF]">₹ INR AVAILABLE</span>
          </div>
        </div>
      )}
    </header>
  );
}
