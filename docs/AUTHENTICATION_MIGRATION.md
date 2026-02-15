# Authentication Migration Guide

Guide for migrating from the basic login screen to the enhanced version with email authentication.

## Overview

The app now supports two login screen versions:

1. **app/login.tsx** - Basic version (Google OAuth only)
2. **app/login-enhanced.tsx** - Enhanced version (Email + Google OAuth)

## Migration Steps

### Step 1: Backup Current Login

```bash
# Backup the current login screen
copy app\login.tsx app\login.backup.tsx
```

### Step 2: Replace Login Screen

```bash
# Replace with enhanced version
copy app\login-enhanced.tsx app\login.tsx
```

Or manually update `app/login.tsx` with the enhanced version.

### Step 3: Update AuthContext

The AuthContext has been updated with email authentication methods:
- `signInWithEmail(email, password)`
- `signUpWithEmail(email, password)`
- `resetPassword(email)`

These are already implemented in `contexts/AuthContext.tsx`.

### Step 4: Configure Supabase

Enable email authentication in Supabase:

1. Go to Authentication → Providers
2. Enable Email provider
3. Configure email settings:
   - Confirm email: ON
   - Secure email change: ON
   - Secure password change: ON

See [SUPABASE_SETUP_GUIDE.md](../SUPABASE_SETUP_GUIDE.md) for details.

### Step 5: Test

1. Start the app
2. Test email sign up
3. Check email for verification
4. Test email sign in
5. Test Google OAuth (if configured)
6. Test offline mode

## Features Comparison

### Basic Login (login.tsx)
- Google OAuth only
- Simple UI
- Offline mode
- ~200 lines of code

### Enhanced Login (login-enhanced.tsx)
- Email/Password authentication
- Google OAuth
- Sign up flow
- Email verification
- Tab switching (Sign In / Sign Up)
- Form validation
- Better error handling
- Offline mode
- ~400 lines of code

## UI Changes

### Basic Version
```
┌─────────────────────┐
│   🐾 Pet Care AI    │
│                     │
│  [Continue with G]  │
│  [Continue Offline] │
└─────────────────────┘
```

### Enhanced Version
```
┌─────────────────────┐
│   🐾 Pet Care AI    │
│                     │
│  [Continue with G]  │
│  [Continue w/ Email]│
│  [Continue Offline] │
└─────────────────────┘

When "Continue w/ Email" clicked:
┌─────────────────────┐
│  [Sign In][Sign Up] │
│                     │
│  Email: _________   │
│  Password: ______   │
│                     │
│  [Submit Button]    │
│  [← Back]           │
└─────────────────────┘
```

## Code Changes

### AuthContext Updates

```typescript
// Added methods
interface AuthContextType {
  // ... existing
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
```

### Usage Example

```typescript
// Sign up
const handleSignUp = async () => {
  try {
    await signUpWithEmail(email, password);
    Alert.alert('Check Email', 'Verification link sent');
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

// Sign in
const handleSignIn = async () => {
  try {
    await signInWithEmail(email, password);
    router.replace('/(tabs)');
  } catch (error) {
    Alert.alert('Error', 'Invalid credentials');
  }
};
```

## Rollback

If you need to rollback to the basic version:

```bash
# Restore backup
copy app\login.backup.tsx app\login.tsx
```

The AuthContext changes are backward compatible, so no changes needed there.

## Best Practices

### Password Requirements
- Minimum 8 characters
- Mix of letters and numbers recommended
- Configure in Supabase dashboard

### Email Verification
- Always enable email confirmation
- Customize email templates
- Handle unverified users gracefully

### Error Handling
- Show user-friendly error messages
- Handle network errors
- Validate input before submission

### UX Considerations
- Show loading states
- Disable buttons during submission
- Clear error messages
- Easy navigation between modes

## Testing Checklist

- [ ] Email sign up works
- [ ] Verification email received
- [ ] Email sign in works
- [ ] Google OAuth works (if configured)
- [ ] Offline mode works
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Loading states show properly
- [ ] Tab switching works
- [ ] Back button works
- [ ] Keyboard handling works on mobile

## Troubleshooting

### Email not received
- Check spam folder
- Verify email provider enabled
- Check Supabase logs
- Test with different email

### Sign in fails
- Verify email is confirmed
- Check password requirements
- Review Supabase auth logs
- Test with known good credentials

### UI issues
- Clear app cache
- Restart dev server
- Check for console errors
- Test on different devices

## Related Documentation

- [Authentication Guide](features/AUTHENTICATION.md)
- [Supabase Setup](../SUPABASE_SETUP_GUIDE.md)
- [Error Handling](features/ERROR_HANDLING.md)

---

**Last Updated**: February 2026
**Status**: ✅ Complete
