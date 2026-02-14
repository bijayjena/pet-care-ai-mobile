# Push Notifications

Complete guide to the notification system in Pet Care AI.

## Overview

The app includes a comprehensive push notification system for:
- Care task reminders (upcoming & overdue)
- Meal reminders (before & missed)
- Diet alerts
- Smart navigation on tap

## Architecture

```
┌─────────────────────────────────────────┐
│  notificationService.ts                 │
│  - Schedule notifications               │
│  - Cancel notifications                 │
│  - Handle permissions                   │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  useNotifications.ts                    │
│  - React integration                    │
│  - Listen for taps                      │
│  - Navigate on tap                      │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  NotificationPreferencesContext.tsx     │
│  - User preferences                     │
│  - Enable/disable categories            │
│  - Persist settings                     │
└─────────────────────────────────────────┘
```

## Files

- `services/notificationService.ts` - Core notification logic
- `hooks/useNotifications.ts` - React integration
- `contexts/NotificationPreferencesContext.tsx` - Settings management
- `app/notification-settings.tsx` - Settings UI

## Usage

### Request Permissions

```typescript
import { notificationService } from '@/services/notificationService';

// Request permissions
const granted = await notificationService.requestPermissions();
if (granted) {
  console.log('Notifications enabled');
}
```

### Schedule Care Notification

```typescript
import { notificationService } from '@/services/notificationService';

const task = {
  id: '1',
  petId: 'pet-1',
  title: 'Give medication',
  dueDate: new Date(Date.now() + 3600000), // 1 hour from now
  completed: false,
  type: 'medication'
};

await notificationService.scheduleCareNotification(task, 'Buddy');
```

### Schedule Meal Notification

```typescript
const meal = {
  id: '1',
  petId: 'pet-1',
  type: 'breakfast',
  scheduledDate: new Date(Date.now() + 900000), // 15 minutes from now
  completed: false,
  amount: '1 cup'
};

await notificationService.scheduleMealNotification(meal, 'Buddy');
```

### Send Diet Alert

```typescript
await notificationService.sendDietAlertNotification(
  'Buddy',
  'overweight',
  'Weight is above healthy range',
  'high'
);
```

### Cancel Notifications

```typescript
// Cancel specific notification
await notificationService.cancelNotification('notification-id');

// Cancel all notifications
await notificationService.cancelAllNotifications();
```

### Get Scheduled Notifications

```typescript
const scheduled = await notificationService.getScheduledNotifications();
console.log(`${scheduled.length} notifications scheduled`);
```

## React Integration

### Use in Component

```typescript
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const { requestPermissions, getScheduledNotifications } = useNotifications();

  const handleEnableNotifications = async () => {
    const granted = await requestPermissions();
    if (granted) {
      alert('Notifications enabled!');
    }
  };

  return (
    <Button onPress={handleEnableNotifications}>
      Enable Notifications
    </Button>
  );
}
```

### Automatic Scheduling

The `useNotifications` hook automatically:
- Schedules notifications for incomplete care tasks
- Schedules notifications for today's meals
- Sends notifications for new diet alerts
- Respects user preferences
- Cancels notifications when tasks complete

## Notification Settings

### Access Settings

Users can access notification settings from any screen via the notification icon in the header.

### Settings Structure

```typescript
interface NotificationPreferences {
  enabled: boolean;              // Master toggle
  careReminders: boolean;        // Upcoming care tasks
  careOverdue: boolean;          // Overdue care tasks
  mealReminders: boolean;        // Upcoming meals
  missedMeals: boolean;          // Missed meals
  dietAlerts: boolean;           // Diet alerts
}
```

### Use Preferences

```typescript
import { useNotificationPreferences } from '@/contexts/NotificationPreferencesContext';

function MyComponent() {
  const { preferences, updatePreferences } = useNotificationPreferences();

  const toggleNotifications = async () => {
    await updatePreferences({ enabled: !preferences.enabled });
  };

  return (
    <Switch
      value={preferences.enabled}
      onValueChange={toggleNotifications}
    />
  );
}
```

## Navigation

When user taps a notification, the app navigates to the relevant screen:

| Notification Type | Navigation Target |
|------------------|-------------------|
| Care task | Pet detail page |
| Overdue care | Pet detail page |
| Meal reminder | Pet detail page |
| Missed meal | Pet detail page |
| Diet alert | Diet tab |

## Notification Data

Each notification includes data for navigation:

```typescript
{
  type: 'care' | 'care-overdue' | 'meal' | 'meal-missed' | 'diet-alert',
  petId?: string,
  taskId?: string,
  mealId?: string
}
```

## Timing

### Care Tasks
- **Upcoming**: 15 minutes before due time
- **Overdue**: Immediately when overdue

### Meals
- **Reminder**: 15 minutes before scheduled time
- **Missed**: 30 minutes after scheduled time

### Diet Alerts
- **Immediate**: Sent as soon as alert is created

## Testing

### Requirements
- Must use physical device (notifications don't work in simulators)
- Must grant notification permissions
- Must have notifications enabled in settings

### Test Flow

1. Start app on physical device
2. Grant notification permissions
3. Add a pet
4. Add care task with due date in 5 minutes
5. Wait for notification
6. Tap notification
7. Verify navigation to pet detail

### Debug Notifications

```typescript
// Check permissions
const { status } = await Notifications.getPermissionsAsync();
console.log('Permission status:', status);

// Check scheduled notifications
const scheduled = await notificationService.getScheduledNotifications();
console.log('Scheduled notifications:', scheduled);

// Test immediate notification
await notificationService.sendDietAlertNotification(
  'Test Pet',
  'test',
  'This is a test notification',
  'low'
);
```

## Configuration

### app.json

```json
{
  "notification": {
    "icon": "./assets/images/icon.png",
    "color": "#3B82F6",
    "iosDisplayInForeground": true,
    "androidMode": "default",
    "androidCollapsedTitle": "Pet Care Reminders"
  },
  "plugins": [
    [
      "expo-notifications",
      {
        "icon": "./assets/images/icon.png",
        "color": "#3B82F6",
        "sounds": [],
        "mode": "production"
      }
    ]
  ]
}
```

### iOS Permissions

```json
{
  "ios": {
    "infoPlist": {
      "UIBackgroundModes": ["remote-notification"]
    }
  }
}
```

### Android Permissions

```json
{
  "android": {
    "permissions": [
      "RECEIVE_BOOT_COMPLETED",
      "VIBRATE"
    ]
  }
}
```

## Best Practices

1. **Always request permissions before scheduling**
   ```typescript
   const granted = await notificationService.requestPermissions();
   if (granted) {
     await notificationService.scheduleCareNotification(task, petName);
   }
   ```

2. **Respect user preferences**
   ```typescript
   if (preferences.enabled && preferences.careReminders) {
     await notificationService.scheduleCareNotification(task, petName);
   }
   ```

3. **Cancel notifications when tasks complete**
   ```typescript
   // Automatically handled by useNotifications hook
   // Or manually:
   await notificationService.cancelNotification(notificationId);
   ```

4. **Use meaningful notification content**
   ```typescript
   // Good
   title: "Time to give Buddy his medication"
   body: "Heartworm prevention pill"

   // Bad
   title: "Reminder"
   body: "Task due"
   ```

5. **Test on physical devices**
   - Simulators don't support notifications
   - Test all notification types
   - Test navigation flows

## Troubleshooting

### Notifications Not Appearing

1. Check permissions:
   ```typescript
   const { status } = await Notifications.getPermissionsAsync();
   ```

2. Check if notifications are scheduled:
   ```typescript
   const scheduled = await notificationService.getScheduledNotifications();
   ```

3. Check user preferences:
   ```typescript
   const { preferences } = useNotificationPreferences();
   console.log('Enabled:', preferences.enabled);
   ```

4. Verify using physical device (not simulator)

### Navigation Not Working

1. Check notification data includes petId
2. Verify router is initialized
3. Check navigation paths are correct
4. Test in different app states (foreground, background, closed)

### Notifications Duplicating

1. Cancel existing notifications before scheduling new ones
2. Use unique identifiers for each notification
3. Check useEffect dependencies

## Advanced

### Custom Notification Sounds

```typescript
// Add sound file to assets/sounds/
// Update app.json
{
  "notification": {
    "sounds": ["./assets/sounds/notification.wav"]
  }
}

// Use in notification
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Title",
    body: "Body",
    sound: 'notification.wav'
  },
  trigger: { seconds: 60 }
});
```

### Rich Notifications

```typescript
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Care Task Due",
    body: "Time to give Buddy his medication",
    data: { petId: 'pet-1', taskId: 'task-1' },
    badge: 1,
    sound: true,
    priority: 'high',
    vibrate: [0, 250, 250, 250]
  },
  trigger: { date: dueDate }
});
```

### Notification Categories (iOS)

```typescript
await Notifications.setNotificationCategoryAsync('care', [
  {
    identifier: 'complete',
    buttonTitle: 'Mark Complete',
    options: { opensAppToForeground: true }
  },
  {
    identifier: 'snooze',
    buttonTitle: 'Snooze',
    options: { opensAppToForeground: false }
  }
]);
```

## API Reference

See `services/notificationService.ts` for complete API documentation.

### Key Methods

- `initialize()` - Set up notification handler
- `requestPermissions()` - Request notification permissions
- `scheduleCareNotification(task, petName)` - Schedule care reminder
- `scheduleOverdueNotification(task, petName)` - Schedule overdue alert
- `scheduleMealNotification(meal, petName)` - Schedule meal reminder
- `scheduleMissedMealNotification(meal, petName)` - Schedule missed meal alert
- `sendDietAlertNotification(petName, type, message, severity)` - Send diet alert
- `cancelNotification(id)` - Cancel specific notification
- `cancelAllNotifications()` - Cancel all notifications
- `getScheduledNotifications()` - Get all scheduled notifications

---

For more information, see:
- [Quick Start](../getting-started/QUICK_START.md)
- [Troubleshooting](../getting-started/TROUBLESHOOTING.md)
- [Architecture](../architecture/)
