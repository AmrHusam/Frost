@echo off
echo ===================================================
echo   Starting Frost Global Dialer Simulation
echo ===================================================

echo [1/3] Starting Backend API (Port 3000)...
start "Frost API" cmd /c "cd api && npm run dev"

echo [2/3] Starting Web Frontend (Port 5173)...
start "Frost Web" cmd /c "cd web && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 10

echo [INFO] Opening Browser...
start http://localhost:5173

echo.
echo ===================================================
echo   System is running!
echo   - Backend: http://localhost:3000
echo   - Frontend: http://localhost:5173
echo.
echo   Keep this window open or close the other windows
echo   to stop the servers.
echo ===================================================
pause
