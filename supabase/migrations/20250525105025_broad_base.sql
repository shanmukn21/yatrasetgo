/*
  # Add views column to destinations table

  1. Changes
    - Add `views` column to `destinations` table if it doesn't exist
    - Set default value to 0 for new records
    - Update existing records to have 0 views if column is added

  2. Notes
    - Uses a safe migration approach that checks if column exists before adding
    - Maintains data integrity by providing a default value
*/

DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'destinations' 
    AND column_name = 'views'
  ) THEN 
    ALTER TABLE destinations ADD COLUMN views integer DEFAULT 0;
  END IF;
END $$;