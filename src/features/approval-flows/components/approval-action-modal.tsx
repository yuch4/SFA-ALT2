import React, { useState } from 'react';
import { Modal } from '../../../components/modal';
import { Form, FormField, TextArea } from '../../../components/form';
import { Button } from '../../../components/button';

interface ApprovalActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment?: string) => void;
  action: 'approve' | 'reject';
}

export const ApprovalActionModal: React.FC<ApprovalActionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  action
}) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setLoading(true);
      await onSubmit(formData.get('comment') as string);
      onClose();
    } catch (error) {
      console.error('Failed to submit approval action:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={action === 'approve' ? '承認' : '却下'}
    >
      <Form onSubmit={handleSubmit}>
        <FormField label="コメント">
          <TextArea
            name="comment"
            rows={3}
            placeholder={`${action === 'approve' ? '承認' : '却下'}理由を入力してください`}
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
            variant={action === 'approve' ? 'primary' : 'danger'}
            isLoading={loading}
          >
            {action === 'approve' ? '承認する' : '却下する'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};