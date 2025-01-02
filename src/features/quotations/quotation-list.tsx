import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar } from 'lucide-react';
import { Table } from '../../components/table';
import { formatDate } from '../../utils/date';
import { useData } from '../../hooks/useData';
import { quotationsApi, type Quotation } from '../../api/quotations';

interface QuotationListProps {
  projectId?: string;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  draft: { label: '下書き', className: 'bg-gray-100 text-gray-800' },
  sent: { label: '送付済み', className: 'bg-blue-100 text-blue-800' },
  approved: { label: '承認済み', className: 'bg-green-100 text-green-800' },
  rejected: { label: '却下', className: 'bg-red-100 text-red-800' }
};

export const QuotationList: React.FC<QuotationListProps> = ({ projectId }) => {
  const navigate = useNavigate();
  
  const { data: quotations, loading } = useData<Quotation[]>({
    fetchFn: () => projectId ? quotationsApi.getByProject(projectId) : quotationsApi.getAll(),
    dependencies: [projectId]
  });

  const columns = [
    { 
      header: '見積番号', 
      accessor: (row: Quotation) => (
        <div className="flex items-center space-x-1">
          <FileText className="w-4 h-4 text-gray-400" />
          <span>{row.quotation_number}</span>
        </div>
      ),
      sortable: true 
    },
    { 
      header: '発行日', 
      accessor: (row: Quotation) => (
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(row.issue_date)}</span>
        </div>
      )
    },
    { 
      header: '有効期限', 
      accessor: (row: Quotation) => formatDate(row.valid_until)
    },
    { 
      header: '金額', 
      accessor: (row: Quotation) => 
        `¥${row.total_amount.toLocaleString()}`
    },
    {
      header: 'ステータス',
      accessor: (row: Quotation) => {
        const status = STATUS_LABELS[row.status] || { 
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

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <Table
      data={quotations || []}
      columns={columns}
      onRowClick={(quotation) => navigate(`/quotations/${quotation.id}`)}
    />
  );
};