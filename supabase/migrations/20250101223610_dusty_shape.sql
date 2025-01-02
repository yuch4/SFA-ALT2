-- Drop existing RLS policies
DROP POLICY IF EXISTS "Users can read all accounts" ON accounts;
DROP POLICY IF EXISTS "Users can insert accounts" ON accounts;
DROP POLICY IF EXISTS "Users can update accounts" ON accounts;

-- Create new RLS policies
CREATE POLICY "Users can read all accounts"
  ON accounts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert accounts"
  ON accounts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update accounts"
  ON accounts FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete accounts"
  ON accounts FOR DELETE
  TO authenticated
  USING (true);