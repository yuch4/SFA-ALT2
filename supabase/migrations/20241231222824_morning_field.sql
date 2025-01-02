/*
  # Create project codes management table

  1. New Tables
    - `project_codes`
      - `id` (uuid, primary key)
      - `code` (text, required) - プロジェクトコード
      - `name` (text, required) - プロジェクト名
      - `category` (text) - カテゴリ
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, foreign key)

  2. Changes
    - Add project_code_id reference to projects table

  3. Security
    - Enable RLS on `project_codes` table
    - Add policies for authenticated users
*/

-- Create project_codes table
CREATE TABLE project_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Add reference to projects table
ALTER TABLE projects ADD COLUMN project_code_id uuid REFERENCES project_codes(id);

-- Enable RLS
ALTER TABLE project_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all project codes"
  ON project_codes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert project codes"
  ON project_codes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update project codes"
  ON project_codes FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete project codes"
  ON project_codes FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create trigger for updated_at
CREATE TRIGGER update_project_codes_updated_at
  BEFORE UPDATE ON project_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();