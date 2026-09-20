# Fabrication & Assembly Guide: AgriBot-X Autonomous Agricultural Rover

**Project:** Autonomous AI Agricultural Plant Monitoring Rover with Integrated Drone Docking Station  
**Revision:** v1.0  
**Target Audience:** Mechatronics Engineers, Machine Shop Technicians, Field Prototyping Teams  

---

## 1. Manufacturing & Tooling Preparation

### 1.1 Equipment Requirements
- **CNC Milling Machine / Router:** 3-Axis CNC with minimum $400 \times 300\text{ mm}$ work envelope for aluminum bracketry and hub machining.
- **CNC Waterjet / Fiber Laser:** For cutting $5.0\text{ mm}$ 6061-T6 aluminum plates and $2.5\text{ mm}$ 5052 sheet metal panels.
- **Manual / CNC Engine Lathe:** For turning Ø20 mm g6 drive axles and wheel hub flange bores with keyways.
- **Press Brake:** For bending sheet metal side covers ($90^\circ$ bends with $R=2.5\text{ mm}$ radius).
- **FDM 3D Printer:** (e.g., Bambu Lab X1C / Prusa MK4) with hardened steel nozzle for printing PA-CF (Carbon Fiber Nylon) or PETG sensor brackets and camera shrouds.
- **Metric Hand Tools:** Ball-end hex drivers (1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0 mm), socket wrenches, digital calipers (0-300 mm), torque wrench ($1 - 25\text{ N}\cdot\text{m}$ range).

### 1.2 Fastener Torque Specifications (A2-70 Stainless Steel)
| Fastener Thread | Target Torque ($\text{N}\cdot\text{m}$) | Target Torque ($\text{in}\cdot\text{lb}$) | Threadlocker Requirement |
| :--- | :--- | :--- | :--- |
| **M3** | $1.2\text{ N}\cdot\text{m}$ | $10.6\text{ in}\cdot\text{lb}$ | Loctite 222 (Purple - Low Strength) |
| **M4** | $2.8\text{ N}\cdot\text{m}$ | $24.8\text{ in}\cdot\text{lb}$ | Loctite 243 (Blue - Medium Strength) |
| **M5** | $5.5\text{ N}\cdot\text{m}$ | $48.7\text{ in}\cdot\text{lb}$ | Loctite 243 (Blue - Medium Strength) |
| **M6** | $9.5\text{ N}\cdot\text{m}$ | $84.1\text{ in}\cdot\text{lb}$ | Loctite 243 (Blue - Medium Strength) |
| **M8** | $23.0\text{ N}\cdot\text{m}$ | $203.5\text{ in}\cdot\text{lb}$ | Loctite 243 (Blue - Medium Strength) |
| **M10 (Lug Bolts)** | $45.0\text{ N}\cdot\text{m}$ | $398.0\text{ in}\cdot\text{lb}$ | Dry / Anti-Seize on wheel studs |

---

## 2. Step-by-Step Assembly Instructions

### Phase 1: Structural Chassis Frame Assembly
1. **Pre-load T-Nuts:** Before assembling aluminum extrusions, insert roll-in spring T-nuts into the extrusion slots according to the CAD layout:
   - Lower rails: 8x M5 T-nuts per rail for motor brackets, 4x M5 for battery drawer slides.
   - Upper rails: 6x M5 T-nuts for top docking platform mounts, 4x M6 for camera mast base.
2. **Square the Base Perimeter:** Assemble the lower 4040 rails ($650\text{ mm}$ longitudinal) and crossmembers ($280\text{ mm}$) using 8x 6061-T6 corner gussets and M5x12 socket head screws. Verify diagonal dimensions with digital calipers ($\pm 0.5\text{ mm}$ squareness tolerance).
3. **Install 5mm Base Plate:** Lay the CNC-machined 6061 base plate onto the lower frame. Fasten using counter-sunk M5 screws with blue threadlocker.
4. **Erect Vertical Corner Struts:** Mount the 4x $270\text{ mm}$ 4040 corner posts. Torqued to $5.5\text{ N}\cdot\text{m}$.
5. **Install Upper Deck Frame:** Fasten the upper $650\text{ mm}$ longitudinal rails and crossmembers to cap the rigid boxed structure.
6. **Mount Bumpers & Dampeners:** Secure the front and rear Ø32 mm tubular bumpers using the rubber isolation mounts (EPDM Shore 60A) to decouple terrain collision shocks from sensitive electronics.

---

### Phase 2: Drivetrain, Hubs & 4WD Wheels
1. **Bearing Press Fit:** Press the dual 6005-2RS sealed ball bearings into the CNC-machined bearing pillow blocks using an arbor press. Ensure bearing outer races seat fully against the internal retention shoulder.
2. **Axle & Keyway Insertion:** Slide the Ø20 mm g6 hardened stainless steel axle through the bearings. Install the DIN 6885 $6 \times 6 \times 25\text{ mm}$ drive key.
3. **Wheel Hub Installation:** Press the machined wheel hub flange over the axle and secure with an axial shaft collar or M8 end-bolt.
4. **Motor Coupling:** Align the BLDC planetary gearbox output shaft with the drive axle. Fasten the motor mounting bracket to the 4040 frame using 4x M6 bolts. Verify zero binding by spinning the hub freely by hand.
5. **Mount All-Terrain Tires:** Bolt the $300\text{ mm}$ chevron tires and 6" steel rims onto the hub studs using 4x M10 flanged lug nuts. Tighten in an alternating cross-pattern to $45\text{ N}\cdot\text{m}$.

---

### Phase 3: Motorized Retractable Soil Probe
1. **Linear Rail Mounting:** Fasten the MGN15H precision linear guide rail ($250\text{ mm}$) vertically onto the front-left chassis upright. Use dial indicator to ensure vertical runout is $< 0.05\text{ mm}$ across the $250\text{ mm}$ span.
2. **Lead Screw & Carriage:** Attach the T8x2 brass anti-backlash nut to the CNC carriage plate. Thread the lead screw through the nut and couple it to the NEMA 17 stepper motor via the flexible jaw coupling.
3. **Probe Chuck & Sensor Installation:** Thread the stainless steel quick-release knurled chuck into the carriage. Insert the multi-parameter soil sensor cartridge (Moisture, pH, EC, Temp) and hand-tighten the knurled collar.
4. **Limit Switch Calibration:** Position the upper home limit switch such that the probe tip retracts to $Z = 220\text{ mm}$ (leaving $20\text{ mm}$ safety margin above the $200\text{ mm}$ ground clearance plane). Position the lower limit switch at $Z = 50\text{ mm}$ (corresponding to $150\text{ mm}$ maximum stroke into the ground).
5. **Manual Stroke Test:** Rotate the lead screw by hand to verify smooth travel throughout the entire $150\text{ mm}$ stroke without binding.

---

### Phase 4: Height-Adjustable Camera Mast & Gimbal
1. **Vertical Rail Installation:** Bolt the $400\text{ mm}$ vertical 4040 extrusion to the front crossmember bracket ($X = +270\text{ mm}$, $Y = -160\text{ mm}$).
2. **Install Sliding Carriage:** Slide the adjustable clamping carriage onto the rail. Fasten the quick-release cam lever.
3. **Mount 2-Axis Gimbal:** Bolt the pan servo base to the carriage. Attach the tilt fork and camera housing.
4. **Camera & Sensor Integration:**
   - Mount the Sony IMX477 4K RGB camera with 6mm lens in the primary upper housing.
   - Mount the Intel RealSense D435i depth camera directly beneath the RGB camera.
   - Mount the multispectral sensor array adjacent to the RGB lens.
5. **RTK Antenna & Strobe Mast:** Screw the high-gain helical RTK antenna into the elevated mast top riser ($Z = 1060\text{ mm}$) and mount the amber autonomous strobe beacon.
6. **Cable Drag Chain:** Snap the Igus cable drag chain alongside the vertical mast, routing the USB 3.0 and power cables cleanly into the chassis interior.

---

### Phase 5: Drone Docking Station Assembly
1. **Landing Deck Mounting:** Place the $480 \times 480\text{ mm}$ carbon/aluminum deck plate atop the upper chassis rails. Fasten with 4x M6 quick-release thumb knobs.
2. **Beveled Guide Wedges:** Screw the 4x 30° UHMW-PE alignment ramps along the perimeter of the landing zone.
3. **Charging Rails:** Install the spring-loaded copper contact strips into the recessed tracks at $Y = \pm 142\text{ mm}$. Connect 14 AWG silicone wiring to the docking fast-charging relay.
4. **Retention Servos:** Mount the 2x micro-servos with locking retention cams beneath the deck. Test that the latches engage and lock the drone landing skids firmly.
5. **Perimeter LED Strip:** Adhere the IP68 RGB-LED strip around the inner perimeter of the dock and seal cable penetrations with neutral-cure RTV silicone.

---

### Phase 6: IP65 Electronics Enclosure & Battery Compartment
1. **Internal PCB Stacking:** Mount the Raspberry Pi 5 + Hailo-8 M.2 HAT, STM32F407 motion controller, and dual BLDC motor drivers onto the modular FR4 mounting baseplate using M3 nylon standoffs.
2. **Cable Gland Wiring:** Thread motor power, encoder, CAN-bus, sensor, and camera cables through the IP68 nickel-plated brass cable glands. Tighten glands until the rubber seal compresses firmly around each cable jacket.
3. **Cover Gasket Sealing:** Clean the enclosure perimeter groove. Seat the continuous neoprene O-ring gasket. Tighten the transparent polycarbonate lid screws in a criss-cross pattern to $1.2\text{ N}\cdot\text{m}$.
4. **Battery Drawer Installation:** Bolt the Accuride stainless steel drawer slides into the lower chassis cradle. Insert the battery tray with the $24\text{V } 30\text{Ah}$ LiFePO4 pack. Ensure the mechanical safety slam-latch clicks securely into place.
5. **Emergency Stop & Isolator Switch:** Mount the red E-stop button and 100A rotary disconnect switch on the rear panel.

---

## 3. Commissioning & Verification Checklist

### Pre-Power Checks
- [ ] Inspect all frame bolts with torque wrench to ensure proper fastener torque.
- [ ] Perform multimeter continuity check between rover chassis frame and battery ground (must be isolated; floating chassis ground to prevent ground loops).
- [ ] Verify that 60A MIDI main fuse is installed and all power rails ($24\text{V}, 12\text{V}, 5\text{V}, 3.3\text{V}$) are not shorted to ground.

### Initial Power-On & Firmware Bring-up
- [ ] Engage 100A rotary isolation switch. Verify power distribution LEDs illuminate.
- [ ] Confirm DC-DC converters output steady $12.0\text{V} \pm 0.1\text{V}$ and $5.1\text{V} \pm 0.05\text{V}$.
- [ ] Boot Raspberry Pi 5. Verify ROS 2 Humble node initialization and Hailo-8 neural coprocessor enumeration via `hailortcli fw-control identify`.
- [ ] Ping STM32F4 motion controller over CAN-bus at 1 Mbps. Verify motor encoder readouts match wheel rotation.
- [ ] Test Emergency Stop pushbutton: depress button and confirm motor bus power drops to 0V within $< 15\text{ ms}$.

### Subsystem Operational Testing
- [ ] **4WD Drivetrain:** Command rover forward at $0.5\text{ m/s}$ in open area. Verify straight-line tracking using odometry and RTK-GNSS.
- [ ] **Camera Mast:** Command pan $\pm 180^\circ$ and tilt $-45^\circ$ to $+90^\circ$. Verify smooth video stream from 4K Sony IMX477 and depth stream from RealSense D435i.
- [ ] **Soil Probe Cycle:** Command auto-probing sequence. Probe must lower smoothly, stop at lower limit switch, read moisture/pH/EC/temp, and retract to home position.
- [ ] **Drone Docking:** Place drone onto dock. Verify charging voltage ($16.8\text{V}$ at $5\text{A}$) across contacts. Command retention servos to lock/unlock drone skids.
- [ ] **Autonomous Navigation:** Load sample P001–P010 field map. Run autonomous waypoint following between crop rows. Verify rover stops within $\pm 2\text{ cm}$ of each plant coordinate.
