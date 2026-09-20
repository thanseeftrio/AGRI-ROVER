// client/src/components/PlantDetailModal.tsx
import React, { useState } from 'react';
import { Plant } from '../types';
import { 
  X, 
  MapPin, 
  Droplets, 
  Thermometer, 
  Activity, 
  Calendar, 
  TrendingUp, 
  Camera, 
  Plane, 
  Sparkles, 
  Sliders, 
  ChevronRight,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';

interface PlantDetailModalProps {
  plant: Plant | null;
  onClose: () => void;
  onSelectPlantId?: (plantId: string) => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({
  plant,
  onClose,
  onSelectPlantId,
}) => {
  if (!plant) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'soil' | 'camera' | 'water' | 'ai_disease' | 'growth' | 'drone' | 'history'>('overview');
  const [selectedLeafView, setSelectedLeafView] = useState<'full' | 'leaf1' | 'leaf2' | 'leaf3'>('full');
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareSlider, setCompareSlider] = useState<number>(50);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Water Stress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Possible Disease':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Slow Growth':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Needs Inspection':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getActiveImage = () => {
    switch (selectedLeafView) {
      case 'leaf1': return plant.images.leafScan1;
      case 'leaf2': return plant.images.leafScan2;
      case 'leaf3': return plant.images.leafScan3;
      default: return plant.images.fullPlant;
    }
  };

  const filteredHistory = plant.history.filter((_, idx) => {
    if (historyFilter === 'today') return idx === 0;
    if (historyFilter === '7days') return idx <= 2;
    if (historyFilter === '30days') return idx <= 4;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 lg:p-6 bg-black/50 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white border-0 sm:border border-[#DEEAE2] rounded-none sm:rounded-3xl w-full max-w-5xl h-full sm:h-auto sm:max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Dossier Header */}
        <div className="p-4 sm:p-6 border-b border-[#EAEFEA] bg-[#FAFBF9] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-3 py-1 rounded-xl sm:rounded-2xl bg-[#0F172A] text-white font-mono text-base sm:text-lg font-black tracking-wide shadow-xs shrink-0">
              {plant.plant_id}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-serif font-normal text-[#0F172A] m-0 truncate">
                  Arecanut Dossier
                </h2>
                <span className={`px-2 py-0.2 rounded-full text-[10px] sm:text-xs font-mono font-semibold border shrink-0 ${getStatusBadge(plant.status)}`}>
                  {plant.status.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-xs text-[#64748B] font-mono mt-0.5">
                <span className="flex items-center gap-1 text-[#334155] font-semibold">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  R{plant.row} • P{plant.position}
                </span>
                <span className="text-slate-300">•</span>
                <span className="truncate">{plant.latitude}°N, {plant.longitude}°E</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white hover:bg-slate-100 text-[#64748B] hover:text-[#0F172A] border border-[#E2ECE8] transition-colors cursor-pointer shadow-2xs shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (Touch Scrollable) */}
        <div className="flex items-center gap-1 px-3 sm:px-6 border-b border-[#EAEFEA] bg-white overflow-x-auto no-scrollbar font-mono text-xs shrink-0">
          {[
            { id: 'overview', label: 'Farmer AI Decision' },
            { id: 'soil', label: 'Soil Measurements' },
            { id: 'camera', label: 'Camera Scans' },
            { id: 'water', label: 'Water Status' },
            { id: 'ai_disease', label: 'AI Disease' },
            { id: 'growth', label: 'Growth History' },
            { id: 'drone', label: 'Drone Canopy' },
            { id: 'history', label: 'Timeline Scans' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-4 py-2.5 sm:py-3 font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#0F172A] text-[#0F172A] font-bold'
                  : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-[#1E293B] flex-1">
          
          {/* TAB 1: OVERVIEW & FARMER AI DECISION */}
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Plain Farmer-Friendly Decision Card */}
              <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-[#F4F8F6] via-[#FAFBF9] to-[#EBF4F0] border border-[#D1E2D7] space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 border-b border-[#DEEAE2] pb-2 sm:pb-3">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
                  <h3 className="text-sm sm:text-base font-serif font-normal text-[#0F172A] m-0">
                    AI Farmer Decision Support
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  {/* What we found */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#EAEFEA] shadow-2xs">
                    <div className="text-[11px] sm:text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider mb-1.5 sm:mb-2">
                      What we found
                    </div>
                    <ul className="space-y-1.5 text-xs font-medium text-[#334155]">
                      {plant.aiFarmerDecision.findings.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-emerald-600">●</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* System Output */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#EAEFEA] shadow-2xs">
                    <div className="text-[11px] sm:text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider mb-1.5 sm:mb-2">
                      System Output
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">
                      {plant.aiFarmerDecision.systemOutput}
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-1.5 font-mono">
                      Health Score: {plant.status === 'Healthy' ? '94/100' : '58/100'}
                    </div>
                  </div>

                  {/* Suggested action */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FEF3C7]/60 border border-[#FDE68A] shadow-2xs">
                    <div className="text-[11px] sm:text-xs font-mono font-bold text-[#92400E] uppercase tracking-wider mb-1.5 sm:mb-2">
                      Suggested Action
                    </div>
                    <div className="text-xs font-semibold text-[#78350F] leading-relaxed">
                      {plant.aiFarmerDecision.suggestedAction}
                    </div>
                    <div className="mt-2">
                      <button
                        onClick={() => setActiveTab('water')}
                        className="text-[11px] font-mono text-[#92400E] hover:underline font-bold cursor-pointer"
                      >
                        Inspect irrigation recommendations →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Telemetry Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                <div className="p-3 sm:p-4 rounded-2xl bg-[#FAFBF9] border border-[#EAEFEA]">
                  <div className="text-[9px] sm:text-[10px] font-mono text-[#64748B] uppercase">Soil Moisture</div>
                  <div className="text-lg sm:text-xl font-bold text-[#0F172A] mt-0.5">
                    {plant.soil.moisture}%
                    <span className={`text-[11px] font-mono ml-1.5 ${plant.soil.moisture < 28 ? 'text-amber-700 font-bold' : 'text-emerald-700'}`}>
                      {plant.soil.statusLabel}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-[#FAFBF9] border border-[#EAEFEA]">
                  <div className="text-[9px] sm:text-[10px] font-mono text-[#64748B] uppercase">Soil pH & EC</div>
                  <div className="text-lg sm:text-xl font-bold text-[#0F172A] mt-0.5">
                    {plant.soil.ph} pH
                    <span className="text-[10px] font-mono text-[#64748B] ml-1">
                      {plant.soil.ec} mS
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-[#FAFBF9] border border-[#EAEFEA]">
                  <div className="text-[9px] sm:text-[10px] font-mono text-[#64748B] uppercase">Height</div>
                  <div className="text-lg sm:text-xl font-bold text-[#0F172A] mt-0.5">
                    {plant.growth.currentHeight}cm
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-2xl bg-[#FAFBF9] border border-[#EAEFEA]">
                  <div className="text-[9px] sm:text-[10px] font-mono text-[#64748B] uppercase">Leaf Health</div>
                  <div className="text-lg sm:text-xl font-bold text-[#0F172A] mt-0.5">
                    {plant.leafHealth.condition}
                  </div>
                </div>
              </div>

              {/* Latest Rover Image Preview */}
              <div className="p-4 sm:p-5 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA]">
                <div className="flex items-center justify-between mb-2 sm:mb-3 text-xs font-mono">
                  <span className="text-[#334155] font-bold uppercase text-[11px] sm:text-xs">Camera Capture (Latest)</span>
                  <button
                    onClick={() => setActiveTab('camera')}
                    className="text-emerald-700 hover:text-emerald-800 underline font-semibold cursor-pointer text-[11px] sm:text-xs"
                  >
                    View Angles & Comparison →
                  </button>
                </div>
                <div className="w-full aspect-[16/10] sm:aspect-[16/9] max-h-72 rounded-2xl overflow-hidden border border-[#E2ECE8] bg-white">
                  <img
                    src={plant.images.fullPlant}
                    alt={`Plant ${plant.plant_id}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SOIL MEASUREMENTS */}
          {activeTab === 'soil' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAFBF9] border border-[#EAEFEA]">
                <h3 className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider mb-0.5">
                  PHYSICAL SOIL PROBE TELEMETRY — {plant.plant_id}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#64748B] font-mono">
                  Robotic depth probe measurements (15-20cm sub-surface root zone).
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Moisture */}
                <div className={`p-4 sm:p-5 rounded-3xl border ${plant.soil.moisture < 28 ? 'bg-[#FEF3C7]/50 border-[#FDE68A]' : 'bg-[#FAFBF9] border-[#EAEFEA]'}`}>
                  <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                    <span>MOISTURE</span>
                    <Droplets className={`w-3.5 h-3.5 ${plant.soil.moisture < 28 ? 'text-amber-700' : 'text-emerald-600'}`} />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1.5">
                    {plant.soil.moisture}%
                  </div>
                  <div className={`text-[11px] font-mono font-bold mt-0.5 ${plant.soil.moisture < 28 ? 'text-amber-800' : 'text-emerald-700'}`}>
                    {plant.soil.statusLabel}
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden mt-2.5 border border-[#D1E2D7]">
                    <div
                      className={`h-full rounded-full ${plant.soil.moisture < 28 ? 'bg-amber-500' : 'bg-emerald-600'}`}
                      style={{ width: `${Math.min(100, plant.soil.moisture * 1.6)}%` }}
                    />
                  </div>
                </div>

                {/* Temperature */}
                <div className="p-4 sm:p-5 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                    <span>TEMPERATURE</span>
                    <Thermometer className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1.5">
                    {plant.soil.temperature}°C
                  </div>
                  <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
                    Optimal (24-28°C)
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden mt-2.5 border border-[#D1E2D7]">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${(plant.soil.temperature / 40) * 100}%` }}
                    />
                  </div>
                </div>

                {/* pH */}
                <div className="p-4 sm:p-5 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                    <span>SOIL pH</span>
                    <Activity className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1.5">
                    {plant.soil.ph}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
                    Normal (5.8-6.8)
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden mt-2.5 border border-[#D1E2D7]">
                    <div
                      className="h-full bg-purple-600 rounded-full"
                      style={{ width: `${(plant.soil.ph / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* EC */}
                <div className="p-4 sm:p-5 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA]">
                  <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                    <span>EC (mS/cm)</span>
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1.5">
                    {plant.soil.ec}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-700 font-semibold mt-0.5">
                    Normal (0.8-1.5)
                  </div>
                  <div className="w-full bg-white h-2 rounded-full overflow-hidden mt-2.5 border border-[#D1E2D7]">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${(plant.soil.ec / 2.5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CAMERA SCANS */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-[#FAFBF9] border border-[#EAEFEA] font-mono text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'full', label: 'Full Plant' },
                    { id: 'leaf1', label: 'Frond 1' },
                    { id: 'leaf2', label: 'Frond 2' },
                    { id: 'leaf3', label: 'Frond 3' },
                  ].map((view) => (
                    <button
                      key={view.id}
                      onClick={() => setSelectedLeafView(view.id as any)}
                      className={`px-3 py-1 rounded-full cursor-pointer transition-colors shrink-0 ${
                        selectedLeafView === view.id
                          ? 'bg-[#0F172A] text-white font-bold'
                          : 'bg-white border border-[#D1E2D7] text-[#334155]'
                      }`}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCompareMode(!compareMode)}
                  className={`px-3.5 py-1.5 rounded-full font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors text-xs ${
                    compareMode
                      ? 'bg-[#D97706] text-white'
                      : 'bg-[#0F172A] text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{compareMode ? 'Exit Slider' : 'Compare Baseline'}</span>
                </button>
              </div>

              {compareMode ? (
                <div className="space-y-3">
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-96 rounded-2xl overflow-hidden border border-[#DEEAE2] bg-[#F4F7F5] select-none">
                    <img
                      src={plant.images.previousScan}
                      alt="Previous"
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-black/70 text-white font-mono text-[9px]">
                      BASELINE
                    </div>

                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${compareSlider}%` }}
                    >
                      <img
                        src={getActiveImage()}
                        alt="Latest"
                        className="absolute inset-0 w-full h-full object-contain"
                        style={{ width: '100%', maxWidth: 'none' }}
                      />
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-200 font-mono text-[9px]">
                        LATEST
                      </div>
                    </div>

                    <div
                      className="absolute top-0 bottom-0 w-1 bg-[#0F172A]"
                      style={{ left: `${compareSlider}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2 px-2">
                    <span className="text-[11px] font-mono text-[#64748B]">Latest</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={compareSlider}
                      onChange={(e) => setCompareSlider(Number(e.target.value))}
                      className="w-full accent-[#0F172A] cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-[#64748B]">Previous</span>
                  </div>
                </div>
              ) : (
                <div className="w-full aspect-[16/10] sm:aspect-[16/9] max-h-96 rounded-2xl overflow-hidden border border-[#DEEAE2] bg-[#F4F7F5]">
                  <img
                    src={getActiveImage()}
                    alt={`Plant ${plant.plant_id}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WATER STATUS */}
          {activeTab === 'water' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="p-4 sm:p-6 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA] space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EAEFEA] pb-3">
                  <div>
                    <span className="text-xs font-mono text-[#64748B]">Diagnosis:</span>
                    <div className="text-lg sm:text-xl font-bold text-[#0F172A]">{plant.plant_id}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border font-mono text-xs font-bold ${
                    plant.water.status === 'Water stress suspected'
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}>
                    {plant.water.status === 'Water stress suspected' ? '💧 Water Stress Detected' : '✅ Moisture Adequate'}
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 font-mono text-xs">
                  <div className="p-3 rounded-2xl bg-white border border-[#EAEFEA]">
                    <div className="text-[#64748B]">Moisture</div>
                    <div className="text-[#0F172A] font-bold mt-0.5">{plant.soil.moisture}%</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#EAEFEA]">
                    <div className="text-[#64748B]">Crop</div>
                    <div className="text-[#0F172A] font-bold mt-0.5">Arecanut</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#EAEFEA]">
                    <div className="text-[#64748B]">Growth Stage</div>
                    <div className="text-[#0F172A] font-bold mt-0.5">Vegetative</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#EAEFEA]">
                    <div className="text-[#64748B]">Weather</div>
                    <div className="text-[#0F172A] font-bold mt-0.5">29°C Ambient</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EAEFEA] space-y-1.5">
                  <div className="text-xs font-mono font-bold text-[#0F172A] uppercase">Recommendation</div>
                  <div className="text-xs sm:text-sm font-semibold text-[#334155]">
                    {plant.water.recommendation}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI DISEASE */}
          {activeTab === 'ai_disease' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="p-4 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA]">
                  <div className="text-[10px] font-mono text-[#64748B] uppercase font-bold">1. Camera Capture</div>
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E2ECE8] mt-2 bg-white p-2">
                    <img
                      src={plant.images.leafScan1}
                      alt="Leaf"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA] space-y-2.5 font-mono text-xs">
                  <div className="text-[10px] text-[#64748B] uppercase font-bold">2. Feature Extraction</div>
                  <div className="p-3 rounded-2xl bg-white border border-[#EAEFEA]">
                    <div className="text-[#64748B]">Condition</div>
                    <div className="text-[#0F172A] font-bold">{plant.leafHealth.condition}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#EAEFEA]">
                    <div className="text-[#64748B]">Issue</div>
                    <div className="text-[#0F172A] font-bold">{plant.leafHealth.diseaseIssue || 'No abnormal patterns'}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-white border border-[#EAEFEA]">
                    <div className="text-[#64748B]">Confidence</div>
                    <div className="text-emerald-700 font-bold">{plant.leafHealth.aiConfidence}%</div>
                  </div>
                </div>

                <div className="p-4 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA] space-y-2.5 font-mono text-xs">
                  <div className="text-[10px] text-[#64748B] uppercase font-bold">3. Suggested Action</div>
                  <div className={`p-3.5 rounded-2xl border ${
                    plant.leafHealth.diseaseIssue ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <div className="font-bold mb-1">{plant.leafHealth.diseaseIssue ? '⚠️ Symptom Flagged' : '✅ Frond Normal'}</div>
                    <div>{plant.leafHealth.action}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GROWTH */}
          {activeTab === 'growth' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA]">
                  <h4 className="text-xs font-mono font-bold text-[#0F172A] uppercase mb-2 sm:mb-3">
                    Height Log — {plant.plant_id}
                  </h4>
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-[#EAEFEA] text-[#64748B]">
                        <th className="pb-2">Timeline</th>
                        <th className="pb-2">Height</th>
                        <th className="pb-2">Growth</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EAEFEA]/60">
                      {plant.growth.history.map((h, i) => (
                        <tr key={i}>
                          <td className="py-2 text-[#0F172A] font-semibold">{h.week}</td>
                          <td className="py-2 text-[#0F172A] font-bold">{h.height} cm</td>
                          <td className="py-2">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              h.growth === '—' ? 'text-slate-400' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {h.growth}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 sm:p-5 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA]">
                  <h4 className="text-xs font-mono font-bold text-[#0F172A] uppercase mb-2">
                    Trend vs Row Average
                  </h4>
                  <div className="h-40 w-full bg-white rounded-2xl p-2 border border-[#EAEFEA]">
                    <svg viewBox="0 0 300 120" className="w-full h-full">
                      <line x1="20" y1="10" x2="290" y2="10" stroke="#E2E8F0" strokeDasharray="3" />
                      <line x1="20" y1="50" x2="290" y2="50" stroke="#E2E8F0" strokeDasharray="3" />
                      <line x1="20" y1="90" x2="290" y2="90" stroke="#E2E8F0" strokeDasharray="3" />

                      <path d="M 30 75 Q 110 55 190 35 L 270 20" fill="none" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 3" />
                      <path
                        d={`M 30 ${120 - plant.growth.history[0].height * 1.5} L 110 ${120 - plant.growth.history[1].height * 1.5} L 190 ${120 - plant.growth.history[2].height * 1.5} L 270 ${120 - plant.growth.history[3].height * 1.5}`}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="3"
                      />
                      {[
                        { x: 30, y: 120 - plant.growth.history[0].height * 1.5, val: plant.growth.history[0].height },
                        { x: 110, y: 120 - plant.growth.history[1].height * 1.5, val: plant.growth.history[1].height },
                        { x: 190, y: 120 - plant.growth.history[2].height * 1.5, val: plant.growth.history[2].height },
                        { x: 270, y: 120 - plant.growth.history[3].height * 1.5, val: plant.growth.history[3].height },
                      ].map((pt, idx) => (
                        <circle key={idx} cx={pt.x} cy={pt.y} r="3.5" fill="#059669" stroke="#fff" strokeWidth="1.5" />
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: DRONE */}
          {activeTab === 'drone' && (
            <div className="space-y-4">
              {plant.drone.performed ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA]">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E2ECE8] bg-white p-2">
                      <img src={plant.drone.aerialImage} alt="Drone" className="w-full h-full object-cover rounded-xl" />
                    </div>
                  </div>
                  <div className="p-4 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA] font-mono text-xs space-y-2">
                    <div className="font-bold text-[#0F172A] border-b pb-1">Drone Scan: {plant.drone.droneId}</div>
                    <div>Altitude: {plant.drone.altitudeMeters}m AGL</div>
                    <div>Status: {plant.drone.status}</div>
                    <div className="p-3 bg-[#EBF4F0] rounded-2xl text-[#065F46] font-semibold mt-2">{plant.drone.upperCanopyObservation}</div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA] text-center font-mono text-xs space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <div className="font-bold text-sm text-[#0F172A]">No Aerial Drone Flight Required</div>
                  <div className="text-[#64748B]">Plant is within optimal FOV of ground rover stereo cameras.</div>
                  {onSelectPlantId && (
                    <button
                      onClick={() => onSelectPlantId('P120')}
                      className="mt-2 px-4 py-1.5 rounded-full bg-[#0F172A] text-white cursor-pointer"
                    >
                      Jump to P120 (Tall Canopy Demo)
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 8: TIMELINE */}
          {activeTab === 'history' && (
            <div className="space-y-3 font-mono text-xs">
              {filteredHistory.map((scan, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-white border border-[#EAEFEA] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                    <span className="font-bold text-[#0F172A]">{scan.date}</span>
                    <span className="text-[#64748B] hidden sm:inline">• {scan.note}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{scan.moisture}%</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(scan.status)}`}>
                      {scan.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Dossier Footer */}
        <div className="p-3.5 sm:p-4 bg-[#FAFBF9] border-t border-[#EAEFEA] flex items-center justify-between text-xs font-mono text-[#64748B] shrink-0">
          <div>
            Record: <strong className="text-[#0F172A]">{plant.plant_id}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold cursor-pointer shadow-2xs"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
