;;; =========================================================================
;;; AgriBot-X AutoCAD White Background Print Utility
;;; Commands:
;;;   WHITEBG - Sets Model Space background to Pure White (RGB 255,255,255)
;;;   BLACKBG - Restores Model Space background to Dark/Black
;;; =========================================================================

(vl-load-com)

(defun c:WHITEBG ()
  (setq acad-app (vlax-get-acad-object))
  (setq acad-pref (vla-get-preferences acad-app))
  (setq acad-disp (vla-get-display acad-pref))
  ;; Set 2D and 3D Model space background to 16777215 (Pure White)
  (vl-catch-all-apply 'vla-put-graphicswincodelcolor (list acad-disp 16777215))
  (vl-catch-all-apply 'vla-put-modelcrosshaircolor (list acad-disp 0))
  (command "REGEN")
  (princ "\n[AutoCAD] Viewport background set to PURE WHITE for clean printing/plotting.")
  (princ)
)

(defun c:BLACKBG ()
  (setq acad-app (vlax-get-acad-object))
  (setq acad-pref (vla-get-preferences acad-app))
  (setq acad-disp (vla-get-display acad-pref))
  ;; Restore to standard dark (0 = Black, 2171169 = Charcoal)
  (vl-catch-all-apply 'vla-put-graphicswincodelcolor (list acad-disp 2171169))
  (vl-catch-all-apply 'vla-put-modelcrosshaircolor (list acad-disp 16777215))
  (command "REGEN")
  (princ "\n[AutoCAD] Viewport background restored to standard dark.")
  (princ)
)

(princ "\nWhite Background Utility Loaded. Type WHITEBG for white print view, or BLACKBG to restore.")
(princ)
