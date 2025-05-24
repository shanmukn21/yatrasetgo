/*
  # Update destinations table structure
  
  1. Changes
    - Remove title column
    - Reorder columns to put name first
    - Ensure all constraints are preserved
*/

-- First ensure we have a name for all rows before dropping title
UPDATE destinations 
SET name = title 
WHERE name IS NULL AND title IS NOT NULL;

-- Drop the title column
ALTER TABLE destinations 
DROP COLUMN IF EXISTS title;

-- Recreate the table with desired column order
CREATE TABLE new_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  description1 text NOT NULL,
  description2 text,
  price double precision NOT NULL,
  rating double precision DEFAULT 0.0,
  category text NOT NULL,
  image_url text NOT NULL,
  best_time text,
  expectations text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5),
  CONSTRAINT valid_categories CHECK (category IN ('solo', 'friends', 'couples', 'family', 'spiritual', 'adventure'))
);

-- Copy data to new table
INSERT INTO new_destinations 
SELECT id, name, location, description1, description2, price, rating, category, image_url, best_time, expectations, created_at
FROM destinations;

-- Drop old table and rename new one
DROP TABLE destinations;
ALTER TABLE new_destinations RENAME TO destinations;

-- Recreate RLS policies
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON destinations
  FOR SELECT USING (true);

CREATE POLICY "Enable write access for admins" ON destinations
  FOR ALL
  TO admin
  USING (true)
  WITH CHECK (true);