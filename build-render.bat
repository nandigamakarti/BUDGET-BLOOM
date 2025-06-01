@echo off
echo ===== Preparing BudgetBloom for Render Deployment =====

echo 1. Installing dependencies...
call npm install

echo 2. Building the project...
call npm run build

echo 3. Verifying build...
if not exist "dist" (
  echo Build failed! dist directory not found.
  exit /b 1
)

echo 4. Build successful! Files ready for deployment.
echo Your app is ready to be deployed to Render.
echo See DEPLOYMENT.md for detailed instructions.

echo ===== Deployment Preparation Complete =====
