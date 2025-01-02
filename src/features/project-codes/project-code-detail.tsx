import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Tag, Folder } from 'lucide-react';
import { Button } from '../../components/button';
import { Form, FormField, Input } from '../../components/form';
import { Modal } from '../../components/modal';
import { useData } from '../../hooks/useData';
import { projectCodesApi, type ProjectCode } from '../../api/supabase';

export const ProjectCodeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: projectCode, loading } = useData<ProjectCode>({
    fetchFn: () => projectCodesApi.getById(id!),
    dependencies: [id]
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      category: formData.get('category') as string
    };

    try {
      await projectCodesApi.update(id!, data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update project code:', error);
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!projectCode) {
    return <div>プロジェクトコードが見つかりません</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/project-codes')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            戻る
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">{projectCode.name}</h1>
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
              <dt className="text-sm font-medium text-gray-500">プロジェクトコード</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Tag className="w-4 h-4 text-gray-400 mr-1" />
                {projectCode.code}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">プロジェクト名</dt>
              <dd className="mt-1 text-sm text-gray-900">{projectCode.name}</dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">カテゴリ</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Folder className="w-4 h-4 text-gray-400 mr-1" />
                {projectCode.category || '-'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="プロジェクトコードを編集"
      >
        <Form onSubmit={handleSubmit}>
          <FormField label="プロジェクトコード" required>
            <Input
              name="code"
              defaultValue={projectCode.code}
              required
            />
          </FormField>

          <FormField label="プロジェクト名" required>
            <Input
              name="name"
              defaultValue={projectCode.name}
              required
            />
          </FormField>

          <FormField label="カテゴリ">
            <Input
              name="category"
              defaultValue={projectCode.category || ''}
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
        title="プロジェクトコードを削除"
      >
        <p className="text-sm text-gray-500">
          このプロジェクトコードを削除してもよろしいですか？この操作は取り消せません。
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
                await projectCodesApi.delete(id!);
                navigate('/project-codes');
              } catch (error) {
                console.error('Failed to delete project code:', error);
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