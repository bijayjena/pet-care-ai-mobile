# Testing Checklist - Pet Care AI v1.1.0

## Pre-Testing Setup

- [ ] Database schema updated (`supabase-schema.sql` or migration script)
- [ ] `.env` file configured with Supabase credentials
- [ ] Dependencies installed (`npm install`)
- [ ] App cache cleared (`npx expo start -c`)

## 1. New User Flow

### Sign Up
- [ ] Open app for first time
- [ ] See login screen
- [ ] Click "Sign Up"
- [ ] Enter valid email and password
- [ ] Sign up succeeds
- [ ] No errors in console

### Onboarding - Welcome
- [ ] See welcome screen with app features
- [ ] "Start" button is visible and clickable
- [ ] Features list displays correctly
- [ ] UI is responsive

### Onboarding - Photo
- [ ] See photo upload screen
- [ ] "Take Photo" button visible
- [ ] "Skip for now" button works
- [ ] "Continue" button works
- [ ] Step indicator shows "1 of 3"

### Onboarding - Name
- [ ] See name input screen
- [ ] Can type pet name
- [ ] "Continue" disabled when empty
- [ ] "Continue" enabled when name entered
- [ ] "Back" button works
- [ ] Step indicator shows "2 of 3"

### Onboarding - Type
- [ ] See pet type selection
- [ ] Can select "Dog"
- [ ] Can select "Cat"
- [ ] Selection highlights correctly
- [ ] "Continue" disabled when nothing selected
- [ ] "Continue" enabled when type selected
- [ ] "Back" button works
- [ ] Step indicator shows "3 of 3"

### Onboarding - Complete
- [ ] See completion screen
- [ ] "Get Started" button visible
- [ ] Loading indicator shows during save
- [ ] Redirects to main app
- [ ] Pet appears in pets list
- [ ] No errors in console

### Data Persistence
- [ ] Close app completely
- [ ] Reopen app
- [ ] Sign in with same credentials
- [ ] Onboarding is skipped
- [ ] Pet data is still there
- [ ] No duplicate pets created

## 2. Existing User Flow

### Sign In
- [ ] Open app
- [ ] See login screen
- [ ] Enter existing credentials
- [ ] Sign in succeeds
- [ ] Onboarding is skipped
- [ ] Redirects directly to main app

### Data Loading
- [ ] All pets load correctly
- [ ] Reminders load correctly
- [ ] Meals load correctly
- [ ] Care tasks load correctly
- [ ] No mock data appears
- [ ] Loading states show appropriately

## 3. Main App Features

### Home Screen
- [ ] Pet overview displays
- [ ] Health score shows
- [ ] Quick stats are accurate
- [ ] Navigation works

### Pets Screen
- [ ] All pets listed
- [ ] Can view pet details
- [ ] Can add new pet
- [ ] Can edit pet
- [ ] Can delete pet
- [ ] Changes persist

### Care Screen
- [ ] Care tasks listed
- [ ] Can add care task
- [ ] Can complete care task
- [ ] Can delete care task
- [ ] Vaccines section works
- [ ] Deworming section works
- [ ] Care history shows

### Diet Screen
- [ ] Today's meals show
- [ ] Can mark meal as fed
- [ ] Can mark meal as skipped
- [ ] Can mark meal as refused
- [ ] Meal status updates
- [ ] Diet alerts appear when appropriate

### Assistant Screen
- [ ] AI assistant loads
- [ ] Can send messages
- [ ] Responses appear
- [ ] No errors

## 4. Error Handling

### Network Errors
- [ ] Disconnect internet
- [ ] Try to load data
- [ ] Error message appears
- [ ] App doesn't crash
- [ ] Reconnect internet
- [ ] Data loads successfully

### Invalid Input
- [ ] Try to submit empty forms
- [ ] Validation messages appear
- [ ] Can't submit invalid data
- [ ] Error messages are clear

### Database Errors
- [ ] Invalid Supabase credentials
- [ ] Appropriate error message
- [ ] App doesn't crash
- [ ] Can recover after fixing credentials

## 5. Authentication

### Sign Out
- [ ] Can sign out from profile
- [ ] Redirects to login screen
- [ ] Data is cleared from memory
- [ ] Can sign back in

### Session Persistence
- [ ] Close app while signed in
- [ ] Reopen app
- [ ] Still signed in
- [ ] No need to re-authenticate

### Multiple Accounts
- [ ] Sign out
- [ ] Sign in with different account
- [ ] See different user's data
- [ ] No data leakage between accounts

## 6. Performance

### Loading Times
- [ ] App starts in < 3 seconds
- [ ] Data loads in < 2 seconds
- [ ] Navigation is smooth
- [ ] No lag when scrolling

### Memory Usage
- [ ] No memory leaks
- [ ] App doesn't slow down over time
- [ ] Can use app for extended period

## 7. UI/UX

### Responsiveness
- [ ] Works on different screen sizes
- [ ] Portrait orientation works
- [ ] Landscape orientation works (if supported)
- [ ] Touch targets are adequate size

### Accessibility
- [ ] Screen reader compatible
- [ ] Proper labels on buttons
- [ ] Good color contrast
- [ ] Text is readable

### Visual Polish
- [ ] No UI glitches
- [ ] Animations are smooth
- [ ] Colors are consistent
- [ ] Typography is consistent

## 8. Edge Cases

### Empty States
- [ ] New user with no pets
- [ ] No reminders set
- [ ] No meals scheduled
- [ ] Empty states show helpful messages

### Data Limits
- [ ] Can add many pets (10+)
- [ ] Can add many reminders (50+)
- [ ] App handles large datasets
- [ ] Performance remains good

### Concurrent Actions
- [ ] Add pet while loading data
- [ ] Complete task while syncing
- [ ] No race conditions
- [ ] Data stays consistent

## 9. Platform-Specific

### iOS
- [ ] App icon displays correctly
- [ ] Splash screen shows
- [ ] Notifications work
- [ ] Camera permissions work
- [ ] No iOS-specific crashes

### Android
- [ ] App icon displays correctly
- [ ] Adaptive icon works
- [ ] Splash screen shows
- [ ] Notifications work
- [ ] Camera permissions work
- [ ] Back button works correctly
- [ ] No Android-specific crashes

### Web (if applicable)
- [ ] App loads in browser
- [ ] All features work
- [ ] Responsive design works
- [ ] No web-specific issues

## 10. Security

### Data Privacy
- [ ] Users can only see their own data
- [ ] RLS policies enforced
- [ ] No unauthorized access
- [ ] Sensitive data not logged

### Authentication Security
- [ ] Passwords not visible
- [ ] Session tokens secure
- [ ] Auto-logout after timeout (if implemented)
- [ ] No security warnings in console

## 11. Regression Testing

### Previous Features
- [ ] All v1.0.0 features still work
- [ ] No features broken by update
- [ ] Existing user data not affected

## 12. Database

### Schema
- [ ] All tables created
- [ ] Indexes working
- [ ] RLS policies active
- [ ] Triggers functioning

### Data Integrity
- [ ] Foreign keys enforced
- [ ] No orphaned records
- [ ] Cascading deletes work
- [ ] Data types correct

## Test Results

### Pass/Fail Summary
- Total Tests: ___
- Passed: ___
- Failed: ___
- Blocked: ___

### Critical Issues
1. 
2. 
3. 

### Minor Issues
1. 
2. 
3. 

### Notes
- 
- 
- 

## Sign-Off

- [ ] All critical tests passed
- [ ] All blockers resolved
- [ ] Ready for production

**Tested By**: _______________
**Date**: _______________
**Version**: v1.1.0
**Platform**: iOS / Android / Web
**Device**: _______________
