
-- Create profiles table with proper structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email text NOT NULL,
  first_name text,
  last_name text,
  role text NOT NULL DEFAULT 'student',
  registration_number text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to handle new user creation and profile setup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta_role text;
  meta_first text;
  meta_last text;
BEGIN
  -- Extract metadata from auth.users
  meta_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'student');
  meta_first := NEW.raw_user_meta_data ->> 'first_name';
  meta_last := NEW.raw_user_meta_data ->> 'last_name';

  -- Insert into profiles table
  INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    meta_first,
    meta_last,
    meta_role
  )
  ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert a test admin user profile if it doesn't exist
INSERT INTO public.profiles (user_id, email, first_name, last_name, role)
SELECT 
  id, 
  email, 
  'Admin', 
  'User', 
  'admin'
FROM auth.users 
WHERE email = 'admin@school.com'
ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  first_name = 'Admin',
  last_name = 'User',
  updated_at = now();
