/*
  # Create suppliers management tables

  1. New Tables
    - `suppliers`
      - `id` (uuid, primary key)
      - `name` (text, required) - 仕入先名
      - `code` (text) - 仕入先コード
      - `contact_person` (text) - 担当者名
      - `email` (text) - メールアドレス
      - `phone` (text) - 電話番号
      - `address` (text) - 住所
      - `payment_terms` (text) - 支払条件
      - `notes` (text) - 備考
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, foreign key)

  2. Security
    - Enable RLS on `suppliers` table
    - Add policies for authenticated users
*/

CREATE TABLE suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text,
  contact_person text,
  email text,
  phone text,
  address text,
  payment_terms text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all suppliers"
  ON suppliers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert suppliers"
  ON suppliers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update suppliers"
  ON suppliers FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete suppliers"
  ON suppliers FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON suppliers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();