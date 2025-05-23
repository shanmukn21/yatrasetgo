/*
  # Update Destinations Table Schema

  1. Changes
    - Add new fields to destinations table
    - Update existing fields with better constraints
    - Add storage for images

  2. Security
    - Enable RLS policies for the new fields
    - Set up storage bucket permissions
*/

-- Create storage bucket for destination images if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'destination_images'
  ) THEN
    INSERT INTO storage.buckets (id, name)
    VALUES ('destination_images', 'destination_images');
  END IF;
END $$;

-- Update destinations table
ALTER TABLE destinations
  ADD COLUMN IF NOT EXISTS description1 text,
  ADD COLUMN IF NOT EXISTS description2 text,
  ADD COLUMN IF NOT EXISTS best_time text,
  ADD COLUMN IF NOT EXISTS expectations text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS rating float DEFAULT 0.0,
  ALTER COLUMN price TYPE float USING price::float,
  ALTER COLUMN image_url SET DATA TYPE text;

-- Add storage bucket policy
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'destination_images');

CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'destination_images');