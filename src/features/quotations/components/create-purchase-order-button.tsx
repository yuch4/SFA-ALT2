import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../../../components/button';
import { Modal } from '../../../components/modal';
import { Form, FormField, Select } from '../../../components/form';
import { useData } from '../../../hooks/useData';
import { suppliersApi } from '../../../api/suppliers';
import { purchaseOrdersApi } from '../../../api/purchase-orders';
import type { QuotationItem } from '../../../api/quotations';

interface CreatePurchaseOrderButtonProps {
  quotationId: string;
  items: QuotationItem[];
  onSuccess: () => void;
}

export const CreatePurchaseOrderButton: React.FC<CreatePurchaseOrderButtonProps> = ({
  quotationId,
  items,
  onSuccess
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data: suppliers } = useData({
    fetchFn: suppliersApi.getAll
  });

  // 見積明細に含まれる仕入先のみを表示
  const availableSuppliers = suppliers?.filter(supplier =>
    items.some(item => item.supplier_id === supplier.id)
  ) || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const supplierId = formData.get('supplier_id') as string;

    try {
      setLoading(true);
      await purchaseOrdersApi.createFromQuotation(quotationId, supplierId);
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Failed to create purchase order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (availableSuppliers.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        icon={<ShoppingCart className="w-4 h-4" />}
      >
        発注書を作成
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="発注書を作成"
      >
        <Form onSubmit={handleSubmit}>
          <FormField label="仕入先" required>
            <Select
              name="supplier_id"
              required
              options={[
                { value: '', label: '選択してください' },
                ...availableSuppliers.map(supplier => ({
                  value: supplier.id,
                  label: supplier.name
                }))
              ]}
            />
          </FormField>

          <div className="mt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              作成
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};