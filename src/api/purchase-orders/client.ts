
// 既存のimportとコードは維持

export const purchaseOrdersApi = {
  // 既存のメソッドは維持

  requestApproval: async (id: string, flowId: string, comment?: string) => {
    const { error } = await supabase
      .from('purchase_orders')
      .update({
        approval_flow_id: flowId,
        approval_status: 'pending',
        current_approval_step: 1
      })
      .eq('id', id);

    if (error) throw error;

    // 承認履歴を作成
    const { error: historyError } = await supabase
      .from('approval_histories')
      .insert({
        flow_id: flowId,
        target_type: 'purchase_order',
        target_id: id,
        step: 1,
        action: 'request',
        comment
      });

    if (historyError) throw historyError;
  },

  approve: async (id: string, comment?: string) => {
    const { data: purchaseOrder, error: purchaseOrderError } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (purchaseOrderError) throw purchaseOrderError;

    // 承認履歴を作成
    const { error: historyError } = await supabase
      .from('approval_histories')
      .insert({
        flow_id: purchaseOrder.approval_flow_id,
        target_type: 'purchase_order',
        target_id: id,
        step: purchaseOrder.current_approval_step,
        action: 'approve',
        comment
      });

    if (historyError) throw historyError;

    // ステータスを更新
    const { error: updateError } = await supabase
      .from('purchase_orders')
      .update({
        current_approval_step: purchaseOrder.current_approval_step + 1,
        approval_status: 'approved'
      })
      .eq('id', id);

    if (updateError) throw updateError;
  },

  reject: async (id: string, comment?: string) => {
    const { data: purchaseOrder, error: purchaseOrderError } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('id', id)
      .single();

    if (purchaseOrderError) throw purchaseOrderError;

    // 承認履歴を作成
    const { error: historyError } = await supabase
      .from('approval_histories')
      .insert({
        flow_id: purchaseOrder.approval_flow_id,
        target_type: 'purchase_order',
        target_id: id,
        step: purchaseOrder.current_approval_step,
        action: 'reject',
        comment
      });

    if (historyError) throw historyError;

    // ステータスを更新
    const { error: updateError } = await supabase
      .from('purchase_orders')
      .update({
        approval_status: 'rejected'
      })
      .eq('id', id);

    if (updateError) throw updateError;
  }
};