// client/src/types.ts

export interface SoilData {
  condition: string;
  moisture: number;
  temperature: number;
  ph: number;
  ec: number;
  probeStatus: string;
  statusLabel: string;
}

export interface GrowthRecord {
  week: string;
  height: number;
  growth: string;
}

export interface GrowthData {
  condition: string;
  currentHeight: number;
  nearbyAverageHeight: number;
  history: GrowthRecord[];
}

export interface LeafHealthData {
  condition: string;
  healthStatus: string;
  diseaseIssue: string | null;
  aiConfidence: number;
  action: string;
  wordingNote: string;
}

export interface WaterData {
  status: string;
  requirement: string;
  recommendation: string;
}

export interface AiFarmerDecision {
  findings: string[];
  systemOutput: string;
  suggestedAction: string;
}

export interface PlantImages {
  fullPlant: string;
  leafScan1: string;
  leafScan2: string;
  leafScan3: string;
  previousScan: string;
  timestamp: string;
}

export interface DroneInspection {
  performed: boolean;
  droneId?: string;
  altitudeMeters?: number;
  timestamp?: string;
  location?: string;
  status?: string;
  groundCameraStatus: string;
  upperCanopyObservation?: string;
  aerialImage?: string;
}

export interface HistoryScan {
  date: string;
  moisture: number;
  status: string;
  note: string;
}

export interface Plant {
  plant_id: string;
  farm_id: string;
  row: number;
  position: number;
  latitude: string;
  longitude: string;
  crop: string;
  soil: SoilData;
  growth: GrowthData;
  leafHealth: LeafHealthData;
  water: WaterData;
  status: 'Healthy' | 'Water Stress' | 'Possible Disease' | 'Slow Growth' | 'Needs Inspection';
  aiFarmerDecision: AiFarmerDecision;
  images: PlantImages;
  drone: DroneInspection;
  history: HistoryScan[];
}

export interface RoverTelemetry {
  status: string;
  battery: number;
  voltage: number;
  speedMps: number;
  distanceTraveledMeters: number;
  currentPlantId: string;
  currentRow: number;
  plantsScannedCount: number;
  totalPlants: number;
  probeState: 'Retracted' | 'Deploying' | 'Measuring' | 'Retracting' | 'Measurement complete';
  signalDbm: number;
  gpsFix: string;
  currentLat: string;
  currentLng: string;
  activeMission: string;
  mode: string;
}

export interface FarmInfo {
  name: string;
  area: string;
  crop: string;
  totalPlants: number;
  plantsScanned: number;
  lastScan: string;
  mode: string;
}

export interface AlertItem {
  id: string;
  plantId: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  message: string;
  time: string;
}

export interface FarmSummary {
  farm: FarmInfo;
  totalMonitored: number;
  normalCount: number;
  waterStressCount: number;
  diseaseCount: number;
  slowGrowthCount: number;
  requiringAttentionCount: number;
  plantsRequiringAttention: Array<{
    plant_id: string;
    row: number;
    position: number;
    status: string;
    action: string;
    soilMoisture: number;
    reason: string;
  }>;
}
