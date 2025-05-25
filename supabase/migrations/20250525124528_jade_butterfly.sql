/*
  # Update Categories System

  1. Changes
    - Convert single category to array of categories
    - Update existing data to match new constraints
    - Add check constraint for valid categories
    
  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity during migration
*/

-- First, create a temporary column for the new categories
ALTER TABLE destinations 
ADD COLUMN categories_new text[] DEFAULT '{}'::text[];

-- Map existing categories to valid values and copy to new array column
UPDATE destinations 
SET categories_new = ARRAY[
  CASE category
    WHEN 'solo' THEN 'solo'
    WHEN 'friends' THEN 'friends'
    WHEN 'couples' THEN 'couple'
    WHEN 'family' THEN 'family'
    WHEN 'spiritual' THEN 'pilgrimage'
    WHEN 'adventure' THEN 'adventure'
    ELSE 'adventure'
  END
];

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