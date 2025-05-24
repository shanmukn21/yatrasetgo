/*
  # Update destinations table with expanded fields

  1. Changes
    - Add new columns for expanded destination information
    - Add constraints and defaults
    - Update RLS policies
  
  2. New Fields
    - name (text, unique)
    - rating (float)
    - description1 (text)
    - description2 (text)
    - best_time (text)
    - category (text)
    - expectations (text[])
*/

-- Update destinations table with new fields
ALTER TABLE destinations
ADD COLUMN IF NOT EXISTS name text UNIQUE NOT NULL,
ADD COLUMN IF NOT EXISTS rating float CHECK (rating >= 0 AND rating <= 5),
ADD COLUMN IF NOT EXISTS description1 text,
ADD COLUMN IF NOT EXISTS description2 text,
ADD COLUMN IF NOT EXISTS best_time text,
ADD COLUMN IF NOT EXISTS category text,
ADD COLUMN IF NOT EXISTS expectations text[] DEFAULT '{}';

-- Create storage bucket for destination images
INSERT INTO storage.buckets (id, name)
VALUES ('destinations', 'destinations')
ON CONFLICT DO NOTHING;

-- Update RLS policies for storage
CREATE POLICY "Public users can view destination images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'destinations');

CREATE POLICY "Only authenticated users can upload destination images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'destinations');

CREATE POLICY "Only admin can delete destination images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'destinations' AND auth.email() = 'shanmukn21@gmail.com');