@echo off
title SUPER BACHAT BAZZAR - POS Billing Server
echo ==========================================================
echo   SUPER BACHAT BAZZAR - BILLING & INVENTORY SYSTEM
echo   Location: Attardah Kachhi Pakki, Muzaffarpur
echo ==========================================================
echo Starting POS Local Server on http://localhost:8080 ...
start http://localhost:8080
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" -Port 8080
pause
