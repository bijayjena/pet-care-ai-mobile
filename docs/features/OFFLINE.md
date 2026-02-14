# Offline Mode

Complete guide to offline functionality in Pet Care AI.

## Overview

The app works completely offline with:
- Network status monitoring
- Offline indicators
- Graceful fallbacks
- Data persistence
- Automatic sync when online

## Features

### Core Offline Functionality
- ✅ View all pets
- ✅ Add/edit/delete pets
- ✅ Add/complete care tasks
- ✅ Add/complete meals
- ✅ View diet information
- ✅ All data persists locally

### Online-Only Features
- ❌ AI assistant (shows offline message)
- ❌ Real-time sync (syncs when back online)

## Architecture

```
┌─────────────────────────────────────────┐
│  useNetworkStatus.ts                    │
│  - Monitor network state                │
│  - Provide isOnline status              │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  OfflineBanner.tsx                      │
│  - Show when offline                    │
│  - Hide when online                     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Components                             │
│  - OfflineWrapper                       │
│  - OfflinePlaceholder                   │
│  - OfflineIndicator                     │
└─────────────────────────────────────────┘
```

## Files

- `hooks/useNetworkStatus.ts` - Network monitoring
- `components/OfflineBanner.tsx` - Offline banner
- `components/OfflineWrapper.tsx` - Wrapper component
- `components/OfflinePlaceholder.tsx` - Placeholder content
- `components/OfflineIndicator.tsx` - Status indicator

## Usage

### Monitor Network Status

```typescript
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

function MyComponent() {
  const { isOnline, isInternetReachable } = useNetworkStatus();

  return (
    <View>
      <Text>Status: {isOnline ? 'Online' : 'Offline'}</Text>
      <Text>Internet: {isInternetReachable ? 'Yes' : 'No'}</Text>
    </View>
  );
}
```

### Offline Wrapper

```typescript
import { OfflineWrapper } from '@/components/OfflineWrapper';

function MyComponent() {
  return (
    <OfflineWrapper>
      <OnlineOnlyFeature />
    </OfflineWrapper>
  );
}
```

### Offline Placeholder

```typescript
import { OfflinePlaceholder } from '@/components/OfflinePlaceholder';

function MyComponent() {
  const { isOnline } = useNetworkStatus();

  if (!isOnline) {
    return (
      <OfflinePlaceholder
        title="AI Assistant Offline"
        message="Connect to internet to use AI features"
      />
    );
  }

  return <AIAssistant />;
}
```

### Offline Indicator

```typescript
import { OfflineIndicator } from '@/components/OfflineIndicator';

function MyComponent() {
  return (
    <View>
      <OfflineIndicator />
      <Content />
    </View>
  );
}
```

## Data Persistence

All data is automatically persisted to AsyncStorage:

```typescript
// PetContext handles persistence
const { pets, addPet, updatePet, deletePet } = usePets();

// Add pet (works offline)
await addPet({
  name: 'Buddy',
  type: 'dog',
  breed: 'Golden Retriever'
});

// Data is saved to AsyncStorage
// Available after app restart
```

## AI Service Offline Behavior

```typescript
// services/aiService.ts
export async function getAIResponse(message: string): Promise<string> {
  // Check network status
  const netInfo = await NetInfo.fetch();
  
  if (!netInfo.isConnected) {
    return "I'm currently offline. Please check your internet connection to use the AI assistant.";
  }

  // Make API call...
}
```

## Offline Banner

The offline banner automatically appears when the device loses connection:

```typescript
// app/_layout.tsx
<PetProvider>
  <NotificationPreferencesProvider>
    <OfflineBanner />
    <Stack>
      {/* Screens */}
    </Stack>
  </NotificationPreferencesProvider>
</PetProvider>
```

## Testing Offline Mode

### On Physical Device

1. Enable Airplane Mode
2. Verify offline banner appears
3. Test core features (add pet, add task, etc.)
4. Disable Airplane Mode
5. Verify banner disappears

### On Simulator

**iOS**:
```bash
# Disconnect network
xcrun simctl status_bar booted override --networkType none

# Reconnect network
xcrun simctl status_bar booted clear
```

**Android**:
```bash
# Disconnect network
adb shell svc wifi disable
adb shell svc data disable

# Reconnect network
adb shell svc wifi enable
adb shell svc data enable
```

## Network States

The app handles different network states:

| State | isOnline | isInternetReachable | Behavior |
|-------|----------|---------------------|----------|
| WiFi connected | true | true | Full functionality |
| Cellular connected | true | true | Full functionality |
| WiFi no internet | true | false | Show offline banner |
| Airplane mode | false | false | Show offline banner |
| No connection | false | false | Show offline banner |

## Best Practices

1. **Always check network status before API calls**
   ```typescript
   const { isOnline } = useNetworkStatus();
   
   if (!isOnline) {
     return showOfflineMessage();
   }
   
   await makeAPICall();
   ```

2. **Provide offline alternatives**
   ```typescript
   if (!isOnline) {
     return <OfflinePlaceholder />;
   }
   
   return <OnlineFeature />;
   ```

3. **Persist data locally**
   ```typescript
   // Always save to AsyncStorage
   await AsyncStorage.setItem('pets', JSON.stringify(pets));
   ```

4. **Show clear offline indicators**
   ```typescript
   <OfflineBanner />
   <OfflineIndicator />
   ```

5. **Handle sync when back online**
   ```typescript
   useEffect(() => {
     if (isOnline && hasPendingChanges) {
       syncData();
     }
   }, [isOnline]);
   ```

## Troubleshooting

### Offline banner not appearing

1. Check NetInfo is installed:
   ```bash
   npm list @react-native-community/netinfo
   ```

2. Verify OfflineBanner is in layout:
   ```typescript
   // app/_layout.tsx
   <OfflineBanner />
   ```

3. Test network detection:
   ```typescript
   const { isOnline } = useNetworkStatus();
   console.log('Online:', isOnline);
   ```

### Data not persisting

1. Check AsyncStorage writes:
   ```typescript
   await AsyncStorage.setItem('key', 'value');
   const value = await AsyncStorage.getItem('key');
   console.log('Stored:', value);
   ```

2. Verify PetContext is wrapping app:
   ```typescript
   <PetProvider>
     <App />
   </PetProvider>
   ```

### AI assistant not showing offline message

1. Check network status in aiService:
   ```typescript
   const netInfo = await NetInfo.fetch();
   console.log('Connected:', netInfo.isConnected);
   ```

2. Verify offline message is returned:
   ```typescript
   if (!netInfo.isConnected) {
     return "Offline message";
   }
   ```

## Advanced

### Custom Offline Handling

```typescript
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

function MyComponent() {
  const { isOnline } = useNetworkStatus();
  const [pendingChanges, setPendingChanges] = useState([]);

  useEffect(() => {
    if (isOnline && pendingChanges.length > 0) {
      syncPendingChanges();
    }
  }, [isOnline, pendingChanges]);

  const syncPendingChanges = async () => {
    for (const change of pendingChanges) {
      await syncToServer(change);
    }
    setPendingChanges([]);
  };

  return <View>{/* ... */}</View>;
}
```

### Offline Queue

```typescript
class OfflineQueue {
  private queue: any[] = [];

  async add(action: any) {
    this.queue.push(action);
    await this.save();
  }

  async process() {
    const { isOnline } = useNetworkStatus();
    
    if (!isOnline) return;

    while (this.queue.length > 0) {
      const action = this.queue.shift();
      await this.execute(action);
    }
    
    await this.save();
  }

  private async save() {
    await AsyncStorage.setItem('offline-queue', JSON.stringify(this.queue));
  }
}
```

### Network Status Listener

```typescript
import NetInfo from '@react-native-community/netinfo';

// Listen for network changes
const unsubscribe = NetInfo.addEventListener(state => {
  console.log('Connection type:', state.type);
  console.log('Is connected?', state.isConnected);
  console.log('Is internet reachable?', state.isInternetReachable);
});

// Cleanup
unsubscribe();
```

## Configuration

### NetInfo Setup

```json
// package.json
{
  "dependencies": {
    "@react-native-community/netinfo": "^11.5.2"
  }
}
```

### Android Permissions

```json
// app.json
{
  "android": {
    "permissions": [
      "ACCESS_NETWORK_STATE"
    ]
  }
}
```

## API Reference

### useNetworkStatus

```typescript
const {
  isOnline,              // boolean - Device has network connection
  isInternetReachable,   // boolean | null - Internet is accessible
  type,                  // string - Connection type (wifi, cellular, etc.)
  details               // object - Detailed connection info
} = useNetworkStatus();
```

### OfflineBanner

```typescript
<OfflineBanner />
// No props - automatically shows/hides based on network status
```

### OfflineWrapper

```typescript
<OfflineWrapper>
  <OnlineOnlyContent />
</OfflineWrapper>
// Shows children when online, placeholder when offline
```

### OfflinePlaceholder

```typescript
<OfflinePlaceholder
  title="Feature Offline"
  message="Connect to internet to use this feature"
  icon="wifi-off"
/>
```

### OfflineIndicator

```typescript
<OfflineIndicator />
// Small indicator showing offline status
```

---

For more information, see:
- [Quick Start](../getting-started/QUICK_START.md)
- [Troubleshooting](../getting-started/TROUBLESHOOTING.md)
- [Architecture](../architecture/)
