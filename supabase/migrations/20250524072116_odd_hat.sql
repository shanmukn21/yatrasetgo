/*
  # Create User Management View

  1. New View
    - user_management_view
      - Combines auth.users with trip statistics
      - Provides admin-only access to user data
      - Includes user details and trip counts

  2. Security
    - Create secure view with security barrier
    - Grant access only to admin role
*/

-- Create secure view for user management
CREATE OR REPLACE VIEW user_management_view 
WITH (security_barrier = true)
AS
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

-- Revoke all access by default
REVOKE ALL ON user_management_view FROM PUBLIC;

-- Grant access only to admin role
GRANT SELECT ON user_management_view TO admin;