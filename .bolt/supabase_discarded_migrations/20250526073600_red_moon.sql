/*
  # Drop Groups Tables

  1. Changes
    - Drop group_members table
    - Drop groups table
    - Remove all related policies and functions
*/

-- Drop group_members table and its policies
DROP TABLE IF EXISTS group_members CASCADE;

-- Drop groups table and its policies
DROP TABLE IF EXISTS groups CASCADE;

-- Drop related functions
DROP FUNCTION IF EXISTS get_group_members_count CASCADE;