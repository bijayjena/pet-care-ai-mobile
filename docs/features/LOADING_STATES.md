# Loading States

Skeleton screens and loading states for Pet Care AI.

## Overview

- Skeleton screens for all major screens
- Smooth 60fps animations
- No loading flashes (300ms minimum)
- Consistent loading UX

## Files

- `components/SkeletonLoader.tsx` - Base skeleton component
- `components/skeletons/*` - Screen-specific skeletons
- `hooks/useLoadingState.ts` - Loading state management

## Usage

```typescript
import { HomeScreenSkeleton } from '@/components/skeletons/HomeScreenSkeleton';
import { useLoadingState } from '@/hooks/useLoadingState';

function HomeScreen() {
  const { isLoading } = useLoadingState(true, 1000);

  if (isLoading) {
    return <HomeScreenSkeleton />;
  }

  return <Content />;
}
```

## Available Skeletons

- `HomeScreenSkeleton`
- `PetsScreenSkeleton`
- `CareScreenSkeleton`
- `DietScreenSkeleton`
- `AssistantScreenSkeleton`
- `PetDetailSkeleton`

## Features

- Animated pulsing effect
- Preset components (Circle, Text, Title, Card)
- Native driver for 60fps
- Minimum 300ms duration (no flashes)

See `components/SkeletonLoader.tsx` for complete API.
