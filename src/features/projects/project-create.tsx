import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormField, Input, Select, TextArea } from '../../components/form';
import { Button } from '../../components/button';
import { useData } from '../../hooks/useData';
import { projectsApi, accountsApi, projectCodesApi } from '../../api/supabase';
import type { Account, ProjectCode } from '../../api/supabase';

const STATUS_OPTIONS = [
  { value: 'planning', label: '計画中' },
  { value: 'in_progress', label: '進行中' },
  { value: 'completed', label: '完了' },
  { value: 'suspended', label: '中断' }
];

export const ProjectCreate: React.FC = () => {
  const navigate = useNavigate();
  const { data: accounts } = useData<Account[]>({ fetchFn: accountsApi.getAll });
  const { data: projectCodes } = useData<ProjectCode[]>({ fetchFn: projectCodesApi.getAll });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const project = await projectsApi.create({
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        account_id: formData.get('account_id') as string,
        project_code_id: formData.get('project_code_id') as string || null,
        status: formData.get('status') as string,
        budget: Number(formData.get('budget')) || null,
        start_date: formData.get('start_date') as string,
        end_date: formData.get('end_date') as string
      });

      const createQuotation = formData.get('create_quotation') === 'true';
      if (createQuotation) {
        navigate(`/projects/${project.id}/quotations/new`);
      } else {
        navigate(`/projects/${project.id}`);
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">案件を作成</h1>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <Form onSubmit={handleSubmit}>
            <FormField label="案件名" required>
              <Input
                name="name"
                required
                placeholder="例: 新規システム開発"
              />
            </FormField>

            <FormField label="説明">
              <TextArea
                name="description"
                rows={4}
                placeholder="案件の詳細を入力してください"
              />
            </FormField>

            <FormField label="取引先" required>
              <Select
                name="account_id"
                required
                options={accounts?.map(account => ({
                  value: account.id,
                  label: account.name
                })) || []}
              />
            </FormField>

            <FormField label="プロジェクトコード">
              <Select
                name="project_code_id"
                options={[
                  { value: '', label: '選択してください' },
                  ...(projectCodes?.map(code => ({
                    value: code.id,
                    label: `${code.code} - ${code.name}`
                  })) || [])
                ]}
              />
            </FormField>

            <FormField label="ステータス" required>
              <Select
                name="status"
                options={STATUS_OPTIONS}
                required
              />
            </FormField>

            <FormField label="予算">
              <Input
                name="budget"
                type="number"
                min="0"
                placeholder="例: 1000000"
              />
            </FormField>

            <FormField label="開始日" required>
              <Input
                name="start_date"
                type="date"
                required
              />
            </FormField>

            <FormField label="終了予定日" required>
              <Input
                name="end_date"
                type="date"
                required
              />
            </FormField>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/projects')}
              >
                キャンセル
              </Button>
              <Button 
                type="submit"
                onClick={() => {
                  const form = document.querySelector('form');
                  if (form) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'create_quotation';
                    input.value = 'false';
                    form.appendChild(input);
                  }
                }}
              >
                作成
              </Button>
              <Button 
                type="submit"
                onClick={() => {
                  const form = document.querySelector('form');
                  if (form) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'create_quotation';
                    input.value = 'true';
                    form.appendChild(input);
                  }
                }}
              >
                作成して見積書を作成
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};