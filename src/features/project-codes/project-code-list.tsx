import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Tag, Folder } from 'lucide-react';
import { Table } from '../../components/table';
import { Button } from '../../components/button';
import { Input } from '../../components/form';
import { Modal } from '../../components/modal';
import { Form, FormField } from '../../components/form';
import { useData } from '../../hooks/useData';
import { projectCodesApi, type ProjectCode, supabase } from '../../api/supabase';
import { formatDate } from '../../utils/date';

export const ProjectCodeList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const { data: projectCodes, loading } = useData<ProjectCode[]>({
    fetchFn: projectCodesApi.getAll
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error('User not authenticated');
      return;
    }

    const data = {
      code: formData.get('code') as string,
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      created_by: user.id
    };

    try {
      const newProjectCode = await projectCodesApi.create(data);
      setIsCreating(false);
      navigate(`/project-codes/${newProjectCode.id}`);
    } catch (error) {
      console.error('Failed to create project code:', error);
    }
  };

  const filteredProjectCodes = projectCodes?.filter(projectCode =>
    projectCode.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projectCode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projectCode.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      header: 'コード', 
      accessor: (row: ProjectCode) => (
        <div className="flex items-center space-x-1">
          <Tag className="w-4 h-4 text-gray-400" />
          <span>{row.code}</span>
        </div>
      ),
      sortable: true 
    },
    { header: 'プロジェクト名', accessor: 'name', sortable: true },
    { 
      header: 'カテゴリ', 
      accessor: (row: ProjectCode) => (
        <div className="flex items-center space-x-1">
          <Folder className="w-4 h-4 text-gray-400" />
          <span>{row.category || '-'}</span>
        </div>
      )
    },
    { header: '作成日', accessor: (row: ProjectCode) => formatDate(row.created_at) }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">プロジェクトコード一覧</h1>
        <Button
          onClick={() => setIsCreating(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          新規作成
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="コード、プロジェクト名、カテゴリで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center">読み込み中...</div>
        ) : (
          <Table
            data={filteredProjectCodes || []}
            columns={columns}
            onRowClick={(projectCode) => navigate(`/project-codes/${projectCode.id}`)}
          />
        )}
      </div>

      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="プロジェクトコードを作成"
      >
        <Form onSubmit={handleCreate}>
          <FormField label="プロジェクトコード" required>
            <Input
              name="code"
              required
              placeholder="例: PRJ001"
            />
          </FormField>

          <FormField label="プロジェクト名" required>
            <Input
              name="name"
              required
              placeholder="例: 新規システム開発"
            />
          </FormField>

          <FormField label="カテゴリ">
            <Input
              name="category"
              placeholder="例: 開発"
            />
          </FormField>

          <div className="mt-4 flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreating(false)}
            >
              キャンセル
            </Button>
            <Button type="submit">作成</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};