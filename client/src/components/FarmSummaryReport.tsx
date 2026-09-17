// client/src/components/FarmSummaryReport.tsx
import React from 'react';
import { FarmSummary, Plant } from '../types';
import { 
  Droplets, 
  AlertOctagon, 
  TrendingDown, 
  CheckCircle, 
  Printer, 
  ChevronRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface FarmSummaryReportProps {
  summary: FarmSummary | null;
  plants: Plant[];
  onSelectPlantId: (plantId: string) => void;
}

export const FarmSummaryReport: React.FC<FarmSummaryReportProps> = ({
  summary,
  onSelectPlantId,
}) => {
  if (!summary) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEFEA] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-8">
      
      {/* Header & Print Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#F0F4F1]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <h2 className="text-3xl font-serif font-normal text-[#0F172A] m-0">
              Farmer Decision Executive Summary
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Direct actionable intelligence synthesized from Agri Rover's full 1-acre scan.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-mono font-medium flex items-center gap-2 shadow-xs cursor-pointer transition-colors self-start sm:self-center"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Export Field Report</span>
        </button>
      </div>

      {/* Aggregate Scorecards (Section 16) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono">
        <div className="p-5 rounded-3xl bg-[#FAFBF9] border border-[#EAEFEA]">
          <div className="text-[10px] uppercase text-[#64748B] font-bold">Total Palms</div>
          <div className="text-3xl font-black text-[#0F172A] mt-1">150</div>
          <div className="text-[11px] text-[#64748B] mt-0.5">1 Acre Block</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#EBF4F0] border border-[#D1E2D7]">
          <div className="text-[10px] uppercase text-[#065F46] font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Normal / Optimal
          </div>
          <div className="text-3xl font-black text-[#065F46] mt-1">137</div>
          <div className="text-[11px] text-emerald-800 mt-0.5">91.3% healthy</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#FEF3C7] border border-[#FDE68A]">
          <div className="text-[10px] uppercase text-[#92400E] font-bold flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            Water-Stress Alerts
          </div>
          <div className="text-3xl font-black text-[#92400E] mt-1">8</div>
          <div className="text-[11px] text-[#78350F] mt-0.5">Moisture &lt; 28%</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#FFE4E6] border border-[#FECDD3]">
          <div className="text-[10px] uppercase text-[#9F1239] font-bold flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" />
            Possible Disease
          </div>
          <div className="text-3xl font-black text-[#9F1239] mt-1">3</div>
          <div className="text-[11px] text-[#881337] mt-0.5">Visual symptoms</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#FFEDD5] border border-[#FED7AA]">
          <div className="text-[10px] uppercase text-[#9A3412] font-bold flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Slow-Growth Alerts
          </div>
          <div className="text-3xl font-black text-[#9A3412] mt-1">2</div>
          <div className="text-[11px] text-[#7C2D12] mt-0.5">Sub-average delta</div>
        </div>
      </div>

      {/* Flagged Plants Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#F0F4F1]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h3 className="text-xl font-serif font-normal text-[#0F172A] m-0">
              Plants Requiring Farmer Attention ({summary.plantsRequiringAttention.length} Palms)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#64748B]">
            Click any card to inspect diagnostic causes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.plantsRequiringAttention.map((plant) => (
            <div
              key={plant.plant_id}
              onClick={() => onSelectPlantId(plant.plant_id)}
              className="p-5 rounded-3xl bg-[#FAFBF9] hover:bg-[#F2F7F4] border border-[#EAEFEA] hover:border-[#D1E2D7] transition-all cursor-pointer flex flex-col justify-between group vibe-card"
            >
              <div>
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-extrabold text-[#0F172A] text-base group-hover:text-emerald-700 transition-colors">
                    {plant.plant_id}
                  </span>
                  <span className="text-[#64748B]">
                    Row {plant.row}, Pos {plant.position}
                  </span>
                </div>

                <div className="mt-2.5 text-xs font-mono text-[#1E293B] font-bold flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    plant.status === 'Possible Disease' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                  <span>{plant.reason}</span>
                </div>

                <div className="mt-1.5 text-xs font-mono text-[#64748B]">
                  Action: <span className="text-[#334155] font-medium">{plant.action}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAEFEA] flex items-center justify-between font-mono text-xs">
                <span className="text-[#64748B]">Moisture: {plant.soilMoisture}%</span>
                <span className="text-emerald-700 group-hover:translate-x-1 transition-transform flex items-center gap-0.5 font-bold">
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
