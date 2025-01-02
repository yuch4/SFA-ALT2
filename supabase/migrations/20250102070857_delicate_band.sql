/*
  # Add supplier and cost information to quotation items

  1. Changes
    - Add supplier_id column to quotation_items table
    - Add cost_price column to quotation_items table
    - Add gross_profit column to quotation_items table
    - Add foreign key constraint to suppliers table
    - Update triggers to calculate gross profit automatically

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to quotation_items
ALTER TABLE quotation_items
ADD COLUMN supplier_id uuid REFERENCES suppliers(id),
ADD COLUMN cost_price numeric DEFAULT 0,
ADD COLUMN gross_profit numeric GENERATED ALWAYS AS (amount - (cost_price * quantity)) STORED;

-- Create function to update quotation total amount
CREATE OR REPLACE FUNCTION update_quotation_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the total amount of the quotation
  UPDATE quotations
  SET total_amount = (
    SELECT SUM(amount)
    FROM quotation_items
    WHERE quotation_id = NEW.quotation_id
  )
  WHERE id = NEW.quotation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update totals
DROP TRIGGER IF EXISTS update_quotation_totals ON quotation_items;
CREATE TRIGGER update_quotation_totals
  AFTER INSERT OR UPDATE OR DELETE ON quotation_items
  FOR EACH ROW
  EXECUTE FUNCTION update_quotation_totals();