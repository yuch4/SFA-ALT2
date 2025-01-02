import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building, Phone, Mail } from 'lucide-react';
import { Table } from '../../components/table';
import { Button } from '../../components/button';
import { Input } from '../../components/form';
import { useData } from '../../hooks/useData';
import { suppliersApi, type Supplier } from '../../api/supabase';
import { formatDate } from '../../utils/date';

export const SupplierList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: suppliers, loading } = useData<Supplier[]>({
    fetchFn: suppliersApi.getAll
  });

  const filteredSuppliers = suppliers?.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: '仕入先名', accessor: 'name', sortable: true },
    { header: '仕入先コード', accessor: 'code', sortable: true },
    { 
      header: '担当者', 
      accessor: (row: Supplier) => (
        <div className="flex items-center space-x-1">
          <Building className="w-4 h-4 text-gray-400" />
          <span>{row.contact_person || '-'}</span>
        </div>
      )
    },
    { 
      header: '電話番号', 
      accessor: (row: Supplier) => (
        <div className="flex items-center space-x-1">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{row.phone || '-'}</span>
        </div>
      )
    },
    { 
      header: 'メール', 
      accessor: (row: Supplier) => (
        <div className="flex items-center space-x-1">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>{row.email || '-'}</span>
        </div>
      )
    },
    { header: '登録日', accessor: (row: Supplier) => formatDate(row.created_at) }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">仕入先一覧</h1>
        <Button
          onClick={() => navigate('/suppliers/new')}
          icon={<Plus className="w-4 h-4" />}
        >
          新規登録
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="max-w-md">
            <Input
              type="text"
              placeholder="仕入先名、コード、担当者で検索..."
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
            data={filteredSuppliers || []}
            columns={columns}
            onRowClick={(supplier) => navigate(`/suppliers/${supplier.id}`)}
          />
        )}
      </div>
    </div>
  );
};