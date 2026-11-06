'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShieldCheck, Ticket, AlertCircle } from 'lucide-react';
import { SelectedSeat, BookingConfirmation } from '@/types/stadium';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface TicketBookingPanelProps {
  selectedSeats: SelectedSeat[];
  maxSeats?: number;
  holdTimeRemaining: number | null; // in milliseconds
  bookingConfirmation: BookingConfirmation | null;
  onRemoveSeat: (index: number) => void;
  onPay: () => void;
  onBookAgain: () => void;
  onSyncDraft: () => void;
}

export function TicketBookingPanel({
  selectedSeats,
  maxSeats = 6,
  holdTimeRemaining,
  bookingConfirmation,
  onRemoveSeat,
  onPay,
  onBookAgain,
  onSyncDraft,
}: TicketBookingPanelProps) {
  const { language } = useLanguage();

  // Financial calculations
  const { subtotal, serviceFee, gst, total } = useMemo(() => {
    const sub = selectedSeats.reduce((acc, s) => acc + s.price, 0);
    const fee = Math.round(sub * 0.05);
    const tax = Math.round(fee * 0.18);
    return {
      subtotal: sub,
      serviceFee: fee,
      gst: tax,
      total: sub + fee + tax,
    };
  }, [selectedSeats]);

  // Procedural SVG barcode generation from reference code
  const barcodeSvg = useMemo(() => {
    if (!bookingConfirmation) return null;
    const ref = bookingConfirmation.ref;

    // Seeded random
    let a = ref.split('').reduce((acc, x) => (acc * 31 + x.charCodeAt(0)) | 0, 7);
    const rnd = () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    let x = 0;
    const rects: { x: number; width: number }[] = [];
    for (let i = 0; i < 58; i++) {
      const w = 1 + ((rnd() * 3) | 0);
      rects.push({ x, width: w });
      x += w + 1 + ((rnd() * 2) | 0);
    }

    return (
      <svg
        className="w-full h-11 my-3 text-[#F8FAFC] fill-current opacity-85"
        viewBox={`0 0 ${x} 44`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {rects.map((r, idx) => (
          <rect key={idx} x={r.x} y={0} width={r.width} height={44} />
        ))}
      </svg>
    );
  }, [bookingConfirmation]);

  // Formatted hold time countdown (MM:SS)
  const formattedHoldTime = useMemo(() => {
    if (holdTimeRemaining === null || holdTimeRemaining <= 0) return null;
    const totalSec = Math.floor(holdTimeRemaining / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }, [holdTimeRemaining]);

  // ================= 1. BOOKING CONFIRMED STATE =================
  if (bookingConfirmation) {
    const m = bookingConfirmation.money;
    return (
      <aside className="w-full bg-[#10162A] border border-white/10 rounded overflow-hidden shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="flex justify-between items-end gap-3 p-4 md:p-5 bg-[#171E35] border-b border-white/10">
          <div>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#22C55E] uppercase tracking-wider font-bold block mb-1">
              DEMO RESERVATION CONFIRMED
            </span>
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#F8FAFC] m-0 leading-tight">
              RCB v CSK
            </h2>
          </div>
          <div className="text-right font-['Inter'] text-xs text-[#9CA8BD]">
            <span className="block text-[#F8FAFC] font-semibold">Sat 7 Nov 2026, 7:30 pm</span>
            <span>M. Chinnaswamy Stadium</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 md:p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 p-2.5 rounded bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] text-xs font-['Inter']">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>
              Booking reference <b className="font-mono text-[#F8FAFC]">{bookingConfirmation.ref}</b>. Simulated ticket manifest generated!
            </span>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            {bookingConfirmation.items.map((s, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-2 border-b border-white/5 font-['Inter'] text-xs"
              >
                <div>
                  <span className="font-['Space_Grotesk'] font-bold text-[#F8FAFC]">{s.b.code}</span>
                  <span className="block text-[11px] text-[#9CA8BD]">
                    Row {s.r + 1}, seat {s.k + 1}
                  </span>
                </div>
                <span className="font-['Inter'] tabular-nums font-bold text-[#F8FAFC]">
                  {formatINR(s.price)}
                </span>
              </div>
            ))}
          </div>

          {/* Perforated tear line */}
          <div className="relative w-full h-4 my-1 flex items-center justify-between">
            <div className="w-4 h-6 rounded-r-full bg-[#080B18] -ml-5 border-r border-white/10"></div>
            <div className="flex-1 border-t-2 border-dashed border-white/15 mx-1"></div>
            <div className="w-4 h-6 rounded-l-full bg-[#080B18] -mr-5 border-l border-white/10"></div>
          </div>

          {/* Money Breakdown */}
          <div className="space-y-1.5 font-['Inter'] text-xs text-[#9CA8BD]">
            <div className="flex justify-between">
              <span>Service fee (5%)</span>
              <span className="tabular-nums text-[#F8FAFC]">{formatINR(m.fee)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST on service fee (18%)</span>
              <span className="tabular-nums text-[#F8FAFC]">{formatINR(m.gst)}</span>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-baseline pt-2 border-t border-white/10 mt-1">
            <span className="font-['Space_Grotesk'] text-sm font-bold text-[#9CA8BD] uppercase">
              Paid (Demo)
            </span>
            <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#8B5CF6] tabular-nums">
              {formatINR(m.tot)}
            </span>
          </div>

          {/* Barcode */}
          {barcodeSvg}

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="button"
              onClick={onSyncDraft}
              className="w-full py-2.5 px-4 rounded bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-['Space_Grotesk'] text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#8B5CF6]/20"
            >
              <Ticket className="w-4 h-4" />
              <span>Attach to AI Trip Draft &amp; Return</span>
            </button>

            <button
              type="button"
              onClick={onBookAgain}
              className="w-full py-2.5 px-4 rounded bg-[#1C1F2D] hover:bg-[#262938] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold border border-white/10 transition-colors"
            >
              Book More Seats (Demo)
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // ================= 2. EMPTY SEAT SELECTION STATE =================
  if (!selectedSeats.length) {
    return (
      <aside className="w-full bg-[#10162A] border border-white/10 rounded overflow-hidden shadow-2xl flex flex-col justify-between">
        <div className="flex justify-between items-end gap-3 p-4 md:p-5 bg-[#171E35] border-b border-white/10">
          <div>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#42D9FF] uppercase tracking-wider font-bold block mb-1">
              CHINNASWAMY SEAT SELECTOR
            </span>
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#F8FAFC] m-0 leading-tight">
              RCB v CSK
            </h2>
          </div>
          <div className="text-right font-['Inter'] text-xs text-[#9CA8BD]">
            <span className="block text-[#F8FAFC] font-semibold">Sat 7 Nov 2026, 7:30 pm</span>
            <span>M. Chinnaswamy Stadium</span>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-4">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#F8FAFC] m-0">
            {language === 'KN' ? 'ನಿಮ್ಮ ಆಸನಗಳು' : 'Your Seats'}
          </h3>

          <div className="p-4 bg-[#080B18] border border-white/10 rounded text-xs font-['Inter'] text-[#9CA8BD] leading-relaxed">
            <p className="m-0">
              {language === 'KN'
                ? 'ಯಾವುದೇ ಆಸನವನ್ನು ಆಯ್ಕೆ ಮಾಡಿಲ್ಲ. ಕ್ರೀಡಾಂಗಣದಲ್ಲಿ ಆಸನದ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ, ನಂತರ ಆಸನ ಸೇರಿಸಿ ಆಯ್ಕೆಮಾಡಿ.'
                : 'No seats selected. Click a seat in the 3D stadium to preview the spectator sightline from it, then choose "Add seat".'}
            </p>
            <p className="mt-2 text-[#42D9FF] font-semibold font-['Space_Grotesk']">
              • You can hold up to {maxSeats} seats simultaneously.
              <br />• 10-minute hold starts automatically once you select your first seat.
            </p>
          </div>

          <div className="flex items-center gap-2 p-2 bg-[#1C1F2D] rounded text-[11px] font-['Space_Grotesk'] text-[#9CA8BD]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>KSCA &amp; IRCTC CORRIDOR VERIFIED SEAT MANIFEST (DEMO)</span>
          </div>

          <Link
            href="/assistant"
            className="mt-2 py-2.5 px-4 rounded bg-[#1C1F2D] hover:bg-[#262938] text-[#F8FAFC] font-['Space_Grotesk'] text-xs font-bold border border-white/10 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 text-[#42D9FF]" />
            <span>Return to AI Assistant Workspace</span>
          </Link>
        </div>
      </aside>
    );
  }

  // ================= 3. ACTIVE SEATS SELECTED STATE =================
  return (
    <aside className="w-full bg-[#10162A] border border-white/10 rounded overflow-hidden shadow-2xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-end gap-3 p-4 md:p-5 bg-[#171E35] border-b border-white/10">
        <div>
          <span className="font-['Space_Grotesk'] text-[10px] text-[#FF8A3D] uppercase tracking-wider font-bold block mb-1">
            DEMO SEATS HELD ({selectedSeats.length}/{maxSeats})
          </span>
          <h2 className="font-['Space_Grotesk'] text-2xl font-bold text-[#F8FAFC] m-0 leading-tight">
            RCB v CSK
          </h2>
        </div>
        <div className="text-right font-['Inter'] text-xs text-[#9CA8BD]">
          <span className="block text-[#F8FAFC] font-semibold">Sat 7 Nov 2026, 7:30 pm</span>
          <span>M. Chinnaswamy Stadium</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 md:p-5 flex flex-col gap-3">
        <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#F8FAFC] m-0">
          {language === 'KN' ? 'ನಿಮ್ಮ ಆಸನಗಳು' : 'Your Seats'}
        </h3>

        {/* Seat line items */}
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
          {selectedSeats.map((s, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-2 border-b border-white/5 font-['Inter'] text-xs group"
            >
              <div>
                <span className="font-['Space_Grotesk'] font-bold text-[#F8FAFC]">{s.b.code}</span>
                <span className="block text-[11px] text-[#9CA8BD]">
                  Row {s.r + 1}, seat {s.k + 1}
                </span>
              </div>
              <div className="text-right">
                <span className="font-['Inter'] tabular-nums font-bold text-[#F8FAFC] block">
                  {formatINR(s.price)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveSeat(idx)}
                  className="text-[11px] text-[#FB7185] hover:underline"
                  aria-label={`Remove seat ${s.b.code} Row ${s.r + 1} seat ${s.k + 1}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Perforated tear line */}
        <div className="relative w-full h-4 my-1 flex items-center justify-between">
          <div className="w-4 h-6 rounded-r-full bg-[#080B18] -ml-5 border-r border-white/10"></div>
          <div className="flex-1 border-t-2 border-dashed border-white/15 mx-1"></div>
          <div className="w-4 h-6 rounded-l-full bg-[#080B18] -mr-5 border-l border-white/10"></div>
        </div>

        {/* Fee breakdown */}
        <div className="space-y-1.5 font-['Inter'] text-xs text-[#9CA8BD]">
          <div className="flex justify-between">
            <span>Tickets ({selectedSeats.length})</span>
            <span className="tabular-nums text-[#F8FAFC]">{formatINR(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Service fee (5%)</span>
            <span className="tabular-nums text-[#F8FAFC]">{formatINR(serviceFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST on service fee (18%)</span>
            <span className="tabular-nums text-[#F8FAFC]">{formatINR(gst)}</span>
          </div>
        </div>

        {/* Total Committed */}
        <div className="flex justify-between items-baseline pt-2 border-t border-white/10 mt-1">
          <span className="font-['Space_Grotesk'] text-sm font-bold text-[#9CA8BD] uppercase">
            Total (Demo)
          </span>
          <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#8B5CF6] tabular-nums">
            {formatINR(total)}
          </span>
        </div>

        {/* Pay Button */}
        <button
          type="button"
          onClick={onPay}
          className="w-full py-3 px-4 rounded bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-['Space_Grotesk'] text-sm font-bold tracking-wide transition-all shadow-lg shadow-[#8B5CF6]/25 flex items-center justify-center gap-2 mt-2"
        >
          <span>Confirm &amp; Pay {formatINR(total)} (Demo)</span>
        </button>

        {/* Hold countdown notice */}
        {formattedHoldTime && (
          <p className="m-0 text-xs text-center font-['Inter'] text-[#9CA8BD]">
            Seats are held for{' '}
            <b className="font-['Space_Grotesk'] text-[#FF8A3D] font-bold tabular-nums">
              {formattedHoldTime}
            </b>
            . Demonstration only, no real payment is taken.
          </p>
        )}

        <button
          type="button"
          onClick={onSyncDraft}
          className="w-full py-2 px-3 rounded bg-[#1C1F2D] hover:bg-[#262938] text-[#42D9FF] font-['Space_Grotesk'] text-xs font-bold border border-white/10 transition-colors flex items-center justify-center gap-2 mt-1"
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Save Seats in Trip Draft &amp; Return</span>
        </button>
      </div>
    </aside>
  );
}
