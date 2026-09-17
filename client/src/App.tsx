// client/src/App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Plant, RoverTelemetry, FarmInfo, AlertItem, FarmSummary } from './types';
import { Header } from './components/Header';
import { RoverMissionPanel } from './components/RoverMissionPanel';
import { FieldActivityFeed } from './components/FieldActivityFeed';
import { PlantTable } from './components/PlantTable';
import { FarmMap } from './components/FarmMap';
import { PlantDetailModal } from './components/PlantDetailModal';
import { AlertsPanel } from './components/AlertsPanel';
import { FarmSummaryReport } from './components/FarmSummaryReport';
import { HardwareApiConsole } from './components/HardwareApiConsole';
import { 
  Layers, 
  Trees, 
  Grid3X3, 
  AlertTriangle, 
  FileSpreadsheet, 
  Terminal
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [plants, setPlants] = useState<Plant[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [summary, setSummary] = useState<FarmSummary | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const [farm, setFarm] = useState<FarmInfo>({
    name: 'Demo Farm',
    area: '1 Acre',
    crop: 'Arecanut',
    totalPlants: 150,
    plantsScanned: 150,
    lastScan: 'Today, 10:42 AM',
    mode: 'DEMO DATA',
  });

  const [rover, setRover] = useState<RoverTelemetry>({
    status: 'Online',
    battery: 88,
    voltage: 25.2,
    speedMps: 0.4,
    distanceTraveledMeters: 485,
    currentPlantId: 'P082',
    currentRow: 8,
    plantsScannedCount: 82,
    totalPlants: 150,
    probeState: 'Retracted',
    signalDbm: -62,
    gpsFix: 'RTK Fixed (Centimeter accuracy)',
    currentLat: '12.971978',
    currentLng: '77.594636',
    activeMission: 'Monitor all plants',
    mode: 'SIMULATION',
  });

  const fetchData = useCallback(async () => {
    try {
      const [plantsRes, statusRes, alertsRes, summaryRes] = await Promise.all([
        fetch('/api/plants').then((r) => r.json()),
        fetch('/api/rover/status').then((r) => r.json()),
        fetch('/api/alerts').then((r) => r.json()),
        fetch('/api/summary').then((r) => r.json()),
      ]);

      if (plantsRes.plants) setPlants(plantsRes.plants);
      if (statusRes.rover) setRover(statusRes.rover);
      if (statusRes.farm) setFarm(statusRes.farm);
      if (statusRes.isSimulationRunning !== undefined) setIsSimulating(statusRes.isSimulationRunning);
      if (alertsRes.alerts) setAlerts(alertsRes.alerts);
      if (summaryRes) setSummary(summaryRes);
    } catch (e) {
      console.warn('[Agri Rover] API fetch:', e);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const sse = new EventSource('/api/stream');

    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ROVER_UPDATE' && data.rover) {
          setRover(data.rover);
          if (data.rover.status === 'Scanning' || data.rover.status === 'Moving' || data.rover.status === 'Measuring') {
            setIsSimulating(true);
          } else if (data.rover.status === 'Mission Complete' || data.rover.status === 'Idle' || data.rover.status === 'Online') {
            setIsSimulating(false);
          }
        } else if (data.type === 'PLANT_UPDATED' && data.plant) {
          setPlants((prev) =>
            prev.map((p) => (p.plant_id === data.plant.plant_id ? data.plant : p))
          );
          setSelectedPlant((curr) =>
            curr && curr.plant_id === data.plant.plant_id ? data.plant : curr
          );
        }
      } catch (err) {
        console.error('Failed to parse SSE payload', err);
      }
    };

    return () => {
      sse.close();
    };
  }, [fetchData]);

  const handleStartMission = async (speed: number) => {
    setIsSimulating(true);
    await fetch('/api/mission/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speed }),
    });
  };

  const handlePauseMission = async () => {
    setIsSimulating(false);
    await fetch('/api/mission/pause', { method: 'POST' });
  };

  const handleStepMission = async () => {
    await fetch('/api/mission/step', { method: 'POST' });
    fetchData();
  };

  const handleFastForwardMission = async () => {
    setIsSimulating(false);
    await fetch('/api/mission/fast-forward', { method: 'POST' });
    fetchData();
  };

  const handleResetMission = async () => {
    setIsSimulating(false);
    await fetch('/api/mission/reset', { method: 'POST' });
    fetchData();
  };

  const handleSelectPlant = (plant: Plant) => {
    setSelectedPlant(plant);
  };

  const handleSelectPlantId = (plantId: string) => {
    const found = plants.find((p) => p.plant_id.toUpperCase() === plantId.toUpperCase());
    if (found) {
      setSelectedPlant(found);
    }
  };

  const bottomNavItems = [
    { id: 'dashboard', label: 'Overview', icon: Layers },
    { id: 'plants', label: 'Plants', icon: Trees },
    { id: 'grid', label: '1-Acre Grid', icon: Grid3X3 },
    { id: 'alerts', label: 'Alerts', badge: alerts.length, icon: AlertTriangle },
    { id: 'summary', label: 'Summary', icon: FileSpreadsheet },
    { id: 'hardware-api', label: 'API', icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1E293B] flex flex-col font-sans selection:bg-[#D1E7DD] selection:text-[#065F46] pb-16 md:pb-0">
      {/* Header */}
      <Header
        farm={farm}
        rover={rover}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadAlertsCount={alerts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* VIEW 1: FIELD OVERVIEW & MISSION */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 sm:space-y-10">
            {/* Hero Section Banner */}
            <RoverMissionPanel
              rover={rover}
              onStartMission={handleStartMission}
              onPauseMission={handlePauseMission}
              onStepMission={handleStepMission}
              onFastForwardMission={handleFastForwardMission}
              onResetMission={handleResetMission}
              isSimulating={isSimulating}
              onInspectCurrentPlant={handleSelectPlantId}
            />

            {/* Dual Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column (4 cols on lg, full on mobile) */}
              <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
                <FieldActivityFeed
                  alerts={alerts}
                  plants={plants}
                  onSelectPlantId={handleSelectPlantId}
                  onViewAllAlerts={() => setActiveTab('alerts')}
                />
              </div>

              {/* Right Column (8 cols on lg, full on mobile) */}
              <div className="lg:col-span-8 order-1 lg:order-2">
                <PlantTable plants={plants} onSelectPlant={handleSelectPlant} />
              </div>
            </div>

            {/* 1-Acre Farm Grid Matrix */}
            <FarmMap
              plants={plants}
              rover={rover}
              onSelectPlant={handleSelectPlant}
              selectedPlantId={selectedPlant?.plant_id}
            />
          </div>
        )}

        {/* VIEW 2: PLANT COLLECTION (P001 → P150) */}
        {activeTab === 'plants' && (
          <div className="space-y-6">
            <PlantTable plants={plants} onSelectPlant={handleSelectPlant} />
          </div>
        )}

        {/* VIEW 3: 1-ACRE FARM GRID */}
        {activeTab === 'grid' && (
          <div className="space-y-6">
            <FarmMap
              plants={plants}
              rover={rover}
              onSelectPlant={handleSelectPlant}
              selectedPlantId={selectedPlant?.plant_id}
            />
          </div>
        )}

        {/* VIEW 4: FIELD ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <AlertsPanel
              alerts={alerts}
              plants={plants}
              onSelectPlantId={handleSelectPlantId}
            />
          </div>
        )}

        {/* VIEW 5: FARMER DECISION SUMMARY */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <FarmSummaryReport
              summary={summary}
              plants={plants}
              onSelectPlantId={handleSelectPlantId}
            />
          </div>
        )}

        {/* VIEW 6: HARDWARE REST API & ESP32 */}
        {activeTab === 'hardware-api' && (
          <div className="space-y-6">
            <HardwareApiConsole />
          </div>
        )}
      </main>

      {/* Deep Plant Dossier Modal */}
      <PlantDetailModal
        plant={selectedPlant}
        onClose={() => setSelectedPlant(null)}
        onSelectPlantId={handleSelectPlantId}
      />

      {/* Mobile Sticky Bottom App Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-[#EAEFEA] py-1 px-2 flex items-center justify-around shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all cursor-pointer relative ${
                isActive ? 'text-[#0F172A]' : 'text-[#64748B]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[8px] font-mono bg-rose-500 text-white font-bold leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-mono mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Desktop Footer */}
      <footer className="border-t border-[#EAEFEA] bg-white py-6 mt-12 text-xs font-mono text-[#64748B] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span className="text-[#0F172A] font-bold">Agri Rover</span>
            <span className="text-slate-300">•</span>
            <span>Autonomous Agricultural Decision Interface</span>
          </div>
          <div>150 Palms Surveyed • ESP32/RPi Hardware Ready</div>
        </div>
      </footer>
    </div>
  );
}

export default App;
