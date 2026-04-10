@echo off
echo Fixing git directory ownership issue...
git config --global --add safe.directory C:/Users/Asus/.gemini/antigravity/scratch/FSAD-PS28/frontend

echo Pushing Frontend project to https://github.com/MohammedSaif29/FSAD_PROJECT_FRONTEND.git

cd frontend
git init
git add .
git commit -m "Initialize frontend repository"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/MohammedSaif29/FSAD_PROJECT_FRONTEND.git
git push -u origin main -f
cd ..

echo Frontend push expected to be complete!
pause
