
import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../../components/modal';
import { Form, FormField, Input, Select, TextArea } from '../../../components/form';
import { Button } from '../../../components/button';
import { useData } from '../../../hooks/useData';
import { rolesApi } from '../../../api/roles';
import { approvalFlowsApi } from '../../../api/approval-flows';

interface CreateApprovalFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateApprovalFlowModal: React.FC<CreateApprovalFlowModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([{
    step: 1,
    role_id: '',
    required_count: 1
  }]);

  const { data: roles } = useData({
    fetchFn: rolesApi.getAll
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      setLoading(true);
      await approvalFlowsApi.create({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        target_type: formData.get('target_type') as 'quotation' | 'purchase_order',
        steps: steps.map((step, index) => ({
          ...step,
          step: index + 1
        }))
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to create approval flow:', error);
    } finally {
      setLoading(false);
    }
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        step: steps.length + 1,
        role_id: '',
        required_count: 1
      }
    ]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      const newSteps = steps.filter((_, i) => i !== index);
      setSteps(newSteps);
    }
  };

  const handleStepChange = (index: number, field: string, value: string | number) => {
    const newSteps = [...steps];
    const step = { ...newSteps[index] };

    if (field === 'required_count') {
      step[field] = Number(value) || 1;
    } else {
      step[field as 'role_id'] = value;
    }

    newSteps[index] = step;
    setSteps(newSteps);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="承認フローを作成"
    >
      <Form onSubmit={handleSubmit}>
        <FormField label="フロー名" required>
          <Input
            name="name"
            required
            placeholder="例: 見積承認フロー"
          />
        </FormField>

        <FormField label="説明">
          <TextArea
            name="description"
            rows={3}
            placeholder="承認フローの説明を入力してください"
          />
        </FormField>

        <FormField label="対象" required>
          <Select
            name="target_type"
            required
            options={[
              { value: '', label: '選択してください' },
              { value: 'quotation', label: '見積' },
              { value: 'purchase_order', label: '発注' }
            ]}
          />
        </FormField>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">承認ステップ</h3>
            <Button
              type="button"
              onClick={addStep}
              icon={<Plus className="w-4 h-4" />}
            >
              ステップを追加
            </Button>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-1">
                  <FormField label={`ステップ ${index + 1}`} required>
                    <Select
                      value={step.role_id}
                      onChange={(e) => handleStepChange(index, 'role_id', e.target.value)}
                      required
                      options={[
                        { value: '', label: '選択してください' },
                        ...(roles?.map(role => ({
                          value: role.id,
                          label: role.name
                        })) || [])
                      ]}
                    />
                  </FormField>
                </div>
                <div className="w-32">
                  <FormField label="必要承認数" required>
                    <Input
                      type="number"
                      min="1"
                      value={step.required_count}
                      onChange={(e) => handleStepChange(index, 'required_count', e.target.value)}
                      required
                    />
                  </FormField>
                </div>
                <div className="flex items-end pb-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => removeStep(index)}
                    disabled={steps.length === 1}
                    icon={<Trash2 className="w-4 h-4" />}
                  >
                    削除
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            キャンセル
          </Button>
          <Button
            type="submit"
            isLoading={loading}
          >
            作成
          </Button>
        </div>
      </Form>
    </Modal>
  );
};