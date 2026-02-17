# Troubleshooting Guide

Quick solutions to common issues with Pet Care AI.

## 🚨 Critical Issues

### App Won't Start

**Symptom**: App crashes immediately or shows blank screen

**Solutions**:
```bash
# 1. Clear cache
npx expo start -c

# 2. Reinstall dependencies
rm -rf node_modules
npm install

# 3. Clear Metro bundler cache
npx expo start --clear

# 4. Check for TypeScript errors
npx tsc --noEmit
```

### "Supabase is not configured" Error

**Symptom**: Error message about Supabase configuration

**Solutions**:
1. Check `.env` file exists
2. Verify `EXPO_PUBLIC_SUPABASE_URL` is set
3. Verify `EXPO_PUBLIC_SUPABASE_ANON_KEY` is set
4. Restart the app after adding credentials
5. Make sure `.env` is in project root (not in subdirectory)

**Example `.env`**:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Database Connection Failed

**Symptom**: Can't load data, authentication fails

**Solutions**:
1. Check internet connection
2. Verify Supabase project is active
3. Check Supabase credentials are correct
4. Verify database schema is set up
5. Check RLS policies are enabled

**Test Connection**:
```bash
# In Supabase SQL Editor
SELECT * FROM profiles LIMIT 1;
```

## 🔄 Onboarding Issues

### Onboarding Shows Every Time

**Symptom**: Onboarding appears on every app launch

**Solutions**:
1. Check database migration ran successfully
2. Verify `onboarding_completed` field exists in profiles table
3. Run migration script:
```sql
-- In Supabase SQL Editor
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

UPDATE profiles 
SET onboarding_completed = true 
WHERE id = 'your-user-id';
```

### Can't Complete Onboarding

**Symptom**: "Get Started" button doesn't work

**Solutions**:
1. Check console for errors
2. Verify pet name is entered
3. Verify pet type is selected
4. Check internet connection
5. Verify Supabase credentials
6. Check pets table exists in database

### Onboarding Stuck on Loading

**Symptom**: Loading spinner never stops

**Solutions**:
1. Check network connection
2. Check browser console for errors
3. Verify database permissions
4. Try refreshing the app
5. Clear app cache and restart

## 📊 Data Issues

### No Data Showing

**Symptom**: Empty screens, no pets/meals/reminders

**Solutions**:
1. Check if user is authenticated
2. Verify data exists in database
3. Check RLS policies allow access
4. Look for errors in console
5. Try refreshing data

**Check Data in Database**:
```sql
-- In Supabase SQL Editor
SELECT * FROM pets WHERE user_id = auth.uid();
SELECT * FROM reminders WHERE pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid());
```

### Data Not Saving

**Symptom**: Changes don't persist after app restart

**Solutions**:
1. Check internet connection
2. Verify Supabase credentials
3. Check RLS policies
4. Look for errors in console
5. Verify user is authenticated

### Duplicate Data

**Symptom**: Same pet/reminder appears multiple times

**Solutions**:
1. Delete duplicates from database
2. Check for race conditions in code
3. Ensure proper error handling
4. Clear app cache

**Remove Duplicates**:
```sql
-- In Supabase SQL Editor (CAUTION: Test first!)
DELETE FROM pets 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM pets 
  GROUP BY user_id, name, type
);
```

## 🔐 Authentication Issues

### Can't Sign In

**Symptom**: Login fails with error

**Solutions**:
1. Verify email and password are correct
2. Check if email is confirmed (check inbox)
3. Try password reset
4. Check Supabase auth settings
5. Verify internet connection

### Can't Sign Up

**Symptom**: Registration fails

**Solutions**:
1. Check email format is valid
2. Verify password meets requirements (min 6 characters)
3. Check if email already registered
4. Verify Supabase auth is enabled
5. Check email confirmation settings

### Session Expired

**Symptom**: Randomly logged out

**Solutions**:
1. Check Supabase session timeout settings
2. Verify refresh token is working
3. Check for auth errors in console
4. Try signing in again

## 📱 UI/UX Issues

### Blank Screen

**Symptom**: White or blank screen

**Solutions**:
1. Check console for JavaScript errors
2. Verify all required components exist
3. Check for missing imports
4. Clear cache and restart
5. Check ErrorBoundary is working

### Slow Performance

**Symptom**: App is laggy or slow

**Solutions**:
1. Close other apps
2. Restart device
3. Clear app cache
4. Check for memory leaks
5. Reduce data load size

### UI Elements Overlapping

**Symptom**: Text or buttons overlap

**Solutions**:
1. Check screen size compatibility
2. Verify responsive design
3. Update to latest version
4. Report as bug with screenshot

## 🔔 Notification Issues

### Notifications Not Working

**Symptom**: No notifications received

**Solutions**:
1. Check notification permissions
2. Verify notifications enabled in settings
3. Check device notification settings
4. Test with immediate notification
5. Check Expo notification configuration

### Wrong Notification Time

**Symptom**: Notifications at wrong time

**Solutions**:
1. Check device timezone
2. Verify scheduled time is correct
3. Check for timezone conversion issues
4. Update notification schedule

## 🌐 Network Issues

### "Network Error" Message

**Symptom**: Can't connect to server

**Solutions**:
1. Check internet connection
2. Try different network (WiFi vs cellular)
3. Check if Supabase is down (status.supabase.com)
4. Verify firewall not blocking
5. Try VPN if available

### Slow Data Loading

**Symptom**: Data takes long to load

**Solutions**:
1. Check internet speed
2. Reduce data query size
3. Implement pagination
4. Check database indexes
5. Optimize queries

## 🐛 Development Issues

### TypeScript Errors

**Symptom**: Red squiggly lines, type errors

**Solutions**:
```bash
# Check for errors
npx tsc --noEmit

# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Metro Bundler Issues

**Symptom**: Build fails, bundler errors

**Solutions**:
```bash
# Clear Metro cache
npx expo start --clear

# Reset Metro
rm -rf .expo
rm -rf node_modules/.cache

# Restart with clean slate
npx expo start -c
```

### Module Not Found

**Symptom**: "Cannot find module" error

**Solutions**:
```bash
# Reinstall dependencies
npm install

# Check import paths are correct
# Verify file exists at specified path
# Check for typos in import statement
```

## 📋 Quick Diagnostics

Run these commands to diagnose issues:

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Check for outdated packages
npm outdated

# Check for security issues
npm audit

# Verify Expo CLI
npx expo --version

# Check TypeScript
npx tsc --version
```

## 🆘 Getting Help

If none of these solutions work:

1. **Check Console Logs**: Look for error messages
2. **Check Supabase Logs**: View in Supabase dashboard
3. **Search Issues**: Check GitHub issues
4. **Create Issue**: Report bug with details:
   - Error message
   - Steps to reproduce
   - Device/platform
   - App version
   - Screenshots

## 📞 Support Checklist

Before asking for help, provide:

- [ ] Error message (exact text)
- [ ] Steps to reproduce
- [ ] Expected behavior
- [ ] Actual behavior
- [ ] Device/platform
- [ ] App version
- [ ] Console logs
- [ ] Screenshots
- [ ] What you've tried

## 🔧 Emergency Reset

**CAUTION**: This will delete all data!

```sql
-- In Supabase SQL Editor
-- Delete all user data
DELETE FROM pets WHERE user_id = auth.uid();
DELETE FROM reminders WHERE pet_id IN (SELECT id FROM pets WHERE user_id = auth.uid());
-- ... repeat for all tables

-- Or reset entire database (EXTREME CAUTION)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Then re-run supabase-schema.sql
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Project README](README.md)
- [Setup Guide](SUPABASE_SETUP_GUIDE.md)
