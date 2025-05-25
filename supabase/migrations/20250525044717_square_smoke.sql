/*
  # Fix Storage Permissions for Destination Images

  1. Changes
    - Create destination_images bucket if not exists
    - Set up proper public access policies
    - Enable anonymous access for image viewing
*/

-- Create storage bucket for destination images if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'destination_images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('destination_images', 'destination_images', true);
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;

-- Create policy for public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'destination_images');

-- Create policy for authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'destination_images');

-- Create policy for admin to delete images
CREATE POLICY "Admin can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'destination_images' 
  AND auth.jwt() ->> 'email' = 'shanmukn21@gmail.com'
);

-- Update bucket to be public
UPDATE storage.buckets
SET public = true
WHERE id = 'destination_images';