import React from 'react';

interface TelemetryStatusBarProps {
  statusText?: string;
  nodeText?: string;
  matchTelemetry?: string;
  className?: string;
}

export function TelemetryStatusBar({
  statusText = 'CORRIDOR AGENT V4.2 ACTIVE',
  nodeText = 'NODE: BLR-CENTRAL • MYS-CORRIDOR-LINKED',
  matchTelemetry = 'CHINNASWAMY TELEMETRY: HIGH DEMAND',
  className = '',
}: TelemetryStatusBarProps) {
  return (
    <div
      className={`w-full bg-[#080B18] border-b border-white/5 px-4 md:px-8 lg:px-12 py-1.5 flex flex-wrap items-center justify-between text-[11px] font-['Space_Grotesk'] text-[#9CA8BD] select-none ${className}`}
    >
      {/* Left Telemetry Cluster */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#42D9FF] animate-pulse"></span>
          <span className="text-[#42D9FF] font-bold tracking-wider">{statusText}</span>
        </div>
        <span className="text-white/20 hidden sm:inline">|</span>
        <span className="font-['Inter'] tabular-nums hidden sm:inline text-[#9CA8BD]">{nodeText}</span>
      </div>

      {/* Right Telemetry Cluster */}
      <div className="flex items-center gap-4">
        <span className="font-['Inter'] tabular-nums hidden md:inline text-white/60">IPL SEASON 18 • MATCH 42</span>
        <span className="text-[#FF8A3D] font-bold tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A3D] animate-ping"></span>
          {matchTelemetry}
        </span>
      </div>
    </div>
  );
}

