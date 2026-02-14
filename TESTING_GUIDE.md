# 🧪 Testing Guide - Pet Care AI

## Overview

This guide covers testing both offline and online modes of the Pet Care AI app.

---

## 🚀 Quick Test (Offline Mode)

### Prerequisites
- Node.js installed
- Expo Go app on your phone

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Start the app
npm start

# 3. Scan QR code with Expo Go
```

### What to Test
- [ ] App loads without errors
- [ ] Can see mock pets (Max and Luna)
- [ ] Can navigate between all tabs
- [ ] Can add a new pet
- [ ] Can view pet details
- [ ] Can add reminders
- [ ] Can track meals
- [ ] Can complete care tasks
- [ ] AI assistant responds (with fallback)
- [ ] Profile screen accessible

---

## 🔐 Full Test (Online Mode)

### Prerequisites
- Completed Supabase setup
- `.env` file configured
- Google OAuth configured

### Authentication Tests

#### Test 1: First Time Sign In
1. Open app
2. Should see login screen
3. Click "Continue with Google"
4. Select Google account
5. Grant permissions
6. Should redirect to app home
7. **Verify**: User appears in Supabase → Authentication → Users

#### Test 2: Session Persistence
1. Sign in successfully
2. Close app completely
3. Reopen app
4. **Expected**: Should go directly to home (no login screen)

#### Test 3: Sign Out
1. Navigate to Profile screen (user icon in home)
2. Click "Sign Out"
3. Confirm sign out
4. **Expected**: Redirected to login screen

#### Test 4: Offline Mode Access
1. On login screen
2. Click "Continue Offline"
3. **Expected**: App works with mock data

---

## 📊 Data Persistence Tests

### Test 1: Add Pet
1. Sign in with Google
2. Go to Pets tab
3. Add a new pet with details
4. Close app completely
5. Reopen app
6. **Verify**: Pet still exists
7. **Verify**: Pet appears in Supabase → Table Editor → pets

### Test 2: Cross-Device Sync
1. Sign in on Device A
2. Add a pet
3. Sign in on Device B (same account)
4. **Expected**: Pet appears on Device B

### Test 3: Update Pet
1. Edit pet details
2. Close and reopen app
3. **Verify**: Changes persisted

### Test 4: Delete Pet
1. Delete a pet
2. Close and reopen app
3. **Verify**: Pet is gone
4. **Verify**: Pet removed from Supabase

---

## 🔒 Security Tests

### Test 1: User Isolation
1. Sign in as User A
2. Add pets
3. Sign out
4. Sign in as User B
5. **Expected**: User B sees NO pets from User A

### Test 2: Unauthorized Access
1. Try accessing Supabase directly without auth
2. **Expected**: RLS policies block access

### Test 3: Token Security
1. Sign in
2. Check AsyncStorage
3. **Verify**: Tokens are stored securely
4. **Verify**: No sensitive data in plain text

---

## 📱 Feature Tests

### Reminders
- [ ] Can add reminder
- [ ] Reminder appears in home screen
- [ ] Can complete reminder
- [ ] Completed reminder disappears
- [ ] Can delete reminder

### Meals
- [ ] Can add meal schedule
- [ ] Can mark meal as fed
- [ ] Can mark meal as skipped
- [ ] Can mark meal as refused
- [ ] Diet alerts appear after patterns

### Care Tasks
- [ ] Can add care task
- [ ] Can complete care task
- [ ] Completed task moves to history
- [ ] Recurring tasks remain after completion

### Vaccines
- [ ] Can add vaccine record
- [ ] Status updates correctly (upcoming/due/overdue)
- [ ] Can mark as completed

### AI Assistant
- [ ] Can send message
- [ ] Receives response
- [ ] Emergency detection works
- [ ] Pet context is used

---

## 🌐 Network Tests

### Test 1: Offline to Online
1. Start in offline mode
2. Configure Supabase
3. Restart app
4. **Expected**: Login screen appears

### Test 2: Online to Offline
1. Start in online mode
2. Disable internet
3. **Expected**: App shows offline banner
4. **Expected**: Can still view cached data

### Test 3: Poor Connection
1. Use slow network
2. Add pet
3. **Expected**: Loading indicators show
4. **Expected**: Operation completes or shows error

---

## 🐛 Error Handling Tests

### Test 1: Invalid Credentials
1. Modify `.env` with wrong credentials
2. Restart app
3. **Expected**: Falls back to offline mode

### Test 2: Network Failure
1. Sign in successfully
2. Disable internet
3. Try to add pet
4. **Expected**: Error message shown
5. **Expected**: App doesn't crash

### Test 3: Database Error
1. Temporarily disable RLS in Supabase
2. Try to access data
3. **Expected**: Graceful error handling

---

## 📊 Performance Tests

### Test 1: Load Time
- [ ] App loads in < 3 seconds
- [ ] Home screen renders quickly
- [ ] No lag when navigating

### Test 2: Large Data Sets
1. Add 10+ pets
2. Add 50+ reminders
3. **Expected**: App remains responsive
4. **Expected**: Lists scroll smoothly

### Test 3: Memory Usage
1. Use app for 10 minutes
2. Navigate between screens
3. **Expected**: No memory leaks
4. **Expected**: App doesn't slow down

---

## 🎨 UI/UX Tests

### Test 1: Navigation
- [ ] All tabs accessible
- [ ] Back button works
- [ ] Deep links work
- [ ] Profile screen accessible

### Test 2: Forms
- [ ] All inputs work
- [ ] Validation shows errors
- [ ] Can submit forms
- [ ] Can cancel forms

### Test 3: Responsive Design
- [ ] Works on small phones
- [ ] Works on tablets
- [ ] Works on different orientations
- [ ] Text is readable

---

## 🔔 Notification Tests

### Test 1: Permission Request
1. First app launch
2. **Expected**: Notification permission requested

### Test 2: Reminder Notifications
1. Add reminder for near future
2. Wait for notification time
3. **Expected**: Notification appears

### Test 3: Notification Actions
1. Tap notification
2. **Expected**: Opens relevant screen

---

## 📸 Camera Tests

### Test 1: Photo Permissions
1. Try to add pet photo
2. **Expected**: Camera permission requested

### Test 2: Take Photo
1. Grant camera permission
2. Take photo
3. **Expected**: Photo appears in pet profile

### Test 3: Select from Gallery
1. Choose existing photo
2. **Expected**: Photo uploads successfully

---

## 🌍 Localization Tests

### Test 1: Date Formats
- [ ] Dates display correctly
- [ ] Times display correctly
- [ ] Relative times work ("2 hours ago")

### Test 2: Time Zones
1. Add reminder
2. Change device timezone
3. **Expected**: Times adjust correctly

---

## 🔄 Migration Tests

### Test 1: Fresh Install
1. Install app
2. Sign in
3. **Expected**: Empty state shown
4. **Expected**: Can add first pet

### Test 2: Reinstall
1. Uninstall app
2. Reinstall app
3. Sign in with same account
4. **Expected**: All data restored

---

## 📋 Checklist: Before Production

### Authentication
- [ ] Google OAuth works
- [ ] Session persists
- [ ] Sign out works
- [ ] Offline mode accessible

### Data
- [ ] CRUD operations work
- [ ] Data persists
- [ ] Cross-device sync works
- [ ] User isolation enforced

### Security
- [ ] RLS policies active
- [ ] Tokens stored securely
- [ ] No data leaks
- [ ] API keys protected

### Performance
- [ ] Fast load times
- [ ] Smooth animations
- [ ] No memory leaks
- [ ] Handles large datasets

### UI/UX
- [ ] All screens accessible
- [ ] Forms work correctly
- [ ] Error messages clear
- [ ] Loading states shown

### Features
- [ ] All features functional
- [ ] Notifications work
- [ ] Camera works
- [ ] AI assistant works

---

## 🐛 Bug Reporting Template

When you find a bug, report it with:

```markdown
**Bug Description:**
Brief description of the issue

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- Device: iPhone 14 / Pixel 7
- OS: iOS 17 / Android 13
- App Version: 2.0.0
- Mode: Online / Offline

**Screenshots:**
Attach if applicable

**Logs:**
Paste relevant error logs
```

---

## 🎯 Test Scenarios

### Scenario 1: New User Journey
1. Download app
2. Sign in with Google
3. Add first pet
4. Set up reminders
5. Track first meal
6. Ask AI assistant question
7. Complete care task

### Scenario 2: Daily Use
1. Open app
2. Check reminders
3. Mark meal as fed
4. Complete medication task
5. Check pet health status
6. Close app

### Scenario 3: Multi-Pet Owner
1. Add 3 pets
2. Set reminders for each
3. Track meals for all
4. View individual pet details
5. Manage care tasks

---

## 📊 Test Results Template

```markdown
## Test Session: [Date]

**Tester:** [Name]
**Device:** [Device Info]
**Mode:** Online / Offline

### Tests Passed: X/Y

#### Authentication
- [x] Sign in works
- [x] Session persists
- [ ] Sign out works (FAILED - see bug #1)

#### Data Operations
- [x] Add pet
- [x] Update pet
- [x] Delete pet

#### Notes:
- Bug #1: Sign out redirects to wrong screen
- Performance is excellent
- UI looks great on this device

**Overall Status:** PASS / FAIL
```

---

## 🚀 Automated Testing (Future)

Consider adding:
- Unit tests with Jest
- Integration tests with Detox
- E2E tests with Maestro
- Visual regression tests

---

## ✅ Final Verification

Before releasing:
- [ ] All critical tests pass
- [ ] No known critical bugs
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Documentation complete
- [ ] Supabase configured correctly
- [ ] Google OAuth working
- [ ] Offline mode functional

---

**Happy Testing!** 🧪
