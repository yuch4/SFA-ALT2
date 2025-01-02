/*
  # Fix update_updated_at function
  
  1. Changes
    - Create update_updated_at function before it's used by triggers
    - This function is used by multiple tables to automatically update the updated_at timestamp
*/

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;