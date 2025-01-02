import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Calendar } from 'lucide-react';
import { Table } from '../../components/table';
import { Button } from '../../components/button';
import { Input, Select } from '../../components/form';
import { useData } from '../../hooks/useData';
import { quotationsApi } from '../../api/quotations';
import { formatDate } from '../../utils/date';

const STATUS_OPTIONS = [
  { value: '', label: 'すべてのステータス' },
  { value: 'draft', label: '下書き' },
  { value: 'sent', label: '送付済み' },
  { value: 'approved', label: '承認済み' },
  { value: 'rejected', label: '却下' }
];

export const QuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: quotations, loading } = useData({
    fetchFn: quotationsApi.getAll
  });

  const filteredQuotations = quotations?.filter(quotation => {
    const matchesSearch = quotation.quotation_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { 
      header: '見積番号', 
      accessor: (row: any) => (
        <div className="flex items-center space-x-1">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>{row.quotation_number}</span>
        </div>
      ),
      sortable: true 
    },
    {
      header: '案件名',
      accessor: (row: any) => row.project?.name || '-'
    },
    { 
      header: '発行日', 
      accessor: (row: any) => (
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(row.issue_date)}</span>
        </div>
      )
    },
    { 
      header: '有効期限', 
      accessor: (row: any) => formatDate(row.valid_until)
    },
    { 
      header: '金額', 
      accessor: (row: any) => 
        `¥${row.total_amount.toLocaleString()}`
    },
    {
      header: 'ステータス',
      accessor: (row: any) => {
        const statusLabels = {
          draft: { label: '下書き', className: 'bg-gray-100 text-gray-800' },
          sent: { label: '送付済み', className: 'bg-blue-100 text-blue-800' },
          approved: { label: '承認済み', className: 'bg-green-100 text-green-800' },
          rejected: { label: '却下', className: 'bg-red-100 text-red-800' }
        };
        const status = statusLabels[row.status as keyof typeof statusLabels] || {
          label: row.status,
          className: 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${status.className}
          `}>
            {status.label}
          </span>
        );
      }
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">見積一覧</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="見積番号で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={STATUS_OPTIONS}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center">読み込み中...</div>
        ) : (
          <Table
            data={filteredQuotations || []}
            columns={columns}
            onRowClick={(quotation) => navigate(`/quotations/${quotation.id}`)}
          />
        )}
      </div>
    </div>
  );
};