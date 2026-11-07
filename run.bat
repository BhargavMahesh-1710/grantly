@echo off
title GRANTLY - Scholarship Platform
echo ========================================================
echo       Starting GRANTLY - Frontend Hackathon App
echo ========================================================
echo.
echo Opening browser at http://localhost:5173/ ...
start http://localhost:5173/
echo.
echo Starting Vite Development Server...
echo Press Ctrl + C to stop the server at any time.
echo.
npm.cmd run dev
pause
