@echo off
REM ==========================================
REM  Maturita App — Auto-launch script
REM  Vloz tento soubor do shell:startup
REM  (Win+R -> shell:startup -> Enter)
REM ==========================================
timeout /t 3 /nobreak >nul
start "" "https://maturita-app.netlify.app"
