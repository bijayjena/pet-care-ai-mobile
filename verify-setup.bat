@echo off
echo ========================================
echo Pet Care AI - Setup Verification
echo ========================================
echo.

echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org/
    goto :error
) else (
    node --version
    echo ✅ Node.js installed
)
echo.

echo [2/6] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm not found
    goto :error
) else (
    npm --version
    echo ✅ npm installed
)
echo.

echo [3/6] Checking for .env file...
if exist .env (
    echo ✅ .env file found
    echo.
    echo Checking environment variables...
    findstr /C:"EXPO_PUBLIC_SUPABASE_URL" .env >nul
    if %errorlevel% neq 0 (
        echo ⚠️  EXPO_PUBLIC_SUPABASE_URL not set
    ) else (
        echo ✅ EXPO_PUBLIC_SUPABASE_URL configured
    )
    findstr /C:"EXPO_PUBLIC_SUPABASE_ANON_KEY" .env >nul
    if %errorlevel% neq 0 (
        echo ⚠️  EXPO_PUBLIC_SUPABASE_ANON_KEY not set
    ) else (
        echo ✅ EXPO_PUBLIC_SUPABASE_ANON_KEY configured
    )
) else (
    echo ⚠️  .env file not found
    echo Creating from .env.example...
    copy .env.example .env
    echo ⚠️  Please edit .env and add your Supabase credentials
)
echo.

echo [4/6] Checking node_modules...
if exist node_modules (
    echo ✅ node_modules found
) else (
    echo ⚠️  node_modules not found
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        goto :error
    )
    echo ✅ Dependencies installed
)
echo.

echo [5/6] Checking required assets...
if exist assets\images\icon.png (
    echo ✅ App icon found
) else (
    echo ⚠️  App icon not found at assets\images\icon.png
    echo Please add your app icon (1024x1024 PNG)
)
if exist assets\images\favicon.png (
    echo ✅ Favicon found
) else (
    echo ⚠️  Favicon not found at assets\images\favicon.png
)
echo.

echo [6/6] Checking TypeScript configuration...
if exist tsconfig.json (
    echo ✅ tsconfig.json found
) else (
    echo ❌ tsconfig.json not found
    goto :error
)
echo.

echo ========================================
echo Setup Verification Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Ensure .env has your Supabase credentials
echo 2. Run the database schema: supabase-schema.sql
echo 3. If updating existing database, run: supabase-migration-onboarding.sql
echo 4. Add app logos (see LOGO_SETUP_GUIDE.md)
echo 5. Start the app: npm start
echo.
echo For detailed setup instructions, see:
echo - README.md
echo - SUPABASE_SETUP_GUIDE.md
echo - LOGO_SETUP_GUIDE.md
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo ❌ Setup verification failed
echo ========================================
echo Please fix the errors above and run this script again.
echo.
pause
exit /b 1
