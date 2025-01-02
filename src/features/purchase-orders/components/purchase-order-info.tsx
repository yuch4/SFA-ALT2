import React from 'react';
import { formatDate } from '../../../utils/date';
import { ApprovalStatusBadge } from '../../approval-flows/components/approval-status-badge';
import { ApprovalActions } from '../../approval-flows/components/approval-actions';
import { ApprovalStatus } from '../../approval-flows/components/approval-status';
import type { PurchaseOrder } from '../../../api/purchase-orders';

interface PurchaseOrderInfoProps {
  purchaseOrder: PurchaseOrder;
  onApprove?: (comment?: string) => Promise<void>;
  onReject?: (comment?: string) => Promise<void>;
}

export const PurchaseOrderInfo: React.FC<PurchaseOrderInfoProps> = ({
  purchaseOrder,
  onApprove,
  onReject
}) => (
  <div className="bg-white shadow rounded-lg">
    <div className="px-4 py-5 sm:p-6">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        {/* 既存のフィールドは維持 */}
        <div>
          <dt className="text-sm font-medium text-gray-500">承認状態</dt>
          <dd className="mt-1">
            <ApprovalStatusBadge status={purchaseOrder.approval_status} />
          </dd>
        </div>
        {purchaseOrder.approval_status === 'pending' && onApprove && onReject && (
          <div>
            <dt className="text-sm font-medium text-gray-500">承認アクション</dt>
            <dd className="mt-1">
              <ApprovalActions
                onApprove={onApprove}
                onReject={onReject}
              />
            </dd>
          </div>
        )}
      </dl>

      {purchaseOrder.approval_flow_id && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">承認履歴</h3>
          <ApprovalStatus
            targetType="purchase_order"
            targetId={purchaseOrder.id}
          />
        </div>
      )}
    </div>
  </div>
);