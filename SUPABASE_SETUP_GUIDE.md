# 🚀 Supabase Setup Guide - Pet Care AI

This guide will walk you through setting up Supabase with Google OAuth authentication for your Pet Care AI app.

## 📋 Prerequisites

- A Google account
- A Supabase account (free tier works fine)
- Node.js and npm installed
- Expo CLI installed

---

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in the details:
   - **Organization**: Select or create one
   - **Project Name**: `pet-care-ai` (or your preferred name)
   - **Database Password**: Create a strong password (save it securely!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is sufficient for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be provisioned

---

## Step 2: Get Supabase Credentials

1. In your Supabase dashboard, navigate to **Settings** (gear icon) → **API**
2. You'll see two important values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
3. Keep this tab open - you'll need these values later

---

## Step 3: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the `supabase-schema.sql` file from your project root
4. Copy the entire contents and paste into the SQL Editor
5. Click **"Run"** or press `Ctrl/Cmd + Enter`
6. You should see "Success. No rows returned" - this is correct!
7. Verify tables were created:
   - Go to **Table Editor** (left sidebar)
   - You should see tables: `profiles`, `pets`, `medications`, `reminders`, `meals`, etc.

---

## Step 4: Configure Google OAuth

### 4.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one:
   - Click the project dropdown at the top
   - Click **"New Project"**
   - Name it `pet-care-ai`
   - Click **"Create"**

3. Enable Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click on it and click **"Enable"**

4. Configure OAuth Consent Screen:
   - Go to **APIs & Services** → **OAuth consent screen**
   - Select **"External"** (unless you have a Google Workspace)
   - Click **"Create"**
   - Fill in required fields:
     - **App name**: Pet Care AI
     - **User support email**: Your email
     - **Developer contact**: Your email
   - Click **"Save and Continue"**
   - Skip "Scopes" (click **"Save and Continue"**)
   - Add test users if needed (your email)
   - Click **"Save and Continue"**

5. Create OAuth 2.0 Client ID:
   - Go to **APIs & Services** → **Credentials**
   - Click **"Create Credentials"** → **"OAuth 2.0 Client ID"**
   - Application type: **"Web application"**
   - Name: `Pet Care AI Web Client`
   - **Authorized redirect URIs**: Add this URL (replace with your project ref):
     ```
     https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
     ```
     Example: `https://abcdefghijklmn.supabase.co/auth/v1/callback`
   - Click **"Create"**
   - Copy the **Client ID** and **Client Secret** (you'll need these next)

### 4.2 Configure Google Provider in Supabase

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and click to expand
3. Toggle **"Enable Sign in with Google"** to ON
4. Fill in the credentials from Google Cloud Console:
   - **Client ID**: Paste from Google Cloud Console
   - **Client Secret**: Paste from Google Cloud Console
5. Copy the **Callback URL** shown (should match what you added to Google)
6. Click **"Save"**

---

## Step 5: Configure Your App

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Open `.env` and fill in your credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key-here
   EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
   ```

3. Replace the placeholders:
   - `EXPO_PUBLIC_SUPABASE_URL`: From Step 2
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: From Step 2
   - `EXPO_PUBLIC_GEMINI_API_KEY`: (Optional) Get from [Google AI Studio](https://aistudio.google.com/app/apikey)

4. Update `app.json` with your Supabase project ID:
   ```json
   "extra": {
     "eas": {
       "projectId": "your-supabase-project-id"
     }
   }
   ```

---

## Step 6: Test Your Setup

1. Stop your Expo development server if running (Ctrl+C)

2. Clear cache and restart:
   ```bash
   npm start -- --clear
   ```

3. Open the app on your device/emulator

4. You should see the login screen with:
   - "Continue with Google" button
   - "Continue Offline" option

5. Test Google Sign In:
   - Click "Continue with Google"
   - Select your Google account
   - Grant permissions
   - You should be redirected back to the app
   - Check Supabase dashboard → Authentication → Users to see your account

6. Test Data Persistence:
   - Add a pet
   - Close and reopen the app
   - Your pet should still be there (stored in Supabase!)

---

## 🔧 Troubleshooting

### "Supabase is not configured" message
- Check that your `.env` file exists and has the correct values
- Restart your Expo server after creating/modifying `.env`
- Make sure variables start with `EXPO_PUBLIC_`

### Google Sign In fails
- Verify redirect URI in Google Cloud Console matches Supabase callback URL exactly
- Check that Google+ API is enabled in Google Cloud Console
- Ensure OAuth consent screen is configured
- Try adding your email as a test user

### "Invalid API key" error
- Double-check you copied the **anon/public** key, not the service_role key
- Verify the key in Supabase Settings → API

### Tables not created
- Re-run the SQL schema in Supabase SQL Editor
- Check for error messages in the SQL Editor
- Verify you're in the correct project

### App crashes after login
- Check Expo logs for errors
- Verify all tables were created successfully
- Try clearing app data and cache

---

## 🎯 Next Steps

Once setup is complete:

1. **Test all features**:
   - Add pets, reminders, meals
   - Complete tasks
   - Test AI assistant (if Gemini API key configured)

2. **Invite team members**:
   - Go to Supabase Settings → Team
   - Invite collaborators

3. **Monitor usage**:
   - Check Supabase Dashboard for database usage
   - Monitor authentication logs

4. **Deploy to production**:
   - See `docs/deployment/BUILD_CONFIG.md` for build instructions
   - Update OAuth redirect URIs for production domain

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Google](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)

---

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase logs: Dashboard → Logs
3. Check Expo logs in terminal
4. Verify all steps were completed in order
5. Try the offline mode to isolate the issue

---

## ✅ Verification Checklist

Before considering setup complete, verify:

- [ ] Supabase project created
- [ ] Database schema executed successfully
- [ ] All tables visible in Table Editor
- [ ] Google OAuth credentials created
- [ ] Google provider enabled in Supabase
- [ ] `.env` file created with correct values
- [ ] App shows login screen
- [ ] Google Sign In works
- [ ] User appears in Supabase Authentication
- [ ] Can add and persist data
- [ ] Data syncs across devices (if testing on multiple devices)

---

**Congratulations!** 🎉 Your Pet Care AI app is now connected to Supabase with Google OAuth authentication!
