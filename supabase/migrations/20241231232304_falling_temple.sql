/*
  # Add project activities

  1. New Tables
    - `project_activities`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `type` (text) - 活動の種類（note, document, issue, milestone）
      - `title` (text) - 活動のタイトル
      - `description` (text, nullable) - 活動の詳細説明
      - `created_at` (timestamptz) - 作成日時
      - `created_by` (uuid, references auth.users) - 作成者

  2. Security
    - Enable RLS on `project_activities` table
    - Add policies for authenticated users to:
      - Read all activities
      - Create their own activities
      - Update their own activities
      - Delete their own activities
*/

-- Create project_activities table
CREATE TABLE project_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  type text NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE project_activities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all project activities"
  ON project_activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own project activities"
  ON project_activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own project activities"
  ON project_activities FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own project activities"
  ON project_activities FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create index for faster queries
CREATE INDEX project_activities_project_id_idx ON project_activities(project_id);
CREATE INDEX project_activities_created_at_idx ON project_activities(created_at);