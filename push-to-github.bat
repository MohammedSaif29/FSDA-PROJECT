@echo off
echo ===================================================
echo   EduVault - Push to GitHub (FSDA-PROJECT)
echo ===================================================
echo.

cd /d "c:\Users\Asus\.gemini\antigravity\scratch\FSAD-PS28"

echo [1/4] Pulling latest from remote...
git pull origin main
echo.

echo [2/4] Staging all files...
git add .
echo.

echo [3/4] Committing...
set /p msg="Enter commit message (or press Enter for default): "
if "%msg%"=="" set msg=Auto commit: updated project files
git commit -m "%msg%"
echo.

echo [4/4] Pushing to GitHub...
git push origin main
echo.

if %ERRORLEVEL%==0 (
    echo ===================================================
    echo   SUCCESS! All files pushed to GitHub.
    echo   https://github.com/MohammedSaif29/FSDA-PROJECT
    echo ===================================================
) else (
    echo Push failed. Check the error above.
)

echo.
pause
