-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can read all quotations" ON quotations;
DROP POLICY IF EXISTS "Users can insert their own quotations" ON quotations;
DROP POLICY IF EXISTS "Users can update their own quotations" ON quotations;
DROP POLICY IF EXISTS "Users can delete their own quotations" ON quotations;
DROP POLICY IF EXISTS "Users can read all quotation items" ON quotation_items;
DROP POLICY IF EXISTS "Users can manage quotation items" ON quotation_items;

-- Create new RLS policies for quotations
CREATE POLICY "Enable read access for authenticated users"
  ON quotations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable write access for authenticated users"
  ON quotations FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON quotations FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON quotations FOR DELETE
  TO authenticated
  USING (true);

-- Create new RLS policies for quotation items
CREATE POLICY "Enable read access for authenticated users"
  ON quotation_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable write access for authenticated users"
  ON quotation_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON quotation_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON quotation_items FOR DELETE
  TO authenticated
  USING (true);