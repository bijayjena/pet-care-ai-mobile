# Pet Care AI - Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the Pet Care AI mobile app to production environments.

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] No linting errors
- [ ] Code reviewed and approved
- [ ] Version number updated

### Configuration
- [ ] Environment variables set
- [ ] API endpoints configured
- [ ] Analytics integrated
- [ ] Error tracking enabled
- [ ] Feature flags configured

### Assets
- [ ] App icons generated (all sizes)
- [ ] Splash screens created
- [ ] Images optimized
- [ ] Fonts included
- [ ] Localization files ready

### Legal & Compliance
- [ ] Privacy policy updated
- [ ] Terms of service current
- [ ] App store descriptions ready
- [ ] Screenshots prepared
- [ ] Compliance requirements met

---

## 🍎 iOS Deployment

### Prerequisites
```bash
# Install Xcode (Mac only)
# Download from Mac App Store

# Install CocoaPods
sudo gem install cocoapods

# Install iOS dependencies
cd ios && pod install && cd ..
```

### Build Configuration

#### 1. Update app.json
```json
{
  "expo": {
    "name": "Pet Care AI",
    "slug": "pet-care-ai-mobile",
    "version": "1.0.2",
    "ios": {
      "bundleIdentifier": "com.petcare.ai",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "We need camera access to photograph symptoms",
        "NSPhotoLibraryUsageDescription": "We need photo library access to select pet photos"
      }
    }
  }
}
```

#### 2. Generate iOS Build
```bash
# Using EAS Build (Recommended)
npm install -g eas-cli
eas login
eas build:configure
eas build --platform ios

# Or using Expo
expo build:ios
```

#### 3. App Store Connect Setup
1. Create app in App Store Connect
2. Fill in app information
3. Upload screenshots (required sizes):
   - 6.7" (iPhone 14 Pro Max): 1290 x 2796
   - 6.5" (iPhone 11 Pro Max): 1242 x 2688
   - 5.5" (iPhone 8 Plus): 1242 x 2208
4. Set pricing and availability
5. Submit for review

### TestFlight Distribution
```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios
```

---

## 🤖 Android Deployment

### Prerequisites
```bash
# Install Android Studio
# Download from https://developer.android.com/studio

# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Build Configuration

#### 1. Update app.json
```json
{
  "expo": {
    "android": {
      "package": "com.petcare.ai",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/icon.png",
        "backgroundColor": "#3B82F6"
      },
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    }
  }
}
```

#### 2. Generate Keystore
```bash
# Generate upload keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore pet-care-upload.keystore \
  -alias pet-care-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Store keystore securely (DO NOT commit to git)
```

#### 3. Generate Android Build
```bash
# Using EAS Build (Recommended)
eas build --platform android

# Or using Expo
expo build:android
```

#### 4. Google Play Console Setup
1. Create app in Google Play Console
2. Fill in store listing
3. Upload screenshots (required sizes):
   - Phone: 1080 x 1920 (minimum 2)
   - 7" Tablet: 1200 x 1920
   - 10" Tablet: 1600 x 2560
4. Set content rating
5. Set pricing and distribution
6. Submit for review

### Internal Testing
```bash
# Build for internal testing
eas build --platform android --profile preview

# Submit to Google Play
eas submit --platform android
```

---

## 🌐 Web Deployment

### Build for Web
```bash
# Build web version
npm run build:web

# Output in web-build/
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=web-build
```

---

## 🔧 Environment Configuration

### Environment Variables

#### Development (.env.development)
```bash
API_URL=http://localhost:3000
SUPABASE_URL=https://dev.supabase.co
SUPABASE_ANON_KEY=your_dev_key
ANALYTICS_ID=dev_analytics_id
SENTRY_DSN=dev_sentry_dsn
```

#### Production (.env.production)
```bash
API_URL=https://api.petcare.ai
SUPABASE_URL=https://prod.supabase.co
SUPABASE_ANON_KEY=your_prod_key
ANALYTICS_ID=prod_analytics_id
SENTRY_DSN=prod_sentry_dsn
```

### Loading Environment Variables
```typescript
// config/env.ts
import Constants from 'expo-constants';

export const ENV = {
  API_URL: Constants.expoConfig?.extra?.apiUrl,
  SUPABASE_URL: Constants.expoConfig?.extra?.supabaseUrl,
  SUPABASE_ANON_KEY: Constants.expoConfig?.extra?.supabaseAnonKey,
  ANALYTICS_ID: Constants.expoConfig?.extra?.analyticsId,
  SENTRY_DSN: Constants.expoConfig?.extra?.sentryDsn,
};
```

---

## 📊 Analytics Integration

### Firebase Analytics
```bash
# Install Firebase
npm install @react-native-firebase/app @react-native-firebase/analytics

# Configure in app.json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/analytics"
    ]
  }
}
```

### Usage
```typescript
import analytics from '@react-native-firebase/analytics';

// Track screen view
await analytics().logScreenView({
  screen_name: 'Home',
  screen_class: 'HomeScreen',
});

// Track event
await analytics().logEvent('reminder_completed', {
  pet_id: 'max',
  reminder_type: 'medication',
});
```

---

## 🐛 Error Tracking

### Sentry Integration
```bash
# Install Sentry
npm install @sentry/react-native

# Initialize
npx @sentry/wizard -i reactNative -p ios android
```

### Configuration
```typescript
// app/_layout.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: ENV.SENTRY_DSN,
  enableInExpoDevelopment: false,
  debug: __DEV__,
  tracesSampleRate: 1.0,
});

export default Sentry.wrap(RootLayout);
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

#### .github/workflows/deploy.yml
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Type check
        run: npm run typecheck
      
      - name: Lint
        run: npm run lint
      
      - name: Build iOS
        run: eas build --platform ios --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Build Android
        run: eas build --platform android --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Submit to stores
        run: |
          eas submit --platform ios --non-interactive
          eas submit --platform android --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

---

## 📱 Over-The-Air (OTA) Updates

### EAS Update
```bash
# Install EAS Update
npm install expo-updates

# Configure in app.json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[project-id]"
    }
  }
}

# Publish update
eas update --branch production --message "Bug fixes"
```

### Update Channels
- **production**: Live app users
- **staging**: Internal testing
- **development**: Development builds

---

## 🔐 Security Best Practices

### Code Obfuscation
```bash
# Enable ProGuard (Android)
# android/app/build.gradle
android {
  buildTypes {
    release {
      minifyEnabled true
      proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
  }
}
```

### API Key Protection
```typescript
// Never commit API keys
// Use environment variables
// Rotate keys regularly
// Use different keys per environment
```

### SSL Pinning
```typescript
// Implement SSL pinning for API calls
import { fetch } from 'react-native-ssl-pinning';

fetch('https://api.petcare.ai/pets', {
  method: 'GET',
  sslPinning: {
    certs: ['cert1', 'cert2'],
  },
});
```

---

## 📈 Performance Monitoring

### React Native Performance
```typescript
import { PerformanceObserver } from 'react-native-performance';

const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

observer.observe({ entryTypes: ['measure'] });
```

### Bundle Size Analysis
```bash
# Analyze bundle size
npx react-native-bundle-visualizer

# Optimize images
npx expo-optimize
```

---

## 🎯 Release Strategy

### Versioning
Follow Semantic Versioning (SemVer):
- **Major**: Breaking changes (2.0.0)
- **Minor**: New features (1.1.0)
- **Patch**: Bug fixes (1.0.1)

### Release Channels
1. **Alpha**: Internal testing (weekly)
2. **Beta**: External testers (bi-weekly)
3. **Production**: Public release (monthly)

### Rollout Strategy
```
Day 1:   5% of users
Day 3:   25% of users
Day 5:   50% of users
Day 7:   100% of users
```

---

## 📝 Post-Deployment

### Monitoring
- [ ] Check error rates in Sentry
- [ ] Monitor analytics in Firebase
- [ ] Review app store ratings
- [ ] Track crash-free rate
- [ ] Monitor API performance

### User Feedback
- [ ] Monitor app store reviews
- [ ] Check support tickets
- [ ] Review in-app feedback
- [ ] Analyze user behavior
- [ ] Conduct user surveys

### Iteration
- [ ] Plan next release
- [ ] Prioritize bug fixes
- [ ] Schedule feature development
- [ ] Update documentation
- [ ] Communicate with users

---

## 🆘 Rollback Procedure

### Emergency Rollback
```bash
# Revert to previous version
eas update --branch production --message "Rollback to v1.0.1"

# Or remove from stores temporarily
# App Store Connect: Remove from sale
# Google Play Console: Unpublish
```

### Hotfix Process
1. Create hotfix branch from main
2. Fix critical issue
3. Test thoroughly
4. Fast-track review
5. Deploy immediately
6. Monitor closely

---

## 📞 Support Contacts

### App Store Support
- Apple: https://developer.apple.com/contact/
- Google: https://support.google.com/googleplay/android-developer

### Technical Support
- Expo: https://expo.dev/support
- React Native: https://reactnative.dev/help

---

**Last Updated**: February 12, 2026
**Version**: 1.0.2
