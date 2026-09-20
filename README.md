# Agri Rover 🌾🤖 - Autonomous Agricultural Monitoring Control Center & 3D Engineering Platform

An end-to-end intelligent agricultural field rover and precision monitoring system designed for 1-acre crops (Arecanut, Orchard, and High-Clearance Row Crops).

---

## 🌟 Key Features

1. **Autonomous Crop & Plant Monitoring Dashboard**:
   - Live 1-Acre GPS Matrix Grid (150 plants tracked).
   - Real-time AI Plant Health Diagnostics (Leaf Blight, Water Stress, Frond Health).
   - Live Telemetry & Mission Control with ESP32/RPi bridge interface.
   - Farm Summary Reports and Agro-Advisory Action Plans.

2. **Interactive 3D WebGL Rover Visualizer**:
   - High-Clearance Strut Architecture with top-docked drone.
   - Real-time kinematics: Ground clearance slider (250mm - 550mm), Exploded view (0 - 100%).
   - Autonomous mission demos: Drone flight simulation, motorized soil penetration probe, foliage vision turret sweep.

3. **Production 2D Engineering Drawings & CAD Package**:
   - 4-Sheet Printable AutoCAD Vector Drawings (Front GA, Top Plan, Side Elevation, 3D Isometric).
   - Downloadable DXF manufacturing files and Judges PDF Packages.

---

## 🚀 Live Demo & Deployment

This project is configured for **Vercel**:

- **Web Dashboard**: Main Application (`/`)
- **3D Interactive Rover**: `/agribot_3d_viewer.html` or `/3d`
- **4-Sheet Engineering Drawings**: `/agribot_print_drawings.html` or `/drawings`
- **AutoCAD PDF Package**: `/cad/AgriBot_AutoCAD_2D_Judges_Package.pdf`

---

## 🛠️ Local Development

### 1. Install Dependencies
```bash
npm install
cd client && npm install && cd ..
```

### 2. Run Locally (Full-Stack Dev Server)
```bash
npm run dev
```
- Frontend UI: `http://localhost:5173`
- Backend API Server: `http://localhost:3001`
