# Troubleshooting Guide

Solutions for common issues in Pet Care AI.

## Quick Fixes

### "Unable to resolve expo-notifications"

**Cause**: Metro bundler cache is stale

**Solution**:
```bash
# Use fix script
fix-setup.bat

# Or manually
npm start -- --clear
```

### "Could not parse Expo config"

**Cause**: Syntax error in app.json

**Solution**:
- Check app.json for syntax errors
- Ensure no trailing commas
- Verify all referenced files exist

### "PluginError: Failed to resolve plugin"

**Cause**: Plugin referenced but not installed

**Solution**:
```bash
# Remove plugin from app.json, or install it
npm install <plugin-name>
```

### Port 8081 already in use

**Cause**: Another process using the port

**Solution**:
```bash
# Use different port
npm start -- --port 8082

# Or kill the process
netstat -ano | findstr :8081
taskkill /F /PID <PID>
```

## Cache Issues

### Clear Metro Cache

```bash
# Option 1: With Expo CLI
npx expo start --clear

# Option 2: With npm
npm start -- --clear

# Option 3: Use fix script
fix-setup.bat
```

### Clear All Caches

```bash
# Stop Metro bundler (Ctrl+C)

# Delete cache folders (Windows)
rmdir /s /q "%LOCALAPPDATA%\Expo\Metro"
del /q "%TEMP%\metro-*"
del /q "%TEMP%\haste-*"

# Restart
npm start -- --clear
```

### Nuclear Option

```bash
# Delete everything
rmdir /s /q node_modules
rmdir /s /q .expo

# Reinstall
npm install

# Start fresh
npm start -- --clear
```

## Installation Issues

### Missing Dependencies

```bash
# Verify packages are installed
npm list expo-notifications expo-device @react-native-community/netinfo

# Reinstall if needed
npm install
```

### Version Conflicts

```bash
# Check versions
node --version  # Should be 18+
npm --version   # Should be 9+

# Update if needed
npm install -g npm@latest
```

## Runtime Errors

### App Crashes on Startup

1. Check terminal for error messages
2. Clear cache: `npm start -- --clear`
3. Check app.json for syntax errors
4. Verify all imports are correct

### Notifications Not Working

**Requirements**:
- Must use physical device (not simulator)
- Must grant notification permissions
- Must have notification settings enabled

**Debug**:
```typescript
// Check permissions
const { status } = await Notifications.getPermissionsAsync();
console.log('Permission status:', status);

// Check scheduled notifications
const scheduled = await Notifications.getAllScheduledNotificationsAsync();
console.log('Scheduled:', scheduled.length);
```

### Offline Mode Not Working

1. Check network status in app
2. Verify OfflineBanner appears when disconnected
3. Check AsyncStorage for persisted data
4. Ensure useNetworkStatus hook is initialized

### AI Assistant Not Responding

**With API Key**:
- Verify EXPO_PUBLIC_GEMINI_API_KEY in .env
- Check API key is valid
- Check network connection

**Without API Key**:
- Should show mock responses
- Check aiService.ts fallback logic

## Build Issues

### iOS Build Fails

```bash
# Clear iOS build cache
cd ios && pod deintegrate && pod install && cd ..

# Or with EAS
eas build --platform ios --clear-cache
```

### Android Build Fails

```bash
# Clear Android build cache
cd android && ./gradlew clean && cd ..

# Or with EAS
eas build --platform android --clear-cache
```

## Performance Issues

### Slow App Performance

1. Check for unnecessary re-renders
2. Use optimized PetContext: `contexts/PetContext.optimized.tsx`
3. Check AsyncStorage writes are debounced
4. Profile with React DevTools

### High Memory Usage

1. Check for memory leaks
2. Ensure listeners are cleaned up
3. Use useEffect cleanup functions
4. Profile with React Native Debugger

## Network Issues

### Can't Connect to Metro

1. Ensure device and computer on same WiFi
2. Check firewall isn't blocking port 8081
3. Try different network
4. Use tunnel mode: `npm start -- --tunnel`

### API Requests Failing

1. Check network connection
2. Verify API keys in .env
3. Check CORS settings (web only)
4. Check error handler logs

## Debug Mode

### Enable Verbose Logging

```bash
# Windows
set EXPO_DEBUG=true
npm start

# Or in one command
EXPO_DEBUG=true npm start
```

### Check Logs

```bash
# View Metro bundler logs
# Terminal shows all console.log output

# View device logs
# iOS: Xcode → Window → Devices and Simulators
# Android: adb logcat
```

## System Requirements

### Check Versions

```bash
node --version    # 18.x or higher
npm --version     # 9.x or higher
npx expo --version # Latest
```

### Update Tools

```bash
# Update Node.js
# Download from: https://nodejs.org/

# Update npm
npm install -g npm@latest

# Expo CLI updates automatically with npx
```

## Common Error Messages

### "Metro bundler has encountered an error"

**Solution**: Clear cache and restart
```bash
npm start -- --clear
```

### "Unable to resolve module"

**Solution**: Check import paths and clear cache
```bash
npm start -- --clear
```

### "Invariant Violation"

**Solution**: Usually a React error, check component code
- Verify all hooks are called correctly
- Check for conditional hooks
- Ensure components return valid JSX

### "Network request failed"

**Solution**: Check network and API configuration
- Verify internet connection
- Check API keys in .env
- Check firewall settings

## Getting More Help

### Check Documentation
- [Quick Start](QUICK_START.md)
- [Developer Onboarding](DEVELOPER_ONBOARDING.md)
- [Architecture Docs](../architecture/)
- [Feature Guides](../features/)

### Community Resources
- Expo Forums: https://forums.expo.dev/
- Expo Discord: https://chat.expo.dev/
- GitHub Issues: https://github.com/expo/expo/issues

### Debug Checklist

Before asking for help, verify:
- [ ] Cleared Metro cache
- [ ] Reinstalled node_modules
- [ ] Checked for syntax errors
- [ ] Verified package versions
- [ ] Checked error messages in terminal
- [ ] Tested on different device/simulator
- [ ] Checked network connection
- [ ] Reviewed relevant documentation

### Reporting Issues

Include:
- Error message (full text)
- Steps to reproduce
- Node version: `node --version`
- npm version: `npm --version`
- Expo version: `npx expo --version`
- Operating system
- What you've tried

## Prevention Tips

1. **Always clear cache after config changes**
   ```bash
   npm start -- --clear
   ```

2. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

3. **Use TypeScript**
   - Catches errors at compile time
   - Better IDE support

4. **Test on physical devices**
   - Especially for notifications
   - More accurate performance testing

5. **Monitor logs**
   - Watch terminal for warnings
   - Check error handler logs
   - Use analytics to track errors

## Success Checklist

App is working when:
- [ ] Metro bundler starts without errors
- [ ] App loads on device
- [ ] All tabs accessible
- [ ] Can add/edit pets
- [ ] Can add/complete tasks
- [ ] Notifications work (physical device)
- [ ] Offline mode works
- [ ] No crashes or errors

---

Still having issues? Check the [Quick Start Guide](QUICK_START.md) or ask in the Expo community.
