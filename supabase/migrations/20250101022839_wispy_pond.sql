/*
  # Add quotation tables

  1. New Tables
    - `quotations`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `quotation_number` (text, unique)
      - `issue_date` (date)
      - `valid_until` (date)
      - `total_amount` (numeric)
      - `status` (text)
      - Timestamps and audit fields

    - `quotation_items`
      - `id` (uuid, primary key)
      - `quotation_id` (uuid, references quotations)
      - `description` (text)
      - `quantity` (numeric)
      - `unit_price` (numeric)
      - `amount` (numeric)
      - `sort_order` (integer)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Create quotations table
CREATE TABLE quotations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  quotation_number text UNIQUE NOT NULL,
  issue_date date NOT NULL,
  valid_until date NOT NULL,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create quotation items table
CREATE TABLE quotation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid REFERENCES quotations(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  amount numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;

-- Quotations policies
CREATE POLICY "Users can read all quotations"
  ON quotations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own quotations"
  ON quotations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own quotations"
  ON quotations FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own quotations"
  ON quotations FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Quotation items policies
CREATE POLICY "Users can read all quotation items"
  ON quotation_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage quotation items"
  ON quotation_items FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM quotations q
    WHERE q.id = quotation_id
    AND q.created_by = auth.uid()
  ));

-- Create triggers for updated_at
CREATE TRIGGER update_quotations_updated_at
  BEFORE UPDATE ON quotations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_quotation_items_updated_at
  BEFORE UPDATE ON quotation_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create indexes
CREATE INDEX quotations_project_id_idx ON quotations(project_id);
CREATE INDEX quotation_items_quotation_id_idx ON quotation_items(quotation_id);