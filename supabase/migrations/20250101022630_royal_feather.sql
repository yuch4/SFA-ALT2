-- Add user management menu
INSERT INTO menus (name, path, icon, "order")
VALUES ('ユーザー', '/users', 'Users', 60);

-- Get the menu ID and admin role ID
WITH menu_id AS (
  SELECT id FROM menus WHERE path = '/users'
),
admin_role AS (
  SELECT id FROM roles WHERE name = 'admin'
)
-- Grant permissions to admin role
INSERT INTO menu_permissions (role_id, menu_id, can_view, can_edit)
SELECT 
  (SELECT id FROM admin_role),
  (SELECT id FROM menu_id),
  true,
  true;

-- Get user ID for y.hisano@mail.rinnet.co.jp
WITH target_user AS (
  SELECT id FROM users WHERE email = 'y.hisano@mail.rinnet.co.jp'
),
admin_role AS (
  SELECT id FROM roles WHERE name = 'admin'
)
-- Assign admin role if not already assigned
INSERT INTO user_roles (user_id, role_id)
SELECT 
  (SELECT id FROM target_user),
  (SELECT id FROM admin_role)
WHERE EXISTS (SELECT 1 FROM target_user)
ON CONFLICT (user_id, role_id) DO NOTHING;