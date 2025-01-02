import { supabase } from './supabase';

export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role_id: string;
  created_at: string;
}

export const rolesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name');
    if (error) throw error;
    return data;
  },

  getUserRoles: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        role_id,
        roles (
          id,
          name,
          description
        )
      `)
      .eq('user_id', userId);
    if (error) throw error;
    return data;
  },

  assignRole: async (userId: string, roleId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role_id: roleId });
    if (error) throw error;
  },

  removeRole: async (userId: string, roleId: string) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId);
    if (error) throw error;
  }
};