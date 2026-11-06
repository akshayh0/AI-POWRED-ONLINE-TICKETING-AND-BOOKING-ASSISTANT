'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { SelectedSeat, BookingConfirmation } from '@/types/stadium';
import { TicketBookingPanel } from '@/components/stadium/TicketBookingPanel';
import { useLanguage } from '@/context/LanguageContext';
import { formatINR } from '@/lib/utils';

// Client-only dynamic import of the Three.js Stadium
const TicketEaseStadium3D = dynamic(
  () => import('@/components/stadium/TicketEaseStadium3D').then((mod) => mod.TicketEaseStadium3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[520px] flex flex-col items-center justify-center bg-[#070D10] text-[#42D9FF] font-['Space_Grotesk']">
        <div className="w-12 h-12 rounded-full border-2 border-[#42D9FF] border-t-transparent animate-spin mb-4" />
        <span className="text-sm font-bold tracking-widest uppercase">
          INITIALIZING CHINNASWAMY 3D STADIUM ENGINE…
        </span>
        <span className="text-xs text-[#9CA8BD] font-['Inter'] mt-2">
          Generating procedural seating tiers, floodlights, and sightlines
        </span>
      </div>
    ),
  }
);

const MAX_SEATS = 6;
const HOLD_DURATION_MS = 10 * 60 * 1000; // 10 minutes

const TIER_PRICES = [
  { price: 4500, color: '#86e8ab', label: 'Grandstand Tier' },
  { price: 2500, color: '#5bc788', label: 'Club Tier' },
  { price: 1800, color: '#3a9c69', label: 'Pavilion Tier' },
  { price: 1200, color: '#2f7d5a', label: 'General Tier' },
];

export default function StadiumSeatSelectionPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [tierFilter, setTierFilter] = useState<number | null>(null);
  const [holdTimeRemaining, setHoldTimeRemaining] = useState<number | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<BookingConfirmation | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const statusTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Status message setter with auto-clear
  const showStatus = useCallback((msg: string) => {
    setStatusMessage(msg);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    if (msg) {
      statusTimerRef.current = setTimeout(() => {
        setStatusMessage('');
      }, 5000);
    }
  }, []);

  // 10-minute hold countdown timer
  useEffect(() => {
    if (holdTimeRemaining === null || holdTimeRemaining <= 0) return;

    const interval = setInterval(() => {
      setHoldTimeRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1000) {
          // Timer expired
          setSelectedSeats([]);
          showStatus(
            language === 'KN'
              ? 'ನಿಮ್ಮ 10 ನಿಮಿಷಗಳ ಸೀಟ್ ಹೋಲ್ಡ್ ಅವಧಿ ಮುಗಿದಿದೆ. ಆಸನಗಳನ್ನು ಬಿಡುಗಡೆ ಮಾಡಲಾಗಿದೆ.'
              : 'Your 10-minute hold expired. Seats have been released back to demo inventory.'
          );
          return null;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [holdTimeRemaining, language, showStatus]);

  // Handle seat toggle (Add/Remove)
  const handleToggleSeat = useCallback(
    (seat: SelectedSeat) => {
      setSelectedSeats((prev) => {
        const existingIdx = prev.findIndex((s) => s.i === seat.i);

        if (existingIdx >= 0) {
          // Deselect
          const next = prev.filter((_, idx) => idx !== existingIdx);
          if (next.length === 0) {
            setHoldTimeRemaining(null);
          }
          showStatus('');
          return next;
        }

        // Check 6-seat limit
        if (prev.length >= MAX_SEATS) {
          showStatus(
            language === 'KN'
              ? `ನೀವು ಒಂದೇ ಬಾರಿಗೆ ಗರಿಷ್ಠ ${MAX_SEATS} ಆಸನಗಳನ್ನು ಮಾತ್ರ ಆಯ್ಕೆ ಮಾಡಬಹುದು.`
              : `You can hold up to ${MAX_SEATS} seats at once.`
          );
          return prev;
        }

        // Start 10-minute hold timer on first seat
        if (prev.length === 0) {
          setHoldTimeRemaining(HOLD_DURATION_MS);
        }

        showStatus('');
        return [...prev, seat];
      });
    },
    [language, showStatus]
  );

  // Remove seat directly from the receipt panel
  const handleRemoveSeat = useCallback((index: number) => {
    setSelectedSeats((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) {
        setHoldTimeRemaining(null);
      }
      return next;
    });
  }, []);

  // Handle simulated checkout payment
  const handlePay = useCallback(() => {
    if (selectedSeats.length === 0) return;

    const sub = selectedSeats.reduce((acc, s) => acc + s.price, 0);
    const fee = Math.round(sub * 0.05);
    const tax = Math.round(fee * 0.18);
    const total = sub + fee + tax;

    const confirmation: BookingConfirmation = {
      ref: 'TE-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      items: [...selectedSeats],
      money: {
        sub,
        fee,
        gst: tax,
        tot: total,
      },
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setBookingConfirmation(confirmation);
    setSelectedSeats([]);
    setHoldTimeRemaining(null);
    showStatus('');
  }, [selectedSeats, showStatus]);

  // Handle book again
  const handleBookAgain = useCallback(() => {
    setBookingConfirmation(null);
    setSelectedSeats([]);
    setHoldTimeRemaining(null);
    showStatus('');
  }, [showStatus]);

  // Sync selected seats into Trip Draft and return to /assistant
  const handleSyncDraft = useCallback(() => {
    if (selectedSeats.length > 0) {
      try {
        const payload = selectedSeats.map((s) => ({
          block: s.b.code,
          row: s.r + 1,
          seatNumber: s.k + 1,
          price: s.price,
          stand: s.b.code.startsWith('N')
            ? 'North Stand'
            : s.b.code.startsWith('E')
            ? 'East Stand'
            : s.b.code.startsWith('S')
            ? 'South Stand'
            : 'West Stand',
        }));
        localStorage.setItem('ticketease_selected_seats', JSON.stringify(payload));
      } catch {
        // localStorage fallback
      }
    }
    router.push('/assistant');
  }, [selectedSeats, router]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#080B18] text-[#F8FAFC] flex flex-col select-none">
      {/* Top Telemetry & Match Header */}
      <header className="w-full bg-[#101320] border-b border-white/10 px-4 md:px-8 py-3 shrink-0">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/assistant"
              className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#171E35] hover:bg-[#262938] text-xs font-['Space_Grotesk'] font-bold text-[#42D9FF] border border-white/10 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'KN' ? 'ಸಹಾಯಕನಿಗೆ ಹಿಂತಿರುಗಿ' : 'AI Assistant'}</span>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                <h1 className="font-['Space_Grotesk'] text-sm md:text-base font-bold text-[#F8FAFC]">
                  RCB vs CSK • M. Chinnaswamy Stadium
                </h1>
                <span className="px-1.5 py-0.5 rounded bg-[#FF8A3D]/20 text-[#FF8A3D] text-[10px] font-['Space_Grotesk'] font-bold border border-[#FF8A3D]/30 uppercase">
                  DEMO STADIUM
                </span>
              </div>
              <div className="font-['Inter'] text-xs text-[#9CA8BD] mt-0.5">
                Saturday, 7 Nov 2026 • 19:30 IST • Bengaluru High-Speed Corridor
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-['Space_Grotesk'] text-[#9CA8BD]">
            <div className="flex items-center gap-1.5 bg-[#171E35] px-3 py-1.5 rounded border border-white/5">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>3D Sightline Engine: 60 FPS</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 bg-[#171E35] px-3 py-1.5 rounded border border-white/5 text-[#42D9FF]">
              <Info className="w-3.5 h-3.5" />
              <span>Click seat to inspect sightline • Max 6</span>
            </div>
          </div>
        </div>
      </header>

      {/* Status Alert Notification (when triggered) */}
      {statusMessage && (
        <div className="w-full bg-[#10162A] border-b border-[#FF8A3D]/40 px-4 py-2 flex items-center justify-center gap-2 text-xs font-['Space_Grotesk'] text-[#FF8A3D] animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Workspace Layout: 3D Viewport on Left + Booking Receipt Panel on Right */}
      <main className="flex-1 w-full max-w-[1720px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        {/* Left Column: 3D Viewport & Filter Bar */}
        <section className="lg:col-span-8 xl:col-span-8 flex flex-col relative border-b lg:border-b-0 lg:border-r border-white/10 min-h-[500px] lg:min-h-0">
          {/* Interactive 3D Canvas */}
          <div className="flex-1 relative w-full h-full min-h-[460px]">
            <TicketEaseStadium3D
              selectedSeats={selectedSeats}
              maxSeats={MAX_SEATS}
              tierFilter={tierFilter}
              onToggleSeat={handleToggleSeat}
              onSetTierFilter={setTierFilter}
              onStatusMessage={showStatus}
            />
          </div>

          {/* Bottom Filter & Status Bar (Key from reference HTML) */}
          <div className="w-full bg-[#101320] border-t border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-['Space_Grotesk']">
            {/* Price Tier Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[#9CA8BD] font-bold text-[11px] uppercase mr-1">
                {language === 'KN' ? 'ಬೆಲೆ ಶ್ರೇಣಿ:' : 'Price per seat:'}
              </span>
              {TIER_PRICES.map((t) => {
                const isActive = tierFilter === t.price;
                return (
                  <button
                    key={t.price}
                    type="button"
                    onClick={() => setTierFilter(isActive ? null : t.price)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all ${
                      isActive
                        ? 'bg-[#8B5CF6] text-white shadow-md font-bold'
                        : 'bg-[#171E35] hover:bg-[#262938] text-[#F8FAFC] border border-white/10'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: t.color }}
                    />
                    <span>{formatINR(t.price)}</span>
                  </button>
                );
              })}
              {tierFilter !== null && (
                <button
                  type="button"
                  onClick={() => setTierFilter(null)}
                  className="text-[11px] text-[#42D9FF] hover:underline ml-1"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Visual State Swatches */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#9CA8BD]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                <span className="text-[#F8FAFC] font-bold">Selected</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D19A2A]" />
                <span>Held by buyer</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#39434A]" />
                <span>Sold</span>
              </span>
            </div>
          </div>
        </section>

        {/* Right Column: Boarding Pass Ticket Receipt & Checkout Panel */}
        <aside className="lg:col-span-4 xl:col-span-4 bg-[#080B18] flex flex-col p-4 md:p-6 overflow-y-auto">
          <TicketBookingPanel
            selectedSeats={selectedSeats}
            maxSeats={MAX_SEATS}
            holdTimeRemaining={holdTimeRemaining}
            bookingConfirmation={bookingConfirmation}
            onRemoveSeat={handleRemoveSeat}
            onPay={handlePay}
            onBookAgain={handleBookAgain}
            onSyncDraft={handleSyncDraft}
          />
        </aside>
      </main>
    </div>
  );
}
