@echo off
echo ===================================
echo   Pushing project to GitHub...
echo ===================================
echo.

set /p msg="Enter commit message (press Enter for default): "
if "%msg%"=="" set msg="Auto commit: updated project files"

echo.
echo [1/3] Adding all files to staging...
git add .

echo.
echo [2/3] Committing changes...
git commit -m "%msg%"

echo.
echo [3/3] Pushing to repository...
git push origin main

echo.
echo ===================================
echo   Done!
echo ===================================
pause
