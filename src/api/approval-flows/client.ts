import { supabase } from '../client';
import { approvalHistoryApi } from './approval-history';
import { approvalStatusApi } from './status';
import { approvalActionsApi } from './actions';
import type { 
  ApprovalFlowMaster,
  CreateApprovalFlowInput,
  UpdateApprovalFlowInput
} from './types';

export const approvalFlowsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('approval_flow_masters')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('approval_flow_masters')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (input: CreateApprovalFlowInput) => {
    const { data, error } = await supabase
      .from('approval_flow_masters')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, input: UpdateApprovalFlowInput) => {
    const { data, error } = await supabase
      .from('approval_flow_masters')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('approval_flow_masters')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  getHistories: approvalHistoryApi.getHistories,
  getCurrentStatus: approvalStatusApi.getCurrentStatus,
  approve: approvalActionsApi.approve,
  reject: approvalActionsApi.reject
};