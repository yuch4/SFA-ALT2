import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormField, Input, Select } from '../../components/form';
import { Button } from '../../components/button';
import { accountsApi } from '../../api/supabase';

const INDUSTRY_OPTIONS = [
  { value: 'manufacturing', label: '製造業' },
  { value: 'retail', label: '小売業' },
  { value: 'service', label: 'サービス業' },
  { value: 'technology', label: 'テクノロジー' },
  { value: 'finance', label: '金融' },
  { value: 'other', label: 'その他' }
];

export const AccountCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const account = await accountsApi.create({
        name: formData.get('name') as string,
        industry: formData.get('industry') as string,
        annual_revenue: Number(formData.get('annual_revenue')) || null,
        employee_count: Number(formData.get('employee_count')) || null
      });

      navigate(`/accounts/${account.id}`);
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">取引先を作成</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <Form onSubmit={handleSubmit}>
            <FormField label="取引先名" required>
              <Input
                name="name"
                required
                placeholder="例: 株式会社サンプル"
              />
            </FormField>

            <FormField label="業種">
              <Select
                name="industry"
                options={INDUSTRY_OPTIONS}
              />
            </FormField>

            <FormField label="年間売上">
              <Input
                name="annual_revenue"
                type="number"
                min="0"
                placeholder="例: 100000000"
              />
            </FormField>

            <FormField label="従業員数">
              <Input
                name="employee_count"
                type="number"
                min="0"
                placeholder="例: 100"
              />
            </FormField>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/accounts')}
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