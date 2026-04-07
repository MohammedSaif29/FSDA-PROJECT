@echo off
echo ========================================================
echo Automatically Pushing EduVault to GitHub
echo ========================================================

echo.
echo [1/7] Ensuring Git is initialized...
git init

echo.
echo [2/7] Staging all new and modified files...
git add .

echo.
echo [3/7] Saving files into a secure commit...
git commit -m "feat: massive UI overhaul, backend API fixes, and real-time Captcha integration"

echo.
echo [4/7] Preparing main branch...
git branch -M main

echo.
echo [5/7] Connecting to your GitHub repository...
git remote remove origin 2>nul
git remote add origin https://github.com/MohammedSaif29/FSDA-PROJECT.git

echo.
echo [6/7] Merging any missing items from GitHub into your local workspace...
git pull origin main --allow-unrelated-histories --no-rebase -m "Merge remote changes"

echo.
echo [7/7] Pushing everything up to GitHub...
git push -u origin main

echo.
echo ========================================================
echo Git Sync Complete! Check your GitHub Repository.
echo ========================================================
pause
