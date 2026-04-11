@echo off
setlocal

cd /d "%~dp0"

set PORT=3000
if not "%~1"=="" set PORT=%~1

echo ==========================================
echo Image Investments - LAN Dev Server
echo Port: %PORT%
echo Local URL: http://localhost:%PORT%
echo ==========================================

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto :end
)

echo Starting Next.js on 0.0.0.0 ...
call npm run dev -- --hostname 0.0.0.0 --port %PORT%

:end
endlocal
pause
