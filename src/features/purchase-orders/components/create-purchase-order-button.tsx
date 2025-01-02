import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../../../components/button';
import { Modal } from '../../../components/modal';
import { Form, FormField, Input, Select, TextArea } from '../../../components/form';
import { useData } from '../../../hooks/useData';
import { suppliersApi } from '../../../api/suppliers';
import { purchaseOrdersApi } from '../../../api/purchase-orders';

interface CreatePurchaseOrderButtonProps {
  onSuccess: () => void;
}

export const CreatePurchaseOrderButton: React.FC<CreatePurchaseOrderButtonProps> = ({
  onSuccess
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([{
    description: '',
    quantity: 1,
    unit_price: 0,
    amount: 0,
    sort_order: 0
  }]);

  const { data: suppliers } = useData({
    fetchFn: suppliersApi.getAll
  });

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'quantity' || field === 'unit_price') {
      const numValue = Number(value) || 0;
      item[field] = numValue;
      item.amount = item.quantity * item.unit_price;
    } else {
      item[field as 'description'] = value;
    }

    newItems[index] = item;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        description: '',
        quantity: 1,
        unit_price: 0,
        amount: 0,
        sort_order: items.length
      }
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);
      await purchaseOrdersApi.create({
        supplier_id: formData.get('supplier_id') as string,
        issue_date: formData.get('issue_date') as string,
        delivery_date: formData.get('delivery_date') as string,
        notes: formData.get('notes') as string,
        items
      });
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Failed to create purchase order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        icon={<Plus className="w-4 h-4" />}
      >
        新規作成
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="発注書を作成"
      >
        <Form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField label="仕入先" required>
              <Select
                name="supplier_id"
                required
                options={[
                  { value: '', label: '選択してください' },
                  ...(suppliers?.map(supplier => ({
                    value: supplier.id,
                    label: supplier.name
                  })) || [])
                ]}
              />
            </FormField>

            <FormField label="発行日" required>
              <Input
                name="issue_date"
                type="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </FormField>

            <FormField label="納期">
              <Input
                name="delivery_date"
                type="date"
              />
            </FormField>
          </div>

          <FormField label="備考">
            <TextArea
              name="notes"
              rows={4}
            />
          </FormField>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">発注明細</h3>
              <Button
                type="button"
                onClick={addItem}
                icon={<Plus className="w-4 h-4" />}
              >
                項目を追加
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内容</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">単価</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">金額</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">
                        <Input
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-6 py-4">
                        <Input
                          type="number"
                          min="0"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                          required
                        />
                      </td>
                      <td className="px-6 py-4">
                        ¥{item.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          icon={<Trash2 className="w-4 h-4" />}
                        >
                          削除
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-6 py-4 text-right font-medium">合計</td>
                    <td className="px-6 py-4 font-medium">
                      ¥{items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

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