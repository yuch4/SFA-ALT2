-- ダッシュボードメニューの追加
WITH new_menu AS (
  INSERT INTO menus (name, path, icon, parent_id, "order")
  VALUES ('ダッシュボード', '/', 'LayoutDashboard', NULL, 0)
  RETURNING id
)

-- 全ロールにダッシュボードの閲覧権限を付与
INSERT INTO menu_permissions (menu_id, role_id, can_view, can_edit)
SELECT 
  new_menu.id,
  roles.id,
  true,
  CASE 
    WHEN roles.name = 'admin' THEN true
    ELSE false
  END
FROM new_menu
CROSS JOIN roles
ON CONFLICT (menu_id, role_id) DO UPDATE
SET can_view = EXCLUDED.can_view,
    can_edit = EXCLUDED.can_edit; 