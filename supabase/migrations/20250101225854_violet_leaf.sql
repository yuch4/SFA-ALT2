/*
  # Fix project activities table and policies

  1. Changes
    - Add proper join support for created_by user information
    - Update RLS policies to be more permissive during development

  2. Security
    - Enable RLS
    - Add policies for CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read all project activities" ON project_activities;
DROP POLICY IF EXISTS "Users can insert their own project activities" ON project_activities;
DROP POLICY IF EXISTS "Users can update their own project activities" ON project_activities;
DROP POLICY IF EXISTS "Users can delete their own project activities" ON project_activities;

-- Create new RLS policies
CREATE POLICY "Users can read all project activities"
  ON project_activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert project activities"
  ON project_activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update project activities"
  ON project_activities FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete project activities"
  ON project_activities FOR DELETE
  TO authenticated
  USING (true);

-- Update the API to properly join with users table
CREATE OR REPLACE VIEW project_activities_with_users AS
SELECT 
  pa.*,
  u.email as created_by_email
FROM project_activities pa
LEFT JOIN users u ON u.id = pa.created_by;

-- Grant access to the view
GRANT SELECT ON project_activities_with_users TO authenticated;