import React, { useState } from 'react';
import { Button } from '../../../components/button';
import { ApprovalActionModal } from './approval-action-modal';

interface ApprovalActionsProps {
  onApprove: (comment?: string) => Promise<void>;
  onReject: (comment?: string) => Promise<void>;
}

export const ApprovalActions: React.FC<ApprovalActionsProps> = ({
  onApprove,
  onReject
}) => {
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  return (
    <>
      <div className="flex space-x-2">
        <Button
          onClick={() => setIsApproveModalOpen(true)}
        >
          承認
        </Button>
        <Button
          variant="danger"
          onClick={() => setIsRejectModalOpen(true)}
        >
          却下
        </Button>
      </div>

      <ApprovalActionModal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onSubmit={onApprove}
        action="approve"
      />

      <ApprovalActionModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={onReject}
        action="reject"
      />
    </>
  );
};