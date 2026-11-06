import React from 'react';
import Link from 'next/link';

export function GlobalFooter() {
  return (
    <footer className="w-full bg-[#080B18] border-t border-white/10 py-10 md:py-12 select-none">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6 text-[#9CA8BD] text-xs">
        {/* Left Branding */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="font-['Space_Grotesk'] font-bold text-sm text-[#F8FAFC] tracking-wider uppercase">
            TICKETEASE AI
          </span>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="font-['Inter'] text-[#9CA8BD]">
            Bengaluru ⇄ Mysuru High-Speed Corridor &amp; Chinnaswamy Stadium Access
          </span>
        </div>

        {/* Right Navigation & Copyright */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-['Space_Grotesk']">
          <Link href="/" className="hover:text-[#F8FAFC] transition-colors">
            Home
          </Link>
          <Link href="/assistant" className="hover:text-[#F8FAFC] transition-colors">
            AI Trip Desk
          </Link>
          <Link href="/stadium" className="hover:text-[#F8FAFC] transition-colors">
            3D Stadium
          </Link>
          <Link href="/my-journey" className="hover:text-[#F8FAFC] transition-colors">
            My Journey
          </Link>
          <span className="text-[#9CA8BD]/60 font-['Inter']">© 2025 All Rights Reserved (Hackathon Prototype)</span>
        </div>
      </div>

      {/* Mandatory Demo Disclaimer Banner */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 mt-6 pt-4 border-t border-white/5 text-center font-['Inter'] text-[11px] text-[#9CA8BD]/60">
        Demo Notice: All flight stubs, Tatkal reserves, KSRTC coach feeds, and seat allotments displayed are simulated mock models for design demonstration.
      </div>
    </footer>
  );
}

