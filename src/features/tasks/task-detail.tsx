import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import { Button } from '../../components/button';
import { Form, FormField, Input, Select, TextArea } from '../../components/form';
import { Modal } from '../../components/modal';
import { useData } from '../../hooks/useData';
import { tasksApi, type Task } from '../../api/supabase';
import { formatDate } from '../../utils/date';

const PRIORITY_OPTIONS = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' }
];

const STATUS_OPTIONS = [
  { value: 'not_started', label: '未着手' },
  { value: 'in_progress', label: '進行中' },
  { value: 'completed', label: '完了' }
];

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: task, loading } = useData<Task>({
    fetchFn: () => tasksApi.getById(id!),
    dependencies: [id]
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: formData.get('status') as string,
      priority: formData.get('priority') as string,
      due_date: formData.get('due_date') as string
    };

    try {
      await tasksApi.update(id!, data);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  if (loading) {
    return <div>読み込み中...</div>;
  }

  if (!task) {
    return <div>タスクが見つかりません</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/tasks')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            戻る
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">{task.title}</h1>
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
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">タイトル</dt>
              <dd className="mt-1 text-sm text-gray-900">{task.title}</dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">説明</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {task.description || '-'}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">ステータス</dt>
              <dd className="mt-1">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${task.status === 'not_started' ? 'bg-gray-100 text-gray-800' : ''}
                  ${task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
                  ${task.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                `}>
                  {STATUS_OPTIONS.find(opt => opt.value === task.status)?.label || task.status}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">優先度</dt>
              <dd className="mt-1">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${task.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                  ${task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${task.priority === 'low' ? 'bg-green-100 text-green-800' : ''}
                `}>
                  {PRIORITY_OPTIONS.find(opt => opt.value === task.priority)?.label || task.priority}
                </span>
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">期限</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                {formatDate(task.due_date)}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500">作成日</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-1" />
                {formatDate(task.created_at)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title="タスクを編集"
      >
        <Form onSubmit={handleSubmit}>
          <FormField label="タイトル" required>
            <Input
              name="title"
              defaultValue={task.title}
              required
            />
          </FormField>
          
          <FormField label="説明">
            <TextArea
              name="description"
              defaultValue={task.description || ''}
              rows={4}
            />
          </FormField>

          <FormField label="ステータス" required>
            <Select
              name="status"
              options={STATUS_OPTIONS}
              defaultValue={task.status}
              required
            />
          </FormField>

          <FormField label="優先度" required>
            <Select
              name="priority"
              options={PRIORITY_OPTIONS}
              defaultValue={task.priority}
              required
            />
          </FormField>

          <FormField label="期限">
            <Input
              name="due_date"
              type="date"
              defaultValue={task.due_date?.split('T')[0]}
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
        title="タスクを削除"
      >
        <p className="text-sm text-gray-500">
          このタスクを削除してもよろしいですか？この操作は取り消せません。
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
                await tasksApi.delete(id!);
                navigate('/tasks');
              } catch (error) {
                console.error('Failed to delete task:', error);
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