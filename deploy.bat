@echo off
echo ========================================
echo   KidQuest - Push to GitHub + Deploy
echo ========================================

cd /d "%~dp0"

:: Clean up old git if exists
if exist ".git" rmdir /s /q ".git"

:: Init fresh git repo
git init
git checkout -b main

:: Create .gitignore
echo node_modules/ > .gitignore
echo .env.local >> .gitignore
echo dist/ >> .gitignore
echo .DS_Store >> .gitignore

:: Add all files and commit
git add -A
git commit -m "Initial commit: KidQuest Phase 1 MVP"

:: Push to GitHub
git remote add origin https://github.com/timeismoneymyfrd-coder/kidquest.git
git push -u origin main --force

echo.
echo ========================================
echo   Done! Code pushed to GitHub.
echo   Now go to https://vercel.com/new
echo   and import: timeismoneymyfrd-coder/kidquest
echo ========================================
pause
