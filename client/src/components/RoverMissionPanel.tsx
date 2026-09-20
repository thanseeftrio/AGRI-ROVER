// client/src/components/RoverMissionPanel.tsx
import React, { useState } from 'react';
import { RoverTelemetry } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  StepForward, 
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface RoverMissionPanelProps {
  rover: RoverTelemetry;
  onStartMission: (speed: number) => void;
  onPauseMission: () => void;
  onStepMission: () => void;
  onFastForwardMission: () => void;
  onResetMission: () => void;
  isSimulating: boolean;
  onInspectCurrentPlant: (plantId: string) => void;
}

export const RoverMissionPanel: React.FC<RoverMissionPanelProps> = ({
  rover,
  onStartMission,
  onPauseMission,
  onStepMission,
  onFastForwardMission,
  onResetMission,
  isSimulating,
  onInspectCurrentPlant,
}) => {
  const [selectedSpeed, setSelectedSpeed] = useState<number>(2);

  const progressPercent = Math.min(100, Math.round((rover.plantsScannedCount / rover.totalPlants) * 100));

  return (
    <div className="bg-gradient-to-br from-[#EBF4F0] via-[#F4F8F6] to-[#FAFBF9] border border-[#DEEAE2] rounded-3xl p-5 sm:p-8 lg:p-10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)] overflow-hidden relative">
      
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-[#D8EADB]/40 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* Left Editorial Text Column */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#D1E2D7] text-xs font-mono text-[#065F46] shadow-2xs backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-semibold uppercase tracking-wider text-[10px] sm:text-[11px]">Agri Rover Field AI</span>
            <span className="text-slate-300">•</span>
            <span className="text-[10px] sm:text-xs">1 Acre Arecanut Block</span>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-[#0F172A] leading-[1.12] m-0">
              Embrace Autonomous Field Intelligence
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-[#475569] leading-relaxed max-w-xl font-normal">
              Autonomous robotic surveying delivering multi-spectral camera scans, robotic depth soil probe telemetry, and early stress diagnosis for 150 Arecanut palms.
            </p>
          </div>

          {/* Action Button & Mission Trigger Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1">
            {!isSimulating ? (
              <button
                onClick={() => onStartMission(selectedSpeed)}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-semibold tracking-wide uppercase font-mono flex items-center justify-center gap-2 shadow-md shadow-slate-900/10 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Demo Mission</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-70" />
              </button>
            ) : (
              <button
                onClick={onPauseMission}
                className="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-full bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold tracking-wide uppercase font-mono flex items-center justify-center gap-2 shadow-md shadow-amber-900/10 transition-all cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Mission</span>
              </button>
            )}

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button
                onClick={onStepMission}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#334155] text-xs font-mono font-medium border border-[#D1E2D7] shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <StepForward className="w-3.5 h-3.5" />
                <span>Step</span>
              </button>

              <button
                onClick={onFastForwardMission}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-[#065F46] text-xs font-mono font-semibold border border-[#C2DEC8] shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>150 Scans</span>
              </button>

              <button
                onClick={onResetMission}
                className="p-2.5 rounded-full bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-[#D1E2D7] shadow-2xs cursor-pointer transition-colors"
                title="Reset Simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Speed Selector */}
              <div className="flex items-center gap-1 bg-white/90 p-1 rounded-full border border-[#D1E2D7] text-xs font-mono shadow-2xs">
                {[1, 2, 5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => {
                      setSelectedSpeed(spd);
                      if (isSimulating) onStartMission(spd);
                    }}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                      selectedSpeed === spd
                        ? 'bg-[#0F172A] text-white'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Integrated Mission Progress Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#64748B] mb-1.5">
              <span>
                Progress: <strong className="text-[#0F172A] font-bold">{rover.plantsScannedCount}</strong> / {rover.totalPlants} scanned
              </span>
              <span className="text-[#065F46] font-bold">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden border border-[#D1E2D7] p-0.5">
              <div 
                className="h-full bg-[#0F172A] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Visual Showcase Card */}
        <div className="lg:col-span-5 flex justify-center w-full">
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E2ECE8] shadow-[0_15px_35px_-10px_rgba(0,0,0,0.06)] w-full max-w-md space-y-3.5">
            
            <div className="flex items-center justify-between font-mono text-xs pb-2.5 border-b border-[#F0F4F1]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[#475569] font-medium text-[11px] sm:text-xs">Spotlight Target:</span>
              </div>
              <button
                onClick={() => onInspectCurrentPlant(rover.currentPlantId)}
                className="px-2.5 py-0.5 rounded-full bg-[#EBF4F0] text-[#065F46] font-bold border border-[#D1E2D7] hover:bg-[#D8EADB] transition-colors cursor-pointer flex items-center gap-1 text-xs"
              >
                <span>{rover.currentPlantId}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Circular / Rounded Spotlight Container */}
            <div className="relative aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-[#F4F7F5] border border-[#E2ECE8] flex items-center justify-center p-3">
              <div className="w-full h-full rounded-xl overflow-hidden flex flex-col items-center justify-between p-3 text-center">
                <div className="flex justify-between w-full text-[9px] sm:text-[10px] font-mono text-[#64748B]">
                  <span>CAM-01 RGB</span>
                  <span>ROW {rover.currentRow} • {rover.currentPlantId}</span>
                </div>

                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 border-2 border-emerald-500/40 flex items-center justify-center shadow-2xs my-auto">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
                    <path d="M12 6v12M6 12h12"/>
                  </svg>
                </div>

                <div className="font-mono text-[11px] sm:text-xs text-[#0F172A] font-bold">
                  Status: {rover.status}
                </div>
              </div>

              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur text-[10px] font-mono text-[#065F46] font-semibold border border-[#D1E2D7] shadow-2xs">
                Probe: {rover.probeState}
              </div>
            </div>

            {/* Mini Telemetry Stats */}
            <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
              <div className="p-2 rounded-xl bg-[#F8FAF9] border border-[#EAEFEA]">
                <div className="text-[9px] sm:text-[10px] text-[#64748B]">Battery</div>
                <div className="font-bold text-[#0F172A] text-xs sm:text-sm mt-0.5">{rover.battery}%</div>
              </div>
              <div className="p-2 rounded-xl bg-[#F8FAF9] border border-[#EAEFEA]">
                <div className="text-[9px] sm:text-[10px] text-[#64748B]">Row</div>
                <div className="font-bold text-[#0F172A] text-xs sm:text-sm mt-0.5">R{rover.currentRow}/10</div>
              </div>
              <div className="p-2 rounded-xl bg-[#F8FAF9] border border-[#EAEFEA]">
                <div className="text-[9px] sm:text-[10px] text-[#64748B]">Distance</div>
                <div className="font-bold text-emerald-700 text-xs sm:text-sm mt-0.5">{rover.distanceTraveledMeters}m</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
