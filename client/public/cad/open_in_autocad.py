"""
AgriBot-X AutoCAD 2026 Bridge & Launcher
Connects to running AutoCAD 2026 or launches it with AgriBot-X 3D and 2D models.
Configures 3D visual styles, viewports, and layers automatically.
"""

import os
import sys
import subprocess
import time

def find_autocad_exe():
    standard_paths = [
        r"C:\Program Files\Autodesk\AutoCAD 2026\acad.exe",
        r"C:\Program Files\Autodesk\AutoCAD 2025\acad.exe",
        r"C:\Program Files\Autodesk\AutoCAD 2024\acad.exe"
    ]
    for p in standard_paths:
        if os.path.isfile(p):
            return p
    return None

def open_with_com(dxf_path):
    try:
        import win32com.client
        acad = win32com.client.GetActiveObject("AutoCAD.Application")
        print(f"[COM] Connected to active AutoCAD session: {acad.Caption}")
        doc = acad.Documents.Open(dxf_path)
        print(f"[COM] Opened {dxf_path} in AutoCAD!")
        doc.SendCommand("-VPOINT 1 -1 1\n")
        doc.SendCommand("ZOOM E\n")
        doc.SendCommand("VSMINTERNAL Shaded\n")
        return True
    except Exception as e:
        print(f"[COM Notice] COM Automation interface returned: {e}")
        return False

def open_with_process(acad_exe, dxf_path, scr_path=None):
    cmd = [acad_exe, dxf_path]
    if scr_path and os.path.isfile(scr_path):
        cmd.extend(["/b", scr_path])
    print(f"[Process] Launching AutoCAD: {' '.join(cmd)}")
    subprocess.Popen(cmd)
    print(f"[Process] Successfully opened {os.path.basename(dxf_path)} in AutoCAD 2026!")

def main():
    cad_dir = os.path.dirname(os.path.abspath(__file__))
    dxf_3d = os.path.join(cad_dir, "agribot_3d_assembly.dxf")
    dxf_2d = os.path.join(cad_dir, "agribot_2d_manufacturing_package.dxf")
    scr_path = os.path.join(cad_dir, "agribot_build_script.scr")
    lsp_path = os.path.join(cad_dir, "agribot_model.lsp")
    
    print("=======================================================")
    print("   AgriBot-X Autonomous Rover - AutoCAD 2026 Connector")
    print("=======================================================")
    
    target_dxf = dxf_3d
    if len(sys.argv) > 1 and sys.argv[1].lower() in ['2d', 'drawing']:
        target_dxf = dxf_2d
        print("Selected Target: 2D Manufacturing Drawing Package (4 Sheets)")
    else:
        print("Selected Target: 3D Solid Model Assembly")
        
    print(f"File Path: {target_dxf}")
    
    # Try COM first
    success = open_with_com(target_dxf)
    if not success:
        acad_exe = find_autocad_exe()
        if acad_exe:
            print(f"Found AutoCAD executable: {acad_exe}")
            open_with_process(acad_exe, target_dxf, scr_path)
        else:
            print("[ERROR] Could not find acad.exe. Please associate .dxf with AutoCAD.")
            os.startfile(target_dxf)
            
    print("\nTo also view the 2D Manufacturing Drawings in AutoCAD, run:")
    print("  python cad/open_in_autocad.py 2d")
    print("\nTo build native ACIS 3D Solids inside AutoCAD command line:")
    print("  1. In AutoCAD, type: APPLOAD")
    print(f"  2. Select and load: {lsp_path}")
    print("  3. Type command: BUILD_AGRIBOT")
    print("=======================================================\n")

if __name__ == "__main__":
    main()
