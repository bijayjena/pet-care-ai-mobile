-- Pet Care AI - Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (User profiles)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- PETS TABLE
-- ============================================
CREATE TABLE pets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('dog', 'cat')),
  photo_uri TEXT,
  breed TEXT,
  age INTEGER,
  weight NUMERIC,
  microchip TEXT,
  allergies TEXT[], -- Array of strings
  conditions TEXT[], -- Array of strings
  vet_contact JSONB, -- Store vet contact as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for pets
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pets"
  ON pets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pets"
  ON pets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets"
  ON pets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets"
  ON pets FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- MEDICATIONS TABLE
-- ============================================
CREATE TABLE medications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage medications for own pets"
  ON medications FOR ALL
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = medications.pet_id AND pets.user_id = auth.uid()
  ));

-- ============================================
-- REMINDERS TABLE
-- ============================================
CREATE TABLE reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('medication', 'appointment', 'grooming', 'vaccination', 'other')),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage reminders for own pets"
  ON reminders FOR ALL
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = reminders.pet_id AND pets.user_id = auth.uid()
  ));

-- ============================================
-- MEALS TABLE
-- ============================================
CREATE TABLE meals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  time TEXT NOT NULL,
  food TEXT NOT NULL,
  amount TEXT NOT NULL,
  calories INTEGER,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('fed', 'skipped', 'refused')),
  feedback TEXT,
  portion_adjustment TEXT CHECK (portion_adjustment IN ('ate-all', 'ate-some', 'ate-none')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage meals for own pets"
  ON meals FOR ALL
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = meals.pet_id AND pets.user_id = auth.uid()
  ));

-- ============================================
-- CARE TASKS TABLE
-- ============================================
CREATE TABLE care_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('medication', 'grooming', 'vaccination', 'wellness', 'hygiene', 'appointment')),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  recurring_frequency TEXT CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE care_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage care tasks for own pets"
  ON care_tasks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = care_tasks.pet_id AND pets.user_id = auth.uid()
  ));

-- ============================================
-- CARE HISTORY TABLE
-- ============================================
CREATE TABLE care_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE care_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage care history for own pets"
  ON care_history FOR ALL
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = care_history.pet_id AND pets.user_id = auth.uid()
  ));

-- ============================================
-- VACCINES TABLE
-- ============================================
CREATE TABLE vaccines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'due', 'overdue', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage vaccines for own pets"
  ON vaccines FOR ALL
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = vaccines.pet_id AND pets.user_id = auth.uid()
  ));

-- ============================================
-- DEWORMING RECORDS TABLE
-- ============================================
CREATE TABLE deworming_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('upcoming', 'due', 'overdue', 'completed')),
  weight NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE deworming_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage deworming records for own pets"
  ON deworming_records FOR ALL
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = deworming_records.pet_id AND pets.user_id = auth.uid()
  ));

-- ============================================
-- DIET ALERTS TABLE
-- ============================================
CREATE TABLE diet_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('repeated-refusal', 'repeated-partial', 'repeated-skip')),
  severity TEXT NOT NULL CHECK (severity IN ('warning', 'urgent')),
  message TEXT NOT NULL,
  occurrences INTEGER NOT NULL,
  last_occurrence TIMESTAMP WITH TIME ZONE NOT NULL,
  dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE diet_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage diet alerts for own pets"
  ON diet_alerts FOR ALL
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = diet_alerts.pet_id AND pets.user_id = auth.uid()
  ));

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON pets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_medications_pet_id ON medications(pet_id);
CREATE INDEX idx_reminders_pet_id ON reminders(pet_id);
CREATE INDEX idx_reminders_due_date ON reminders(due_date);
CREATE INDEX idx_meals_pet_id ON meals(pet_id);
CREATE INDEX idx_meals_scheduled_date ON meals(scheduled_date);
CREATE INDEX idx_care_tasks_pet_id ON care_tasks(pet_id);
CREATE INDEX idx_care_tasks_due_date ON care_tasks(due_date);
CREATE INDEX idx_care_history_pet_id ON care_history(pet_id);
CREATE INDEX idx_vaccines_pet_id ON vaccines(pet_id);
CREATE INDEX idx_deworming_records_pet_id ON deworming_records(pet_id);
CREATE INDEX idx_diet_alerts_pet_id ON diet_alerts(pet_id);

-- ============================================
-- GRANT PERMISSIONS
-- ============================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
