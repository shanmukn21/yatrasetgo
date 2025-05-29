-- Drop functions that reference site_statistics
DROP FUNCTION IF EXISTS update_trip_statistics CASCADE;
DROP FUNCTION IF EXISTS update_user_statistics CASCADE;

-- Drop triggers that use these functions
DROP TRIGGER IF EXISTS trip_statistics_trigger ON trip_history;
DROP TRIGGER IF EXISTS user_statistics_trigger ON auth.users;

-- Drop policies
DROP POLICY IF EXISTS "Enable read access for admins" ON site_statistics;
DROP POLICY IF EXISTS "Enable write access for admins" ON site_statistics;

-- Drop the table
DROP TABLE IF EXISTS site_statistics CASCADE;