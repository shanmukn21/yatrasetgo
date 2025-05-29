/*
  # Update Destinations Categories Schema

  1. Changes
    - Convert single category to array of categories
    - Update existing data to comply with new constraints
    - Add check constraint for valid categories
    
  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity during migration
*/

-- First, create a temporary column for the new categories
ALTER TABLE destinations 
ADD COLUMN categories_new text[] DEFAULT '{}'::text[];

-- Copy existing category data to the new array column
UPDATE destinations 
SET categories_new = ARRAY[category];

-- Drop the old constraint
ALTER TABLE destinations 
DROP CONSTRAINT IF EXISTS valid_categories;

-- Drop the old column and rename the new one
ALTER TABLE destinations 
DROP COLUMN category;

ALTER TABLE destinations 
RENAME COLUMN categories_new TO categories;

-- Add check constraint for valid categories
ALTER TABLE destinations
ADD CONSTRAINT valid_categories CHECK (
  categories <@ ARRAY[
    'solo', 'couple', 'friends', 'group', 'family',
    'adventure', 'fun', 'nature', 'architecture', 
    'historical', 'pilgrimage'
  ]::text[]
);

-- Set default for categories
ALTER TABLE destinations 
ALTER COLUMN categories SET DEFAULT '{}'::text[];