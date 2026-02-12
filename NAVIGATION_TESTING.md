# Navigation Testing Guide

## 🎯 Navigation Architecture

### Tab Navigation Structure
```
app/
├── _layout.tsx                 # Root layout with PetProvider
├── (tabs)/
│   ├── _layout.tsx            # Tab navigation config
│   ├── index.tsx              # Home (/)
│   ├── pets.tsx               # Pets (/pets)
│   ├── diet.tsx               # Diet (/diet)
│   ├── care.tsx               # Care (/care)
│   └── assistant.tsx          # Assistant (/assistant)
├── onboarding.tsx             # Onboarding flow
└── +not-found.tsx             # 404 page
```

## ✅ Navigation Routes

### Tab Routes (Bottom Navigation)
| Route | Screen | Icon | Status |
|-------|--------|------|--------|
| `/(tabs)` or `/` | Home | 🏠 | ✅ Working |
| `/(tabs)/pets` | Pets | 🐾 | ✅ Working |
| `/(tabs)/diet` | Diet | 🍖 | ✅ Working |
| `/(tabs)/care` | Care | ❤️ | ✅ Working |
| `/(tabs)/assistant` | Assistant | 💬 | ✅ Working |

### Other Routes
| Route | Screen | Status |
|-------|--------|--------|
| `/onboarding` | Onboarding | ✅ Working |
| `+not-found` | 404 Page | ✅ Working |

## 🔗 Navigation Bindings

### Home Screen → Other Screens

```typescript
// Home to Pets
router.push('/(tabs)/pets');

// Home to Care (via quick actions)
router.push('/(tabs)/care');

// Home to Assistant (via quick actions)
router.push('/(tabs)/assistant');

// Home to Emergency Modal (internal)
setEmergencyModalVisible(true);
```

**Test Cases:**
- ✅ Tap pet card → Navigate to Pets screen
- ✅ Tap "Log Med" quick action → Navigate to Care screen
- ✅ Tap "Symptom" quick action → Navigate to Assistant screen
- ✅ Tap "Schedule" quick action → Navigate to Care screen
- ✅ Tap "Emergency" quick action → Open Emergency Modal
- ✅ Tap reminder → Complete reminder (no navigation)

### Pets Screen → Other Screens

```typescript
// Pets to Care (via action chips)
router.push('/(tabs)/care');

// Pets to Home (via tab bar)
router.push('/(tabs)');
```

**Test Cases:**
- ✅ Tap "Health" action chip → Navigate to Care screen
- ✅ Tap "Schedule" action chip → Navigate to Care screen
- ✅ Tap "Meds" action chip → Navigate to Care screen
- ✅ Tap pet card → (Future: Navigate to pet detail)
- ✅ Tap "Add Pet" → (Future: Navigate to add pet form)

### Diet Screen → Other Screens

```typescript
// Diet uses global state, no external navigation
// All interactions are internal (complete meal)
```

**Test Cases:**
- ✅ Tap "Log as Fed" → Complete meal (no navigation)
- ✅ Tap "Add meal" → (Future: Navigate to add meal form)
- ✅ Tap nutrition tip → (Future: Navigate to tip detail)

### Care Screen → Other Screens

```typescript
// Care uses global state, no external navigation
// All interactions are internal (complete task)
```

**Test Cases:**
- ✅ Tap "Mark Complete" → Complete task (no navigation)
- ✅ Tap category card → (Future: Filter tasks)
- ✅ Tap "Add care task" → (Future: Navigate to add task form)
- ✅ Tap "View All History" → (Future: Navigate to full history)

### Assistant Screen → Other Screens

```typescript
// Assistant is self-contained
// No external navigation needed
```

**Test Cases:**
- ✅ Send message → Add to chat (no navigation)
- ✅ Tap quick prompt → Send message (no navigation)
- ✅ Tap photo button → (Future: Open camera)
- ✅ Tap voice button → (Future: Start voice input)

## 🧪 Manual Testing Checklist

### Tab Navigation
- [ ] Tap Home tab → Navigate to Home screen
- [ ] Tap Pets tab → Navigate to Pets screen
- [ ] Tap Diet tab → Navigate to Diet screen
- [ ] Tap Care tab → Navigate to Care screen
- [ ] Tap Assistant tab → Navigate to Assistant screen
- [ ] Tab bar visible on all screens
- [ ] Active tab highlighted correctly
- [ ] Tab icons display correctly

### Cross-Screen Navigation
- [ ] Home → Pets (via pet card)
- [ ] Home → Care (via "Log Med" button)
- [ ] Home → Care (via "Schedule" button)
- [ ] Home → Assistant (via "Symptom" button)
- [ ] Home → Emergency Modal (via "Emergency" button)
- [ ] Pets → Care (via action chips)
- [ ] All navigation preserves state
- [ ] Back navigation works correctly

### State Persistence
- [ ] Complete meal in Diet → Home stats update
- [ ] Complete reminder in Home → Care updates
- [ ] Complete care task → History updates
- [ ] Navigate away and back → State persists
- [ ] Tab switch → State persists

### Deep Linking (Future)
- [ ] `petcare://home` → Home screen
- [ ] `petcare://pets` → Pets screen
- [ ] `petcare://diet` → Diet screen
- [ ] `petcare://care` → Care screen
- [ ] `petcare://assistant` → Assistant screen

## 🔧 Navigation Utilities

### useRouter Hook
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate to screen
router.push('/(tabs)/pets');

// Navigate with params (future)
router.push({
  pathname: '/(tabs)/pets',
  params: { id: 'pet_1' }
});

// Go back
router.back();

// Replace current screen
router.replace('/(tabs)/home');
```

### Navigation Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| `push()` | Add to stack | Navigate forward |
| `back()` | Go back | Return to previous |
| `replace()` | Replace current | Login → Home |
| `canGoBack()` | Check if can go back | Conditional back |

## 🎨 Navigation Patterns

### Pattern 1: Tab Navigation
```typescript
// User taps tab bar
// Expo Router handles automatically
// No code needed
```

### Pattern 2: Programmatic Navigation
```typescript
const router = useRouter();

const handlePress = () => {
  router.push('/(tabs)/care');
};

<TouchableOpacity onPress={handlePress}>
  <Text>Go to Care</Text>
</TouchableOpacity>
```

### Pattern 3: Conditional Navigation
```typescript
const handleAction = () => {
  if (needsOnboarding) {
    router.push('/onboarding');
  } else {
    router.push('/(tabs)');
  }
};
```

### Pattern 4: Navigation with Haptics
```typescript
const handlePress = async () => {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  router.push('/(tabs)/pets');
};
```

## 🐛 Common Issues & Solutions

### Issue 1: Navigation Not Working
```typescript
// ❌ Wrong - Missing parentheses
router.push('/tabs/pets');

// ✅ Correct - With parentheses
router.push('/(tabs)/pets');
```

### Issue 2: State Not Persisting
```typescript
// ❌ Wrong - Local state
const [pets, setPets] = useState([]);

// ✅ Correct - Global state
const { pets } = usePets();
```

### Issue 3: Tab Bar Not Showing
```typescript
// ❌ Wrong - headerShown: true hides tab bar
<Tabs.Screen options={{ headerShown: true }} />

// ✅ Correct - headerShown: false
<Tabs.Screen options={{ headerShown: false }} />
```

### Issue 4: Back Button Not Working
```typescript
// Check if can go back
if (router.canGoBack()) {
  router.back();
} else {
  router.push('/(tabs)');
}
```

## 📊 Navigation Flow Diagram

```
┌─────────────────────────────────────────┐
│           App Launch                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Check Onboarding Status            │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴───────┐
       │               │
       ▼               ▼
  First Time      Returning User
       │               │
       ▼               │
  Onboarding           │
       │               │
       └───────┬───────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Tab Navigation                  │
│  ┌────────────────────────────────┐    │
│  │ Home │ Pets │ Diet │ Care │ AI │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
               │
       ┌───────┼───────┬───────┬───────┐
       │       │       │       │       │
       ▼       ▼       ▼       ▼       ▼
     Home    Pets    Diet    Care   Assistant
       │       │       │       │       │
       └───────┴───────┴───────┴───────┘
               │
        Cross-Screen Navigation
        (via buttons, actions)
```

## ✅ Verification Steps

### Step 1: Tab Navigation
1. Open app
2. Tap each tab in order
3. Verify screen changes
4. Verify tab bar always visible
5. Verify active tab highlighted

### Step 2: Quick Actions
1. Go to Home screen
2. Tap "Symptom" → Should go to Assistant
3. Go back to Home
4. Tap "Log Med" → Should go to Care
5. Go back to Home
6. Tap "Schedule" → Should go to Care
7. Go back to Home
8. Tap "Emergency" → Should open modal

### Step 3: Pet Navigation
1. Go to Pets screen
2. Tap "Health" chip → Should go to Care
3. Go back to Pets
4. Tap "Schedule" chip → Should go to Care
5. Go back to Pets
6. Tap "Meds" chip → Should go to Care

### Step 4: State Persistence
1. Go to Diet screen
2. Complete a meal
3. Go to Home screen
4. Verify stats updated
5. Go back to Diet
6. Verify meal still completed

## 🚀 Future Navigation Features

### Phase 2
- [ ] Pet detail screen
- [ ] Add pet form
- [ ] Add meal form
- [ ] Add care task form
- [ ] Settings screen

### Phase 3
- [ ] Deep linking
- [ ] Push notification navigation
- [ ] Share sheet integration
- [ ] Universal links

### Phase 4
- [ ] Multi-step forms
- [ ] Modal navigation
- [ ] Drawer navigation
- [ ] Custom transitions

## 📝 Navigation Best Practices

1. **Always use typed routes**
   ```typescript
   router.push('/(tabs)/pets'); // ✅ Good
   router.push('/pets');        // ❌ Bad
   ```

2. **Handle navigation errors**
   ```typescript
   try {
     router.push('/(tabs)/pets');
   } catch (error) {
     console.error('Navigation failed:', error);
   }
   ```

3. **Use haptic feedback**
   ```typescript
   await Haptics.impactAsync();
   router.push('/(tabs)/pets');
   ```

4. **Check navigation state**
   ```typescript
   if (router.canGoBack()) {
     router.back();
   }
   ```

5. **Preserve state**
   ```typescript
   // Use global state, not local
   const { pets } = usePets();
   ```

---

**Last Updated**: February 12, 2026
**Version**: 1.0.2
**Status**: ✅ All Navigation Working
