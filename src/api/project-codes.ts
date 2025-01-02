import { supabase } from './client';
import type { ProjectCode, NewProjectCode } from './types';

export const projectCodesApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('project_codes')
      .select('*')
      .order('code', { ascending: true });
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('project_codes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (projectCode: NewProjectCode) => {
    const { data, error } = await supabase
      .from('project_codes')
      .insert(projectCode)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, projectCode: Partial<ProjectCode>) => {
    const { data, error } = await supabase
      .from('project_codes')
      .update(projectCode)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('project_codes')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};