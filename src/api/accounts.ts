import { supabase } from './client';
import type { Account, NewAccount } from './types';

export const accountsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (account: NewAccount) => {
    const { data, error } = await supabase
      .from('accounts')
      .insert(account)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, account: Partial<Account>) => {
    const { data, error } = await supabase
      .from('accounts')
      .update(account)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};