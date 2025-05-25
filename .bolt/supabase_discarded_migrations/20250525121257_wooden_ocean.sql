/*
  # Update Categories System

  1. Changes
    - Add new categories
    - Modify destinations table to support multiple categories
    - Update existing constraints
    
  2. Security
    - Maintain existing RLS policies
*/

-- First, alter the destinations table to change category to categories
ALTER TABLE destinations 
DROP CONSTRAINT IF EXISTS valid_categories;

ALTER TABLE destinations 
RENAME COLUMN category TO categories;

ALTER TABLE destinations 
ALTER COLUMN categories TYPE text[] USING ARRAY[categories];

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