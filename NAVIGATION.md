# Pet Care AI - Navigation Structure

## Bottom Tab Navigation

The app uses a 5-tab bottom navigation structure optimized for mobile pet care management.

### Tab Overview

```
┌─────────────────────────────────────────┐
│                                         │
│         [TAB CONTENT]                   │
│                                         │
├─────────────────────────────────────────┤
│ 🏠    🐾    🍖    ❤️    💬             │
│ Home  Pets  Diet  Care  Assistant      │
└─────────────────────────────────────────┘
```

## Tab Details

### 1. Home (index.tsx)
**Purpose**: Central dashboard for all pet activities

**Features**:
- Welcome message with time-based greeting
- Quick stats cards (Active Pets, Due Today, Health Score)
- Pet status overview for all pets
- Today's reminders with urgency indicators
- Quick action buttons (Check Symptom, Log Medication, Schedule, Emergency)
- Recent activity timeline

**Mock Data**:
- 2 pets (Max the dog, Luna the cat)
- 3 reminders (1 urgent, 2 upcoming)
- Activity history

---

### 2. Pets (pets.tsx)
**Purpose**: Manage individual pet profiles

**Features**:
- List view of all pets with avatars
- Pet status indicators (healthy/caution/urgent)
- Quick stats per pet (next appointment, active medications)
- Quick action chips (Health, Schedule, Meds)
- "View Full Profile" navigation
- Add new pet card

**Mock Data**:
- Max: Golden Retriever, 2yo, 42 lbs, 2 medications
- Luna: Persian Cat, 4yo, 10 lbs, 1 medication

---

### 3. Diet (diet.tsx)
**Purpose**: Track nutrition and feeding schedules

**Features**:
- Daily meal summary (meals completed, total calories)
- Today's meal schedule with completion status
- Meal details (food type, amount, calories)
- "Log as Fed" buttons for pending meals
- Nutrition tips section
- Food safety alert card

**Mock Data**:
- 4 meals total (2 for Max, 2 for Luna)
- 2 completed, 2 pending
- 1,260 total calories
- 3 nutrition tips

---

### 4. Care (care.tsx)
**Purpose**: Manage health and wellness tasks

**Features**:
- Care category grid (Medications, Vaccinations, Grooming, Hygiene, Appointments, Wellness)
- Upcoming care tasks with urgency indicators
- "Mark Complete" functionality
- Recent care history
- Category-based organization

**Mock Data**:
- 6 care categories with item counts
- 4 upcoming tasks (1 urgent medication)
- 3 recent history items

---

### 5. Assistant (assistant.tsx)
**Purpose**: AI-powered pet care guidance

**Features**:
- Conversational chat interface
- Quick prompt chips for common questions
- Typing indicator for AI responses
- Photo and voice input buttons
- Context-aware responses
- Multi-line text input

**Mock Data**:
- Initial greeting message
- 4 quick prompts (Check symptoms, Safe foods, Training tips, Medication help)
- Smart responses based on keywords

**AI Response Topics**:
- Symptom checking
- Diet and nutrition
- Training and behavior
- Emergency guidance

## Navigation Icons

| Tab | Icon | Lucide Component |
|-----|------|------------------|
| Home | 🏠 | `Home` |
| Pets | 🐾 | `PawPrint` |
| Diet | 🍖 | `UtensilsCrossed` |
| Care | ❤️ | `Heart` |
| Assistant | 💬 | `MessageCircle` |

## Accessibility

All tabs include:
- `accessibilityLabel` for screen readers
- `accessibilityRole="button"` for interactive elements
- High contrast colors (4.5:1 minimum)
- 44pt minimum touch targets
- Keyboard navigation support

## Design Consistency

All screens follow:
- Calm-first color palette
- 16pt minimum font size
- Consistent spacing (using theme tokens)
- Card-based layouts with shadows
- Bottom-aligned primary actions
- Pull-to-refresh capability (future)

## Mock Data Structure

All screens use temporary mock data for demonstration:
- 2 pets (Max and Luna)
- Realistic timestamps and dates
- Varied urgency levels
- Complete data sets for testing

## Future Enhancements

- Deep linking to specific tabs/screens
- Tab badges for notifications
- Swipe gestures between tabs
- Tab-specific search functionality
- Persistent state across tab switches
- Real-time data synchronization
