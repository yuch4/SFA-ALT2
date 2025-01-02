import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../components/button';
import { Form, FormField, Input, Select } from '../../components/form';
import { Modal } from '../../components/modal';
import { useData } from '../../hooks/useData';
import { accountsApi, type Account } from '../../api/supabase';

const INDUSTRY_OPTIONS = [
  { value: 'manufacturing', label: '製造業' },
  { value: 'retail', label: '小売業' },
  { value: 'service', label: 'サービス業' },
  { value: 'technology', label: 'テクノロジー' },
  { value: 'finance', label: '金融' },
  { value: 'other', label: 'その他' }
];

export const AccountDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: account, loading } = useData<Account>({
    fetchFn: () => accountsApi.getById(id!),
    dependencies: [id]
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      industry: formData.get('industry') as string,
      annual_revenue: Number(formData.get('annual_revenue')),
      employee_count: Number(formData.get('employee_count'))
    };

    try {
      await accountsApi.update(id!, data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update account:', error);
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!account) {
    return <div>取引先が見つかりません</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/accounts')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            戻る
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">{account.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => setIsEditing(true)}
            icon={<Edit2 className="w-4 h-4" />}
          >
            編集
          </Button>
          <Button
            variant="danger"
            onClick={() => setIsDeleting(true)}
            icon={<Trash2 className="w-4 h-4" />}
          >
            削除
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">取引先名</dt>
              <dd className="mt-1 text-sm text-gray-900">{account.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">業種</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {INDUSTRY_OPTIONS.find(opt => opt.value === account.industry)?.label || account.industry}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">年間売上</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {account.annual_revenue ? `¥${account.annual_revenue.toLocaleString()}` : '-'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">従業員数</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {account.employee_count ? `${account.employee_count.toLocaleString()}名` : '-'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="取引先を編集"
      >
        <Form onSubmit={handleSubmit}>
          <FormField label="取引先名" required>
            <Input
              name="name"
              defaultValue={account.name}
              required
            />
          </FormField>
          <FormField label="業種">
            <Select
              name="industry"
              options={INDUSTRY_OPTIONS}
              defaultValue={account.industry || ''}
            />
          </FormField>
          <FormField label="年間売上">
            <Input
              name="annual_revenue"
              type="number"
              defaultValue={account.annual_revenue || ''}
            />
          </FormField>
          <FormField label="従業員数">
            <Input
              name="employee_count"
              type="number"
              defaultValue={account.employee_count || ''}
            />
          </FormField>
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditing(false)}
            >
              キャンセル
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </Form>
      </Modal>

      <Modal
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title="取引先を削除"
      >
        <p className="text-sm text-gray-500">
          この取引先を削除してもよろしいですか？この操作は取り消せません。
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
                await accountsApi.delete(id!);
                navigate('/accounts');
              } catch (error) {
                console.error('Failed to delete account:', error);
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