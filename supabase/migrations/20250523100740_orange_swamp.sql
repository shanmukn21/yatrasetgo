/*
  # Admin Role and Statistics Setup

  1. Changes
    - Create admin role
    - Create site_statistics table
    - Set up RLS policies for admin access
    - Add function to create admin users
    - Add specified admin users

  2. Security
    - Enable RLS on site_statistics table
    - Add policies for admin-only access
*/

-- Create admin role if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_roles WHERE rolname = 'admin'
  ) THEN
    CREATE ROLE admin;
  END IF;
END $$;

-- Create site_statistics table if it doesn't exist
CREATE TABLE IF NOT EXISTS site_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitors_count integer DEFAULT 0,
  signups_count integer DEFAULT 0,
  trips_completed integer DEFAULT 0,
  date date DEFAULT CURRENT_DATE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on site_statistics
ALTER TABLE site_statistics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable read access for admins" ON site_statistics;
  DROP POLICY IF EXISTS "Enable write access for admins" ON site_statistics;
END $$;

-- Create policies for admin access to site_statistics
CREATE POLICY "Enable read access for admins" 
  ON site_statistics
  FOR SELECT 
  TO admin 
  USING (true);

CREATE POLICY "Enable write access for admins" 
  ON site_statistics
  FOR ALL 
  TO admin 
  USING (true)
  WITH CHECK (true);

-- Function to create admin user if not exists
CREATE OR REPLACE FUNCTION create_admin_user(email text, password text)
RETURNS void AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Check if user exists
  SELECT id INTO user_id FROM auth.users WHERE auth.users.email = create_admin_user.email;
  
  -- If user doesn't exist, create new user
  IF user_id IS NULL THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      email,
      crypt(password, gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"admin":true}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    RETURNING id INTO user_id;
  END IF;

  -- Grant admin role to user
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = user_id AND raw_user_meta_data->>'admin' = 'true'
  ) THEN
    UPDATE auth.users 
    SET raw_user_meta_data = 
      CASE 
        WHEN raw_user_meta_data IS NULL THEN '{"admin":true}'::jsonb
        ELSE raw_user_meta_data || '{"admin":true}'::jsonb
      END
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add admin users
SELECT create_admin_user('shanmukn21@gmail.com', 'dummy_password');
SELECT create_admin_user('shanmuk670@gmail.com', 'tSt@2468');