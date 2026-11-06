'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Compass,
  RotateCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plane,
  Umbrella,
  Eye,
  Train,
  CheckCircle,
  Ticket,
  Lock,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import { CameraMode, SeatData, StandSector } from '@/types/stadium';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

interface StadiumHUDProps {
  cameraMode: CameraMode;
  selectedSector: StandSector;
  selectedSeats: SeatData[];
  onSelectSector: (sector: StandSector) => void;
  onSetCameraMode: (mode: CameraMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onReset: () => void;
  onAddToDraft: () => void;
}

export function StadiumHUD({
  cameraMode,
  selectedSector,
  selectedSeats,
  onSelectSector,
  onSetCameraMode,
  onZoomIn,
  onZoomOut,
  onRotate,
  onReset,
  onAddToDraft,
}: StadiumHUDProps) {
  const { language } = useLanguage();
  const [draftAdded, setDraftAdded] = useState(false);
  const [minutes, setMinutes] = useState(14);
  const [seconds, setSeconds] = useState(59);

  // Reservation hold timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prevSec) => {
        if (prevSec > 0) return prevSec - 1;
        setMinutes((prevMin) => (prevMin > 0 ? prevMin - 1 : 14));
        return 59;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const seatCount = selectedSeats.length || 4;
  const sampleSeat = selectedSeats[0] || {
    stand: 'East Stand',
    standKn: 'ಪೂರ್ವ ಗ್ಯಾಲರಿ',
    block: 'Block D',
    row: 12,
    seatNumber: 41,
    tier: 'Lower Tier',
    price: 3200,
    viewAngle: 'Unobstructed 42° Angle',
    sightlineQuality: '96% Pitch Visibility',
    gate: 'Gate 12 / Gate 7',
    metroDistance: 'Cubbon Park ~300m',
    canopyShade: true,
  };

  const totalPrice = selectedSeats.length > 0
    ? selectedSeats.reduce((acc, curr) => acc + curr.price, 0)
    : 12800;

  const seatRangeText =
    selectedSeats.length > 1
      ? `${selectedSeats[0].seatNumber} – ${selectedSeats[selectedSeats.length - 1].seatNumber}`
      : `${sampleSeat.seatNumber}`;

  const handleAddSeats = () => {
    setDraftAdded(true);
    onAddToDraft();
    setTimeout(() => setDraftAdded(false), 3000);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-4 md:p-6 overflow-hidden">
      {/* ================= 1. TOP BAR OVERLAY: MATCH INFO & SECTOR TABS ================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Match Info Telemetry Pill */}
        <div className="flex items-center gap-3 px-3.5 py-2 bg-[#080B18]/90 backdrop-blur-md rounded border border-white/10 shadow-xl pointer-events-auto">
          <Link
            href="/assistant"
            className="flex items-center gap-1.5 text-xs font-['Space_Grotesk'] font-bold text-[#9CA8BD] hover:text-[#42D9FF] transition-colors pr-2 border-r border-white/10"
            title="Return to Assistant"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Workspace</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FB7185] animate-ping"></span>
            <span className="font-['Space_Grotesk'] text-xs font-bold text-[#F8FAFC] tracking-tight">
              RCB <span className="text-[#9CA8BD]">vs</span> CSK
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/10 hidden sm:block"></div>

          <div className="hidden sm:flex items-center gap-1 font-['Inter'] tabular-nums text-xs text-[#9CA8BD]">
            <Calendar className="w-3.5 h-3.5 text-[#42D9FF]" />
            <span>SAT 19 APR • 19:30 IST</span>
          </div>

          <div className="hidden md:flex items-center gap-1 font-['Space_Grotesk'] text-xs text-[#9CA8BD]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D]"></span>
            <span>M. Chinnaswamy, Bengaluru</span>
          </div>
        </div>

        {/* Sector Selector Controls */}
        <div className="flex items-center gap-1 p-1 bg-[#080B18]/90 backdrop-blur-md rounded border border-white/10 shadow-xl pointer-events-auto text-xs">
          <button
            type="button"
            onClick={() => {
              onSelectSector('all');
              onSetCameraMode('overview');
            }}
            className={`px-3 py-1.5 rounded font-['Space_Grotesk'] font-bold transition-colors ${
              selectedSector === 'all'
                ? 'bg-[#1C1F2D] text-[#F8FAFC]'
                : 'text-[#9CA8BD] hover:text-[#F8FAFC]'
            }`}
          >
            {language === 'KN' ? 'ಎಲ್ಲಾ ಸ್ಟ್ಯಾಂಡ್‌ಗಳು' : 'All Stands'}
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectSector('east');
              onSetCameraMode('stand');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-['Space_Grotesk'] font-bold transition-all shadow-sm ${
              selectedSector === 'east'
                ? 'bg-[#1C1F2D] text-[#FF8A3D] border border-[#FF8A3D]/40'
                : 'text-[#9CA8BD] hover:text-[#F8FAFC]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D]"></span>
            <span>{language === 'KN' ? 'ಪೂರ್ವ ಗ್ಯಾಲರಿ (AI Pick)' : 'East Stand (AI Pick)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectSector('pavilion');
              onSetCameraMode('overview');
            }}
            className={`px-3 py-1.5 rounded font-['Space_Grotesk'] font-bold transition-colors ${
              selectedSector === 'pavilion'
                ? 'bg-[#1C1F2D] text-[#8B5CF6]'
                : 'text-[#9CA8BD] hover:text-[#F8FAFC]'
            }`}
          >
            {language === 'KN' ? 'ಪೆವಿಲಿಯನ್' : 'Pavilion'}
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectSector('budget');
              onSetCameraMode('stand');
            }}
            className={`hidden sm:inline px-3 py-1.5 rounded font-['Space_Grotesk'] font-bold transition-colors ${
              selectedSector === 'budget'
                ? 'bg-[#1C1F2D] text-[#42D9FF]'
                : 'text-[#9CA8BD] hover:text-[#F8FAFC]'
            }`}
          >
            &lt; ₹3,500
          </button>
        </div>

        {/* Perspective Mode Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#080B18]/90 backdrop-blur-md rounded border border-white/10 pointer-events-auto">
          <span className="font-['Space_Grotesk'] text-[11px] text-[#9CA8BD] font-bold">VIEW:</span>
          <span className="font-['Space_Grotesk'] text-xs text-[#42D9FF] uppercase font-bold flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#42D9FF]" />
            <span>
              {cameraMode === 'firstPerson'
                ? 'First-Person Seat Sightline'
                : cameraMode === 'stand'
                ? 'East Stand Sector View'
                : '3D Match Pitch Orbit'}
            </span>
          </span>
          <span className="px-1.5 py-0.2 rounded bg-[#1C1F2D] text-[10px] font-['Inter'] tabular-nums text-[#9CA8BD]">
            42,800 Seats (Demo)
          </span>
        </div>
      </div>

      {/* ================= 2. FLOATING SEAT INSPECTION CARD (BOARDING PASS) ================= */}
      <div className="self-end mt-4 mb-auto w-full max-w-[340px] pointer-events-auto animate-fadeIn">
        <div className="flex flex-col bg-[#10162A]/95 backdrop-blur-xl rounded border border-white/15 shadow-2xl overflow-hidden">
          {/* Header Stub with Flight Manifest Notch Accents */}
          <div className="p-4 bg-[#171E35] relative">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[10px] tracking-widest uppercase text-[#42D9FF] font-bold">
                  CONFIRMED ALLOCATION SLOT
                </span>
                <h2 className="font-['Space_Grotesk'] text-base font-bold text-[#F8FAFC] mt-0.5 m-0 leading-tight">
                  {sampleSeat.stand} • {sampleSeat.block}
                </h2>
                <span className="font-['Inter'] text-[11px] text-[#9CA8BD]">
                  {language === 'KN' ? sampleSeat.standKn : 'ಪೂರ್ವ ಗ್ಯಾಲರಿ • ಬ್ಲಾಕ್ ಡಿ'}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#42D9FF]/15 text-[#42D9FF] border border-[#42D9FF]/30 font-['Space_Grotesk'] text-[10px] font-bold uppercase">
                {sampleSeat.gate}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between font-['Inter'] tabular-nums text-xs bg-[#080B18]/70 p-2.5 rounded border border-white/5">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#9CA8BD] uppercase font-['Space_Grotesk'] font-bold">
                  ROW
                </span>
                <span className="font-['Space_Grotesk'] font-bold text-[#F8FAFC]">
                  Row {sampleSeat.row}
                </span>
              </div>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#9CA8BD] uppercase font-['Space_Grotesk'] font-bold">
                  SEATS
                </span>
                <span className="font-['Space_Grotesk'] font-bold text-[#8B5CF6]">
                  {seatRangeText}
                </span>
              </div>
              <div className="h-6 w-px bg-white/10"></div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-[#9CA8BD] uppercase font-['Space_Grotesk'] font-bold">
                  QUANTITY
                </span>
                <span className="font-['Space_Grotesk'] font-bold text-[#F8FAFC]">
                  {seatCount} Seats
                </span>
              </div>
            </div>
          </div>

          {/* Perforated Tear-Line Separation */}
          <div className="relative w-full h-3 bg-[#171E35] flex items-center justify-between">
            <div className="w-3.5 h-6 rounded-r-full bg-[#080B18] -ml-0.5"></div>
            <div className="flex-1 border-t border-dashed border-white/20 mx-1"></div>
            <div className="w-3.5 h-6 rounded-l-full bg-[#080B18] -mr-0.5"></div>
          </div>

          {/* Card Body & Environmental Specs */}
          <div className="p-4 flex flex-col gap-3 bg-[#10162A]">
            <div className="grid grid-cols-1 gap-2 text-xs font-['Inter']">
              <div className="flex items-center justify-between text-[#9CA8BD]">
                <span className="flex items-center gap-1.5">
                  <Umbrella className="w-3.5 h-3.5 text-[#42D9FF]" />
                  <span>Covered Canopy Shade</span>
                </span>
                <span className="font-['Space_Grotesk'] font-bold text-[#F8FAFC] text-[11px]">
                  Yes (100% Weatherproof)
                </span>
              </div>

              <div className="flex items-center justify-between text-[#9CA8BD]">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>Sight Screen Alignment</span>
                </span>
                <span className="font-['Space_Grotesk'] font-bold text-[#F8FAFC] text-[11px]">
                  {sampleSeat.viewAngle}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#9CA8BD]">
                <span className="flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-[#FF8A3D]" />
                  <span>Metro Corridor Access</span>
                </span>
                <span className="font-['Space_Grotesk'] font-bold text-[#FF8A3D] text-[11px]">
                  {sampleSeat.metroDistance}
                </span>
              </div>
            </div>

            {/* Price & Fare Calculation Breakdown */}
            <div className="p-3 rounded bg-[#080B18] border border-white/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] font-bold">
                  {formatINR(sampleSeat.price)} × {seatCount} GUESTS
                </span>
                <span className="font-['Inter'] text-lg font-bold text-[#F8FAFC] tabular-nums leading-tight">
                  {formatINR(totalPrice)}
                </span>
              </div>
              <span className="font-['Space_Grotesk'] text-[10px] text-[#9CA8BD] text-right">
                INCL. GST &amp; ENTRY LEVY (DEMO)
              </span>
            </div>

            {/* Primary Booking Call-to-Action */}
            <button
              type="button"
              onClick={handleAddSeats}
              className={`w-full py-2.5 px-4 rounded font-['Space_Grotesk'] text-xs font-bold tracking-tight transition-all flex items-center justify-center gap-2 shadow-lg ${
                draftAdded
                  ? 'bg-[#22C55E] text-white shadow-[#22C55E]/30'
                  : 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white shadow-[#8B5CF6]/30'
              }`}
            >
              {draftAdded ? (
                <>
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span>{seatCount} Seats Synced to Trip Draft!</span>
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  <span>Select {seatCount} Seats for Trip Draft (Demo)</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-['Space_Grotesk'] text-[#9CA8BD]">
              <Lock className="w-3 h-3 text-[#42D9FF]" />
              <span>
                Held in draft bucket for {String(minutes).padStart(2, '0')}:
                {String(seconds).padStart(2, '0')} mins (Demo)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. BOTTOM OVERLAYS: LEGEND & CAMERA CONTROLS ================= */}
      <div className="flex flex-wrap items-end justify-between gap-3 pointer-events-none w-full">
        {/* Bottom-Left Seat State Legend & Telemetry */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          <div className="flex items-center gap-4 px-3.5 py-2 bg-[#080B18]/90 backdrop-blur-md rounded border border-white/10 shadow-xl font-['Inter'] tabular-nums text-xs text-[#9CA8BD]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#22C55E]"></span>
              <span className="text-[#F8FAFC]">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.8)]"></span>
              <span className="text-[#F8FAFC]">Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#7A3B45]"></span>
              <span className="text-[#F8FAFC]">Sold</span>
            </div>
            <div className="hidden sm:inline border-l border-white/10 pl-3 font-['Space_Grotesk'] text-[11px] text-[#42D9FF] font-bold">
              184 / 320 REMAINING (DEMO)
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-[#080B18]/80 backdrop-blur-sm rounded text-[#9CA8BD] font-['Space_Grotesk'] text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#42D9FF]" />
            <span>Drag to orbit • Scroll to zoom • Click seat to select</span>
          </div>
        </div>

        {/* Bottom-Right 3D Camera Controls */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {/* Minimalist Camera Manipulation Cluster */}
          <div className="flex items-center bg-[#080B18]/95 backdrop-blur-md rounded border border-white/10 p-1 shadow-2xl">
            <button
              type="button"
              onClick={onRotate}
              className="p-2 rounded text-[#9CA8BD] hover:text-[#F8FAFC] hover:bg-[#1C1F2D] transition-colors"
              title="Rotate 360°"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onZoomIn}
              className="p-2 rounded text-[#9CA8BD] hover:text-[#F8FAFC] hover:bg-[#1C1F2D] transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onZoomOut}
              className="p-2 rounded text-[#9CA8BD] hover:text-[#F8FAFC] hover:bg-[#1C1F2D] transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onReset}
              className="p-2 rounded text-[#9CA8BD] hover:text-[#F8FAFC] hover:bg-[#1C1F2D] transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Feature Highlight Button: Fly to my Seat */}
          <button
            type="button"
            onClick={() => {
              if (cameraMode === 'firstPerson') {
                onSetCameraMode('overview');
              } else {
                onSetCameraMode('firstPerson');
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded font-['Space_Grotesk'] text-xs font-bold shadow-xl transition-all ${
              cameraMode === 'firstPerson'
                ? 'bg-[#8B5CF6] text-white shadow-[#8B5CF6]/30'
                : 'bg-[#FF8A3D] text-[#080B18] hover:bg-[#ff9d5c] shadow-[#FF8A3D]/25'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>
              {cameraMode === 'firstPerson' ? 'Return to Orbit View' : 'Fly to my seat'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

