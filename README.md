# Pet Care AI

AI-powered pet care assistant for dogs and cats. Track health, diet, medications, and get instant AI advice.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the app
npm start -- --clear

# Or use the fix script
fix-setup.bat
```

Then scan the QR code with Expo Go app on your phone.

## 📱 Features

- 🏠 **Home**: Pet overview and quick stats
- 🐾 **Pets**: Manage your pets
- 💊 **Care**: Track medications, vet visits, grooming
- 🍖 **Diet**: Manage meals and nutrition
- 🤖 **Assistant**: AI-powered pet care advice
- 🔔 **Notifications**: Smart reminders
- 📴 **Offline**: Works without internet

## 📚 Documentation

Complete documentation in the `docs/` folder:

- **[Getting Started](docs/getting-started/QUICK_START.md)** - Setup and installation
- **[Troubleshooting](docs/getting-started/TROUBLESHOOTING.md)** - Fix common issues
- **[Architecture](docs/architecture/)** - App structure and design
- **[Features](docs/features/)** - Feature guides
- **[Deployment](docs/deployment/)** - Build and publish

## 🛠️ Tech Stack

- React Native + Expo
- TypeScript
- Expo Router (file-based routing)
- React Context + AsyncStorage
- expo-notifications
- Google Gemini AI

## 📦 Project Structure

```
pet-care-ai-mobile/
├── app/                    # Screens (Expo Router)
├── components/             # Reusable components
├── contexts/               # React Context providers
├── hooks/                  # Custom React hooks
├── services/               # Business logic
├── types/                  # TypeScript types
├── utils/                  # Utility functions
├── docs/                   # Documentation
└── store-metadata/         # App store assets
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

## 📄 License

Private project - All rights reserved

## 🆘 Need Help?

- [Quick Start Guide](docs/getting-started/QUICK_START.md)
- [Troubleshooting](docs/getting-started/TROUBLESHOOTING.md)
- [Full Documentation](docs/README.md)

---

**Version**: 1.0.0  
**Status**: Production Ready
