# 📦 Installation Instructions

## Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A code editor (VS Code recommended)
- Git (optional)

---

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Supabase client
- Expo Auth Session
- React Native dependencies
- And more...

---

## Step 2: Choose Your Mode

### Option A: Offline Mode (Quick Start)

Perfect for testing and development without any setup:

```bash
npm start
```

The app will:
- Run with mock data
- No authentication required
- Work completely offline
- Perfect for UI/UX testing

### Option B: Online Mode (Production)

For full functionality with cloud database and authentication:

1. **Run the setup script:**
   ```bash
   setup-supabase.bat
   ```

2. **Follow the setup guide:**
   - Open `SUPABASE_SETUP_GUIDE.md`
   - Create Supabase project
   - Configure Google OAuth
   - Update `.env` file

3. **Start the app:**
   ```bash
   npm start -- --clear
   ```

---

## Step 3: Run the App

### On Physical Device (Recommended)

1. Install **Expo Go** app:
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code shown in terminal

3. App will load on your device

### On iOS Simulator

```bash
npx expo run:ios
```

### On Android Emulator

```bash
npx expo run:android
```

### On Web Browser

```bash
npx expo start --web
```

---

## Step 4: Verify Installation

### Offline Mode Checklist
- [ ] App starts without errors
- [ ] Can see mock pets (Max and Luna)
- [ ] Can navigate between tabs
- [ ] Can add new pets
- [ ] Can view reminders

### Online Mode Checklist
- [ ] Login screen appears
- [ ] Google sign-in works
- [ ] User profile created in Supabase
- [ ] Can add pets (stored in cloud)
- [ ] Data persists after app restart
- [ ] Can sign out

---

## Common Installation Issues

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Issue: Expo CLI not found

**Solution:**
```bash
npm install -g expo-cli
```

### Issue: Metro bundler errors

**Solution:**
```bash
# Clear Expo cache
npx expo start --clear

# Or manually clear
rmdir /s /q .expo
rmdir /s /q node_modules\.cache
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check for type errors
npm run typecheck

# If errors persist, restart TypeScript server in VS Code
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

---

## Environment Setup

### Create .env file

```bash
# Copy the example file
copy .env.example .env
```

### Edit .env with your credentials

```env
# For online mode, add your Supabase credentials
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Add Gemini API key for AI features
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-key-here
```

**Important:** Restart Expo server after editing `.env`

---

## Development Tools

### Recommended VS Code Extensions

- ESLint
- Prettier
- React Native Tools
- TypeScript and JavaScript Language Features

### Useful Commands

```bash
# Start with cache cleared
npm start -- --clear

# Type checking
npm run typecheck

# Lint code
npm run lint

# Build for production
eas build --platform all
```

---

## Project Structure Overview

```
pet-care-ai-mobile/
├── app/                    # Screens (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   ├── login.tsx          # Login screen
│   └── _layout.tsx        # Root layout
├── components/             # Reusable UI components
├── contexts/               # State management
│   ├── AuthContext.tsx    # Authentication
│   └── PetContext.supabase.tsx  # Data management
├── lib/                    # Core libraries
│   └── supabase.ts        # Supabase client
├── services/               # Business logic
│   ├── supabaseService.ts # Database operations
│   └── aiService.ts       # AI integration
├── types/                  # TypeScript definitions
├── .env                    # Environment variables (create this)
├── .env.example           # Environment template
└── supabase-schema.sql    # Database schema
```

---

## Next Steps

After successful installation:

1. **Offline Mode:**
   - Explore the app with mock data
   - Test all features
   - Familiarize yourself with the UI

2. **Online Mode:**
   - Follow `SUPABASE_SETUP_GUIDE.md`
   - Set up authentication
   - Configure database
   - Test with real data

3. **Development:**
   - Read the documentation in `docs/`
   - Check out `MIGRATION_SUMMARY.md`
   - Review `QUICK_REFERENCE.md`

---

## Getting Help

If you encounter issues:

1. Check `TROUBLESHOOTING.md` in docs folder
2. Review `SUPABASE_SETUP_GUIDE.md` for setup issues
3. Check Expo logs in terminal
4. Verify all prerequisites are installed
5. Try clearing cache: `npm start -- --clear`

---

## Success! 🎉

You should now have:
- ✅ All dependencies installed
- ✅ App running on your device/simulator
- ✅ Either offline mode working or Supabase configured
- ✅ Ready to start using Pet Care AI!

**Enjoy managing your pets' health!** 🐾
