@echo off
echo ========================================
echo Pet Care AI - Supabase Setup
echo ========================================
echo.

REM Check if .env exists
if exist .env (
    echo [OK] .env file found
) else (
    echo [!] Creating .env file from template...
    copy .env.example .env
    echo [!] Please edit .env file with your Supabase credentials
    echo.
    pause
)

echo.
echo Installing dependencies...
call npm install

echo.
echo ========================================
echo Setup Instructions:
echo ========================================
echo.
echo 1. Open SUPABASE_SETUP_GUIDE.md for detailed instructions
echo 2. Create a Supabase project at https://supabase.com
echo 3. Run the SQL schema from supabase-schema.sql
echo 4. Configure Google OAuth in Supabase
echo 5. Update .env file with your credentials
echo 6. Run: npm start -- --clear
echo.
echo ========================================
echo Quick Links:
echo ========================================
echo - Supabase Dashboard: https://supabase.com/dashboard
echo - Google Cloud Console: https://console.cloud.google.com
echo - Setup Guide: SUPABASE_SETUP_GUIDE.md
echo.
pause
