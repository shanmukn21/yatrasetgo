/*
  # Create destinations and admin tables

  1. New Tables
    - destinations
      - id (uuid, primary key)
      - title (text)
      - description (text)
      - image_url (text)
      - location (text)
      - price (float)
      - tags (text[])
      - created_at (timestamp)
    
    - site_statistics
      - id (uuid, primary key)
      - visitors_count (integer)
      - signups_count (integer)
      - trips_completed (integer)
      - date (date)
      - created_at (timestamp)

  2. Security
    - Enable RLS on destinations table
    - Add policies for public read access
    - Add policies for admin write access
*/

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  location text NOT NULL,
  price float NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create site_statistics table
CREATE TABLE IF NOT EXISTS site_statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitors_count integer DEFAULT 0,
  signups_count integer DEFAULT 0,
  trips_completed integer DEFAULT 0,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_statistics ENABLE ROW LEVEL SECURITY;

-- Create admin role
CREATE ROLE admin;

-- Grant admin role to specific user
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'shanmukn21@gmail.com'
  ) THEN
    GRANT admin TO authenticated;
  END IF;
END $$;

-- Destinations policies
CREATE POLICY "Enable read access for all users" ON destinations
  FOR SELECT USING (true);

CREATE POLICY "Enable write access for admins" ON destinations
  FOR ALL
  TO admin
  USING (true)
  WITH CHECK (true);

-- Site statistics policies
CREATE POLICY "Enable read access for admins" ON site_statistics
  FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Enable write access for admins" ON site_statistics
  FOR ALL
  TO admin
  USING (true)
  WITH CHECK (true);