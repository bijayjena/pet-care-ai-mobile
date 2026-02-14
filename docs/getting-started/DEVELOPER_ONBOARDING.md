# Pet Care AI - Developer Onboarding Guide

Welcome to the Pet Care AI Mobile development team! This guide will help you get up and running quickly.

## 🎯 Day 1: Setup & Orientation

### Prerequisites Installation

#### 1. Install Node.js
```bash
# Download from https://nodejs.org/
# Recommended: v18 LTS or higher

# Verify installation
node --version  # Should be v18+
npm --version   # Should be v9+
```

#### 2. Install Git
```bash
# Download from https://git-scm.com/
# Or use package manager

# macOS
brew install git

# Windows
# Download installer from git-scm.com

# Verify
git --version
```

#### 3. Install Code Editor
```bash
# Recommended: Visual Studio Code
# Download from https://code.visualstudio.com/

# Recommended Extensions:
# - ESLint
# - Prettier
# - TypeScript and JavaScript Language Features
# - React Native Tools
# - GitLens
```

#### 4. Install Expo CLI
```bash
# Install globally
npm install -g expo-cli

# Verify
expo --version
```

#### 5. Install Mobile Development Tools

**For iOS (Mac only)**:
```bash
# Install Xcode from Mac App Store
# Install CocoaPods
sudo gem install cocoapods
```

**For Android**:
```bash
# Download Android Studio
# https://developer.android.com/studio

# Set environment variables
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Project Setup

#### 1. Clone Repository
```bash
# Clone the repo
git clone [repository-url]
cd pet-care-ai-mobile

# Create your branch
git checkout -b feature/your-name-setup
```

#### 2. Install Dependencies
```bash
# Install npm packages
npm install

# This may take 5-10 minutes
```

#### 3. Start Development Server
```bash
# Start Expo
npm run dev

# You should see a QR code in the terminal
```

#### 4. Install Expo Go App
```bash
# iOS: Download from App Store
# Android: Download from Google Play

# Scan QR code to open app
```

### First Day Checklist
- [ ] All prerequisites installed
- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] App running on device
- [ ] Code editor configured
- [ ] Git configured with your name/email
- [ ] Slack/communication tools set up
- [ ] Access to project management tools

---

## 📚 Day 2: Codebase Exploration

### Project Structure Tour

#### 1. Read Documentation
Start with these files in order:
1. `README.md` - Project overview
2. `QUICK_START.md` - Getting started
3. `APP_STRUCTURE.md` - Architecture
4. `NAVIGATION.md` - Navigation flow
5. `FEATURES_GUIDE.md` - Feature details

#### 2. Explore Key Directories

```bash
# Navigate through the codebase
cd app/(tabs)        # Main screens
cd components        # Reusable UI
cd constants         # Design system
cd types             # TypeScript types
cd hooks             # Custom hooks
cd contexts          # State management
```

#### 3. Run the App
```bash
# Try different screens
# - Home: Dashboard overview
# - Pets: Pet management
# - Diet: Nutrition tracking
# - Care: Health tasks
# - Assistant: AI chat
```

### Code Reading Exercise

#### Task 1: Understand Home Screen
```typescript
// Open app/(tabs)/index.tsx
// Answer these questions:
// 1. What data does it display?
// 2. How does it get pet data?
// 3. What happens when you tap a reminder?
// 4. How are quick actions handled?
```

#### Task 2: Explore Design System
```typescript
// Open constants/theme.ts
// Answer these questions:
// 1. What are the primary colors?
// 2. What's the minimum font size?
// 3. What's the minimum touch target size?
// 4. How is spacing organized?
```

#### Task 3: Study Context
```typescript
// Open contexts/PetContext.tsx
// Answer these questions:
// 1. What data does it provide?
// 2. How do you access it in components?
// 3. What actions can you perform?
// 4. Where is the mock data defined?
```

### Second Day Checklist
- [ ] Read all documentation
- [ ] Explored project structure
- [ ] Ran app on device
- [ ] Understood navigation flow
- [ ] Reviewed design system
- [ ] Studied context implementation
- [ ] Asked questions in team chat

---

## 🛠️ Day 3: Make Your First Change

### Exercise 1: Add a New Quick Action

**Goal**: Add a "Training" quick action button to the Home screen

**Steps**:
1. Open `app/(tabs)/index.tsx`
2. Find the `actionsGrid` section
3. Add a new `TouchableOpacity` with:
   - Icon: `BookOpen` from lucide-react-native
   - Text: "Training"
   - Color: `colors.primary[600]`
4. Add a handler function
5. Test on device

**Expected Result**:
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Training tips"
  accessibilityRole="button"
  style={styles.actionButton}
  onPress={() => handleQuickAction('training')}
>
  <BookOpen size={24} color={colors.primary[600]} />
  <Text style={styles.actionText}>Training</Text>
</TouchableOpacity>
```

### Exercise 2: Modify a Color

**Goal**: Change the urgent reminder color

**Steps**:
1. Open `constants/theme.ts`
2. Find `status.urgent`
3. Change from `#EF4444` to `#DC2626`
4. Save and see changes hot reload
5. Verify on Home screen reminders

### Exercise 3: Add a New Pet

**Goal**: Add a third pet to mock data

**Steps**:
1. Open `hooks/usePetData.ts`
2. Find the `pets` array
3. Add a new pet object:
   - Name: "Buddy"
   - Type: "dog"
   - Breed: "Labrador"
   - Age: 5
4. Save and verify on Home screen

### Third Day Checklist
- [ ] Made first code change
- [ ] Tested changes on device
- [ ] Committed changes to git
- [ ] Created pull request
- [ ] Received code review
- [ ] Merged changes

---

## 🎨 Day 4: Design System Deep Dive

### Understanding the Design System

#### Color System
```typescript
// Primary colors for actions
colors.primary[600]  // Buttons, links

// Status colors for feedback
colors.status.healthy  // Success, completed
colors.status.caution  // Warning, due soon
colors.status.urgent   // Error, overdue

// Neutral colors for UI
colors.background  // Page background
colors.surface     // Card background
colors.text.primary    // Main text
colors.text.secondary  // Supporting text
```

#### Typography
```typescript
// Font sizes
typography.sizes.base  // 16pt - Body text
typography.sizes.lg    // 18pt - Subheadings
typography.sizes.xl    // 20pt - Headings

// Font weights
typography.weights.normal    // 400
typography.weights.semibold  // 600
typography.weights.bold      // 700
```

#### Spacing
```typescript
// Use spacing tokens, not hardcoded values
padding: spacing.lg      // ✅ Good
padding: 16              // ❌ Bad

marginBottom: spacing.md // ✅ Good
marginBottom: 12         // ❌ Bad
```

### Exercise: Create a Styled Component

**Goal**: Create a reusable `InfoCard` component

```typescript
// components/InfoCard.tsx
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';

interface InfoCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function InfoCard({ title, description, icon }: InfoCardProps) {
  return (
    <View style={styles.card}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  icon: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.base,
    color: colors.text.secondary,
    lineHeight: typography.sizes.base * typography.lineHeights.normal,
  },
});
```

### Fourth Day Checklist
- [ ] Understand color system
- [ ] Understand typography scale
- [ ] Understand spacing system
- [ ] Created styled component
- [ ] Used design tokens
- [ ] Tested component

---

## 🧪 Day 5: Testing & Quality

### Writing Your First Test

#### Unit Test Example
```typescript
// __tests__/components/InfoCard.test.tsx
import { render } from '@testing-library/react-native';
import { InfoCard } from '@/components/InfoCard';

describe('InfoCard', () => {
  it('renders title and description', () => {
    const { getByText } = render(
      <InfoCard
        title="Test Title"
        description="Test Description"
      />
    );

    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });
});
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Code Quality Tools

#### TypeScript
```bash
# Check types
npm run typecheck

# Should show no errors
```

#### Linting
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

#### Formatting
```bash
# Format code with Prettier
npx prettier --write "**/*.{ts,tsx,js,jsx,json,md}"
```

### Fifth Day Checklist
- [ ] Wrote first test
- [ ] Ran test suite
- [ ] Fixed TypeScript errors
- [ ] Fixed linting issues
- [ ] Formatted code
- [ ] Committed clean code

---

## 🚀 Week 2: Advanced Topics

### State Management

#### Using Context
```typescript
// In a component
import { usePets } from '@/contexts/PetContext';

function MyComponent() {
  const { pets, reminders, completeReminder } = usePets();
  
  // Use the data
  return (
    <View>
      {pets.map(pet => (
        <Text key={pet.id}>{pet.name}</Text>
      ))}
    </View>
  );
}
```

### Navigation

#### Programmatic Navigation
```typescript
import { useRouter } from 'expo-router';

function MyComponent() {
  const router = useRouter();
  
  const handlePress = () => {
    router.push('/pets');
  };
  
  return <Button onPress={handlePress} />;
}
```

### Accessibility

#### Adding Accessibility Labels
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Complete reminder"
  accessibilityHint="Marks this reminder as done"
  accessibilityRole="button"
  onPress={handleComplete}
>
  <Text>Complete</Text>
</TouchableOpacity>
```

---

## 📖 Resources

### Documentation
- [React Native Docs](https://reactnative.dev/)
- [Expo Docs](https://docs.expo.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Lucide Icons](https://lucide.dev/)

### Learning Resources
- [React Native Express](https://www.reactnative.express/)
- [Expo Learn](https://docs.expo.dev/tutorial/introduction/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Community
- [React Native Discord](https://discord.gg/reactnative)
- [Expo Discord](https://discord.gg/expo)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/react-native)

---

## 🎯 30-Day Goals

### Week 1
- [ ] Complete setup
- [ ] Understand codebase
- [ ] Make first contribution
- [ ] Pass code review

### Week 2
- [ ] Build a feature
- [ ] Write tests
- [ ] Review others' code
- [ ] Improve documentation

### Week 3
- [ ] Lead a feature
- [ ] Mentor new developer
- [ ] Optimize performance
- [ ] Fix bugs

### Week 4
- [ ] Architect new feature
- [ ] Present to team
- [ ] Deploy to staging
- [ ] Celebrate success! 🎉

---

## 💬 Getting Help

### When You're Stuck
1. **Check documentation** first
2. **Search codebase** for similar examples
3. **Ask in team chat** with context
4. **Pair program** with teammate
5. **Schedule 1:1** with mentor

### Good Questions Include
- What you're trying to do
- What you've tried
- Error messages
- Code snippets
- Screenshots

### Communication Channels
- **Slack**: #dev-mobile (general)
- **Slack**: #dev-help (questions)
- **GitHub**: Issues & PRs
- **Zoom**: Daily standups

---

## ✅ Onboarding Complete!

Congratulations! You're now ready to contribute to Pet Care AI Mobile.

### Next Steps
1. Pick your first ticket
2. Create a branch
3. Write code
4. Write tests
5. Submit PR
6. Get reviewed
7. Merge & deploy

Welcome to the team! 🎉

---

**Last Updated**: February 12, 2026
**Version**: 1.0.2
