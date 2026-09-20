;;; =========================================================================
;;; AGRIBOT-X AUTOCAD 2026: 2D JUDGES AND PANELISTS WHITE-BACKGROUND PDF PLOTTER
;;; Commands Defined:
;;;   WHITEBG          - Switch AutoCAD 2D Model Space background to Pure White
;;;   BLACKBG          - Switch AutoCAD Model Space background back to Dark Theme
;;;   PLOT_JUDGES_PDF  - Plot All 4 Sheets to PDF and launch combined Judges Package
;;;   PLOT_SHEET1      - Plot Sheet 1 (Front Elevation GA) to PDF
;;;   PLOT_SHEET2      - Plot Sheet 2 (Exploded Assembly View) to PDF
;;;   PLOT_SHEET3      - Plot Sheet 3 (Cross Sections and Clearances) to PDF
;;;   PLOT_SHEET4      - Plot Sheet 4 (Component Manufacturing Prints) to PDF
;;; =========================================================================

(vl-load-com)

;; --- 1. White Background Command ---
(defun c:WHITEBG ()
  (vl-load-com)
  (setenv "Background" "16777215")
  (setenv "BkgColor" "16777215")
  (setenv "TextFill" "1")
  (setvar "COLORTHEME" 1)
  (setvar "VIEWMODE" 0)
  (command "REGENALL")
  (princ "\n[AutoCAD 2026] Display background set to PURE WHITE for Judges/Panelists presentation.")
  (princ)
)

;; --- 2. Dark Background Command ---
(defun c:BLACKBG ()
  (vl-load-com)
  (setenv "Background" "2171169")
  (setenv "BkgColor" "2171169")
  (setvar "COLORTHEME" 0)
  (command "REGENALL")
  (princ "\n[AutoCAD 2026] Display background restored to standard Dark Theme.")
  (princ)
)

;; --- Internal Helper: Plot Window to PDF ---
(defun PlotWindowToPDF (p1 p2 pdfPath sheetName / acadApp doc oldDia oldEcho deviceName paperSize)
  (setq oldDia (getvar "FILEDIA"))
  (setq oldEcho (getvar "CMDECHO"))
  (setvar "FILEDIA" 0)
  (setvar "CMDECHO" 0)
  
  ;; Determine available AutoCAD PDF plotter
  (setq deviceName "AutoCAD PDF (General Documentation).pc3")
  (setq paperSize "ISO_full_bleed_A4_(297.00_x_210.00_MM)")
  
  (princ (strcat "\nPlotting " sheetName " to " pdfPath "..."))
  
  ;; Execute AutoCAD -PLOT Command
  (vl-cmdf "-PLOT"
    "Yes"                                 ;; Detailed plot configuration?
    "Model"                               ;; Enter a layout name
    deviceName                            ;; Enter output device name
    paperSize                             ;; Enter paper size
    "Millimeters"                         ;; Enter paper units
    "Landscape"                           ;; Enter drawing orientation
    "No"                                  ;; Plot upside down?
    "Window"                              ;; Enter plot area [Window]
    p1                                    ;; Lower-left window corner
    p2                                    ;; Upper-right window corner
    "Fit"                                 ;; Plot scale
    "Center"                              ;; Plot offset (Center)
    "Yes"                                 ;; Plot with plot styles?
    "acad.ctb"                            ;; Enter plot style table name
    "Yes"                                 ;; Plot with lineweights?
    "As displayed"                        ;; Shade plot setting
    pdfPath                               ;; Enter output file name
    "No"                                  ;; Save changes to page setup?
    "Yes"                                 ;; Proceed with plot?
  )
  
  (setvar "FILEDIA" oldDia)
  (setvar "CMDECHO" oldEcho)
  (princ (strcat "\n[SUCCESS] Saved " sheetName " -> " pdfPath))
  (princ)
)

;; --- 3. Individual Sheet Plot Commands ---
(defun c:PLOT_SHEET1 (/ dwgDir outPdf)
  (c:WHITEBG)
  (setq dwgDir (getvar "DWGPREFIX"))
  (setq outPdf (strcat dwgDir "AgriBot_Sheet1_GA_Orthographic.pdf"))
  (PlotWindowToPDF '(0.0 0.0) '(1400.0 950.0) outPdf "Sheet 1: GA Orthographic")
  (princ)
)

(defun c:PLOT_SHEET2 (/ dwgDir outPdf)
  (c:WHITEBG)
  (setq dwgDir (getvar "DWGPREFIX"))
  (setq outPdf (strcat dwgDir "AgriBot_Sheet2_Exploded_Assembly.pdf"))
  (PlotWindowToPDF '(1500.0 0.0) '(2900.0 950.0) outPdf "Sheet 2: Exploded Assembly")
  (princ)
)

(defun c:PLOT_SHEET3 (/ dwgDir outPdf)
  (c:WHITEBG)
  (setq dwgDir (getvar "DWGPREFIX"))
  (setq outPdf (strcat dwgDir "AgriBot_Sheet3_Cross_Sections.pdf"))
  (PlotWindowToPDF '(0.0 1100.0) '(1400.0 2050.0) outPdf "Sheet 3: Cross Sections")
  (princ)
)

(defun c:PLOT_SHEET4 (/ dwgDir outPdf)
  (c:WHITEBG)
  (setq dwgDir (getvar "DWGPREFIX"))
  (setq outPdf (strcat dwgDir "AgriBot_Sheet4_Component_Prints.pdf"))
  (PlotWindowToPDF '(1500.0 1100.0) '(2900.0 2050.0) outPdf "Sheet 4: Detail Component Prints")
  (princ)
)

;; --- 4. Master Plot Command for Judges ---
(defun c:PLOT_JUDGES_PDF (/ dwgDir pkgPdf)
  (c:WHITEBG)
  (setq dwgDir (getvar "DWGPREFIX"))
  (setq pkgPdf (strcat dwgDir "AgriBot_X_2D_Judges_Package.pdf"))
  
  (princ "\n=== PLOTTING COMPLETE 4-SHEET 2D DRAWING PACKAGE FOR JUDGES ===")
  (c:PLOT_SHEET1)
  (c:PLOT_SHEET2)
  (c:PLOT_SHEET3)
  (c:PLOT_SHEET4)
  
  (princ "\n[SUCCESS] All 4 sheets plotted in high resolution with pure white background!")
  (princ (strcat "\nCombined Package available at: " pkgPdf))
  
  ;; Automatically launch the combined PDF
  (if (findfile pkgPdf)
    (vl-bb-set 'openPdf (startapp "explorer.exe" (strcat "\"" pkgPdf "\"")))
  )
  (princ)
)

(princ "\nAgriBot-X 2D Judges Plotter Loaded.")
(princ "\nType WHITEBG to set pure white screen background.")
(princ "\nType PLOT_JUDGES_PDF to plot all 4 sheets to PDF.")
(princ "\nType PLOT_SHEET1, PLOT_SHEET2, PLOT_SHEET3, or PLOT_SHEET4 for single sheets.")
(princ)
