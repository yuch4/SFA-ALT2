import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Building2, Calendar, Tag } from 'lucide-react';
import { Button } from '../../components/button';
import { Form, FormField, Input, Select, TextArea } from '../../components/form';
import { Modal } from '../../components/modal';
import { useData } from '../../hooks/useData';
import { projectsApi, type Project } from '../../api/supabase';
import { formatDate } from '../../utils/date';
import { ProjectActivities } from './project-activities';
import { QuotationList } from '../quotations/quotation-list';

const STATUS_OPTIONS = [
  { value: 'planning', label: '計画中' },
  { value: 'in_progress', label: '進行中' },
  { value: 'completed', label: '完了' },
  { value: 'suspended', label: '中断' }
];

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: project, loading } = useData<Project>({
    fetchFn: () => projectsApi.getById(id!),
    dependencies: [id]
  });

  // ... 既存のコード ...

  return (
    <div className="space-y-6">
      {/* 既存のヘッダー部分 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/projects')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            戻る
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">{project?.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => navigate(`/projects/${id}/quotations/new`)}
          >
            見積書を作成
          </Button>
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

      {/* 案件詳細カード */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            {/* ... 既存の案件詳細フィールド ... */}
          </dl>
        </div>
      </div>

      {/* 見積一覧セクション */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium mb-4">見積一覧</h2>
          <QuotationList projectId={id} />
        </div>
      </div>

      {/* 活動履歴セクション */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ProjectActivities projectId={id!} />
        </div>
      </div>

      {/* ... 既存のモーダル ... */}
    </div>
  );
};