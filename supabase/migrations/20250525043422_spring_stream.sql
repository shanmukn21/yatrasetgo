/*
  # Add Triggers for Statistics Updates

  1. New Functions
    - update_trip_statistics(): Updates trip counts when trip status changes
    - update_user_statistics(): Updates user counts on registration/deletion
    
  2. New Triggers
    - trip_history_trigger: Fires on trip status changes
    - user_statistics_trigger: Fires on user changes
*/

-- Function to update trip statistics
CREATE OR REPLACE FUNCTION update_trip_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Create today's statistics record if it doesn't exist
  INSERT INTO site_statistics (date)
  VALUES (CURRENT_DATE)
  ON CONFLICT (date) DO NOTHING;

  -- Update trip counts based on status change
  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'completed' THEN
      UPDATE site_statistics 
      SET trips_completed = trips_completed + 1
      WHERE date = CURRENT_DATE;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
      UPDATE site_statistics 
      SET trips_completed = trips_completed + 1
      WHERE date = CURRENT_DATE;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user statistics
CREATE OR REPLACE FUNCTION update_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
  -- Create today's statistics record if it doesn't exist
  INSERT INTO site_statistics (date)
  VALUES (CURRENT_DATE)
  ON CONFLICT (date) DO NOTHING;

  -- Update user counts
  IF TG_OP = 'INSERT' THEN
    UPDATE site_statistics 
    SET signups_count = signups_count + 1
    WHERE date = CURRENT_DATE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trip_history_trigger ON trip_history;
DROP TRIGGER IF EXISTS user_statistics_trigger ON auth.users;

-- Create trigger for trip history updates
CREATE TRIGGER trip_history_trigger
  AFTER INSERT OR UPDATE
  ON trip_history
  FOR EACH ROW
  EXECUTE FUNCTION update_trip_statistics();

-- Create trigger for user statistics updates
CREATE TRIGGER user_statistics_trigger
  AFTER INSERT
  ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_statistics();

-- Add unique constraint on date to prevent duplicate records
ALTER TABLE site_statistics
ADD CONSTRAINT unique_date UNIQUE (date);

-- Initialize statistics for today if they don't exist
INSERT INTO site_statistics (date)
VALUES (CURRENT_DATE)
ON CONFLICT (date) DO NOTHING;