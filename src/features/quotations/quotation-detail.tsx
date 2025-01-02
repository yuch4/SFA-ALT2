import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from '../../components/modal';
import { Button } from '../../components/button';
import { useData } from '../../hooks/useData';
import { quotationsApi } from '../../api/quotations';
import { QuotationHeader } from './components/quotation-header';
import { QuotationInfo } from './components/quotation-info';
import { QuotationItems } from './components/quotation-items';
import { QuotationHistory } from './quotation-history';
import { CreatePurchaseOrderButton } from './components/create-purchase-order-button';

export const QuotationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: quotation, loading, refetch } = useData({
    fetchFn: () => quotationsApi.getById(id!),
    dependencies: [id]
  });

  const { data: items } = useData({
    fetchFn: () => quotationsApi.getItems(id!),
    dependencies: [id]
  });

  const handleApprove = async (comment?: string) => {
    try {
      await quotationsApi.approve(id!, comment);
      refetch();
    } catch (error) {
      console.error('Failed to approve quotation:', error);
    }
  };

  const handleReject = async (comment?: string) => {
    try {
      await quotationsApi.reject(id!, comment);
      refetch();
    } catch (error) {
      console.error('Failed to reject quotation:', error);
    }
  };

  if (loading || !quotation) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <QuotationHeader
          quotation={quotation}
          onEdit={() => navigate(`/quotations/${id}/edit`)}
          onDelete={() => setIsDeleting(true)}
          onBack={() => navigate(-1)}
        />
        {items && (
          <CreatePurchaseOrderButton
            quotationId={id!}
            items={items}
            onSuccess={() => {
              refetch();
              navigate('/purchase-orders');
            }}
          />
        )}
      </div>

      <QuotationInfo
        quotation={quotation}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {items && <QuotationItems items={items} />}

      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="見積書を削除"
      >
        <p className="text-sm text-gray-500">
          この見積書を削除してもよろしいですか？この操作は取り消せません。
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
                await quotationsApi.delete(id!);
                navigate('/quotations');
              } catch (error) {
                console.error('Failed to delete quotation:', error);
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