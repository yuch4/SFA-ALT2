/*
  # メニューアクセス制御の実装

  1. 新規テーブル
    - `roles`: ユーザー権限を管理
      - `id` (uuid, primary key)
      - `name` (text): 権限名
      - `description` (text): 説明
      - `created_at` (timestamp)
    
    - `user_roles`: ユーザーと権限の紐付け
      - `user_id` (uuid): ユーザーID
      - `role_id` (uuid): 権限ID
      - `created_at` (timestamp)
    
    - `menus`: メニュー定義
      - `id` (uuid, primary key)
      - `name` (text): メニュー名
      - `path` (text): パス
      - `icon` (text): アイコン名
      - `parent_id` (uuid): 親メニューID
      - `order` (integer): 表示順
      - `created_at` (timestamp)
    
    - `menu_permissions`: メニューと権限の紐付け
      - `role_id` (uuid): 権限ID
      - `menu_id` (uuid): メニューID
      - `can_view` (boolean): 表示権限
      - `can_edit` (boolean): 編集権限
      - `created_at` (timestamp)

  2. セキュリティ
    - 全テーブルでRLSを有効化
    - 適切な参照整合性制約を設定
*/

-- Roles table
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all roles"
  ON roles FOR SELECT
  TO authenticated
  USING (true);

-- User roles table
CREATE TABLE user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Menus table
CREATE TABLE menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  path text NOT NULL,
  icon text NOT NULL,
  parent_id uuid REFERENCES menus(id),
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all menus"
  ON menus FOR SELECT
  TO authenticated
  USING (true);

-- Menu permissions table
CREATE TABLE menu_permissions (
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  menu_id uuid REFERENCES menus(id) ON DELETE CASCADE,
  can_view boolean NOT NULL DEFAULT false,
  can_edit boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (role_id, menu_id)
);

ALTER TABLE menu_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read menu permissions"
  ON menu_permissions FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX user_roles_user_id_idx ON user_roles(user_id);
CREATE INDEX user_roles_role_id_idx ON user_roles(role_id);
CREATE INDEX menus_parent_id_idx ON menus(parent_id);
CREATE INDEX menu_permissions_role_id_idx ON menu_permissions(role_id);
CREATE INDEX menu_permissions_menu_id_idx ON menu_permissions(menu_id);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('admin', '管理者'),
  ('manager', 'マネージャー'),
  ('user', '一般ユーザー');

-- Insert default menus
INSERT INTO menus (name, path, icon, "order") VALUES
  ('取引先', '/accounts', 'Building2', 10),
  ('案件', '/projects', 'Briefcase', 20),
  ('仕入先', '/suppliers', 'Truck', 30),
  ('プロジェクトコード', '/project-codes', 'Tag', 40),
  ('タスク', '/tasks', 'CheckSquare', 50);

-- Grant all permissions to admin role
INSERT INTO menu_permissions (role_id, menu_id, can_view, can_edit)
SELECT 
  r.id as role_id,
  m.id as menu_id,
  true as can_view,
  true as can_edit
FROM roles r
CROSS JOIN menus m
WHERE r.name = 'admin';

-- Grant view permissions to user role
INSERT INTO menu_permissions (role_id, menu_id, can_view, can_edit)
SELECT 
  r.id as role_id,
  m.id as menu_id,
  true as can_view,
  false as can_edit
FROM roles r
CROSS JOIN menus m
WHERE r.name = 'user';