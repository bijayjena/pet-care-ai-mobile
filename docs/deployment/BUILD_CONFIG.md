# Build Configuration

EAS Build and configuration guide for Pet Care AI.

## Configuration Files

### app.json

Main app configuration:

```json
{
  "expo": {
    "name": "Pet Care AI",
    "slug": "pet-care-ai-mobile",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.petcare.ai",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.petcare.ai",
      "versionCode": 1
    }
  }
}
```

### eas.json

Build profiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Build Profiles

### Development
- For development and testing
- Includes dev tools
- Internal distribution

```bash
eas build --platform all --profile development
```

### Preview
- For internal testing
- TestFlight/Internal testing
- No dev tools

```bash
eas build --platform all --profile preview
```

### Production
- For store submission
- Optimized and minified
- Auto-increment version

```bash
eas build --platform all --profile production
```

## Environment Variables

### Local (.env)

```env
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
EXPO_PUBLIC_GEMINI_API_KEY=your-key
```

### EAS Secrets

```bash
# Add secret
eas secret:create --scope project --name GEMINI_API_KEY --value your-key

# List secrets
eas secret:list

# Delete secret
eas secret:delete --name GEMINI_API_KEY
```

## Build Commands

### iOS

```bash
# Development
eas build --platform ios --profile development

# Preview (TestFlight)
eas build --platform ios --profile preview

# Production
eas build --platform ios --profile production
```

### Android

```bash
# Development
eas build --platform android --profile development

# Preview (Internal testing)
eas build --platform android --profile preview

# Production
eas build --platform android --profile production
```

### Both Platforms

```bash
eas build --platform all --profile production
```

## Submission

### iOS

```bash
# Submit to App Store
eas submit --platform ios

# Or specify build
eas submit --platform ios --id <build-id>
```

### Android

```bash
# Submit to Play Store
eas submit --platform android

# Or specify build
eas submit --platform android --id <build-id>
```

## Local Builds

### iOS (Mac only)

```bash
# Install dependencies
cd ios && pod install && cd ..

# Build
npx expo run:ios --configuration Release
```

### Android

```bash
# Build
npx expo run:android --variant release
```

## Troubleshooting

### Build Fails

```bash
# Clear cache
eas build --platform all --profile production --clear-cache

# Check logs
eas build:list
eas build:view <build-id>
```

### Submission Fails

```bash
# Check submission status
eas submit:list

# View submission details
eas submit:view <submission-id>
```

## Best Practices

1. **Use EAS Build for production**
   - Consistent builds
   - Automatic signing
   - Cloud-based

2. **Test before submission**
   - Use preview profile
   - Test on physical devices
   - Check all features

3. **Version management**
   - Use autoIncrement
   - Follow semantic versioning
   - Update changelog

4. **Environment variables**
   - Use EAS secrets for sensitive data
   - Never commit secrets to git
   - Use different keys for dev/prod

5. **Monitor builds**
   - Check build logs
   - Fix warnings
   - Optimize bundle size

---

For more information, see:
- [Store Submission](STORE_SUBMISSION.md)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [EAS Submit Docs](https://docs.expo.dev/submit/introduction/)
