# Quick Start Guide - Pet Care AI Mobile

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn
- Expo Go app on your phone (iOS/Android)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Running the App

1. After running `npm run dev`, you'll see a QR code in the terminal
2. Open Expo Go app on your phone
3. Scan the QR code
4. The app will load on your device

## 📱 Navigation Overview

```
┌─────────────────────────────────────────┐
│                                         │
│         [SCREEN CONTENT]                │
│                                         │
├─────────────────────────────────────────┤
│ 🏠    🐾    🍖    ❤️    💬             │
│ Home  Pets  Diet  Care  Assistant      │
└─────────────────────────────────────────┘
```

## 🎯 What Each Tab Does

### 🏠 Home
**Your command center**
- See all pets at a glance
- Check today's reminders
- Quick actions for common tasks
- Recent activity feed

**Try this**: Tap on a reminder to see details

---

### 🐾 Pets
**Manage your pets**
- View all pet profiles
- See health status
- Quick access to pet actions
- Add new pets

**Try this**: Tap "View Full Profile" on Max or Luna

---

### 🍖 Diet
**Track nutrition**
- Daily meal schedule
- Log feeding times
- Nutrition tips
- Food safety info

**Try this**: Tap "Log as Fed" on a pending meal

---

### ❤️ Care
**Health & wellness**
- Medications and vaccinations
- Grooming tasks
- Appointments
- Care history

**Try this**: Tap a care category to filter tasks

---

### 💬 Assistant
**AI help anytime**
- Ask health questions
- Get diet advice
- Training tips
- Emergency guidance

**Try this**: Tap a quick prompt chip or type a question

## 🎨 Design Features

### Color Coding
- 🟢 **Green**: Healthy, completed, safe
- 🟡 **Yellow**: Caution, due soon, monitor
- 🔴 **Red**: Urgent, overdue, danger

### Touch Targets
All buttons are at least 44pt tall for easy tapping

### Accessibility
- Screen reader support
- High contrast text
- Large, readable fonts

## 📊 Mock Data

The app includes sample data for testing:

**Pets**:
- Max: Golden Retriever, 2 years old
- Luna: Persian Cat, 4 years old

**Reminders**:
- Max's antibiotics (DUE NOW)
- Luna's flea prevention (2 hours)
- Max's vet checkup (Tomorrow)

**Meals**:
- 4 meals per day (2 per pet)
- Breakfast and dinner schedules

**Care Tasks**:
- Medications, grooming, appointments
- Urgent and routine tasks

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for web
npm run build:web
```

## 📁 Key Files

```
app/(tabs)/
├── index.tsx        # Home screen
├── pets.tsx         # Pets management
├── diet.tsx         # Diet tracking
├── care.tsx         # Care & wellness
└── assistant.tsx    # AI assistant

components/
├── HealthStatusCard.tsx
└── EmergencyModal.tsx

constants/
└── theme.ts         # Design tokens

types/
└── pet.ts           # TypeScript types
```

## 🎯 Testing Checklist

- [ ] Navigate between all 5 tabs
- [ ] Scroll through each screen
- [ ] Tap on pet cards
- [ ] Try quick action buttons
- [ ] Send a message in Assistant
- [ ] Check responsive layout
- [ ] Test accessibility features

## 💡 Tips

1. **Navigation**: Swipe or tap tabs to switch screens
2. **Scrolling**: All screens scroll vertically
3. **Actions**: Look for buttons at the bottom of cards
4. **Status**: Color-coded badges show urgency
5. **Assistant**: Use quick prompts for common questions

## 🐛 Troubleshooting

### App won't load?
- Check that `npm install` completed successfully
- Ensure your phone and computer are on the same network
- Try restarting the Expo server

### TypeScript errors?
- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript is in devDependencies

### Styling looks off?
- Clear Expo cache: `npx expo start -c`
- Reload the app in Expo Go

## 📚 Learn More

- **Expo Router**: [docs.expo.dev/router](https://docs.expo.dev/router)
- **React Native**: [reactnative.dev](https://reactnative.dev)
- **Lucide Icons**: [lucide.dev](https://lucide.dev)

## 🎉 You're Ready!

The app is fully functional with mock data. All screens are navigable and interactive. Start exploring and testing the features!

---

**Need help?** Check the README.md for detailed documentation.
