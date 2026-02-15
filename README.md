# Pet Care AI

AI-powered pet care assistant for dogs and cats. Track health, diet, medications, and get instant AI advice.

## 🚀 Quick Start

### Option 1: Offline Mode (No Setup Required)
```bash
# Install dependencies
npm install

# Start the app
npm start

# Scan QR code with Expo Go
```
The app will run in offline mode with mock data.

### Option 2: Online Mode with Supabase (Recommended)
```bash
# Run setup script
setup-supabase.bat

# Follow the setup guide
# See SUPABASE_SETUP_GUIDE.md for detailed instructions
```

## 🔐 Authentication & Database

This app now supports multiple authentication methods:
- **Email/Password** authentication (recommended, easiest setup)
- **Google OAuth** authentication (optional)
- **Cloud database** for data persistence
- **User-specific data** isolation
- **Real-time sync** across devices
- **Offline mode** fallback

### Setup Requirements
1. Supabase account (free tier works)
2. Google Cloud Console account (only if using Google OAuth)
3. 10-15 minutes for setup

See **[SUPABASE_SETUP_GUIDE.md](SUPABASE_SETUP_GUIDE.md)** for complete instructions.

## 📱 Features

- 🏠 **Home**: Pet overview and quick stats
- 🐾 **Pets**: Manage your pets
- 💊 **Care**: Track medications, vet visits, grooming
- 🍖 **Diet**: Manage meals and nutrition
- 🤖 **Assistant**: AI-powered pet care advice
- 🔔 **Notifications**: Smart reminders
- 📴 **Offline**: Works without internet
- 🔐 **Secure**: Email/Password + Google OAuth + Row Level Security

## 🗄️ Database Schema

The app uses Supabase (PostgreSQL) with:
- 10 tables for comprehensive pet data
- Row Level Security (RLS) for data isolation
- Automatic profile creation on signup
- Real-time sync capabilities

See `supabase-schema.sql` for the complete schema.

## 📚 Documentation

Complete documentation in the `docs/` folder:

- **[Design Document](DESIGN_DOCUMENT.md)** - Complete app design and architecture
- **[Supabase Setup Guide](SUPABASE_SETUP_GUIDE.md)** - Complete setup instructions
- **[Migration Summary](MIGRATION_SUMMARY.md)** - What changed and why
- **[Getting Started](docs/getting-started/QUICK_START.md)** - App usage guide
- **[Troubleshooting](docs/getting-started/TROUBLESHOOTING.md)** - Fix common issues
- **[Architecture](docs/architecture/)** - App structure and design
- **[Features](docs/features/)** - Feature guides
- **[Deployment](docs/deployment/)** - Build and publish

## 🛠️ Tech Stack

- React Native + Expo
- TypeScript
- Expo Router (file-based routing)
- Supabase (PostgreSQL + Auth)
- Google OAuth
- React Context + Real-time DB
- expo-notifications
- Google Gemini AI

## 📦 Project Structure

```
pet-care-ai-mobile/
├── app/                    # Screens (Expo Router)
│   ├── (tabs)/            # Main tab screens
│   ├── login.tsx          # Login screen
│   └── _layout.tsx        # Root layout with auth
├── components/             # Reusable components
├── contexts/               # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── PetContext.supabase.tsx  # Data with Supabase
├── hooks/                  # Custom React hooks
├── lib/                    # Core libraries
│   └── supabase.ts        # Supabase client
├── services/               # Business logic
│   ├── supabaseService.ts # Database operations
│   └── aiService.ts       # AI integration
├── types/                  # TypeScript types
├── utils/                  # Utility functions
├── docs/                   # Documentation
├── supabase-schema.sql    # Database schema
├── SUPABASE_SETUP_GUIDE.md # Setup instructions
└── MIGRATION_SUMMARY.md   # Migration details
```

## 🔧 Environment Variables

Create a `.env` file:

```env
# Supabase (Required for online mode)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini AI (Optional)
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-key
```

## 🧪 Testing

```bash
# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android

# Run on web
npx expo start --web
```

## 🏗️ Building

```bash
# Install EAS CLI
npm install -g eas-cli

# Build for production
eas build --platform all --profile production

# Submit to stores
eas submit --platform all
```

## 🔐 Security Features

- Email/Password authentication
- Google OAuth authentication (optional)
- Row Level Security (RLS) on all tables
- User-specific data isolation
- Secure token storage
- API key protection
- No direct database access from client
- Email verification for new accounts

## 🌐 Offline Mode

The app works in two modes:

1. **Online Mode** (Supabase configured)
   - Email/Password or Google OAuth
   - Data stored in cloud
   - Syncs across devices

2. **Offline Mode** (No Supabase)
   - No authentication required
   - Uses mock data
   - Perfect for development

## 📄 License

Private project - All rights reserved

## 🆘 Need Help?

- [Supabase Setup Guide](SUPABASE_SETUP_GUIDE.md)
- [Migration Summary](MIGRATION_SUMMARY.md)
- [Quick Start Guide](docs/getting-started/QUICK_START.md)
- [Troubleshooting](docs/getting-started/TROUBLESHOOTING.md)
- [Full Documentation](docs/README.md)

## 🎯 What's New

### v2.0.0 - Supabase Integration
- ✅ Email/Password authentication
- ✅ Google OAuth authentication (optional)
- ✅ Cloud database with PostgreSQL
- ✅ User-specific data isolation
- ✅ Real-time sync across devices
- ✅ Row Level Security
- ✅ Email verification
- ✅ Offline mode fallback
- ✅ Production-ready infrastructure

---

**Version**: 2.0.0  
**Status**: Production Ready with Authentication

## 🚀 Getting Started Checklist

- [ ] Run `npm install`
- [ ] Read `SUPABASE_SETUP_GUIDE.md`
- [ ] Create Supabase project
- [ ] Run database schema
- [ ] Configure Email authentication (or Google OAuth)
- [ ] Create `.env` file
- [ ] Run `npm start -- --clear`
- [ ] Test authentication
- [ ] Add your first pet!

**Ready to go!** 🎉
