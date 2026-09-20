# Engineering Specifications & Calculations: AgriBot-X Agricultural Rover

**Project:** Autonomous AI Agricultural Plant Monitoring Rover with Integrated Drone Docking Station  
**Revision:** v1.0  
**Design Philosophy:** "GROUND + AIR + SOIL + PLANT VISION"  

---

## 1. Kinematic & Drivetrain Sizing Analysis

### 1.1 Rover Mass Budget
- Structural Chassis Frame & Bumpers: $11.5\text{ kg}$
- 4WD Wheels, Hubs, Axles & Bearings: $8.2\text{ kg}$
- 4x Planetary Geared BLDC Motors: $6.4\text{ kg}$
- 24V 30Ah LiFePO4 Battery Pack: $6.8\text{ kg}$
- Electronics Enclosure, Compute & Drivers: $3.2\text{ kg}$
- Camera Mast, Pan/Tilt Gimbal & Sensors: $2.4\text{ kg}$
- Motorized Soil Probe Mechanism: $2.1\text{ kg}$
- Drone Docking Platform & Latches: $2.8\text{ kg}$
- Surveillance Quadcopter Drone: $0.9\text{ kg}$
- Auxiliary Wiring, Fasteners & Mounting Plates: $2.2\text{ kg}$
- **Total Unloaded Robot Mass ($M_{base}$):** **$46.5\text{ kg}$**
- **Rated Agricultural Payload ($M_{payload}$):** **$15.0\text{ kg}$**
- **Maximum Gross Operating Mass ($M_{gross}$):** **$61.5\text{ kg}$** ($W = M_{gross} \times g = 61.5 \times 9.81 = 603.3\text{ N}$)

---

### 1.2 Agricultural Terrain Resistance & Tractive Force Calculations
The rover is designed to negotiate loose loam, wet clay, gravel tracks, and crop ridges with an incline of up to $\theta = 20^\circ$ (maximum slope $\theta_{max} = 25^\circ$).

#### A. Rolling Resistance Force ($F_{rr}$)
In tilled or soft agricultural soil, the rolling resistance coefficient ($C_{rr}$) for pneumatic chevron tires is approximately $0.12 - 0.18$. We design for the conservative worst case: $C_{rr} = 0.18$.
$$F_{rr} = C_{rr} \times M_{gross} \times g \times \cos(\theta) = 0.18 \times 603.3 \times \cos(20^\circ) = 0.18 \times 603.3 \times 0.9397 = 102.0\text{ N}$$

#### B. Grade Resistance Force ($F_{grade}$)
On a $20^\circ$ slope ($36.4\%$ grade):
$$F_{grade} = M_{gross} \times g \times \sin(\theta) = 603.3 \times \sin(20^\circ) = 603.3 \times 0.3420 = 206.3\text{ N}$$

#### C. Acceleration Force ($F_{accel}$)
Target acceleration to cruising speed ($v = 1.2\text{ m/s}$) in $t = 1.0\text{ s}$ ($a = 1.2\text{ m/s}^2$):
$$F_{accel} = M_{gross} \times a = 61.5 \times 1.2 = 73.8\text{ N}$$

#### D. Total Required Tractive Force (Drawbar Pull)
$$F_{total} = F_{rr} + F_{grade} + F_{accel} = 102.0\text{ N} + 206.3\text{ N} + 73.8\text{ N} = 382.1\text{ N}$$

With a $1.25$ safety margin for soil compaction and mud resistance:
$$F_{design} = 382.1 \times 1.25 = 477.6\text{ N}$$

---

### 1.3 Motor Torque & Planetary Gearbox Sizing
The drive system utilizes 4 independently driven wheels.
- Number of drive motors: $N = 4$
- Required tractive force per wheel:
  $$F_{wheel} = \frac{F_{design}}{4} = \frac{477.6\text{ N}}{4} = 119.4\text{ N}$$
- Wheel radius ($r_{wheel}$): $\frac{300\text{ mm}}{2} = 0.15\text{ m}$
- Required continuous torque per wheel axle ($T_{axle}$):
  $$T_{axle} = F_{wheel} \times r_{wheel} = 119.4\text{ N} \times 0.15\text{ m} = 17.91\text{ N}\cdot\text{m}$$

#### Motor Sizing Confirmation:
- Selected Motor: Linix/Nidec 24V BLDC Motor with integrated 1:20 Planetary Gearbox.
- Motor nominal speed: $3000\text{ RPM}$
- Gearbox reduction ratio: $i = 20:1$
- Gearbox efficiency: $\eta_{gear} = 88\%$
- Wheel axle output speed: $\frac{3000}{20} = 150\text{ RPM}$
- Maximum linear speed:
  $$v_{max} = \frac{150 \times 2\pi}{60} \times 0.15 = 15.71\text{ rad/s} \times 0.15\text{ m} = 2.36\text{ m/s}\quad (8.5\text{ km/h})$$
  *(Electronically speed-governed to $1.2 - 1.5\text{ m/s}$ during autonomous row navigation)*.
- Motor rated torque at base: $T_{motor} = 1.1\text{ N}\cdot\text{m}$
- Axle output torque available:
  $$T_{available} = T_{motor} \times i \times \eta_{gear} = 1.1 \times 20 \times 0.88 = 19.36\text{ N}\cdot\text{m} > 17.91\text{ N}\cdot\text{m}\quad \text{[PASS]}$$
- Peak stall torque per wheel: $45.0\text{ N}\cdot\text{m}$ (allows unsticking wheels in deep agricultural mud ruts).

---

## 2. Electrical Energy Budget & Battery Runtime Sizing

### 2.1 Power Consumption Breakdown

| Operating Subsystem | Voltage | Operating Current (Avg) | Power (Continuous) | Duty Cycle (%) | Effective Power (W) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **4WD Motors (Cruising)** | 24.0 V | 4.5 A (Total across 4) | 108.0 W | 65% | 70.2 W |
| **Raspberry Pi 5 (Edge AI)** | 5.0 V | 2.4 A | 12.0 W | 100% | 12.0 W |
| **Hailo-8 AI Inference (26 TOPS)**| 3.3 V | 0.8 A | 2.6 W | 70% | 1.8 W |
| **STM32F4 Motion Microcontroller** | 3.3 V | 0.15 A | 0.5 W | 100% | 0.5 W |
| **Camera Mast Pan/Tilt Gimbal** | 12.0 V | 0.6 A | 7.2 W | 40% | 2.9 W |
| **4K RGB + Depth RealSense D435i** | 5.0 V | 1.4 A | 7.0 W | 80% | 5.6 W |
| **Livox 3D Solid-State LiDAR** | 12.0 V | 1.0 A | 12.0 W | 100% | 12.0 W |
| **u-blox ZED-F9P RTK-GNSS + IMU**| 5.0 V | 0.3 A | 1.5 W | 100% | 1.5 W |
| **4G LTE / LoRaWAN Telemetry** | 5.0 V | 0.4 A | 2.0 W | 30% | 0.6 W |
| **Motorized Soil Probe Actuator** | 24.0 V | 1.5 A | 36.0 W | 15% (At Plant) | 5.4 W |
| **Sensors (Moist/pH/EC/Weather)** | 12.0 V | 0.2 A | 2.4 W | 50% | 1.2 W |
| **Cooling Blowers & Safety LEDs** | 24.0 V | 0.4 A | 9.6 W | 100% | 9.6 W |
| **Drone Fast-Charging Dock** | 24.0 V | 5.0 A (During Dock) | 120.0 W | 12% | 14.4 W |
| **TOTAL WEIGHTED AVERAGE CONSUMPTION** | — | — | — | — | **137.7 W** |

---

### 2.2 Battery Capacity & Field Endurance
- Selected Battery Pack: $24\text{V}$ (8S1P Prismatic LiFePO4 cells, nominal $25.6\text{V}$, $30.0\text{Ah}$).
- Total Pack Stored Energy:
  $$E_{total} = 25.6\text{V} \times 30.0\text{Ah} = 768.0\text{ W}\cdot\text{h}$$
- Usable Depth of Discharge (DoD) for extended 2000+ cycle life: $85\%$
  $$E_{usable} = 768.0 \times 0.85 = 652.8\text{ W}\cdot\text{h}$$
- Continuous Operating Field Autonomy ($t_{field}$):
  $$t_{field} = \frac{E_{usable}}{P_{avg}} = \frac{652.8\text{ W}\cdot\text{h}}{137.7\text{ W}} = 4.74\text{ hours}\quad (\approx 4\text{h } 45\text{m})$$

#### Field Plant Coverage Analysis:
- Target Field Density: $150\text{ plants per acre}$.
- Average inter-plant spacing: $5.2\text{ meters}$.
- Rover transit time between plants at $1.0\text{ m/s}$: $5.2\text{ seconds}$.
- Measurement stop duration (Visual scan + soil probing): $15.0\text{ seconds}$.
- Time per plant cycle: $20.2\text{ seconds}$.
- Inspection rate: $\approx 178\text{ plants per hour}$.
- In a single $4.75\text{-hour}$ battery charge, the rover monitors:
  $$N_{plants} = 178 \times 4.74 \approx 844\text{ plants}\quad (\approx 5.6\text{ acres per charge!})$$

---

## 3. Motorized Soil Probe Mechanics & Force Analysis

### 3.1 Penetration Resistance in Agricultural Soils
Soil cone penetrometer resistance in agricultural root zones typically ranges from $0.8\text{ MPa}$ to $2.0\text{ MPa}$ ($80 - 200\text{ N/cm}^2$).
- Sensor Probe Tip Cross-Sectional Area ($A_{tip}$):
  $$A_{tip} = \frac{\pi \times d_{tip}^2}{4} = \frac{\pi \times (14\text{ mm})^2}{4} = 153.94\text{ mm}^2 = 1.54\text{ cm}^2$$
- Peak Axial Insertion Force ($F_{thrust}$):
  $$F_{thrust} = 2.0\text{ MPa} \times 153.94\text{ mm}^2 = 307.9\text{ N}$$

### 3.2 Lead Screw Driving Torque Calculation
- Lead Screw: Precision T8x2 stainless steel ($d = 8\text{ mm}$, pitch $p = 2\text{ mm}$, lead $L = 2\text{ mm}$).
- Lead angle ($\lambda$):
  $$\tan(\lambda) = \frac{L}{\pi \times d_m} = \frac{2}{\pi \times 7.0} = 0.0909 \implies \lambda = 5.20^\circ$$
- Bronze nut coefficient of friction ($\mu = 0.15$, friction angle $\phi = \arctan(0.15) = 8.53^\circ$).
- Torque required to drive lead screw downward into soil:
  $$T_{drive} = \frac{F_{thrust} \times d_m}{2} \tan(\lambda + \phi) = \frac{307.9 \times 0.007}{2} \times \tan(5.20^\circ + 8.53^\circ) = 1.078 \times \tan(13.73^\circ) = 0.263\text{ N}\cdot\text{m}\quad (26.3\text{ N}\cdot\text{cm})$$
- Selected NEMA 17 Stepper Motor produces $65.0\text{ N}\cdot\text{cm}$ holding torque.
- Safety Factor:
  $$SF = \frac{65.0}{26.3} = 2.47\quad \text{[PASS]}$$
- If the probe encounters an impenetrable rock or heavy obstruction, motor current increases beyond $2.2\text{A}$, triggering instantaneous electronic stall retraction to prevent structural deflection or sensor tip damage.

---

## 4. Drone Docking Station Kinematics & Charging Interface

### 4.1 Funnel Centering Dynamics
- Platform deck size: $480 \times 480\text{ mm}$
- Autonomous RTK + Optical Flow Landing Footprint: $\pm 35\text{ mm}$ position accuracy.
- Mechanical Funnel Incline: $30^\circ$ low-friction UHMW-PE guide wedges on all 4 quadrants.
- Inward horizontal centering force produced by drone self-weight ($m_{drone} = 0.90\text{ kg}$, $W_{d} = 8.83\text{ N}$):
  $$F_{centering} = W_d \times \sin(30^\circ) \times \cos(30^\circ) = 8.83 \times 0.5 \times 0.866 = 3.82\text{ N}$$
- Friction force with UHMW-PE ($\mu = 0.12$):
  $$F_{friction} = \mu \times W_d \times \cos(30^\circ) = 0.12 \times 8.83 \times 0.866 = 0.92\text{ N}$$
- Net self-centering sliding force:
  $$F_{net} = 3.82\text{ N} - 0.92\text{ N} = 2.90\text{ N} > 0\quad \text{[100% Reliable Gravitational Self-Centering]}$$

### 4.2 Spring Contact Electrical Charging Interface
- 2x Beryllium copper gold-plated busbars ($+24\text{V}$ and $\text{GND}$) embedded with $4\text{ mm}$ spring travel.
- Contact Force per shoe: $4.5\text{ N}$ (ensures contact resistance $R_{contact} < 15\text{ m}\Omega$).
- Fast charging rate: $24\text{V} \to 16.8\text{V}$ DC-DC CC/CV algorithm at $5\text{A}$ ($84\text{W}$).
- Recharges drone $4\text{S } 2200\text{ mAh}$ flight pack in $25\text{ minutes}$ while rover continues ground operations.

---

## 5. Electrical Wiring & System Interconnect Topology

```
+---------------------------------------------------------------------------------------+
|                                24V 30Ah LiFePO4 BATTERY PACK                          |
+---------------------------------------------------------------------------------------+
                                           |
                                [100A Rotary Isolator]
                                           |
                                  [60A MIDI Fuse]
                                           |
                                  [IP67 E-Stop Pushbutton]
                                           |
                   +-----------------------+-----------------------+
                   |                                               |
         [24V Motor Bus]                                  [Solid-State Main PDB]
                   |                                               |
     +-------------+-------------+                  +--------------+---------------+
     |                           |                  |                              |
[Dual BLDC Driver 1]   [Dual BLDC Driver 2]   [24V->12V 10A Buck]            [24V->5V 10A Buck]
  (Front L & R Motors)   (Rear L & R Motors)        |                              |
     |                           |                  +---> Livox 3D LiDAR           +---> RPi 5 (8GB)
 [4x 1024 PPR Encoders]          |                  +---> Pan/Tilt Servos          +---> Hailo-8 M.2 Hat
                                 |                  +---> Weather Shield           +---> RealSense D435i
                                 |                  +---> RS485 Transceiver        +---> u-blox F9P RTK
                                 |                                                 +---> STM32F4 MCU
                                 +-------------------------------------------------+---> LoRa / 4G Modem
                                                    |
                                       [CAN-Bus 2.0B / 1 Mbps Network]
                                                    |
             +--------------------+-----------------+--------------------+
             |                    |                                      |
      [Raspberry Pi 5]    [STM32F4 Motion MCU]                [Drone Dock Controller]
       - ROS 2 Humble      - Motor PID Closed Loops            - Optical Alignment LEDs
       - YOLOv8 Crop AI    - Soil Probe Step/Dir Control       - Retention Clamps
       - GIS Waypoints     - Limit Switches & Bumpers          - Fast-Charge Relay
```

---

## 6. Autonomous Plant Identification & GIS Field Map (P001 – P150)

The field mapping engine organizes crop monitoring around centimeter-accurate RTK coordinates:

```json
{
  "plant_id": "P042",
  "crop_type": "Arecanut",
  "coordinates": {
    "latitude": 12.9715987,
    "longitude": 77.5945627,
    "altitude_m": 892.45
  },
  "row_number": 3,
  "plant_index_in_row": 14,
  "historical_records": [
    {
      "timestamp": "2026-09-16T14:30:00Z",
      "foliage_health_index": 0.88,
      "detected_issues": ["Early Leaf Blight Stage 1"],
      "soil_metrics": {
        "moisture_vwc_percent": 34.2,
        "soil_temperature_c": 24.8,
        "ph": 6.4,
        "ec_us_cm": 1240
      },
      "aerial_inspection_required": true,
      "aerial_image_url": "s3://agribot-field/P042_canopy_4k.jpg"
    }
  ]
}
```

---

## 7. Ground + Air + Soil + Plant Vision Workflow

```
[START: WAYPOINT NAVIGATION ALONG CROP ROW]
                   │
                   ▼
       [ARRIVE AT TARGET PLANT (P_xxx)]
       Centimeter RTK-GNSS + Odometry Stop
                   │
                   ▼
     [GROUND CAMERA MULTI-ANGLE SCAN]
  - 4K RGB Camera: Leaf texture, spots, discoloration
  - Stereo Depth: Canopy volume, stem diameter
  - Multispectral: 5-band NDVI chlorophyll stress
                   │
                   ▼
       [MOTORIZED SOIL MEASUREMENT]
  - Lower probe via linear guide rail (150 mm stroke)
  - Measure: Moisture (VWC%), Soil Temp, pH, EC
  - Automatic retraction & limit switch confirmation
                   │
                   ▼
       [EDGE AI REAL-TIME INFERENCE]
  Raspberry Pi 5 + Hailo-8 (YOLOv8 Plant Pathology)
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
[Standard Crop Height]    [TALL CANOPY / INACCESSIBLE CROP]
(Foliage fully imaged)    (e.g., Arecanut, Coconut crown, >3m height)
         │                   │
         │                   ▼
         │         [DRONE TAKEOFF & ASCENT]
         │         - Release mechanical retention clamps
         │         - Vertical takeoff to 8-15 m canopy altitude
         │         - Autonomous 4K Gimbal Crown Inspection
         │                   │
         │                   ▼
         │         [DRONE RETURN & PRECISION LANDING]
         │         - Visual servoing to ArUco 'H' dock marker
         │         - Funnel guide mechanical self-centering
         │         - Engage retention lock & initiate 24V charge
         │                   │
         └─────────┬─────────┘
                   │
                   ▼
       [CLOUD TELEMETRY SYNCHRONIZATION]
    Log P_xxx metrics via 4G LTE-M / LoRaWAN
                   │
                   ▼
       [NAVIGATE TO NEXT PLANT: P_xxx+1]
```
