-- Create approval_flow_masters table
CREATE TABLE approval_flow_masters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  target_type text NOT NULL, -- 'quotation' or 'purchase_order'
  steps jsonb NOT NULL, -- Array of {step: number, role_id: uuid, required_count: number}
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create approval_histories table
CREATE TABLE approval_histories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id uuid REFERENCES approval_flow_masters(id),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  step integer NOT NULL,
  action text NOT NULL, -- 'approve' or 'reject'
  comment text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE approval_flow_masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_histories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
  ON approval_flow_masters FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable write access for authenticated users"
  ON approval_flow_masters FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON approval_flow_masters FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON approval_flow_masters FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for histories
CREATE POLICY "Enable read access for authenticated users"
  ON approval_histories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable write access for authenticated users"
  ON approval_histories FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes
CREATE INDEX approval_flow_masters_target_type_idx ON approval_flow_masters(target_type);
CREATE INDEX approval_histories_target_type_target_id_idx ON approval_histories(target_type, target_id);
CREATE INDEX approval_histories_flow_id_idx ON approval_histories(flow_id);

-- Add approval_flow_id and status columns to quotations and purchase_orders
ALTER TABLE quotations ADD COLUMN approval_flow_id uuid REFERENCES approval_flow_masters(id);
ALTER TABLE quotations ADD COLUMN approval_status text DEFAULT 'pending';
ALTER TABLE quotations ADD COLUMN current_approval_step integer DEFAULT 1;

ALTER TABLE purchase_orders ADD COLUMN approval_flow_id uuid REFERENCES approval_flow_masters(id);
ALTER TABLE purchase_orders ADD COLUMN approval_status text DEFAULT 'pending';
ALTER TABLE purchase_orders ADD COLUMN current_approval_step integer DEFAULT 1;

-- Add approval flow management menu
INSERT INTO menus (name, path, icon, "order")
VALUES ('承認フロー', '/approval-flows', 'CheckCircle', 70);

-- Grant permissions to admin role
WITH menu_id AS (
  SELECT id FROM menus WHERE path = '/approval-flows'
),
admin_role AS (
  SELECT id FROM roles WHERE name = 'admin'
)
INSERT INTO menu_permissions (role_id, menu_id, can_view, can_edit)
SELECT 
  (SELECT id FROM admin_role),
  (SELECT id FROM menu_id),
  true,
  true;