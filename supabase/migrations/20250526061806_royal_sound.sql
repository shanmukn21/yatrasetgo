/*
  # Update destinations table schema

  1. Changes
    - Add missing columns with appropriate defaults
    - Update column types
    - Add constraints
    - Handle existing data

  2. Security
    - Maintain data integrity while adding NOT NULL constraints
*/

-- First add columns without NOT NULL constraint
ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS description1 text,
  ADD COLUMN IF NOT EXISTS description2 text,
  ADD COLUMN IF NOT EXISTS price double precision,
  ADD COLUMN IF NOT EXISTS rating double precision DEFAULT 0.0,
  ADD COLUMN IF NOT EXISTS category text DEFAULT 'adventure',
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS best_time text,
  ADD COLUMN IF NOT EXISTS expectations text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Update any existing NULL values with defaults
UPDATE destinations SET
  name = COALESCE(name, 'Unnamed Destination'),
  location = COALESCE(location, 'Unknown Location'),
  description1 = COALESCE(description1, 'No description available'),
  price = COALESCE(price, 0.0),
  category = COALESCE(category, 'adventure'),
  image_url = COALESCE(image_url, 'https://images.pexels.com/photos/2387871/pexels-photo-2387871.jpeg');

-- Now add NOT NULL constraints
ALTER TABLE destinations
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN location SET NOT NULL,
  ALTER COLUMN description1 SET NOT NULL,
  ALTER COLUMN price SET NOT NULL,
  ALTER COLUMN category SET NOT NULL,
  ALTER COLUMN image_url SET NOT NULL;

-- Add check constraint for rating
ALTER TABLE destinations
  ADD CONSTRAINT rating_range 
  CHECK (rating >= 0 AND rating <= 5);

-- Add check constraint for valid categories
ALTER TABLE destinations
  ADD CONSTRAINT valid_categories
  CHECK (category IN ('solo', 'friends', 'couples', 'family', 'spiritual', 'adventure'));