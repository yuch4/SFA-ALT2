import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Table } from '../../components/table';
import { Button } from '../../components/button';
import { Input, Select } from '../../components/form';
import { useData } from '../../hooks/useData';
import { purchaseOrdersApi } from '../../api/purchase-orders';
import { formatDate } from '../../utils/date';
import { CreatePurchaseOrderButton } from './components/create-purchase-order-button';

const STATUS_OPTIONS = [
  { value: '', label: 'すべてのステータス' },
  { value: 'draft', label: '下書き' },
  { value: 'sent', label: '送付済み' },
  { value: 'confirmed', label: '確認済み' },
  { value: 'completed', label: '完了' }
];

export const PurchaseOrderList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: purchaseOrders, loading, refetch } = useData({
    fetchFn: purchaseOrdersApi.getAll
  });

  const filteredPurchaseOrders = purchaseOrders?.filter(order => {
    const matchesSearch = 
      order.purchase_order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { header: '発注番号', accessor: 'purchase_order_number', sortable: true },
    { header: '仕入先', accessor: (row: any) => row.supplier?.name },
    { header: '発行日', accessor: (row: any) => formatDate(row.issue_date) },
    { header: '納期', accessor: (row: any) => row.delivery_date ? formatDate(row.delivery_date) : '-' },
    { header: '金額', accessor: (row: any) => `¥${row.total_amount.toLocaleString()}` },
    {
      header: 'ステータス',
      accessor: (row: any) => {
        const statusLabels = {
          draft: { label: '下書き', className: 'bg-gray-100 text-gray-800' },
          sent: { label: '送付済み', className: 'bg-blue-100 text-blue-800' },
          confirmed: { label: '確認済み', className: 'bg-green-100 text-green-800' },
          completed: { label: '完了', className: 'bg-purple-100 text-purple-800' }
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
        <h1 className="text-2xl font-semibold text-gray-900">発注一覧</h1>
        <CreatePurchaseOrderButton onSuccess={refetch} />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="発注番号、仕入先で検索..."
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
            data={filteredPurchaseOrders || []}
            columns={columns}
            onRowClick={(order) => navigate(`/purchase-orders/${order.id}`)}
          />
        )}
      </div>
    </div>
  );
};