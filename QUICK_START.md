# Quick Start Guide - Pet Care AI v1.1.0

Get up and running in 10 minutes!

## 🚀 Prerequisites

- Node.js 18+ installed
- Supabase account (free tier)
- Code editor (VS Code recommended)

## 📦 Step 1: Install Dependencies

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd pet-care-ai-mobile

# Install dependencies
npm install
```

## 🔧 Step 2: Configure Environment

```bash
# Copy environment template
copy .env.example .env

# Edit .env and add your Supabase credentials
# Get these from: https://app.supabase.com/project/_/settings/api
```

Your `.env` should look like:
```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ Step 3: Setup Database

1. Go to your Supabase project
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy contents of `supabase-schema.sql`
5. Paste and click "Run"
6. Wait for "Success" message

**For existing databases**: Use `supabase-migration-onboarding.sql` instead

## ✅ Step 4: Verify Setup

```bash
# Run verification script
verify-setup.bat

# Or manually check:
node --version  # Should be 18+
npm --version   # Should be 9+
```

## 🎨 Step 5: Add Logos (Optional)

For now, the app will use placeholder icons. To add custom logos:

1. See `LOGO_SETUP_GUIDE.md` for requirements
2. Create or download your logo assets
3. Place in `assets/images/` folder
4. Update `app.json` if needed

**Skip this step for initial testing**

## 🏃 Step 6: Start the App

```bash
# Start development server
npm start

# Or use specific platform
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## 📱 Step 7: Test on Device

### Using Expo Go (Easiest)
1. Install Expo Go app on your phone
2. Scan QR code from terminal
3. App will load on your device

### Using Simulator/Emulator
```bash
# iOS (Mac only)
npm run ios

# Android
npm run android
```

## 🧪 Step 8: Test the App

### New User Flow
1. Click "Sign Up"
2. Enter email and password
3. Complete onboarding:
   - Welcome screen → Click "Start"
   - Photo screen → Click "Skip for now"
   - Name screen → Enter pet name
   - Type screen → Select dog or cat
   - Complete screen → Click "Get Started"
4. You should see the main app with your pet!

### Existing User Flow
1. Sign in with existing credentials
2. Onboarding should be skipped
3. You should see your existing data

## 🎉 You're Done!

The app is now running. Here's what you can do:

- ✅ Add pets
- ✅ Track meals
- ✅ Set reminders
- ✅ Manage care tasks
- ✅ Use AI assistant

## 🐛 Troubleshooting

### "Supabase is not configured"
- Check `.env` file exists
- Verify credentials are correct
- Restart the app

### "Network Error"
- Check internet connection
- Verify Supabase project is active
- Check firewall settings

### "Can't complete onboarding"
- Check console for errors
- Verify database schema is set up
- Check RLS policies are enabled

**More help**: See `TROUBLESHOOTING.md`

## 📚 Next Steps

### Learn More
- Read `README.md` for full documentation
- Check `CHANGES_SUMMARY.md` for what's new
- Review `TESTING_CHECKLIST.md` before deploying

### Customize
- Add your logo assets
- Update app name in `app.json`
- Customize colors in `constants/theme.ts`
- Add your own features

### Deploy
- Follow `DEPLOYMENT_CHECKLIST.md`
- Build for iOS/Android
- Submit to app stores

## 🆘 Need Help?

1. **Check Documentation**
   - `TROUBLESHOOTING.md` - Common issues
   - `SUPABASE_SETUP_GUIDE.md` - Database help
   - `LOGO_SETUP_GUIDE.md` - Branding help

2. **Check Logs**
   - Terminal output
   - Browser console (web)
   - Expo DevTools

3. **Verify Setup**
   - Run `verify-setup.bat`
   - Check all files exist
   - Verify credentials

4. **Get Support**
   - Check GitHub issues
   - Create new issue with details
   - Include error messages and logs

## 🎯 Common Commands

```bash
# Start app
npm start

# Clear cache and restart
npm run reset

# Check for errors
npm run typecheck

# Run linter
npm run lint

# Clean install
npm run clean

# Build for production
npm run build:ios
npm run build:android
```

## ✅ Checklist

Before you start developing:

- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Database schema deployed
- [ ] App starts without errors
- [ ] Can sign up new user
- [ ] Can complete onboarding
- [ ] Data persists after restart

## 🚀 Ready to Go!

You're all set! Start building amazing pet care features.

**Happy coding!** 🐾

---

**Version**: 1.1.0
**Last Updated**: February 17, 2026
**Estimated Setup Time**: 10-15 minutes
