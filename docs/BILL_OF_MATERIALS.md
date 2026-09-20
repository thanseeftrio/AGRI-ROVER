# Master Bill of Materials (BOM) — AgriBot-X Agricultural Rover & Drone Dock

**Project:** Autonomous AI Agricultural Plant Monitoring Rover with Integrated Drone Docking Station  
**Revision:** v1.0 (Fabrication-Ready Prototype)  
**Standard:** ISO 2768-m / ASME Y14.5  

---

## 1. Subsystem 1: Chassis, Structural Frame & Enclosure

| Item | Component Description | Material / Manufacturing | Qty | Dimensions / Specification | COTS Supplier / Part No. | Est. Cost (USD) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1.01** | Longitudinal Structural Rails | Al 6063-T6 Extrusion | 4 | 40x40 mm T-Slot (L=650 mm) | Misumi HFS8-4040-650 | $48.00 |
| **1.02** | Transverse Structural Crossmembers | Al 6063-T6 Extrusion | 6 | 40x40 mm T-Slot (L=280 mm) | Misumi HFS8-4040-280 | $36.00 |
| **1.03** | Vertical Corner Struts | Al 6063-T6 Extrusion | 4 | 40x40 mm T-Slot (L=270 mm) | Misumi HFS8-4040-270 | $28.00 |
| **1.04** | Corner Gusset Reinforcement Plates | Al 6061-T6 (CNC Waterjet) | 8 | 5.0 mm Thk, 90° Gusset 60x60 mm | Custom Fabrication | $32.00 |
| **1.05** | Bottom Chassis Base Plate | Al 6061-T6 (CNC Plate) | 1 | 5.0 mm x 640 mm x 360 mm | Custom Fabrication | $65.00 |
| **1.06** | Left & Right Side Protection Panels | Al 5052-H32 Sheet Metal | 2 | 2.5 mm x 560 mm x 270 mm (Louvers) | Laser Cut / Powder Coated | $45.00 |
| **1.07** | Front Bumper Assembly | Al 6061 Tubular + Rubber | 1 | Ø32 mm Tube x 420 mm W | Custom Welded / Anodized | $35.00 |
| **1.08** | Rear Bumper Assembly | Al 6061 Tubular + Rubber | 1 | Ø32 mm Tube x 420 mm W | Custom Welded / Anodized | $35.00 |
| **1.09** | Rubber Vibration Dampeners (Bumpers) | EPDM Shore 60A | 4 | M8 Stud x 30 mm OD x 25 mm H | McMaster 9376K24 | $18.00 |
| **1.10** | Wheel Mudguards / Fenders | ABS / PETG (3D Print) | 4 | 290 mm x 95 mm x 3 mm curved | FDM Printed (PA-CF / PETG) | $24.00 |

---

## 2. Subsystem 2: 4WD Rugged Drivetrain

| Item | Component Description | Material / Manufacturing | Qty | Dimensions / Specification | COTS Supplier / Part No. | Est. Cost (USD) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **2.01** | High-Torque Planetary BLDC Motors | Alloy Steel / NdFeB | 4 | 24V 350W, 1:20 Gearbox, 18 Nm | Linix / Nidec BLDC-24V-350 | $320.00 |
| **2.02** | Optical Incremental Quadrature Encoders | Polycarbonate Housing | 4 | 1024 PPR, Differential ABZ Line | Broadcom HEDS-5540#A06 | $120.00 |
| **2.03** | Machined Drive Wheel Hubs | Al 6061-T6 (CNC Lathe) | 4 | Ø120 mm Flange, 4xM10 on 100 PCD | Custom CNC Lathe Turn | $80.00 |
| **2.04** | Drive Axles & Keyways | AISI 4140 Hardened Steel | 4 | Ø20 mm g6 x 110 mm, DIN 6885-6x6 | Precision Ground / Induction | $60.00 |
| **2.05** | Deep-Groove Ball Bearings | 52100 Chrome Steel | 8 | 6005-2RS (25 mm ID x 47 mm OD) | SKF 6005-2RSH | $48.00 |
| **2.06** | Bearing Pillow Block Brackets | Al 6061-T6 (CNC Milled) | 4 | Split Clamp Housing for 47 mm OD | Custom CNC Milled | $70.00 |
| **2.07** | All-Terrain Chevron Rubber Tires | Reinforced Natural Rubber | 4 | Ø300 mm OD x 90 mm W (4.00-6) | Kenda K290 Scorpion Agri | $140.00 |
| **2.08** | Split Steel Wheel Rims | Stamped Powder-Coated Steel | 4 | 6.00" Rim Dia x 3.25" Width | COTS 6" Agri Rim | $52.00 |
| **2.09** | Motor Mounting Heavy Brackets | Al 6061-T6 (8 mm Plate) | 4 | 110 x 90 x 8 mm, Ø42 mm H7 Bore | Custom CNC Machined | $48.00 |

---

## 3. Subsystem 3: Height-Adjustable Camera Mast & Vision Sensors

| Item | Component Description | Material / Manufacturing | Qty | Dimensions / Specification | COTS Supplier / Part No. | Est. Cost (USD) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **3.01** | Vertical Structural Mast Column | Al 6063-T6 Extrusion | 1 | 40x40 mm Heavy Slot (L=400 mm) | Misumi HFS8-4040-400 | $24.00 |
| **3.02** | Mast Base Swivel / Lock Mount | Al 6061-T6 (CNC Milled) | 1 | 100 x 80 x 30 mm Clamp Base | Custom CNC Milled | $38.00 |
| **3.03** | Mast Clamping Slider & Quick Release | Al 6061-T6 + Cam Lever | 1 | Slotted Carriage with Brass Shims | Kipp K0009 Cam Clamping | $28.00 |
| **3.04** | 2-Axis Pan/Tilt Robotic Gimbal | Al 6061 & Coreless Servos | 1 | ±180° Pan, -45° to +90° Tilt (15 kg·cm) | Robotis Dynamixel / PT-20 | $185.00 |
| **3.05** | High-Resolution 4K Plant RGB Camera | Aluminum Shielded Enclosure | 1 | 12.3 MP Sony IMX477, USB 3.0 UVC | Arducam B0251 4K USB3 | $95.00 |
| **3.06** | Optical CS-Mount Low-Distortion Lens | Glass Elements / Metal Barrel | 1 | 6 mm F1.4 1/2.3" Wide Angle IR-Cut | Arducam M23060M14 | $32.00 |
| **3.07** | Stereo Depth Obstacle & Canopy Camera | Molded Body / Optical Filters | 1 | Intel RealSense D435i (RGB-D + IMU) | Intel RealSense 82635DS935 | $349.00 |
| **3.08** | Multispectral Agricultural Sensor Module | Multi-Filter Silicon Photodiode | 1 | 5 Spectral Bands (Blue, Green, Red, RedEdge, NIR) | AMS AS7341 / SparkFun | $65.00 |
| **3.09** | Weatherproof Camera Shroud Hood | Carbon-PETG 3D Printed | 1 | IP66 Gasketed Shroud with Glass Window | Additive Manufactured | $22.00 |
| **3.10** | Flexible Cable Drag Chain Guide | Reinforced Polyamide (Nylon) | 1 | 10x15 mm Interior, R18 Bend (L=500 mm) | Igus 045.10.018.0 | $16.00 |

---

## 4. Subsystem 4: Motorized Retractable Soil Probe

| Item | Component Description | Material / Manufacturing | Qty | Dimensions / Specification | COTS Supplier / Part No. | Est. Cost (USD) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **4.01** | Precision Linear Guide Rail & Block | Alloy Steel (Hardened) | 1 | MGN15H Heavy Carriage (L=250 mm) | Hiwin MGN15H-C-R250 | $42.00 |
| **4.02** | Lead Screw & Anti-Backlash Brass Nut | SS 304 & Phosphor Bronze | 1 | T8x2 (Pitch 2mm, Lead 2mm, L=260 mm) | Misumi MTS8-260 | $18.00 |
| **4.03** | Linear Actuator / Stepper Drive Motor | Alloy Housing / Neodymium | 1 | NEMA 17 Stepper (High-Torque 65 N·cm) | StepperOnline 17HS19-2004S1 | $22.00 |
| **4.04** | Flexible Jaw Shaft Coupling | Al 7075 + Polyurethane Spider | 1 | 5 mm to 8 mm Bore (OD 20 x L 25 mm) | Ruland Oldham Coupling | $14.00 |
| **4.05** | Probe Slide Carriage Mounting Plate | Al 6061-T6 (CNC Plate) | 1 | 80 x 60 x 8 mm, M3 & M4 Hole Pattern | Custom CNC Milled | $26.00 |
| **4.06** | Quick-Release Knurled Probe Chuck | Stainless Steel 303 (Knurled) | 1 | ER11 / Custom Twist-Collet (Ø12 mm) | Custom Lathe Turned | $28.00 |
| **4.07** | Soil Penetration Probe Shaft | Stainless Steel 316 (Hollow) | 1 | Ø12 mm OD x Ø8 mm ID x 160 mm L | Sandvik SS 316 Seamless | $18.00 |
| **4.08** | Multi-Parameter Soil Sensor Cartridge | SS 316 Pins / Potted Epoxy | 1 | Moisture (FDR), Temp, EC, pH (RS485) | Renke Soil 4-in-1 Sensor | $110.00 |
| **4.09** | Sub-Miniature Mechanical Limit Switches | Thermoplastic / Silver Contacts | 2 | IP67 Roller Lever Microswitch | Omron D2HW-A201D | $12.00 |
| **4.10** | Downward Surface Proximity ToF Sensor | Optical Laser Package (Class 1) | 1 | VL53L1X Time-of-Flight (4 m range) | STMicroelectronics VL53L1X | $15.00 |

---

## 5. Subsystem 5: Drone Docking Station & Surveillance Quadcopter

| Item | Component Description | Material / Manufacturing | Qty | Dimensions / Specification | COTS Supplier / Part No. | Est. Cost (USD) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **5.01** | Landing Deck Base Plate | Al 6061-T6 / Carbon Sandwich | 1 | 480 mm x 480 mm x 5 mm (Drainage Slots) | Laser Cut & Anodized | $75.00 |
| **5.02** | Beveled Auto-Centering Funnel Guides | Ultra-High-Molecular-Weight PE | 4 | 30° Incline Bevel Ramp (UHMW-PE) | CNC Milled UHMW-PE | $45.00 |
| **5.03** | Fast-Charging Contact Busbars (+24V/GND) | Beryllium Copper (Gold Plated) | 2 | 360 mm x 15 mm x 3 mm (Spring Backed) | Custom Stamped / Gold Plated | $38.00 |
| **5.04** | Active Mechanical Retention Latches | Al 6061 Hooks & Micro-Servos | 2 | Metal Gear Micro-Servo + Over-Center Cam | Savox SH-0255MG | $44.00 |
| **5.05** | High-Visibility RGB-LED Boundary Strip | Silicone Encapsulated (IP68) | 1 | WS2812B Addressable LED (L=1.9 m) | BTF-Lighting IP68 WS2812B | $22.00 |
| **5.06** | Autonomous Surveillance Drone Frame | 3K Twill Carbon Fiber Plate/Tube | 1 | 280 mm True-X Geometry (4 mm Arms) | Custom Agri-Quad Carbon | $65.00 |
| **5.07** | Drone Brushless Outrunner Motors | Steel Shaft / Neodymium | 4 | 2205 2300KV High-Efficiency Motors | Emax ECO II 2205 | $60.00 |
| **5.08** | Carbon-Reinforced Propellers | Polycarbonate / Carbon Fiber | 2 Sets | 6040 2-Blade Bullnose Props | HQProp 6x4x2 | $12.00 |
| **5.09** | Drone Autopilot Flight Controller | 32-Bit ARM Cortex-M7 | 1 | Pixhawk 6C Mini + Dual IMU + Baro | Holybro Pixhawk 6C Mini | $195.00 |
| **5.10** | Drone Miniature 4K Gimbal Camera | 2-Axis Brushless Gimbal | 1 | 4K 60FPS Video, Sony Sensor (Crown Scan) | RunCam Split 4K + Gimbal | $135.00 |
| **5.11** | Drone Landing Skids with Contact Shoes | Brass Shoes + Carbon Stems | 2 | 160 mm Long, Spring-Loaded Pins | Custom Fabricated | $24.00 |
| **5.12** | Drone Fast-Charging LiPo Battery Pack | Lithium Polymer (4S 2200 mAh) | 2 | 14.8V 2200 mAh 75C (Quick-Charge 5C) | Tattu R-Line 4S 2200 | $68.00 |

---

## 6. Subsystem 6: Electronics, Power Distribution & Compute

| Item | Component Description | Material / Manufacturing | Qty | Dimensions / Specification | COTS Supplier / Part No. | Est. Cost (USD) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **6.01** | Sealed Electronics Enclosure Housing | Die-Cast Al 380 (Gasketed) | 1 | 280 x 260 x 140 mm, IP65 Rated | Bud Industries AN-2808-A | $85.00 |
| **6.02** | Transparent Service Access Cover | Optical Polycarbonate (4 mm) | 1 | 290 x 270 x 4 mm with Neoprene O-Ring | Custom Laser Cut | $22.00 |
| **6.03** | Primary AI Edge Computer | SBC (BCM2712 2.4 GHz) | 1 | Raspberry Pi 5 (8GB RAM) + Active Cooler | Raspberry Pi 5-8GB | $80.00 |
| **6.04** | AI Neural Accelerator M.2 HAT | Hailo-8 M.2 Module (PCIe Gen3) | 1 | 26 TOPS Neural Inference (YOLOv8 Engine) | Hailo-8 M.2 + Pi5 HAT | $99.00 |
| **6.05** | Real-Time Motion Controller MCU | 32-Bit ARM Cortex-M4 Board | 1 | STM32F407VET6 Black Board (168 MHz) | STMicroelectronics | $18.00 |
| **6.06** | Dual-Channel Smart BLDC Motor Drivers | Aluminum Substrate MOSFETs | 2 | 24V 30A Continuous, CAN-Bus Protocol | ODrive Micro / Roboteq SDC | $190.00 |
| **6.07** | Industrial Power Distribution Board | 4-Layer 2oz Copper FR4 | 1 | 24V Bus, Solid-State Relays, 100A Shunt | Custom Engineered PDB | $45.00 |
| **6.08** | DC-DC Synchronous Step-Down Buck | Sealed Aluminum Brick | 2 | 24V to 12V 10A (120W) & 24V to 5V 10A (50W) | Mean Well RSD-100 / Pololu | $48.00 |
| **6.09** | Dual-Band RTK-GNSS High-Precision Unit | Multi-Constellation Receiver | 1 | u-blox ZED-F9P (GPS/GLONASS/Galileo/BDS) | SparkFun GPS-RTK2 (F9P) | $220.00 |
| **6.10** | High-Gain Multi-Band Helical Antenna | UV-Resistant Radome | 1 | L1/L2/L5 GPS/GLONASS/BeiDou/Galileo | u-blox ANN-MB-00 | $65.00 |
| **6.11** | 4G LTE-M / LoRaWAN Telemetry Modem | Quectel EC25 + SX1262 LoRa | 1 | Long-Range IoT Telemetry (868/915 MHz) | Waveshare 4G/LoRa HAT | $55.00 |
| **6.12** | Environmental Weather Station Shield | Aspirated Multi-Plate Louver | 1 | Sensirion SHT35 (Temp/RH) + BMP390 (Baro) | Custom Aspirated Radiation | $38.00 |
| **6.13** | Solid-State Front 3D Collision LiDAR | Semi-Solid State MEMS | 1 | 70° x 30° FOV, 0.1 - 25 m, 10 Hz | Livox Mid-360 / Benewake | $350.00 |
| **6.14** | Sealed Cable Glands (M12 / M16 / M20) | Nickel-Plated Brass (IP68) | 8 | Rubber Compression Bushing | Lapp Skintop MS-M | $28.00 |
| **6.15** | Forced-Air Cooling Labyrinth Blowers | Dual Ball Bearing (IP54) | 2 | 60x60x25 mm 24V PWM Fans with Dust Filter | Delta Electronics PFB0624 | $32.00 |

---

## 7. Subsystem 7: Low-CG Battery & Safety System

| Item | Component Description | Material / Manufacturing | Qty | Dimensions / Specification | COTS Supplier / Part No. | Est. Cost (USD) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **7.01** | Sliding Battery Tray Chassis Drawer | Al 5052-H32 (CNC Sheet) | 1 | 290 x 260 x 25 mm with Slam Latch | Custom Laser / Bending | $38.00 |
| **7.02** | Heavy-Duty Stainless Drawer Slides | SS 304 Full Extension | 1 Pr | 250 mm Travel, 45 kg Load Capacity | Accuride 3832SS | $34.00 |
| **7.03** | 24V 30Ah LiFePO4 Prismatic Battery Pack | Prismatic 3.2V 30Ah (8S1P) | 1 | 24V Nominal (25.6V), 768 Wh, 1C Discharge | CALB / CATL Prismatic 8S | $240.00 |
| **7.04** | Smart Battery Management System (BMS) | CAN-Bus / Bluetooth Telemetry | 1 | 8S 60A Continuous, Active Cell Balancing | Daly Smart BMS 8S 60A | $48.00 |
| **7.05** | Master Rotary Battery Isolation Switch | Polycarbonate / Copper Blades | 1 | 100A Continuous, 300A Surge, IP67 Keyed | Blue Sea Systems 6006 | $32.00 |
| **7.06** | Heavy-Duty Emergency Stop Pushbutton | Anodized Red Knob / IP67 Body | 1 | Push-to-Lock, Turn-to-Reset (2NC Contact) | IDEC HW1E-BV4F02R | $28.00 |
| **7.07** | High-Current Main Connector | Glass-Filled Polycarbonate | 2 | Anderson Powerpole SB50 (600V 50A) | Anderson Power Products SB50 | $14.00 |
| **7.08** | Automotive High-Current MIDI Fuse | Ceramic Body / Tin-Plated Zinc | 2 | 60A Fuse + Waterproof Sealed Fuse Holder | Littlefuse MIDI 0498060 | $12.00 |

---

## 8. Standard Fasteners Schedule (All Metric A2-70 Stainless Steel)

| Item | Fastener Type | Size & Thread | Quantity | Application / Subsystem | Standard |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **F.01** | Hex Socket Head Cap Screw | M3 x 8 mm | 40 | Electronics Standoffs, Microswitches, LiDAR Mounts | DIN 912 |
| **F.02** | Hex Socket Head Cap Screw | M3 x 14 mm | 24 | MGN15 Carriage & Rail Mounting | DIN 912 |
| **F.03** | Button Head Socket Screw | M4 x 10 mm | 32 | Side Panels to Extrusions, Bracket Clamps | ISO 7380 |
| **F.04** | Button Head Socket Screw | M4 x 16 mm | 20 | Motor Mount Plates to BLDC Faceplate | ISO 7380 |
| **F.05** | Hex Socket Head Cap Screw | M5 x 12 mm | 48 | Extrusion Gusset Brackets & Corner Plates | DIN 912 |
| **F.06** | Hex Socket Head Cap Screw | M5 x 20 mm | 24 | Battery Drawer Rails & Bumper Mount Brackets | DIN 912 |
| **F.07** | Hex Socket Head Cap Screw | M6 x 16 mm | 36 | Chassis Frame Tie Bolts & Mast Base Swivel | DIN 912 |
| **F.08** | Hex Head Flanged Wheel Lug Bolt | M10 x 25 mm (1.25p)| 16 | Wheel Rim to Machined Hub PCD Flange | DIN 6921 |
| **F.09** | Roll-In Spring T-Nuts for 4040 Extrusion | M5 Thread | 72 | Interior Frame Structural Connections | Misumi HNTT8-5 |
| **F.10** | Roll-In Spring T-Nuts for 4040 Extrusion | M6 Thread | 36 | High-Load Corner & Mast Connections | Misumi HNTT8-6 |
| **F.11** | Nylon Insert Lock Nuts (Nyloc) | M3 / M4 / M5 / M6 | 60 | Anti-Vibration Structural Locking | DIN 985 |
| **F.12** | Form A Flat Washers | M3 / M4 / M5 / M6 | 120 | Stress Distribution across Sheet Metal | DIN 125A |

---

## 9. Bill of Materials Summary & Cost Analysis

- **Total Mechanical & Structural Fabricated Parts:** 38 Line Items ($419.00)  
- **Total Drivetrain & Motors:** 9 Line Items ($928.00)  
- **Total Sensors, Vision & Camera Mast:** 10 Line Items ($769.00)  
- **Total Motorized Soil Probe Assembly:** 10 Line Items ($307.00)  
- **Total Drone Docking Station & Surveillance Quadcopter:** 12 Line Items ($735.00)  
- **Total Electronics, Compute & AI Acceleration:** 15 Line Items ($1,400.00)  
- **Total Battery Pack, BMS & Safety Interlocks:** 8 Line Items ($446.00)  
- **Total Fasteners & Hardware:** 12 Line Items ($85.00)  

**Estimated Total Prototype Cost:** **$5,089.00 USD**  
*(Comparable commercial agricultural autonomous scouts with RTK and drone docking range from $22,000 to $45,000 USD, representing over 75% cost savings for university mechatronics and field prototype deployment).*
