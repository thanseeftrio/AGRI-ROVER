// server/simulationEngine.js
// Simulates the physical Agri Rover mission visiting P001 -> P150

class SimulationEngine {
  constructor(db, broadcastCallback) {
    this.db = db;
    this.broadcast = broadcastCallback;
    this.intervalId = null;
    this.isRunning = false;
    this.currentIndex = 0; // index in db.plants (0 = P001)
    this.stage = 'idle'; // 'navigating' | 'camera_capture' | 'probe_deploying' | 'measuring' | 'probe_retracting' | 'ai_analysis' | 'saved'
    this.speed = 1; // 1x, 2x, 5x
    this.stepDuration = 1000; // ms per sub-stage
  }

  start(speed = 1) {
    this.speed = speed;
    this.isRunning = true;
    this.db.rover.status = 'Scanning';
    this.db.rover.activeMission = 'Autonomous Block Scan (1 Acre)';
    
    if (this.currentIndex >= this.db.plants.length) {
      this.currentIndex = 0;
    }

    this.runLoop();
    this.notifyUpdate();
  }

  pause() {
    this.isRunning = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    this.db.rover.status = 'Idle';
    this.notifyUpdate();
  }

  reset() {
    this.pause();
    this.currentIndex = 0;
    this.stage = 'idle';
    this.db.rover.plantsScannedCount = 0;
    this.db.rover.currentPlantId = 'P001';
    this.db.rover.currentRow = 1;
    this.db.rover.probeState = 'Retracted';
    this.db.rover.status = 'Online';
    this.notifyUpdate();
  }

  fastForward() {
    this.pause();
    this.currentIndex = this.db.plants.length;
    this.db.rover.plantsScannedCount = 150;
    this.db.rover.currentPlantId = 'P150';
    this.db.rover.currentRow = 10;
    this.db.rover.probeState = 'Retracted';
    this.db.rover.status = 'Mission Complete';
    this.stage = 'complete';
    this.notifyUpdate();
  }

  step() {
    if (this.currentIndex >= this.db.plants.length) {
      return;
    }
    this.advancePlant();
  }

  runLoop() {
    if (!this.isRunning) return;

    const delay = Math.max(200, Math.round(this.stepDuration / this.speed));

    this.intervalId = setTimeout(() => {
      this.advanceSimulationStep();
      if (this.isRunning && this.currentIndex < this.db.plants.length) {
        this.runLoop();
      } else if (this.currentIndex >= this.db.plants.length) {
        this.completeMission();
      }
    }, delay);
  }

  advanceSimulationStep() {
    const currentPlant = this.db.plants[this.currentIndex];
    if (!currentPlant) return;

    this.db.rover.currentPlantId = currentPlant.plant_id;
    this.db.rover.currentRow = currentPlant.row;
    this.db.rover.currentLat = currentPlant.latitude;
    this.db.rover.currentLng = currentPlant.longitude;

    switch (this.stage) {
      case 'idle':
      case 'saved':
        this.stage = 'navigating';
        this.db.rover.status = 'Moving';
        this.db.rover.probeState = 'Retracted';
        break;

      case 'navigating':
        this.stage = 'camera_capture';
        this.db.rover.status = 'Scanning Camera';
        break;

      case 'camera_capture':
        this.stage = 'probe_deploying';
        this.db.rover.status = 'Measuring';
        this.db.rover.probeState = 'Deploying';
        break;

      case 'probe_deploying':
        this.stage = 'measuring';
        this.db.rover.probeState = 'Measuring';
        break;

      case 'measuring':
        this.stage = 'probe_retracting';
        this.db.rover.probeState = 'Retracting';
        break;

      case 'probe_retracting':
        this.stage = 'ai_analysis';
        this.db.rover.probeState = 'Measurement complete';
        this.db.rover.status = 'AI Inferencing';
        break;

      case 'ai_analysis':
        this.stage = 'saved';
        this.db.rover.probeState = 'Retracted';
        this.db.rover.plantsScannedCount = this.currentIndex + 1;
        this.db.rover.distanceTraveledMeters += 4;
        this.db.rover.battery = Math.max(12, +(this.db.rover.battery - 0.05).toFixed(1));
        
        // Move to next plant for subsequent cycle
        this.currentIndex++;
        break;
    }

    this.notifyUpdate();
  }

  advancePlant() {
    if (this.currentIndex < this.db.plants.length) {
      const plant = this.db.plants[this.currentIndex];
      this.db.rover.currentPlantId = plant.plant_id;
      this.db.rover.currentRow = plant.row;
      this.db.rover.plantsScannedCount = this.currentIndex + 1;
      this.db.rover.distanceTraveledMeters += 4;
      this.currentIndex++;
      this.stage = 'saved';
      this.notifyUpdate();
    }
  }

  completeMission() {
    this.isRunning = false;
    this.db.rover.status = 'Mission Complete';
    this.db.rover.plantsScannedCount = this.db.plants.length;
    this.stage = 'complete';
    this.notifyUpdate();
  }

  notifyUpdate() {
    if (this.broadcast) {
      this.broadcast({
        type: 'ROVER_UPDATE',
        rover: this.db.rover,
        stage: this.stage,
        scannedCount: this.db.rover.plantsScannedCount,
        currentPlantId: this.db.rover.currentPlantId,
        currentRow: this.db.rover.currentRow,
      });
    }
  }
}

module.exports = SimulationEngine;
