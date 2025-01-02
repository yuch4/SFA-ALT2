export type MenuPermission = {
  id: string;
  menu_id: string;
  role_id: string;
  can_view: boolean;
  can_edit: boolean;
  created_at: string;
};

export type UserRole = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

export type MenuItem = {
  id: string;
  name: string;
  path: string;
  icon: string;
  parent_id: string | null;
  order: number;
  created_at: string;
};