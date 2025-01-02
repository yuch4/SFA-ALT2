
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Table } from '../../components/table';
import { Button } from '../../components/button';
import { Input, Select } from '../../components/form';
import { useData } from '../../hooks/useData';
import { approvalFlowsApi } from '../../api/approval-flows';
import { CreateApprovalFlowModal } from './components/create-approval-flow-modal';
import { formatDate } from '../../utils/date';

const TARGET_TYPE_OPTIONS = [
  { value: '', label: 'すべての対象' },
  { value: 'quotation', label: '見積' },
  { value: 'purchase_order', label: '発注' }
];

export const ApprovalFlowList: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('');

  const { data: flows, loading, refetch } = useData({
    fetchFn: approvalFlowsApi.getAll
  });

  const filteredFlows = flows?.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !targetTypeFilter || flow.target_type === targetTypeFilter;
    return matchesSearch && matchesType;
  });

  const columns = [
    { header: 'フロー名', accessor: 'name', sortable: true },
    { 
      header: '対象',
      accessor: (row: any) => row.target_type === 'quotation' ? '見積' : '発注'
    },
    {
      header: 'ステップ数',
      accessor: (row: any) => row.steps.length
    },
    {
      header: 'ステータス',
      accessor: (row: any) => (
        <span className={`
          inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
        `}>
          {row.is_active ? '有効' : '無効'}
        </span>
      )
    },
    { header: '作成日', accessor: (row: any) => formatDate(row.created_at) }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">承認フロー一覧</h1>
        <Button
          onClick={() => setIsCreating(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          新規作成
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="フロー名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
            <Select
              value={targetTypeFilter}
              onChange={(e) => setTargetTypeFilter(e.target.value)}
              options={TARGET_TYPE_OPTIONS}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center">読み込み中...</div>
        ) : (
          <Table
            data={filteredFlows || []}
            columns={columns}
          />
        )}
      </div>

      <CreateApprovalFlowModal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        onSuccess={() => {
          setIsCreating(false);
          refetch();
        }}
      />
    </div>
  );
};