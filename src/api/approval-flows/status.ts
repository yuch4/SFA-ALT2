import { supabase } from '../client';

export const approvalStatusApi = {
  getCurrentStatus: async (flowId: string, targetType: string, targetId: string) => {
    const { data: flow, error: flowError } = await supabase
      .from('approval_flow_masters')
      .select('*')
      .eq('id', flowId)
      .single();
    
    if (flowError) throw flowError;

    const { data: histories, error: historyError } = await supabase
      .from('approval_histories')
      .select('*')
      .eq('flow_id', flowId)
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .order('created_at', { ascending: true });

    if (historyError) throw historyError;

    const hasRejection = histories?.some(h => h.action === 'reject');
    if (hasRejection) {
      return { status: 'rejected', currentStep: null };
    }

    const currentStep = histories?.reduce((step, history) => {
      if (history.action === 'approve') {
        return step + 1;
      }
      return step;
    }, 1);

    const isCompleted = currentStep > flow.steps.length;
    
    return {
      status: isCompleted ? 'approved' : 'pending',
      currentStep: isCompleted ? null : currentStep
    };
  },

  updateStatus: async (targetType: string, targetId: string, status: string, step: number | null) => {
    const { error } = await supabase
      .from(targetType + 's')
      .update({
        approval_status: status,
        current_approval_step: step
      })
      .eq('id', targetId);
    if (error) throw error;
  }
};