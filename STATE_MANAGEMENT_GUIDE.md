# Pet Care AI - State Management Guide

## 🎯 Overview

The app uses **React Context API** for global state management, providing a centralized data store accessible across all screens.

## 📊 State Architecture

```
┌─────────────────────────────────────┐
│         PetContext Provider         │
│  (Wraps entire app in _layout.tsx)  │
└──────────────┬──────────────────────┘
               │
               ├─── Pets State
               ├─── Reminders State
               ├─── Meals State
               ├─── Care Tasks State
               └─── Care History State
                    │
        ┌───────────┴───────────┐
        │                       │
    Computed Values      Action Methods
    - activeReminders    - addPet()
    - todaysMeals        - completeMeal()
    - upcomingCareTasks  - completeCareTask()
    - healthScore        - etc.
```

## 📁 File Structure

```
contexts/
└── PetContext.tsx          # Main context provider

data/
└── mockData.ts             # Mock data source

types/
├── pet.ts                  # Pet & Reminder types
├── diet.ts                 # Meal types
└── care.ts                 # Care task types

hooks/
└── usePetData.ts           # (Legacy - replaced by context)
```

## 🔧 Context Implementation

### PetContext.tsx

```typescript
interface PetContextType {
  // State
  pets: Pet[];
  reminders: Reminder[];
  meals: Meal[];
  careTasks: CareTask[];
  careHistory: CareHistory[];
  
  // Actions
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => void;
  completeMeal: (id: string) => void;
  completeCareTask: (id: string) => void;
  // ... more actions
  
  // Computed
  activeReminders: Reminder[];
  todaysMeals: Meal[];
  upcomingCareTasks: CareTask[];
  healthScore: number;
}
```

## 📦 Data Types

### Pet Data
```typescript
interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  breed?: string;
  age?: number;
  weight?: number;
  medications?: Medication[];
  // ... more fields
}
```

### Reminder Data
```typescript
interface Reminder {
  id: string;
  petId: string;
  type: 'medication' | 'appointment' | 'grooming' | 'vaccination';
  title: string;
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}
```

### Meal Data
```typescript
interface Meal {
  id: string;
  petId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  food: string;
  amount: string;
  calories: number;
  completed: boolean;
  scheduledDate: Date;
}
```

### Care Task Data
```typescript
interface CareTask {
  id: string;
  petId: string;
  category: 'medication' | 'vaccination' | 'grooming' | 'hygiene' | 'appointment' | 'wellness';
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}
```

## 🎣 Using the Context

### In a Component

```typescript
import { usePets } from '@/contexts/PetContext';

function MyComponent() {
  const { 
    pets, 
    reminders, 
    completeReminder,
    activeReminders,
    healthScore 
  } = usePets();
  
  return (
    <View>
      <Text>Health Score: {healthScore}%</Text>
      <Text>Active Reminders: {activeReminders.length}</Text>
      
      {pets.map(pet => (
        <Text key={pet.id}>{pet.name}</Text>
      ))}
    </View>
  );
}
```

## 🔄 State Operations

### Reading State

```typescript
// Get all pets
const { pets } = usePets();

// Get filtered data
const { activeReminders, todaysMeals } = usePets();

// Get computed values
const { healthScore } = usePets();
```

### Updating State

```typescript
const { completeMeal, completeReminder, completeCareTask } = usePets();

// Complete a meal
completeMeal('meal_1');

// Complete a reminder
completeReminder('reminder_1');

// Complete a care task
completeCareTask('task_1');
```

### Adding Data

```typescript
const { addPet, addReminder, addMeal } = usePets();

// Add a new pet
addPet({
  name: 'Buddy',
  type: 'dog',
  breed: 'Labrador',
  age: 3,
  weight: 65,
});

// Add a reminder
addReminder({
  petId: 'pet_1',
  type: 'medication',
  title: 'Heartworm Prevention',
  dueDate: new Date(),
  completed: false,
  priority: 'high',
});
```

## 📊 Mock Data

### Location
All mock data is centralized in `data/mockData.ts`

### Data Sets

1. **mockPets** - 2 pets (Max & Luna)
2. **mockReminders** - 4 reminders
3. **mockMeals** - 6 meals (today + tomorrow)
4. **mockCareTasks** - 6 care tasks
5. **mockCareHistory** - 5 completed tasks

### Customizing Mock Data

```typescript
// data/mockData.ts

export const mockPets: Pet[] = [
  {
    id: 'pet_1',
    name: 'Max',
    type: 'dog',
    breed: 'Golden Retriever',
    age: 2,
    weight: 42,
    // ... more fields
  },
  // Add more pets here
];
```

## 🔄 Data Flow

### Complete Flow Example

```
User Action (Tap "Log as Fed")
        ↓
Component calls completeMeal(id)
        ↓
Context updates meals state
        ↓
All subscribed components re-render
        ↓
UI updates across all screens
```

### Cross-Screen Persistence

```
Home Screen                Diet Screen
    ↓                          ↓
    └──→ PetContext ←──────────┘
            ↓
    Shared State (meals)
            ↓
    Complete meal in Diet
            ↓
    Home screen stats update automatically
```

## 🎯 Computed Values

### Active Reminders
```typescript
const activeReminders = reminders.filter(r => !r.completed);
```

### Today's Meals
```typescript
const todaysMeals = meals.filter(meal => {
  const today = new Date();
  const mealDate = new Date(meal.scheduledDate);
  return (
    mealDate.getDate() === today.getDate() &&
    mealDate.getMonth() === today.getMonth() &&
    mealDate.getFullYear() === today.getFullYear()
  );
});
```

### Health Score
```typescript
const healthScore = Math.round(
  (pets.length * 100 - activeReminders.length * 5) / Math.max(pets.length, 1)
);
```

## 🚀 Best Practices

### 1. Use Computed Values
```typescript
// ✅ Good - Use computed value
const { activeReminders } = usePets();

// ❌ Bad - Filter in component
const { reminders } = usePets();
const active = reminders.filter(r => !r.completed);
```

### 2. Destructure Only What You Need
```typescript
// ✅ Good - Only get what you need
const { pets, completeMeal } = usePets();

// ❌ Bad - Get everything
const context = usePets();
```

### 3. Use Action Methods
```typescript
// ✅ Good - Use provided action
completeMeal(mealId);

// ❌ Bad - Try to mutate directly
meals[0].completed = true; // Won't work!
```

### 4. Handle Loading States
```typescript
const { pets } = usePets();

if (!pets || pets.length === 0) {
  return <EmptyState />;
}

return <PetList pets={pets} />;
```

## 🔮 Future Enhancements

### Phase 2: Persistence
```typescript
// Add AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save state
await AsyncStorage.setItem('pets', JSON.stringify(pets));

// Load state
const saved = await AsyncStorage.getItem('pets');
const pets = JSON.parse(saved);
```

### Phase 3: Backend Integration
```typescript
// Replace mock data with API calls
const fetchPets = async () => {
  const response = await fetch('https://api.petcare.ai/pets');
  const pets = await response.json();
  setPets(pets);
};
```

### Phase 4: Optimistic Updates
```typescript
const completeMeal = async (id: string) => {
  // Update UI immediately
  setMeals(prev => prev.map(m => 
    m.id === id ? { ...m, completed: true } : m
  ));
  
  // Sync with backend
  try {
    await api.completeMeal(id);
  } catch (error) {
    // Revert on error
    setMeals(prev => prev.map(m => 
      m.id === id ? { ...m, completed: false } : m
    ));
  }
};
```

## 📝 Testing State

### Unit Test Example
```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { PetProvider, usePets } from '@/contexts/PetContext';

test('completes a meal', () => {
  const { result } = renderHook(() => usePets(), {
    wrapper: PetProvider,
  });

  const mealId = result.current.meals[0].id;

  act(() => {
    result.current.completeMeal(mealId);
  });

  const meal = result.current.meals.find(m => m.id === mealId);
  expect(meal?.completed).toBe(true);
});
```

## 🐛 Debugging

### Log State Changes
```typescript
useEffect(() => {
  console.log('Pets updated:', pets);
}, [pets]);

useEffect(() => {
  console.log('Meals updated:', meals);
}, [meals]);
```

### React DevTools
1. Install React DevTools
2. Inspect PetContext.Provider
3. View current state values
4. Track state changes

## 📊 Performance

### Optimization Tips

1. **Memoize Computed Values**
```typescript
const activeReminders = useMemo(
  () => reminders.filter(r => !r.completed),
  [reminders]
);
```

2. **Split Large Contexts**
```typescript
// If context gets too large, split into:
- PetContext (pets only)
- ReminderContext (reminders only)
- MealContext (meals only)
```

3. **Use Context Selectors**
```typescript
// Future: Use context selectors library
const pets = useContextSelector(PetContext, state => state.pets);
```

## ✅ Migration Checklist

### From Mock Data to Real Backend

- [ ] Replace mockData imports with API calls
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement data caching
- [ ] Add optimistic updates
- [ ] Implement offline support
- [ ] Add data synchronization
- [ ] Update TypeScript types
- [ ] Update tests
- [ ] Update documentation

---

**Last Updated**: February 12, 2026
**Version**: 1.0.2
