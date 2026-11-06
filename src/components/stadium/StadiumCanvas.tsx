'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ProceduralStadium } from './ProceduralStadium';
import { InstancedSeats } from './InstancedSeats';
import { CameraController } from './CameraController';
import { CameraMode, SeatData, StandSector } from '@/types/stadium';

interface StadiumCanvasProps {
  cameraMode: CameraMode;
  selectedSector: StandSector;
  selectedSeats: SeatData[];
  selectedSeatIds: string[];
  hoveredSeatId: string | null;
  zoomTrigger: number;
  rotateTrigger: number;
  resetTrigger: number;
  onSelectSeat: (seat: SeatData, multi?: boolean) => void;
  onHoverSeat: (seatId: string | null) => void;
}

export function StadiumCanvas({
  cameraMode,
  selectedSector,
  selectedSeats,
  selectedSeatIds,
  hoveredSeatId,
  zoomTrigger,
  rotateTrigger,
  resetTrigger,
  onSelectSeat,
  onHoverSeat,
}: StadiumCanvasProps) {
  const [hasWebGL, setHasWebGL] = useState(true);

  // Verify WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#080B18] text-center p-6">
        <div className="p-6 bg-[#10162A] border border-white/10 rounded max-w-md">
          <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#FF8A3D] mb-2">
            WebGL Simulation Fallback
          </h3>
          <p className="font-['Inter'] text-xs text-[#9CA8BD] mb-4">
            3D Hardware Acceleration is not available on your device. You can still select your East Stand seats and add them to your trip draft.
          </p>
          <div className="p-3 bg-[#080B18] rounded border border-white/10 text-xs font-['Space_Grotesk'] text-[#42D9FF]">
            SELECTED: East Stand Block D (Row 12, Seats 41-44) • ₹12,800
          </div>
        </div>
      </div>
    );
  }

  const primarySeat = selectedSeats[0] || null;

  return (
    <div className="w-full h-full relative bg-[#080B18] overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [0, 52, 72], fov: 45, near: 0.5, far: 500 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#080B18']} />
        <fog attach="fog" args={['#080B18', 85, 220]} />

        <Suspense fallback={null}>
          <ProceduralStadium performanceMode="high" />
          <InstancedSeats
            selectedSeatIds={selectedSeatIds}
            hoveredSeatId={hoveredSeatId}
            onSelectSeat={onSelectSeat}
            onHoverSeat={onHoverSeat}
          />
          <CameraController
            cameraMode={cameraMode}
            selectedSeat={primarySeat}
            zoomTrigger={zoomTrigger}
            rotateTrigger={rotateTrigger}
            resetTrigger={resetTrigger}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

