/*
  # Add tables for saved destinations and trip history

  1. New Tables
    - saved_destinations
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - destination_id (text)
      - created_at (timestamp)
    
    - trip_history
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - destination_id (text)
      - travel_date (date)
      - status (text) - planned/completed/cancelled
      - notes (text)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
*/

-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS saved_destinations CASCADE;
DROP TABLE IF EXISTS trip_history CASCADE;

-- Create saved_destinations table
CREATE TABLE saved_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  destination_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE saved_destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their saved destinations" ON saved_destinations;
CREATE POLICY "Users can manage their saved destinations"
  ON saved_destinations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trip_history table
CREATE TABLE trip_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  destination_id text NOT NULL,
  travel_date date NOT NULL,
  status text NOT NULL CHECK (status IN ('planned', 'completed', 'cancelled')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trip_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their trip history" ON trip_history;
CREATE POLICY "Users can manage their trip history"
  ON trip_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Add unique constraint to prevent duplicate saves
ALTER TABLE saved_destinations
ADD CONSTRAINT unique_user_destination UNIQUE (user_id, destination_id);