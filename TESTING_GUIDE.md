# Pet Care AI - Testing Guide

## 🧪 Testing Strategy

### Testing Pyramid
```
        /\
       /  \
      / E2E \
     /______\
    /        \
   /Integration\
  /____________\
 /              \
/  Unit Tests    \
/________________\
```

## ✅ Manual Testing Checklist

### 1. Home Screen Testing

#### Visual Tests
- [ ] Header displays correct greeting based on time
- [ ] Quick stats show accurate numbers
- [ ] Pet cards display with correct emojis
- [ ] Reminders show with proper urgency colors
- [ ] Quick action buttons are properly sized
- [ ] Activity feed is readable

#### Interaction Tests
- [ ] Tap pet card navigates to Pets screen
- [ ] Tap reminder marks it as complete
- [ ] Quick action buttons provide haptic feedback
- [ ] Emergency button opens modal
- [ ] Scroll works smoothly
- [ ] Pull-to-refresh (future feature)

#### Data Tests
- [ ] Stats update when reminders are completed
- [ ] Health score calculates correctly
- [ ] Reminder count decreases when completed
- [ ] Pet data displays from context

---

### 2. Pets Screen Testing

#### Visual Tests
- [ ] Pet list displays all pets
- [ ] Status indicators show correct colors
- [ ] Quick action chips are visible
- [ ] Add pet card is styled correctly
- [ ] Pet avatars display emojis

#### Interaction Tests
- [ ] Tap pet card shows details
- [ ] Quick action chips are tappable
- [ ] "View Full Profile" navigates
- [ ] Add pet button works
- [ ] Scroll through pet list

#### Data Tests
- [ ] All pets from context display
- [ ] Next appointment dates are correct
- [ ] Medication counts are accurate
- [ ] Pet details match data

---

### 3. Diet Screen Testing

#### Visual Tests
- [ ] Daily summary cards display
- [ ] Meal cards show completion status
- [ ] Nutrition tips are readable
- [ ] Food safety alert is prominent
- [ ] Calorie counts are visible

#### Interaction Tests
- [ ] "Log as Fed" button works
- [ ] Meal cards are tappable
- [ ] Add meal button functions
- [ ] Scroll through meals
- [ ] Nutrition tips expandable (future)

#### Data Tests
- [ ] Meal completion updates
- [ ] Calorie totals calculate correctly
- [ ] Pet-specific meals display
- [ ] Time-based meal ordering

---

### 4. Care Screen Testing

#### Visual Tests
- [ ] Category grid displays 6 items
- [ ] Upcoming tasks show urgency
- [ ] Care history is formatted
- [ ] Icons match categories
- [ ] Badge counts are visible

#### Interaction Tests
- [ ] Category cards filter tasks
- [ ] "Mark Complete" button works
- [ ] Task cards are tappable
- [ ] View all history link works
- [ ] Add care task button functions

#### Data Tests
- [ ] Task counts per category
- [ ] Urgency levels are correct
- [ ] History items display
- [ ] Completion updates state

---

### 5. Assistant Screen Testing

#### Visual Tests
- [ ] Chat bubbles display correctly
- [ ] Quick prompts are visible
- [ ] Typing indicator animates
- [ ] Input bar is accessible
- [ ] AI icon displays

#### Interaction Tests
- [ ] Send button works
- [ ] Quick prompts trigger responses
- [ ] Photo button is tappable
- [ ] Voice button is tappable
- [ ] Keyboard shows/hides properly
- [ ] Scroll to bottom on new message

#### Data Tests
- [ ] Messages persist in chat
- [ ] AI responses are contextual
- [ ] Chat history maintains order
- [ ] Timestamps are accurate

---

## 📱 Device Testing Matrix

### iOS Devices
| Device | Screen Size | iOS Version | Status |
|--------|-------------|-------------|--------|
| iPhone SE | 4.7" | 15+ | ⏳ Pending |
| iPhone 12/13 | 6.1" | 15+ | ⏳ Pending |
| iPhone 14 Pro | 6.1" | 16+ | ⏳ Pending |
| iPhone 15 Pro Max | 6.7" | 17+ | ⏳ Pending |
| iPad Mini | 8.3" | 15+ | ⏳ Pending |
| iPad Pro | 12.9" | 15+ | ⏳ Pending |

### Android Devices
| Device | Screen Size | Android Version | Status |
|--------|-------------|-----------------|--------|
| Pixel 5 | 6.0" | 11+ | ⏳ Pending |
| Pixel 7 | 6.3" | 13+ | ⏳ Pending |
| Samsung S21 | 6.2" | 11+ | ⏳ Pending |
| Samsung S23 | 6.1" | 13+ | ⏳ Pending |
| OnePlus 9 | 6.55" | 11+ | ⏳ Pending |

---

## ♿ Accessibility Testing

### Screen Reader Testing

#### iOS VoiceOver
```bash
Settings → Accessibility → VoiceOver → On
```

**Test Cases**:
- [ ] All buttons announce correctly
- [ ] Tab navigation is logical
- [ ] Images have alt text
- [ ] Form inputs are labeled
- [ ] Status updates are announced
- [ ] Hints provide context

#### Android TalkBack
```bash
Settings → Accessibility → TalkBack → On
```

**Test Cases**:
- [ ] Navigation order is correct
- [ ] Touch targets are announced
- [ ] Actions are described
- [ ] Content changes are announced
- [ ] Gestures work properly

### Visual Accessibility

#### Color Contrast
Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

**Test Cases**:
- [ ] Text on background: 4.5:1 minimum
- [ ] Large text: 3:1 minimum
- [ ] Icons: 3:1 minimum
- [ ] Status indicators: 3:1 minimum
- [ ] Buttons: 3:1 minimum

#### Font Sizing
**Test Cases**:
- [ ] Body text is 16pt minimum
- [ ] Headings are proportionally larger
- [ ] Labels are readable
- [ ] Zoom to 200% works
- [ ] Text doesn't overlap

### Motor Accessibility

#### Touch Targets
**Test Cases**:
- [ ] All buttons are 44pt minimum
- [ ] Spacing between targets is adequate
- [ ] One-hand operation is possible
- [ ] No time-sensitive interactions
- [ ] Gestures have alternatives

---

## 🎨 Visual Regression Testing

### Screenshot Comparison
Take screenshots of each screen in different states:

#### Home Screen
- [ ] Empty state (no pets)
- [ ] With 1 pet
- [ ] With 2+ pets
- [ ] No reminders
- [ ] With urgent reminders
- [ ] With completed reminders

#### Pets Screen
- [ ] Empty state
- [ ] With 1 pet
- [ ] With multiple pets
- [ ] Add pet card visible

#### Diet Screen
- [ ] All meals completed
- [ ] Some meals pending
- [ ] No meals logged

#### Care Screen
- [ ] No upcoming tasks
- [ ] With urgent tasks
- [ ] With completed tasks

#### Assistant Screen
- [ ] Initial state
- [ ] With conversation
- [ ] Typing indicator
- [ ] Long messages

---

## ⚡ Performance Testing

### Metrics to Track
```javascript
// React Native Performance Monitor
import { PerformanceObserver } from 'react-native-performance';

const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

observer.observe({ entryTypes: ['measure'] });
```

### Performance Benchmarks
| Metric | Target | Acceptable | Poor |
|--------|--------|------------|------|
| App Launch | <1s | <2s | >2s |
| Tab Switch | <100ms | <300ms | >300ms |
| Scroll FPS | 60fps | 50fps | <50fps |
| API Response | <500ms | <1s | >1s |
| Memory Usage | <100MB | <200MB | >200MB |

### Test Cases
- [ ] App launches quickly
- [ ] Navigation is smooth
- [ ] Scrolling is fluid
- [ ] No memory leaks
- [ ] Images load efficiently
- [ ] Animations are smooth

---

## 🔒 Security Testing

### Data Protection
- [ ] No sensitive data in logs
- [ ] Secure storage for credentials
- [ ] API keys are not exposed
- [ ] User data is encrypted
- [ ] HTTPS only for API calls

### Input Validation
- [ ] Text inputs are sanitized
- [ ] File uploads are validated
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection

---

## 🌐 Network Testing

### Connection States
- [ ] Online mode works
- [ ] Offline mode graceful
- [ ] Slow connection handling
- [ ] Connection loss recovery
- [ ] Retry logic works

### API Testing
- [ ] Success responses handled
- [ ] Error responses handled
- [ ] Timeout handling
- [ ] Rate limiting respected
- [ ] Caching works

---

## 🧩 Integration Testing

### Context Integration
```typescript
// Test PetContext
import { renderHook, act } from '@testing-library/react-hooks';
import { PetProvider, usePets } from '@/contexts/PetContext';

test('completes reminder', () => {
  const { result } = renderHook(() => usePets(), {
    wrapper: PetProvider,
  });

  act(() => {
    result.current.completeReminder('r1');
  });

  expect(result.current.reminders[0].completed).toBe(true);
});
```

### Navigation Testing
```typescript
// Test navigation flow
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '@/app/(tabs)/index';

test('navigates to pets screen', () => {
  const { getByText } = render(<HomeScreen />);
  const petCard = getByText('Max');
  
  fireEvent.press(petCard);
  
  // Assert navigation occurred
});
```

---

## 📊 Test Coverage Goals

### Coverage Targets
```
Overall:     80%+
Components:  90%+
Utils:       95%+
Hooks:       85%+
Contexts:    90%+
```

### Running Coverage
```bash
# Jest with coverage
npm test -- --coverage

# View coverage report
open coverage/lcov-report/index.html
```

---

## 🐛 Bug Reporting Template

```markdown
## Bug Report

**Title**: [Brief description]

**Priority**: Critical / High / Medium / Low

**Environment**:
- Device: [iPhone 14 Pro / Pixel 7]
- OS Version: [iOS 17 / Android 13]
- App Version: [1.0.2]

**Steps to Reproduce**:
1. Open app
2. Navigate to [screen]
3. Tap [button]
4. Observe [issue]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Screenshots**:
[Attach screenshots]

**Additional Context**:
[Any other relevant information]
```

---

## ✅ Pre-Release Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console warnings
- [ ] Linting passes
- [ ] Code formatted
- [ ] Comments added

### Functionality
- [ ] All features work
- [ ] No critical bugs
- [ ] Edge cases handled
- [ ] Error states tested
- [ ] Loading states work

### Performance
- [ ] App launches quickly
- [ ] Smooth animations
- [ ] No memory leaks
- [ ] Efficient rendering
- [ ] Optimized images

### Accessibility
- [ ] Screen reader tested
- [ ] Color contrast verified
- [ ] Touch targets adequate
- [ ] Keyboard navigation works
- [ ] Focus management correct

### Documentation
- [ ] README updated
- [ ] API docs current
- [ ] Comments added
- [ ] Changelog updated
- [ ] Release notes written

---

## 🚀 Continuous Testing

### Automated Testing Pipeline
```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
      - run: npm run lint
      - run: npm run typecheck
```

### Test Frequency
- **Unit Tests**: On every commit
- **Integration Tests**: On every PR
- **E2E Tests**: Daily
- **Performance Tests**: Weekly
- **Accessibility Tests**: Before release

---

## 📝 Testing Best Practices

1. **Write tests first** (TDD when possible)
2. **Test user behavior**, not implementation
3. **Keep tests simple** and focused
4. **Use descriptive names** for test cases
5. **Mock external dependencies**
6. **Test edge cases** and error states
7. **Maintain test data** separately
8. **Run tests frequently**
9. **Fix failing tests** immediately
10. **Review test coverage** regularly

---

**Last Updated**: February 12, 2026
**Version**: 1.0.2
