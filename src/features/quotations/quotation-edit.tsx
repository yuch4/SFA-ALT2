import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Form, FormField, Input, TextArea, Select } from '../../components/form';
import { Button } from '../../components/button';
import { useData } from '../../hooks/useData';
import { quotationsApi } from '../../api/quotations';
import { suppliersApi } from '../../api/suppliers';
import { ApprovalRequestModal } from '../approval-flows/components/approval-request-modal';
import { calculateAmount, calculateGrossProfit } from './utils/calculations';

export const QuotationEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const { data: quotation, loading: quotationLoading } = useData({
    fetchFn: () => quotationsApi.getById(id!),
    dependencies: [id]
  });

  const { data: suppliers } = useData({
    fetchFn: suppliersApi.getAll
  });

  useEffect(() => {
    const fetchItems = async () => {
      if (id) {
        try {
          const items = await quotationsApi.getItems(id);
          setItems(items || []);
        } catch (error) {
          console.error('Failed to fetch quotation items:', error);
        }
      }
    };
    fetchItems();
  }, [id]);

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index] };

    if (field === 'quantity' || field === 'unit_price' || field === 'cost_price') {
      const numValue = Number(value) || 0;
      item[field] = numValue;
      
      if (field === 'quantity' || field === 'unit_price') {
        item.amount = calculateAmount(
          field === 'quantity' ? numValue : item.quantity,
          field === 'unit_price' ? numValue : item.unit_price
        );
      }
      
      item.gross_profit = calculateGrossProfit(
        item.quantity,
        item.unit_price,
        field === 'cost_price' ? numValue : item.cost_price
      );
    } else if (field === 'supplier_id') {
      item[field] = value === '' ? null : value;
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
        supplier_id: null,
        cost_price: 0,
        gross_profit: 0,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, requestApproval = false) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      issue_date: formData.get('issue_date') as string,
      valid_until: formData.get('valid_until') as string,
      notes: formData.get('notes') as string,
      items
    };

    try {
      await quotationsApi.update(id!, data);
      if (requestApproval) {
        setIsApprovalModalOpen(true);
      } else {
        navigate(`/quotations/${id}`);
      }
    } catch (error) {
      console.error('Failed to update quotation:', error);
    }
  };

  const handleApprovalRequest = async (flowId: string, comment?: string) => {
    try {
      await quotationsApi.requestApproval(id!, flowId, comment);
      navigate(`/quotations/${id}`);
    } catch (error) {
      console.error('Failed to request approval:', error);
    }
  };

  if (quotationLoading) {
    return <div>読み込み中...</div>;
  }

  if (!quotation) {
    return <div>見積書が見つかりません</div>;
  }

  // 承認状態に応じてボタンを制御
  const renderActionButtons = () => {
    switch (quotation.approval_status) {
      case 'draft':
        return (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/quotations/${id}`)}
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
          </>
        );
      case 'rejected':
        return (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/quotations/${id}`)}
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
              再申請
            </Button>
          </>
        );
      default:
        return (
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(`/quotations/${id}`)}
            >
              戻る
            </Button>
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">見積書を編集</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField label="発行日" required>
                <Input
                  name="issue_date"
                  type="date"
                  defaultValue={quotation.issue_date.split('T')[0]}
                  required
                  disabled={quotation.approval_status !== 'draft' && quotation.approval_status !== 'rejected'}
                />
              </FormField>

              <FormField label="有効期限" required>
                <Input
                  name="valid_until"
                  type="date"
                  defaultValue={quotation.valid_until.split('T')[0]}
                  required
                  disabled={quotation.approval_status !== 'draft' && quotation.approval_status !== 'rejected'}
                />
              </FormField>
            </div>

            <FormField label="備考">
              <TextArea
                name="notes"
                rows={4}
                defaultValue={quotation.notes || ''}
                disabled={quotation.approval_status !== 'draft' && quotation.approval_status !== 'rejected'}
              />
            </FormField>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">見積明細</h3>
                {(quotation.approval_status === 'draft' || quotation.approval_status === 'rejected') && (
                  <Button
                    type="button"
                    onClick={addItem}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    項目を追加
                  </Button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内容</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">仕入先</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">仕入単価</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">仕入金額</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">販売単価</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">販売金額</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">粗利</th>
                      {(quotation.approval_status === 'draft' || quotation.approval_status === 'rejected') && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            disabled={quotation.approval_status !== 'draft' && quotation.approval_status !== 'rejected'}
                            required
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Select
                            value={item.supplier_id || ''}
                            onChange={(e) => handleItemChange(index, 'supplier_id', e.target.value)}
                            disabled={quotation.approval_status !== 'draft' && quotation.approval_status !== 'rejected'}
                            options={[
                              { value: '', label: '選択してください' },
                              ...(suppliers?.map(supplier => ({
                                value: supplier.id,
                                label: supplier.name
                              })) || [])
                            ]}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                            disabled={quotation.approval_status !== 'draft' && quotation.approval_status !== 'rejected'}
                            required
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            min="0"
                            value={item.cost_price}
                            onChange={(e) => handleItemChange(index, 'cost_price', e.target.value)}
                            disabled={quotation.approval_status !== 'draft' && quotation.approval_status !== 'rejected'}
                            required
                          />
                        </td>
                        <td className="px-6 py-4">
                          ¥{(item.quantity * item.cost_price).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            min="0"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                            disabled={quotation.approval_status !== 'draft' && quotation.approval_status !== 'rejected'}
                            required
                          />
                        </td>
                        <td className="px-6 py-4">
                          ¥{item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          ¥{item.gross_profit.toLocaleString()}
                        </td>
                        {(quotation.approval_status === 'draft' || quotation.approval_status === 'rejected') && (
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
                        )}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-6 py-4 text-right font-medium">合計</td>
                      <td className="px-6 py-4 font-medium">
                        ¥{items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ¥{items.reduce((sum, item) => sum + item.gross_profit, 0).toLocaleString()}
                      </td>
                      {(quotation.approval_status === 'draft' || quotation.approval_status === 'rejected') && (
                        <td></td>
                      )}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              {renderActionButtons()}
            </div>
          </Form>
        </div>
      </div>

      <ApprovalRequestModal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        onSubmit={handleApprovalRequest}
        targetType="quotation"
      />
    </div>
  );
};