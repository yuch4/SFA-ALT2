import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../../components/button';
import { Form, FormField, Input, TextArea } from '../../components/form';
import { Modal } from '../../components/modal';
import { useData } from '../../hooks/useData';
import { suppliersApi, type Supplier } from '../../api/supabase';

export const SupplierDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: supplier, loading } = useData<Supplier>({
    fetchFn: () => suppliersApi.getById(id!),
    dependencies: [id]
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      contact_person: formData.get('contact_person') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      payment_terms: formData.get('payment_terms') as string,
      notes: formData.get('notes') as string
    };

    try {
      await suppliersApi.update(id!, data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update supplier:', error);
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!supplier) {
    return <div>仕入先が見つかりません</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/suppliers')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            戻る
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">{supplier.name}</h1>
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
              <dt className="text-sm font-medium text-gray-500">仕入先名</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Building2 className="w-4 h-4 text-gray-400 mr-1" />
                {supplier.name}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">仕入先コード</dt>
              <dd className="mt-1 text-sm text-gray-900">{supplier.code || '-'}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">担当者</dt>
              <dd className="mt-1 text-sm text-gray-900">{supplier.contact_person || '-'}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">電話番号</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-1" />
                {supplier.phone || '-'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Mail className="w-4 h-4 text-gray-400 mr-1" />
                {supplier.email || '-'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">住所</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                {supplier.address || '-'}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">支払条件</dt>
              <dd className="mt-1 text-sm text-gray-900">{supplier.payment_terms || '-'}</dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">備考</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {supplier.notes || '-'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="仕入先を編集"
      >
        <Form onSubmit={handleSubmit}>
          <FormField label="仕入先名" required>
            <Input
              name="name"
              defaultValue={supplier.name}
              required
            />
          </FormField>

          <FormField label="仕入先コード">
            <Input
              name="code"
              defaultValue={supplier.code || ''}
            />
          </FormField>

          <FormField label="担当者">
            <Input
              name="contact_person"
              defaultValue={supplier.contact_person || ''}
            />
          </FormField>

          <FormField label="電話番号">
            <Input
              name="phone"
              type="tel"
              defaultValue={supplier.phone || ''}
            />
          </FormField>

          <FormField label="メールアドレス">
            <Input
              name="email"
              type="email"
              defaultValue={supplier.email || ''}
            />
          </FormField>

          <FormField label="住所">
            <Input
              name="address"
              defaultValue={supplier.address || ''}
            />
          </FormField>

          <FormField label="支払条件">
            <Input
              name="payment_terms"
              defaultValue={supplier.payment_terms || ''}
            />
          </FormField>

          <FormField label="備考">
            <TextArea
              name="notes"
              defaultValue={supplier.notes || ''}
              rows={4}
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
        title="仕入先を削除"
      >
        <p className="text-sm text-gray-500">
          この仕入先を削除してもよろしいですか？この操作は取り消せません。
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
                await suppliersApi.delete(id!);
                navigate('/suppliers');
              } catch (error) {
                console.error('Failed to delete supplier:', error);
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