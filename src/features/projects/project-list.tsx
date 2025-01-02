import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, Building2 } from 'lucide-react';
import { Table } from '../../components/table';
import { Button } from '../../components/button';
import { Input, Select } from '../../components/form';
import { useData } from '../../hooks/useData';
import { projectsApi, type Project } from '../../api/supabase';
import { formatDate } from '../../utils/date';

const STATUS_OPTIONS = [
  { value: 'planning', label: '計画中' },
  { value: 'in_progress', label: '進行中' },
  { value: 'completed', label: '完了' },
  { value: 'suspended', label: '中断' }
];

export const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: projects, loading } = useData<Project[]>({
    fetchFn: projectsApi.getAll
  });

  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { 
      header: '案件名', 
      accessor: 'name',
      sortable: true 
    },
    { 
      header: '取引先', 
      accessor: (row: Project) => (
        <div className="flex items-center space-x-1">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span>{row.accounts?.name}</span>
        </div>
      )
    },
    { 
      header: 'ステータス', 
      accessor: (row: Project) => {
        const status = STATUS_OPTIONS.find(opt => opt.value === row.status);
        return (
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${row.status === 'planning' ? 'bg-gray-100 text-gray-800' : ''}
            ${row.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
            ${row.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
            ${row.status === 'suspended' ? 'bg-red-100 text-red-800' : ''}
          `}>
            {status?.label || row.status}
          </span>
        );
      }
    },
    { 
      header: '予算', 
      accessor: (row: Project) => 
        row.budget ? `¥${row.budget.toLocaleString()}` : '-',
      sortable: true
    },
    { 
      header: '開始日', 
      accessor: (row: Project) => (
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(row.start_date)}</span>
        </div>
      ),
      sortable: true
    },
    { 
      header: '終了予定日', 
      accessor: (row: Project) => (
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(row.end_date)}</span>
        </div>
      ),
      sortable: true
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">案件一覧</h1>
        <Button
          onClick={() => navigate('/projects/new')}
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
              placeholder="案件名で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: '', label: 'すべてのステータス' },
                ...STATUS_OPTIONS
              ]}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center">読み込み中...</div>
        ) : (
          <Table
            data={filteredProjects || []}
            columns={columns}
            onRowClick={(project) => navigate(`/projects/${project.id}`)}
          />
        )}
      </div>
    </div>
  );
};