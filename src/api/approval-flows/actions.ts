import { supabase } from '../client';
import { approvalHistoryApi } from './approval-history';
import { approvalStatusApi } from './status';

export const approvalActionsApi = {
  approve: async (flowId: string, targetType: string, targetId: string, step: number, comment?: string) => {
    const { data: flow } = await supabase
      .from('approval_flow_masters')
      .select('*')
      .eq('id', flowId)
      .single();

    if (!flow) throw new Error('Approval flow not found');

    await approvalHistoryApi.create({
      flow_id: flowId,
      target_type: targetType,
      target_id: targetId,
      step,
      action: 'approve',
      comment
    });

    const isLastStep = step === flow.steps.length;
    const newStatus = isLastStep ? 'approved' : 'pending';
    const newStep = isLastStep ? null : step + 1;

    await approvalStatusApi.updateStatus(targetType, targetId, newStatus, newStep);
  },

  reject: async (flowId: string, targetType: string, targetId: string, step: number, comment?: string) => {
    await approvalHistoryApi.create({
      flow_id: flowId,
      target_type: targetType,
      target_id: targetId,
      step,
      action: 'reject',
      comment
    });

    await approvalStatusApi.updateStatus(targetType, targetId, 'rejected', null);
  }
};