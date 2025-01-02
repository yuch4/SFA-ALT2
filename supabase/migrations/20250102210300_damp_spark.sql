-- Create purchase_orders table
CREATE TABLE purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES suppliers(id) ON DELETE RESTRICT,
  quotation_id uuid REFERENCES quotations(id),
  purchase_order_number text UNIQUE NOT NULL,
  issue_date date NOT NULL,
  delivery_date date,
  status text NOT NULL DEFAULT 'draft',
  notes text,
  total_amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create purchase_order_items table
CREATE TABLE purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id uuid REFERENCES purchase_orders(id) ON DELETE CASCADE,
  quotation_item_id uuid REFERENCES quotation_items(id),
  description text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  amount numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for authenticated users"
  ON purchase_orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable write access for authenticated users"
  ON purchase_orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON purchase_orders FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON purchase_orders FOR DELETE
  TO authenticated
  USING (true);

-- Create RLS policies for items
CREATE POLICY "Enable read access for authenticated users"
  ON purchase_order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable write access for authenticated users"
  ON purchase_order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update access for authenticated users"
  ON purchase_order_items FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Enable delete access for authenticated users"
  ON purchase_order_items FOR DELETE
  TO authenticated
  USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_purchase_order_items_updated_at
  BEFORE UPDATE ON purchase_order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Create indexes
CREATE INDEX purchase_orders_supplier_id_idx ON purchase_orders(supplier_id);
CREATE INDEX purchase_orders_quotation_id_idx ON purchase_orders(quotation_id);
CREATE INDEX purchase_order_items_purchase_order_id_idx ON purchase_order_items(purchase_order_id);
CREATE INDEX purchase_order_items_quotation_item_id_idx ON purchase_order_items(quotation_item_id);

-- Add purchase orders menu
INSERT INTO menus (name, path, icon, "order")
VALUES ('発注', '/purchase-orders', 'ShoppingCart', 27);

-- Grant permissions to admin role
WITH menu_id AS (
  SELECT id FROM menus WHERE path = '/purchase-orders'
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