@echo off
REM SwanyThree Ultimate - Quick Setup Script (Windows)

echo.
echo 🚀 SwanyThree Ultimate - Quick Setup
echo ====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Error: Node.js is not installed
    echo Please install Node.js 18 or higher from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detected
echo.

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)
echo ✅ Root dependencies installed
echo.

REM Setup backend
echo 🔧 Setting up backend...
cd apps\backend

if not exist .env (
    echo 📝 Creating backend .env file...
    copy .env.example .env >nul
    echo ⚠️  Please edit apps\backend\.env with your credentials
    echo.
)

echo 📦 Installing backend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend setup complete
echo.

REM Setup frontend
echo 🎨 Setting up frontend...
cd ..\frontend

if not exist .env (
    echo 📝 Creating frontend .env file...
    copy .env.example .env >nul
    echo ⚠️  Please edit apps\frontend\.env with your API URL
    echo.
)

echo 📦 Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend setup complete
echo.

REM Return to root
cd ..\..

echo ✅ Setup Complete!
echo.
echo 📋 Next Steps:
echo 1. Edit apps\backend\.env with your credentials:
echo    - SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY
echo    - JWT_SECRET (min 32 characters)
echo    - ANTHROPIC_API_KEY
echo.
echo 2. Edit apps\frontend\.env with your API URL
echo.
echo 3. Setup your Supabase database:
echo    - Run apps\backend\schema.sql in Supabase SQL Editor
echo    - (Optional) Run apps\backend\seed.sql for test data
echo.
echo 4. Start development servers:
echo    npm run dev
echo.
echo 5. Open http://localhost:5173 in your browser
echo.
echo 📖 For detailed instructions, see README.md
echo.
pause
