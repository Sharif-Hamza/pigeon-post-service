@echo off
echo.
echo ===================================
echo  Pigeon Post Service - GitHub Setup
echo ===================================
echo.

echo Step 1: Create a new repository on GitHub
echo Go to: https://github.com/new
echo Repository name: pigeon-post-service
echo Make it public or private (your choice)
echo Don't initialize with README (we already have files)
echo.

echo Step 2: Copy the repository URL from GitHub
echo It will look like: https://github.com/yourusername/pigeon-post-service.git
echo.

set /p REPO_URL="Paste your GitHub repository URL here: "

echo.
echo Step 3: Adding remote and pushing...
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

echo.
echo ✅ Code pushed to GitHub!
echo.
echo Next steps:
echo 1. Go to railway.app and sign up
echo 2. Create new project from GitHub repo
echo 3. Set root directory to 'backend'
echo 4. Add environment variables (see RAILWAY_DEPLOYMENT.md)
echo.
pause
