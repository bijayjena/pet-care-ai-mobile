# Quick Reference Guide

Fast access to common tasks and documentation.

## 🚀 Getting Started

### First Time Setup
```bash
npm install
npm start -- --clear
```
See: [Quick Start Guide](getting-started/QUICK_START.md)

### Configure Authentication
1. Create Supabase project
2. Run database schema
3. Enable email auth (or Google OAuth)
4. Add credentials to `.env`

See: [SUPABASE_SETUP_GUIDE.md](../SUPABASE_SETUP_GUIDE.md)

## 🔐 Authentication

### Sign In with Email
```typescript
const { signInWithEmail } = useAuth();
await signInWithEmail('user@example.com', 'password123');
```

### Sign Up with Email
```typescript
const { signUpWithEmail } = useAuth();
await signUpWithEmail('user@example.com', 'password123');
// User receives verification email
```

### Sign In with Google
```typescript
const { signInWithGoogle } = useAuth();
await signInWithGoogle();
```

### Sign Out
```typescript
const { signOut } = useAuth();
await signOut();
```

See: [Authentication Guide](features/AUTHENTICATION.md)

## 🐾 Pet Management

### Add a Pet
```typescript
const { addPet } = usePets();
await addPet({
  name: 'Max',
  species: 'dog',
  breed: 'Golden Retriever',
  age: 3,
});
```

### Get All Pets
```typescript
const { pets, loading } = usePets();
```

### Update Pet
```typescript
const { updatePet } = usePets();
await updatePet(petId, { name: 'Max Jr.' });
```

## 🔔 Notifications

### Schedule Notification
```typescript
import { scheduleNotification } from '@/services/notificationService';

await scheduleNotification({
  title: 'Medication Reminder',
  body: 'Time to give Max his medication',
  trigger: { seconds: 60 },
  data: { petId: '123', type: 'medication' },
});
```

### Check Permissions
```typescript
const { hasPermission, requestPermission } = useNotifications();

if (!hasPermission) {
  await requestPermission();
}
```

See: [Notifications Guide](features/NOTIFICATIONS.md)

## 📴 Offline Mode

### Check Network Status
```typescript
const { isOnline } = useNetworkStatus();
```

### Offline Wrapper
```typescript
<OfflineWrapper>
  <YourComponent />
</OfflineWrapper>
```

See: [Offline Mode Guide](features/OFFLINE.md)

## 🎨 Loading States

### Use Loading Hook
```typescript
const { loading, startLoading, stopLoading } = useLoadingState();
```

### Show Skeleton
```typescript
import { HomeScreenSkeleton } from '@/components/skeletons/HomeScreenSkeleton';

{loading ? <HomeScreenSkeleton /> : <HomeScreen />}
```

See: [Loading States Guide](features/LOADING_STATES.md)

## 📊 Analytics

### Track Event
```typescript
import { trackEvent } from '@/services/analyticsService';

trackEvent('pet_added', {
  species: 'dog',
  breed: 'Golden Retriever',
});
```

### Track Screen View
```typescript
trackEvent('screen_view', {
  screen_name: 'PetDetail',
  pet_id: petId,
});
```

See: [Analytics Guide](features/ANALYTICS.md)

## 🚨 Error Handling

### Handle Errors
```typescript
import { errorHandler } from '@/services/errorHandler';

try {
  await riskyOperation();
} catch (error) {
  errorHandler.handleError(error, {
    component: 'MyComponent',
    action: 'riskyOperation',
  });
}
```

### Error Boundary
```typescript
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

See: [Error Handling Guide](features/ERROR_HANDLING.md)

## 🏗️ Architecture

### Project Structure
```
app/              # Screens (Expo Router)
components/       # Reusable components
contexts/         # React Context providers
hooks/            # Custom React hooks
services/         # Business logic
types/            # TypeScript types
utils/            # Utility functions
```

See: [App Structure](architecture/APP_STRUCTURE.md)

### Navigation
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/pet/123');
router.replace('/(tabs)');
router.back();
```

See: [Navigation Guide](architecture/NAVIGATION.md)

### State Management
```typescript
// Use Context
const { pets } = usePets();
const { user } = useAuth();
const { preferences } = useNotificationPreferences();
```

See: [State Management](architecture/STATE_MANAGEMENT.md)

## 🔧 Common Commands

### Development
```bash
# Start dev server
npm start

# Clear cache and start
npm start -- --clear

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android
```

### Building
```bash
# Install EAS CLI
npm install -g eas-cli

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production
```

### Testing
```bash
# Test on device
# Scan QR code with Expo Go app

# Test notifications (physical device only)
# Add pet → Add care task → Wait for notification
```

## 🐛 Troubleshooting

### Cache Issues
```bash
npm start -- --clear
```

### Port in Use
```bash
npm start -- --port 8082
```

### Module Not Found
```bash
npm install
npm start -- --clear
```

### Supabase Not Working
1. Check `.env` file exists
2. Verify credentials are correct
3. Restart dev server
4. Check Supabase dashboard

See: [Troubleshooting Guide](getting-started/TROUBLESHOOTING.md)

## 📚 Full Documentation

### Getting Started
- [Quick Start](getting-started/QUICK_START.md)
- [Developer Onboarding](getting-started/DEVELOPER_ONBOARDING.md)
- [Troubleshooting](getting-started/TROUBLESHOOTING.md)

### Architecture
- [App Structure](architecture/APP_STRUCTURE.md)
- [Navigation](architecture/NAVIGATION.md)
- [State Management](architecture/STATE_MANAGEMENT.md)

### Features
- [Authentication](features/AUTHENTICATION.md)
- [Notifications](features/NOTIFICATIONS.md)
- [Offline Mode](features/OFFLINE.md)
- [Error Handling](features/ERROR_HANDLING.md)
- [Loading States](features/LOADING_STATES.md)
- [Analytics](features/ANALYTICS.md)
- [Performance](features/PERFORMANCE.md)

### Deployment
- [Build Configuration](deployment/BUILD_CONFIG.md)
- [Store Submission](deployment/STORE_SUBMISSION.md)

### Setup Guides
- [Supabase Setup](../SUPABASE_SETUP_GUIDE.md)
- [Environment Variables](../README.md#environment-variables)

## 🔗 External Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Last Updated**: February 2026
**Version**: 1.0.0
