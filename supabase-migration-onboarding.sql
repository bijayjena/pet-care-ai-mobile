-- Migration: Add Onboarding Tracking to Profiles
-- Run this in your Supabase SQL Editor if you already have the database set up

-- Add onboarding fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Update existing users to mark onboarding as completed
-- (Assumes existing users have already used the app)
UPDATE profiles 
SET onboarding_completed = true,
    onboarding_completed_at = NOW()
WHERE onboarding_completed IS NULL OR onboarding_completed = false;

-- Verify the migration
SELECT id, email, onboarding_completed, onboarding_completed_at 
FROM profiles 
LIMIT 10;
