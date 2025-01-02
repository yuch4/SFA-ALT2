import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormField, Input, TextArea } from '../../components/form';
import { Button } from '../../components/button';
import { suppliersApi } from '../../api/suppliers';

export const SupplierCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const supplier = await suppliersApi.create({
        name: formData.get('name') as string,
        code: formData.get('code') as string,
        contact_person: formData.get('contact_person') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        payment_terms: formData.get('payment_terms') as string,
        notes: formData.get('notes') as string
      });

      navigate(`/suppliers/${supplier.id}`);
    } catch (error) {
      console.error('Failed to create supplier:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">仕入先を登録</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <Form onSubmit={handleSubmit}>
            <FormField label="仕入先名" required>
              <Input
                name="name"
                required
                placeholder="例: 株式会社サプライ"
              />
            </FormField>

            <FormField label="仕入先コード">
              <Input
                name="code"
                placeholder="例: SUP001"
              />
            </FormField>

            <FormField label="担当者">
              <Input
                name="contact_person"
                placeholder="例: 山田太郎"
              />
            </FormField>

            <FormField label="メールアドレス">
              <Input
                name="email"
                type="email"
                placeholder="例: yamada@example.com"
              />
            </FormField>

            <FormField label="電話番号">
              <Input
                name="phone"
                type="tel"
                placeholder="例: 03-1234-5678"
              />
            </FormField>

            <FormField label="住所">
              <Input
                name="address"
                placeholder="例: 東京都千代田区..."
              />
            </FormField>

            <FormField label="支払条件">
              <Input
                name="payment_terms"
                placeholder="例: 月末締め翌月末払い"
              />
            </FormField>

            <FormField label="備考">
              <TextArea
                name="notes"
                rows={4}
                placeholder="その他の情報を入力してください"
              />
            </FormField>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/suppliers')}
              >
                キャンセル
              </Button>
              <Button type="submit">
                登録
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};