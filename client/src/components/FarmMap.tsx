// client/src/components/FarmMap.tsx
import React, { useState } from 'react';
import { Plant, RoverTelemetry } from '../types';
import { Navigation, Droplets, AlertOctagon, TrendingDown, Eye, MoveHorizontal } from 'lucide-react';

interface FarmMapProps {
  plants: Plant[];
  rover: RoverTelemetry;
  onSelectPlant: (plant: Plant) => void;
  selectedPlantId?: string;
}

export const FarmMap: React.FC<FarmMapProps> = ({
  plants,
  rover,
  onSelectPlant,
  selectedPlantId,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'issues_only' | 'water_stress' | 'disease'>('all');
  const [hoveredPlant, setHoveredPlant] = useState<Plant | null>(null);

  const rows = Array.from({ length: 10 }, (_, i) => i + 1);

  const getPlantStatusBg = (plant: Plant) => {
    const isCurrentRoverTarget = plant.plant_id === rover.currentPlantId;
    
    let baseColor = 'bg-[#EBF4F0] border-[#D1E2D7] text-[#065F46] hover:bg-[#D8EADB] hover:border-[#B4D5C2] shadow-2xs';
    
    if (plant.status === 'Water Stress') {
      baseColor = 'bg-[#FEF3C7] border-[#FDE68A] text-[#92400E] font-bold hover:bg-[#FDE68A] shadow-xs';
    } else if (plant.status === 'Possible Disease') {
      baseColor = 'bg-[#FFE4E6] border-[#FECDD3] text-[#9F1239] font-bold hover:bg-[#FECDD3] shadow-xs';
    } else if (plant.status === 'Slow Growth') {
      baseColor = 'bg-[#FFEDD5] border-[#FED7AA] text-[#9A3412] hover:bg-[#FED7AA] shadow-xs';
    } else if (plant.status === 'Needs Inspection') {
      baseColor = 'bg-[#F3E8FF] border-[#E9D5FF] text-[#6B21A8] hover:bg-[#E9D5FF] shadow-xs';
    }

    if (filterMode === 'issues_only' && plant.status === 'Healthy') {
      baseColor = 'bg-[#F8FAF9] border-[#EAEFEA] text-[#94A3B8] opacity-35';
    } else if (filterMode === 'water_stress' && plant.status !== 'Water Stress') {
      baseColor = 'bg-[#F8FAF9] border-[#EAEFEA] text-[#94A3B8] opacity-35';
    } else if (filterMode === 'disease' && plant.status !== 'Possible Disease') {
      baseColor = 'bg-[#F8FAF9] border-[#EAEFEA] text-[#94A3B8] opacity-35';
    }

    if (isCurrentRoverTarget) {
      baseColor += ' ring-2 ring-[#0F172A] ring-offset-2 ring-offset-[#F8FAF9] scale-105 z-20 shadow-md';
    }

    if (selectedPlantId === plant.plant_id) {
      baseColor += ' ring-2 ring-emerald-600 ring-offset-1 ring-offset-[#F8FAF9]';
    }

    return baseColor;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Water Stress':
        return <Droplets className="w-2.5 h-2.5 text-amber-700 shrink-0" />;
      case 'Possible Disease':
        return <AlertOctagon className="w-2.5 h-2.5 text-rose-700 shrink-0" />;
      case 'Slow Growth':
        return <TrendingDown className="w-2.5 h-2.5 text-orange-700 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-8 border border-[#EAEFEA] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-4 sm:space-y-5">
      
      {/* Header & Map Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-[#F0F4F1]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#0F172A] m-0">
              1-Acre Farm Plant Grid Map
            </h2>
            <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-[#F1F5F3] text-[#475569] border border-[#E2E8F0] font-mono">
              10 Rows × 15 Pos
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Spatial matrix of the surveyed acre. Tap any plant node to inspect its live record.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar text-xs font-mono py-1 sm:py-0">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer shrink-0 ${
              filterMode === 'all'
                ? 'bg-[#0F172A] text-white font-semibold'
                : 'bg-[#F1F5F3] text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            All (150)
          </button>
          <button
            onClick={() => setFilterMode('issues_only')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer shrink-0 ${
              filterMode === 'issues_only'
                ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-semibold'
                : 'bg-[#F1F5F3] text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Attention (13)
          </button>
          <button
            onClick={() => setFilterMode('water_stress')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer shrink-0 ${
              filterMode === 'water_stress'
                ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] font-semibold'
                : 'bg-[#F1F5F3] text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Water (8)
          </button>
          <button
            onClick={() => setFilterMode('disease')}
            className={`px-3 py-1 rounded-full transition-colors cursor-pointer shrink-0 ${
              filterMode === 'disease'
                ? 'bg-[#FFE4E6] text-[#9F1239] border border-[#FECDD3] font-semibold'
                : 'bg-[#F1F5F3] text-[#475569] hover:text-[#0F172A]'
            }`}
          >
            Disease (3)
          </button>
        </div>
      </div>

      {/* Legend & Rover Target Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono text-[#64748B] py-1 border-b border-[#F0F4F1]">
        <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EBF4F0] border border-[#D1E2D7] inline-block"></span>
            Healthy (137)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] inline-block"></span>
            Water Stress (8)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFE4E6] border border-[#FECDD3] inline-block"></span>
            Disease (3)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFEDD5] border border-[#FED7AA] inline-block"></span>
            Slow Growth (2)
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF4F0] border border-[#D1E2D7] text-[#065F46] font-semibold text-[11px] sm:text-xs">
            <Navigation className="w-3 h-3 text-emerald-700 animate-spin" />
            <span>Rover at: <strong>{rover.currentPlantId}</strong></span>
          </div>
          
          <div className="sm:hidden flex items-center gap-1 text-[10px] text-slate-400">
            <MoveHorizontal className="w-3 h-3" />
            <span>Swipe</span>
          </div>
        </div>
      </div>

      {/* Matrix of 10 Rows with Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-2 -mx-2 px-2">
        <div className="min-w-[800px] space-y-1.5">
          {rows.map((rowNum) => {
            const rowPlants = plants.filter((p) => p.row === rowNum);
            const isRoverInThisRow = rover.currentRow === rowNum;

            return (
              <div 
                key={`row-${rowNum}`} 
                className={`flex items-center gap-1.5 p-1 rounded-2xl transition-colors ${
                  isRoverInThisRow ? 'bg-[#EBF4F0]/60 border border-[#D1E2D7]' : 'bg-[#FAFBF9]'
                }`}
              >
                <div className="w-14 shrink-0 flex items-center justify-between px-2 py-1 rounded-xl bg-white border border-[#EAEFEA] text-[10px] font-mono font-bold text-[#334155] shadow-2xs">
                  <span>R{rowNum}</span>
                  {isRoverInThisRow && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  )}
                </div>

                <div className="grid grid-cols-15 gap-1 flex-1">
                  {rowPlants.map((plant) => {
                    const isRoverHere = plant.plant_id === rover.currentPlantId;

                    return (
                      <button
                        key={plant.plant_id}
                        onClick={() => onSelectPlant(plant)}
                        onMouseEnter={() => setHoveredPlant(plant)}
                        onMouseLeave={() => setHoveredPlant(null)}
                        className={`group relative flex flex-col items-center justify-center p-1 rounded-xl border text-[10px] font-mono transition-all duration-150 cursor-pointer ${getPlantStatusBg(
                          plant
                        )}`}
                        title={`Plant ${plant.plant_id} | Row ${plant.row}, Pos ${plant.position} | Status: ${plant.status}`}
                      >
                        {isRoverHere && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center pointer-events-none">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F172A] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0F172A] border border-white"></span>
                            </span>
                          </div>
                        )}

                        <span className="font-bold tracking-tight">{plant.plant_id}</span>
                        
                        <div className="flex items-center gap-0.5 mt-0.5 text-[8px]">
                          {getStatusIcon(plant.status)}
                          <span className="opacity-90">{plant.soil.moisture}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Hover Card Detail Preview */}
      {hoveredPlant && (
        <div className="p-3 sm:p-4 rounded-2xl bg-[#F8FAF9] border border-[#D1E2D7] flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs animate-fadeIn">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="px-2.5 py-0.5 rounded-lg bg-white font-bold text-[#0F172A] border border-[#EAEFEA] shadow-2xs">
              {hoveredPlant.plant_id}
            </span>
            <span className="text-[#64748B] text-[11px] sm:text-xs">
              Row {hoveredPlant.row}, Pos {hoveredPlant.position}
            </span>
            <span className="text-[#334155] text-[11px] sm:text-xs">
              Moisture: <strong className={hoveredPlant.soil.moisture < 28 ? 'text-amber-700' : 'text-emerald-700'}>{hoveredPlant.soil.moisture}%</strong>
            </span>
            <span className="text-[#334155] text-[11px] sm:text-xs">
              pH: <strong>{hoveredPlant.soil.ph}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              hoveredPlant.status === 'Healthy' 
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                : hoveredPlant.status === 'Water Stress' 
                ? 'bg-amber-100 text-amber-800 border-amber-200' 
                : 'bg-rose-100 text-rose-700 border-rose-200'
            }`}>
              {hoveredPlant.status}
            </span>
            <button
              onClick={() => onSelectPlant(hoveredPlant)}
              className="px-3 py-1 rounded-full bg-[#0F172A] text-white font-semibold flex items-center gap-1 cursor-pointer text-xs"
            >
              <Eye className="w-3 h-3" />
              <span>Inspect</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
