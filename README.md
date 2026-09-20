# AgriBot-X: High-Clearance Agricultural Field Rover 🌾🤖

> **Cinematic 3D WebGL Rover Visualizer, 2D AutoCAD Engineering Drawing Package, and Fabrication Specifications.**

---

## 🚀 Live Demo & Hosting on Vercel

This repository is pre-configured for **instant 1-click deployment on Vercel**.

- **Main 3D Interactive Rover WebGL Viewer**: Served directly at the root `/` (`index.html`)
- **Print-Ready 4-Sheet Engineering Drawings**: `/drawings` or `/agribot_print_drawings.html`
- **AutoCAD 2D Judges Package PDF**: Located in `/cad/AgriBot_AutoCAD_2D_Judges_Package.pdf`
- **Engineering Specifications & BOM**: Located in `/docs/`

---

## 🛠️ Project Structure

```
.
├── index.html                           # Main 3D WebGL visualizer (Root entry point for Vercel)
├── agribot_print_drawings.html          # 4-sheet high-res printable engineering drawings
├── vercel.json                          # Vercel deployment routing & headers config
├── package.json                         # Project metadata
├── cad/                                 # AutoCAD scripts, LISP, DXF files, and judges PDF
│   ├── AgriBot_AutoCAD_2D_Judges_Package.pdf
│   ├── agribot_2d_manufacturing_package.dxf
│   ├── agribot_3d_assembly.dxf
│   ├── agribot_model.lsp
│   └── ...
├── docs/                                # Technical documentation
│   ├── BILL_OF_MATERIALS.md
│   ├── ENGINEERING_SPECIFICATIONS.md
│   └── FABRICATION_AND_ASSEMBLY_GUIDE.md
└── visualizer/                          # Visualizer mirror for legacy links
    ├── agribot_3d_viewer.html
    └── agribot_print_drawings.html
```

---

## ⚡ How to Deploy to Vercel

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "Deploy AgriBot-X visualizer and CAD package to Vercel"
   git push origin master
   ```
2. Go to [Vercel Dashboard](https://vercel.com/new).
3. Import your GitHub repository.
4. Leave **Framework Preset** as *Other* (or default).
5. Click **Deploy**. Vercel will immediately serve `index.html` at your production URL!

---

## 🌟 Key Features

1. **3D High-Clearance Rover Simulation**:
   - Real-time WebGL rendering with realistic soil terrain, lighting, shadows, and rover kinematics.
   - Interactive height adjustment (250mm - 550mm ground clearance).
   - Exploded view slider (0 - 100%).
   - Autonomous drone surveillance flight cycle demo.
   - Soil penetration probe simulation & pan/tilt vision turret sweep.
   - White studio background mode for presentation screenshots.

2. **4-Sheet Production Engineering Drawings**:
   - Sheet 1: Front General Arrangement (680 mm track width, 420 mm portal clearance).
   - Sheet 2: Top Plan View (Dual solar array, camera turret, drone landing pad).
   - Sheet 3: Side Elevation (580 mm wheelbase, motorized probe, electronics enclosure).
   - Sheet 4: 3D Isometric View (Suspension coilovers, tire tread geometry).
