@echo off
echo ========================================
echo Pet Care AI - Setup Fix Script
echo ========================================
echo.

echo [1/5] Stopping any running Metro bundler...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Done!

echo.
echo [2/5] Clearing Metro bundler cache...
if exist "%LOCALAPPDATA%\Expo\Metro" (
    rmdir /s /q "%LOCALAPPDATA%\Expo\Metro"
    echo Metro cache cleared!
) else (
    echo Metro cache not found (already clean)
)

echo.
echo [3/5] Clearing Temp cache files...
del /q "%TEMP%\metro-*" 2>nul
del /q "%TEMP%\haste-*" 2>nul
del /q "%TEMP%\react-*" 2>nul
echo Temp cache cleared!

echo.
echo [4/5] Clearing Watchman cache (if installed)...
watchman watch-del-all 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Watchman cache cleared!
) else (
    echo Watchman not installed (skipping)
)

echo.
echo [5/5] Starting Expo with clean cache...
echo.
echo ========================================
echo The Metro bundler should start now...
echo Look for: "Metro waiting on exp://..."
echo ========================================
echo.

npx expo start --clear

echo.
echo ========================================
echo If you still see "Unable to resolve" errors:
echo 1. Press Ctrl+C to stop
echo 2. Run: npm install
echo 3. Run this script again
echo ========================================
echo.

pause
