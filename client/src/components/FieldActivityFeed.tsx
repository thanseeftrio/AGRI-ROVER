// client/src/components/FieldActivityFeed.tsx
import React from 'react';
import { AlertItem, Plant } from '../types';
import { 
  Camera, 
  Droplets, 
  TrendingDown, 
  AlertOctagon, 
  Plane, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

interface FieldActivityFeedProps {
  alerts: AlertItem[];
  plants: Plant[];
  onSelectPlantId: (plantId: string) => void;
  onViewAllAlerts: () => void;
}

export const FieldActivityFeed: React.FC<FieldActivityFeedProps> = ({
  alerts,
  plants,
  onSelectPlantId,
  onViewAllAlerts,
}) => {
  const getSubsystemAvatar = (type: string) => {
    if (type.includes('Disease')) {
      return {
        bg: 'bg-rose-100 text-rose-700',
        name: 'AI Camera Vision Model',
        role: 'Autonomous Leaf Scan',
        icon: Camera,
      };
    }
    if (type.includes('Water')) {
      return {
        bg: 'bg-amber-100 text-amber-800',
        name: 'Depth Soil Probe Sensor',
        role: 'Root-Zone Telemetry',
        icon: Droplets,
      };
    }
    if (type.includes('Growth')) {
      return {
        bg: 'bg-orange-100 text-orange-800',
        name: 'Visual Odometry System',
        role: 'Canopy Elongation Log',
        icon: TrendingDown,
      };
    }
    return {
      bg: 'bg-emerald-100 text-emerald-800',
      name: 'Rover RTK Sensor Array',
      role: 'Routine Block Inspection',
      icon: Sparkles,
    };
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#EAEFEA] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] space-y-6">
      {/* Header matching "Share your experience" block in template */}
      <div className="space-y-2 pb-4 border-b border-[#F0F4F1]">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-normal text-[#0F172A] m-0">
            Rover Field Ingest Log
          </h2>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#EBF4F0] text-[#065F46]">
            {alerts.length} Incidents
          </span>
        </div>
        <p className="text-xs text-[#64748B] leading-relaxed">
          Real-time stream of sensor events, optical anomaly detections, and physical probe readouts logged during autonomous navigation.
        </p>
        <button
          onClick={onViewAllAlerts}
          className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-mono font-semibold tracking-wider uppercase transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>View All Priority Alerts ({alerts.length})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Itemized Feed Entries (Styled like the review cards in the reference image) */}
      <div className="space-y-4">
        {alerts.slice(0, 4).map((alert) => {
          const avatar = getSubsystemAvatar(alert.type);
          const Icon = avatar.icon;
          const plant = plants.find((p) => p.plant_id === alert.plantId);

          return (
            <div
              key={alert.id}
              onClick={() => onSelectPlantId(alert.plantId)}
              className="p-4 rounded-2xl bg-[#FAFBF9] hover:bg-[#F2F7F4] border border-[#EAEFEA] hover:border-[#D1E2D7] transition-all cursor-pointer space-y-2.5 group vibe-card"
            >
              {/* Top Avatar & Author meta */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${avatar.bg} flex items-center justify-center font-bold text-xs shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#0F172A] group-hover:text-emerald-700 transition-colors">
                      {avatar.name}
                    </div>
                    <div className="text-[10px] text-[#64748B] font-mono">
                      Target: <strong className="text-[#0F172A]">{alert.plantId}</strong> • {alert.time}
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  alert.severity === 'HIGH' 
                    ? 'bg-rose-100 text-rose-700' 
                    : alert.severity === 'MEDIUM' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {alert.severity}
                </span>
              </div>

              {/* Message quote */}
              <p className="text-xs text-[#334155] leading-relaxed font-normal">
                "{alert.message}"
              </p>

              {/* Quick bottom plant tags */}
              {plant && (
                <div className="pt-2 border-t border-[#EAEFEA] flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                  <span>Row {plant.row}, Pos {plant.position} • {plant.soil.moisture}% Moisture</span>
                  <span className="text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
