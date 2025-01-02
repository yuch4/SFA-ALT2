import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Form, FormField, Input, TextArea } from '../../components/form';
import { Button } from '../../components/button';
import { useData } from '../../hooks/useData';
import { purchaseOrdersApi } from '../../api/purchase-orders';
import { ApprovalRequestModal } from '../approval-flows/components/approval-request-modal';

// ... 既存のコードは維持 ...

export const PurchaseOrderEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [savedData, setSavedData] = useState<any>(null);

  // ... 既存のuseDataフックは維持 ...

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, requestApproval = false) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      issue_date: formData.get('issue_date') as string,
      delivery_date: formData.get('delivery_date') as string,
      notes: formData.get('notes') as string,
      items
    };

    try {
      await purchaseOrdersApi.update(id!, data);
      if (requestApproval) {
        setSavedData(data);
        setIsApprovalModalOpen(true);
      } else {
        navigate(`/purchase-orders/${id}`);
      }
    } catch (error) {
      console.error('Failed to update purchase order:', error);
    }
  };

  const handleApprovalRequest = async (flowId: string, comment?: string) => {
    try {
      await purchaseOrdersApi.requestApproval(id!, flowId, comment);
      navigate(`/purchase-orders/${id}`);
    } catch (error) {
      console.error('Failed to request approval:', error);
    }
  };

  // ... 既存のコードは維持 ...

  return (
    <div className="space-y-6">
      {/* ... 既存のJSXは維持 ... */}

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <Form onSubmit={handleSubmit}>
            {/* ... 既存のフォームフィールドは維持 ... */}

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/purchase-orders/${id}`)}
              >
                キャンセル
              </Button>
              <Button 
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e as any, false);
                }}
              >
                保存
              </Button>
              <Button 
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(e as any, true);
                }}
              >
                保存して申請
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <ApprovalRequestModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onSubmit={handleApprovalRequest}
        targetType="purchase_order"
      />
    </div>
  );
};