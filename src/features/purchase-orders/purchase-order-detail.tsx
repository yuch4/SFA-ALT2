import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from '../../components/modal';
import { Button } from '../../components/button';
import { useData } from '../../hooks/useData';
import { purchaseOrdersApi } from '../../api/purchase-orders';
import { PurchaseOrderHeader } from './components/purchase-order-header';
import { PurchaseOrderInfo } from './components/purchase-order-info';
import { PurchaseOrderItems } from './components/purchase-order-items';

export const PurchaseOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: purchaseOrder, loading, refetch } = useData({
    fetchFn: () => purchaseOrdersApi.getById(id!),
    dependencies: [id]
  });

  const { data: items } = useData({
    fetchFn: () => purchaseOrdersApi.getItems(id!),
    dependencies: [id]
  });

  const handleApprove = async (comment?: string) => {
    try {
      await purchaseOrdersApi.approve(id!, comment);
      refetch();
    } catch (error) {
      console.error('Failed to approve purchase order:', error);
    }
  };

  const handleReject = async (comment?: string) => {
    try {
      await purchaseOrdersApi.reject(id!, comment);
      refetch();
    } catch (error) {
      console.error('Failed to reject purchase order:', error);
    }
  };

  if (loading || !purchaseOrder) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <PurchaseOrderHeader
        purchaseOrder={purchaseOrder}
        onEdit={() => navigate(`/purchase-orders/${id}/edit`)}
        onDelete={() => setIsDeleting(true)}
        onBack={() => navigate(-1)}
      />

      <PurchaseOrderInfo
        purchaseOrder={purchaseOrder}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {items && <PurchaseOrderItems items={items} />}

      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="発注書を削除"
      >
        <p className="text-sm text-gray-500">
          この発注書を削除してもよろしいですか？この操作は取り消せません。
        </p>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="secondary"
            onClick={() => setIsDeleting(false)}
          >
            キャンセル
          </Button>
          <Button
            variant="danger"
            onClick={async () => {
              try {
                await purchaseOrdersApi.delete(id!);
                navigate('/purchase-orders');
              } catch (error) {
                console.error('Failed to delete purchase order:', error);
              }
            }}
          >
            削除
          </Button>
        </div>
      </Modal>
    </div>
  );
};