import type { Database } from '../types/supabase';

// Account関連の型定義
export type Account = Database['public']['Tables']['accounts']['Row'];
export type NewAccount = Database['public']['Tables']['accounts']['Insert'];

// Project関連の型定義
export type Project = Database['public']['Tables']['projects']['Row'];
export type NewProject = Database['public']['Tables']['projects']['Insert'];

// Supplier関連の型定義
export type Supplier = Database['public']['Tables']['suppliers']['Row'];
export type NewSupplier = Database['public']['Tables']['suppliers']['Insert'];

// ProjectCode関連の型定義
export type ProjectCode = Database['public']['Tables']['project_codes']['Row'];
export type NewProjectCode = Database['public']['Tables']['project_codes']['Insert'];

// Task関連の型定義
export type Task = Database['public']['Tables']['tasks']['Row'];
export type NewTask = Database['public']['Tables']['tasks']['Insert'];

// ProjectActivity関連の型定義
export type ProjectActivity = Database['public']['Tables']['project_activities']['Row'] & {
  created_by_email?: string;
};
export type NewProjectActivity = Database['public']['Tables']['project_activities']['Insert'];