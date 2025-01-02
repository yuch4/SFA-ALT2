import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Table } from '../../components/table';
import { Button } from '../../components/button';
import { Input } from '../../components/form';
import { useData } from '../../hooks/useData';
import { accountsApi, type Account } from '../../api/supabase';
import { formatDate } from '../../utils/date';

export const AccountList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: accounts, loading } = useData<Account[]>({
    fetchFn: accountsApi.getAll
  });

  const filteredAccounts = accounts?.filter(account =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: '取引先名', accessor: 'name', sortable: true },
    { header: '業種', accessor: 'industry', sortable: true },
    { header: '年間売上', accessor: (row: Account) => 
      row.annual_revenue ? `¥${row.annual_revenue.toLocaleString()}` : '-'
    },
    { header: '従業員数', accessor: 'employee_count' },
    { header: '作成日', accessor: (row: Account) => formatDate(row.created_at) }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">取引先一覧</h1>
        <Button
          onClick={() => navigate('/accounts/new')}
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
              placeholder="取引先名や業種で検索..."
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
            data={filteredAccounts || []}
            columns={columns}
            onRowClick={(account) => navigate(`/accounts/${account.id}`)}
          />
        )}
      </div>
    </div>
  );
};