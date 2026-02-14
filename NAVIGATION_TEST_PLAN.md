# Navigation Test Plan

## Quick Test Guide

Run these tests to verify all navigation works end-to-end.

## Prerequisites

```bash
npm install
npm run dev
```

Then open the app in Expo Go or a simulator.

## Test Suite

### 1. Tab Navigation (Bottom Bar)

**Test**: Tap each tab in the bottom navigation bar

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Tap "Home" tab | Shows dashboard with pets, reminders, quick actions | ⬜ |
| 2 | Tap "Pets" tab | Shows list of pets (Max, Luna) | ⬜ |
| 3 | Tap "Diet" tab | Shows today's meals and nutrition tips | ⬜ |
| 4 | Tap "Care" tab | Shows care categories and upcoming tasks | ⬜ |
| 5 | Tap "Assistant" tab | Shows AI chat interface | ⬜ |
| 6 | Return to "Home" tab | Returns to dashboard | ⬜ |

**Pass Criteria**: All tabs load without errors, active tab is highlighted

---

### 2. Home Screen Navigation

**Test**: Navigate from Home to other screens

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Tap a pet card | Navigates to Pets tab | ⬜ |
| 2 | Return to Home | Back on dashboard | ⬜ |
| 3 | Tap "AI Assistant" quick action | Navigates to Assistant tab | ⬜ |
| 4 | Return to Home | Back on dashboard | ⬜ |
| 5 | Tap "Log Med" quick action | Navigates to Care tab | ⬜ |
| 6 | Return to Home | Back on dashboard | ⬜ |
| 7 | Tap "Schedule" quick action | Navigates to Care tab | ⬜ |
| 8 | Return to Home | Back on dashboard | ⬜ |
| 9 | Tap "Emergency" button | Opens emergency modal | ⬜ |
| 10 | Close modal | Modal closes, stays on Home | ⬜ |

**Pass Criteria**: All navigation works, haptic feedback occurs, no crashes

---

### 3. Pets Screen Navigation

**Test**: Navigate from Pets to Pet Detail

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Go to Pets tab | Shows Max and Luna | ⬜ |
| 2 | Tap Max's card | Opens Max's detail page | ⬜ |
| 3 | Verify Max's info | Shows name, breed, age, weight, medications | ⬜ |
| 4 | Tap back button | Returns to Pets list | ⬜ |
| 5 | Tap Luna's card | Opens Luna's detail page | ⬜ |
| 6 | Verify Luna's info | Shows name, breed, age, weight, medications | ⬜ |
| 7 | Tap back button | Returns to Pets list | ⬜ |

**Pass Criteria**: Pet details load correctly, back navigation works

---

### 4. Pets Quick Actions

**Test**: Test quick action chips on pet cards

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Go to Pets tab | Shows pet cards | ⬜ |
| 2 | Tap "Health" chip on Max | Navigates to Care tab | ⬜ |
| 3 | Return to Pets | Back on Pets list | ⬜ |
| 4 | Tap "Schedule" chip on Max | Navigates to Care tab | ⬜ |
| 5 | Return to Pets | Back on Pets list | ⬜ |
| 6 | Tap "Meds" chip on Luna | Navigates to Care tab | ⬜ |
| 7 | Return to Pets | Back on Pets list | ⬜ |

**Pass Criteria**: All chips navigate to Care tab, haptic feedback works

---

### 5. State Management

**Test**: Verify state updates across navigation

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Go to Home | Note number of reminders | ⬜ |
| 2 | Tap a reminder to complete | Reminder marked complete | ⬜ |
| 3 | Go to Care tab | Same reminder not shown | ⬜ |
| 4 | Return to Home | Reminder count decreased | ⬜ |
| 5 | Go to Diet tab | Note meals completed | ⬜ |
| 6 | Tap "Log as Fed" on a meal | Meal marked complete | ⬜ |
| 7 | Return to Home | State persists | ⬜ |
| 8 | Go back to Diet | Meal still marked complete | ⬜ |

**Pass Criteria**: State updates persist across navigation

---

### 6. Assistant Interaction

**Test**: Test AI Assistant chat

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Go to Assistant tab | Shows welcome message | ⬜ |
| 2 | Tap "🤒 Check symptoms" | Sends message, gets response | ⬜ |
| 3 | Type custom message | Input works | ⬜ |
| 4 | Tap send button | Message sent, AI responds | ⬜ |
| 5 | Scroll through messages | All messages visible | ⬜ |
| 6 | Go to Home and back | Chat history persists | ⬜ |

**Pass Criteria**: Chat works, messages persist, typing indicator shows

---

### 7. Care Task Management

**Test**: Complete care tasks

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Go to Care tab | Shows upcoming tasks | ⬜ |
| 2 | Note task count | Remember number | ⬜ |
| 3 | Tap "Mark Complete" on a task | Task moves to history | ⬜ |
| 4 | Scroll to history section | Task appears in history | ⬜ |
| 5 | Check task count | Decreased by 1 | ⬜ |
| 6 | Go to Home | Reminder count updated | ⬜ |

**Pass Criteria**: Tasks complete, move to history, counts update

---

### 8. Error Handling

**Test**: Test error states

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Manually navigate to `/pet/invalid` | Shows "Pet not found" error | ⬜ |
| 2 | Tap "Go Back" button | Returns to previous screen | ⬜ |
| 3 | Navigate to unknown route | Shows 404 page | ⬜ |
| 4 | Tap "Go to home screen" | Returns to Home tab | ⬜ |

**Pass Criteria**: Error pages display, recovery navigation works

---

### 9. Deep Navigation Flow

**Test**: Complex navigation sequence

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Start on Home | Dashboard visible | ⬜ |
| 2 | Tap pet card → Pets tab | Pets list shown | ⬜ |
| 3 | Tap Max's card | Max detail page | ⬜ |
| 4 | Tap back | Pets list | ⬜ |
| 5 | Tap "Health" chip | Care tab | ⬜ |
| 6 | Complete a task | Task completed | ⬜ |
| 7 | Tap Diet tab | Diet screen | ⬜ |
| 8 | Log a meal | Meal logged | ⬜ |
| 9 | Tap Assistant tab | Assistant screen | ⬜ |
| 10 | Send a message | Message sent | ⬜ |
| 11 | Tap Home tab | Back to dashboard | ⬜ |
| 12 | Verify all changes | All updates visible | ⬜ |

**Pass Criteria**: All navigation works, state persists throughout

---

### 10. Performance & UX

**Test**: User experience quality

| Aspect | Check | Expected | Status |
|--------|-------|----------|--------|
| Load Time | Tab switches | < 100ms | ⬜ |
| Haptics | All button taps | Feedback occurs | ⬜ |
| Animations | Screen transitions | Smooth | ⬜ |
| Scrolling | All scrollable areas | Smooth, no lag | ⬜ |
| Touch Targets | All buttons | Easy to tap | ⬜ |
| Visual Feedback | Button presses | Visible response | ⬜ |

**Pass Criteria**: App feels responsive and polished

---

## Automated Test Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build test (web)
npm run build:web
```

## Common Issues & Solutions

### Issue: "Cannot find module"
**Solution**: Run `npm install` to ensure all dependencies are installed

### Issue: Navigation doesn't work
**Solution**: Restart the dev server with `npm run dev`

### Issue: State doesn't persist
**Solution**: Check that PetProvider wraps the app in `app/_layout.tsx`

### Issue: Haptics don't work
**Solution**: Haptics only work on physical devices, not in web browser

### Issue: Pet detail shows "not found"
**Solution**: Ensure pet ID matches mock data IDs in `data/mockData.ts`

## Test Results Summary

**Date**: _____________

**Tester**: _____________

**Device/Simulator**: _____________

**Results**:
- Tab Navigation: ⬜ Pass ⬜ Fail
- Home Navigation: ⬜ Pass ⬜ Fail
- Pets Navigation: ⬜ Pass ⬜ Fail
- State Management: ⬜ Pass ⬜ Fail
- Assistant: ⬜ Pass ⬜ Fail
- Care Tasks: ⬜ Pass ⬜ Fail
- Error Handling: ⬜ Pass ⬜ Fail
- Deep Navigation: ⬜ Pass ⬜ Fail
- Performance: ⬜ Pass ⬜ Fail

**Overall**: ⬜ Pass ⬜ Fail

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________
