/*
  # Initial SFA Database Schema

  1. New Tables
    - `accounts` (取引先)
      - `id` (uuid, primary key)
      - `name` (text) - 取引先名
      - `industry` (text) - 業種
      - `annual_revenue` (numeric) - 年間売上
      - `employee_count` (integer) - 従業員数
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid) - 作成者
      
    - `opportunities` (商談)
      - `id` (uuid, primary key)
      - `account_id` (uuid) - 取引先ID
      - `name` (text) - 商談名
      - `amount` (numeric) - 商談金額
      - `stage` (text) - 商談ステージ
      - `close_date` (date) - 成約予定日
      - `probability` (integer) - 確度
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid) - 作成者

    - `tasks` (タスク)
      - `id` (uuid, primary key)
      - `title` (text) - タスク名
      - `description` (text) - 詳細
      - `due_date` (date) - 期日
      - `status` (text) - ステータス
      - `priority` (text) - 優先度
      - `related_to` (uuid) - 関連レコードID
      - `related_type` (text) - 関連レコードタイプ
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid) - 作成者

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Accounts Table
CREATE TABLE accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text,
  annual_revenue numeric,
  employee_count integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all accounts"
  ON accounts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert accounts"
  ON accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update accounts"
  ON accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Opportunities Table
CREATE TABLE opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id uuid REFERENCES accounts(id),
  name text NOT NULL,
  amount numeric,
  stage text NOT NULL,
  close_date date,
  probability integer CHECK (probability >= 0 AND probability <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all opportunities"
  ON opportunities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert opportunities"
  ON opportunities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update opportunities"
  ON opportunities FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Tasks Table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  due_date date,
  status text NOT NULL,
  priority text NOT NULL,
  related_to uuid,
  related_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();