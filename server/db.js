// server/db.js
// Complete plant database for Agri Rover (1 Acre, 150 Arecanut Plants: P001 -> P150)

// Base GPS anchor point for 1-acre demo field (approx 63m x 64m)
const BASE_LAT = 12.971600;
const BASE_LNG = 77.594600;

// Generates SVG data URIs for plant photos, leaf scans, drone views
function generatePlantImage(plantId, status, viewType = 'full') {
  let mainColor = '#10b981'; // healthy green
  let spotColor = '#059669';
  let badgeText = 'HEALTHY ARECANUT';
  let issueText = 'Normal frond vigor';

  if (status === 'Water Stress' || status === 'Water stress suspected') {
    mainColor = '#eab308'; // yellow/amber
    spotColor = '#ca8a04';
    badgeText = 'WATER STRESS';
    issueText = 'Slight wilting, moisture 24%';
  } else if (status === 'Possible Disease' || status === 'Disease symptoms detected') {
    mainColor = '#ef4444'; // red
    spotColor = '#7f1d1d';
    badgeText = 'SYMPTOM DETECTED';
    issueText = 'Necrotic leaf spots observed';
  } else if (status === 'Slow Growth') {
    mainColor = '#f97316'; // orange
    spotColor = '#c2410c';
    badgeText = 'SLOW GROWTH';
    issueText = 'Stunted frond emergence';
  }

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1e293b"/>
      </linearGradient>
      <linearGradient id="trunk" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#451a03"/>
        <stop offset="50%" stop-color="#78350f"/>
        <stop offset="100%" stop-color="#451a03"/>
      </linearGradient>
      <radialGradient id="leafGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${mainColor}"/>
        <stop offset="80%" stop-color="${spotColor}"/>
        <stop offset="100%" stop-color="#064e3b"/>
      </radialGradient>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      </pattern>
    </defs>

    <!-- Field background with grid -->
    <rect width="400" height="300" fill="url(#bg)"/>
    <rect width="400" height="300" fill="url(#grid)"/>

    <!-- Ground bed -->
    <ellipse cx="200" cy="270" rx="140" ry="25" fill="#292524" stroke="#44403c" stroke-width="2"/>

    <!-- Plant Trunk -->
    <path d="M 194 270 Q 197 180 198 120 L 202 120 Q 203 180 206 270 Z" fill="url(#trunk)"/>

    <!-- Fronds / Foliage -->
    <!-- Left Fronds -->
    <path d="M 198 130 Q 140 110 70 140 Q 130 90 198 125" fill="url(#leafGrad)" stroke="#166534" stroke-width="1.5"/>
    <path d="M 198 120 Q 130 70 80 80 Q 140 60 198 115" fill="url(#leafGrad)" stroke="#166534" stroke-width="1.5"/>
    <path d="M 199 110 Q 160 40 120 30 Q 170 40 199 105" fill="url(#leafGrad)" stroke="#166534" stroke-width="1.5"/>

    <!-- Right Fronds -->
    <path d="M 202 130 Q 260 110 330 140 Q 270 90 202 125" fill="url(#leafGrad)" stroke="#166534" stroke-width="1.5"/>
    <path d="M 202 120 Q 270 70 320 80 Q 260 60 202 115" fill="url(#leafGrad)" stroke="#166534" stroke-width="1.5"/>
    <path d="M 201 110 Q 240 40 280 30 Q 230 40 201 105" fill="url(#leafGrad)" stroke="#166534" stroke-width="1.5"/>

    <!-- Top Crown -->
    <path d="M 200 105 Q 195 20 200 15 Q 205 20 200 105" fill="url(#leafGrad)" stroke="#166534" stroke-width="1.5"/>

    ${status === 'Possible Disease' ? `
      <!-- AI Bounding Box on lesion -->
      <rect x="90" y="70" width="70" height="40" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" stroke-width="2" stroke-dasharray="4"/>
      <circle cx="125" cy="90" r="4" fill="#ef4444"/>
      <rect x="90" y="52" width="70" height="16" fill="#ef4444" rx="2"/>
      <text x="94" y="64" font-family="monospace" font-size="10" font-weight="bold" fill="#fff">LESION 87%</text>
    ` : ''}

    ${status === 'Water Stress' ? `
      <!-- AI Moisture stress box -->
      <rect x="230" y="80" width="80" height="50" fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" stroke-width="2" stroke-dasharray="4"/>
      <rect x="230" y="62" width="80" height="16" fill="#eab308" rx="2"/>
      <text x="234" y="74" font-family="monospace" font-size="9" font-weight="bold" fill="#000">WILTING DETECTED</text>
    ` : ''}

    <!-- Rover Camera Telemetry HUD -->
    <rect x="10" y="10" width="160" height="42" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.15)"/>
    <text x="18" y="24" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">ROVER CAM 01 [RGB]</text>
    <text x="18" y="38" font-family="monospace" font-size="10" fill="#94a3b8">ID: ${plantId} | VIEW: ${viewType.toUpperCase()}</text>

    <!-- AI Inference Status Badge -->
    <rect x="260" y="10" width="130" height="24" rx="4" fill="${mainColor}" opacity="0.9"/>
    <text x="325" y="26" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#ffffff">${badgeText}</text>

    <!-- Bottom Metadata Bar -->
    <rect x="10" y="258" width="380" height="32" rx="4" fill="rgba(15, 23, 42, 0.85)" stroke="rgba(255,255,255,0.1)"/>
    <circle cx="24" cy="274" r="5" fill="#22c55e"/>
    <text x="36" y="278" font-family="monospace" font-size="10" fill="#e2e8f0">${issueText}</text>
    <text x="380" y="278" text-anchor="end" font-family="monospace" font-size="9" fill="#64748b">10:42 AM IST</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Generates Drone Aerial Canopy SVG
function generateDroneImage(plantId, hasAbnormality = false) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%">
    <defs>
      <linearGradient id="aerialBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#064e3b"/>
        <stop offset="50%" stop-color="#022c22"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#aerialBg)"/>

    <!-- Grid / Orthomosaic lines -->
    <line x1="200" y1="0" x2="200" y2="300" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4"/>
    <line x1="0" y1="150" x2="400" y2="150" stroke="rgba(255,255,255,0.1)" stroke-dasharray="4"/>

    <!-- Canopy circles viewed from above (Drone top-down view) -->
    <circle cx="200" cy="150" r="75" fill="#047857" opacity="0.85" stroke="#10b981" stroke-width="2"/>
    <circle cx="200" cy="150" r="50" fill="#059669" opacity="0.9"/>
    <circle cx="200" cy="150" r="20" fill="#10b981"/>
    
    <!-- Surrounding tree crowns in grid -->
    <circle cx="80" cy="150" r="60" fill="#065f46" opacity="0.5"/>
    <circle cx="320" cy="150" r="60" fill="#065f46" opacity="0.5"/>
    <circle cx="200" cy="40" r="55" fill="#065f46" opacity="0.5"/>
    <circle cx="200" cy="260" r="55" fill="#065f46" opacity="0.5"/>

    <!-- Drone Crosshairs & Target Ring -->
    <circle cx="200" cy="150" r="90" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="8 4"/>
    <path d="M 200 60 L 200 80 M 200 220 L 200 240 M 110 150 L 130 150 M 270 150 L 290 150" stroke="#38bdf8" stroke-width="2"/>

    ${hasAbnormality ? `
      <!-- Upper Canopy thermal anomaly zone -->
      <circle cx="225" cy="135" r="25" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" stroke-width="2"/>
      <rect x="240" y="115" width="120" height="20" fill="#ef4444" rx="3"/>
      <text x="245" y="129" font-family="monospace" font-size="9" font-weight="bold" fill="#fff">CROWN ANOMALY</text>
    ` : ''}

    <!-- Drone Telemetry Overlay -->
    <rect x="15" y="15" width="210" height="50" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(56, 189, 248, 0.4)"/>
    <text x="25" y="32" font-family="monospace" font-size="11" font-weight="bold" fill="#38bdf8">DRONE CANOPY SCAN [UAV-01]</text>
    <text x="25" y="46" font-family="monospace" font-size="10" fill="#e2e8f0">ALT: 12.4m AGL | TARGET: ${plantId}</text>
    <text x="25" y="58" font-family="monospace" font-size="9" fill="#94a3b8">STATUS: ${hasAbnormality ? 'ABNORMALITY DETECTED' : 'CANOPY OPTIMAL'}</text>
  </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Generate the 150 plants database
function generatePlants() {
  const plants = [];

  // Problem plants matching exact specifications:
  // Water stress: P082, P014, P029, P053, P099, P112, P131, P144 (Total: 8)
  const waterStressIds = new Set(['P082', 'P014', 'P029', 'P053', 'P099', 'P112', 'P131', 'P144']);
  // Possible disease: P113, P034, P077 (Total: 3)
  const diseaseIds = new Set(['P113', 'P034', 'P077']);
  // Slow growth: P041, P106 (Total: 2)
  const slowGrowthIds = new Set(['P041', 'P106']);

  // 10 rows x 15 plants per row = 150 plants
  let plantIndex = 1;

  for (let row = 1; row <= 10; row++) {
    for (let pos = 1; pos <= 15; pos++) {
      const idStr = `P${String(plantIndex).padStart(3, '0')}`;
      
      const lat = (BASE_LAT + (row - 1) * 0.000054 + (pos % 2 === 0 ? 0.000003 : -0.000002)).toFixed(6);
      const lng = (BASE_LNG + (pos - 1) * 0.000036 + (row % 2 === 0 ? 0.000002 : -0.000001)).toFixed(6);

      let status = 'Healthy';
      let leafHealth = 'Healthy';
      let leafCondition = 'Normal';
      let soilCondition = 'Normal';
      let growthCondition = 'Normal';
      let waterRequirement = 'Not required';
      let waterStatus = 'Normal';
      let waterRecommendation = 'Irrigation adequate. Soil moisture within optimal range (35-42%).';
      
      let moisture = Math.round(36 + (plantIndex * 7) % 8 - 4); // 32% - 40%
      let temperature = +(25.5 + ((plantIndex * 3) % 25) / 10).toFixed(1); // 25.5 - 28.0 C
      let ph = +(6.5 + ((plantIndex * 5) % 15 - 7) / 20).toFixed(1); // 6.1 - 6.9
      let ec = +(1.2 + ((plantIndex * 2) % 10 - 5) / 20).toFixed(2); // 1.0 - 1.4 mS/cm

      let baseHeight = 45 + (row * 2) + (pos % 5);
      let week1 = baseHeight;
      let week2 = week1 + 5;
      let week3 = week2 + 5;
      let week4 = week3 + 6;

      let diseaseIssue = null;
      let aiConfidence = 96;
      let aiAction = 'Routine autonomous monitoring cycle.';

      if (waterStressIds.has(idStr)) {
        status = 'Water Stress';
        soilCondition = 'Dry';
        leafHealth = idStr === 'P082' ? 'Abnormal' : 'Wilting symptoms';
        leafCondition = 'Abnormal';
        growthCondition = idStr === 'P082' ? 'Slow' : 'Moderate';
        waterRequirement = 'Required';
        waterStatus = 'Water stress suspected';
        waterRecommendation = '💧 Water Stress Detected — Recommendation: Check irrigation and check drip emitter.';
        
        if (idStr === 'P082') {
          // Exact values requested in user specification for P082:
          // Row: 8, Plant: 2
          // Soil Moisture: 24% (Status: Low), Temp: 27°C, pH: 6.4, EC: 1.1 mS/cm
          // Week 1: 42cm, Week 2: 48cm (+6), Week 3: 53cm (+5), Week 4: 55cm (+2)
          row = 8;
          pos = 2;
          moisture = 24;
          temperature = 27.0;
          ph = 6.4;
          ec = 1.10;
          week1 = 42;
          week2 = 48;
          week3 = 53;
          week4 = 55;
          aiAction = 'Check irrigation and inspect the plant.';
        } else {
          moisture = 23 + (plantIndex % 3);
          temperature = 27.5;
          ph = 6.3;
          ec = 1.05;
        }
      } else if (diseaseIds.has(idStr)) {
        status = 'Possible Disease';
        leafHealth = 'Abnormal';
        leafCondition = 'Abnormal';
        soilCondition = 'Normal';
        growthCondition = 'Slow';
        waterRequirement = 'Monitor';
        waterStatus = 'Monitor';
        waterRecommendation = 'Maintain standard moisture. Avoid overhead water splashing on fronds.';
        diseaseIssue = 'Disease symptoms detected';
        aiConfidence = idStr === 'P113' ? 87 : 84;
        aiAction = 'Further inspection recommended';
      } else if (slowGrowthIds.has(idStr)) {
        status = 'Slow Growth';
        soilCondition = 'Normal';
        leafHealth = 'Healthy';
        leafCondition = 'Normal';
        growthCondition = 'Slow';
        waterRequirement = 'Monitor';
        waterStatus = 'Monitor';
        waterRecommendation = 'Inspect root zone for compaction or nutrient uptake deficit.';
        week1 = 40;
        week2 = 41;
        week3 = 42;
        week4 = 43;
        aiAction = 'Inspect root zone & soil aeration.';
      }

      const nearbyAverageHeight = Math.round(baseHeight + 16);

      const isTallTree = idStr === 'P120' || plantIndex % 30 === 0;
      const droneInspection = isTallTree ? {
        performed: true,
        droneId: 'UAV-AGRI-01',
        altitudeMeters: 12.4,
        timestamp: 'Today, 10:48 AM',
        location: `${lat}° N, ${lng}° E`,
        status: 'Completed',
        groundCameraStatus: 'Limited visibility (tall canopy > 3.5m)',
        upperCanopyObservation: idStr === 'P120' 
          ? 'Upper canopy: No obvious abnormality detected' 
          : 'Upper canopy: Frond spread normal',
        aerialImage: generateDroneImage(idStr, false),
      } : {
        performed: false,
        groundCameraStatus: 'Full canopy within rover ground camera range',
      };

      const history = [
        { date: 'Today, 10:42 AM', moisture, status, note: status === 'Healthy' ? 'Routine scan passed' : `${status} logged` },
        { date: '15 Sep, 09:30 AM', moisture: moisture + 4, status: status === 'Water Stress' ? 'Moisture decreasing' : 'Healthy', note: 'Periodic rover patrol' },
        { date: '10 Sep, 11:15 AM', moisture: moisture + 9, status: status === 'Water Stress' ? 'Moisture decreasing' : 'Healthy', note: 'Post-fertigation scan' },
        { date: '05 Sep, 10:00 AM', moisture: 38, status: 'Normal', note: 'Full block baseline' },
        { date: '01 Sep, 09:00 AM', moisture: 40, status: 'Healthy', note: 'Monthly calibration' }
      ];

      plants.push({
        plant_id: idStr,
        farm_id: 'DEMO-FARM-01',
        row,
        position: pos,
        latitude: lat,
        longitude: lng,
        crop: 'Arecanut',
        soil: {
          condition: soilCondition,
          moisture,
          temperature,
          ph,
          ec,
          probeStatus: 'Measurement complete',
          statusLabel: moisture < 28 ? 'Low' : moisture > 48 ? 'High' : 'Normal',
        },
        growth: {
          condition: growthCondition,
          currentHeight: week4,
          nearbyAverageHeight,
          history: [
            { week: 'Week 1', height: week1, growth: '—' },
            { week: 'Week 2', height: week2, growth: `+${week2 - week1} cm` },
            { week: 'Week 3', height: week3, growth: `+${week3 - week2} cm` },
            { week: 'Week 4', height: week4, growth: `+${week4 - week3} cm` },
          ]
        },
        leafHealth: {
          condition: leafCondition,
          healthStatus: leafHealth,
          diseaseIssue,
          aiConfidence,
          action: aiAction,
          wordingNote: 'Possible disease symptoms detected (preliminary screening, not medical diagnosis)'
        },
        water: {
          status: waterStatus,
          requirement: waterRequirement,
          recommendation: waterRecommendation,
        },
        status, // 'Healthy' | 'Water Stress' | 'Possible Disease' | 'Slow Growth'
        aiFarmerDecision: {
          findings: [
            status === 'Water Stress' ? '🌱 Soil moisture is low' : '🌱 Soil moisture is adequate',
            status === 'Water Stress' ? '📷 Leaf stress is visible' : leafCondition === 'Abnormal' ? '📷 Leaf lesion detected' : '📷 Leaf fronds healthy & turgid',
            growthCondition === 'Slow' ? '📈 Growth is slower than previous weeks' : '📈 Growth rate is consistent with row average'
          ],
          systemOutput: status === 'Healthy' ? '✅ Plant is healthy and thriving' : '⚠️ Plant needs attention',
          suggestedAction: aiAction
        },
        images: {
          fullPlant: generatePlantImage(idStr, status, 'full'),
          leafScan1: generatePlantImage(idStr, status, 'leaf-angle-1'),
          leafScan2: generatePlantImage(idStr, status, 'leaf-angle-2'),
          leafScan3: generatePlantImage(idStr, status, 'leaf-angle-3'),
          previousScan: generatePlantImage(idStr, 'Healthy', 'previous-scan'),
          timestamp: 'Today, 10:42 AM'
        },
        drone: droneInspection,
        history
      });

      plantIndex++;
    }
  }

  return plants;
}

// Global In-Memory Database
const db = {
  farm: {
    name: 'Demo Farm',
    area: '1 Acre',
    crop: 'Arecanut',
    totalPlants: 150,
    plantsScanned: 150,
    lastScan: 'Today, 10:42 AM',
    mode: 'DEMO DATA',
  },
  rover: {
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
    mode: 'SIMULATION'
  },
  plants: generatePlants(),
  alerts: [
    { id: 'ALT-101', plantId: 'P113', severity: 'HIGH', type: 'Possible Disease', message: 'Possible disease symptoms detected', time: '10:41 AM' },
    { id: 'ALT-102', plantId: 'P082', severity: 'MEDIUM', type: 'Water Stress', message: 'Water stress suspected (Moisture: 24%)', time: '10:38 AM' },
    { id: 'ALT-103', plantId: 'P041', severity: 'MEDIUM', type: 'Slow Growth', message: 'Slow growth detected (+1cm vs avg +5cm)', time: '10:15 AM' },
    { id: 'ALT-104', plantId: 'P034', severity: 'HIGH', type: 'Possible Disease', message: 'Possible leaf spotting symptoms', time: '09:55 AM' },
    { id: 'ALT-105', plantId: 'P014', severity: 'MEDIUM', type: 'Water Stress', message: 'Water stress suspected (Moisture: 25%)', time: '09:32 AM' },
    { id: 'ALT-106', plantId: 'P001', severity: 'LOW', type: 'Normal', message: 'Inspection completed - Healthy', time: '09:02 AM' }
  ]
};

module.exports = { db, generatePlants };
