/*
  # Create User Management View

  1. New View
    - user_management_view
      - Combines auth.users with trip statistics
      - Provides admin-only access to user data
*/

-- Create view for user management
CREATE OR REPLACE VIEW user_management_view AS
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name' as full_name,
  au.created_at as joined_at,
  au.last_sign_in_at,
  COUNT(DISTINCT th.id) as total_trips,
  COUNT(DISTINCT CASE WHEN th.status = 'completed' THEN th.id END) as completed_trips
FROM auth.users au
LEFT JOIN trip_history th ON au.id = th.user_id
GROUP BY au.id, au.email, au.raw_user_meta_data, au.created_at, au.last_sign_in_at;

-- Enable RLS on the view
ALTER VIEW user_management_view ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Enable admin access to user management"
  ON user_management_view
  FOR SELECT
  TO admin
  USING (true);