-- Drop existing RLS policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON quotations;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON quotations;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON quotations;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON quotations;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON quotation_items;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON quotation_items;
DROP POLICY IF EXISTS "Enable update access for authenticated users" ON quotation_items;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON quotation_items;

-- Create new RLS policies for quotations
CREATE POLICY "Users can read all quotations"
  ON quotations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create quotations"
  ON quotations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update quotations"
  ON quotations FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete quotations"
  ON quotations FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- Create new RLS policies for quotation items
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