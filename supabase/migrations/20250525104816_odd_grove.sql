/*
  # Add View Counts for Destinations

  1. Changes
    - Add views column to destinations table
    - Create function to increment views
    - Add index for sorting by views

  2. Security
    - Maintain existing RLS policies
    - Add function security
*/

-- Add views column to destinations table
ALTER TABLE destinations
ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;

-- Create function to increment views
CREATE OR REPLACE FUNCTION increment_destination_views(destination_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE destinations
  SET views = views + 1
  WHERE id = destination_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create index for efficient sorting by views
CREATE INDEX IF NOT EXISTS destinations_views_idx ON destinations(views DESC);