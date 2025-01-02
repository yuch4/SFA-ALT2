export interface ApprovalFlowMaster {
  id: string;
  name: string;
  description: string | null;
  target_type: 'quotation' | 'purchase_order';
  steps: Array<{
    step: number;
    role_id: string;
    required_count: number;
  }>;
  is_active: boolean;
  created_at: string;
  created_by: string;
}

export interface ApprovalHistory {
  id: string;
  flow_id: string;
  target_type: string;
  target_id: string;
  step: number;
  action: 'approve' | 'reject';
  comment: string | null;
  created_at: string;
  created_by: string;
  created_by_user?: {
    email: string;
  };
}

export interface CreateApprovalFlowInput {
  name: string;
  description?: string;
  target_type: 'quotation' | 'purchase_order';
  steps: Array<{
    step: number;
    role_id: string;
    required_count: number;
  }>;
}

export interface UpdateApprovalFlowInput extends Partial<CreateApprovalFlowInput> {
  is_active?: boolean;
}