/*
  # Add quotation history tracking

  1. New Tables
    - `quotation_histories` - 見積書の変更履歴を保存
      - `id` (uuid, primary key)
      - `quotation_id` (uuid, references quotations)
      - `action` (text) - 変更の種類（create/update/delete）
      - `changes` (jsonb) - 変更内容
      - `created_at` (timestamptz)
      - `created_by` (uuid, references auth.users)

  2. Security
    - Enable RLS on new table
    - Add policies for authenticated users
*/

-- Create quotation histories table
CREATE TABLE quotation_histories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id uuid REFERENCES quotations(id) ON DELETE CASCADE,
  action text NOT NULL,
  changes jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE quotation_histories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
  ON quotation_histories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable write access for authenticated users"
  ON quotation_histories FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to track changes
CREATE OR REPLACE FUNCTION track_quotation_changes()
RETURNS TRIGGER AS $$
DECLARE
  changes jsonb;
  action text;
BEGIN
  IF TG_OP = 'INSERT' THEN
    action := 'create';
    changes := to_jsonb(NEW.*);
  ELSIF TG_OP = 'UPDATE' THEN
    action := 'update';
    changes := jsonb_build_object(
      'old', to_jsonb(OLD.*),
      'new', to_jsonb(NEW.*)
    );
  ELSIF TG_OP = 'DELETE' THEN
    action := 'delete';
    changes := to_jsonb(OLD.*);
  END IF;

  INSERT INTO quotation_histories (
    quotation_id,
    action,
    changes,
    created_by
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    action,
    changes,
    auth.uid()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER track_quotation_changes
  AFTER INSERT OR UPDATE OR DELETE ON quotations
  FOR EACH ROW
  EXECUTE FUNCTION track_quotation_changes();

-- Create index for better performance
CREATE INDEX quotation_histories_quotation_id_idx ON quotation_histories(quotation_id);
CREATE INDEX quotation_histories_created_at_idx ON quotation_histories(created_at);