// client/src/components/Header.tsx
import React from 'react';
import { RoverTelemetry, FarmInfo } from '../types';
import { 
  Battery, 
  Sparkles,
  Layers,
  Trees,
  Grid3X3,
  AlertTriangle,
  FileSpreadsheet,
  Terminal,
  Activity
} from 'lucide-react';

interface HeaderProps {
  farm: FarmInfo;
  rover: RoverTelemetry;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadAlertsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  farm,
  rover,
  activeTab,
  setActiveTab,
  unreadAlertsCount,
}) => {
  const getRoverStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scanning':
      case 'moving':
      case 'measuring':
      case 'ai inferencing':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'online':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'mission complete':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Field Overview', icon: Layers },
    { id: 'plants', label: 'Plant Collection', icon: Trees },
    { id: 'grid', label: '1-Acre Grid', icon: Grid3X3 },
    { id: 'alerts', label: 'Field Alerts', badge: unreadAlertsCount, icon: AlertTriangle },
    { id: 'summary', label: 'Farmer Decision', icon: FileSpreadsheet },
    { id: 'hardware-api', label: 'Hardware API', icon: Terminal },
  ];

  return (
    <header className="bg-white border-b border-[#EAEFEA] sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      {/* Top Meta Bar */}
      <div className="border-b border-[#F0F4F1] bg-[#FAFBF9] px-3 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-xs text-[#64748B] overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 whitespace-nowrap min-w-0">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#E8F3EE] text-[#065F46] border border-[#D1E7DD] shrink-0">
            DEMO DATA
          </span>
          <span className="text-[#334155] text-[11px] sm:text-xs truncate">
            Arecanut Block 01 &nbsp;›&nbsp; <strong className="text-[#0F172A]">1-Acre Autonomous Survey</strong>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-[11px] font-mono shrink-0 ml-2">
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ESP32/RPi Bridge Ready (:3001)
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">
            Last Scan: <strong className="text-slate-700">{farm.lastScan}</strong>
          </span>
        </div>
      </div>

      {/* Main Minimalist Header Row with Centered Logo */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
        {/* Left Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#475569]">
          {navItems.slice(0, 3).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`transition-colors cursor-pointer py-1 relative ${
                activeTab === item.id
                  ? 'text-[#0F172A] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0F172A]'
                  : 'hover:text-[#0F172A]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Center Minimalist Brand Emblem */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="14" x="3" y="5" rx="2"/>
              <circle cx="12" cy="12" r="3"/>
              <path d="M7 5V3"/>
              <path d="M17 5V3"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] sm:text-xs font-mono tracking-widest text-[#0F172A] font-extrabold uppercase">
              AGRI ROVER
            </span>
            <span className="text-[9px] font-mono text-[#64748B] hidden sm:inline">
              Arecanut v2.4
            </span>
          </div>
        </div>

        {/* Right Navigation & Telemetry Chips */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-[#475569] mr-2">
            {navItems.slice(3).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`transition-colors cursor-pointer py-1 relative flex items-center gap-1.5 ${
                  activeTab === item.id
                    ? 'text-[#0F172A] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0F172A]'
                    : 'hover:text-[#0F172A]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-rose-100 text-rose-700 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Rover Status Badge */}
          <div className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border text-[10px] sm:text-xs font-mono font-semibold flex items-center gap-1 sm:gap-1.5 ${getRoverStatusBadge(rover.status)}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
            <span>{rover.status.toUpperCase()}</span>
          </div>

          {/* Battery pill */}
          <div className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#F1F5F3] text-[#334155] border border-[#E2E8F0] text-[10px] sm:text-xs font-mono flex items-center gap-1 sm:gap-1.5">
            <Battery className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
            <span>{rover.battery}%</span>
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Pill Navigation Bar */}
      <div className="md:hidden flex items-center gap-1.5 px-3 py-2 border-t border-[#F0F4F1] overflow-x-auto no-scrollbar text-xs font-medium">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 text-xs font-mono cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-[#0F172A] text-white font-bold shadow-xs'
                  : 'text-[#475569] hover:text-[#0F172A] bg-[#F1F5F3] border border-[#E2ECE8]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                  isActive ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
