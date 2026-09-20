// client/src/components/AlertsPanel.tsx
import React, { useState } from 'react';
import { AlertItem, Plant } from '../types';
import { AlertOctagon, Droplets, TrendingDown, CheckCircle, ChevronRight } from 'lucide-react';

interface AlertsPanelProps {
  alerts: AlertItem[];
  plants: Plant[];
  onSelectPlantId: (plantId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  plants,
  onSelectPlantId,
}) => {
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter === 'ALL') return true;
    return a.severity === severityFilter;
  });

  const getAlertIcon = (type: string, severity: string) => {
    if (type.includes('Disease') || severity === 'HIGH') {
      return <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />;
    }
    if (type.includes('Water')) {
      return <Droplets className="w-5 h-5 text-amber-600 shrink-0" />;
    }
    if (type.includes('Growth')) {
      return <TrendingDown className="w-5 h-5 text-orange-600 shrink-0" />;
    }
    return <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEFEA] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0F4F1]">
        <div>
          <h2 className="text-3xl font-serif font-normal text-[#0F172A] m-0">
            Plant Alerts & Priority Incidents
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Real-time alerts generated autonomously from rover soil probes & AI computer vision scans.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                severityFilter === sev
                  ? 'bg-[#0F172A] text-white font-bold'
                  : 'bg-[#F1F5F3] text-[#475569] hover:text-[#0F172A]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const plant = plants.find((p) => p.plant_id === alert.plantId);
          return (
            <div
              key={alert.id}
              onClick={() => onSelectPlantId(alert.plantId)}
              className="p-4 rounded-2xl bg-[#FAFBF9] hover:bg-[#F2F7F4] border border-[#EAEFEA] hover:border-[#D1E2D7] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group vibe-card"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-[#EAEFEA] flex items-center justify-center shadow-xs">
                  {getAlertIcon(alert.type, alert.severity)}
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-[#0F172A] text-sm group-hover:text-emerald-700 transition-colors">
                      {alert.plantId}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[#334155] font-semibold text-xs">
                      {alert.message}
                    </span>
                  </div>
                  {plant && (
                    <div className="text-[11px] font-mono text-[#64748B] mt-0.5">
                      Row {plant.row}, Pos {plant.position} | Soil: {plant.soil.moisture}% ({plant.soil.statusLabel}) | Height: {plant.growth.currentHeight}cm
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs shrink-0 self-end sm:self-center">
                <span className="text-[#64748B]">{alert.time}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getSeverityBadge(alert.severity)}`}>
                  {alert.severity}
                </span>
                <div className="p-1 rounded-full bg-white group-hover:bg-[#0F172A] text-[#64748B] group-hover:text-white border border-[#E2ECE8] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
