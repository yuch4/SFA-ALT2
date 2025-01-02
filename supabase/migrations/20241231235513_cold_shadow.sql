/*
  # Assign admin role to existing users
  
  1. Changes
    - Assigns admin role to all existing users
    - Ensures no duplicate role assignments
*/

-- Assign admin role to existing users
WITH admin_role AS (
  SELECT id FROM roles WHERE name = 'admin'
)
INSERT INTO user_roles (user_id, role_id)
SELECT 
  u.id as user_id,
  (SELECT id FROM admin_role) as role_id
FROM users u
ON CONFLICT (user_id, role_id) DO NOTHING;