import React, { useState } from 'react';
import { Search, Shield } from 'lucide-react';
import { Table } from '../../components/table';
import { Input } from '../../components/form';
import { Modal } from '../../components/modal';
import { useData } from '../../hooks/useData';
import { supabase } from '../../api/supabase';
import { formatDate } from '../../utils/date';
import { UserRoles } from './user-roles';

interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

export const UserList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const { data: users, loading } = useData<User[]>({
    fetchFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const filteredUsers = users?.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: 'メールアドレス', accessor: 'email', sortable: true },
    { header: '名前', accessor: 'full_name' },
    { header: '登録日', accessor: (row: User) => formatDate(row.created_at) },
    {
      header: '権限',
      accessor: (row: User) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(row);
          }}
          className="inline-flex items-center px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <Shield className="w-4 h-4 mr-1" />
          権限を管理
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">ユーザー一覧</h1>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="メールアドレスまたは名前で検索..."
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
            data={filteredUsers || []}
            columns={columns}
          />
        )}
      </div>

      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="ユーザー権限の管理"
      >
        {selectedUser && (
          <UserRoles
            userId={selectedUser.id}
            userEmail={selectedUser.email}
          />
        )}
      </Modal>
    </div>
  );
};