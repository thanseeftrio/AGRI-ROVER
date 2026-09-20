"""
AgriBot-X: AutoCAD 2026 2D Manufacturing Package & Judges PDF Generator
Generates:
1. cad/agribot_2d_manufacturing_package.dxf (4-Sheet CAD Drawing Package, 1 view per sheet, zero BOM/cost)
2. cad/AgriBot_AutoCAD_2D_Judges_Package.pdf (Multi-page PDF rendered directly from DXF with white background)
3. cad/AgriBot_AutoCAD_2D_Sheet1_Front_GA.pdf
4. cad/AgriBot_AutoCAD_2D_Sheet2_Top_Plan.pdf
5. cad/AgriBot_AutoCAD_2D_Sheet3_Side_Elevation.pdf
6. cad/AgriBot_AutoCAD_2D_Sheet4_3D_Isometric.pdf
"""

import os
import math
import ezdxf
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import pymupdf

def build_cad_dxf(output_dxf_path):
    doc = ezdxf.new(dxfversion="R2010")
    msp = doc.modelspace()
    
    # Layer definitions with standard AutoCAD ACI colors
    layers = [
        ('BORDER', 7),       # White/Black
        ('TITLE_BLOCK', 7),  # White/Black
        ('CHASSIS', 7),      # White/Black
        ('WHEELS', 7),       # White/Black
        ('SUSPENSION', 4),   # Cyan
        ('LIGHTING', 4),     # Cyan
        ('CAMERA', 7),       # White/Black
        ('DRONE', 7),        # White/Black
        ('DRONE_DOCK', 7),   # White/Black
        ('SOIL_PROBE', 7),   # White/Black
        ('DIMENSIONS', 1),   # Red
        ('CENTERLINES', 1),  # Red
        ('NOTES', 7)         # White/Black
    ]
    for name, col in layers:
        doc.layers.add(name, color=col)
        
    def draw_iso_sheet_border(ox, oy, w=1200, h=850, sheet_num=1, sheet_title="FRONT ELEVATION"):
        # Outer Border
        msp.add_lwpolyline([(ox, oy), (ox + w, oy), (ox + w, oy + h), (ox, oy + h), (ox, oy)], dxfattribs={'layer': 'BORDER'})
        
        # Inner Border
        ix0, iy0 = ox + 20, oy + 15
        ix1, iy1 = ox + w - 15, oy + h - 15
        msp.add_lwpolyline([(ix0, iy0), (ix1, iy0), (ix1, iy1), (ix0, iy1), (ix0, iy0)], dxfattribs={'layer': 'BORDER'})
        
        # Standard ISO Title Block at Bottom Right (220 mm wide x 70 mm high)
        tb_w = 220.0
        tb_h = 70.0
        tb_x0 = ix1 - tb_w
        tb_y0 = iy0
        tb_x1 = ix1
        tb_y1 = iy0 + tb_h
        msp.add_lwpolyline([(tb_x0, tb_y0), (tb_x1, tb_y0), (tb_x1, tb_y1), (tb_x0, tb_y1), (tb_x0, tb_y0)], dxfattribs={'layer': 'TITLE_BLOCK'})
        msp.add_line((tb_x0, tb_y0 + 24), (tb_x1, tb_y0 + 24), dxfattribs={'layer': 'TITLE_BLOCK'})
        msp.add_line((tb_x0, tb_y0 + 47), (tb_x1, tb_y0 + 47), dxfattribs={'layer': 'TITLE_BLOCK'})
        msp.add_line((tb_x0 + 135, tb_y0), (tb_x0 + 135, tb_y0 + 47), dxfattribs={'layer': 'TITLE_BLOCK'})
        
        # Header Cell
        msp.add_text("AGRIBOT-X AUTONOMOUS ROVER", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 4.2}).set_placement((tb_x0 + 8, tb_y0 + 57))
        msp.add_text(f"TITLE: {sheet_title}", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 4.5}).set_placement((tb_x0 + 8, tb_y0 + 50))
        
        # Middle Cell (Left: Design/Standard, Right: Scale/Sheet)
        msp.add_text("DESIGN: HIGH-CLEARANCE STRUT", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 2.8}).set_placement((tb_x0 + 8, tb_y0 + 36))
        msp.add_text("STANDARD: ISO 2768-m TOLERANCES", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 2.8}).set_placement((tb_x0 + 8, tb_y0 + 28))
        msp.add_text("SCALE: 1:1 TRUE CAD", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 2.8}).set_placement((tb_x0 + 142, tb_y0 + 36))
        msp.add_text(f"SHEET: {sheet_num} OF 4", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 3.6}).set_placement((tb_x0 + 142, tb_y0 + 28))
        
        # Bottom Cell (Left: DWG NO, Right: Rev)
        msp.add_text(f"DWG NO: AGX-2026-0{sheet_num}", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 3.2}).set_placement((tb_x0 + 8, tb_y0 + 10))
        msp.add_text("REV: C.02 (CLEAN)", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 2.8}).set_placement((tb_x0 + 142, tb_y0 + 10))
        
        # Stamp at Top Left
        msp.add_lwpolyline([(ix0 + 10, iy1 - 30), (ix0 + 80, iy1 - 30), (ix0 + 80, iy1 - 10), (ix0 + 10, iy1 - 10), (ix0 + 10, iy1 - 30)], dxfattribs={'layer': 'TITLE_BLOCK'})
        msp.add_text(f"DWG-0{sheet_num}", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 4.0}).set_placement((ix0 + 15, iy1 - 23))
        msp.add_text(f"AGRIBOT-X SPECIFICATION - {sheet_title}", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 3.6}).set_placement((ix0 + 90, iy1 - 23))

    def draw_dimension_h(x1, x2, y, text_str, ext_y1=None, ext_y2=None):
        msp.add_line((x1, y), (x2, y), dxfattribs={'layer': 'DIMENSIONS'})
        # Arrows (ticks)
        msp.add_line((x1, y - 6), (x1 + 14, y), dxfattribs={'layer': 'DIMENSIONS'})
        msp.add_line((x1, y + 6), (x1 + 14, y), dxfattribs={'layer': 'DIMENSIONS'})
        msp.add_line((x2, y - 6), (x2 - 14, y), dxfattribs={'layer': 'DIMENSIONS'})
        msp.add_line((x2, y + 6), (x2 - 14, y), dxfattribs={'layer': 'DIMENSIONS'})
        # Text
        cx = (x1 + x2) / 2.0
        msp.add_text(text_str, dxfattribs={'layer': 'DIMENSIONS', 'height': 3.6}).set_placement((cx - len(text_str)*1.9, y + 4))
        # Extensions
        if ext_y1 is not None and ext_y2 is not None:
            msp.add_line((x1, ext_y1), (x1, ext_y2), dxfattribs={'layer': 'DIMENSIONS'})
            msp.add_line((x2, ext_y1), (x2, ext_y2), dxfattribs={'layer': 'DIMENSIONS'})

    def draw_dimension_v(y1, y2, x, text_str, ext_x1=None, ext_x2=None):
        msp.add_line((x, y1), (x, y2), dxfattribs={'layer': 'DIMENSIONS'})
        # Arrows
        msp.add_line((x - 6, y1), (x, y1 + 14), dxfattribs={'layer': 'DIMENSIONS'})
        msp.add_line((x + 6, y1), (x, y1 + 14), dxfattribs={'layer': 'DIMENSIONS'})
        msp.add_line((x - 6, y2), (x, y2 - 14), dxfattribs={'layer': 'DIMENSIONS'})
        msp.add_line((x + 6, y2), (x, y2 - 14), dxfattribs={'layer': 'DIMENSIONS'})
        # Text
        cy = (y1 + y2) / 2.0
        msp.add_text(text_str, dxfattribs={'layer': 'DIMENSIONS', 'height': 3.6, 'rotation': 90}).set_placement((x - 5, cy - len(text_str)*1.8))
        if ext_x1 is not None and ext_x2 is not None:
            msp.add_line((ext_x1, y1), (ext_x2, y1), dxfattribs={'layer': 'DIMENSIONS'})
            msp.add_line((ext_x1, y2), (ext_x2, y2), dxfattribs={'layer': 'DIMENSIONS'})

    # =========================================================================
    # SHEET 1: FRONT ELEVATION VIEW (0, 0 to 1200, 850)
    # =========================================================================
    print("Generating Sheet 1: Front Elevation GA View...")
    draw_iso_sheet_border(0, 0, 1200, 850, sheet_num=1, sheet_title="FRONT ELEVATION VIEW")
    s1_cx = 580.0
    s1_gz = 135.0 # Ground Datum at Y = 135 (plenty of room below for dimensions & notes)
    
    # Ground datum line & hatching (stops at X = 950, well clear of title block at X = 965!)
    msp.add_line((180, s1_gz), (950, s1_gz), dxfattribs={'layer': 'CENTERLINES'})
    for hx in range(200, 940, 40):
        msp.add_line((hx, s1_gz), (hx - 15, s1_gz - 15), dxfattribs={'layer': 'CENTERLINES'})
    msp.add_text("GROUND SOIL DATUM (Z = 0.0 MM)", dxfattribs={'layer': 'NOTES', 'height': 3.0}).set_placement((s1_cx - 85, s1_gz - 18))
    
    # Left Tractor Tire (X: 240 to 345, Y: 135 to 475)
    # Right Tractor Tire (X: 815 to 920, Y: 135 to 475) -> Track stance = 920 - 240 = 680 mm!
    msp.add_lwpolyline([(240, s1_gz), (345, s1_gz), (345, s1_gz + 340), (240, s1_gz + 340), (240, s1_gz)], dxfattribs={'layer': 'WHEELS'})
    msp.add_lwpolyline([(258, s1_gz + 30), (327, s1_gz + 30), (327, s1_gz + 310), (258, s1_gz + 310), (258, s1_gz + 30)], dxfattribs={'layer': 'WHEELS'})
    msp.add_circle((292.5, s1_gz + 170), 20, dxfattribs={'layer': 'WHEELS'})
    msp.add_circle((292.5, s1_gz + 170), 5, dxfattribs={'layer': 'WHEELS'})
    
    msp.add_lwpolyline([(815, s1_gz), (920, s1_gz), (920, s1_gz + 340), (815, s1_gz + 340), (815, s1_gz)], dxfattribs={'layer': 'WHEELS'})
    msp.add_lwpolyline([(833, s1_gz + 30), (902, s1_gz + 30), (902, s1_gz + 310), (833, s1_gz + 310), (833, s1_gz + 30)], dxfattribs={'layer': 'WHEELS'})
    msp.add_circle((867.5, s1_gz + 170), 20, dxfattribs={'layer': 'WHEELS'})
    msp.add_circle((867.5, s1_gz + 170), 5, dxfattribs={'layer': 'WHEELS'})
    
    # Elevated Monocoque Hull (Belly at Y = 555 mm -> 420 mm ground clearance!)
    belly_y = s1_gz + 420.0
    msp.add_line((410, belly_y), (750, belly_y), dxfattribs={'layer': 'CHASSIS'})
    # Mid Hull Chamfers
    msp.add_lwpolyline([
        (410, belly_y), (365, belly_y + 80), (795, belly_y + 80), (750, belly_y), (410, belly_y)
    ], dxfattribs={'layer': 'CHASSIS'})
    # Upper Faceted Canopy Shell
    msp.add_lwpolyline([
        (365, belly_y + 80), (430, belly_y + 190), (730, belly_y + 190), (795, belly_y + 80), (365, belly_y + 80)
    ], dxfattribs={'layer': 'CHASSIS'})
    
    # Electric-Blue Continuous LED Brow Bar
    msp.add_lwpolyline([
        (380, belly_y + 120), (780, belly_y + 120), (780, belly_y + 136), (380, belly_y + 136), (380, belly_y + 120)
    ], dxfattribs={'layer': 'LIGHTING'})
    
    # Dual-Sensor Turret (Top at Y = 775, leaves 60 mm margin to top border!)
    msp.add_lwpolyline([
        (545, belly_y + 190), (615, belly_y + 190), (615, belly_y + 230), (545, belly_y + 230), (545, belly_y + 190)
    ], dxfattribs={'layer': 'CAMERA'})
    msp.add_circle((565, belly_y + 210), 9, dxfattribs={'layer': 'CAMERA'})
    msp.add_circle((595, belly_y + 210), 9, dxfattribs={'layer': 'CAMERA'})
    
    # Exposed White Coilover Shocks (Left & Right)
    for sign, kx in [(-1, 335), (1, 825)]:
        msp.add_line((kx, s1_gz + 190), (kx, s1_gz + 460), dxfattribs={'layer': 'SUSPENSION'})
        for cy in range(int(s1_gz + 210), int(s1_gz + 440), 20):
            msp.add_line((kx - 16, cy), (kx + 16, cy + 10), dxfattribs={'layer': 'SUSPENSION'})
            msp.add_line((kx + 16, cy + 10), (kx - 16, cy + 20), dxfattribs={'layer': 'SUSPENSION'})
        msp.add_line((kx, s1_gz + 460), (s1_cx + sign * 200, belly_y + 20), dxfattribs={'layer': 'CHASSIS'})
        msp.add_line((kx, s1_gz + 210), (s1_cx + sign * 180, s1_gz + 260), dxfattribs={'layer': 'CHASSIS'})
        
    # Undercarriage Retractable Soil Probe
    msp.add_lwpolyline([(574, belly_y - 80), (586, belly_y - 80), (586, belly_y), (574, belly_y), (574, belly_y - 80)], dxfattribs={'layer': 'SOIL_PROBE'})
    msp.add_line((580, belly_y - 80), (580, s1_gz), dxfattribs={'layer': 'CENTERLINES'})
    
    # Dimensions Sheet 1 (Clean offsets, zero overlaps)
    draw_dimension_h(240, 920, s1_gz - 48, "680.0 TRACK STANCE", s1_gz, s1_gz - 58)
    draw_dimension_v(s1_gz, belly_y, 775, "420.0 GROUND CLEARANCE", 750, 785)
    draw_dimension_v(s1_gz, belly_y + 230, 130, "650.0 ROVER HEIGHT", 120, 545)
    draw_dimension_v(s1_gz, s1_gz + 340, 175, "Ø 340 TIRE", 165, 240)
    
    # Sheet 1 Notes (Placed below dimension line: Y = 62 down to 24)
    n_x, n_y = 45, 62
    msp.add_text("SHEET 1 ENGINEERING NOTES & TOLERANCES (ISO 2768-m):", dxfattribs={'layer': 'NOTES', 'height': 3.2}).set_placement((n_x, n_y))
    s1_notes = [
        "1. Over-canopy cyber strut architecture provides 420.0 mm nominal clearance to straddle crop rows.",
        "2. Outer track width (680 mm) designed for standard 700 mm row spacing with zero root compaction.",
        "3. Suspension features 4x independent white coilover shock struts with 110 mm active vertical travel.",
        "4. Primary Materials: Chassis Al 6061-T6 monocoque, canopy Al 5052-H32, A2-70 metric stainless hardware."
    ]
    for idx, nt in enumerate(s1_notes):
        msp.add_text(nt, dxfattribs={'layer': 'NOTES', 'height': 2.4}).set_placement((n_x, n_y - 10 - idx * 9))

    # =========================================================================
    # SHEET 2: TOP PLAN VIEW (1350, 0 to 2550, 850)
    # =========================================================================
    print("Generating Sheet 2: Top Plan GA View...")
    draw_iso_sheet_border(1350, 0, 1200, 850, sheet_num=2, sheet_title="TOP PLAN VIEW")
    s2_cx = 1350 + 520.0 # Shifted left so front tires stop at X = 2215, well before title block at X = 2315!
    s2_cy = 440.0
    
    # Rover Monocoque Perimeter (Length 750 mm x Width 380 mm)
    rl_x0, rl_x1 = s2_cx - 375.0, s2_cx + 375.0
    rw_y0, rw_y1 = s2_cy - 190.0, s2_cy + 190.0
    msp.add_lwpolyline([
        (rl_x0 + 40, rw_y0), (rl_x1 - 40, rw_y0),
        (rl_x1, rw_y0 + 40), (rl_x1, rw_y1 - 40),
        (rl_x1 - 40, rw_y1), (rl_x0 + 40, rw_y1),
        (rl_x0, rw_y1 - 40), (rl_x0, rw_y0 + 40),
        (rl_x0 + 40, rw_y0)
    ], dxfattribs={'layer': 'CHASSIS'})
    
    # Centerlines
    msp.add_line((s2_cx - 430, s2_cy), (s2_cx + 430, s2_cy), dxfattribs={'layer': 'CENTERLINES'})
    msp.add_line((s2_cx, s2_cy - 350), (s2_cx, s2_cy + 350), dxfattribs={'layer': 'CENTERLINES'})
    
    # 4 Tractor Tires with Chevron Lugs (Wheelbase 520 mm: Axles at X = s2_cx - 260 and s2_cx + 260)
    # Stance 680 mm: Outer at Y = s2_cy +/- 340, Inner at Y = s2_cy +/- 235
    for ax_x in [s2_cx - 260.0, s2_cx + 260.0]:
        for sign, ty0 in [(-1, s2_cy - 340.0), (1, s2_cy + 235.0)]:
            msp.add_lwpolyline([
                (ax_x - 85, ty0), (ax_x + 85, ty0),
                (ax_x + 85, ty0 + 105), (ax_x - 85, ty0 + 105),
                (ax_x - 85, ty0)
            ], dxfattribs={'layer': 'WHEELS'})
            # Chevron Lugs
            for lx in range(int(ax_x - 70), int(ax_x + 80), 25):
                msp.add_line((lx - 10, ty0), (lx, ty0 + 52.5), dxfattribs={'layer': 'WHEELS'})
                msp.add_line((lx, ty0 + 52.5), (lx - 10, ty0 + 105), dxfattribs={'layer': 'WHEELS'})
            # Portal Outrigger Arm
            msp.add_line((ax_x, ty0 + 52.5), (ax_x - 40, s2_cy + sign * 190), dxfattribs={'layer': 'CHASSIS'})
            
    # Rear Drone Docking Station Funnel Pad (X: s2_cx - 320 to s2_cx - 40)
    msp.add_lwpolyline([
        (s2_cx - 330, s2_cy - 120), (s2_cx - 50, s2_cy - 120),
        (s2_cx - 50, s2_cy + 120), (s2_cx - 330, s2_cy + 120),
        (s2_cx - 330, s2_cy - 120)
    ], dxfattribs={'layer': 'DRONE_DOCK'})
    msp.add_circle((s2_cx - 190, s2_cy), 85, dxfattribs={'layer': 'DRONE_DOCK'})
    # Docked Quadcopter
    msp.add_circle((s2_cx - 190, s2_cy), 25, dxfattribs={'layer': 'DRONE'})
    for dx, dy in [(-60, -60), (60, -60), (-60, 60), (60, 60)]:
        msp.add_line((s2_cx - 190, s2_cy), (s2_cx - 190 + dx, s2_cy + dy), dxfattribs={'layer': 'DRONE'})
        msp.add_circle((s2_cx - 190 + dx, s2_cy + dy), 28, dxfattribs={'layer': 'DRONE'})
        
    # Front Turret Pod
    msp.add_circle((s2_cx + 260, s2_cy), 35, dxfattribs={'layer': 'CAMERA'})
    msp.add_circle((s2_cx + 275, s2_cy - 12), 8, dxfattribs={'layer': 'CAMERA'})
    msp.add_circle((s2_cx + 275, s2_cy + 12), 8, dxfattribs={'layer': 'CAMERA'})
    
    # Front LED Brow Bar
    msp.add_line((s2_cx + 370, s2_cy - 140), (s2_cx + 370, s2_cy + 140), dxfattribs={'layer': 'LIGHTING'})
    
    # Top Dimensions (Cleanly placed outside features)
    draw_dimension_h(rl_x0, rl_x1, s2_cy + 365, "750.0 OVERALL LENGTH", rw_y1, s2_cy + 375)
    draw_dimension_h(s2_cx - 260, s2_cx + 260, s2_cy - 215, "520.0 WHEELBASE", s2_cy - 235, s2_cy - 190)
    draw_dimension_v(s2_cy - 340, s2_cy + 340, s2_cx + 420, "680.0 STANCE WIDTH", rl_x1, s2_cx + 430)
    draw_dimension_v(s2_cy - 190, s2_cy + 190, s2_cx - 415, "380.0 CHASSIS WIDTH", rl_x0, s2_cx - 405)
    
    # Sheet 2 Notes (At bottom left: Y = 62 down to 24, well below bottom wheels at Y = 100!)
    n2_x, n2_y = 1350 + 45, 62
    msp.add_text("SHEET 2 DRIVETRAIN & DOCKING SPECIFICATIONS:", dxfattribs={'layer': 'NOTES', 'height': 3.2}).set_placement((n2_x, n2_y))
    s2_notes = [
        "1. Drivetrain: 4WD independent BLDC planetary gearmotors (350W each, 1:20 reduction, 19.3 Nm torque).",
        "2. Drone Docking Station: Self-centering funnel geometry with spring-loaded gold-plated charging busbars.",
        "3. Sensor Turret: Pan/Tilt active tracking head positioned forward of front axle for unobstructed row sweep.",
        "4. Beadlock Wheels: CNC machined Al 6061 billet rings with 6x M6 stainless socket fasteners per wheel."
    ]
    for idx, nt in enumerate(s2_notes):
        msp.add_text(nt, dxfattribs={'layer': 'NOTES', 'height': 2.4}).set_placement((n2_x, n2_y - 10 - idx * 9))

    # =========================================================================
    # SHEET 3: SIDE ELEVATION VIEW (0, 950 to 1200, 1800)
    # =========================================================================
    print("Generating Sheet 3: Left Side Elevation GA View...")
    draw_iso_sheet_border(0, 950, 1200, 850, sheet_num=3, sheet_title="SIDE ELEVATION VIEW")
    s3_cx = 520.0 # Shifted left so front wheel ends at X = 950, clear of title block at X = 965!
    s3_gz = 950 + 135.0 # Ground Datum at Y = 1085
    
    # Ground Line (stops at X = 950, well clear of title block at X = 965!)
    msp.add_line((180, s3_gz), (950, s3_gz), dxfattribs={'layer': 'CENTERLINES'})
    for hx in range(200, 940, 40):
        msp.add_line((hx, s3_gz), (hx - 15, s3_gz - 15), dxfattribs={'layer': 'CENTERLINES'})
    msp.add_text("GROUND REFERENCE DATUM (Z = 0.0 MM)", dxfattribs={'layer': 'NOTES', 'height': 3.0}).set_placement((s3_cx - 85, s3_gz - 18))
    
    # Rear Wheel (Center at s3_cx - 260 = 260, Y = s3_gz + 170 = 1255)
    # Front Wheel (Center at s3_cx + 260 = 780, Y = s3_gz + 170 = 1255) -> Wheelbase = 520 mm!
    rw_cx = s3_cx - 260.0
    fw_cx = s3_cx + 260.0
    ax_y = s3_gz + 170.0
    
    for wx in [rw_cx, fw_cx]:
        msp.add_circle((wx, ax_y), 170, dxfattribs={'layer': 'WHEELS'})
        msp.add_circle((wx, ax_y), 105, dxfattribs={'layer': 'WHEELS'})
        msp.add_circle((wx, ax_y), 32, dxfattribs={'layer': 'WHEELS'})
        msp.add_circle((wx, ax_y), 8, dxfattribs={'layer': 'WHEELS'})
        # 12 Tractor Chevron Lugs
        for deg in range(0, 360, 30):
            rad = math.radians(deg)
            x_in = wx + 140 * math.cos(rad)
            y_in = ax_y + 140 * math.sin(rad)
            x_out = wx + 170 * math.cos(rad)
            y_out = ax_y + 170 * math.sin(rad)
            msp.add_line((x_in, y_in), (x_out, y_out), dxfattribs={'layer': 'WHEELS'})
            
    # Chassis Hull Side Silhouette (Length 750 mm: X from s3_cx - 375 to s3_cx + 375)
    # Belly at s3_gz + 420 mm = 1505
    belly_s3 = s3_gz + 420.0
    msp.add_lwpolyline([
        (s3_cx - 375, belly_s3), (s3_cx + 330, belly_s3),
        (s3_cx + 375, belly_s3 + 80), (s3_cx + 375, belly_s3 + 120),
        (s3_cx + 320, belly_s3 + 180), (s3_cx - 340, belly_s3 + 180),
        (s3_cx - 375, belly_s3 + 110), (s3_cx - 375, belly_s3)
    ], dxfattribs={'layer': 'CHASSIS'})
    
    # Front Tubular Bullbar
    msp.add_circle((s3_cx + 395, belly_s3 + 50), 16, dxfattribs={'layer': 'CHASSIS'})
    msp.add_line((s3_cx + 360, belly_s3 + 50), (s3_cx + 395, belly_s3 + 50), dxfattribs={'layer': 'CHASSIS'})
    
    # Front LED Cheek Slit
    msp.add_line((s3_cx + 372, belly_s3 + 85), (s3_cx + 372, belly_s3 + 115), dxfattribs={'layer': 'LIGHTING'})
    
    # Top Front Turret Profile
    msp.add_lwpolyline([
        (s3_cx + 250, belly_s3 + 180), (s3_cx + 300, belly_s3 + 180),
        (s3_cx + 300, belly_s3 + 225), (s3_cx + 250, belly_s3 + 225),
        (s3_cx + 250, belly_s3 + 180)
    ], dxfattribs={'layer': 'CAMERA'})
    
    # Top Rear Docked Quadcopter Profile
    msp.add_lwpolyline([
        (s3_cx - 310, belly_s3 + 180), (s3_cx - 150, belly_s3 + 180),
        (s3_cx - 150, belly_s3 + 195), (s3_cx - 310, belly_s3 + 195),
        (s3_cx - 310, belly_s3 + 180)
    ], dxfattribs={'layer': 'DRONE_DOCK'})
    msp.add_lwpolyline([
        (s3_cx - 260, belly_s3 + 195), (s3_cx - 200, belly_s3 + 195),
        (s3_cx - 200, belly_s3 + 225), (s3_cx - 260, belly_s3 + 225),
        (s3_cx - 260, belly_s3 + 195)
    ], dxfattribs={'layer': 'DRONE'})
    msp.add_line((s3_cx - 300, belly_s3 + 230), (s3_cx - 160, belly_s3 + 230), dxfattribs={'layer': 'DRONE'})
    
    # Exposed Vertical Shocks (Rear and Front)
    for wx in [rw_cx, fw_cx]:
        msp.add_line((wx, ax_y), (wx, belly_s3 + 120), dxfattribs={'layer': 'SUSPENSION'})
        for cy in range(int(ax_y + 40), int(belly_s3 + 100), 20):
            msp.add_line((wx - 16, cy), (wx + 16, cy + 10), dxfattribs={'layer': 'SUSPENSION'})
            msp.add_line((wx + 16, cy + 10), (wx - 16, cy + 20), dxfattribs={'layer': 'SUSPENSION'})
            
    # Motorized Linear Soil Probe
    msp.add_lwpolyline([
        (s3_cx - 6, belly_s3 - 120), (s3_cx + 6, belly_s3 - 120),
        (s3_cx + 6, belly_s3), (s3_cx - 6, belly_s3), (s3_cx - 6, belly_s3 - 120)
    ], dxfattribs={'layer': 'SOIL_PROBE'})
    msp.add_line((s3_cx, belly_s3 - 120), (s3_cx, s3_gz), dxfattribs={'layer': 'CENTERLINES'})
    
    # Dimensions Sheet 3 (Zero overlap layout)
    draw_dimension_h(s3_cx - 375, s3_cx + 375, belly_s3 + 245, "750.0 OVERALL LENGTH", belly_s3 + 180, belly_s3 + 255)
    draw_dimension_h(rw_cx, fw_cx, s3_gz - 48, "520.0 WHEELBASE", ax_y, s3_gz - 58)
    draw_dimension_v(s3_gz, belly_s3, s3_cx + 420, "420.0 CANOPY CLEARANCE", s3_cx + 375, s3_cx + 430)
    draw_dimension_v(belly_s3 - 120, belly_s3, s3_cx + 25, "150.0 PROBE TRAVEL", s3_cx + 6, s3_cx + 30)
    draw_dimension_v(s3_gz, s3_gz + 340, s3_cx - 415, "Ø 340 TIRE", rw_cx, s3_cx - 405)
    
    # Sheet 3 Notes (Clean layout at bottom: Y = 950 + 62 down to 950 + 24)
    n3_x, n3_y = 45, 950 + 62
    msp.add_text("SHEET 3 KINEMATIC & SOIL PROBE SPECIFICATIONS:", dxfattribs={'layer': 'NOTES', 'height': 3.2}).set_placement((n3_x, n3_y))
    s3_notes = [
        "1. Straddle Geometry: 420.0 mm belly clearance guarantees zero canopy friction across arecanut & nursery beds.",
        "2. Soil Penetration: Precision MGN15 linear rail & T8x2 lead screw delivers 150 mm insertion into active root zone.",
        "3. Sensor Cartridge: SS316 multi-parameter electrode measures Moisture, pH, EC, and Temperature via RS485 bus.",
        "4. Center of Gravity: Low-slung battery placement ensures dynamic rollover stability on 25-degree field slopes."
    ]
    for idx, nt in enumerate(s3_notes):
        msp.add_text(nt, dxfattribs={'layer': 'NOTES', 'height': 2.4}).set_placement((n3_x, n3_y - 10 - idx * 9))

    # =========================================================================
    # SHEET 4: 3D ISOMETRIC ASSEMBLY VIEW (1350, 950 to 2550, 1800)
    # =========================================================================
    print("Generating Sheet 4: 3D Isometric Assembly View...")
    draw_iso_sheet_border(1350, 950, 1200, 850, sheet_num=4, sheet_title="3D ISOMETRIC ASSEMBLY")
    s4_ox = 1350.0
    s4_oy = 950.0
    s4_cx = s4_ox + 580.0
    s4_cy = s4_oy + 380.0
    
    # True 3D Isometric Projection Function (Z is Up, X is Forward, Y is Left)
    def iso_proj(x, y, z, scale=0.48):
        az = math.radians(35)
        el = math.radians(22)
        xr = x * math.cos(az) - y * math.sin(az)
        yr = x * math.sin(az) + y * math.cos(az)
        u = xr
        v = -yr * math.sin(el) + z * math.cos(el)
        return (s4_cx + u * scale, s4_cy + v * scale)

    # 1. Ground Footprint Datum Box
    ground_poly = [
        iso_proj(-420, -360, 0), iso_proj(420, -360, 0),
        iso_proj(420, 360, 0), iso_proj(-420, 360, 0),
        iso_proj(-420, -360, 0)
    ]
    msp.add_lwpolyline(ground_poly, dxfattribs={'layer': 'CENTERLINES'})
    
    # 2. Four Deep-Lug Tractor Wheels (Projected 3D circular cylinders & rims)
    wheels_data = [
        (-260, -310, "Rear-Right"),
        (260, -310, "Front-Right"),
        (-260, 310, "Rear-Left"),
        (260, 310, "Front-Left (Hero)")
    ]
    
    for wx, wy, wname in wheels_data:
        # Outer disc (radius 170)
        pts_outer = []
        for deg in range(0, 365, 12):
            rad = math.radians(deg)
            pts_outer.append(iso_proj(wx + 170 * math.cos(rad), wy + (35 if wy > 0 else -35), 170 + 170 * math.sin(rad)))
        msp.add_lwpolyline(pts_outer, dxfattribs={'layer': 'WHEELS'})
        
        # Inner disc (radius 170)
        pts_inner = []
        for deg in range(0, 365, 12):
            rad = math.radians(deg)
            pts_inner.append(iso_proj(wx + 170 * math.cos(rad), wy - (35 if wy > 0 else -35), 170 + 170 * math.sin(rad)))
        msp.add_lwpolyline(pts_inner, dxfattribs={'layer': 'WHEELS'})
        
        # Outer Rim (radius 105)
        pts_rim = []
        for deg in range(0, 365, 15):
            rad = math.radians(deg)
            pts_rim.append(iso_proj(wx + 105 * math.cos(rad), wy + (35 if wy > 0 else -35), 170 + 105 * math.sin(rad)))
        msp.add_lwpolyline(pts_rim, dxfattribs={'layer': 'WHEELS'})
        
        # Hub Center & Axle Pin
        hub_center = iso_proj(wx, wy + (35 if wy > 0 else -35), 170)
        msp.add_circle(hub_center, 6.0, dxfattribs={'layer': 'WHEELS'})
        
        # Chevron Tread Lugs along outer circumference
        for deg in range(0, 360, 30):
            rad = math.radians(deg)
            p_in = iso_proj(wx + 140 * math.cos(rad), wy + (35 if wy > 0 else -35), 170 + 140 * math.sin(rad))
            p_out = iso_proj(wx + 170 * math.cos(rad), wy + (35 if wy > 0 else -35), 170 + 170 * math.sin(rad))
            msp.add_line(p_in, p_out, dxfattribs={'layer': 'WHEELS'})
            
        # 3. High-Clearance Coilover Struts (from chassis mount Z=520 to wheel hub Z=200)
        strut_top = (wx, 190 if wy > 0 else -190, 520)
        strut_bot = (wx, 260 if wy > 0 else -260, 200)
        p_stop = iso_proj(*strut_top)
        p_sbot = iso_proj(*strut_bot)
        msp.add_line(p_stop, p_sbot, dxfattribs={'layer': 'SUSPENSION'})
        
        # Helical Spring Coils
        num_coils = 14
        for i in range(num_coils):
            t1 = i / num_coils
            t2 = (i + 0.5) / num_coils
            t3 = (i + 1.0) / num_coils
            z1 = strut_bot[2] + (strut_top[2] - strut_bot[2]) * t1
            z2 = strut_bot[2] + (strut_top[2] - strut_bot[2]) * t2
            z3 = strut_bot[2] + (strut_top[2] - strut_bot[2]) * t3
            y_base = strut_bot[1] + (strut_top[1] - strut_bot[1]) * t1
            c_p1 = iso_proj(wx - 18, y_base, z1)
            c_p2 = iso_proj(wx + 18, y_base, z2)
            c_p3 = iso_proj(wx - 18, y_base, z3)
            msp.add_line(c_p1, c_p2, dxfattribs={'layer': 'SUSPENSION'})
            msp.add_line(c_p2, c_p3, dxfattribs={'layer': 'SUSPENSION'})
            
    # 4. Elevated Monocoque Hull (3D Facets)
    # Belly Skid Plate (Z = 420)
    belly_3d = [
        (-350, -180, 420), (320, -180, 420),
        (375, -120, 420), (375, 120, 420),
        (320, 180, 420), (-350, 180, 420),
        (-375, 120, 420), (-375, -120, 420),
        (-350, -180, 420)
    ]
    msp.add_lwpolyline([iso_proj(*pt) for pt in belly_3d], dxfattribs={'layer': 'CHASSIS'})
    
    # Mid Chamfer Beltline (Z = 500)
    mid_3d = [
        (-365, -200, 500), (335, -200, 500),
        (390, -135, 500), (390, 135, 500),
        (335, 200, 500), (-365, 200, 500),
        (-390, 135, 500), (-390, -135, 500),
        (-365, -200, 500)
    ]
    msp.add_lwpolyline([iso_proj(*pt) for pt in mid_3d], dxfattribs={'layer': 'CHASSIS'})
    
    # Upper Canopy Shell (Z = 610)
    top_3d = [
        (-340, -165, 610), (310, -165, 610),
        (355, -100, 610), (355, 100, 610),
        (310, 165, 610), (-340, 165, 610),
        (-365, 100, 610), (-365, -100, 610),
        (-340, -165, 610)
    ]
    msp.add_lwpolyline([iso_proj(*pt) for pt in top_3d], dxfattribs={'layer': 'CHASSIS'})
    
    # Vertical & Chamfer Connection Edges between Belly, Mid, and Top
    for (b_pt, m_pt, t_pt) in zip(belly_3d[:-1], mid_3d[:-1], top_3d[:-1]):
        msp.add_line(iso_proj(*b_pt), iso_proj(*m_pt), dxfattribs={'layer': 'CHASSIS'})
        msp.add_line(iso_proj(*m_pt), iso_proj(*t_pt), dxfattribs={'layer': 'CHASSIS'})
        
    # 5. Electric-Blue Continuous LED Status Brow (Front Nose)
    led_pts = [
        iso_proj(390, -130, 515), iso_proj(390, 130, 515),
        iso_proj(390, 130, 528), iso_proj(390, -130, 528),
        iso_proj(390, -130, 515)
    ]
    msp.add_lwpolyline(led_pts, dxfattribs={'layer': 'LIGHTING'})
    
    # 6. Front Tubular Bullbar
    bb_pts = [
        iso_proj(360, -160, 460), iso_proj(415, -140, 460),
        iso_proj(415, 140, 460), iso_proj(360, 160, 460)
    ]
    msp.add_lwpolyline(bb_pts, dxfattribs={'layer': 'CHASSIS'})
    
    # 7. Pan/Tilt Dual-Camera Turret
    turret_base = iso_proj(260, 0, 610)
    turret_top = iso_proj(260, 0, 665)
    msp.add_line(turret_base, turret_top, dxfattribs={'layer': 'CAMERA'})
    msp.add_circle(turret_top, 14, dxfattribs={'layer': 'CAMERA'})
    # Dual optics
    opt1 = iso_proj(285, -10, 665)
    opt2 = iso_proj(285, 10, 665)
    msp.add_circle(opt1, 5, dxfattribs={'layer': 'CAMERA'})
    msp.add_circle(opt2, 5, dxfattribs={'layer': 'CAMERA'})
    
    # 8. Drone Docking Station & Docked Quadcopter
    # Funnel Pad on Top Deck
    dock_pad = [
        iso_proj(-310, -110, 610), iso_proj(-90, -110, 610),
        iso_proj(-90, 110, 610), iso_proj(-310, 110, 610),
        iso_proj(-310, -110, 610)
    ]
    msp.add_lwpolyline(dock_pad, dxfattribs={'layer': 'DRONE_DOCK'})
    dock_center = iso_proj(-200, 0, 610)
    msp.add_circle(dock_center, 38, dxfattribs={'layer': 'DRONE_DOCK'})
    
    # Docked Drone
    drone_center = iso_proj(-200, 0, 645)
    msp.add_circle(drone_center, 15, dxfattribs={'layer': 'DRONE'})
    for dx, dy in [(-45, -45), (45, -45), (-45, 45), (45, 45)]:
        r_pos = iso_proj(-200 + dx, dy, 645)
        msp.add_line(drone_center, r_pos, dxfattribs={'layer': 'DRONE'})
        msp.add_circle(r_pos, 16, dxfattribs={'layer': 'DRONE'})
        
    # 9. Numbered Balloon Callouts (1 to 9) - Precisely anchored to true 3D parts
    target_drone = drone_center
    target_dock = iso_proj(-200, 90, 610)
    target_canopy = iso_proj(100, 0, 610)
    target_turret = turret_top
    target_led = iso_proj(390, 0, 520)
    target_bullbar = iso_proj(415, 80, 460)
    target_shock = iso_proj(260, 220, 360) # Front-Left Shock
    target_wheel = iso_proj(260, 345, 170) # Front-Left Wheel Rim
    target_skid = iso_proj(0, 180, 420)   # Skid Plate Belly
    
    balloons_def = [
        (1, s4_ox + 480, s4_oy + 720, target_drone),     # Autonomous Surveillance Drone
        (2, s4_ox + 340, s4_oy + 650, target_dock),      # Top Docking & Charging Bay
        (3, s4_ox + 670, s4_oy + 720, target_canopy),    # Faceted Titanium Shell Canopy
        (4, s4_ox + 820, s4_oy + 680, target_turret),    # Pan/Tilt Dual-Camera Turret
        (5, s4_ox + 940, s4_oy + 560, target_led),       # Electric-Blue LED Light Brow
        (6, s4_ox + 960, s4_oy + 440, target_bullbar),   # Tubular Aluminum Bullbar
        (7, s4_ox + 820, s4_oy + 320, target_shock),     # White Coilover Shock Strut
        (8, s4_ox + 680, s4_oy + 180, target_wheel),     # Deep-Lug Tractor Wheel (340mm)
        (9, s4_ox + 420, s4_oy + 240, target_skid)       # Elevated Monocoque Skid Belly
    ]
    
    for b_num, bx, by, tgt in balloons_def:
        msp.add_circle((bx, by), 14, dxfattribs={'layer': 'DIMENSIONS'})
        msp.add_text(str(b_num), dxfattribs={'layer': 'DIMENSIONS', 'height': 4.8}).set_placement((bx - 3.5, by - 3.5))
        lx, ly = tgt
        msp.add_line((bx, by - 14 if ly < by else by + 14), (lx, ly), dxfattribs={'layer': 'DIMENSIONS'})
        msp.add_circle((lx, ly), 2.5, dxfattribs={'layer': 'DIMENSIONS'})
        
    # Callout Key Box at Top Left of Sheet 4
    k_x, k_y = s4_ox + 45, s4_oy + 850 - 55
    msp.add_lwpolyline([
        (k_x, k_y - 175), (k_x + 270, k_y - 175), (k_x + 270, k_y + 10), (k_x, k_y + 10), (k_x, k_y - 175)
    ], dxfattribs={'layer': 'TITLE_BLOCK'})
    msp.add_text("ASSEMBLY CALLOUT KEY:", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 4.0}).set_placement((k_x + 10, k_y - 10))
    keys = [
        "1. Autonomous Surveillance Drone",
        "2. Top Docking & Charging Bay",
        "3. Faceted Titanium Shell Canopy",
        "4. Pan/Tilt Dual-Camera Turret",
        "5. Electric-Blue LED Light Brow",
        "6. Tubular Aluminum Bullbar",
        "7. White Coilover Shock Strut",
        "8. Deep-Lug Tractor Wheel (340mm)",
        "9. Elevated Monocoque Skid Belly"
    ]
    for idx, kstr in enumerate(keys):
        msp.add_text(kstr, dxfattribs={'layer': 'NOTES', 'height': 2.5}).set_placement((k_x + 10, k_y - 25 - idx * 16))

    # Sheet 4 Assembly Notes (At bottom left, compact and clean)
    n4_x, n4_y = s4_ox + 45, s4_oy + 62
    msp.add_text("SHEET 4 ASSEMBLY & VERIFICATION GUIDELINES:", dxfattribs={'layer': 'NOTES', 'height': 3.2}).set_placement((n4_x, n4_y))
    s4_notes = [
        "1. Torque Specifications: Shock clevis bolts (M8 Grade 8.8) torqued to 22.0 Nm with Loctite 243 blue threadlocker.",
        "2. Spring Preload: Set coilover collar to 15.0 mm initial compression for 32.0 kg nominal vehicle curb weight.",
        "3. Hub Fasteners: 6-lug beadlock pattern torqued in cross-star sequence to 9.5 Nm to ensure airtight tire seal.",
        "4. Enclosure Ingress Protection: Verify continuous silicone O-ring compression before field deployment."
    ]
    for idx, nt in enumerate(s4_notes):
        msp.add_text(nt, dxfattribs={'layer': 'NOTES', 'height': 2.4}).set_placement((n4_x, n4_y - 10 - idx * 9))

    doc.saveas(output_dxf_path)
    print(f"[SUCCESS] Generated Clean AutoCAD 2D Package: {output_dxf_path}")


def render_dxf_to_pdf_package(dxf_path, output_pdf_path, individual_sheet_dir):
    print("Reading DXF for vector PDF rendering...")
    doc = ezdxf.readfile(dxf_path)
    msp = doc.modelspace()
    
    # 4 distinct non-overlapping ISO sheets
    sheets = [
        (1, "Sheet 1: Front Elevation GA", 0, 0, 1200, 850, "AgriBot_AutoCAD_2D_Sheet1_Front_GA.pdf"),
        (2, "Sheet 2: Top Plan View", 1350, 0, 2550, 850, "AgriBot_AutoCAD_2D_Sheet2_Top_Plan.pdf"),
        (3, "Sheet 3: Side Elevation View", 0, 950, 1200, 1800, "AgriBot_AutoCAD_2D_Sheet3_Side_Elevation.pdf"),
        (4, "Sheet 4: 3D Isometric Assembly", 1350, 950, 2550, 1800, "AgriBot_AutoCAD_2D_Sheet4_3D_Isometric.pdf")
    ]
    
    # Layer color mapping for clean white-background CAD printing
    layer_colors = {
        'DIMENSIONS': '#dc2626',   # Crisp CAD Red
        'CENTERLINES': '#dc2626',  # CAD Red
        'SUSPENSION': '#0284c7',   # Cyan / Precision Blue
        'LIGHTING': '#0284c7',     # Cyan / Precision Blue
        'BORDER': '#0f172a',       # Dark Slate / Crisp Black
        'TITLE_BLOCK': '#0f172a',  # Dark Slate / Crisp Black
        'CHASSIS': '#0f172a',      # Black
        'WHEELS': '#0f172a',       # Black
        'CAMERA': '#0f172a',       # Black
        'DRONE': '#0f172a',        # Black
        'DRONE_DOCK': '#0f172a',   # Black
        'SOIL_PROBE': '#0f172a',   # Black
        'NOTES': '#0f172a'         # Black
    }
    
    single_pdf_paths = []
    
    for s_num, title, x0, y0, x1, y1, filename in sheets:
        fig, ax = plt.subplots(figsize=(17.14, 12.14)) # 1200 x 850 mm true ratio
        fig.patch.set_facecolor('white')
        ax.set_facecolor('white')
        
        w_pad = 5.0
        
        for entity in msp:
            layer = entity.dxf.layer
            edge_color = layer_colors.get(layer, '#0f172a')
            lw = 1.3 if layer in ('BORDER', 'CHASSIS', 'WHEELS') else 0.85
            
            dxftype = entity.dxftype()
            if dxftype == 'LINE':
                p1 = (entity.dxf.start.x, entity.dxf.start.y)
                p2 = (entity.dxf.end.x, entity.dxf.end.y)
                if (x0 - w_pad <= p1[0] <= x1 + w_pad and y0 - w_pad <= p1[1] <= y1 + w_pad) or \
                   (x0 - w_pad <= p2[0] <= x1 + w_pad and y0 - w_pad <= p2[1] <= y1 + w_pad):
                    linestyle = '--' if layer == 'CENTERLINES' else '-'
                    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color=edge_color, linewidth=lw, linestyle=linestyle)
            elif dxftype == 'LWPOLYLINE':
                pts = [(p[0], p[1]) for p in entity.get_points()]
                if any(x0 - w_pad <= p[0] <= x1 + w_pad and y0 - w_pad <= p[1] <= y1 + w_pad for p in pts):
                    xs, ys = zip(*pts)
                    ax.plot(xs, ys, color=edge_color, linewidth=lw)
            elif dxftype == 'CIRCLE':
                cx, cy = entity.dxf.center.x, entity.dxf.center.y
                r = entity.dxf.radius
                if x0 - w_pad <= cx <= x1 + w_pad and y0 - w_pad <= cy <= y1 + w_pad:
                    circle = plt.Circle((cx, cy), r, fill=False, edgecolor=edge_color, linewidth=lw)
                    ax.add_patch(circle)
            elif dxftype == 'ELLIPSE':
                cx, cy = entity.dxf.center.x, entity.dxf.center.y
                major = math.hypot(entity.dxf.major_axis.x, entity.dxf.major_axis.y)
                ratio = entity.dxf.ratio
                minor = major * ratio
                angle = math.degrees(math.atan2(entity.dxf.major_axis.y, entity.dxf.major_axis.x))
                if x0 - w_pad <= cx <= x1 + w_pad and y0 - w_pad <= cy <= y1 + w_pad:
                    ellipse = patches.Ellipse((cx, cy), major * 2, minor * 2, angle=angle, fill=False, edgecolor=edge_color, linewidth=lw)
                    ax.add_patch(ellipse)
            elif dxftype == 'TEXT':
                pos = entity.dxf.insert
                txt = entity.dxf.text
                h_txt = entity.dxf.height
                if x0 - w_pad <= pos.x <= x1 + w_pad and y0 - w_pad <= pos.y <= y1 + w_pad:
                    txt_col = '#dc2626' if layer == 'DIMENSIONS' else '#0f172a'
                    weight = 'bold' if layer in ('TITLE_BLOCK', 'DIMENSIONS') else 'normal'
                    rot = entity.dxf.rotation if entity.dxf.hasattr('rotation') else 0
                    ax.text(pos.x, pos.y, txt, color=txt_col, fontsize=h_txt * 1.45, weight=weight, rotation=rot, va='bottom', ha='left')

        ax.set_xlim(x0, x1)
        ax.set_ylim(y0, y1)
        ax.set_aspect('equal')
        ax.axis('off')
        
        single_path = os.path.join(individual_sheet_dir, filename)
        fig.savefig(single_path, facecolor='white', edgecolor='none', format='pdf', dpi=300)
        plt.close(fig)
        print(f"[SUCCESS] Plotted {title} -> {single_path}")
        single_pdf_paths.append(single_path)
        
    # Combine the 4 single sheet PDFs into the Master Judges Package PDF
    combined_doc = pymupdf.open()
    for spath in single_pdf_paths:
        sdoc = pymupdf.open(spath)
        combined_doc.insert_pdf(sdoc)
        sdoc.close()
    combined_doc.save(output_pdf_path)
    combined_doc.close()
    print(f"[SUCCESS] Built Combined AutoCAD 2D Judges Package PDF: {output_pdf_path} (4 Sheets)")


if __name__ == "__main__":
    cad_dir = os.path.dirname(os.path.abspath(__file__))
    dxf_file = os.path.join(cad_dir, "agribot_2d_manufacturing_package.dxf")
    combined_pdf = os.path.join(cad_dir, "AgriBot_AutoCAD_2D_Judges_Package.pdf")
    
    print("=== BUILDING CLEAN AUTOCAD 2026 2D PACKAGE ===")
    build_cad_dxf(dxf_file)
    render_dxf_to_pdf_package(dxf_file, combined_pdf, cad_dir)
    print("=== AUTOCAD 2D PACKAGE & JUDGES PDF GENERATION COMPLETE ===")
