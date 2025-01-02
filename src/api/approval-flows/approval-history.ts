import { supabase } from '../client';
import type { ApprovalHistory } from './types';

export const approvalHistoryApi = {
  getHistories: async (targetType: string, targetId: string) => {
    const { data, error } = await supabase
      .from('approval_histories')
      .select(`
        *,
        created_by_user:users!created_by(email)
      `)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data;
  },

  create: async (history: Omit<ApprovalHistory, 'id' | 'created_at' | 'created_by'>) => {
    const { error } = await supabase
      .from('approval_histories')
      .insert(history);
    if (error) throw error;
  }
};