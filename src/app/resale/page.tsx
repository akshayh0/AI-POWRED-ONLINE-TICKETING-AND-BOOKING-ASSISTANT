import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function ResalePage() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#080B18] px-4 md:px-8 lg:px-12 py-8 flex flex-col items-center justify-center text-center">
      <div className="max-w-xl p-8 bg-[#10162A] border border-white/10 rounded shadow-2xl flex flex-col items-center">
        <div className="w-12 h-12 rounded bg-[#FF8A3D]/10 text-[#FF8A3D] flex items-center justify-center mb-4 border border-[#FF8A3D]/25">
          <RefreshCw className="w-6 h-6" />
        </div>

        <div className="flex items-center gap-2 px-2.5 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-bold uppercase tracking-wider bg-[#1C1F2D] text-[#FF8A3D] border border-[#FF8A3D]/30 mb-3">
          FAIR-VALUE RESALE POOL (DEMO)
        </div>

        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#F8FAFC]">
          Fan-to-Fan Verified Resale
        </h1>

        <p className="font-['Inter'] text-sm text-[#9CA8BD] mt-3 leading-relaxed">
          Zero-scalping verified marketplace strictly capped at 100% face-value with instant Tatkal reallocation.
        </p>

        <Link
          href="/"
          className="mt-6 px-4 py-2 rounded bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-['Space_Grotesk'] text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}

