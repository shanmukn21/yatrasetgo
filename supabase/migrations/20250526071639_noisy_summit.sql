/*
  # Create Groups Tables

  1. New Tables
    - groups
      - id (uuid, primary key)
      - name (text)
      - destination_id (uuid, references destinations)
      - creator_id (uuid, references auth.users)
      - start_date (date)
      - end_date (date)
      - max_members (integer)
      - budget (double precision)
      - description (text)
      - created_at (timestamptz)
    
    - group_members
      - id (uuid, primary key)
      - group_id (uuid, references groups)
      - user_id (uuid, references auth.users)
      - joined_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for group management
*/

-- Create groups table
CREATE TABLE groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  destination_id uuid REFERENCES destinations(id) NOT NULL,
  creator_id uuid REFERENCES auth.users(id) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  max_members integer NOT NULL CHECK (max_members > 0),
  budget double precision NOT NULL CHECK (budget > 0),
  description text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Create group_members table
CREATE TABLE group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Enable RLS
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Groups policies
CREATE POLICY "Public can view groups"
  ON groups FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create groups"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their groups"
  ON groups FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id)
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their groups"
  ON groups FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Group members policies
CREATE POLICY "Public can view group members"
  ON group_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can join groups"
  ON group_members FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    (
      SELECT count(*) 
      FROM group_members 
      WHERE group_id = group_members.group_id
    ) < (
      SELECT max_members 
      FROM groups 
      WHERE id = group_members.group_id
    )
  );

CREATE POLICY "Members can leave groups"
  ON group_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to get current members count
CREATE OR REPLACE FUNCTION get_group_members_count(group_id uuid)
RETURNS integer AS $$
BEGIN
  RETURN (
    SELECT count(*)::integer
    FROM group_members
    WHERE group_members.group_id = $1
  );
END;
$$ LANGUAGE plpgsql;