import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Table } from '../../components/table';
import { Button } from '../../components/button';
import { Input } from '../../components/form';
import { useData } from '../../hooks/useData';
import { opportunitiesApi, type Opportunity } from '../../api/supabase';
import { formatDate } from '../../utils/date';

export const OpportunityList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: opportunities, loading } = useData<Opportunity[]>({
    fetchFn: opportunitiesApi.getAll
  });

  const filteredOpportunities = opportunities?.filter(opportunity =>
    opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opportunity.stage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: '商談名', accessor: 'name', sortable: true },
    { header: '取引先', accessor: (row: Opportunity) => row.accounts?.name },
    { header: '金額', accessor: (row: Opportunity) => 
      row.amount ? `¥${row.amount.toLocaleString()}` : '-'
    },
    { header: 'ステージ', accessor: 'stage' },
    { header: '確度', accessor: (row: Opportunity) => `${row.probability}%` },
    { header: '成約予定日', accessor: (row: Opportunity) => formatDate(row.close_date) }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">商談一覧</h1>
        <Button
          onClick={() => navigate('/opportunities/new')}
          icon={<Plus className="w-4 h-4" />}
        >
          新規作成
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="商談名やステージで検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4 text-gray-400" />}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-4 text-center">読み込み中...</div>
        ) : (
          <Table
            data={filteredOpportunities || []}
            columns={columns}
            onRowClick={(opportunity) => navigate(`/opportunities/${opportunity.id}`)}
          />
        )}
      </div>
    </div>
  );
};