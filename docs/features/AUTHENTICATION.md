# Authentication

Complete authentication system with Google OAuth and email/password support.

## Overview

The app supports multiple authentication methods:
- Google OAuth (social login)
- Email/Password (traditional auth)
- Offline mode (no authentication required)

Authentication is powered by Supabase Auth with automatic session management, token refresh, and secure storage.

## Features

- Multiple sign-in methods (Google, Email)
- Automatic session persistence
- Token auto-refresh
- Secure credential storage
- Offline mode fallback
- Protected routes
- Sign out functionality

## Authentication Flow

```
App Launch
    ↓
Check Supabase Config
    ↓
├─ Not Configured → Offline Mode → Home
└─ Configured → Check Session
                    ↓
                ├─ Valid Session → Home
                └─ No Session → Login Screen
                                    ↓
                                ├─ Google OAuth
                                ├─ Email/Password
                                └─ Continue Offline
```

## Implementation

### AuthContext

The `AuthContext` provides authentication state and methods throughout the app.

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { 
    user,              // Current user object
    session,           // Current session
    loading,           // Auth loading state
    signInWithGoogle,  // Google OAuth
    signInWithEmail,   // Email/password sign in
    signUpWithEmail,   // Email/password sign up
    signOut,           // Sign out
    isConfigured       // Supabase config status
  } = useAuth();
  
  // Use auth state and methods
}
```

### Protected Routes

Routes are automatically protected based on authentication state:

```typescript
// app/_layout.tsx
useEffect(() => {
  if (loading) return;

  const inAuthGroup = segments[0] === 'login';

  if (!user && !inAuthGroup && isConfigured) {
    router.replace('/login');
  } else if (user && inAuthGroup) {
    router.replace('/(tabs)');
  }
}, [user, loading, segments, isConfigured]);
```

## Authentication Methods

### 1. Google OAuth

Sign in with Google account using OAuth 2.0 flow.

```typescript
const handleGoogleSignIn = async () => {
  try {
    await signInWithGoogle();
    router.replace('/(tabs)');
  } catch (error) {
    console.error('Google sign in failed:', error);
  }
};
```

How it works:
1. User clicks "Continue with Google"
2. Opens browser with Google OAuth consent screen
3. User grants permissions
4. Redirects back to app with auth tokens
5. Session is established and persisted

### 2. Email/Password Sign In

Traditional email and password authentication.

```typescript
const handleEmailSignIn = async (email: string, password: string) => {
  try {
    await signInWithEmail(email, password);
    router.replace('/(tabs)');
  } catch (error) {
    console.error('Email sign in failed:', error);
  }
};
```

### 3. Email/Password Sign Up

Create new account with email and password.

```typescript
const handleEmailSignUp = async (email: string, password: string) => {
  try {
    await signUpWithEmail(email, password);
    // Check email for verification link
    Alert.alert(
      'Verify Email',
      'Please check your email to verify your account.'
    );
  } catch (error) {
    console.error('Sign up failed:', error);
  }
};
```

### 4. Offline Mode

Continue without authentication using mock data.

```typescript
const handleContinueOffline = () => {
  router.replace('/(tabs)');
};
```

## Session Management

### Automatic Persistence

Sessions are automatically saved to AsyncStorage:

```typescript
// lib/supabase.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### Token Refresh

Access tokens are automatically refreshed before expiration:
- Refresh tokens stored securely
- Auto-refresh happens in background
- No user interaction required

### Session Restoration

On app launch, the session is automatically restored:

```typescript
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setUser(session?.user ?? null);
    setLoading(false);
  });
}, []);
```

### Auth State Listener

Real-time auth state changes are monitored:

```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (_event, session) => {
    setSession(session);
    setUser(session?.user ?? null);
  }
);
```

## Sign Out

Sign out clears the session and redirects to login:

```typescript
const handleSignOut = async () => {
  try {
    await signOut();
    router.replace('/login');
  } catch (error) {
    console.error('Sign out failed:', error);
  }
};
```

## User Profile

Access user information from the auth context:

```typescript
const { user } = useAuth();

// User properties
user?.id              // Unique user ID
user?.email           // User email
user?.user_metadata   // Custom metadata
user?.created_at      // Account creation date
```

## Configuration

### Environment Variables

```env
# .env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Supabase Setup

1. Enable authentication providers in Supabase dashboard
2. Configure OAuth redirect URLs
3. Set up email templates (optional)
4. Configure password requirements

See [SUPABASE_SETUP_GUIDE.md](../../SUPABASE_SETUP_GUIDE.md) for detailed setup.

## Error Handling

Authentication errors are handled gracefully:

```typescript
try {
  await signInWithEmail(email, password);
} catch (error) {
  if (error.message.includes('Invalid login credentials')) {
    Alert.alert('Error', 'Invalid email or password');
  } else if (error.message.includes('Email not confirmed')) {
    Alert.alert('Error', 'Please verify your email first');
  } else {
    Alert.alert('Error', 'Sign in failed. Please try again.');
  }
}
```

Common error scenarios:
- Invalid credentials
- Email not verified
- Network errors
- Supabase not configured
- OAuth flow cancelled

## Security Best Practices

### Secure Storage
- Tokens stored in AsyncStorage (encrypted on device)
- Never expose service_role key in client
- Use anon/public key only

### Password Requirements
Configure in Supabase dashboard:
- Minimum length: 8 characters
- Require uppercase, lowercase, numbers
- Password strength validation

### Email Verification
Enable email verification in Supabase:
- Users must verify email before access
- Verification link sent automatically
- Configurable email templates

### OAuth Security
- Use PKCE flow for mobile apps
- Validate redirect URIs
- Secure token exchange

## Testing

### Test Google OAuth
1. Start app on physical device
2. Click "Continue with Google"
3. Select Google account
4. Grant permissions
5. Verify redirect to home screen
6. Check user in Supabase dashboard

### Test Email Auth
1. Sign up with email/password
2. Check email for verification link
3. Click verification link
4. Sign in with credentials
5. Verify session persists after app restart

### Test Offline Mode
1. Remove Supabase credentials from .env
2. Restart app
3. Should show offline mode option
4. App works with mock data

## Troubleshooting

### Google OAuth not working
- Verify OAuth credentials in Google Cloud Console
- Check redirect URI matches Supabase callback URL
- Ensure Google+ API is enabled
- Add test users in OAuth consent screen

### Email sign in fails
- Check email is verified
- Verify password meets requirements
- Check Supabase auth logs
- Ensure email provider is enabled

### Session not persisting
- Check AsyncStorage permissions
- Verify autoRefreshToken is enabled
- Check for token expiration
- Review Supabase auth settings

### "Supabase not configured" error
- Verify .env file exists
- Check environment variables are correct
- Restart Expo dev server
- Ensure variables start with EXPO_PUBLIC_

## Advanced Features

### Custom Email Templates

Customize verification and password reset emails in Supabase:
1. Go to Authentication → Email Templates
2. Edit HTML templates
3. Add branding and styling
4. Test email delivery

### Social Login Providers

Add more OAuth providers:
- Apple Sign In
- Facebook Login
- GitHub OAuth
- Twitter OAuth

Configure in Supabase Authentication → Providers.

### Multi-Factor Authentication

Enable MFA for enhanced security:
1. Enable in Supabase dashboard
2. Users can enable TOTP in profile
3. Require MFA for sensitive actions

### Password Reset

Implement password reset flow:

```typescript
const handlePasswordReset = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'petcare://reset-password',
  });
  
  if (!error) {
    Alert.alert('Success', 'Check your email for reset link');
  }
};
```

## API Reference

### signInWithGoogle()
Opens Google OAuth flow in browser.

**Returns**: `Promise<void>`

**Throws**: `AuthError` if sign in fails

### signInWithEmail(email, password)
Sign in with email and password.

**Parameters**:
- `email: string` - User email
- `password: string` - User password

**Returns**: `Promise<void>`

**Throws**: `AuthError` if credentials invalid

### signUpWithEmail(email, password)
Create new account with email and password.

**Parameters**:
- `email: string` - User email
- `password: string` - User password (min 8 chars)

**Returns**: `Promise<void>`

**Throws**: `AuthError` if sign up fails

### signOut()
Sign out current user and clear session.

**Returns**: `Promise<void>`

**Throws**: `AuthError` if sign out fails

## Related Documentation

- [Supabase Setup Guide](../../SUPABASE_SETUP_GUIDE.md)
- [State Management](../architecture/STATE_MANAGEMENT.md)
- [Error Handling](ERROR_HANDLING.md)
- [Offline Mode](OFFLINE.md)

---

**Last Updated**: February 2026
**Status**: ✅ Production Ready
