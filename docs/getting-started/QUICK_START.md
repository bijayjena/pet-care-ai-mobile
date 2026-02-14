# Quick Start Guide

Get the Pet Care AI app running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm 9+ installed
- Expo Go app on your phone (for testing)

## Installation

```bash
# Install dependencies
npm install
```

## Start the App

### Option 1: Use Fix Script (Recommended)
```bash
fix-setup.bat
```

### Option 2: Manual Start
```bash
npm start -- --clear
```

## What You Should See

```
✔ Metro waiting on exp://192.168.x.x:8081
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

## Run on Device

1. Install Expo Go:
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent

2. Scan the QR code in terminal

3. App loads! 🎉

## Common Commands

```bash
# Start with clean cache
npm start -- --clear

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run on web
npx expo start --web
```

## Troubleshooting

### "Unable to resolve" errors
```bash
npm start -- --clear
```

### Port 8081 in use
```bash
npm start -- --port 8082
```

### Still having issues?
See [Troubleshooting Guide](TROUBLESHOOTING.md)

## Next Steps

1. ✅ App is running
2. Add your first pet
3. Create care tasks
4. Test notifications (physical device only)
5. Explore AI assistant

## Environment Variables

Create `.env` file (optional):

```env
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
EXPO_PUBLIC_GEMINI_API_KEY=your-key
```

Currently uses mock data, so these are optional.

## Development Workflow

1. Edit code in your IDE
2. Save file
3. App auto-reloads (Fast Refresh)

## Testing Notifications

Notifications only work on physical devices:

1. Start app on phone
2. Grant notification permissions
3. Add a pet
4. Add care task (due in 5 minutes)
5. Wait for notification
6. Tap notification → navigates to pet detail

## Key Features

- 🏠 Home: Pet overview
- 🐾 Pets: Manage pets
- 💊 Care: Track medications, vet visits
- 🍖 Diet: Manage meals
- 🤖 Assistant: AI advice
- 🔔 Notifications: Smart reminders
- 📴 Offline: Works without internet

## Need Help?

- [Troubleshooting](TROUBLESHOOTING.md)
- [Developer Onboarding](DEVELOPER_ONBOARDING.md)
- [Architecture Docs](../architecture/)
- [Feature Guides](../features/)
