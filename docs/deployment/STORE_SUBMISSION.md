# Store Submission Guide

Complete guide for submitting Pet Care AI to app stores.

## Overview

Everything needed to submit to:
- Apple App Store
- Google Play Store

## Files Created

### Store Metadata
- `store-metadata/app-store-description.md` - App Store listing
- `store-metadata/play-store-description.md` - Play Store listing
- `store-metadata/keywords.md` - SEO keywords
- `store-metadata/privacy-policy.md` - Privacy policy
- `store-metadata/terms-of-service.md` - Terms of service
- `store-metadata/asset-requirements.md` - Asset specs

### Configuration
- `app.json` - App configuration
- `eas.json` - Build configuration

## Quick Start

### 1. Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 2. Configure Project

```bash
# Update app.json with your details
# - Bundle ID
# - App name
# - Version
# - Permissions

# Update eas.json with your settings
# - Project ID
# - Build profiles
```

### 3. Build for iOS

```bash
# Development build
eas build --platform ios --profile development

# Production build
eas build --platform ios --profile production
```

### 4. Build for Android

```bash
# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production
```

### 5. Submit to Stores

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

## App Store Requirements

### Required Assets
- App icon (1024x1024)
- Screenshots (various sizes)
- App preview video (optional)

### Required Information
- App name: Pet Care AI
- Bundle ID: com.petcare.ai
- Category: Health & Fitness
- Description: See `store-metadata/app-store-description.md`
- Keywords: See `store-metadata/keywords.md`
- Privacy policy: See `store-metadata/privacy-policy.md`
- Terms: See `store-metadata/terms-of-service.md`

### App Store Connect

1. Create app in App Store Connect
2. Upload build with EAS
3. Add metadata and screenshots
4. Submit for review

## Play Store Requirements

### Required Assets
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots (various sizes)
- App preview video (optional)

### Required Information
- App name: Pet Care AI
- Package name: com.petcare.ai
- Category: Health & Fitness
- Description: See `store-metadata/play-store-description.md`
- Privacy policy: See `store-metadata/privacy-policy.md`
- Terms: See `store-metadata/terms-of-service.md`

### Google Play Console

1. Create app in Play Console
2. Upload build with EAS
3. Add metadata and screenshots
4. Submit for review

## Asset Creation

See `store-metadata/asset-requirements.md` for:
- Icon specifications
- Screenshot sizes
- Feature graphic specs
- App preview requirements

## Testing Before Submission

### iOS TestFlight

```bash
# Build for TestFlight
eas build --platform ios --profile preview

# Submit to TestFlight
eas submit --platform ios --profile preview
```

### Android Internal Testing

```bash
# Build for internal testing
eas build --platform android --profile preview

# Submit to internal track
eas submit --platform android --profile preview
```

## Review Guidelines

### Apple App Store
- Follow Human Interface Guidelines
- No crashes or bugs
- Complete functionality
- Accurate metadata
- Privacy policy required
- Medical disclaimer required

### Google Play Store
- Follow Material Design guidelines
- No crashes or bugs
- Complete functionality
- Accurate metadata
- Privacy policy required
- Medical disclaimer required

## Medical Disclaimer

Both stores require medical disclaimer for pet health apps:

> "This app is for informational purposes only and is not a substitute for professional veterinary advice, diagnosis, or treatment. Always seek the advice of your veterinarian with any questions you may have regarding your pet's health."

Included in:
- App description
- Terms of service
- In-app disclaimer

## Privacy Policy

Required by both stores. Covers:
- Data collection
- Data usage
- Data sharing
- User rights
- GDPR/CCPA compliance

See `store-metadata/privacy-policy.md`

## Common Rejection Reasons

### Apple
- Incomplete functionality
- Crashes or bugs
- Misleading metadata
- Missing privacy policy
- Inadequate medical disclaimer

### Google
- Crashes or bugs
- Misleading metadata
- Missing privacy policy
- Inadequate medical disclaimer
- Policy violations

## Post-Submission

### Monitor Reviews
- Respond to user reviews
- Address issues quickly
- Update app regularly

### Analytics
- Track downloads
- Monitor crashes
- Analyze user behavior
- Improve based on feedback

### Updates
```bash
# Build update
eas build --platform all --profile production

# Submit update
eas submit --platform all
```

## Versioning

Follow semantic versioning:
- Major: Breaking changes (2.0.0)
- Minor: New features (1.1.0)
- Patch: Bug fixes (1.0.1)

Update in:
- `app.json` - version
- `app.json` - buildNumber (iOS)
- `app.json` - versionCode (Android)

## Checklist

### Before Submission
- [ ] All features working
- [ ] No crashes or bugs
- [ ] Tested on physical devices
- [ ] All assets created
- [ ] Metadata written
- [ ] Privacy policy finalized
- [ ] Terms of service finalized
- [ ] Medical disclaimer included
- [ ] Build configuration complete
- [ ] Production builds tested

### After Approval
- [ ] Monitor crash reports
- [ ] Respond to reviews
- [ ] Track analytics
- [ ] Plan updates
- [ ] Marketing materials

## Resources

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Play Store Policies](https://play.google.com/about/developer-content-policy/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)

---

For more information, see:
- [Build Configuration](BUILD_CONFIG.md)
- [Quick Start](../getting-started/QUICK_START.md)
- [Troubleshooting](../getting-started/TROUBLESHOOTING.md)
