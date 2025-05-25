/*
  # Fix User Destinations Schema

  1. Changes
    - Update saved_destinations table to use destination UUID
    - Add foreign key constraints
    - Update trip_history table schema
    - Add triggers for statistics updates

  2. Security
    - Maintain RLS policies
    - Add proper constraints
*/

-- Update saved_destinations table
ALTER TABLE saved_destinations
DROP CONSTRAINT IF EXISTS saved_destinations_destination_id_fkey;

ALTER TABLE saved_destinations
ALTER COLUMN destination_id TYPE uuid USING destination_id::uuid;

ALTER TABLE saved_destinations
ADD CONSTRAINT saved_destinations_destination_id_fkey 
FOREIGN KEY (destination_id) REFERENCES destinations(id);

-- Update trip_history table
ALTER TABLE trip_history
DROP CONSTRAINT IF EXISTS trip_history_destination_id_fkey;

ALTER TABLE trip_history
ALTER COLUMN destination_id TYPE uuid USING destination_id::uuid;

ALTER TABLE trip_history
ADD CONSTRAINT trip_history_destination_id_fkey 
FOREIGN KEY (destination_id) REFERENCES destinations(id);

-- Create function to update trip statistics
CREATE OR REPLACE FUNCTION update_trip_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update completed trips count
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE site_statistics
    SET trips_completed = trips_completed + 1
    WHERE date = CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for trip statistics
DROP TRIGGER IF EXISTS trip_statistics_trigger ON trip_history;
CREATE TRIGGER trip_statistics_trigger
  AFTER UPDATE OF status
  ON trip_history
  FOR EACH ROW
  EXECUTE FUNCTION update_trip_statistics();