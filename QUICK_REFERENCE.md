# 🚀 Quick Reference - Pet Care AI with Supabase

## 📋 Setup Checklist

### 1. Supabase Project
- [ ] Create project at [supabase.com](https://supabase.com)
- [ ] Copy Project URL and anon key
- [ ] Run `supabase-schema.sql` in SQL Editor

### 2. Google OAuth
- [ ] Create project in [Google Cloud Console](https://console.cloud.google.com)
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 Client ID
- [ ] Add redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
- [ ] Configure in Supabase → Authentication → Providers

### 3. App Configuration
- [ ] Copy `.env.example` to `.env`
- [ ] Add Supabase URL and anon key
- [ ] (Optional) Add Gemini API key
- [ ] Run `npm install`
- [ ] Run `npm start -- --clear`

---

## 🔑 Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
EXPO_PUBLIC_GEMINI_API_KEY=AIza... (optional)
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `lib/supabase.ts` | Supabase client setup |
| `contexts/AuthContext.tsx` | Authentication logic |
| `contexts/PetContext.supabase.tsx` | Data management |
| `services/supabaseService.ts` | Database operations |
| `app/login.tsx` | Login screen |
| `supabase-schema.sql` | Database schema |

---

## 🗄️ Database Tables

1. **profiles** - User profiles
2. **pets** - Pet information
3. **medications** - Pet medications
4. **reminders** - Care reminders
5. **meals** - Meal tracking
6. **care_tasks** - Tasks & appointments
7. **care_history** - Completed care
8. **vaccines** - Vaccination records
9. **deworming_records** - Deworming tracking
10. **diet_alerts** - Diet pattern alerts

---

## 🔐 Authentication Flow

```
User clicks "Sign in with Google"
    ↓
Redirect to Google OAuth
    ↓
User grants permissions
    ↓
Redirect back to app
    ↓
Supabase creates session
    ↓
Profile auto-created in DB
    ↓
User accesses their data
```

---

## 🛠️ Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Clear cache and start
npm start -- --clear

# Run setup script
setup-supabase.bat

# Build for production
eas build --platform all

# Check for errors
npm run typecheck
```

---

## 🐛 Troubleshooting

### "Supabase is not configured"
→ Create `.env` file with credentials and restart

### Google sign-in fails
→ Check redirect URI matches exactly in Google Console

### Data not saving
→ Verify user is authenticated and RLS policies are correct

### "Invalid API key"
→ Use anon/public key, not service_role key

---

## 📊 App Modes

### Online Mode
- ✅ Supabase configured
- ✅ User authenticated
- ✅ Data in cloud
- ✅ Syncs across devices

### Offline Mode
- ✅ No Supabase needed
- ✅ No authentication
- ✅ Uses mock data
- ✅ Perfect for testing

---

## 🔗 Important URLs

| Resource | URL |
|----------|-----|
| Supabase Dashboard | https://supabase.com/dashboard |
| Google Cloud Console | https://console.cloud.google.com |
| Google AI Studio | https://aistudio.google.com/app/apikey |
| Supabase Docs | https://supabase.com/docs |
| Expo Docs | https://docs.expo.dev |

---

## 📱 Testing Checklist

- [ ] Google sign-in works
- [ ] User appears in Supabase Auth
- [ ] Can add pets
- [ ] Can add reminders
- [ ] Can track meals
- [ ] Data persists after restart
- [ ] Sign out works
- [ ] Offline mode accessible

---

## 🎯 Next Steps After Setup

1. Test authentication flow
2. Add your first pet
3. Create some reminders
4. Test AI assistant (if Gemini configured)
5. Test on multiple devices
6. Deploy to production

---

## 📞 Support Resources

- **Setup Guide**: `SUPABASE_SETUP_GUIDE.md`
- **Migration Info**: `MIGRATION_SUMMARY.md`
- **Full Docs**: `docs/README.md`
- **Troubleshooting**: `docs/getting-started/TROUBLESHOOTING.md`

---

## ⚡ Quick Tips

1. Always restart Expo after changing `.env`
2. Use anon key, not service_role key
3. Test offline mode first if having issues
4. Check Supabase logs for errors
5. Verify RLS policies if data access fails

---

## 🎉 You're Ready!

Once setup is complete:
- Users can sign in with Google
- Data is stored securely in Supabase
- Everything syncs across devices
- App is production-ready!

**Happy coding!** 🚀
