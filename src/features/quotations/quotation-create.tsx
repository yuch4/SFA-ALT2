import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { Form, FormField, Input, TextArea, Select } from '../../components/form';
import { Button } from '../../components/button';
import { useData } from '../../hooks/useData';
import { quotationsApi } from '../../api/quotations';
import { suppliersApi, type Supplier } from '../../api/suppliers';
import { projectsApi, type Project } from '../../api/projects';

interface QuotationItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  supplier_id: string | null;
  cost_price: number;
  gross_profit: number;
  sort_order: number;
}

export const QuotationCreate: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [quotationNumber, setQuotationNumber] = useState('');
  const [items, setItems] = useState<QuotationItem[]>([{
    description: '',
    quantity: 1,
    unit_price: 0,
    amount: 0,
    supplier_id: null,
    cost_price: 0,
    gross_profit: 0,
    sort_order: 0
  }]);

  const { data: project } = useData<Project>({
    fetchFn: () => projectsApi.getById(projectId!),
    dependencies: [projectId]
  });

  const { data: suppliers } = useData<Supplier[]>({
    fetchFn: suppliersApi.getAll
  });

  useEffect(() => {
    const generateNumber = async () => {
      try {
        const number = await quotationsApi.generateQuotationNumber();
        setQuotationNumber(number);
      } catch (error) {
        console.error('Failed to generate quotation number:', error);
      }
    };
    generateNumber();
  }, []);

  const calculateAmount = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  const calculateGrossProfit = (quantity: number, unitPrice: number, costPrice: number) => {
    const amount = calculateAmount(quantity, unitPrice);
    return amount - (quantity * costPrice);
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, value: string | number) => {
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
      item[field] = value as string;
    } else {
      item[field as 'description'] = value as string;
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

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const quotation = await quotationsApi.create({
        project_id: projectId!,
        quotation_number: quotationNumber,
        issue_date: formData.get('issue_date') as string,
        valid_until: formData.get('valid_until') as string,
        total_amount: getTotalAmount(),
        status: 'draft',
        notes: formData.get('notes') as string
      }, items);

      navigate(`/quotations/${quotation.id}`);
    } catch (error) {
      console.error('Failed to create quotation:', error);
    }
  };

  if (!project) {
    return <div>案件情報の読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">見積書を作成</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <Form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FormField label="案件名">
                <Input value={project.name} disabled />
              </FormField>

              <FormField label="見積番号">
                <Input value={quotationNumber} disabled />
              </FormField>

              <FormField label="発行日" required>
                <Input
                  name="issue_date"
                  type="date"
                  required
                />
              </FormField>

              <FormField label="有効期限" required>
                <Input
                  name="valid_until"
                  type="date"
                  required
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
                <h3 className="text-lg font-medium">見積項目</h3>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        内容
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        仕入先
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        数量
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        仕入単価
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        仕入金額
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        販売単価
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        販売金額
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        粗利
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            placeholder="項目の説明"
                            required
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Select
                            value={item.supplier_id || ''}
                            onChange={(e) => handleItemChange(index, 'supplier_id', e.target.value)}
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
                            required
                          />
                        </td>
                        <td className="px-6 py-4">
                          <Input
                            type="number"
                            min="0"
                            value={item.cost_price}
                            onChange={(e) => handleItemChange(index, 'cost_price', e.target.value)}
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
                            required
                          />
                        </td>
                        <td className="px-6 py-4">
                          ¥{item.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          ¥{item.gross_profit.toLocaleString()}
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
                      <td colSpan={6} className="px-6 py-4 text-right font-medium">
                        合計
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ¥{getTotalAmount().toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        ¥{items.reduce((sum, item) => sum + item.gross_profit, 0).toLocaleString()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/projects/${projectId}`)}
              >
                キャンセル
              </Button>
              <Button type="submit">
                作成
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};