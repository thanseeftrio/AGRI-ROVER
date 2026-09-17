# Agri Rover — Autonomous Field Intelligence & Decision Interface

Autonomous agricultural monitoring and plant decision-support system for high-density crop management (Arecanut demo with 150 plants across a 1-acre block).

The system follows the pipeline:
$$\text{ROVER DATA} \longrightarrow \text{PROCESSING} \longrightarrow \text{PLANT ANALYSIS} \longrightarrow \text{FARMER DECISION}$$

---

## Features

- **1-Acre Spatial Plant Grid (P001 → P150)**: Interactive 10-row matrix with real-time rover tracking.
- **Individual Plant Dossier**:
  - Sub-surface Soil Probe Telemetry (Moisture %, Temperature °C, pH, EC mS/cm).
  - Multi-spectral Camera Scans with dual-image baseline comparison slider.
  - Multi-Factor Water Stress Decision Engine.
  - Edge AI Plant Health & Disease Screening with cautious agronomic terminology.
  - 4-Week Growth History & Trendline vs. Row Neighborhood Average.
  - Upper-Canopy Drone Inspection Module (for mature tall palms like P120).
  - 3-Point Plain-English Farmer Decision Cards.
- **Autonomous Mission Simulation Engine**: Step-by-step probe actuation (`Retracted` → `Deploying` → `Measuring` → `Retracting` → `Complete`) and speed controls (`1x`, `2x`, `5x`, `Fast-Forward 150`).
- **Hardware Integration REST APIs**: Direct JSON ingestion endpoints for ESP32 and Raspberry Pi.
- **Mobile Responsive Design**: Touch-optimized 2-column collection grid and sticky app navigation.

---

## Hardware Integration REST Endpoints

| Endpoint | Method | Payload / Purpose |
| :--- | :--- | :--- |
| `/api/rover/data` | `POST` | Ingest RTK GPS, battery %, speed, voltage, state |
| `/api/soil/measurement` | `POST` | Ingest probe moisture, temp, pH, EC |
| `/api/plant/image` | `POST` | Ingest camera captures |
| `/api/plant/analysis` | `POST` | Ingest edge AI inference results |
| `/api/plants` | `GET` | Filterable database query (`status`, `row`, `search`) |
| `/api/plants/:id` | `GET` | Individual plant dossier |
| `/api/rover/status` | `GET` | Real-time rover telemetry & mission stage |
| `/api/summary` | `GET` | Farmer executive decision summary |
| `/api/stream` | `GET` | Server-Sent Events (SSE) live telemetry socket |

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

```bash
# Clone the repository
git clone git@github.com:thanseeftrio/AGRI-ROVER.git
cd AGRI-ROVER

# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Launch both Backend Server (:3001) and Web UI (:5173)
npm run dev
```

- **Web Dashboard**: [http://localhost:5173](http://localhost:5173)
- **Backend API & Hardware Port**: [http://localhost:3001](http://localhost:3001)

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Google Fonts (Newsreader & Plus Jakarta Sans)
- **Backend**: Node.js, Express 5, CORS, Server-Sent Events (SSE)
- **Hardware Bridge**: ESP32 Microcontrollers, Raspberry Pi Camera Module, RTK GPS Odometry
