-- Add quotations menu
INSERT INTO menus (name, path, icon, "order")
VALUES ('見積', '/quotations', 'FileText', 25);

-- Get the menu ID and admin role ID
WITH menu_id AS (
  SELECT id FROM menus WHERE path = '/quotations'
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