"""
AgriBot-X CAD Package Generator: High-Clearance Cyber-Strut Architecture
Generates:
1. agribot_3d_assembly.dxf: Full 3D Solid Model Assembly with all 18 AutoCAD layers matching reference rover.
2. agribot_2d_manufacturing_package.dxf: Complete 4-Sheet 2D CAD Manufacturing Drawings (GA, Exploded, Section, Detail Parts).
3. agribot_model.lsp: Native AutoLISP 3D solid modeling script (BUILD_AGRIBOT).
4. agribot_build_script.scr: AutoCAD automation command script.
"""

import math
import os
import ezdxf

def create_box_mesh(x0, x1, y0, y1, z0, z1):
    """Creates a 6-sided box mesh (vertices and quad faces)."""
    vertices = [
        (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), # bottom
        (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)  # top
    ]
    faces = [
        (0, 3, 2, 1), # bottom (-Z)
        (4, 5, 6, 7), # top (+Z)
        (0, 1, 5, 4), # front (-Y)
        (1, 2, 6, 5), # right (+X)
        (2, 3, 7, 6), # back (+Y)
        (3, 0, 4, 7)  # left (-X)
    ]
    return vertices, faces

def create_cylinder_z(cx, cy, z0, z1, radius, segments=20):
    """Creates a solid cylinder mesh along the Z axis."""
    vertices = [(cx, cy, z0), (cx, cy, z1)]
    for i in range(segments):
        ang = 2.0 * math.pi * i / segments
        vertices.append((cx + radius * math.cos(ang), cy + radius * math.sin(ang), z0))
    for i in range(segments):
        ang = 2.0 * math.pi * i / segments
        vertices.append((cx + radius * math.cos(ang), cy + radius * math.sin(ang), z1))
        
    faces = []
    for i in range(segments):
        nxt = (i + 1) % segments
        faces.append((0, 2 + nxt, 2 + i))
        faces.append((1, 2 + segments + i, 2 + segments + nxt))
        faces.append((2 + i, 2 + nxt, 2 + segments + nxt, 2 + segments + i))
    return vertices, faces

def create_cylinder_y(cx, cz, y0, y1, radius, segments=20):
    """Creates a solid cylinder mesh along the Y axis."""
    vertices = [(cx, y0, cz), (cx, y1, cz)]
    for i in range(segments):
        ang = 2.0 * math.pi * i / segments
        vertices.append((cx + radius * math.cos(ang), y0, cz + radius * math.sin(ang)))
    for i in range(segments):
        ang = 2.0 * math.pi * i / segments
        vertices.append((cx + radius * math.cos(ang), y1, cz + radius * math.sin(ang)))
        
    faces = []
    for i in range(segments):
        nxt = (i + 1) % segments
        faces.append((0, 2 + nxt, 2 + i))
        faces.append((1, 2 + segments + i, 2 + segments + nxt))
        faces.append((2 + i, 2 + nxt, 2 + segments + nxt, 2 + segments + i))
    return vertices, faces

def create_helical_spring_mesh(cx, cy, z0, z1, coil_radius, wire_radius, turns=7, segments_per_turn=16):
    """Creates a 3D helical coil spring mesh along the Z axis."""
    total_steps = turns * segments_per_turn
    height = z1 - z0
    ring_segs = 6
    
    path = []
    for i in range(total_steps + 1):
        t = i / total_steps
        ang = t * 2.0 * math.pi * turns
        x = cx + coil_radius * math.cos(ang)
        y = cy + coil_radius * math.sin(ang)
        z = z0 + t * height
        path.append((x, y, z, ang))
        
    vertices = []
    faces = []
    
    for i, (px, py, pz, ang) in enumerate(path):
        for j in range(ring_segs):
            phi = 2.0 * math.pi * j / ring_segs
            nx = math.cos(ang) * math.cos(phi) * wire_radius
            ny = math.sin(ang) * math.cos(phi) * wire_radius
            nz = math.sin(phi) * wire_radius
            vertices.append((px + nx, py + ny, pz + nz))
            
    for i in range(total_steps):
        r1 = i * ring_segs
        r2 = (i + 1) * ring_segs
        for j in range(ring_segs):
            j_nxt = (j + 1) % ring_segs
            faces.append((r1 + j, r1 + j_nxt, r2 + j_nxt, r2 + j))
            
    return vertices, faces

def add_mesh_entity(msp, layer, vertices, faces):
    """Adds a 3D SubDMesh entity to model space."""
    mesh = msp.add_mesh(dxfattribs={'layer': layer})
    mesh.vertices = vertices
    mesh.faces = faces
    return mesh


def build_3d_rover_assembly(output_dxf_path):
    """Generates the full 3D Solid Model assembly of AgriBot-X matching the high-clearance strut architecture."""
    doc = ezdxf.new('R2018')
    msp = doc.modelspace()
    
    layers_config = [
        ('CHASSIS', 4),       # Cyan
        ('WHEELS', 8),        # Dark Gray / Graphite
        ('MOTORS', 6),        # Magenta
        ('CAMERA', 4),        # Cyan
        ('SOIL_PROBE', 2),    # Yellow
        ('SENSORS', 3),       # Green
        ('ELECTRONICS', 5),   # Blue
        ('BATTERY', 30),      # Orange
        ('NAVIGATION', 7),    # White / Light Gray
        ('DRONE_DOCK', 140),  # Steel Blue
        ('DRONE', 1),         # Red / Carbon
        ('FASTENERS', 9),     # Light Gray
        ('CABLES', 40),       # Amber / Brown
        ('DIMENSIONS', 1),    # Red
        ('CENTERLINES', 1),   # Red
        ('HIDDEN_LINES', 8),  # Dark Gray
        ('SAFETY', 1),        # Bright Red / White Spring / Blue Glow
        ('NOTES', 7)          # White
    ]
    
    for name, col in layers_config:
        doc.layers.add(name, color=col)
        
    print("Building 3D Model: 1. Elevated Cyber Hull & Faceted Canopy (Belly Clearance = 420 mm)...")
    # Overall Envelope:
    # Length: 750 mm (X: -375 to +375 mm)
    # Stance Width: 680 mm (Y: -340 to +340 mm)
    # Ground Clearance: 420 mm (Ground at Z=0, bottom belly at Z=420 mm)
    
    # 1.1 Armored Central Lower Belly (Z = 420 to 490 mm)
    v, f = create_box_mesh(-310, 310, -170, 170, 420, 490)
    add_mesh_entity(msp, 'CHASSIS', v, f)
    # Skid plate (Z = 415 to 420 mm)
    v, f = create_box_mesh(-315, 315, -175, 175, 415, 420)
    add_mesh_entity(msp, 'CHASSIS', v, f)

    # 1.2 Mid-Hull Armored Body Cavity (Z = 490 to 570 mm)
    v, f = create_box_mesh(-330, 330, -195, 195, 490, 570)
    add_mesh_entity(msp, 'CHASSIS', v, f)

    # 1.3 Upper Faceted Canopy (Z = 570 to 670 mm)
    v, f = create_box_mesh(-290, 290, -140, 140, 570, 670)
    add_mesh_entity(msp, 'CHASSIS', v, f)
    v, f = create_box_mesh(-280, 280, 135, 185, 570, 640)
    add_mesh_entity(msp, 'CHASSIS', v, f)
    v, f = create_box_mesh(-280, 280, -185, -135, 570, 640)
    add_mesh_entity(msp, 'CHASSIS', v, f)

    # 1.4 Front Fascia & Continuous Electric-Blue Horizontal LED Brow Bar (Z = 552 to 568 mm)
    v, f = create_box_mesh(330, 338, -185, 185, 552, 568)
    add_mesh_entity(msp, 'SAFETY', v, f)
    
    # Dual Lower Angled Vertical LED Slits
    for lz_sign in [-1, 1]:
        ly = lz_sign * 110
        v, f = create_box_mesh(328, 336, ly - 8, ly + 8, 460, 520)
        add_mesh_entity(msp, 'SAFETY', v, f)

    # 1.5 Front Tubular Bullbar / Brush Guard (Z = 430 to 470 mm)
    v, f = create_cylinder_y(355, 445, -160, 160, 14, segments=16)
    add_mesh_entity(msp, 'CHASSIS', v, f)
    for by in [-110, 110]:
        v, f = create_box_mesh(325, 355, by - 12, by + 12, 435, 465)
        add_mesh_entity(msp, 'CHASSIS', v, f)

    print("Building 3D Model: 2. High-Clearance Suspension & Exposed White Coilover Shocks...")
    wheel_mounts = [
        (210, 270, 1, 1, 'FL'),
        (210, -270, 1, -1, 'FR'),
        (-210, 270, -1, 1, 'RL'),
        (-210, -270, -1, -1, 'RR')
    ]
    
    for wx, wy, sign_x, sign_y, side in wheel_mounts:
        # Upper Portal Arm
        v, f = create_box_mesh(wx - 28, wx + 28, min(sign_y * 175, sign_y * 245), max(sign_y * 175, sign_y * 245), 485, 525)
        add_mesh_entity(msp, 'CHASSIS', v, f)
        
        # Lower A-Arm Link
        v, f = create_box_mesh(wx - 22, wx + 22, min(sign_y * 175, sign_y * 245), max(sign_y * 175, sign_y * 245), 370, 400)
        add_mesh_entity(msp, 'CHASSIS', v, f)
        
        # Portal Gearcase & Knuckle
        v, f = create_box_mesh(wx - 38, wx + 38, wy - 30 if wy > 0 else wy + 10, wy - 10 if wy > 0 else wy + 30, 140, 270)
        add_mesh_entity(msp, 'CHASSIS', v, f)

        # Exposed Vertical Coilover Shock Strut
        sx = wx + sign_x * 10
        sy = wy - sign_y * 35
        
        # Chrome Damper Piston Rod
        v, f = create_cylinder_z(sx, sy, 240, 520, 9, segments=14)
        add_mesh_entity(msp, 'FASTENERS', v, f)
        
        # Clevis Mounts
        v, f = create_cylinder_z(sx, sy, 485, 515, 26, segments=16)
        add_mesh_entity(msp, 'CHASSIS', v, f)
        v, f = create_cylinder_z(sx, sy, 245, 275, 26, segments=16)
        add_mesh_entity(msp, 'CHASSIS', v, f)
        
        # 3D Helical Coil Spring
        v, f = create_helical_spring_mesh(sx, sy, 270, 490, coil_radius=22, wire_radius=4.5, turns=7, segments_per_turn=16)
        add_mesh_entity(msp, 'SAFETY', v, f)

    print("Building 3D Model: 3. Massive All-Terrain Deep Chevron Tractor Wheels (Dia 340 mm)...")
    for wx, wy, sign_x, sign_y, side in wheel_mounts:
        y_inner = wy - 52.5
        y_outer = wy + 52.5
        
        # Tire Cylinder
        v, f = create_cylinder_y(wx, 170, y_inner, y_outer, 170, segments=24)
        add_mesh_entity(msp, 'WHEELS', v, f)
        
        # Dark Rim
        v, f = create_cylinder_y(wx, 170, y_inner + 5, y_outer - 5, 110, segments=20)
        add_mesh_entity(msp, 'WHEELS', v, f)
        
        # Beadlock Ring
        bead_y0 = y_outer - 8 if wy > 0 else y_inner
        bead_y1 = y_outer if wy > 0 else y_inner + 8
        v, f = create_cylinder_y(wx, 170, bead_y0, bead_y1, 118, segments=20)
        add_mesh_entity(msp, 'FASTENERS', v, f)
        
        # 14 Chevron V-Tread Lugs
        for lug_idx in range(14):
            ang = 2.0 * math.pi * lug_idx / 14.0
            lx = wx + 165.0 * math.cos(ang)
            lz = 170.0 + 165.0 * math.sin(ang)
            v, f = create_box_mesh(lx - 10, lx + 10, wy - 46, wy, lz - 5, lz + 5)
            add_mesh_entity(msp, 'WHEELS', v, f)
            v, f = create_box_mesh(lx - 10, lx + 10, wy, wy + 46, lz - 5, lz + 5)
            add_mesh_entity(msp, 'WHEELS', v, f)
            
        # Center Hub & 6 Lug Nuts
        hub_face_y = y_outer if wy > 0 else y_inner
        v, f = create_cylinder_y(wx, 170, hub_face_y - 12, hub_face_y + 12, 38, segments=14)
        add_mesh_entity(msp, 'FASTENERS', v, f)
        for n in range(6):
            n_ang = 2.0 * math.pi * n / 6.0
            nx = wx + 26.0 * math.cos(n_ang)
            nz = 170.0 + 26.0 * math.sin(n_ang)
            v, f = create_cylinder_y(nx, nz, hub_face_y - 5, hub_face_y + 10, 6, segments=10)
            add_mesh_entity(msp, 'FASTENERS', v, f)
            
        # Motor
        mot_y0 = wy - 110 if wy > 0 else wy + 35
        mot_y1 = wy - 35 if wy > 0 else wy + 110
        v, f = create_cylinder_y(wx, 170, mot_y0, mot_y1, 44, segments=16)
        add_mesh_entity(msp, 'MOTORS', v, f)

    print("Building 3D Model: 4. Top-Mounted Dual Vision Sensor Turret...")
    v, f = create_cylinder_z(230, 0, 670, 695, 42, segments=18)
    add_mesh_entity(msp, 'CAMERA', v, f)
    v, f = create_box_mesh(205, 260, -42, 42, 695, 755)
    add_mesh_entity(msp, 'CAMERA', v, f)
    for ly in [-16, 16]:
        v, f = create_cylinder_z(262, ly, 715, 740, 13, segments=14)
        add_mesh_entity(msp, 'CAMERA', v, f)
        v, f = create_cylinder_z(268, ly, 720, 735, 11, segments=12)
        add_mesh_entity(msp, 'SENSORS', v, f)

    # RTK-GNSS Riser
    v, f = create_cylinder_z(-260, -140, 640, 850, 9, segments=12)
    add_mesh_entity(msp, 'NAVIGATION', v, f)
    v, f = create_cylinder_z(-260, -140, 850, 880, 42, segments=20)
    add_mesh_entity(msp, 'NAVIGATION', v, f)

    print("Building 3D Model: 5. Rear Drone Docking Station & Docked Quadcopter Drone...")
    v, f = create_box_mesh(-300, 20, -180, 180, 665, 675)
    add_mesh_entity(msp, 'DRONE_DOCK', v, f)
    v, f = create_cylinder_z(-140, 0, 675, 678, 115, segments=24)
    add_mesh_entity(msp, 'DRONE_DOCK', v, f)
    
    # Helipad 'H'
    v, f = create_box_mesh(-180, -165, -45, 45, 678, 680)
    add_mesh_entity(msp, 'NOTES', v, f)
    v, f = create_box_mesh(-115, -100, -45, 45, 678, 680)
    add_mesh_entity(msp, 'NOTES', v, f)
    v, f = create_box_mesh(-165, -115, -8, 8, 678, 680)
    add_mesh_entity(msp, 'NOTES', v, f)
    
    drone_cx = -140
    drone_cy = 0
    drone_base_z = 680
    
    # Drone Body
    v, f = create_box_mesh(drone_cx - 45, drone_cx + 45, -42, 42, drone_base_z + 32, drone_base_z + 62)
    add_mesh_entity(msp, 'DRONE', v, f)
    
    # Arched Landing Skids
    for ly in [-55, 55]:
        v, f = create_box_mesh(drone_cx - 50, drone_cx + 50, ly - 5, ly + 5, drone_base_z, drone_base_z + 34)
        add_mesh_entity(msp, 'DRONE', v, f)
        v, f = create_box_mesh(drone_cx - 65, drone_cx + 65, ly - 8, ly + 8, drone_base_z, drone_base_z + 6)
        add_mesh_entity(msp, 'DRONE', v, f)
        
    drone_arms = [
        (drone_cx + 70, drone_cy + 70),
        (drone_cx + 70, drone_cy - 70),
        (drone_cx - 70, drone_cy + 70),
        (drone_cx - 70, drone_cy - 70)
    ]
    for dax, day in drone_arms:
        v, f = create_box_mesh(min(drone_cx, dax), max(drone_cx, dax), min(drone_cy, day), max(drone_cy, day), drone_base_z + 42, drone_base_z + 49)
        add_mesh_entity(msp, 'DRONE', v, f)
        v, f = create_cylinder_z(dax, day, drone_base_z + 46, drone_base_z + 68, 13, segments=14)
        add_mesh_entity(msp, 'DRONE', v, f)
        v, f = create_cylinder_z(dax, day, drone_base_z + 68, drone_base_z + 71, 65, segments=18)
        add_mesh_entity(msp, 'DRONE', v, f)
        
    v, f = create_cylinder_z(drone_cx + 48, 0, drone_base_z + 20, drone_base_z + 40, 10, segments=12)
    add_mesh_entity(msp, 'CAMERA', v, f)

    print("Building 3D Model: 6. Undercarriage Motorized Retractable Soil Probe Mechanism...")
    v, f = create_box_mesh(65, 95, 45, 75, 240, 450)
    add_mesh_entity(msp, 'SOIL_PROBE', v, f)
    v, f = create_box_mesh(60, 100, 40, 80, 450, 505)
    add_mesh_entity(msp, 'MOTORS', v, f)
    v, f = create_cylinder_z(80, 60, 220, 450, 5, segments=10)
    add_mesh_entity(msp, 'SOIL_PROBE', v, f)
    v, f = create_box_mesh(60, 100, 50, 90, 260, 310)
    add_mesh_entity(msp, 'SOIL_PROBE', v, f)
    v, f = create_cylinder_z(80, 70, 100, 260, 7, segments=12)
    add_mesh_entity(msp, 'SOIL_PROBE', v, f)
    v, f = create_cylinder_z(80, 70, 60, 100, 8, segments=14)
    add_mesh_entity(msp, 'SENSORS', v, f)

    print("Building 3D Model: 7. Internal Electronics, LiFePO4 Battery & Safety...")
    v, f = create_box_mesh(-180, 100, -135, 135, 425, 485)
    add_mesh_entity(msp, 'BATTERY', v, f)
    v, f = create_box_mesh(-140, 140, -145, 145, 495, 565)
    add_mesh_entity(msp, 'ELECTRONICS', v, f)
    v, f = create_cylinder_y(-335, 530, 65, 85, 18, segments=14)
    add_mesh_entity(msp, 'SAFETY', v, f)
    v, f = create_cylinder_y(-335, 530, -85, -65, 18, segments=14)
    add_mesh_entity(msp, 'SAFETY', v, f)

    doc.saveas(output_dxf_path)
    print(f"[SUCCESS] Generated 3D Assembly DXF: {output_dxf_path}")


def build_2d_manufacturing_package(output_dxf_path):
    """Generates complete multi-sheet 2D CAD Manufacturing Drawing Package."""
    doc = ezdxf.new('R2018')
    msp = doc.modelspace()
    
    layers = [
        ('CHASSIS', 4),
        ('WHEELS', 8),
        ('MOTORS', 6),
        ('CAMERA', 4),
        ('SOIL_PROBE', 2),
        ('SENSORS', 3),
        ('ELECTRONICS', 5),
        ('BATTERY', 30),
        ('NAVIGATION', 7),
        ('DRONE_DOCK', 140),
        ('DRONE', 1),
        ('FASTENERS', 9),
        ('DIMENSIONS', 1),
        ('CENTERLINES', 1),
        ('HIDDEN_LINES', 8),
        ('SAFETY', 1),
        ('NOTES', 7),
        ('TITLE_BLOCK', 7),
        ('BORDER', 7)
    ]
    for name, col in layers:
        doc.layers.add(name, color=col)
        
    def draw_sheet_border(origin_x, origin_y, width=1400, height=950, sheet_num=1, sheet_title="GENERAL ASSEMBLY"):
        msp.add_lwpolyline([
            (origin_x, origin_y),
            (origin_x + width, origin_y),
            (origin_x + width, origin_y + height),
            (origin_x, origin_y + height),
            (origin_x, origin_y)
        ], dxfattribs={'layer': 'BORDER'})
        
        mx0 = origin_x + 20
        my0 = origin_y + 10
        mx1 = origin_x + width - 10
        my1 = origin_y + height - 10
        msp.add_lwpolyline([
            (mx0, my0), (mx1, my0), (mx1, my1), (mx0, my1), (mx0, my0)
        ], dxfattribs={'layer': 'BORDER'})
        
        tb_x0 = mx1 - 340
        tb_y0 = my0
        tb_x1 = mx1
        tb_y1 = my0 + 115
        
        msp.add_lwpolyline([
            (tb_x0, tb_y0), (tb_x1, tb_y0), (tb_x1, tb_y1), (tb_x0, tb_y1), (tb_x0, tb_y0)
        ], dxfattribs={'layer': 'TITLE_BLOCK'})
        
        msp.add_line((tb_x0, tb_y0 + 38), (tb_x1, tb_y0 + 38), dxfattribs={'layer': 'TITLE_BLOCK'})
        msp.add_line((tb_x0, tb_y0 + 74), (tb_x1, tb_y0 + 74), dxfattribs={'layer': 'TITLE_BLOCK'})
        msp.add_line((tb_x0 + 175, tb_y0), (tb_x0 + 175, tb_y0 + 74), dxfattribs={'layer': 'TITLE_BLOCK'})
        
        msp.add_text("PROJECT: AGRIBOT-X CYBER FIELD ROVER", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 5.0}).set_placement((tb_x0 + 10, tb_y0 + 94))
        msp.add_text(f"TITLE: {sheet_title}", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 5.5}).set_placement((tb_x0 + 10, tb_y0 + 80))
        msp.add_text("SYSTEM: HIGH-CLEARANCE STRUT ARCHITECTURE", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 3.5}).set_placement((tb_x0 + 10, tb_y0 + 56))
        msp.add_text("FABRICATION STANDARD: ISO 2768-m", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 3.5}).set_placement((tb_x0 + 10, tb_y0 + 44))
        msp.add_text("SCALE: 1:5 / 1:1", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 3.5}).set_placement((tb_x0 + 185, tb_y0 + 56))
        msp.add_text(f"SHEET: {sheet_num} OF 4", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 4.5}).set_placement((tb_x0 + 185, tb_y0 + 44))
        msp.add_text("ALL DIMENSIONS IN MILLIMETERS (MM) - UNLESS NOTED", dxfattribs={'layer': 'NOTES', 'height': 3.2}).set_placement((tb_x0 + 10, tb_y0 + 20))
        msp.add_text("OVER-CANOPY STRADDLE DESIGN FOR DENSE CROP ROWS", dxfattribs={'layer': 'NOTES', 'height': 2.6}).set_placement((tb_x0 + 10, tb_y0 + 8))

    # Sheet 1: General Assembly
    print("Building 2D Package: Sheet 1 - General Assembly Orthographic Views...")
    draw_sheet_border(0, 0, 1400, 950, sheet_num=1, sheet_title="GENERAL ASSEMBLY - HIGH-CLEARANCE STRUT")
    
    fv_cx = 300
    fv_cy = 480
    gz = fv_cy - 170
    msp.add_line((fv_cx - 360, gz), (fv_cx + 360, gz), dxfattribs={'layer': 'CENTERLINES'})
    
    # Tires
    msp.add_lwpolyline([(fv_cx + 215, gz), (fv_cx + 325, gz), (fv_cx + 325, gz + 340), (fv_cx + 215, gz + 340), (fv_cx + 215, gz)], dxfattribs={'layer': 'WHEELS'})
    msp.add_lwpolyline([(fv_cx - 325, gz), (fv_cx - 215, gz), (fv_cx - 215, gz + 340), (fv_cx - 325, gz + 340), (fv_cx - 325, gz)], dxfattribs={'layer': 'WHEELS'})
    
    # Elevated Hull
    msp.add_lwpolyline([
        (fv_cx - 170, gz + 420), (fv_cx + 170, gz + 420),
        (fv_cx + 195, gz + 490), (fv_cx - 195, gz + 490), (fv_cx - 170, gz + 420)
    ], dxfattribs={'layer': 'CHASSIS'})
    msp.add_lwpolyline([
        (fv_cx - 195, gz + 490), (fv_cx + 195, gz + 490),
        (fv_cx + 195, gz + 570), (fv_cx - 195, gz + 570), (fv_cx - 195, gz + 490)
    ], dxfattribs={'layer': 'CHASSIS'})
    msp.add_lwpolyline([
        (fv_cx - 195, gz + 570), (fv_cx + 195, gz + 570),
        (fv_cx + 140, gz + 670), (fv_cx - 140, gz + 670), (fv_cx - 195, gz + 570)
    ], dxfattribs={'layer': 'CHASSIS'})
    
    # LED brow
    msp.add_lwpolyline([
        (fv_cx - 185, gz + 552), (fv_cx + 185, gz + 552),
        (fv_cx + 185, gz + 568), (fv_cx - 185, gz + 568), (fv_cx - 185, gz + 552)
    ], dxfattribs={'layer': 'SAFETY'})
    
    # LED Slits
    msp.add_line((fv_cx - 110, gz + 460), (fv_cx - 102, gz + 520), dxfattribs={'layer': 'SAFETY'})
    msp.add_line((fv_cx + 110, gz + 460), (fv_cx + 102, gz + 520), dxfattribs={'layer': 'SAFETY'})
    
    # Shocks
    for sx_sign in [-1, 1]:
        kx = fv_cx + sx_sign * 235
        msp.add_line((kx, gz + 240), (kx, gz + 520), dxfattribs={'layer': 'FASTENERS'})
        for cz in range(int(gz + 270), int(gz + 490), 25):
            msp.add_line((kx - 22, cz), (kx + 22, cz + 12), dxfattribs={'layer': 'SAFETY'})
            msp.add_line((kx + 22, cz + 12), (kx - 22, cz + 25), dxfattribs={'layer': 'SAFETY'})
        msp.add_line((fv_cx + sx_sign * 180, gz + 510), (kx, gz + 490), dxfattribs={'layer': 'CHASSIS'})
        msp.add_line((fv_cx + sx_sign * 170, gz + 390), (kx, gz + 270), dxfattribs={'layer': 'CHASSIS'})
        
    msp.add_circle((fv_cx - 16, gz + 725), 12, dxfattribs={'layer': 'CAMERA'})
    msp.add_circle((fv_cx + 16, gz + 725), 12, dxfattribs={'layer': 'CAMERA'})
    msp.add_lwpolyline([(fv_cx - 70, gz + 680), (fv_cx + 70, gz + 680), (fv_cx + 40, gz + 740), (fv_cx - 40, gz + 740), (fv_cx - 70, gz + 680)], dxfattribs={'layer': 'DRONE'})
    msp.add_line((fv_cx - 110, gz + 745), (fv_cx + 110, gz + 745), dxfattribs={'layer': 'DRONE'})
    
    msp.add_text("FRONT ELEVATION", dxfattribs={'layer': 'NOTES', 'height': 6.0}).set_placement((fv_cx - 65, gz - 45))
    msp.add_line((fv_cx - 325, gz - 20), (fv_cx + 325, gz - 20), dxfattribs={'layer': 'DIMENSIONS'})
    msp.add_text("680.0 TRACK WIDTH (STANCE)", dxfattribs={'layer': 'DIMENSIONS', 'height': 4.0}).set_placement((fv_cx - 80, gz - 15))
    msp.add_line((fv_cx + 345, gz), (fv_cx + 345, gz + 420), dxfattribs={'layer': 'DIMENSIONS'})
    msp.add_text("420.0 OVER-CANOPY GROUND CLEARANCE", dxfattribs={'layer': 'DIMENSIONS', 'height': 3.5}).set_placement((fv_cx + 350, gz + 205))
    msp.add_line((fv_cx - 355, gz), (fv_cx - 355, gz + 760), dxfattribs={'layer': 'DIMENSIONS'})
    msp.add_text("760.0 ROVER HEIGHT", dxfattribs={'layer': 'DIMENSIONS', 'height': 4.0}).set_placement((fv_cx - 460, gz + 380))

    # Side View
    sv_cx = 880
    sv_cy = 480
    sgz = sv_cy - 170
    msp.add_line((sv_cx - 440, sgz), (sv_cx + 440, sgz), dxfattribs={'layer': 'CENTERLINES'})
    msp.add_circle((sv_cx + 210, sgz + 170), 170, dxfattribs={'layer': 'WHEELS'})
    msp.add_circle((sv_cx + 210, sgz + 170), 110, dxfattribs={'layer': 'CHASSIS'})
    msp.add_circle((sv_cx - 210, sgz + 170), 170, dxfattribs={'layer': 'WHEELS'})
    msp.add_circle((sv_cx - 210, sgz + 170), 110, dxfattribs={'layer': 'CHASSIS'})
    
    msp.add_lwpolyline([
        (sv_cx - 310, sgz + 420), (sv_cx + 310, sgz + 420),
        (sv_cx + 340, sgz + 570), (sv_cx + 280, sgz + 670),
        (sv_cx - 290, sgz + 670), (sv_cx - 330, sgz + 570),
        (sv_cx - 310, sgz + 420)
    ], dxfattribs={'layer': 'CHASSIS'})
    msp.add_circle((sv_cx + 355, sgz + 445), 14, dxfattribs={'layer': 'CHASSIS'})
    msp.add_lwpolyline([(sv_cx + 210, sgz + 670), (sv_cx + 260, sgz + 670), (sv_cx + 260, sgz + 740), (sv_cx + 210, sgz + 740), (sv_cx + 210, sgz + 670)], dxfattribs={'layer': 'CAMERA'})
    msp.add_lwpolyline([(sv_cx - 200, sgz + 670), (sv_cx - 60, sgz + 670), (sv_cx - 60, sgz + 740), (sv_cx - 200, sgz + 740), (sv_cx - 200, sgz + 670)], dxfattribs={'layer': 'DRONE'})
    
    for wx_pos in [sv_cx + 210, sv_cx - 210]:
        msp.add_line((wx_pos, sgz + 240), (wx_pos, sgz + 520), dxfattribs={'layer': 'SAFETY'})
        
    msp.add_text("LEFT SIDE ELEVATION", dxfattribs={'layer': 'NOTES', 'height': 6.0}).set_placement((sv_cx - 70, sgz - 45))
    msp.add_line((sv_cx - 375, sgz - 20), (sv_cx + 375, sgz - 20), dxfattribs={'layer': 'DIMENSIONS'})
    msp.add_text("750.0 OVERALL LENGTH", dxfattribs={'layer': 'DIMENSIONS', 'height': 4.0}).set_placement((sv_cx - 70, sgz - 15))
    msp.add_line((sv_cx - 210, sgz + 170), (sv_cx + 210, sgz + 170), dxfattribs={'layer': 'DIMENSIONS'})
    msp.add_text("420.0 WHEELBASE", dxfattribs={'layer': 'DIMENSIONS', 'height': 3.5}).set_placement((sv_cx - 50, sgz + 180))

    # Top View
    tv_cx = 580
    tv_cy = 180
    msp.add_lwpolyline([(tv_cx - 330, tv_cy - 195), (tv_cx + 330, tv_cy - 195), (tv_cx + 330, tv_cy + 195), (tv_cx - 330, tv_cy + 195), (tv_cx - 330, tv_cy - 195)], dxfattribs={'layer': 'CHASSIS'})
    for wx, wy in [(210, 270), (210, -270), (-210, 270), (-210, -270)]:
        msp.add_lwpolyline([
            (tv_cx + wx - 170, tv_cy + wy - 52.5), (tv_cx + wx + 170, tv_cy + wy - 52.5),
            (tv_cx + wx + 170, tv_cy + wy + 52.5), (tv_cx + wx - 170, tv_cy + wy + 52.5),
            (tv_cx + wx - 170, tv_cy + wy - 52.5)
        ], dxfattribs={'layer': 'WHEELS'})
    msp.add_circle((tv_cx - 140, tv_cy), 95, dxfattribs={'layer': 'DRONE_DOCK'})
    msp.add_text("H", dxfattribs={'layer': 'NOTES', 'height': 48.0}).set_placement((tv_cx - 160, tv_cy - 24))
    msp.add_circle((tv_cx + 230, tv_cy), 35, dxfattribs={'layer': 'CAMERA'})
    
    msp.add_text("TOP PLAN VIEW", dxfattribs={'layer': 'NOTES', 'height': 6.0}).set_placement((tv_cx - 50, tv_cy - 260))
    msp.add_line((tv_cx - 375, tv_cy - 235), (tv_cx + 375, tv_cy - 235), dxfattribs={'layer': 'DIMENSIONS'})
    msp.add_text("750.0 OVERALL LENGTH", dxfattribs={'layer': 'DIMENSIONS', 'height': 4.0}).set_placement((tv_cx - 65, tv_cy - 230))
    msp.add_line((tv_cx + 395, tv_cy - 325), (tv_cx + 395, tv_cy + 325), dxfattribs={'layer': 'DIMENSIONS'})
    msp.add_text("680.0 STANCE WIDTH", dxfattribs={'layer': 'DIMENSIONS', 'height': 4.0}).set_placement((tv_cx + 400, tv_cy - 10))

    gn_x = 70
    gn_y = 170
    msp.add_text("HIGH-CLEARANCE STRUT SYSTEM ENGINEERING NOTES:", dxfattribs={'layer': 'NOTES', 'height': 4.5}).set_placement((gn_x, gn_y))
    notes = [
        "1. ARCHITECTURE: HIGH-CLEARANCE PORTAL STRUT CHASSIS FOR OVER-CANOPY CROP ROW STRADDLING.",
        "2. GROUND CLEARANCE: 420 MM BELLY CLEARANCE PREVENTS DAMAGE TO FOLIAGE UP TO 400 MM CANOPY HEIGHT.",
        "3. SUSPENSION: 4X INDEPENDENT COILOVER SHOCK STRUTS WITH WHITE POWDER-COATED HELICAL SPRINGS (22 N/MM).",
        "4. DRIVETRAIN: 4X BLDC PLANETARY MOTORS INTEGRATED INTO CNC PORTAL KNUCKLES (340 MM CHEVRON TIRES).",
        "5. FACETED HULL: DUAL-TONE CNC 6061-T6 UPPER CANOPY & ARMORED CHARCOAL IP65 WATER-SEALED BELLY.",
        "6. LIGHTING SUITE: CONTINUOUS HORIZONTAL ELECTRIC-BLUE LED BROW BAR & DUAL INTAKE SLITS.",
        "7. INTEGRATED AERIAL DOCK: REAR TOP-DECK SPRING BUSBAR RECHARGING DOCK FOR AUTONOMOUS SURVEILLANCE DRONE."
    ]
    for idx, note in enumerate(notes):
        msp.add_text(note, dxfattribs={'layer': 'NOTES', 'height': 2.9}).set_placement((gn_x, gn_y - 14 - idx * 12))

    # Sheet 2: Exploded Assembly View & BOM
    print("Building 2D Package: Sheet 2 - Exploded Assembly View & Master BOM...")
    s2_x0 = 1500
    s2_y0 = 0
    draw_sheet_border(s2_x0, s2_y0, 1400, 950, sheet_num=2, sheet_title="EXPLODED ASSEMBLY & MASTER BOM")
    
    ev_cx = s2_x0 + 440
    ev_cy = s2_y0 + 520
    
    msp.add_circle((ev_cx, ev_cy + 270), 55, dxfattribs={'layer': 'DRONE'})
    msp.add_text("1. SURVEILLANCE DRONE", dxfattribs={'layer': 'NOTES', 'height': 4.0}).set_placement((ev_cx + 70, ev_cy + 270))
    msp.add_lwpolyline([(ev_cx - 150, ev_cy + 175), (ev_cx + 150, ev_cy + 175), (ev_cx + 150, ev_cy + 210), (ev_cx - 150, ev_cy + 210), (ev_cx - 150, ev_cy + 175)], dxfattribs={'layer': 'DRONE_DOCK'})
    msp.add_text("2. DRONE DOCKING PLATFORM", dxfattribs={'layer': 'NOTES', 'height': 4.0}).set_placement((ev_cx + 170, ev_cy + 190))
    msp.add_lwpolyline([(ev_cx - 140, ev_cy + 95), (ev_cx + 140, ev_cy + 95), (ev_cx + 110, ev_cy + 145), (ev_cx - 110, ev_cy + 145), (ev_cx - 140, ev_cy + 95)], dxfattribs={'layer': 'CHASSIS'})
    msp.add_text("3. FACETED CANOPY HULL", dxfattribs={'layer': 'NOTES', 'height': 4.0}).set_placement((ev_cx + 170, ev_cy + 115))
    msp.add_lwpolyline([(ev_cx - 120, ev_cy + 20), (ev_cx + 120, ev_cy + 20), (ev_cx + 120, ev_cy + 65), (ev_cx - 120, ev_cy + 65), (ev_cx - 120, ev_cy + 20)], dxfattribs={'layer': 'ELECTRONICS'})
    msp.add_text("4. IP65 ELECTRONICS ENCLOSURE", dxfattribs={'layer': 'NOTES', 'height': 4.0}).set_placement((ev_cx + 170, ev_cy + 40))
    msp.add_lwpolyline([(ev_cx - 160, ev_cy - 55), (ev_cx + 160, ev_cy - 55), (ev_cx + 160, ev_cy - 15), (ev_cx - 160, ev_cy - 15), (ev_cx - 160, ev_cy - 55)], dxfattribs={'layer': 'CHASSIS'})
    msp.add_text("5. HIGH-CLEARANCE CHASSIS CORE", dxfattribs={'layer': 'NOTES', 'height': 4.0}).set_placement((ev_cx + 170, ev_cy - 35))
    msp.add_lwpolyline([(ev_cx - 110, ev_cy - 120), (ev_cx + 110, ev_cy - 120), (ev_cx + 110, ev_cy - 80), (ev_cx - 110, ev_cy - 80), (ev_cx - 110, ev_cy - 120)], dxfattribs={'layer': 'BATTERY'})
    msp.add_text("6. 24V 30Ah LiFePO4 SOLID-CORE PACK", dxfattribs={'layer': 'NOTES', 'height': 4.0}).set_placement((ev_cx + 170, ev_cy - 105))
    msp.add_lwpolyline([(ev_cx - 300, ev_cy + 15), (ev_cx - 260, ev_cy + 15), (ev_cx - 260, ev_cy + 160), (ev_cx - 300, ev_cy + 160), (ev_cx - 300, ev_cy + 15)], dxfattribs={'layer': 'SOIL_PROBE'})
    msp.add_text("7. MOTORIZED SOIL PENETRATOR", dxfattribs={'layer': 'NOTES', 'height': 4.0}).set_placement((ev_cx - 480, ev_cy + 85))
    msp.add_lwpolyline([(ev_cx + 260, ev_cy + 30), (ev_cx + 295, ev_cy + 30), (ev_cx + 295, ev_cy + 190), (ev_cx + 260, ev_cy + 190), (ev_cx + 260, ev_cy + 30)], dxfattribs={'layer': 'CAMERA'})
    msp.add_text("8. PAN/TILT VISION TURRET", dxfattribs={'layer': 'NOTES', 'height': 4.0}).set_placement((ev_cx + 310, ev_cy + 110))
    msp.add_line((ev_cx - 180, ev_cy - 200), (ev_cx - 240, ev_cy - 160), dxfattribs={'layer': 'CHASSIS'})
    msp.add_text("9. PORTAL OUTRIGGER ARM", dxfattribs={'layer': 'NOTES', 'height': 4.0}).set_placement((ev_cx - 420, ev_cy - 180))
    msp.add_line((ev_cx + 180, ev_cy - 200), (ev_cx + 240, ev_cy - 160), dxfattribs={'layer': 'SAFETY'})
    msp.add_text("10. WHITE COILOVER SHOCK STRUT", dxfattribs={'layer': 'NOTES', 'height': 4.0}).set_placement((ev_cx + 260, ev_cy - 180))
    msp.add_circle((ev_cx - 240, ev_cy - 220), 55, dxfattribs={'layer': 'WHEELS'})
    msp.add_circle((ev_cx + 240, ev_cy - 220), 55, dxfattribs={'layer': 'WHEELS'})
    msp.add_text("11. Ø 340MM TRACTOR WHEEL & BEADLOCK", dxfattribs={'layer': 'NOTES', 'height': 4.0}).set_placement((ev_cx - 140, ev_cy - 240))
    msp.add_line((ev_cx, ev_cy - 160), (ev_cx, ev_cy + 340), dxfattribs={'layer': 'CENTERLINES'})

    # Master BOM Table
    bom_x = s2_x0 + 740
    bom_y = s2_y0 + 190
    bom_w = 610
    bom_h = 690
    
    msp.add_lwpolyline([(bom_x, bom_y), (bom_x + bom_w, bom_y), (bom_x + bom_w, bom_y + bom_h), (bom_x, bom_y + bom_h), (bom_x, bom_y)], dxfattribs={'layer': 'TITLE_BLOCK'})
    msp.add_line((bom_x, bom_y + bom_h - 35), (bom_x + bom_w, bom_y + bom_h - 35), dxfattribs={'layer': 'TITLE_BLOCK'})
    msp.add_text("HIGH-CLEARANCE STRUT ROVER MASTER BOM", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 4.8}).set_placement((bom_x + 110, bom_y + bom_h - 25))
    
    col_x = [bom_x, bom_x + 45, bom_x + 290, bom_x + 365, bom_x + 475, bom_x + bom_w]
    for cx in col_x:
        msp.add_line((cx, bom_y), (cx, bom_y + bom_h - 35), dxfattribs={'layer': 'TITLE_BLOCK'})
        
    msp.add_line((bom_x, bom_y + bom_h - 65), (bom_x + bom_w, bom_y + bom_h - 65), dxfattribs={'layer': 'TITLE_BLOCK'})
    msp.add_text("ITM", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 3.5}).set_placement((col_x[0] + 6, bom_y + bom_h - 55))
    msp.add_text("COMPONENT / SUBSYSTEM", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 3.5}).set_placement((col_x[1] + 15, bom_y + bom_h - 55))
    msp.add_text("QTY", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 3.5}).set_placement((col_x[2] + 20, bom_y + bom_h - 55))
    msp.add_text("MATERIAL / SPEC", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 3.5}).set_placement((col_x[3] + 15, bom_y + bom_h - 55))
    msp.add_text("PART / COTS REF", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 3.5}).set_placement((col_x[4] + 15, bom_y + bom_h - 55))
    
    bom_items = [
        ("01", "High-Clearance Chassis Lower Belly", "1 SET", "Al 6061-T6 / 5052", "CNC Welded Monocoque"),
        ("02", "Faceted Upper Canopy Bodywork", "1 SET", "Al 5052-H32 (2.0mm)", "Formed Titanium Finish"),
        ("03", "Continuous Electric-Blue LED Brow Bar", "1 EA", "Optical PC / LED Array", "IP67 24V 12W 450nm"),
        ("04", "Heavy-Duty Tubular Front Bullbar", "1 EA", "Al 6061 Tubing D28", "Agri-Guard Black Anodized"),
        ("05", "CNC Portal Outrigger Control Arms", "4 EA", "Al 6061-T6 Billet", "Dual Pivot Spherical Bearing"),
        ("06", "Exposed White Coilover Shock Units", "4 EA", "Chrome Rod / Al Body", "22 N/mm Helical Spring"),
        ("07", "Portal Gearcase Hub Assemblies", "4 SET", "Al 7075-T6 Housing", "1:3.5 Knuckle Portal Reduction"),
        ("08", "All-Terrain Tractor Tires (D340x105)", "4 EA", "High-Grip Rubber", "Deep Chevron Lug V-Tread"),
        ("09", "Graphite Rims & Outer Beadlock Rings", "4 SET", "Al 6061-T6 Billet", "6-Lug Heavy Pattern"),
        ("10", "Planetary Geared BLDC Motors (350W)", "4 EA", "Steel / Neodymium", "24V 150RPM High-Torque"),
        ("11", "Linear Soil Penetration Guide & Lead Screw", "1 SET", "Hardened Alloy Steel", "Hiwin MGN15H + T8x2 L=300"),
        ("12", "Multi-Parameter Soil Sensing Tip", "1 EA", "SS 316 / Gold Pin", "Moist/EC/pH/Temp RS485"),
        ("13", "Dual-Camera Pan/Tilt Vision Turret", "1 SET", "Al 6061 / Dual Servo", "4K RGB + IR Thermal Pod"),
        ("14", "Top Drone Docking Platform Deck", "1 SET", "Al 6061 (380x320mm)", "Funnel Guide & Copper Bus"),
        ("15", "Autonomous Surveillance Quadcopter", "1 EA", "Toray Carbon Fiber", "Curved Skids 4K Gimbal"),
        ("16", "IP65 Waterproof Electronics Enclosure", "1 EA", "Cast Aluminum Box", "Silicone Perimeter Gasket"),
        ("17", "Raspberry Pi 5 (8GB) AI Edge Computer", "1 EA", "FR4 Multi-layer PCB", "Quad Cortex-A76 2.4GHz"),
        ("18", "Hailo-8 M.2 AI Acceleration Module", "1 EA", "FR4 PCB", "26 TOPS Neural Coprocessor"),
        ("19", "STM32F407 High-Reliability Controller", "1 EA", "Industrial Board", "Dual CAN 2.0B / 168MHz"),
        ("20", "Smart CAN-Bus Dual BLDC Drivers", "2 EA", "Metal Clad PCB", "24V 30A Closed-Loop FOC"),
        ("21", "24V 30Ah LiFePO4 Solid Core Battery", "1 PACK", "Prismatic LiFePO4", "Integrated CAN-BMS 720Wh"),
        ("22", "High-Gain Dual-Band RTK Helical GNSS", "1 EA", "Composite Riser", "Centimeter RTK u-blox F9P"),
        ("23", "Heavy-Duty E-Stop & Battery Rotary Switch", "2 EA", "IP66 Sealed Rotary", "100A Battery Cutoff"),
        ("24", "Metric A2-70 Stainless Fastener Schedule", "1 LOT", "A2-70 Stainless Steel", "M4, M5, M6, M8 Flanged")
    ]
    
    row_h = 24.5
    for idx, (it, desc, qty, mat, ref) in enumerate(bom_items):
        ry = bom_y + bom_h - 70 - (idx + 1) * row_h
        msp.add_line((bom_x, ry), (bom_x + bom_w, ry), dxfattribs={'layer': 'TITLE_BLOCK'})
        msp.add_text(it, dxfattribs={'layer': 'NOTES', 'height': 3.2}).set_placement((col_x[0] + 10, ry + 7))
        msp.add_text(desc, dxfattribs={'layer': 'NOTES', 'height': 3.0}).set_placement((col_x[1] + 6, ry + 7))
        msp.add_text(qty, dxfattribs={'layer': 'NOTES', 'height': 3.0}).set_placement((col_x[2] + 16, ry + 7))
        msp.add_text(mat, dxfattribs={'layer': 'NOTES', 'height': 2.8}).set_placement((col_x[3] + 6, ry + 7))
        msp.add_text(ref, dxfattribs={'layer': 'NOTES', 'height': 2.8}).set_placement((col_x[4] + 6, ry + 7))

    # Sheet 3: Cross Sections
    print("Building 2D Package: Sheet 3 - Longitudinal & Transverse Section Views...")
    s3_x0 = 0
    s3_y0 = 1100
    draw_sheet_border(s3_x0, s3_y0, 1400, 950, sheet_num=3, sheet_title="CROSS-SECTIONAL VIEWS & CLEARANCE")
    
    secA_cx = s3_x0 + 700
    secA_cy = s3_y0 + 580
    sgA = secA_cy - 170
    
    msp.add_text("SECTION A-A: LONGITUDINAL CENTERLINE SECTION", dxfattribs={'layer': 'NOTES', 'height': 6.0}).set_placement((secA_cx - 210, sgA + 520))
    msp.add_line((secA_cx - 420, sgA), (secA_cx + 420, sgA), dxfattribs={'layer': 'CENTERLINES'})
    
    msp.add_lwpolyline([
        (secA_cx - 310, sgA + 420), (secA_cx + 310, sgA + 420),
        (secA_cx + 340, sgA + 570), (secA_cx + 280, sgA + 670),
        (secA_cx - 290, sgA + 670), (secA_cx - 330, sgA + 570),
        (secA_cx - 310, sgA + 420)
    ], dxfattribs={'layer': 'CHASSIS'})
    
    msp.add_lwpolyline([(secA_cx - 180, sgA + 425), (secA_cx + 100, sgA + 425), (secA_cx + 100, sgA + 485), (secA_cx - 180, sgA + 485), (secA_cx - 180, sgA + 425)], dxfattribs={'layer': 'BATTERY'})
    for hx in range(-170, 90, 20):
        msp.add_line((secA_cx + hx, sgA + 425), (secA_cx + hx + 15, sgA + 485), dxfattribs={'layer': 'BATTERY'})
    msp.add_text("24V 30Ah LiFePO4 SOLID-CORE BATTERY (Z: 425 - 485 MM)", dxfattribs={'layer': 'NOTES', 'height': 3.5}).set_placement((secA_cx - 160, sgA + 450))
    
    msp.add_lwpolyline([(secA_cx - 140, sgA + 495), (secA_cx + 140, sgA + 495), (secA_cx + 140, sgA + 565), (secA_cx - 140, sgA + 565), (secA_cx - 140, sgA + 495)], dxfattribs={'layer': 'ELECTRONICS'})
    for hx in range(-130, 130, 25):
        msp.add_line((secA_cx + hx, sgA + 495), (secA_cx + hx + 15, sgA + 565), dxfattribs={'layer': 'ELECTRONICS'})
    msp.add_text("IP65 ENCLOSURE: RASPBERRY PI 5 + HAILO-8 + CAN DRIVERS", dxfattribs={'layer': 'NOTES', 'height': 3.5}).set_placement((secA_cx - 140, sgA + 525))
    
    msp.add_lwpolyline([(secA_cx - 300, sgA + 665), (secA_cx + 20, sgA + 665), (secA_cx + 20, sgA + 675), (secA_cx - 300, sgA + 675), (secA_cx - 300, sgA + 665)], dxfattribs={'layer': 'DRONE_DOCK'})
    msp.add_text("REAR TOP-DECK AUTONOMOUS DRONE DOCKING PLATFORM", dxfattribs={'layer': 'NOTES', 'height': 3.5}).set_placement((secA_cx - 280, sgA + 685))
    
    msp.add_line((secA_cx + 360, sgA), (secA_cx + 360, sgA + 420), dxfattribs={'layer': 'DIMENSIONS'})
    msp.add_text("420.0 CANOPY STRADDLE CLEARANCE", dxfattribs={'layer': 'DIMENSIONS', 'height': 3.5}).set_placement((secA_cx + 365, sgA + 210))
    msp.add_line((secA_cx + 360, sgA + 420), (secA_cx + 360, sgA + 670), dxfattribs={'layer': 'DIMENSIONS'})
    msp.add_text("250.0 HULL CAVITY HEIGHT", dxfattribs={'layer': 'DIMENSIONS', 'height': 3.5}).set_placement((secA_cx + 365, sgA + 540))

    # Section B-B
    secB_cx = s3_x0 + 700
    secB_cy = s3_y0 + 200
    sgB = secB_cy - 120
    
    msp.add_text("SECTION B-B: TRANSVERSE SECTION (PORTAL STRUT & SHOCKS)", dxfattribs={'layer': 'NOTES', 'height': 6.0}).set_placement((secB_cx - 220, sgB + 280))
    msp.add_line((secB_cx - 380, sgB), (secB_cx + 380, sgB), dxfattribs={'layer': 'CENTERLINES'})
    
    msp.add_lwpolyline([(secB_cx + 215, sgB), (secB_cx + 325, sgB), (secB_cx + 325, sgB + 340), (secB_cx + 215, sgB + 340), (secB_cx + 215, sgB)], dxfattribs={'layer': 'WHEELS'})
    msp.add_lwpolyline([(secB_cx - 325, sgB), (secB_cx - 215, sgB), (secB_cx - 215, sgB + 340), (secB_cx - 325, sgB + 340), (secB_cx - 325, sgB)], dxfattribs={'layer': 'WHEELS'})
    msp.add_lwpolyline([(secB_cx - 170, sgB + 420), (secB_cx + 170, sgB + 420), (secB_cx + 195, sgB + 570), (secB_cx - 195, sgB + 570), (secB_cx - 170, sgB + 420)], dxfattribs={'layer': 'CHASSIS'})
    
    for sx_sign in [-1, 1]:
        px = secB_cx + sx_sign * 235
        msp.add_line((secB_cx + sx_sign * 180, sgB + 510), (px, sgB + 490), dxfattribs={'layer': 'CHASSIS'})
        msp.add_line((secB_cx + sx_sign * 170, sgB + 390), (px, sgB + 270), dxfattribs={'layer': 'CHASSIS'})
        msp.add_line((px, sgB + 240), (px, sgB + 520), dxfattribs={'layer': 'SAFETY'})
        
    msp.add_line((secB_cx - 270, sgB + 170), (secB_cx + 270, sgB + 170), dxfattribs={'layer': 'DIMENSIONS'})
    msp.add_text("540.0 PORTAL HUB CENTER TRACK", dxfattribs={'layer': 'DIMENSIONS', 'height': 3.5}).set_placement((secB_cx - 80, sgB + 180))

    # Sheet 4: Component Prints
    print("Building 2D Package: Sheet 4 - Detailed Component Manufacturing Prints...")
    s4_x0 = 1500
    s4_y0 = 1100
    draw_sheet_border(s4_x0, s4_y0, 1400, 950, sheet_num=4, sheet_title="DETAILED FABRICATION PRINTS")
    
    # Detail A: Portal Arm
    d1_x = s4_x0 + 80
    d1_y = s4_y0 + 550
    msp.add_text("DETAIL A: CNC PORTAL OUTRIGGER ARM (AL 6061-T6, BILLET 35MM)", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 4.5}).set_placement((d1_x, d1_y + 310))
    msp.add_lwpolyline([
        (d1_x, d1_y + 40), (d1_x + 80, d1_y), (d1_x + 240, d1_y + 30),
        (d1_x + 240, d1_y + 160), (d1_x + 90, d1_y + 190), (d1_x, d1_y + 150),
        (d1_x, d1_y + 40)
    ], dxfattribs={'layer': 'CHASSIS'})
    msp.add_circle((d1_x + 40, d1_y + 95), 25, dxfattribs={'layer': 'CHASSIS'})
    msp.add_circle((d1_x + 200, d1_y + 95), 22, dxfattribs={'layer': 'CHASSIS'})
    msp.add_text("DIA 50.0 H7 INNER PIVOT", dxfattribs={'layer': 'DIMENSIONS', 'height': 3.2}).set_placement((d1_x + 10, d1_y + 130))
    msp.add_text("DIA 44.0 H7 KNUCKLE BORE", dxfattribs={'layer': 'DIMENSIONS', 'height': 3.2}).set_placement((d1_x + 160, d1_y + 130))
    msp.add_text("CNC POCKET WEBBING (5MM WEB). TOLERANCE: +/- 0.05 MM. ANODIZE CLEAR", dxfattribs={'layer': 'NOTES', 'height': 3.0}).set_placement((d1_x, d1_y - 20))

    # Detail B: Shock Clevis
    d2_x = s4_x0 + 720
    d2_y = s4_y0 + 550
    msp.add_text("DETAIL B: COILOVER SHOCK EYELET MOUNT CLEVIS (STEEL 4140)", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 4.5}).set_placement((d2_x, d2_y + 310))
    msp.add_lwpolyline([
        (d2_x, d2_y), (d2_x + 140, d2_y), (d2_x + 140, d2_y + 140),
        (d2_x + 90, d2_y + 180), (d2_x + 50, d2_y + 180), (d2_x, d2_y + 140),
        (d2_x, d2_y)
    ], dxfattribs={'layer': 'CHASSIS'})
    msp.add_circle((d2_x + 70, d2_y + 130), 12, dxfattribs={'layer': 'FASTENERS'})
    msp.add_text("DIA 24.0 H8 SHOCK PIN BORE", dxfattribs={'layer': 'DIMENSIONS', 'height': 3.2}).set_placement((d2_x + 25, d2_y + 155))
    msp.add_circle((d2_x + 35, d2_y + 40), 6.5, dxfattribs={'layer': 'FASTENERS'})
    msp.add_circle((d2_x + 105, d2_y + 40), 6.5, dxfattribs={'layer': 'FASTENERS'})
    msp.add_text("HEAT TREAT: QUENCH & TEMPER TO 38-42 HRC. BLACK OXIDE COATING", dxfattribs={'layer': 'NOTES', 'height': 3.0}).set_placement((d2_x, d2_y - 20))

    # Detail C: Wheel Hub
    d3_x = s4_x0 + 80
    d3_y = s4_y0 + 120
    msp.add_text("DETAIL C: PORTAL DRIVE WHEEL HUB & AXLE (CNC TURNED, 4140)", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 4.5}).set_placement((d3_x, d3_y + 240))
    msp.add_circle((d3_x + 110, d3_y + 100), 75, dxfattribs={'layer': 'CHASSIS'})
    msp.add_circle((d3_x + 110, d3_y + 100), 55, dxfattribs={'layer': 'CENTERLINES'})
    for ang in [0, 60, 120, 180, 240, 300]:
        bx = d3_x + 110 + 55 * math.cos(math.radians(ang))
        by = d3_y + 100 + 55 * math.sin(math.radians(ang))
        msp.add_circle((bx, by), 6.5, dxfattribs={'layer': 'FASTENERS'})
    msp.add_circle((d3_x + 110, d3_y + 100), 22, dxfattribs={'layer': 'CHASSIS'})
    msp.add_lwpolyline([(d3_x + 106, d3_y + 120), (d3_x + 114, d3_y + 120), (d3_x + 114, d3_y + 126), (d3_x + 106, d3_y + 126), (d3_x + 106, d3_y + 120)], dxfattribs={'layer': 'CHASSIS'})
    msp.add_text("DIA 22.0 g6 AXLE BORE + 6MM DIN 6885 KEYWAY (6-LUG PATTERN)", dxfattribs={'layer': 'DIMENSIONS', 'height': 3.0}).set_placement((d3_x + 200, d3_y + 100))
    msp.add_text("SURFACE ROUGHNESS Ra 0.8 ON BEARING JOURNALS", dxfattribs={'layer': 'NOTES', 'height': 3.0}).set_placement((d3_x, d3_y - 20))

    # Detail D: Canopy Flat Pattern
    d4_x = s4_x0 + 720
    d4_y = s4_y0 + 120
    msp.add_text("DETAIL D: FACETED CANOPY SHEET METAL FLAT PATTERN (AL 5052, 2.0MM)", dxfattribs={'layer': 'TITLE_BLOCK', 'height': 4.5}).set_placement((d4_x, d4_y + 240))
    msp.add_lwpolyline([
        (d4_x, d4_y + 20), (d4_x + 300, d4_y + 20), (d4_x + 260, d4_y + 160),
        (d4_x + 40, d4_y + 160), (d4_x, d4_y + 20)
    ], dxfattribs={'layer': 'CHASSIS'})
    msp.add_line((d4_x + 50, d4_y + 20), (d4_x + 70, d4_y + 160), dxfattribs={'layer': 'HIDDEN_LINES'})
    msp.add_line((d4_x + 250, d4_y + 20), (d4_x + 230, d4_y + 160), dxfattribs={'layer': 'HIDDEN_LINES'})
    msp.add_text("BEND 32 DEG DOWN (R=2.0)", dxfattribs={'layer': 'DIMENSIONS', 'height': 3.0}).set_placement((d4_x + 80, d4_y + 90))
    msp.add_text("K-FACTOR: 0.44. BEND DEDUCTION = 3.2 MM. LASER CUT PERIMETER", dxfattribs={'layer': 'NOTES', 'height': 3.0}).set_placement((d4_x, d4_y - 20))

    doc.saveas(output_dxf_path)
    print(f"[SUCCESS] Generated 2D Manufacturing Package DXF: {output_dxf_path}")


def build_autolisp_script(output_lsp_path):
    """Generates native AutoLISP script to construct high-clearance 3D models directly in AutoCAD."""
    content = """;;; =========================================================================
;;; AgriBot-X Cyber Field Rover: High-Clearance Strut Architecture
;;; Native AutoCAD 3D Solid Model Generation AutoLISP (BUILD_AGRIBOT)
;;; =========================================================================

(defun c:BUILD_AGRIBOT ( / oldecho oldosmode)
  (setq oldecho (getvar "CMDECHO"))
  (setq oldosmode (getvar "OSMODE"))
  (setvar "CMDECHO" 0)
  (setvar "OSMODE" 0)
  
  (princ "\\nInitializing AgriBot-X High-Clearance Strut Layers...")
  (command "-LAYER" "M" "CHASSIS" "C" "4" "CHASSIS" "")
  (command "-LAYER" "M" "WHEELS" "C" "8" "WHEELS" "")
  (command "-LAYER" "M" "MOTORS" "C" "6" "MOTORS" "")
  (command "-LAYER" "M" "CAMERA" "C" "4" "CAMERA" "")
  (command "-LAYER" "M" "SOIL_PROBE" "C" "2" "SOIL_PROBE" "")
  (command "-LAYER" "M" "SENSORS" "C" "3" "SENSORS" "")
  (command "-LAYER" "M" "ELECTRONICS" "C" "5" "ELECTRONICS" "")
  (command "-LAYER" "M" "BATTERY" "C" "30" "BATTERY" "")
  (command "-LAYER" "M" "NAVIGATION" "C" "7" "NAVIGATION" "")
  (command "-LAYER" "M" "DRONE_DOCK" "C" "140" "DRONE_DOCK" "")
  (command "-LAYER" "M" "DRONE" "C" "1" "DRONE" "")
  (command "-LAYER" "M" "SAFETY" "C" "1" "SAFETY" "")

  (princ "\\nConstructing 3D Elevated Cyber Hull (Belly Clearance 420mm)...")
  (setvar "CLAYER" "CHASSIS")
  (command "BOX" '(-310.0 -170.0 420.0) '(310.0 170.0 490.0))
  (command "BOX" '(-330.0 -195.0 490.0) '(330.0 195.0 570.0))
  (command "BOX" '(-290.0 -140.0 570.0) '(290.0 140.0 670.0))
  (command "CYLINDER" '(355.0 -160.0 445.0) "14.0" "A" '(355.0 160.0 445.0))

  (princ "\\nConstructing Front Electric-Blue LED Light Bar...")
  (setvar "CLAYER" "SAFETY")
  (command "BOX" '(330.0 -185.0 552.0) '(338.0 185.0 568.0))

  (princ "\\nConstructing 4WD Tractor Wheels (Dia 340mm, Stance 680mm)...")
  (setvar "CLAYER" "WHEELS")
  (command "CYLINDER" '(210.0 217.5 170.0) "2D" "170.0" "A" '(210.0 322.5 170.0))
  (command "CYLINDER" '(210.0 -322.5 170.0) "2D" "170.0" "A" '(210.0 -217.5 170.0))
  (command "CYLINDER" '(-210.0 217.5 170.0) "2D" "170.0" "A" '(-210.0 322.5 170.0))
  (command "CYLINDER" '(-210.0 -322.5 170.0) "2D" "170.0" "A" '(-210.0 -217.5 170.0))

  (princ "\\nConstructing Exposed Vertical Coilover Shock Struts...")
  (setvar "CLAYER" "SAFETY")
  (command "CYLINDER" '(220.0 235.0 240.0) "12.0" "280.0")
  (command "CYLINDER" '(220.0 -235.0 240.0) "12.0" "280.0")
  (command "CYLINDER" '(-220.0 235.0 240.0) "12.0" "280.0")
  (command "CYLINDER" '(-220.0 -235.0 240.0) "12.0" "280.0")

  (princ "\\nConstructing Top Vision Turret...")
  (setvar "CLAYER" "CAMERA")
  (command "BOX" '(205.0 -42.0 695.0) '(260.0 42.0 755.0))
  (command "CYLINDER" '(262.0 -16.0 715.0) "12.0" "25.0")
  (command "CYLINDER" '(262.0 16.0 715.0) "12.0" "25.0")

  (princ "\\nConstructing Rear Drone Docking Station & Surveillance Quadcopter...")
  (setvar "CLAYER" "DRONE_DOCK")
  (command "BOX" '(-300.0 -180.0 665.0) '(20.0 180.0 675.0))
  (setvar "CLAYER" "DRONE")
  (command "BOX" '(-185.0 -42.0 712.0) '(-95.0 42.0 742.0))
  (command "CYLINDER" '(-70.0 70.0 726.0) "12.0" "22.0")
  (command "CYLINDER" '(-70.0 -70.0 726.0) "12.0" "22.0")
  (command "CYLINDER" '(-210.0 70.0 726.0) "12.0" "22.0")
  (command "CYLINDER" '(-210.0 -70.0 726.0) "12.0" "22.0")

  (princ "\\nConstructing Retractable Soil Probe...")
  (setvar "CLAYER" "SOIL_PROBE")
  (command "BOX" '(65.0 45.0 240.0) '(95.0 75.0 450.0))
  (command "CYLINDER" '(80.0 70.0 100.0) "7.0" "160.0")

  (princ "\\nConstructing Internal Electronics & LiFePO4 Battery...")
  (setvar "CLAYER" "BATTERY")
  (command "BOX" '(-180.0 -135.0 425.0) '(100.0 135.0 485.0))
  (setvar "CLAYER" "ELECTRONICS")
  (command "BOX" '(-140.0 -145.0 495.0) '(140.0 145.0 565.0))

  (princ "\\nConfiguring 3D Visual Style and Isometric Viewport...")
  (command "-VPOINT" "1" "-1" "1")
  (command "ZOOM" "E")
  (command "VSMINTERNAL" "Shaded")
  (setvar "OSMODE" oldosmode)
  (setvar "CMDECHO" oldecho)
  (princ "\\n[SUCCESS] AgriBot-X High-Clearance Strut 3D Model Successfully Built in AutoCAD!")
  (princ)
)

(princ "\\nAgriBot-X High-Clearance Strut Loaded. Type BUILD_AGRIBOT to construct the 3D model.")
(princ)
"""
    with open(output_lsp_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[SUCCESS] Generated AutoLISP Script: {output_lsp_path}")


def build_automation_script(output_scr_path):
    """Generates an AutoCAD command script (.scr) to load and view the model."""
    content = """;;; AutoCAD Script: AgriBot-X Auto Setup
FILEDIA 0
CMDECHO 0
-VPOINT 1 -1 1
VSMINTERNAL Shaded
ZOOM E
REGEN
CMDECHO 1
FILEDIA 1
"""
    with open(output_scr_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"[SUCCESS] Generated AutoCAD Automation Script: {output_scr_path}")


if __name__ == "__main__":
    cad_dir = os.path.dirname(os.path.abspath(__file__))
    dxf_3d = os.path.join(cad_dir, "agribot_3d_assembly.dxf")
    dxf_2d = os.path.join(cad_dir, "agribot_2d_manufacturing_package.dxf")
    lsp_path = os.path.join(cad_dir, "agribot_model.lsp")
    scr_path = os.path.join(cad_dir, "agribot_build_script.scr")
    
    print("=== STARTING AGRIBOT-X HIGH-CLEARANCE CAD GENERATION ===")
    build_3d_rover_assembly(dxf_3d)
    build_2d_manufacturing_package(dxf_2d)
    build_autolisp_script(lsp_path)
    build_automation_script(scr_path)
    print("=== AGRIBOT-X CAD GENERATION COMPLETE ===")
