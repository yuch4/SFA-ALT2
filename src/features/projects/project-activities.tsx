import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/button';
import { Modal } from '../../components/modal';
import { Form, FormField, Input, Select, TextArea } from '../../components/form';
import { ActivityTimeline } from '../../components/activity-timeline';
import { useData } from '../../hooks/useData';
import { projectsApi, type ProjectActivity } from '../../api/supabase';

const ACTIVITY_TYPES = [
  { value: 'note', label: 'メモ' },
  { value: 'document', label: '文書' },
  { value: 'issue', label: '課題' },
  { value: 'milestone', label: 'マイルストーン' }
];

interface ProjectActivitiesProps {
  projectId: string;
}

export const ProjectActivities: React.FC<ProjectActivitiesProps> = ({ projectId }) => {
  const [isCreating, setIsCreating] = useState(false);
  const { data: activities, loading } = useData<ProjectActivity[]>({
    fetchFn: () => projectsApi.getActivities(projectId),
    dependencies: [projectId]
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      project_id: projectId,
      type: formData.get('type') as string,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      created_by: 'auth.uid()'
    };

    try {
      await projectsApi.addActivity(data);
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create activity:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">活動履歴</h2>
        <Button
          onClick={() => setIsCreating(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          活動を記録
        </Button>
      </div>

      {loading ? (
        <div>読み込み中...</div>
      ) : (
        <ActivityTimeline activities={activities || []} />
      )}

      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="活動を記録"
      >
        <Form onSubmit={handleCreate}>
          <FormField label="種類" required>
            <Select
              name="type"
              options={ACTIVITY_TYPES}
              required
            />
          </FormField>

          <FormField label="タイトル" required>
            <Input
              name="title"
              required
              placeholder="例: 要件定義完了"
            />
          </FormField>

          <FormField label="詳細">
            <TextArea
              name="description"
              rows={4}
              placeholder="活動の詳細を入力してください"
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
            <Button type="submit">記録</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};