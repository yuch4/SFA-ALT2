
import React, { useState } from 'react';
import { Modal } from '../../../components/modal';
import { Form, FormField, Select, TextArea } from '../../../components/form';
import { Button } from '../../../components/button';
import { useData } from '../../../hooks/useData';
import { approvalFlowsApi } from '../../../api/approval-flows';

interface SelectApprovalFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (flowId: string, comment?: string) => void;
  targetType: 'quotation' | 'purchase_order';
}

export const SelectApprovalFlowModal: React.FC<SelectApprovalFlowModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  targetType
}) => {
  const [loading, setLoading] = useState(false);

  const { data: flows } = useData({
    fetchFn: approvalFlowsApi.getAll
  });

  const availableFlows = flows?.filter(
    flow => flow.target_type === targetType && flow.is_active
  ) || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setLoading(true);
      onSubmit(
        formData.get('flow_id') as string,
        formData.get('comment') as string
      );
    } catch (error) {
      console.error('Failed to submit approval:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="承認申請"
    >
      <Form onSubmit={handleSubmit}>
        <FormField label="承認フロー" required>
          <Select
            name="flow_id"
            required
            options={[
              { value: '', label: '選択してください' },
              ...availableFlows.map(flow => ({
                value: flow.id,
                label: flow.name
              }))
            ]}
          />
        </FormField>

        <FormField label="コメント">
          <TextArea
            name="comment"
            rows={3}
            placeholder="承認申請に関するコメントを入力してください"
          />
        </FormField>

        <div className="mt-4 flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            isLoading={loading}
          >
            申請
          </Button>
        </div>
      </Form>
    </Modal>
  );
};