import { supabase } from '../client';
import { approvalFlowsApi } from '../approval-flows';
import type { Quotation, QuotationItem, QuotationUpdateInput } from './types';

export const quotationsApi = {
  // ... (keep existing methods)

  approve: async (id: string, comment?: string) => {
    // Get current quotation
    const { data: quotation, error: quotationError } = await supabase
      .from('quotations')
      .select('*')
      .eq('id', id)
      .single();

    if (quotationError) throw quotationError;

    await approvalFlowsApi.approve(
      quotation.approval_flow_id,
      'quotation',
      id,
      quotation.current_approval_step,
      comment
    );
  },

  reject: async (id: string, comment?: string) => {
    // Get current quotation
    const { data: quotation, error: quotationError } = await supabase
      .from('quotations')
      .select('*')
      .eq('id', id)
      .single();

    if (quotationError) throw quotationError;

    await approvalFlowsApi.reject(
      quotation.approval_flow_id,
      'quotation',
      id,
      quotation.current_approval_step,
      comment
    );
  }
};