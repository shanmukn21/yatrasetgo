/*
  # Add foreign key relationship between users and groups tables

  1. Changes
    - Add foreign key constraint between groups.creator_id and auth.users.id
    - This enables proper joins between groups and users tables

  2. Security
    - No changes to RLS policies
*/

ALTER TABLE groups
ADD CONSTRAINT groups_creator_id_fkey
FOREIGN KEY (creator_id) REFERENCES auth.users(id);