# Analytics

Event tracking system for Pet Care AI.

## Overview

- 40+ event definitions
- Event batching (10 events or 30s)
- User properties
- Privacy controls
- Ready for Mixpanel/Amplitude/Firebase

## Files

- `services/analyticsService.ts` - Analytics service
- `types/analytics.ts` - Event definitions
- `hooks/useAnalytics.ts` - React hooks

## Usage

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

function MyComponent() {
  const { trackEvent } = useAnalytics();

  const handleAddPet = async () => {
    await addPet(petData);
    
    trackEvent('pet_added', {
      petType: petData.type,
      petBreed: petData.breed
    });
  };
}
```

## Event Categories

- Pet events (added, updated, deleted)
- Care events (task added, completed)
- Diet events (meal added, completed)
- AI events (message sent, response received)
- Navigation events (screen viewed)
- Error events (error occurred)

## Features

- Event batching for performance
- Queue persistence to AsyncStorage
- User property management
- Privacy controls (anonymization)
- Statistics tracking

## Integration

Ready to integrate with:
- Mixpanel
- Amplitude
- Firebase Analytics
- Custom backend

See `services/analyticsService.ts` for integration guide.
