/*
  # Update destinations table schema

  1. Changes
    - Add missing columns
    - Update column types
    - Add constraints
*/

-- Update destinations table with missing columns and constraints
ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS name text NOT NULL,
  ADD COLUMN IF NOT EXISTS location text NOT NULL,
  ADD COLUMN IF NOT EXISTS description1 text NOT NULL,
  ADD COLUMN IF NOT EXISTS description2 text,
  ADD COLUMN IF NOT EXISTS price double precision NOT NULL,
  ADD COLUMN IF NOT EXISTS rating double precision DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS category text NOT NULL,
  ADD COLUMN IF NOT EXISTS image_url text NOT NULL,
  ADD COLUMN IF NOT EXISTS best_time text,
  ADD COLUMN IF NOT EXISTS expectations text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Add check constraint for rating
ALTER TABLE destinations
  ADD CONSTRAINT rating_range 
  CHECK (rating >= 0 AND rating <= 5);

-- Add check constraint for valid categories
ALTER TABLE destinations
  ADD CONSTRAINT valid_categories
  CHECK (category IN ('solo', 'friends', 'couples', 'family', 'spiritual', 'adventure'));