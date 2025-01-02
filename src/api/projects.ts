import { supabase } from './client';
import type { Project, NewProject, ProjectActivity } from './types';

export const projectsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        accounts(name),
        project_codes(code, name)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        accounts(name),
        project_codes(code, name)
      `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (project: NewProject) => {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, project: Partial<Project>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  getActivities: async (projectId: string) => {
    const { data, error } = await supabase
      .from('project_activities_with_users')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  addActivity: async (activity: ProjectActivity) => {
    const { data, error } = await supabase
      .from('project_activities')
      .insert(activity)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};