/*
  # Create projects table

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `name` (text, required) - 案件名
      - `description` (text) - 案件の説明
      - `account_id` (uuid, foreign key) - 関連する取引先
      - `status` (text, required) - ステータス（計画中、進行中、完了、中断）
      - `budget` (numeric) - 予算
      - `start_date` (date, required) - 開始日
      - `end_date` (date, required) - 終了予定日
      - `created_at` (timestamptz) - 作成日時
      - `updated_at` (timestamptz) - 更新日時
      - `created_by` (uuid, foreign key) - 作成者

  2. Security
    - Enable RLS on `projects` table
    - Add policies for authenticated users to:
      - Read all projects
      - Create projects (only their own)
      - Update projects (only their own)
      - Delete projects (only their own)

  3. Changes
    - Add foreign key constraints
    - Add default values for timestamps
    - Add trigger for updated_at
*/

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  account_id uuid REFERENCES accounts(id),
  status text NOT NULL,
  budget numeric,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create trigger for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();