@echo off
echo Starting EduCore LMS...

echo.
echo ==============================================
echo 1. Make sure you have PostgreSQL running
echo 2. Make sure you have filled in Backend/.env and Frontend/.env.local
echo ==============================================
echo.

echo Starting Backend...
start "EduCore Backend" cmd /k "cd Backend && npm run start:dev"

echo Starting Frontend...
start "EduCore Frontend" cmd /k "cd Frontend && npm run dev"

echo Both servers are starting in separate windows!
echo Backend will be available at http://localhost:3001
echo Frontend will be available at http://localhost:3000
pause
