import React from 'react';
import { Card } from '../../components/card';
import { useAuth } from '../../hooks/useAuth';
import { useData } from '../../hooks/useData';

interface Project {}
interface Quotation {}
interface PurchaseOrder {}
interface Task {}

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const { data: projects } = useData<Project>({ table: 'projects' });
  const { data: quotations } = useData<Quotation>({ table: 'quotations' });
  const { data: purchaseOrders } = useData<PurchaseOrder>({ table: 'purchase_orders' });
  const { data: tasks } = useData<Task>({ table: 'tasks' });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 案件サマリー */}
        <Card title="案件">
          <div className="text-3xl font-bold">{projects.length || 0}</div>
          <div className="text-sm text-gray-500">進行中の案件</div>
        </Card>

        {/* 見積サマリー */}
        <Card title="見積">
          <div className="text-3xl font-bold">{quotations.length || 0}</div>
          <div className="text-sm text-gray-500">承認待ちの見積</div>
        </Card>

        {/* 発注サマリー */}
        <Card title="発注">
          <div className="text-3xl font-bold">{purchaseOrders.length || 0}</div>
          <div className="text-sm text-gray-500">承認待ちの発注</div>
        </Card>

        {/* タスクサマリー */}
        <Card title="タスク">
          <div className="text-3xl font-bold">{tasks.length || 0}</div>
          <div className="text-sm text-gray-500">未完了のタスク</div>
        </Card>
      </div>

      {/* 活動タイムライン */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">最近の活動</h2>
        {/* ActivityTimelineコンポーネントを追加予定 */}
      </div>
    </div>
  );
}; 