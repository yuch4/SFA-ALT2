import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Calendar, Clock } from 'lucide-react';
import { Table } from '../../components/table';
import { Button } from '../../components/button';
import { Input, Select } from '../../components/form';
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

export const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const { data: tasks, loading } = useData<Task[]>({
    fetchFn: tasksApi.getAll
  });

  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const columns = [
    { 
      header: 'タイトル', 
      accessor: 'title',
      sortable: true 
    },
    { 
      header: '優先度', 
      accessor: (row: Task) => {
        const priority = PRIORITY_OPTIONS.find(opt => opt.value === row.priority);
        return (
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${row.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
            ${row.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
            ${row.priority === 'low' ? 'bg-green-100 text-green-800' : ''}
          `}>
            {priority?.label || row.priority}
          </span>
        );
      }
    },
    { 
      header: 'ステータス', 
      accessor: (row: Task) => {
        const status = STATUS_OPTIONS.find(opt => opt.value === row.status);
        return (
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${row.status === 'not_started' ? 'bg-gray-100 text-gray-800' : ''}
            ${row.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : ''}
            ${row.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
          `}>
            {status?.label || row.status}
          </span>
        );
      }
    },
    { 
      header: '期限', 
      accessor: (row: Task) => (
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(row.due_date)}</span>
        </div>
      ),
      sortable: true
    },
    { 
      header: '作成日', 
      accessor: (row: Task) => (
        <div className="flex items-center space-x-1">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{formatDate(row.created_at)}</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">タスク一覧</h1>
        <Button
          onClick={() => navigate('/tasks/new')}
          icon={<Plus className="w-4 h-4" />}
        >
          新規作成
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="text"
              placeholder="タイトルで検索..."
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
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              options={[
                { value: '', label: 'すべての優先度' },
                ...PRIORITY_OPTIONS
              ]}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center">読み込み中...</div>
        ) : (
          <Table
            data={filteredTasks || []}
            columns={columns}
            onRowClick={(task) => navigate(`/tasks/${task.id}`)}
          />
        )}
      </div>
    </div>
  );
};