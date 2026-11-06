import Link from 'next/link';
import { ArrowLeft, Ticket } from 'lucide-react';

export default function MyJourneyPage({
  searchParams,
}: {
  searchParams?: { pnr?: string };
}) {
  const pnr = searchParams?.pnr;

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#080B18] px-4 md:px-8 lg:px-12 py-8 flex flex-col items-center justify-center text-center">
      <div className="max-w-xl p-8 bg-[#10162A] border border-white/10 rounded shadow-2xl flex flex-col items-center">
        <div className="w-12 h-12 rounded bg-[#8B5CF6]/10 text-[#8B5CF6] flex items-center justify-center mb-4 border border-[#8B5CF6]/25">
          <Ticket className="w-6 h-6" />
        </div>

        <div className="flex items-center gap-2 px-2.5 py-0.5 rounded text-[10px] font-['Space_Grotesk'] font-bold uppercase tracking-wider bg-[#1C1F2D] text-[#8B5CF6] border border-[#8B5CF6]/30 mb-3">
          TRANSIT PASSPORT // ನನ್ನ ಪ್ರಯಾಣ
        </div>

        <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#F8FAFC]">
          My Journey &amp; PNR Passport
        </h1>

        {pnr ? (
          <div className="mt-3 p-3 bg-[#080B18] rounded border border-white/10 text-xs font-['Inter'] text-[#9CA8BD] w-full text-left">
            <span className="font-['Space_Grotesk'] text-[#22C55E] font-bold block mb-1">
              PNR SYNC DETECTED (DEMO):
            </span>
            <span className="text-[#F8FAFC] font-mono tracking-widest">{pnr.toUpperCase()}</span>
            <span className="block text-[#9CA8BD] text-[11px] mt-1">
              KSRTC Airavat Express Seat 14A, 14B • Bangalore-Mysuru Expressway
            </span>
          </div>
        ) : (
          <p className="font-['Inter'] text-sm text-[#9CA8BD] mt-3 leading-relaxed">
            Connect an Indian Railways 10-digit PNR or KSCA match barcode to display live departure alarms, platform tracking, and automated shuttle connections.
          </p>
        )}

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

