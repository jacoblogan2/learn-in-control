
-- Create a test admin user directly in the database
-- Note: This bypasses normal signup flow and should only be used for initial setup

-- Insert into auth.users (this is the Supabase auth table)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000'::uuid,
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@school.com',
  crypt('admin123', gen_salt('bf')), -- Password: admin123
  now(),
  now(),
  now(),
  '',
  '{"first_name": "Admin", "last_name": "User", "role": "admin"}'::jsonb
);
