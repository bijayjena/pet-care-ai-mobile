# Quick Navigation Reference

## Common Navigation Patterns

### Navigate to a Tab
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to specific tabs
router.push('/(tabs)/');          // Home
router.push('/(tabs)/pets');      // Pets
router.push('/(tabs)/diet');      // Diet
router.push('/(tabs)/care');      // Care
router.push('/(tabs)/assistant'); // Assistant
```

### Navigate to Pet Detail
```typescript
const petId = 'pet_1';
router.push(`/pet/${petId}`);
```

### Go Back
```typescript
router.back();
```

### Replace Current Screen
```typescript
router.replace('/(tabs)'); // Replace, can't go back
```

### Navigate with Haptics
```typescript
import * as Haptics from 'expo-haptics';

const handleNavigation = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  router.push('/(tabs)/care');
};
```

## Route Paths Quick Reference

| Screen | Path | Type |
|--------|------|------|
| Home | `/(tabs)/` or `/(tabs)/index` | Tab |
| Pets | `/(tabs)/pets` | Tab |
| Diet | `/(tabs)/diet` | Tab |
| Care | `/(tabs)/care` | Tab |
| Assistant | `/(tabs)/assistant` | Tab |
| Pet Detail | `/pet/[id]` | Dynamic |
| Onboarding | `/onboarding` | Stack |
| 404 | `+not-found` | Special |

## Context Usage

```typescript
import { usePets } from '@/contexts/PetContext';

const { 
  pets,
  activeReminders,
  completeReminder,
  // ... other values
} = usePets();
```

## Common Mistakes to Avoid

❌ **Wrong**: `router.push('/care')`
✅ **Right**: `router.push('/(tabs)/care')`

❌ **Wrong**: `router.push('/pet/' + petId)`
✅ **Right**: `router.push(\`/pet/\${petId}\`)`

❌ **Wrong**: Using `<Link>` for programmatic navigation
✅ **Right**: Using `router.push()` in event handlers

## File Locations

```
app/
├── _layout.tsx              # Root layout
├── (tabs)/
│   ├── _layout.tsx         # Tab config
│   ├── index.tsx           # Home
│   ├── pets.tsx            # Pets
│   ├── diet.tsx            # Diet
│   ├── care.tsx            # Care
│   └── assistant.tsx       # Assistant
├── pet/[id].tsx            # Pet detail
└── onboarding.tsx          # Onboarding

contexts/
└── PetContext.tsx          # Global state
```

## Debugging Navigation

### Check Current Route
```typescript
import { usePathname } from 'expo-router';

const pathname = usePathname();
console.log('Current route:', pathname);
```

### Check Route Params
```typescript
import { useLocalSearchParams } from 'expo-router';

const { id } = useLocalSearchParams<{ id: string }>();
console.log('Pet ID:', id);
```

### Navigation Events
```typescript
import { useNavigation } from 'expo-router';

const navigation = useNavigation();

useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    console.log('Screen focused');
  });
  return unsubscribe;
}, [navigation]);
```

## Quick Fixes

### Navigation Not Working?
1. Check the path format: `/(tabs)/care` not `/care`
2. Restart dev server: `npm run dev`
3. Clear cache: `expo start -c`

### State Not Updating?
1. Verify PetProvider wraps app in `_layout.tsx`
2. Check context is imported correctly
3. Ensure state updates are called properly

### TypeScript Errors?
1. Run `npm run typecheck`
2. Check import paths use `@/` alias
3. Verify types are defined in `types/` folder
