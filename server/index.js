// server/index.js
// Express API Server for Agri Rover System Interface & Hardware Integration

const express = require('express');
const cors = require('cors');
const path = require('path');
const { db } = require('./db');
const SimulationEngine = require('./simulationEngine');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve built frontend assets
app.use(express.static(path.join(__dirname, '../client/dist')));

// Connected SSE clients for real-time telemetry streaming
const sseClients = new Set();

function broadcast(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}

// Initialize Simulation Engine
const engine = new SimulationEngine(db, broadcast);

// Server-Sent Events Endpoint for real-time rover telemetry updates
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);

  // Send initial snapshot
  res.write(`data: ${JSON.stringify({ type: 'INIT', rover: db.rover, farm: db.farm })}\n\n`);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// --- HARDWARE INTEGRATION ENDPOINTS ---

/**
 * POST /api/rover/data
 * Ingests live telemetry from ESP32 / Raspberry Pi
 */
app.post('/api/rover/data', (req, res) => {
  const { battery, voltage, speedMps, currentLat, currentLng, signalDbm, gpsFix, status, probeState } = req.body;

  if (battery !== undefined) db.rover.battery = battery;
  if (voltage !== undefined) db.rover.voltage = voltage;
  if (speedMps !== undefined) db.rover.speedMps = speedMps;
  if (currentLat !== undefined) db.rover.currentLat = currentLat;
  if (currentLng !== undefined) db.rover.currentLng = currentLng;
  if (signalDbm !== undefined) db.rover.signalDbm = signalDbm;
  if (gpsFix !== undefined) db.rover.gpsFix = gpsFix;
  if (status !== undefined) db.rover.status = status;
  if (probeState !== undefined) db.rover.probeState = probeState;

  db.rover.mode = 'HARDWARE_CONNECTED';

  broadcast({ type: 'ROVER_UPDATE', rover: db.rover });
  res.json({ success: true, message: 'Rover telemetry ingested', rover: db.rover });
});

/**
 * POST /api/soil/measurement
 * Ingests physical soil probe data from rover
 */
app.post('/api/soil/measurement', (req, res) => {
  const { plantId, moisture, temperature, ph, ec } = req.body;

  if (!plantId) {
    return res.status(400).json({ error: 'plantId is required' });
  }

  const plant = db.plants.find(p => p.plant_id.toUpperCase() === plantId.toUpperCase());
  if (!plant) {
    return res.status(404).json({ error: `Plant ${plantId} not found` });
  }

  if (moisture !== undefined) plant.soil.moisture = Number(moisture);
  if (temperature !== undefined) plant.soil.temperature = Number(temperature);
  if (ph !== undefined) plant.soil.ph = Number(ph);
  if (ec !== undefined) plant.soil.ec = Number(ec);
  plant.soil.probeStatus = 'Measurement complete';

  // Update status based on moisture
  if (plant.soil.moisture < 28) {
    plant.soil.condition = 'Dry';
    plant.soil.statusLabel = 'Low';
    plant.water.status = 'Water stress suspected';
    plant.water.requirement = 'Required';
    plant.water.recommendation = '💧 Water Stress Detected — Recommendation: Check irrigation';
    if (plant.status === 'Healthy') plant.status = 'Water Stress';
  } else {
    plant.soil.condition = 'Normal';
    plant.soil.statusLabel = 'Normal';
    plant.water.status = 'Normal';
    plant.water.requirement = 'Not required';
  }

  broadcast({ type: 'PLANT_UPDATED', plant });
  res.json({ success: true, plant });
});

/**
 * POST /api/plant/image
 * Ingests camera scans from Raspberry Pi camera module
 */
app.post('/api/plant/image', (req, res) => {
  const { plantId, imageType, imageUrl, base64Image } = req.body;

  if (!plantId) {
    return res.status(400).json({ error: 'plantId is required' });
  }

  const plant = db.plants.find(p => p.plant_id.toUpperCase() === plantId.toUpperCase());
  if (!plant) {
    return res.status(404).json({ error: `Plant ${plantId} not found` });
  }

  const imgData = base64Image ? `data:image/jpeg;base64,${base64Image}` : (imageUrl || plant.images.fullPlant);

  if (imageType === 'leaf1') plant.images.leafScan1 = imgData;
  else if (imageType === 'leaf2') plant.images.leafScan2 = imgData;
  else if (imageType === 'leaf3') plant.images.leafScan3 = imgData;
  else plant.images.fullPlant = imgData;

  plant.images.timestamp = 'Just now';

  broadcast({ type: 'PLANT_UPDATED', plant });
  res.json({ success: true, plantId: plant.plant_id, imageType });
});

/**
 * POST /api/plant/analysis
 * Ingests edge AI inference output from onboard neural model
 */
app.post('/api/plant/analysis', (req, res) => {
  const { plantId, leafCondition, healthStatus, diseaseIssue, aiConfidence, action } = req.body;

  if (!plantId) {
    return res.status(400).json({ error: 'plantId is required' });
  }

  const plant = db.plants.find(p => p.plant_id.toUpperCase() === plantId.toUpperCase());
  if (!plant) {
    return res.status(404).json({ error: `Plant ${plantId} not found` });
  }

  if (leafCondition) plant.leafHealth.condition = leafCondition;
  if (healthStatus) plant.leafHealth.healthStatus = healthStatus;
  if (diseaseIssue) plant.leafHealth.diseaseIssue = diseaseIssue;
  if (aiConfidence !== undefined) plant.leafHealth.aiConfidence = Number(aiConfidence);
  if (action) plant.leafHealth.action = action;

  if (diseaseIssue) {
    plant.status = 'Possible Disease';
  }

  broadcast({ type: 'PLANT_UPDATED', plant });
  res.json({ success: true, plant });
});

// --- DASHBOARD QUERY ENDPOINTS ---

/**
 * GET /api/rover/status
 */
app.get('/api/rover/status', (req, res) => {
  res.json({
    farm: db.farm,
    rover: db.rover,
    missionStage: engine.stage,
    isSimulationRunning: engine.isRunning
  });
});

/**
 * GET /api/plants
 * Supports filtering by status, row, or search query
 */
app.get('/api/plants', (req, res) => {
  const { status, row, search } = req.query;
  let results = db.plants;

  if (status && status !== 'All') {
    results = results.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }

  if (row && row !== 'All') {
    results = results.filter(p => p.row === Number(row));
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p => 
      p.plant_id.toLowerCase().includes(q) || 
      p.status.toLowerCase().includes(q)
    );
  }

  res.json({
    total: results.length,
    plants: results
  });
});

/**
 * GET /api/plants/:id
 */
app.get('/api/plants/:id', (req, res) => {
  const plant = db.plants.find(p => p.plant_id.toUpperCase() === req.params.id.toUpperCase());
  if (!plant) {
    return res.status(404).json({ error: `Plant ${req.params.id} not found` });
  }
  res.json(plant);
});

/**
 * GET /api/alerts
 */
app.get('/api/alerts', (req, res) => {
  res.json({
    count: db.alerts.length,
    alerts: db.alerts
  });
});

/**
 * GET /api/summary
 * Farmer high-level decision summary
 */
app.get('/api/summary', (req, res) => {
  const total = db.plants.length;
  const normalCount = db.plants.filter(p => p.status === 'Healthy').length;
  const waterStressCount = db.plants.filter(p => p.status === 'Water Stress').length;
  const diseaseCount = db.plants.filter(p => p.status === 'Possible Disease').length;
  const slowGrowthCount = db.plants.filter(p => p.status === 'Slow Growth').length;

  const attentionList = db.plants
    .filter(p => p.status !== 'Healthy')
    .map(p => ({
      plant_id: p.plant_id,
      row: p.row,
      position: p.position,
      status: p.status,
      action: p.leafHealth.action,
      soilMoisture: p.soil.moisture,
      reason: p.status === 'Water Stress' 
        ? `Low soil moisture (${p.soil.moisture}%)` 
        : p.status === 'Possible Disease' 
        ? `Possible disease symptoms (AI: ${p.leafHealth.aiConfidence}%)` 
        : `Slow growth delta (+${p.growth.history[3].height - p.growth.history[2].height}cm)`
    }));

  res.json({
    farm: db.farm,
    totalMonitored: total,
    normalCount,
    waterStressCount,
    diseaseCount,
    slowGrowthCount,
    requiringAttentionCount: attentionList.length,
    plantsRequiringAttention: attentionList
  });
});

// --- MISSION SIMULATION CONTROLS ---

app.post('/api/mission/start', (req, res) => {
  const speed = Number(req.body.speed) || 1;
  engine.start(speed);
  res.json({ success: true, message: 'Mission started', status: db.rover.status, speed });
});

app.post('/api/mission/pause', (req, res) => {
  engine.pause();
  res.json({ success: true, message: 'Mission paused', status: db.rover.status });
});

app.post('/api/mission/step', (req, res) => {
  engine.step();
  res.json({ success: true, message: 'Stepped 1 plant', currentPlant: db.rover.currentPlantId });
});

app.post('/api/mission/fast-forward', (req, res) => {
  engine.fastForward();
  res.json({ success: true, message: 'Fast-forwarded to complete', rover: db.rover });
});

app.post('/api/mission/reset', (req, res) => {
  engine.reset();
  res.json({ success: true, message: 'Mission reset', rover: db.rover });
});

// Fallback for Single Page Application routing (Express 5 compatible)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`[Agri Rover Server] Running on http://localhost:${PORT}`);
  console.log(`[Agri Rover Server] Ready for Rover ESP32/RPi hardware API POST requests.`);
});
