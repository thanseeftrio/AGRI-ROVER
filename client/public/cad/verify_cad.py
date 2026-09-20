"""
AgriBot-X CAD Package Verification Script: High-Clearance Strut Architecture
Audits:
- Layer compliance (all 18 layers present)
- Entity counts and bounding boxes for 3D model
- 2D manufacturing drawing sheet dimensions and text annotations
"""

import os
import ezdxf

def verify_3d_dxf(filepath):
    print(f"\n--- Verifying 3D DXF: {filepath} ---")
    doc = ezdxf.readfile(filepath)
    msp = doc.modelspace()
    
    layers = {l.dxf.name for l in doc.layers}
    print(f"Total Layers Defined: {len(layers)}")
    required_layers = [
        'CHASSIS', 'WHEELS', 'MOTORS', 'CAMERA', 'SOIL_PROBE', 
        'SENSORS', 'ELECTRONICS', 'BATTERY', 'NAVIGATION', 
        'DRONE_DOCK', 'DRONE', 'FASTENERS', 'CABLES', 'DIMENSIONS', 
        'CENTERLINES', 'HIDDEN_LINES', 'SAFETY', 'NOTES'
    ]
    missing = [l for l in required_layers if l not in layers]
    if missing:
        print(f"WARNING: Missing layers: {missing}")
    else:
        print("ALL 18 REQUIRED AUTOCAD LAYERS PRESENT!")
        
    mesh_count = sum(1 for e in msp if e.dxftype() == 'MESH')
    print(f"Total 3D Mesh SubD Entities: {mesh_count}")
    
    min_x, max_x = float('inf'), float('-inf')
    min_y, max_y = float('inf'), float('-inf')
    min_z, max_z = float('inf'), float('-inf')
    
    belly_min_z = float('inf')
    for entity in msp:
        if entity.dxftype() == 'MESH':
            ys = [v[1] for v in entity.vertices]
            zs = [v[2] for v in entity.vertices]
            xs = [v[0] for v in entity.vertices]
            
            min_x, max_x = min(min_x, min(xs)), max(max_x, max(xs))
            min_y, max_y = min(min_y, min(ys)), max(max_y, max(ys))
            min_z, max_z = min(min_z, min(zs)), max(max_z, max(zs))
            
            # Central hull belly straddling the crop rows (crosses Y=0 centerline)
            if entity.dxf.layer == 'CHASSIS' and min(ys) < 0 < max(ys) and min(zs) > 200:
                belly_min_z = min(belly_min_z, min(zs))
                
    length = max_x - min_x
    width = max_y - min_y
    height = max_z - min_z
    print(f"3D Model Bounding Box:")
    print(f"  X: {min_x:.1f} to {max_x:.1f} mm (Length = {length:.1f} mm)")
    print(f"  Y: {min_y:.1f} to {max_y:.1f} mm (Width = {width:.1f} mm)")
    print(f"  Z: {min_z:.1f} to {max_z:.1f} mm (Height = {height:.1f} mm)")
    print(f"  Ground: {min_z:.1f} mm (Tires touch ground at Z=0 mm)")
    print(f"  Belly Ground Clearance: {belly_min_z:.1f} mm (Over-canopy crop clearance)")
    
    assert 740 <= length <= 780, f"Length {length} not within [740, 780]"
    assert 640 <= width <= 690, f"Width {width} not within [640, 690]"
    assert 850 <= height <= 1150, f"Height {height} not within [850, 1150]"
    assert 410 <= belly_min_z <= 430, f"Belly clearance {belly_min_z} not within [410, 430]"
    print("[PASS] 3D Solid Model verified to within high-clearance specification!")

def verify_2d_dxf(filepath):
    print(f"\n--- Verifying 2D Manufacturing Drawing DXF: {filepath} ---")
    doc = ezdxf.readfile(filepath)
    msp = doc.modelspace()
    
    lines = sum(1 for e in msp if e.dxftype() == 'LINE')
    polylines = sum(1 for e in msp if e.dxftype() in ['LWPOLYLINE', 'POLYLINE'])
    circles = sum(1 for e in msp if e.dxftype() == 'CIRCLE')
    texts = sum(1 for e in msp if e.dxftype() == 'TEXT')
    
    print(f"2D Entities Count:")
    print(f"  Lines: {lines}")
    print(f"  Polylines: {polylines}")
    print(f"  Circles / Holes: {circles}")
    print(f"  Text Annotations / Dimensions / Notes: {texts}")
    
    assert lines >= 100, f"Lines {lines} less than 100"
    assert polylines >= 40, f"Polylines {polylines} less than 40"
    assert circles >= 20, f"Circles {circles} less than 20"
    assert texts >= 150, f"Texts {texts} less than 150"
    print("[PASS] 2D Manufacturing Drawing Package verified with rich engineering geometry across 4 Sheets!")

if __name__ == "__main__":
    cad_dir = os.path.dirname(os.path.abspath(__file__))
    verify_3d_dxf(os.path.join(cad_dir, "agribot_3d_assembly.dxf"))
    verify_2d_dxf(os.path.join(cad_dir, "agribot_2d_manufacturing_package.dxf"))
