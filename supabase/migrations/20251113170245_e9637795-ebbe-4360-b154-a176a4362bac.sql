-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'alumni', 'student');
CREATE TYPE mentorship_status AS ENUM ('pending', 'active', 'completed', 'cancelled');

-- Create Department table
CREATE TABLE public.department (
  dept_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dept_name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Batch table
CREATE TABLE public.batch (
  batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_year INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  department_id UUID REFERENCES public.department(dept_id) ON DELETE SET NULL,
  batch_id UUID REFERENCES public.batch(batch_id) ON DELETE SET NULL,
  profession TEXT,
  company TEXT,
  phone TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create Event table
CREATE TABLE public.event (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create EventRegistration table
CREATE TABLE public.event_registration (
  reg_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.event(event_id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, alumni_id)
);

-- Create Donation table
CREATE TABLE public.donation (
  donation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  donation_date TIMESTAMPTZ DEFAULT now(),
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create Mentorship table
CREATE TABLE public.mentorship (
  mentor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentee_name TEXT NOT NULL,
  mentee_email TEXT NOT NULL,
  domain TEXT NOT NULL,
  status mentorship_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create JobPost table
CREATE TABLE public.job_post (
  job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumni_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT,
  description TEXT NOT NULL,
  apply_link TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.department ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_post ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Department (public read, admin write)
CREATE POLICY "Anyone can view departments" ON public.department FOR SELECT USING (true);
CREATE POLICY "Only admins can insert departments" ON public.department FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update departments" ON public.department FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete departments" ON public.department FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for Batch (public read, admin write)
CREATE POLICY "Anyone can view batches" ON public.batch FOR SELECT USING (true);
CREATE POLICY "Only admins can insert batches" ON public.batch FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can update batches" ON public.batch FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Only admins can delete batches" ON public.batch FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for Profiles (public read, own profile write)
CREATE POLICY "Anyone can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile" ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for Events (public read, alumni/admin write)
CREATE POLICY "Anyone can view events" ON public.event FOR SELECT USING (true);
CREATE POLICY "Alumni and admins can create events" ON public.event FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('alumni', 'admin'))
);
CREATE POLICY "Event organizers and admins can update events" ON public.event FOR UPDATE USING (
  organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Event organizers and admins can delete events" ON public.event FOR DELETE USING (
  organizer_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for Event Registration
CREATE POLICY "Anyone can view event registrations" ON public.event_registration FOR SELECT USING (true);
CREATE POLICY "Authenticated users can register for events" ON public.event_registration FOR INSERT WITH CHECK (
  auth.uid() = alumni_id
);
CREATE POLICY "Users can delete their own registrations" ON public.event_registration FOR DELETE USING (
  auth.uid() = alumni_id
);

-- RLS Policies for Donations
CREATE POLICY "Anyone can view donations" ON public.donation FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create donations" ON public.donation FOR INSERT WITH CHECK (
  auth.uid() = alumni_id
);

-- RLS Policies for Mentorship
CREATE POLICY "Anyone can view mentorships" ON public.mentorship FOR SELECT USING (true);
CREATE POLICY "Students can request mentorship" ON public.mentorship FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('student', 'alumni'))
);
CREATE POLICY "Mentors and admins can update mentorship status" ON public.mentorship FOR UPDATE USING (
  alumni_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- RLS Policies for Job Posts
CREATE POLICY "Anyone can view active job posts" ON public.job_post FOR SELECT USING (true);
CREATE POLICY "Alumni can create job posts" ON public.job_post FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'alumni')
);
CREATE POLICY "Job posters can update their own posts" ON public.job_post FOR UPDATE USING (
  alumni_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Job posters can delete their own posts" ON public.job_post FOR DELETE USING (
  alumni_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_updated_at BEFORE UPDATE ON public.event
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentorship_updated_at BEFORE UPDATE ON public.mentorship
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_post_updated_at BEFORE UPDATE ON public.job_post
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial data for departments and batches
INSERT INTO public.department (dept_name) VALUES 
  ('Computer Science'),
  ('Electrical Engineering'),
  ('Mechanical Engineering'),
  ('Business Administration'),
  ('Medicine'),
  ('Law');

INSERT INTO public.batch (batch_year) VALUES 
  (2015), (2016), (2017), (2018), (2019), 
  (2020), (2021), (2022), (2023), (2024);